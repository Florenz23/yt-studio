#!/usr/bin/env python3
import sys
import subprocess
import json

if len(sys.argv) < 2:
    print("Usage: python get_weather.py CityName")
    sys.exit(1)

city = sys.argv[1]

# Use curl to get weather from wttr.in
# Format: %c = weather condition, %t = temperature
cmd = f'curl -s "wttr.in/{city}?format=%c+%t"'

try:
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=5)
    weather = result.stdout.strip()
    
    print(json.dumps({
        "city": city,
        "weather": weather,
        "raw_output": weather
    }, indent=2))
except Exception as e:
    print(json.dumps({
        "error": str(e),
        "city": city
    }, indent=2))