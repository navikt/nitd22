import React from "react";
import { useCurrentSidebarCategory } from "@docusaurus/theme-common";

function getEvents() {
  const { items } = useCurrentSidebarCategory();

  return items.map(mapItem);
}

function mapItem(item) {
  const { docId, customProps } = item;
  const startTime = customProps?.start;
  const length = customProps?.length;
  const speakers = customProps?.speakers;
  const track = customProps?.track

  const [hours, minutes] = (startTime || "00:00").split(/:|\./, 2).map(str => parseInt(str.trim(), 10));
  const startMinutes = minutes + hours * 60;

  return {
    ...item,
    startTime,
    startMinutes,
    length,
    speakers,
    track
  };
}

function formatMinutes(totalMinutes) {
    const hours = ~~(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}.${minutes}`;
}

function formatTime(startTime, length) {
    if (!startTime) return "?";
    const [hours, minutes] = startTime.split(/:|\./, 2).map(str => parseInt(str.trim(), 10));
    const startMinutes = minutes + hours * 60;
    const endMinutes = startMinutes + length;

    const startStr = formatMinutes(startMinutes);
    const endStr = formatMinutes(endMinutes);
    return `${startStr}–${endStr}`
}

function formatTrack(track) {
    if (!track) return "?";
    return `Rom ${track}`
}

function formatSpeakers(speakers) {
    if (!speakers) return "?";
    return speakers;
}

function EventList({ events }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Når</th>
          <th>Hvor</th>
          <th>Hva</th>
          <th>Hvem</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={event.docId}>
            <td>{formatTime(event.startTime, event.length)}</td>
            <td>{formatTrack(event.track)}</td>
            <td>
              <a href={event.href}>{event.label}</a>
            </td>
            <td>{formatSpeakers(event.speakers)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ProgramPage() {
  const events = [...getEvents()];

  events.sort((a, b) =>
    a.startMinutes > b.startMinutes ? -1 : a.startMinutes === b.startMinutes ? 1 : 0
  );

  return (
    <>
      <EventList events={events} />
    </>
  );
}