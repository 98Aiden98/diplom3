export const timeToMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (value: number) => {
  const hours = Math.floor(value / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (value % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const rangesOverlap = (
  startA: string,
  endA: string,
  startB: string,
  endB: string,
) => {
  const aStart = timeToMinutes(startA);
  const aEnd = timeToMinutes(endA);
  const bStart = timeToMinutes(startB);
  const bEnd = timeToMinutes(endB);

  return aStart < bEnd && bStart < aEnd;
};

export const getDayOfWeek = (date: string) => {
  const day = new Date(`${date}T00:00:00`).getDay();
  return day === 0 ? 7 : day;
};
