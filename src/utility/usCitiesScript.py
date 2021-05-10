"""
Short script to process Open Weather's List of Valid Cities to only
include US cities.
"""
import json


# Gather the data from the json file
all_cities_file = open("cityList.json")
all_cities = json.load(all_cities_file)

# Create array to contain the US cities
US_Cities = []

# Loop through cities adding only use with "US" country code
for city in all_cities:
  if (city["country"] == "US" and city["state"]):
    cityObject = {}
    cityObject["name"] = city["name"]
    cityObject["state"] = city["state"]
    US_Cities.append(cityObject)

output_file = open("AllUSCities.json", "w")

json.dump(US_Cities, output_file)
