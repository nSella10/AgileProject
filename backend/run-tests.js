#!/usr/bin/env node

/**
 * Test runner script for the backend
 * This script helps run tests with proper setup and cleanup
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    log(`Running: ${command} ${args.join(' ')}`, 'cyan');
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      cwd: __dirname,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  try {
    log('🧪 Starting Backend Tests', 'bright');
    log('========================', 'bright');

    // Check if specific test pattern is provided
    const testPattern = args.find(arg => arg.startsWith('--testNamePattern=') || arg.includes('.test.js'));
    
    if (testPattern) {
      log(`Running specific tests: ${testPattern}`, 'yellow');
    } else {
      log('Running all tests...', 'yellow');
    }

    // Prepare Jest arguments
    const jestArgs = ['--verbose', '--colors'];
    
    // Add coverage if requested
    if (args.includes('--coverage')) {
      jestArgs.push('--coverage');
      log('Coverage report will be generated', 'blue');
    }

    // Add watch mode if requested
    if (args.includes('--watch')) {
      jestArgs.push('--watch');
      log('Running in watch mode', 'blue');
    }

    // Add specific test pattern if provided
    if (testPattern) {
      jestArgs.push(testPattern);
    }

    // Add any other arguments passed to the script
    const otherArgs = args.filter(arg => 
      !arg.includes('--coverage') && 
      !arg.includes('--watch') && 
      !arg.includes('.test.js') &&
      !arg.startsWith('--testNamePattern=')
    );
    jestArgs.push(...otherArgs);

    log('', 'reset');
    
    // Run Jest
    await runCommand('npx', ['jest', ...jestArgs]);
    
    log('', 'reset');
    log('✅ All tests completed successfully!', 'green');
    
    if (args.includes('--coverage')) {
      log('📊 Coverage report generated in ./coverage/', 'blue');
    }

  } catch (error) {
    log('', 'reset');
    log('❌ Tests failed!', 'red');
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Help message
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  log('Backend Test Runner', 'bright');
  log('==================', 'bright');
  log('');
  log('Usage:', 'yellow');
  log('  node run-tests.js [options] [test-pattern]', 'cyan');
  log('');
  log('Options:', 'yellow');
  log('  --coverage          Generate coverage report', 'cyan');
  log('  --watch            Run tests in watch mode', 'cyan');
  log('  --help, -h         Show this help message', 'cyan');
  log('');
  log('Examples:', 'yellow');
  log('  node run-tests.js                                    # Run all tests', 'cyan');
  log('  node run-tests.js --coverage                         # Run with coverage', 'cyan');
  log('  node run-tests.js --watch                           # Run in watch mode', 'cyan');
  log('  node run-tests.js userModel.test.js                 # Run specific test file', 'cyan');
  log('  node run-tests.js --testNamePattern="User Model"     # Run tests matching pattern', 'cyan');
  log('');
  process.exit(0);
}

// Run the main function
main().catch((error) => {
  log(`Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});
