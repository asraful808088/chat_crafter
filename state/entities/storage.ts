import { defineStore } from "pinia";
import entitiesFunc from "./function";
import entitiesState from "./state";
export const useEntitiesFuncStore = defineStore("entities", {
  state: () => ({
    entitiesState: entitiesState,
  }),
  actions: {
    ...entitiesFunc,
  },
});

export default useEntitiesFuncStore;
