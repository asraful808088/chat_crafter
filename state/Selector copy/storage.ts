import { defineStore } from "pinia";
import state from "./state";
import funcItems from "./function";
export const useEntitiesSelectStore = defineStore("entities_Selector", {
  state: () => ({
    state: state,
  }),
  actions: {
    ...funcItems,
  },
});

export default useEntitiesSelectStore;
