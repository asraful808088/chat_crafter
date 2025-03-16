import { defineStore } from "pinia";
import state from "./state";
import funcItems from "./function";
export const useIntentesSelectStore = defineStore("intents_Selector", {
  state: () => ({
    state: state,
  }),
  actions: {
    ...funcItems,
  },
});

export default useIntentesSelectStore;
