#!/usr/bin/env bash
set -euo pipefail

# S3 deploy script for westack-it static site
# Reads credentials interactively, then syncs dist/ to S3-compatible storage.

read -rp "AWS Access Key ID:        " AWS_ACCESS_KEY_ID
read -rsp "AWS Secret Access Key:    " AWS_SECRET_ACCESS_KEY
echo

read -rp "AWS Region [luxembourg-2]: " AWS_REGION
AWS_REGION="${AWS_REGION:-luxembourg-2}"

read -rp "Endpoint URL [https://luxembourg-2.storage.gcore.dev]: " AWS_ENDPOINT_URL
AWS_ENDPOINT_URL="${AWS_ENDPOINT_URL:-https://luxembourg-2.storage.gcore.dev}"

aws configure set aws_access_key_id "$AWS_ACCESS_KEY_ID"
aws configure set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY"
aws configure set default.region "$AWS_REGION"

echo "--- Syncing dist/ to s3://westack-it-eu/ ---"
aws s3 cp dist/ s3://westack-it-eu/ \
  --recursive \
  --endpoint-url "$AWS_ENDPOINT_URL"

echo "--- Done ---"
