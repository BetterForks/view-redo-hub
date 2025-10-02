#!/bin/bash
# Guardian Baseline Group Policy Application Script
# Usage: ./apply_baseline_group.sh <Category> [--os-type <Linux|Windows>]
# Example: ./apply_baseline_group.sh "Filesystem"
# Example: ./apply_baseline_group.sh "Account Policies" --os-type Windows

CATEGORY="$1"
OS_TYPE="Linux"

# Parse arguments
shift
while [[ $# -gt 0 ]]; do
  case $1 in
    --os-type)
      OS_TYPE="$2"
      shift
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

if [ -z "$CATEGORY" ]; then
  echo "Usage: $0 <Category> [--os-type <Linux|Windows>]"
  echo ""
  echo "Examples:"
  echo "  $0 Filesystem"
  echo "  $0 \"Account Policies\" --os-type Windows"
  echo ""
  echo "Available categories can be shown by running without arguments or with an invalid category"
  exit 1
fi

# Run the guardian apply-baseline command
guardian apply-baseline "$CATEGORY" --os-type "$OS_TYPE"
