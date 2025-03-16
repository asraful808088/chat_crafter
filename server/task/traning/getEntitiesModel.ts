import path from "path";
import { getWsInfo } from "~/server/cache/ws";
import readAllDirs from "~/util/readDir";
let wssocketActive = false;
let storeFunc;
export default function getEntitiesModel(data, socket) {
  if (data.type == "main") {
    const parentDir = path.join(
      process.cwd(),
      "python",
      "entities",
      data.name,
      data.i
    );

    const allitems = readAllDirs(parentDir);
    socket.emit("pass_model2", {
      items: allitems,
    });
  } else if (data.type == "exe_main") {
    const wsinfo = getWsInfo();
    const exeC = path.join(
      process.cwd(),
      "python",
      "entities",
      data.name,
      data.ch,
      data.model,
      "generated.py"
    );
    if (wsinfo["ws"]) {
      wsinfo["ws"].once("message", (va) => {
        const parseData = JSON.parse(va.toString());
        if (parseData["emit_type"] == "entities_check_type_msg_return") {
          let fullMessage = "";
          for (const element of parseData["result"]) {
            fullMessage += `(${element.join(" ⇛ ")})`;
            fullMessage += "\n";
          }
          socket.emit("en_msg_return", { result: fullMessage });
        }
      });

      wsinfo["ws"].send(
        JSON.stringify({
          type: "entities_check_type",
          path: `${exeC.replace(/\\/g, "/")}`,
          msg: data.msg,
        })
      );
    }
  }
}
