import path from "path";
import {
  clearTraningInfo,
  getTrainState,
  getTraningInfo,
  setTrainState,
  setTraningInfo,
  state,
} from "~/server/cache/traningState";
import { getWsInfo } from "~/server/cache/ws";
import sentMapping from "~/server/util/sentMaping";
import validateLayers from "~/util/layer_validator";
import { createDirAndSaveJSON } from "~/util/recordEnty";
let init_stream = false
export default function checkmodel(data, socket, io) {
  const wsinfo = getWsInfo();
  if (wsinfo["ws"]) {
    if (init_stream==false) {
      init_stream = true
      wsinfo["ws"].on("message", (va) => {
        const parseData = JSON.parse(va.toString());
        if (parseData["emit_type"] == "updateing_model") {
          setTrainState(state.RUNNING);
          setTraningInfo(parseData["items"]);
          io.emit("traning_info", { items: parseData["items"] });
        } else if (parseData["emit_type"] == "finishing_model") {
          setTrainState(state.INIT_TRANING);
          const totalinfo = getTraningInfo();
          totalinfo.push(parseData["items"][0]);
          io.emit("traning_finish", {
            items: [parseData["items"][0]],
          });
          const parentDir = path.join(
            process.cwd(),
            "record",
            parseData["items"][0]["profile_name"]
          );
          const jsonpath = path.join(
            process.cwd(),
            "record",
            parseData["items"][0]["profile_name"],
            parseData["items"][0]["model_name"]
          );
          try {
            createDirAndSaveJSON(
              parentDir,
              {
                model_name: parseData["items"][0]["model_name"],
                profile_name: parseData["items"][0]["profile_name"],
                totalinfo,
              },
              `${jsonpath}.json`
            );
          } catch (error) {}
          clearTraningInfo();
        }
      });
    }
    
  }

  if (data["stop_mode"] == false && state.RUNNING == getTrainState()) {
    io.emit("reflection");
    return;
  }

  if (data["stop_mode"]) {
    if (wsinfo["ws"]) {
      wsinfo["ws"].send(
        JSON.stringify({
          type: "stop_main_model",
        })
      );
    }
    return;
  }

  const result = validateLayers(data["network"]);
  if (result["success"]) {
    socket.emit("traing", { success: true });
    if (wsinfo["ws"]) {
      const txtProcess = sentMapping(data["profile"]);
      const newMOdelname = `model-${Date.now()}`;
      clearTraningInfo();
      setTrainState(state.RUNNING);
      io.emit("reflection");
      wsinfo["ws"].send(
        JSON.stringify({
          ...data["otherSets"],
          map_cat: {
            texts: txtProcess["sentTxt"],
            label: txtProcess["sentKey"],
          },
          network: data["network"],
          type: "main_model",
          model_name: newMOdelname,
          profileName: data["profile"],
        })
      );
    }

    // console.log(data["otherSets"]);
  } else {
    socket.emit("traing", { success: false, msg: result["msg"] });
  }
}
