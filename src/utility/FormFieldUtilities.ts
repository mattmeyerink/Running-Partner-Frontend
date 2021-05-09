import { AllUSCities } from "./AllUSCities";

/**
   * Returns if the password meets minimum strength requirements.
   * Currently password needs uppercase, lowercase, and a number.
   * @param password Represents the password to check strength of
   * @returns if password meets minimum strength requirements
   */
 export function checkPasswordStrength(password: string): boolean {
  // Conditions for acceptable password
  let upperCasePresent = false;
  let lowerCasePresent = false;
  let numberPresent = false;
  let passwordLength = false;

  // Bounds for neccessary character types
  const capitalA = 65;
  const capitalZ = 90;
  const lowerA = 97;
  const lowerZ = 122;
  const lowerNum = 48;
  const upperNum = 57;
  const minimumPasswordLength = 7;

  //Check password length
  passwordLength = password.length >= minimumPasswordLength;

  for (let i = 0; i < password.length; i++) {
    const passwordChar = password.charCodeAt(i);

    // Check if the character is uppercase
    if (passwordChar >= capitalA && passwordChar <= capitalZ) {
      upperCasePresent = true;
    }

    // Check if character is lowercase
    else if (passwordChar >= lowerA && passwordChar <= lowerZ) {
      lowerCasePresent = true;
    }

    // Check if a digit is present
    else if (passwordChar >= lowerNum && passwordChar <= upperNum) {
      numberPresent = true;
    }
  }

  return upperCasePresent && lowerCasePresent && numberPresent && passwordLength;
}

/**
 * Checks to see if input city is a valid city.
 * References the filtered collection of cities from Open Weather API
 * @param city 
 * @param state 
 * @returns if the city is a valid US city
 */
export function confirmValidCity(city: string, state: string): boolean {
  let cityFound = false;
  for (let i = 0; i < AllUSCities.length; i++) {
    if(AllUSCities[i].name === city && AllUSCities[i].state === state) {
      cityFound = true;
      break;
    }
  }
  
  return cityFound;
}