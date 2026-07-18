/**
 * This script runs after the build command and is repsonsible for deploying the site to gCore platform
 * It is not necessary to run this script manually, it will be run automatically after the build command using Github Actions.
 * Run using : `export GCORE_API_KEY=<your-api-key> && node scripts/gcore-deploy.js`
 * */
const fs = require('fs');
const path = require('path');

main();

async function main() {
  // upload dist folder to gcore objects
  uploadDistFolder();

  // compile fastedge-build
}

function verifyAPIKey() {
  if (!process.env.GCORE_API_KEY) {
    console.error('GCORE_API_KEY environment variable is not set. Please set it to your gCore API key.');
    process.exit(1);
  }
}

async function uploadDistFolder() {
  const distFolder = path.join(__dirname, '../dist');
}

