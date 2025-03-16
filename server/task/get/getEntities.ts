import path from "path";
import { botinfo } from "~/server/cache/botinfo";
import readAllDirs from "~/util/readDir";
export default function getEntitiesItem(data, socket, io) {
  try {
    const botname = botinfo["name"];
    const parentDir = path.join(process.cwd(), "doc", botname, "entities");
    const items = readAllDirs(parentDir);
    socket.emit("entities_pass", { items: items });
  } catch (error) {}
}
