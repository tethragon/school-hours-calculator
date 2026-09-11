import { Day, TimeSlot } from './types';

export const days: Day[] = [
  { id: 'mon', name: 'Δευτέρα' },
  { id: 'tue', name: 'Τρίτη' },
  { id: 'wed', name: 'Τετάρτη' },
  { id: 'thu', name: 'Πέμπτη' },
  { id: 'fri', name: 'Παρασκευή' },
];

export const timeSlots: TimeSlot[] = [
  { id: 1, start: '08:00', end: '08:55', startMin: 8 * 60, endMin: 8 * 60 + 55 },
  { id: 2, start: '09:00', end: '09:45', startMin: 9 * 60, endMin: 9 * 60 + 45 },
  { id: 3, start: '10:00', end: '10:45', startMin: 10 * 60, endMin: 10 * 60 + 45 },
  { id: 4, start: '10:50', end: '11:35', startMin: 10 * 60 + 50, endMin: 11 * 60 + 35 },
  { id: 5, start: '11:45', end: '12:25', startMin: 11 * 60 + 45, endMin: 12 * 60 + 25 },
  { id: 6, start: '12:30', end: '13:10', startMin: 12 * 60 + 30, endMin: 13 * 60 + 10 },
  { id: 7, start: '13:25', end: '14:05', startMin: 13 * 60 + 25, endMin: 14 * 60 + 5 },
  { id: 8, start: '14:10', end: '15:00', startMin: 14 * 60 + 10, endMin: 15 * 60 },
];
