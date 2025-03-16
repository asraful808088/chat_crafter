import * as fs from "fs";
import { getQuery } from "h3";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
export default defineEventHandler((event) => {
  if (event.method != "DELETE") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];
  const query = getQuery(event);
  const entitiesName = query["item"];

  try {
    let filePath2 = path.resolve(
      process.cwd(),
      "doc",
      botname,
      query["of"],
      entitiesName,
      "regenerate"
    );

    const data2 = fs.readFileSync(`${filePath2}.json`, "utf-8");
    const parseData2 = JSON.parse(data2);
    parseData2.sents = parseData2.sents.map((element, index) => {
      if (element.sent == query["delete"]) {
        return {
          ...element,
          list: element.list.filter((element2) => {
            return element2.gen != query["gen"];
          }),
        };
      }
      return element;
    });
    fs.writeFileSync(`${filePath2}.json`, JSON.stringify(parseData2, null, 2));
    let flutting = [];
    parseData2?.sents?.forEach((ele) => {
      flutting = [...flutting, ...ele.list];
    });
    return { items: flutting };
  } catch (error) {
    return {};
  }

  return {};
});
