'use strict';
const chai               = require('chai');
chai.config.includeStack = true;
global.expect            = chai.expect;

const dateRangeToWildcard = require('../index');

describe('Tests periodicity = day', () => {

  it('test 1 day : should return ["2016-01-01"]', (done) => {
    const dateStart = new Date('2016-01-01');
    const dateEnd   = new Date('2016-01-01');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'day');

    expect(wildcard).to.eql(['2016_01_01']);
    done();
  });

  it('test 2 days : should return ["2016-01-01", "2016-01-02"]', (done) => {
    const dateStart = new Date('2016-01-01');
    const dateEnd   = new Date('2016-01-02');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'day');

    expect(wildcard).to.eql([
      '2016_01_01',
      '2016_01_02',
    ]);
    done();
  });

  it('test 30 of april : should return ["2016-04-30"]', (done) => {
    const dateStart = new Date('2016-04-30');
    const dateEnd   = new Date('2016-04-30');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'day');

    expect(wildcard).to.eql([
      '2016_04_30',
    ]);
    done();
  });

  it('test end of march : should return ["2016-03-3*"]', (done) => {
    const dateStart = new Date('2016-03-30');
    const dateEnd   = new Date('2016-03-31');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'day');

    expect(wildcard).to.eql([
      '2016_03_3*',
    ]);
    done();
  });

  it('test 9 days in same 10-days range : should return ["2016-01-0*"]', (done) => {
    const dateStart = new Date('2016-01-01');
    const dateEnd   = new Date('2016-01-09');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'day');

    expect(wildcard).to.eql(['2016_01_0*']);
    done();
  });

  it('test 9 days NOT in same 10-days range', (done) => {
    const dateStart = new Date('2016-01-02');
    const dateEnd   = new Date('2016-01-10');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'day');

    expect(wildcard).to.eql([
      '2016_01_02',
      '2016_01_03',
      '2016_01_04',
      '2016_01_05',
      '2016_01_06',
      '2016_01_07',
      '2016_01_08',
      '2016_01_09',
      '2016_01_10',
    ]);
    done();
  });

  it('test 18 days in the same 10-days range (1 to 17): ', (done) => {
    const dateStart = new Date('2016-01-01');
    const dateEnd   = new Date('2016-01-17');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'day');

    expect(wildcard).to.eql([
      '2016_01_0*',
      '2016_01_10',
      '2016_01_11',
      '2016_01_12',
      '2016_01_13',
      '2016_01_14',
      '2016_01_15',
      '2016_01_16',
      '2016_01_17',
    ]);
    done();
  });

  it('test 18 days NOT in the same 10-days range (2 to 18): ', (done) => {
    const dateStart = new Date('2016-01-02');
    const dateEnd   = new Date('2016-01-18');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'day');

    expect(wildcard).to.eql([
      '2016_01_02',
      '2016_01_03',
      '2016_01_04',
      '2016_01_05',
      '2016_01_06',
      '2016_01_07',
      '2016_01_08',
      '2016_01_09',
      '2016_01_10',
      '2016_01_11',
      '2016_01_12',
      '2016_01_13',
      '2016_01_14',
      '2016_01_15',
      '2016_01_16',
      '2016_01_17',
      '2016_01_18',
    ]);
    done();
  });


  it('test 27 days in the same 10-days range (1 to 27): ', (done) => {
    const dateStart = new Date('2016-01-01');
    const dateEnd   = new Date('2016-01-27');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'day');

    expect(wildcard).to.eql([
      '2016_01_0*',
      '2016_01_1*',
      '2016_01_20',
      '2016_01_21',
      '2016_01_22',
      '2016_01_23',
      '2016_01_24',
      '2016_01_25',
      '2016_01_26',
      '2016_01_27',
    ]);
    done();
  });


  it('test 27 days NOT in the same 10-days range (2 to 28): ', (done) => {
    const dateStart = new Date('2016-01-02');
    const dateEnd   = new Date('2016-01-28');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'day');

    expect(wildcard).to.eql([
      '2016_01_02',
      '2016_01_03',
      '2016_01_04',
      '2016_01_05',
      '2016_01_06',
      '2016_01_07',
      '2016_01_08',
      '2016_01_09',
      '2016_01_1*',
      '2016_01_20',
      '2016_01_21',
      '2016_01_22',
      '2016_01_23',
      '2016_01_24',
      '2016_01_25',
      '2016_01_26',
      '2016_01_27',
      '2016_01_28',
    ]);
    done();
  });


  it('test 31 days from 1st day of january 2016: ', (done) => {
    const dateStart = new Date('2016-01-01');
    const dateEnd   = new Date('2016-01-31');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'day');

    expect(wildcard).to.eql([
      '2016_01_*',
    ]);
    done();
  });


  it('test 31 days from 2nd day of january 2016: ', (done) => {
    const dateStart = new Date('2016-01-02');
    const dateEnd   = new Date('2016-02-01');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'day');

    expect(wildcard).to.eql([
      '2016_01_02',
      '2016_01_03',
      '2016_01_04',
      '2016_01_05',
      '2016_01_06',
      '2016_01_07',
      '2016_01_08',
      '2016_01_09',
      '2016_01_1*',
      '2016_01_2*',
      '2016_01_3*',
      '2016_02_01',
    ]);
    done();
  });

  it('test from mid january to mid february: ', (done) => {
    const dateStart = new Date('2016-01-15');
    const dateEnd   = new Date('2016-02-15');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'day');

    expect(wildcard).to.eql([
      '2016_01_15',
      '2016_01_16',
      '2016_01_17',
      '2016_01_18',
      '2016_01_19',
      '2016_01_2*',
      '2016_01_3*',
      '2016_02_0*',
      '2016_02_10',
      '2016_02_11',
      '2016_02_12',
      '2016_02_13',
      '2016_02_14',
      '2016_02_15',
    ]);
    done();
  });

  it('test from mid january to mid march: ', (done) => {
    const dateStart = new Date('2016-01-15');
    const dateEnd   = new Date('2016-03-15');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'day');

    expect(wildcard).to.eql([
      '2016_01_15',
      '2016_01_16',
      '2016_01_17',
      '2016_01_18',
      '2016_01_19',
      '2016_01_2*',
      '2016_01_3*',
      '2016_02_*',
      '2016_03_0*',
      '2016_03_10',
      '2016_03_11',
      '2016_03_12',
      '2016_03_13',
      '2016_03_14',
      '2016_03_15',
    ]);
    done();
  });

  it('test from mid january 2015 to mid january 2016: ', (done) => {
    const dateStart = new Date('2015-01-15');
    const dateEnd   = new Date('2016-01-15');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'day');

    expect(wildcard).to.eql([
      "2015_01_15",
      "2015_01_16",
      "2015_01_17",
      "2015_01_18",
      "2015_01_19",
      "2015_01_2*",
      "2015_01_3*",
      "2015_02_*",
      "2015_03_*",
      "2015_04_*",
      "2015_05_*",
      "2015_06_*",
      "2015_07_*",
      "2015_08_*",
      "2015_09_*",
      "2015_10_*",
      "2015_11_*",
      "2015_12_*",
      "2016_01_0*",
      "2016_01_10",
      "2016_01_11",
      "2016_01_12",
      "2016_01_13",
      "2016_01_14",
      "2016_01_15",
    ]);
    done();
  });
});

describe('Tests periodicity = month', () => {
  it('test 1 day ', (done) => {
    const dateStart = new Date('2016-01-01');
    const dateEnd   = new Date('2016-01-01');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'month');

    expect(wildcard).to.eql(['2016_m01']);
    done();
  });

  it('test 2 days : should return', (done) => {
    const dateStart = new Date('2016-01-01');
    const dateEnd   = new Date('2016-01-02');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'month');

    expect(wildcard).to.eql(['2016_m01']);
    done();
  });

  it('test 9 days in same 10-days range', (done) => {
    const dateStart = new Date('2016-01-01');
    const dateEnd   = new Date('2016-01-09');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'month');

    expect(wildcard).to.eql(['2016_m01']);
    done();
  });

  it('test 9 days NOT in same 10-days range', (done) => {
    const dateStart = new Date('2016-01-02');
    const dateEnd   = new Date('2016-01-10');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'month');

    expect(wildcard).to.eql(['2016_m01']);
    done();
  });

  it('test 18 days in the same 10-days range (1 to 17): ', (done) => {
    const dateStart = new Date('2016-01-01');
    const dateEnd   = new Date('2016-01-17');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'month');

    expect(wildcard).to.eql(['2016_m01']);
    done();
  });

  it('test 18 days NOT in the same 10-days range (2 to 18): ', (done) => {
    const dateStart = new Date('2016-01-02');
    const dateEnd   = new Date('2016-01-18');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'month');

    expect(wildcard).to.eql(['2016_m01']);
    done();
  });


  it('test 27 days in the same 10-days range (1 to 27): ', (done) => {
    const dateStart = new Date('2016-01-01');
    const dateEnd   = new Date('2016-01-26');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'month');

    expect(wildcard).to.eql(['2016_m01']);
    done();
  });


  it('test 27 days NOT in the same 10-days range (2 to 28): ', (done) => {
    const dateStart = new Date('2016-01-02');
    const dateEnd   = new Date('2016-01-27');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'month');

    expect(wildcard).to.eql(['2016_m01']);
    done();
  });


  it('test 31 days from 1st day of january 2016: ', (done) => {
    const dateStart = new Date('2016-01-01');
    const dateEnd   = new Date('2016-01-31');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'month');

    expect(wildcard).to.eql([
      '2016_m01',
    ]);
    done();
  });


  it('test 31 days from 2nd day of january 2016: ', (done) => {
    const dateStart = new Date('2016-01-02');
    const dateEnd   = new Date('2016-02-01');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'month');

    expect(wildcard).to.eql(['2016_m01', '2016_m02']);
    done();
  });

  it('test from mid january to mid february: ', (done) => {
    const dateStart = new Date('2016-01-15');
    const dateEnd   = new Date('2016-02-15');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'month');

    expect(wildcard).to.eql([
      '2016_m01',
      '2016_m02',
    ]);
    done();
  });

  it('test from mid january to mid march: ', (done) => {
    const dateStart = new Date('2016-01-15');
    const dateEnd   = new Date('2016-03-15');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'month');

    expect(wildcard).to.eql([
      '2016_m01',
      '2016_m02',
      '2016_m03',
    ]);
    done();
  });

  it('test from mid january 2015 to mid january 2016: ', (done) => {
    const dateStart = new Date('2015-01-15');
    const dateEnd   = new Date('2016-02-15');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'month');

    expect(wildcard).to.eql([
      '2015_*',
      '2016_m01',
      '2016_m02',
    ]);
    done();
  });

  it('test from mid july 2014 to mid january 2016: ', (done) => {
    const dateStart = new Date('2014-07-15');
    const dateEnd   = new Date('2016-01-15');
    const wildcard  = dateRangeToWildcard.toWildcard(dateStart, dateEnd, 'month');

    const results = [
      '2014_m07',
      '2014_m08',
      '2014_m09',
      '2014_m1*',
      '2015_*',
      '2016_m01'
    ];

    expect(wildcard).to.eql(results);
    done();
  });
});