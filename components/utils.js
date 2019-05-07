const Months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
export const checkSource = (uri) => {
  return typeof uri === 'string' ?
    { source: { uri } } : { source: uri }
}

export function isEmpty(obj) {
  // console.log(typeof(obj));
  if (obj !== null && obj !== undefined) {
    // for general objects
    if (typeof obj === 'string') {
      if (obj.trim() === '' || obj == 'null') {
        // for string
        return true;
      }

      return false;
    } else if (obj.length <= 0) {
      // for array
      return true;
    } else if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      const len = keys.length;
      if (len <= 0) {
        return true;
      }
      return false;
    }
    return false;
  }

  return true;
}
export function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  let strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
}

export function FormatDateTimeMessageServer(_inDateStr, serverTime) {
  try {
    // const [inDate, inTime] = inDateStr.split(" ");
    let inDateStr = new Date(_inDateStr);
    let timeDiff = (new Date(serverTime)) - inDateStr;

    if (timeDiff > 0 && timeDiff < (12 * 60 * 60 * 1000)) {
      let sec = Math.ceil((timeDiff / 1000));

      // let hours = Math.ceil((timeDiff / (60 * 60 * 1000)));
      // if (hours === 1) {
      //   return `${hours} hr`;
      // }
      // return `${hours} hrs`;
      return formatAMPM(inDateStr);

    }
    return `${formatAMPM(inDateStr)}, ${inDateStr.getDate()} ${Months[inDateStr.getMonth()]}'${inDateStr.getUTCFullYear().toString().substr(2, 2)}`;

  }
  catch (e) {
    console.log(e);
  }
};

export function msToTime(duration) {
  let seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24),
    days = parseInt((duration / (1000 * 60 * 60 * 24)));

  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;
  if (hours === '00' && days === 0) {
    return `${minutes}:${seconds}`;
  }
  if (days > 0) {
    days = (days < 10) ? '0' + days : days;
    return `${days}:${hours}:${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
};

export function numberFormatter(num) {
  num = parseInt(num);
  let isNegative = false;
  if (num < 0) {
      isNegative = true;
  }
  num = Math.abs(num);
  let formattedNumber = '';
  if (num >= 1000000000) {
      formattedNumber = `${(num / 1000000000).toFixed(1).replace(/\.0$/, '')}B`;
  } else if (num >= 1000000) {
      formattedNumber = `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  } else if (num >= 1000) {
      formattedNumber = `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  } else {
      formattedNumber = num;
  }
  if (isNegative) {
      formattedNumber = `-${formattedNumber}`;
  }
  return formattedNumber;
}