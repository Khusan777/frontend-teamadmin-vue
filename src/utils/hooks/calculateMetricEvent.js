/**
 * Calculate Employee Difference Metric Event in percent by params date
 * @param {int} current_issues_count - Current issues count Metric Event
 * @param {int} previous_issues_count - Previous issues count Metric Event
 * @returns {int}
 */
export const differencePercentMetrics = (current_issues_count, previous_issues_count) => {
  if (
    current_issues_count == null ||
    (previous_issues_count == 0 && previous_issues_count == null) ||
    current_issues_count == 0
  ) {
    const totalPercent = -100;
    return totalPercent;
  } else if ((current_issues_count >= 0 && previous_issues_count == null) || 0) {
    const totalPercent = 30;
    return totalPercent;
  } else if (current_issues_count == null && previous_issues_count >= 0) {
    const totalPercent = -100;
    return totalPercent;
  } else if (current_issues_count + previous_issues_count < 0) {
    const differencePercent = (current_issues_count || 0 - previous_issues_count || 0) * 100;
    const totalPercent = differencePercent * 0.01;
    return Math.round(-totalPercent);
  } else if (current_issues_count - previous_issues_count > 0) {
    const differencePercent = (current_issues_count || 0 - previous_issues_count || 0) * 100;
    const totalPercent = differencePercent * 0.01;
    return Math.round(totalPercent);
  } else {
    const differencePercent = (current_issues_count || 0 / previous_issues_count || 0) * 100;
    const totalPercent = 100 - differencePercent;
    return Math.round(totalPercent);
  }
};

/**
 * Calculate Employee Difference Metric Event in number by params date
 * @param {int} current_issues_count - Current issues count Metric Event
 * @param {int} previous_issues_count - Previous issues count Metric Event
 * @returns {int}
 */
export const differenceEventCount = (current_issues_count, previous_issues_count) => {
  const totalPoint = current_issues_count - previous_issues_count;
  return totalPoint;
};
