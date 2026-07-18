import { WEDDING } from "./wedding";

const EVENT_TITLE = `حفل زفاف ${WEDDING.groom} و${WEDDING.bride}`;
const EVENT_DURATION_HOURS = 4;

function toUtcStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function getEventBounds() {
  const start = new Date(WEDDING.isoDateTime);
  const end = new Date(start.getTime() + EVENT_DURATION_HOURS * 60 * 60 * 1000);
  return { start, end };
}

export function buildGoogleCalendarUrl(): string {
  const { start, end } = getEventBounds();
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT_TITLE,
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details: COPY_DETAILS,
    location: `${WEDDING.venueName} - ${WEDDING.venueAddress}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const COPY_DETAILS = "يسرنا دعوتكم لمشاركتنا أجمل لحظات العمر";

export function buildIcsDataUrl(): string {
  const { start, end } = getEventBounds();
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//AR",
    "BEGIN:VEVENT",
    `UID:${WEDDING.groom}-${WEDDING.bride}-${WEDDING.isoDateTime}@wedding-invitation`,
    `DTSTAMP:${toUtcStamp(new Date(WEDDING.isoDateTime))}`,
    `DTSTART:${toUtcStamp(start)}`,
    `DTEND:${toUtcStamp(end)}`,
    `SUMMARY:${EVENT_TITLE}`,
    `DESCRIPTION:${COPY_DETAILS}`,
    `LOCATION:${`${WEDDING.venueName} - ${WEDDING.venueAddress}`}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
