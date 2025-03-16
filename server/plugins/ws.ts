import WebSocket from "ws";
import { getWsInfo, setWsInfo } from "../cache/ws";
export default defineNitroPlugin((nitroApp: NitroApp) => {
  setTimeout(() => {
    try {
      const ws = new WebSocket("ws://localhost:8765");
      ws.on("open", () => {
        console.log("✅ Connected to WebSocket server");
        if (!getWsInfo()["ws"]) {
          setWsInfo({ ...getWsInfo(), ws: ws });
        }
      });
      ws.on("error", (error) => {
        console.log("❌ Connection Error")
      });
    } catch (error) {}
  }, 1000);
});
