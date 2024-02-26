import { ItemType } from "@/pages";
import { create } from "zustand";

export type UserState = {
  id: string;
  isLoggedIn: boolean;
  allDatas: ItemType[];
  isStart: boolean;
  setId: (id: string) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setAllDatas: (allDatas: ItemType[]) => void;
  setIsStart: (isStart: boolean) => void;
};

export const useUserStore = create<UserState>((set) => ({
  id: "",
  isLoggedIn: false,
  allDatas: [],
  isStart: false,
  setId: (by) => {
    set((state) => ({ ...state, id: by }));
  },
  setIsLoggedIn: (by) => {
    set((state) => ({ ...state, isLoggedIn: by }));
  },
  setAllDatas: (by) => {
    set((state) => ({ ...state, allDatas: by }));
  },
  setIsStart: (by) => {
    set((state) => ({ ...state, isStart: by }));
  },
}));
