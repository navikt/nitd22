import React from "react";
import { useCurrentSidebarCategory } from "@docusaurus/theme-common";
import styles from './Program.module.css';

function intersects(slotA, slotB) {
  const aStart = slotA.startMinutes,
        aEnd = slotA.endMinutes,
        bStart = slotB.startMinutes,
        bEnd = slotB.endMinutes;
    
  return (aStart <= bStart && aEnd <= bEnd && aEnd > bStart) ||
         (aStart >= bStart && aStart < bEnd);
}

function mergeSlots(slots) {
  let modifications;
  let current = slots;
  do {
    modifications = 0;
    current.forEach((slot, currentIndex) => {
      for (let i = currentIndex + 1; i < current.length; i++) {
        const otherSlot = current[i];
        if (!otherSlot.obsolete && intersects(slot, otherSlot)) {
          slot.events.push(...otherSlot.events);
          slot.startMinutes = Math.min(slot.startMinutes, otherSlot.startMinutes);
          slot.endMinutes = Math.max(slot.endMinutes, otherSlot.endMinutes);
          otherSlot.obsolete = true;
          modifications++;
        }
      }
    })

    current = current.filter((slot) => !slot.obsolete);
  } while (modifications > 0);
  return current;
}

function groupSlots(slots) {
  slots.forEach((slot) => {
    slot.tracks = {};
    slot.events.sort((a, b) => a.startMinutes - b.startMinutes)
    slot.events.forEach((event) => {
      if (!slot.tracks[event.track]) slot.tracks[event.track] = [];
      slot.tracks[event.track].push(event);
    })
  });
}

function sortSlots(slots) {
  slots.sort((slotA, slotB) => slotA.startMinutes - slotB.startMinutes);
}

function getSlotsByEvents(events) {
  const slots = events.map((event) => {
    return { startMinutes: event.startMinutes, endMinutes: event.endMinutes, events: [ event ]};
  })
  const merged = mergeSlots(slots);
  groupSlots(merged);
  sortSlots(merged);
  return merged;
}

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
  const endMinutes = startMinutes + length;

  return {
    ...item,
    startTime,
    startMinutes,
    endMinutes,
    length,
    speakers,
    track
  };
}

function formatMinutes(totalMinutes) {
    const hours = ~~(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}.${minutes.toString().padStart(2, "0")}`;
}

function formatTime(startMinutes, endMinutes) {
    if (!startMinutes || !endMinutes) return "?";
    const startStr = formatMinutes(startMinutes);
    const endStr = formatMinutes(endMinutes);
    return `${startStr}–${endStr}`
}

function formatTrack(track) {
    if (!track) return "?";
    const rooms = {
      1: "Storsalen",
      2: "Brannkassse",
      3: "Norden"
    }
    return rooms[track] || `Rom ${track}`
}

function formatSpeakers(speakers) {
    if (!speakers) return "?";
    return speakers;
}

function formatLength(length) {
  if (length <= 10) return '⚡️';
  if (length <= 20) return '🚤'
  return '🐌'
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
            <td className={styles.timeCell}>{formatTime(event.startMinutes, event.endMinutes)}</td>
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

function EventCell({ event }) {
  if (!event) return null;

  return <td>
    {formatLength(event.length)} <b>{formatSpeakers(event.speakers)}</b>: <a href={event.href}>{event.label}</a>
  </td>
}

function SlotRows({ slot, keynote }) {
  const rows = Math.max(...Object.values(slot.tracks).map((track) => track.length));
  const tracks = [1,2,3];

  return <><tr>
    <td></td>
    {tracks.map((track) => <th>{formatTrack(track)}</th>)}
    </tr>
    {[...new Array(rows)].map((_, rowIdx) => (
      <tr>
        {rowIdx === 0? <td rowSpan={rows}>{formatTime(slot.startMinutes, slot.endMinutes)}</td> : null}
        {tracks.map((track) => ( slot.tracks[track] ? <EventCell event={slot.tracks[track][rowIdx]} /> : null))}</tr>
    ))}
    </>
}

function SlotOverview({ slots }) {
  return (
    <table>
      <tbody>
        {slots.map((slot) => <SlotRows slot={slot} />)}
      </tbody>
    </table>
  )
}

export default function ProgramPage() {
  const events = [...getEvents()];
  events.sort((a, b) =>
    a.startMinutes > b.startMinutes ? 1 : a.startMinutes === b.startMinutes ? 0 : -1
  );

  const slots = getSlotsByEvents(events);

  return (
    <>
      <SlotOverview slots={slots} />
      <EventList events={events} />
    </>
  );
}