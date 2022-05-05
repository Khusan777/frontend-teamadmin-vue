import { formatDistanceToNow, format, parseISO, formatDistanceStrict } from 'date-fns';
import { ru } from 'date-fns/locale';

export function calculateAge(birthday) {
  const birthdayDate = new Date(birthday);
  const ageDifMs = Date.now() - birthdayDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export function calculateDaysLeftToBirthday(birthday) {
  const today = new Date();
  const bday = new Date(birthday);
  let upcomingBday = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
  if (today > upcomingBday) upcomingBday.setFullYear(today.getFullYear());
  const one_day = 24 * 60 * 60 * 1000;
  let daysLeft = Math.ceil((upcomingBday.getTime() - today.getTime()) / one_day);
  return daysLeft + 1;
}

export function formatDateByDayMonthYear(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('ru', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function readableDateTime(date) {
  if (!date) return '';
  return format(new Date(date), 'kk:mm');
}

export function readableDate(date) {
  if (!date) return '';
  let parsedDate = format(parseISO(date), 'yyyy mm dd', { locale: ru });
  return parsedDate;
}

export function readableMonth(date) {
  if (!date) return '';
  let parsedDate = format(parseISO(date), 'MMM yyyy', { locale: ru });
  return parsedDate;
}

export function parseDate(date) {
  if (!date) return '';
  let parsedDate = format(new Date(date), 'yyyy-MM-dd');
  return parsedDate;
}

export function readableDateMonth(date) {
  if (!date) return '';
  let parsedDate = format(parseISO(date), 'dd MMM', { locale: ru });
  return parsedDate;
}

export function readableDateYear(date) {
  if (!date) return '';
  let parsedDate = format(parseISO(date), 'MMM', { locale: ru });
  return parsedDate;
}

export function formatDistanceBirthDayWithCurrentDate(
  yearNow,
  monthNow,
  dayNow,
  yearOfBirthday,
  monthOfBirthday,
  dayOfBirthday
) {
  if ((!dayNow, !monthNow, !yearNow, !dayOfBirthday, !monthOfBirthday)) return '';
  return formatDistanceStrict(
    new Date(yearOfBirthday, monthOfBirthday, dayOfBirthday),
    new Date(yearNow, monthNow, dayNow),
    {
      locale: ru,
      unit: 'day',
    }
  );
}

export function formatDistanceDate(date) {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ru });
}

export function parseDateFormat(date) {
  if (!date) return '';
  let parsedDate = format(new Date(date), 'yyyy.MM.dd');
  return parsedDate;
}

export const readableTime = date => {
  if (!date) return '';
  let parsedDate = format(parseISO(date), 'hh:mm BBB', { locale: ru });
  return parsedDate;
};

export const convertMinsToHrsMins = mins => {
  if (mins == null) {
    return 0;
  } else {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return `${h} ч. ${m} м.`;
  }
};
