export interface TimeSlot {
  id: number;
  start: string;
  end: string;
  startMin: number;
  endMin: number;
}

export interface Day {
  id: string;
  name: string;
}

export type ScheduleState = Record<string, boolean>;
