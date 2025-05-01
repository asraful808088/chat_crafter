import { getQuery } from "h3";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
import deleteDirWithContents from "~/util/deleteFiles";
import readAllDirs from "~/util/readDir";

export default defineEventHandler((event) => {
  if (event.method != "DELETE") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];
  const query = getQuery(event);
  try {
    const parentDirPath = path.join(
        process.cwd(),
        "python",
        "models",
        botname,
        query["item"]
      );
      const parentDirForReadPath = path.join(
        process.cwd(),
        "python",
        "models",
        botname
      );
      deleteDirWithContents(parentDirPath);
      const items = readAllDirs(parentDirForReadPath);
      return { items: items };
  } catch (error) {
    return {};
  }

  return {};
});
