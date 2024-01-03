export const weekend = {
  sunday: "sunday",
  saturday: "saturday",
};

const weekdays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

type Weekday = (typeof weekdays)[number];

export function getDayOfTheWeek(): Weekday {
  const date = new Date();
  return weekdays[date.getDay()];
}
