import * as fs from "fs";
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
    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      body["of"],
      body["name"]
    );
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
      const files = [
        { name: "alternative.json", content: "{}" },
        { name: "regenerate.json", content: '{ "sents": [] }' },
        { name: `${body["name"]}.json`, content: '{\n"list_of_intent": []\n}' },
        {
          name: "details.json",
          content: `{"name":"${body["name"]}","des":"${body["des"]}","time":${Date.now()},"type":"${body["type"]}" }`,
        },
      ];
      files.forEach((file) => {
        const filePath2 = path.join(filePath, file.name);
        if (!fs.existsSync(filePath2)) {
          fs.writeFileSync(filePath2, file.content, "utf8");
        }
      });
      const fileitems = readAllDirs(
        path.resolve(process.cwd(), "doc", botname, body["of"])
      );
      return { items: fileitems };
    }
    return {};
  } catch (error) {
    return {};
  }

  return {};
});
