import type Event from "../Interfaces/Event";

export const generateGoogleCalendarLink = (event: Event): string => {
    const start = new Date(event.startAt).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(event.endAt).toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.title,
        dates: `${start}/${end}`,
        details: event.description,
        location: `${event.city}, ${event.county}`,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const downloadIcsFile = (event: Event) => {
    const start = new Date(event.startAt).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(event.endAt).toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//BachelorProject//EventCalendar//EN",
        "BEGIN:VEVENT",
        `UID:${event.id}@bachelorproject.com`,
        `DTSTAMP:${start}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
        `LOCATION:${event.city}\\, ${event.county}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${event.slug || 'event'}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
