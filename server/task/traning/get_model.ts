import path from "path";
import { getWsInfo } from "~/server/cache/ws";
import readAllDirs from "~/util/readDir";
let wssocketActive = false;
let storeFunc;
export default function getModel(data, socket) {
  if (data.type == "main") {
    const parentDir = path.join(process.cwd(), "python", "models", data.name);
    const parentDir2 = path.join(
      process.cwd(),
      "python",
      "entities",
      data.name
    );

    const allitems = readAllDirs(parentDir);
    const allitems2 = readAllDirs(parentDir2);
    socket.emit("pass_model", {
      items: allitems,
      items2: allitems2,
    });
  } else if (data.type == "exe_main") {
    const wsinfo = getWsInfo();
    const exeC = path.join(
      process.cwd(),
      "python",
      "models",
      data.name,
      data.model,
      "generated.py"
    );
    if (wsinfo["ws"]) {
      wsinfo["ws"].once("message", (va) => {
        const parseData = JSON.parse(va.toString());
        if (parseData["emit_type"] == "get_msg_return") {
          socket.emit("msg_return", { result: parseData["result"] });
        }
      });

      wsinfo["ws"].send(
        JSON.stringify({
          type: "check_type",
          path: `${exeC.replace(/\\/g, "/")}`,
          msg: data.msg,
        })
      );
    }
  }
}
