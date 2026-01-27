import { create } from "zustand";

const useStore = create((set) => ({
  scrollProgress:0,

  setScrollProgress : (val) => set({scrollProgress:val}),
}))

export default useStore;