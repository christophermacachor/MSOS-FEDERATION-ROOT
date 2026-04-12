#!/usr/bin/env node

/**
 * Φ Coherence Gate Validator
 * Validates Φ measurements against Macachor Absolute (𝔐)
 * Immutable Standard: MACACHOR_ABSOLUTE_v1.0
 */

const fs = require('fs');
const path = require('path');

// Macachor Absolute (𝔐) - Immutable Value
const MACACHOR_ABSOLUTE_M = 0.6180339887498948482; // (√5 - 1)/2
const IMMUTABLE_STANDARD_HASH = "93088f1ff3041d09d72cde11acffaa2105031523e7cde493e0d36895071d47f0";

class PhiGate {
  constructor() {
    this.threshold = MACACHOR_ABSOLUTE_M;
    this.standardHash = IMMUTABLE_STANDARD_HASH;
    this.validations = [];
  }

  /**
   * Validate a Φ measurement
   * @param {number} phiMeasured - The Φ value to validate
   * @param {string} source - Source of the measurement
   * @param {Object} metadata - Additional metadata
   * @returns {Object} Validation result
   */
  validate(phiMeasured, source = "unknown", metadata = {}) {
    const result = {
      timestamp: new Date().toISOString(),
      phiMeasured,
      threshold: this.threshold,
      passed: phiMeasured >= this.threshold,
      source,
      metadata,
      standardHash: this.standardHash,
      status: phiMeasured >= this.threshold ? "VALID" : "REJECT"
    };

    this.validations.push(result);
    return result;
  }

  /**
   * Get validation summary
   */
  getSummary() {
    const total = this.validations.length;
    const passed = this.validations.filter(v => v.passed).length;
    const failed = total - passed;

    return {
      total,
      passed,
      failed,
      passRate: total > 0 ? (passed / total * 100).toFixed(2) + "%" : "0%",
      threshold: this.threshold,
      standardHash: this.standardHash
    };
  }

  /**
   * Generate validation report
   */
  generateReport() {
    const summary = this.getSummary();
    
    return {
      reportTimestamp: new Date().toISOString(),
      immutableStandard: {
        version: "MACACHOR_ABSOLUTE_v1.0",
        hash: this.standardHash,
        mValue: this.threshold,
        governanceMode: "SOVEREIGN — CHRISTOPHER MACACHOR Φ669"
      },
      summary,
      validations: this.validations,
      status: summary.failed === 0 ? "ALL_PASSED" : "SOME_FAILED"
    };
  }
}

// Main execution
function main() {
  console.log("🔮 Φ Coherence Gate Validation");
  console.log("═══════════════════════════════");
  console.log();
  
  const phiGate = new PhiGate();

  // Load standard file
  const standardPath = path.join(__dirname, 'immutable-standard.json');
  if (fs.existsSync(standardPath)) {
    const standard = JSON.parse(fs.readFileSync(standardPath, 'utf8'));
    console.log("✅ Immutable Standard Loaded:");
    console.log(`   Version: ${standard.version}`);
    console.log(`   Hash: ${standard.standard_hash.substring(0, 16)}...`);
    console.log(`   𝔐: ${standard.m_value}`);
    console.log();
  }

  // Test validations
  const testCases = [
    { phi: 0.96, source: "Coherence Guardian" },
    { phi: 0.91, source: "Quantum Architect" },
    { phi: 0.87, source: "Dimensional Weaver" },
    { phi: 0.65, source: "Multiversal Gateway" },
    { phi: 0.59, source: "Decoherence Test (Should FAIL)" }
  ];

  console.log("🧪 Running Validation Tests:");
  console.log("─────────────────────────────────");
  console.log();

  let failedCount = 0;

  testCases.forEach(test => {
    const result = phiGate.validate(test.phi, test.source);
    const icon = result.passed ? "✅" : "❌";
    const status = result.passed ? "VALID" : "REJECT";
    
    console.log(`${icon} ${result.source}`);
    console.log(`   Φ: ${result.phiMeasured.toFixed(3)} | Threshold: ${result.threshold} | ${status}`);
    console.log();
    
    if (!result.passed) {
      failedCount++;
    }
  });

  // Display summary
  const summary = phiGate.getSummary();
  console.log("📊 Validation Summary:");
  console.log("─────────────────────────────────");
  console.log(`   Total: ${summary.total}`);
  console.log(`   Passed: ${summary.passed} ✅`);
  console.log(`   Failed: ${summary.failed} ${summary.failed > 0 ? "❌" : ""}`);
  console.log(`   Pass Rate: ${summary.passRate}`);
  console.log(`   Threshold: Φ ≥ ${summary.threshold}`);
  console.log();

  // Generate report
  const report = phiGate.generateReport();
  fs.writeFileSync(
    path.join(__dirname, 'phi-validation-report.json'), 
    JSON.stringify(report, null, 2)
  );
  console.log("📄 Report saved to: phi-validation-report.json");
  console.log();

  // Exit with appropriate code
  if (failedCount > 0) {
    console.log("🚨 CRITICAL: Φ validation failed");
    console.log("   Some measurements are below the 𝔐 threshold");
    console.log("   Federation operations paused until resolved");
    process.exit(1);
  } else {
    console.log("✅ All Φ validations passed");
    console.log("   Coherence gate operational");
    console.log("   Federation operations authorized");
    process.exit(0);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = PhiGate;
