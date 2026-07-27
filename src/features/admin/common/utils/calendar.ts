const pad2 = (value: number) => String(value).padStart(2, "0");

export type AdminCalendarDay = {
  day: number;
  dateValue: string;
  isCurrentMonth: boolean;
};

export type AdminCalendarPopoverDay = AdminCalendarDay | null;

export function formatCalendarDate(year: number, month: number, day: number) {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function getPopoverCalendarDays(
  year: number,
  month: number,
): AdminCalendarPopoverDay[] {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();

  return [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: lastDate }, (_, index) => ({
      day: index + 1,
      dateValue: formatCalendarDate(year, month, index + 1),
      isCurrentMonth: true,
    })),
  ];
}

export function getPanelCalendarDays(
  year: number,
  month: number,
): AdminCalendarDay[] {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const previousMonthLastDate = new Date(year, month - 1, 0).getDate();
  const currentMonthDays = Array.from({ length: lastDate }, (_, index) => ({
    day: index + 1,
    dateValue: formatCalendarDate(year, month, index + 1),
    isCurrentMonth: true,
  }));
  const previousMonthDays = Array.from({ length: firstDay }, (_, index) => {
    const day = previousMonthLastDate - firstDay + index + 1;
    const date = new Date(year, month - 2, day);

    return {
      day,
      dateValue: formatCalendarDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
      ),
      isCurrentMonth: false,
    };
  });
  const visibleDays = [...previousMonthDays, ...currentMonthDays];
  const totalVisibleSlots = Math.ceil(visibleDays.length / 7) * 7;
  const nextMonthDays = Array.from(
    { length: totalVisibleSlots - visibleDays.length },
    (_, index) => {
      const date = new Date(year, month, index + 1);

      return {
        day: date.getDate(),
        dateValue: formatCalendarDate(
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate(),
        ),
        isCurrentMonth: false,
      };
    },
  );

  return [...visibleDays, ...nextMonthDays];
}
