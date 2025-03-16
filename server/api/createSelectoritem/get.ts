import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
import readAllDirs from "~/util/readDir";
export default defineEventHandler(async (event) => {
  if (event.method != "POST") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];

  try {
    const body = await readBody(event);
    const fileitems = readAllDirs(
      path.resolve(process.cwd(), "doc", botname, body["of"].replace("-","_"))
    );
    return { items: fileitems };
  } catch (error) {
    return {};
  }

  return {};
});
