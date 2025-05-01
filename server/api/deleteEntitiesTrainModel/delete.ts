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
  const entitiesName = query["item"];
  try {
    if (query["of"] == "null") {
      const parentDirPath = path.join(
        process.cwd(),
        "python",
        "entities",
        botname,
        entitiesName
      );
      const parentDirForReadPath = path.join(
        process.cwd(),
        "python",
        "entities",
        botname
      );
      deleteDirWithContents(parentDirPath);
      deleteDirWithContents(
        path.join(process.cwd(), "doc", botname, "entities_box", query["item"])
      );
      const items = readAllDirs(parentDirForReadPath);
      return { items: items };
    }

    const parentDirPath = path.join(
      process.cwd(),
      "python",
      "entities",
      botname,
      query["of"],
      query["item"]
    );
    const parentDirForReadPath = path.join(
      process.cwd(),
      "python",
      "entities",
      botname,
      query["of"]
    );
    deleteDirWithContents(parentDirPath);
    deleteDirWithContents(
      path.join(process.cwd(), "doc", botname, "entities_box", query["of"])
    );
    const items = readAllDirs(parentDirForReadPath);
    return { items: items };
  } catch (error) {
    return {};
  }

  return {};
});
