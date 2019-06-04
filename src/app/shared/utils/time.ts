
export const SECONDS_IN_MINUTE = 60;
export const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;
export const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24;

export const secondsToTimeObject = rawSeconds => {
  const days = Math.floor(rawSeconds / SECONDS_IN_DAY);
  const daysSeconds = days * SECONDS_IN_DAY;

  const hours = Math.floor((rawSeconds - daysSeconds) / SECONDS_IN_HOUR);
  const hoursSeconds = hours * SECONDS_IN_HOUR;

  const minutes = Math.floor((rawSeconds - daysSeconds - hoursSeconds) / SECONDS_IN_MINUTE);
  const minutesSeconds = minutes * SECONDS_IN_MINUTE;

  const seconds = rawSeconds  - daysSeconds - hoursSeconds - minutesSeconds;

  return { days, hours, minutes, seconds };
}
