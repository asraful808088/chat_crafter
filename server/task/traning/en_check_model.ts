import path from "path";
import {
  clearTraningInfo,
  getTrainState,
  getTraningInfo,
  setTrainState,
  setTraningInfo,
  state,
} from "~/server/cache/en_traningState";
import { getWsInfo } from "~/server/cache/ws";
import entitiesMapping from "~/server/util/entitiesMapping";
import { createJsonFile } from "~/util/json_read_write";
let init_stream = false;

export default function en_check_model(data, socket, io) {
  const wsinfo = getWsInfo();
  if (data["network"].length == 0) {
    socket.emit("en_traning", {
      success: false,
      msg: ["At least one Bidirectional layer is required."],
    });
  } else {
    let extrackEntities;
    if (!data["stop_mode"]) {
      extrackEntities = entitiesMapping(
        data["profile"],
        data["entities"]["item"]
      );
    }

    if (wsinfo["ws"]) {
      if (init_stream == false) {
        init_stream = true;
        wsinfo["ws"].on("message", (va) => {
          const parseData = JSON.parse(va.toString());
          if (parseData["emit_type"] == "updateing_model_en") {
            setTrainState(state.RUNNING);
            setTraningInfo(parseData["items"]);
            io.emit("en_traning_info", { items: parseData["items"] });
          } else if (parseData["emit_type"] == "finishing_model_en") {
            setTrainState(state.INIT_TRANING);
            const totalinfo = getTraningInfo();
            totalinfo.push(parseData["items"][0]);

            io.emit("en_traning_finish", {
              items: [parseData["items"][0]],
            });
            const parentDir = path.join(
              process.cwd(),
              "entities_record",
              parseData["items"][0]["profile_name"]
            );
            const jsonpath = path.join(
              process.cwd(),
              "entities_record",
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
      if (data["stop_mode"] == false && state.RUNNING == getTrainState()) {
        io.emit("en_reflection");
        return;
      }

      if (data["stop_mode"]) {
        if (wsinfo["ws"]) {
          wsinfo["ws"].send(
            JSON.stringify({
              type: "stop_en_main_model",
            })
          );
        }
        return;
      }
      const newMOdelname = `model-${Date.now()}`;
      socket.emit("en_traning", { success: true });
      clearTraningInfo();
      setTrainState(state.RUNNING);
      io.emit("en_reflection");
      const en_parentDir = path.join(process.cwd(), "python", "en_temp.json");
      createJsonFile(en_parentDir, {
        map_cat: {
          texts: extrackEntities["sentTxt"],
          label: extrackEntities["sentKey"],
        },
      });

      wsinfo["ws"].send(
        JSON.stringify({
          ...data["otherSets"],
          network: data["network"],
          type: "en_main_model",
          model_name: newMOdelname,
          profileName: data["profile"],
          entities: data["entities"]["name"],
        })
      );
    }
  }
}
