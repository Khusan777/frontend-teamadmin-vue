/**
 * @param {Object} obj - Query object
 * @returns {Object} - Query object with only exist params
 */
export function clearQueryParams(obj) {
  const object = { ...obj };
  let i;
  for (i in object) {
    if (object[i] === '' || (typeof object[i] === 'object' && !object[i].length)) {
      delete object[i];
    }
  }
  return object;
}
