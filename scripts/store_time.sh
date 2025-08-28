#!/bin/bash

# Create the target directory if it doesn't exist
mkdir -p scripts/data

# Get current time in human readable format
current_time=$(date "+%Y-%m-%d %H:%M:%S %Z")

# Store the time in a file
echo "$current_time" > scripts/data/recent_time.txt

echo "Time stored successfully in scripts/data/recent_time.txt"