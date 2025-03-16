export const state = {
  RUNNING: "RUNNING",
  RUNNING_STOP: "RUNNING_STOP",
  INIT_TRANING: "INIT_TRANING",
};
let currentState = state.INIT_TRANING;
let storeTraningRate = [];

export function getTrainState() {
  return currentState;
}

export function setTrainState(state) {
  currentState = state;
}

function keepOneEpoch(arr) {
  const seen = new Set();
  return arr.filter((item) => {
    if (!seen.has(item.epoch)) {
      seen.add(item.epoch);
      return true;
    }
    return false;
  });
}

export function setTraningInfo(list) {
  storeTraningRate = [...storeTraningRate, ...list];
  storeTraningRate = keepOneEpoch(storeTraningRate);
}

export function getTraningInfo() {
  return storeTraningRate
}
export function clearTraningInfo() {
  storeTraningRate = [];
}
