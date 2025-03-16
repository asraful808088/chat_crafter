import { state, getTrainState,setTrainState} from "~/server/cache/traningState";
import {
    clearTraningInfo,
    getTraningInfo,
    setTraningInfo,
  } from "~/server/cache/en_traningState";
export default function en_checkTrainStatus(data, socket) {
    if (getTrainState()==state.INIT_TRANING) {
        socket.emit("en_init_train",{state:state.INIT_TRANING})
        
    }else if (getTrainState()==state.RUNNING) {
        const items = getTraningInfo()
        socket.emit("en_init_train",{state:state.RUNNING,items})
        
    }else if (getTrainState()==state.RUNNING_STOP) {
        
    }
}