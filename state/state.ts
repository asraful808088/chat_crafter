import { defineStore } from "pinia";
import profileFunc from "./profiles/function";
import profileState from "./profiles/state";
export const useBotbuilderStore = defineStore("storage", {
  state: () => ({
    profile: profileState,
  }),
  actions: {
    ...profileFunc,
  },
});
