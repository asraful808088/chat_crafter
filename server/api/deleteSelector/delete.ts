import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
import deleteDirWithContents from "~/util/deleteFiles";
import readAllDirs from "~/util/readDir";
export default defineEventHandler(async (event) => {
  if (event.method != "DELETE") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];

  try {
    const query = getQuery(event);
    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      query["of"],
      query["name"]
    );
    deleteDirWithContents(
      path.resolve(process.cwd(), "doc", botname, query["of"], query["name"])
    );
    const fileitems = readAllDirs(
      path.resolve(process.cwd(), "doc", botname, query["of"])
    );
    return { items: fileitems };
  } catch (error) {
    return {};
  }

  return {};
});
