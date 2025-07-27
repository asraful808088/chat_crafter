import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
import { getWsInfo } from "~/server/cache/ws";

export default function CodeRunner(data, socket, io) {
  const wsinfo = getWsInfo();
  const pyfilePath = path.join(
    process.cwd(),
    "doc",
    botinfo["name"],
    "condition",
    data.name,
    `${data.name}_dev_test.py`
  );
  console.log(pyfilePath)
  if (wsinfo["ws"]) {
    wsinfo["ws"].once("message", (va) => {
      const parseData = JSON.parse(va.toString());
      if (parseData["emit_type"] == "condition_check_type_msg_return") {
        try {
          socket.emit("condition_msg_return", {
            result: parseData["result"],
          });
        } catch (error) {}
      }
    });

    wsinfo["ws"].send(
      JSON.stringify({
        type: "condition_check_type",
        path: `${pyfilePath.replace(/\\/g, "/")}`,
      })
    );
  }
}
