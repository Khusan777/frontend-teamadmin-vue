/**
 * Generate errors array for target field
 * @param {string} name - Field name
 * @param {object} conditions - Object of conditions list
 * @param {array} fieldErrors - Field errors array from request
 * @returns {array}
 */
export const generateErrors = (name, conditions, fieldErrors) => {
  const { required, minLength, maxLength, numeric, email, date } = conditions;
  const errors = [];

  /**
   * Return exist key in Object
   * @param {string} value - Object key
   * @returns {boolean}
   */
  const exist = value => {
    return Object.prototype.hasOwnProperty.call(conditions, value);
  };

  if (exist('required') && required) {
    errors.push(`Поле ${name} обязательно для заполнения`);
  }
  if (exist('minLength') && minLength.value) {
    errors.push(`Поле ${name} должно содержать не менее ${minLength.length} символов`);
  }
  if (exist('maxLength') && maxLength.value) {
    errors.push(`Поле ${name} должно содержать не более ${maxLength.length} символов`);
  }
  if (exist('numeric') && !numeric) {
    errors.push(`Поле ${name} должно содержать только цифры`);
  }

  if (exist('email') && !email) errors.push(`Неверный формат почты`);

  if (exist('date') && !date) errors.push(`Неправильный формат даты`);

  if (fieldErrors && fieldErrors.length) {
    return errors.concat(fieldErrors);
  }

  return errors.join('\n');
};
