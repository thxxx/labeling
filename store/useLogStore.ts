import { create } from "zustand";

export type LabelingLogType = {
  start_at: Date;
  label_num: number;
  user_id: string;
  finish_at: Date;
};

export type LogState = {
  logId: string;
  logNum: number;
  labelLogs: LabelingLogType[];
  startedAt: Date | null;
  setLogId: (logId: string) => void;
  setLogNum: (logNum: number) => void;
  setLabelLogs: (labelLogs: LabelingLogType[]) => void;
  setStartedAt: (startedAt: Date | null) => void;
};

export const useLogStore = create<LogState>((set) => ({
  logId: "",
  logNum: 0,
  labelLogs: [],
  startedAt: null,
  setLogId: (by) => {
    set((state) => ({ ...state, logId: by }));
  },
  setLogNum: (by) => {
    set((state) => ({ ...state, logNum: by }));
  },
  setLabelLogs: (by) => {
    set((state) => ({ ...state, labelLogs: by }));
  },
  setStartedAt: (by) => {
    set((state) => ({ ...state, startedAt: by }));
  },
}));
