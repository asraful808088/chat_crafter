import { defineStore } from "pinia";
import entitiesFunc from "./function";
import entitiesState from "./state";
export const useRespopnseStore = defineStore("response", {
  state: () => ({
    entitiesState: entitiesState,
  }),
  actions: {
    ...entitiesFunc,
  },
});

export default useRespopnseStore;
