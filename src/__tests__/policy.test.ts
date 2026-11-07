import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { evaluatePolicy, generateAgentKeyPair } from '../lib/near.ts';
import { formatYoctoToNear, getRpcUrl, MAINNET_RPC, TESTNET_RPC } from '../lib/near-rpc.ts';

describe('AgentGuard Cryptographic Policy Engine', () => {
  const allowedContracts = ['intents.near', 'wrap.testnet', 'guest-book.testnet', 'cloud-billing.testnet', 'rhea.testnet'];
  const singleTxCap = 3.0;
  const dailySpendCap = 15.0;
  const currentDailySpend = 2.0;

  it('should approve legitimate transactions within policy limits', () => {
    const result = evaluatePolicy(
      'cloud-billing.testnet',
      0.75,
      allowedContracts,
      singleTxCap,
      dailySpendCap,
      currentDailySpend
    );

    assert.equal(result.allowed, true);
    assert.equal(result.violations.length, 0);
  });

  it('should intercept and block transactions to non-whitelisted contracts', () => {
    const result = evaluatePolicy(
      'attacker-drainer.near',
      1.0,
      allowedContracts,
      singleTxCap,
      dailySpendCap,
      currentDailySpend
    );

    assert.equal(result.allowed, false);
    assert.ok(
      result.violations.some((v) => v.includes('not on the authorized whitelist')),
      'Should report whitelist violation'
    );
  });

  it('should intercept transactions exceeding single transaction velocity cap', () => {
    const result = evaluatePolicy(
      'cloud-billing.testnet',
      5.5, // exceeds 3.0 NEAR cap
      allowedContracts,
      singleTxCap,
      dailySpendCap,
      currentDailySpend
    );

    assert.equal(result.allowed, false);
    assert.ok(
      result.violations.some((v) => v.includes('exceeds the single transaction limit')),
      'Should report single tx cap violation'
    );
  });

  it('should intercept transactions exceeding 24h spending ceiling', () => {
    const result = evaluatePolicy(
      'cloud-billing.testnet',
      2.5,
      allowedContracts,
      singleTxCap,
      dailySpendCap,
      14.0 // 14.0 + 2.5 = 16.5 > 15.0 cap
    );

    assert.equal(result.allowed, false);
    assert.ok(
      result.violations.some((v) => v.includes('exceed the 24h spending ceiling')),
      'Should report daily ceiling violation'
    );
  });

  it('should generate valid ed25519 cryptographic keypairs for autonomous agents', () => {
    const keypair = generateAgentKeyPair();
    assert.ok(keypair.publicKey.startsWith('ed25519:'), 'Public key must start with ed25519:');
    assert.ok(keypair.secretKey.startsWith('ed25519:'), 'Secret key must start with ed25519:');
  });

  it('should accurately convert 24-decimal yoctoNEAR to human-readable NEAR', () => {
    const oneNearYocto = '1000000000000000000000000';
    assert.equal(formatYoctoToNear(oneNearYocto), 1.0);

    const fiveAndHalfNear = '5500000000000000000000000';
    assert.equal(formatYoctoToNear(fiveAndHalfNear), 5.5);

    assert.equal(formatYoctoToNear('0'), 0);
  });

  it('should automatically route .near accounts to Mainnet RPC and .testnet to Testnet RPC', () => {
    assert.equal(getRpcUrl('harshal0222.near'), MAINNET_RPC);
    assert.equal(getRpcUrl('guest-book.testnet'), TESTNET_RPC);
  });
});
