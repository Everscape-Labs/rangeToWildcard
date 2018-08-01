/*
MIT License

Copyright (c) 2018 Everscape-Labs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

'use strict';
const winston = require('winston');
const moment  = require('moment');
const Errors  = require('./errors');

const withDecimal = (number) => {
  if (parseInt(number, 10) < 10) {
    return `0${number}`;
  }

  return number;
};

const _checkDates = (dateStart, dateEnd) => {
  if (!dateStart instanceof Date || !dateEnd instanceof Date) {
    winston.error('Dates must be an instance of Date object');
    return false;
  }

  if (dateEnd < dateStart) {
    winston.error('Date End must not be < to date Start');
    return false;
  }

  return true;
};

const _determinesWildcardPostfix = (current, target) => {
  return current === target ? '' : '_*';
};


const splitByYears = (dateStart, dateEnd) => {
  const dates       = {};
  let lastDateStart = dateStart;
  let lastDateEnd   = dateStart;
  for (let i = dateStart; i <= dateEnd; i = moment(i).add(1, 'year').toDate()) {

    const dateStartOfYear = moment(i).startOf('year').toDate();
    const dateEndOfYear   = moment(i).endOf('year').toDate();

    const newDateStart     = (dateStartOfYear < dateStart) ? dateStart : dateStartOfYear;
    const newDateEnd       = (dateEndOfYear > dateEnd) ? dateEnd : dateEndOfYear;
    dates[i.getFullYear()] = [
      newDateStart,
      newDateEnd
    ];
    lastDateStart          = newDateStart;
    lastDateEnd            = newDateEnd;
  }

  if (lastDateEnd < dateEnd) {
    if (dateEnd.getFullYear() === lastDateEnd.getFullYear()) {
      dates[dateEnd.getFullYear()] = [
        lastDateStart,
        dateEnd
      ];
    } else {
      dates[dateEnd.getFullYear()] = [
        moment(dateEnd).startOf('year').toDate(),
        dateEnd
      ];
    }
  }

  return dates;
};

const splitByMonths = (dateStart, dateEnd) => {
  const dates       = {};
  let lastDateStart = dateStart;
  let lastDateEnd   = dateStart;

  for (let i = dateStart; i <= dateEnd; i = moment(i).add(1, 'month').toDate()) {
    const dateStartOfMonth = moment(i).startOf('month').toDate();
    const dateEndOfMonth   = moment(i).endOf('month').toDate();

    const newDateStart = (dateStartOfMonth < dateStart) ? dateStart : dateStartOfMonth;
    const newDateEnd   = (dateEndOfMonth > dateEnd) ? dateEnd : dateEndOfMonth;

    dates[i.getMonth() + 1] = [
      newDateStart,
      newDateEnd
    ];
    lastDateStart           = newDateStart;
    lastDateEnd             = newDateEnd;
  }

  if (lastDateEnd < dateEnd) {
    if (dateEnd.getMonth() === lastDateEnd.getMonth()) {
      dates[dateEnd.getMonth() + 1] = [
        lastDateStart,
        dateEnd
      ];
    } else {
      dates[dateEnd.getMonth() + 1] = [
        moment(dateEnd).startOf('month').toDate(),
        dateEnd
      ];
    }
  }

  return dates;
};


const splitByDays = (dateStart, dateEnd) => {
  const dates       = {};
  let lastDateStart = dateStart;
  let lastDateEnd   = dateStart;

  for (let i = dateStart; i <= dateEnd; i = moment(i).add(1, 'day').toDate()) {
    const dateStartOfDay = moment(i).hour(0).minute(0).second(0).toDate();
    const dateEndOfDay   = moment(i).hours(23).minutes(59).seconds(59).endOf('day').toDate();

    const newDateStart = (dateStartOfDay < dateStart) ? dateStart : dateStartOfDay;
    const newDateEnd   = (dateEndOfDay > dateEnd) ? dateEnd : dateEndOfDay;
    const key          = parseInt(moment(i).format('DD'), 10);

    dates[key]    = [
      newDateStart,
      newDateEnd
    ];
    lastDateStart = newDateStart;
    lastDateEnd   = newDateEnd;
  }

  if (lastDateEnd < dateEnd) {
    const key = parseInt(moment(dateEnd).format('DD'), 10);
    if (moment(lastDateEnd).format('DD') === moment(dateEnd).format('DD')) {
      dates[key] = [
        lastDateStart,
        dateEnd
      ];
    } else {
      dates[key] = [
        moment(dateEnd).hour(0).minute(0).second(0).toDate(),
        dateEnd
      ];
    }
  }

  return dates;
};

const _extractNumberOfKeys = (datesByMonths) => {
  let nbOfMonths = 0;
  for (const month in datesByMonths) {
    if ({}.hasOwnProperty.call(datesByMonths, month)) {
      nbOfMonths++;
    }
  }

  return nbOfMonths;
};

const _outputMonthsByMonth = (datesByMonths, periodicity) => {
  const output  = [];
  let index     = 0;
  let readIndex = 0;

  const postfix = _determinesWildcardPostfix('month', periodicity);

  for (const monthKey in datesByMonths) {
    if ({}.hasOwnProperty.call(datesByMonths, monthKey)) {
      const month = parseInt(monthKey, 10);
      if (month === 1 && datesByMonths[9]) {
        output.push(`${datesByMonths[monthKey][0].getFullYear()}_m0*`);
        readIndex += 9;
      } else if (month === 10 && datesByMonths[12]) {
        output.push(`${datesByMonths[monthKey][0].getFullYear()}_m1*`);
        readIndex = 12;
      } else if (index === readIndex) {
        output.push(`${datesByMonths[monthKey][0].getFullYear()}_m${withDecimal(month)}${postfix}`);
        readIndex++;
      }

      index++;
    }
  }

  return output;
};

const _outputDaysByDay = (datesByDays, daysInMonth) => {
  const output  = [];
  let index     = 0;
  let readIndex = 0;

  // winston.warn('DAYS IN MONTH :', daysInMonth );
  // winston.warn('datesByDays :', datesByDays );

  for (const dayKey in datesByDays) {
    if ({}.hasOwnProperty.call(datesByDays, dayKey)) {
      const day   = parseInt(dayKey, 10);
      const month = withDecimal(datesByDays[dayKey][0].getMonth() + 1);
      const year  = datesByDays[dayKey][0].getFullYear();

      if (day === 1 && datesByDays[9]) {
        output.push(`${year}_${month}_0*`);
        readIndex = 9;
      } else if (day === 10 && datesByDays[19]) {
        output.push(`${year}_${month}_1*`);
        readIndex += 10;
      } else if (day === 20 && (datesByDays[29] || (daysInMonth < 30 && datesByDays[daysInMonth]))) { // exception for february
        output.push(`${year}_${month}_2*`);
        readIndex += 10;
      } else if (day === 30 && (daysInMonth > 30 && datesByDays[daysInMonth])) {
        // winston.info('datesByDays', {
        //   datesByDays,
        //   daysInMonth,
        // });
        output.push(`${year}_${month}_3*`);
        readIndex = daysInMonth;
      } else if (index === readIndex) {
        output.push(`${year}_${month}_${withDecimal(day)}`);
        readIndex += 1;
      }
    }

    index++;
  }

  return output;
};

const _handleSingleMonth = (dateOfMonth, periodicity) => {
  if (periodicity === 'month') {
    return [`${dateOfMonth.getFullYear()}-${withDecimal(dateOfMonth.getMonth() + 1)}_*`];
  }

  // winston.info('dates', dateOfMonth);
  const datesByDays = splitByDays(dateOfMonth[0], dateOfMonth[1]);
  const nbOfDays    = _extractNumberOfKeys(datesByDays);
  const daysInMonth = parseInt(moment(dateOfMonth[0]).endOf('month').format('DD'), 10);

  if (nbOfDays === daysInMonth) {
    const postfix = _determinesWildcardPostfix('month', periodicity);
    return [`${dateOfMonth[0].getFullYear()}_${withDecimal(dateOfMonth[0].getMonth() + 1)}${postfix}`];
  }

  return _outputDaysByDay(datesByDays, daysInMonth);
};

const _handleDatesByMonths = (datesByMonths, periodicity) => {
  const nbOfMonths = _extractNumberOfKeys(datesByMonths);
  const output     = [];
  const index      = 0;

  Object.keys(datesByMonths).forEach((month) => {
    if (index === 0 || nbOfMonths < 3 || index === (nbOfMonths - 1)) {
      const dataToOutput = _handleSingleMonth(datesByMonths[month], periodicity);
      dataToOutput.forEach((wildcard) => output.push(wildcard));
    } else {
      // easy one
      output.push(`${datesByMonths[month].getFullYear()}-${withDecimal(month)}-*`);
    }
  });

  return output;
};


const _handleSingleYear = (dateByYear, periodicity) => {
  if (periodicity === 'year') {
    return [`${dateByYear.getFullYear()}`];
  }

  const datesByMonths = splitByMonths(dateByYear[0], dateByYear[1]);
  const nbOfMonths    = _extractNumberOfKeys(datesByMonths);

  if (nbOfMonths === 12 && periodicity === 'month') {
    const postfix = _determinesWildcardPostfix('year', periodicity);
    return [`${datesByMonths[1][0].getFullYear()}${postfix}`];
  }

  if (periodicity === 'month') {
    return _outputMonthsByMonth(datesByMonths, periodicity);
  }

  return _handleDatesByMonths(datesByMonths, periodicity);
};

const _handleDatesByYears = (datesByYears, nbOfYears, periodicity) => {
  const output = [];
  let index    = 0;

  Object.keys(datesByYears).forEach((year) => {
    if (index === 0 || nbOfYears < 3 || index === (nbOfYears - 1)) {
      const dataToOutput = _handleSingleYear(datesByYears[year], periodicity);
      dataToOutput.forEach((wildcard) => output.push(wildcard));
    } else {
      // easy one
      output.push(`${year}_*`);
    }

    index += 1;
  });

  return output;
};

const _handleSameYearDates = (dateStart, dateEnd, nbOfYears, periodicity) => {
  if (periodicity === 'year') {
    return [`${dateStart.getFullYear()}`];
  }

  const datesByYears                    = {};
  datesByYears[dateStart.getFullYear()] = [
    dateStart,
    dateEnd
  ];

  return _handleDatesByYears(datesByYears, nbOfYears, periodicity);
};

const _handleMultipleYearsDates = (dateStart, dateEnd, nbOfYears, periodicity) => {
  const datesByYears = splitByYears(dateStart, dateEnd);

  if (periodicity === 'year') {
    const output = [];
    for (const year in datesByYears) {
      if ({}.hasOwnProperty.call(datesByYears, year)) {
        output.push(`${year}`);
      }
    }

    return output;
  }

  return _handleDatesByYears(datesByYears, nbOfYears, periodicity);
};


const getWildcard = (dateStart, dateEnd, periodicity) => {
  const nbOfYears = (dateEnd.getFullYear() - dateStart.getFullYear()) + 1;
  if (nbOfYears === 1) {
    return _handleSameYearDates(dateStart, dateEnd, nbOfYears, periodicity);
  }

  return _handleMultipleYearsDates(dateStart, dateEnd, nbOfYears, periodicity);
};

const toWildcard = (dateStart, dateEnd, periodicity) => {
  if (!_checkDates(dateStart, dateEnd)) {
    throw new Errors.ParameterError('Date provided are erroneous');
  }

  return getWildcard(moment(dateStart).startOf('day').toDate(), moment(dateEnd).endOf('day').toDate(), periodicity);
};

module.exports = {
  toWildcard,
};
