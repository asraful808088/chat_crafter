import * as fs from "fs";
import * as path from "path";
import { uuid } from "uuidv4";
import ensureDirectories from "~/util/createProfileDirs";
export default defineEventHandler(async (event) => {
  if (event.method != "POST") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const body = await readBody(event);
  const filePath = path.resolve(process.cwd(), "doc");
  const configFilePath = path.join(filePath, "config.json");

  try {
    fs.statSync(filePath).isDirectory();
    try {
      const data = fs.readFileSync(configFilePath, "utf-8");
      const parseData = JSON.parse(data);
      const findName = parseData.bot_list.find(
        (element) => element.name == body.name.trim().replaceAll(" ", "_")
      );
      if (findName) {
        setResponseStatus(event, 401);
        return { statusCode: 401, msg: "this name already exist" };
      }
      parseData.bot_list = [
        {
          id: uuid(),
          name: body.name.trim().replaceAll(" ", "_"),
          time: Date.now(),
        },
        ...parseData.bot_list,
      ];
      fs.writeFileSync(configFilePath, JSON.stringify(parseData, null, 2));
      ensureDirectories(body.name.trim().replaceAll(" ", "_"));
      setResponseStatus(event, 201);
      return {
        ...parseData,
      };
    } catch (error) {
      const data = {
        time: Date.now(),
        bot_list: [
          {
            id: uuid(),
            name: body.name.trim().replaceAll(" ", "_"),
            time: Date.now(),
          },
        ],
      };
      fs.writeFileSync(configFilePath, JSON.stringify(data, null, 2));
      ensureDirectories(body.name.trim().replaceAll(" ", "_"));
      return {
        ...data,
      };
    }
  } catch (error) {
    const data = {
      time: Date.now(),
      bot_list: [
        {
          id: uuid(),
          name: body.name.trim().replaceAll(" ", "_"),
          time: Date.now(),
        },
      ],
    };

    fs.mkdirSync(filePath, { recursive: true });
    fs.writeFileSync(configFilePath, JSON.stringify(data, null, 2));
    ensureDirectories(body.name.trim().replaceAll(" ", "_"));
    setResponseStatus(event, 201);
    return {
      ...data,
    };
  }

  return {};
});
