# rangeToWildcard

Elastic Search helper for Time Series indices - It converts a date range (dateFrom and dateTo) to an array of wildcarded dates.

It supports `month` and `day` conversion.

See the **Usage** section for example

## Installation

`npm install rangetowildcard`

## Usage

Chose a date range and a periodicity `day` or `month` for now)

### Daily periodicity

Note that all dates for the **daily** periodicity are expressed as `YYYY-MM-DD`

**9 Consecutive days :**

```javascript
  import { toWildcard } from 'rangetowildcard';

  const dateFrom  = new Date('2016-01-02');
  const dateTo    = new Date('2016-01-10');
  const wildcards = toWildcard(dateFrom, dateTo, 'day');
  console.log(wildcards);
  /**
   [
    '2016_01_02',
    '2016_01_03',
    '2016_01_04',
    '2016_01_05',
    '2016_01_06',
    '2016_01_07',
    '2016_01_08',
    '2016_01_09',
    '2016_01_10',
   ];
  */
```

**1 Year**
```javascript
    import { toWildcard } from 'rangetowildcard';

    const dateFrom  = new Date('2015-01-15');
    const dateTo    = new Date('2016-01-15');
    const wildcards = toWildcard(dateFrom, dateTo, 'day');

    console.log(wildcards);
    /**
     [
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
     ]
    */
```

### Monthly periodicity

Note that all dates for the **daily** periodicity are expressed as `YYYY-\mMM`

**From mid january to mid february**

```javascript
  import { toWildcard } from 'rangetowildcard';

  const dateFrom  = new Date('2016-01-15');
  const dateTo    = new Date('2016-02-15');
  const wildcards = toWildcard(dateFrom, dateTo, 'month');

  console.log(wildcards);
  /**   
   [
     '2016_m01',
     '2016_m02',
   ]
  */
  
```

**Cross years - From mid july 2014 to mid january 2016**

```javascript
  import { toWildcard } from 'rangetowildcard';

  const dateFrom  = new Date('2014-07-15');
  const dateTo    = new Date('2016-01-15');
  const wildcards = toWildcard(dateFrom, dateTo, 'day');
  
  console.log(wildcards);
  /**
   [
     '2014_m07',
     '2014_m08',
     '2014_m09',
     '2014_m1*',
     '2015_*',
     '2016_m01'
   ]
  */
```