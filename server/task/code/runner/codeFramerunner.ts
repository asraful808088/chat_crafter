import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
import { getWsInfo } from "~/server/cache/ws";

export default function CodeFrameRunner(data, socket, io) {
  const wsinfo = getWsInfo();
  const pyfilePath = path.join(
    process.cwd(),
    "doc",
    botinfo["name"],
    data?.of,
    data.name,
    `${data.name}_${data?.of=='task'?'task':'custom'}_dev_test.py`
  );
  if (wsinfo["ws"]) {
    wsinfo["ws"].once("message", (va) => {
      const parseData = JSON.parse(va.toString());
      if (parseData["emit_type"] == "codeFrames_check_type_msg_return") {
        try {
          socket.emit("codeFrames_check_type_msg_return", {
            result: parseData["result"],
          });
        } catch (error) {}
      }
    });

    wsinfo["ws"].send(
      JSON.stringify({
        type: "code_frame",
        path: `${pyfilePath.replace(/\\/g, "/")}`,
      })
    );
  }
}
