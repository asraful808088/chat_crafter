import { defineStore } from "pinia";
import entitiesFunc from "./function";
import entitiesState from "./state";
export const useIntentesStore = defineStore("intents", {
  state: () => ({
    entitiesState: entitiesState,
  }),
  actions: {
    ...entitiesFunc,
  },
});

export default useIntentesStore;
