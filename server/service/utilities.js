/* This function uses JSON stringify and parse to do a quick and dirty copy
 * it should be changed when performance botleneck occurs
 */
export function copyJSON (dest) {
  return JSON.parse(JSON.stringify(dest));
}

/**
 * This function returns a new object with the changed keys
 *  @param {object} object - Object to have one key changed
 *  @param {string} keyToChange - Name of key to be changed
 *  @param {string} finalKey - The Name of the new key
 */
export function changeObjectsKey (object, keyToChange, finalKey) {
  return Object.keys(object).reduce((acc, key) => {
    if (key === keyToChange) acc[finalKey] = object[key];
    else acc[key] = object[key];
    return acc;
  }, {});
}
