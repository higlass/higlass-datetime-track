# Time Interval Track for HiGlass

> Display time intervals in the format HH:MM:ss in HiGlass.

[![HiGlass](https://img.shields.io/badge/higlass-👍-red.svg?colorB=0f5d92)](http://higlass.io)
[![Build Status](https://img.shields.io/travis/pkerpedjiev/higlass-time-interval-track/master.svg?colorB=0f5d92)](https://travis-ci.org/pkerpedjiev/higlass-time-interval-track)

![HiGlass showing times](/screenshot.png?raw=true "Times since the beginning of an event visible as an axis")

**Note**: This is the source code for the time interval track only! You might want to check out the following repositories as well:

- HiGlass viewer: https://github.com/hms-dbmi/higlass
- HiGlass server: https://github.com/hms-dbmi/higlass-server
- HiGlass docker: https://github.com/hms-dbmi/higlass-docker

## Installation

```
npm install higlass-time-interval-track
```

## Usage

1. Make sure you load this track prior to `hglib.js`. For example:

```
<script src="higlass-time-interval-track.js"></script>
<script src="hglib.js"></script>
<script>
  ...
</script>
```

2 Make sure that your server is hosting a htime file. This file should contain ``start``, ``end`` and ``length`` which indicate the start time, end time, and the length of the data points that span that time interval.

```

{
  "start": 1527700333497.325, 
  "end": 1527700926756.7783, 
  "len": 59340
}
```
This will place the first time interval at data position 0 and the last at data position 59340. Each data point 
is thus assumed to last 10 milliseconds.

3. Configure the track in your view config and be happy! Cheers 🎉

```
{
  ...
  {
    server: 'http://localhost:8001/api/v1',
    tilesetUid: 'time-interval.json',
    uid: 'blah',
    type: 'time-interval-track',
    options: {

    },
  },
  ...
}
```

Take a look at [`src/index.html`](src/index.html) for an example.

## Development

### Installation

```bash
$ git clone https://github.com/pkerpedjiev/higlass-time-interval-track
$ npm install
```

### Commands

**Developmental server**: `npm start`
**Production build**: `npm run build`
