use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedSet};
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, require, AccountId, PanicOnDefault, PublicKey};

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct AgentPolicy {
    pub name: String,
    pub daily_allowance: U128,
    pub spent_today: U128,
    pub last_spend_timestamp: u64,
    pub allowed_contracts: Vec<AccountId>,
    pub is_active: bool,
    pub total_executions: u64,
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct PolicyCheckResult {
    pub allowed: bool,
    pub reason: String,
    pub current_spent: U128,
    pub daily_cap: U128,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct AgentGuard {
    pub admin_id: AccountId,
    pub daily_spend_cap: U128,
    pub single_tx_cap: U128,
    pub emergency_frozen: bool,
    pub whitelisted_contracts: UnorderedSet<AccountId>,
    pub agents: LookupMap<PublicKey, AgentPolicy>,
    pub total_blocked_attempts: u64,
}

#[near_bindgen]
impl AgentGuard {
    #[init]
    pub fn new(admin_id: AccountId, daily_spend_cap: U128, single_tx_cap: U128) -> Self {
        require!(!env::state_exists(), "Already initialized");
        Self {
            admin_id,
            daily_spend_cap,
            single_tx_cap,
            emergency_frozen: false,
            whitelisted_contracts: UnorderedSet::new(b"w"),
            agents: LookupMap::new(b"a"),
            total_blocked_attempts: 0,
        }
    }

    /// Admin can add an authorized contract to the whitelist
    pub fn add_whitelisted_contract(&mut self, contract_id: AccountId) {
        self.assert_admin();
        self.whitelisted_contracts.insert(&contract_id);
    }

    /// Admin can remove a contract from the whitelist
    pub fn remove_whitelisted_contract(&mut self, contract_id: AccountId) {
        self.assert_admin();
        self.whitelisted_contracts.remove(&contract_id);
    }

    /// Register a delegated AI agent with an ed25519 Function Call Key
    pub fn register_agent(
        &mut self,
        public_key: PublicKey,
        name: String,
        daily_allowance: U128,
        allowed_contracts: Vec<AccountId>,
    ) {
        self.assert_admin();
        let agent = AgentPolicy {
            name,
            daily_allowance,
            spent_today: U128(0),
            last_spend_timestamp: env::block_timestamp(),
            allowed_contracts,
            is_active: true,
            total_executions: 0,
        };
        self.agents.insert(&public_key, &agent);
    }

    /// Evaluates if an autonomous agent transaction is authorized under current human policies
    pub fn evaluate_execution(
        &mut self,
        agent_key: PublicKey,
        target_contract: AccountId,
        amount: U128,
    ) -> PolicyCheckResult {
        // Rule 1: Emergency freeze check
        if self.emergency_frozen {
            self.total_blocked_attempts += 1;
            return PolicyCheckResult {
                allowed: false,
                reason: "Emergency Freeze is active. All agent executions blocked.".to_string(),
                current_spent: U128(0),
                daily_cap: self.daily_spend_cap,
            };
        }

        // Rule 2: Global single transaction velocity cap
        if amount.0 > self.single_tx_cap.0 {
            self.total_blocked_attempts += 1;
            return PolicyCheckResult {
                allowed: false,
                reason: format!(
                    "Amount {} exceeds global single transaction cap of {}.",
                    amount.0, self.single_tx_cap.0
                ),
                current_spent: U128(0),
                daily_cap: self.daily_spend_cap,
            };
        }

        // Rule 3: Whitelisted contract check
        if !self.whitelisted_contracts.contains(&target_contract) {
            self.total_blocked_attempts += 1;
            return PolicyCheckResult {
                allowed: false,
                reason: format!("Contract '{}' is not on authorized whitelist.", target_contract),
                current_spent: U128(0),
                daily_cap: self.daily_spend_cap,
            };
        }

        // Rule 4: Agent state & allowance check
        let mut agent = self.agents.get(&agent_key).expect("Agent key not registered");
        if !agent.is_active {
            self.total_blocked_attempts += 1;
            return PolicyCheckResult {
                allowed: false,
                reason: "Agent key is paused or revoked.".to_string(),
                current_spent: agent.spent_today,
                daily_cap: agent.daily_allowance,
            };
        }

        // 24-hour spend reset window check (86,400,000,000,000 ns)
        let now = env::block_timestamp();
        if now.saturating_sub(agent.last_spend_timestamp) > 86_400_000_000_000 {
            agent.spent_today = U128(0);
            agent.last_spend_timestamp = now;
        }

        if agent.spent_today.0 + amount.0 > agent.daily_allowance.0 {
            self.total_blocked_attempts += 1;
            return PolicyCheckResult {
                allowed: false,
                reason: "Daily allowance exceeded for this agent.".to_string(),
                current_spent: agent.spent_today,
                daily_cap: agent.daily_allowance,
            };
        }

        // Policy passed: update state
        agent.spent_today = U128(agent.spent_today.0 + amount.0);
        agent.total_executions += 1;
        self.agents.insert(&agent_key, &agent);

        PolicyCheckResult {
            allowed: true,
            reason: "All cryptographic policy checks passed.".to_string(),
            current_spent: agent.spent_today,
            daily_cap: agent.daily_allowance,
        }
    }

    /// One-click Emergency Freeze toggle
    pub fn set_emergency_freeze(&mut self, freeze: bool) {
        self.assert_admin();
        self.emergency_frozen = freeze;
    }

    /// View all whitelisted contracts
    pub fn get_whitelisted_contracts(&self) -> Vec<AccountId> {
        self.whitelisted_contracts.to_vec()
    }

    /// Internal admin permission check
    fn assert_admin(&self) {
        require!(
            env::predecessor_account_id() == self.admin_id,
            "Only admin can call this method"
        );
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::testing_env;

    fn get_context(predecessor: AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder.predecessor_account_id(predecessor);
        builder
    }

    #[test]
    fn test_initialization_and_whitelist() {
        let admin: AccountId = "admin.near".parse().unwrap();
        let context = get_context(admin.clone());
        testing_env!(context.build());

        let mut contract = AgentGuard::new(admin, U128(15_000_000), U128(3_000_000));
        let whitelist_target: AccountId = "intents.near".parse().unwrap();

        contract.add_whitelisted_contract(whitelist_target.clone());
        assert!(contract.get_whitelisted_contracts().contains(&whitelist_target));
    }

    #[test]
    fn test_emergency_freeze() {
        let admin: AccountId = "admin.near".parse().unwrap();
        let context = get_context(admin.clone());
        testing_env!(context.build());

        let mut contract = AgentGuard::new(admin, U128(15_000_000), U128(3_000_000));
        contract.set_emergency_freeze(true);
        assert!(contract.emergency_frozen);
    }
}

