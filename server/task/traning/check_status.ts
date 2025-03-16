import { state, getTrainState,setTrainState} from "~/server/cache/traningState";
import {
    clearTraningInfo,
    getTraningInfo,
    setTraningInfo,
  } from "~/server/cache/traningState";
export default function checkTrainStatus(data, socket) {
    if (getTrainState()==state.INIT_TRANING) {
        socket.emit("init_train",{state:state.INIT_TRANING})
        
    }else if (getTrainState()==state.RUNNING) {
        const items = getTraningInfo()
        socket.emit("init_train",{state:state.RUNNING,items})
        
    }else if (getTrainState()==state.RUNNING_STOP) {
        
    }
}