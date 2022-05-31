import React from "react";
import { useCurrentSidebarCategory } from "@docusaurus/theme-common";
import styles from "./Program.module.css";

function getPauses() {
  const pauses = [
    {
      startTime: "09:00",
      length: 30,
      title: "Velkommen",
      description: "Mingling og lett servering",
    },
    {
      startTime: "10:20",
      length: 10,
      title: "Pause",
      description: "Kort pause",
    },
    {
      startTime: "11:50",
      length: 35,
      title: "Lunsj",
      description: "Varm- og kald mat buffet",
    },
    {
      startTime: "13:05",
      length: 35,
      title: "Pause",
      description: "Dessert, kake, kaffe/te",
    },
    {
      startTime: "15:00",
      length: (24 - 15) * 60 - 1,
      title: "Sosialt",
      description: "Veien går videre til Beer Palace, rett rundt hjørnet!",
    },
  ].map((pause) => {
    const [hours, minutes] = (pause.startTime || "00:00")
      .split(/:|\./, 2)
      .map((str) => parseInt(str.trim(), 10));
    const startMinutes = minutes + hours * 60;
    const endMinutes = startMinutes + pause.length;

    return { pause: true, startMinutes, endMinutes, ...pause };
  });

  return pauses;
}

function intersects(slotA, slotB) {
  const aStart = slotA.startMinutes,
    aEnd = slotA.endMinutes,
    bStart = slotB.startMinutes,
    bEnd = slotB.endMinutes;

  return aStart <= bEnd && aEnd >= bStart;
}

function mergeSlots(slots) {
  let modifications;
  let current = slots;
  do {
    modifications = 0;
    current.forEach((slot, currentIndex) => {
      if (slot.events[0].pause) return;

      for (let i = currentIndex + 1; i < current.length; i++) {
        const otherSlot = current[i];
        if (
          otherSlot.obsolete ||
          otherSlot.events[0].pause ||
          !intersects(slot, otherSlot)
        ) {
          continue;
        }

        slot.events.push(...otherSlot.events);
        slot.startMinutes = Math.min(slot.startMinutes, otherSlot.startMinutes);
        slot.endMinutes = Math.max(slot.endMinutes, otherSlot.endMinutes);
        otherSlot.obsolete = true;
        modifications++;
      }
    });

    current = current.filter((slot) => !slot.obsolete);
  } while (modifications > 0);
  return current;
}

function groupSlots(slots) {
  slots.forEach((slot) => {
    slot.tracks = {};
    slot.events.sort((a, b) => a.startMinutes - b.startMinutes);
    slot.events.forEach((event) => {
      if (!slot.tracks[event.track]) slot.tracks[event.track] = [];
      slot.tracks[event.track].push(event);
    });
  });
}

function sortSlots(slots) {
  slots.sort((slotA, slotB) => slotA.startMinutes - slotB.startMinutes);
}

function getSlotsByEvents(events) {
  const slots = events.map((event) => {
    return {
      startMinutes: event.startMinutes,
      endMinutes: event.endMinutes,
      events: [event],
    };
  });
  const merged = mergeSlots(slots);
  groupSlots(merged);
  sortSlots(merged);
  return merged;
}

function getEvents(items) {
  return items.map(mapItem);
}

function mapItem(item) {
  const { docId, customProps } = item;
  const startTime = customProps?.start;
  const length = customProps?.length;
  const speakers = customProps?.speakers;
  const track = customProps?.track;

  const [hours, minutes] = (startTime || "00:00")
    .split(/:|\./, 2)
    .map((str) => parseInt(str.trim(), 10));
  const startMinutes = minutes + hours * 60;
  const endMinutes = startMinutes + length;

  return {
    ...item,
    startTime,
    startMinutes,
    endMinutes,
    length,
    speakers,
    track,
  };
}

function formatMinutes(totalMinutes) {
  const hours = ~~(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}.${minutes
    .toString()
    .padStart(2, "0")}`;
}

function formatTime(startMinutes, endMinutes) {
  if (!startMinutes || !endMinutes) return "?";
  const startStr = formatMinutes(startMinutes);
  const endStr = formatMinutes(endMinutes);
  return `${startStr}–${endStr}`;
}

function formatTrack(track) {
  if (!track) return "?";
  const rooms = {
    1: "Storsalen / Felix 1",
    2: "Brannkassse (etg. K3)",
    3: "Norden (etg. K3)",
  };
  return rooms[track] || `Rom ${track}`;
}

function formatSpeakers(speakers) {
  if (!speakers) return "?";
  return speakers;
}

function formatLength(length) {
  if (length <= 10) return "⚡️";
  if (length <= 20) return "🚤";
  return "⛵️";
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
            <td className={styles.timeCell}>
              {formatTime(event.startMinutes, event.endMinutes)}
            </td>
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

function EventCell({ event, rowSpan }) {
  if (!event) return null;

  return (
    <td rowSpan={rowSpan}>
      <span className={styles.eventSpeaker}>
        {formatSpeakers(event.speakers)}
      </span>
      <a href={event.href}>{formatLength(event.length) + " " + event.label}</a>
    </td>
  );
}

function SlotRows({ slot }) {
  const rows = Math.max(
    ...Object.values(slot.tracks).map((track) => track.length)
  );
  const tracks = [1, 2, 3];
  const rowArray = [...Array(rows)].fill(0);

  if (slot.events[0]?.pause) {
    const pause = slot.events[0];
    return (
      <>
        <tr className={styles.pauseRow}>
          <td className={styles.timeCell}>
            {formatTime(slot.startMinutes, slot.endMinutes)}
          </td>
          <td colSpan={tracks.length}>
            <span className={styles.pauseTitle}>{pause.title}</span>
            <span className={styles.pauseDescription}>{pause.description}</span>
          </td>
        </tr>
      </>
    );
  }

  return (
    <>
      <tr>
        <td></td>
        {tracks.map((track) => (
          <th key={track}>{formatTrack(track)}</th>
        ))}
      </tr>
      {rowArray.map((rowNum, rowIdx) => (
        <tr key={rowIdx}>
          {rowIdx === 0 && (
            <td rowSpan={rows} className={styles.timeCell}>
              {formatTime(slot.startMinutes, slot.endMinutes)}
            </td>
          )}
          {tracks.map((track, idx) =>
            slot.tracks[track] && slot.tracks[track][rowIdx] ? (
              <EventCell
                key={rowIdx + "_" + idx}
                event={slot.tracks[track][rowIdx]}
                rowSpan={
                  slot.tracks[track][rowIdx + 1] ? undefined : rows - rowIdx
                }
              />
            ) : rowIdx < 1 ? (
              <td key={rowIdx + "_" + idx}></td>
            ) : null
          )}
        </tr>
      ))}
    </>
  );
}

function SlotOverview({ slots }) {
  return (
    <table>
      <tbody>
        {slots.map((slot, idx) => (
          <SlotRows key={idx} slot={slot} />
        ))}
      </tbody>
    </table>
  );
}

export default function ProgramPage({ items }) {
  const events = [...getEvents(items), ...getPauses()];
  events.sort((a, b) =>
    a.startMinutes > b.startMinutes
      ? 1
      : a.startMinutes === b.startMinutes
      ? 0
      : -1
  );

  const slots = getSlotsByEvents(events);

  return (
    <>
      <SlotOverview slots={slots} />
    </>
  );
}
