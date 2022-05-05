/**
 * @param {Object} error - Error from response
 * @returns {Array} - Array of errors
 */
export const parseErrorsFromResponse = error => {
  const responseErrors = [];

  if (error.response && error.response.data.errors) {
    const errors = error.response && error.response.data.errors;
    for (const err of Object.keys(errors)) {
      responseErrors.push(errors[err][0]);
    }
  } else {
    responseErrors.push((error.response && error.response.data.message) || '[FE] Ошибка при получении данных');
  }

  return responseErrors;
};

/**
 * Returns quantity of input data
 * @param {number} number
 * @param {string} text
 */
export const displayQuantity = (number, text) => {
  const num = String(number);
  const lastNumber = number < 10 ? number : +num.charAt(num.length - 1);

  /**
   * @param {string} word
   */
  const checkLastTextChar = word => word.charAt(text.length - 1) === 'ь';

  if (number >= 10 && number < 20) {
    if (checkLastTextChar(text)) return `${num} ${text}ей`;
    else return `${num} ${text}ов`;
  } else {
    if (lastNumber === 1) return `${num} ${text}`;
    else if (lastNumber > 1 && lastNumber < 5) {
      if (checkLastTextChar(text)) return `${num} ${text.slice(0, -1)}я`;
      else return `${num} ${text}а`;
    } else {
      if (checkLastTextChar(text)) return `${num} ${text.slice(0, -1)}ей`;
      else return `${num} ${text}ов`;
    }
  }
};

/**
 * @param {Date} date
 * @returns {*}
 */
export const formatDateByDayMonthYear = date => {
  let formattedDate = new Date(date);
  let day = formattedDate.getDate();
  let month = formattedDate.getMonth() + 1;
  return `${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${formattedDate.getFullYear()}`;
};

/**
 * @param {Date} date
 * @returns {*}
 */
export const formatDateToLocaleString = date => {
  return new Date(date).toLocaleString('ru', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
