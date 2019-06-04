import {
  secondsToTimeObject,
  SECONDS_IN_DAY,
  SECONDS_IN_HOUR,
  SECONDS_IN_MINUTE,
} from "./time";

describe('time.ts', () => {
  it('should propertly convert number of seconds to time object', () => {
    const seconds = 632 * SECONDS_IN_DAY + 4 * SECONDS_IN_HOUR + 15 * SECONDS_IN_MINUTE + 30;
    const result = { days: 632, hours: 4, minutes: 15, seconds: 30 };
    expect(secondsToTimeObject(seconds)).toEqual(result);
  })
})
