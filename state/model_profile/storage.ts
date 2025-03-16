import { defineStore } from "pinia"
import modelState from "./state";
import modelFunc from "./function";
export const useModelNetworkStore = defineStore("network_model", {
  state: () => ({
    model: modelState,
  }),
  actions: {
    ...modelFunc,
  },
});

export default useModelNetworkStore;
