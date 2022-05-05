export const iterableArray = (array, callback) => array.forEach(callback);

export const objCheckType = (obj, type) =>
  type ? Object.prototype.toString.call(obj) === `[object ${type[0].toUpperCase()}${type.slice(1)}]` : false;

export const objHasProperty = (obj, key) =>
  obj !== undefined && obj !== null && Object.prototype.hasOwnProperty.call(obj, key);

export const iterableObject = (obj, callback) => {
  const result = [];
  for (const key in obj) {
    if (objHasProperty(obj, key)) {
      result.push([key, obj[key]]);
      if (objCheckType(callback, 'function')) {
        callback(obj[key]);
      }
    }
  }
  return result;
};
