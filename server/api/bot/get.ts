import * as fs from "fs";
import * as path from "path";
export default defineEventHandler((event) => {
  if (event.method != "GET") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const filePath = path.resolve(process.cwd(), "doc");
  const configFilePath = path.join(filePath, "config.json");

  try {
    fs.statSync(filePath).isDirectory();
    try {
      const data = fs.readFileSync(configFilePath, "utf-8");
      const parseData = JSON.parse(data);
      setResponseStatus(event, 201);
      return {
        ...parseData,
      };
    } catch (error) {
      const data = { time: Date.now(), bot_list: [] };
      fs.writeFileSync(configFilePath, JSON.stringify(data, null, 2));
      return {
        ...data,
      };
    }
  } catch (error) {
    const data = { time: Date.now(), bot_list: [] };

    fs.mkdirSync(filePath, { recursive: true });
    fs.writeFileSync(configFilePath, JSON.stringify(data, null, 2));
    setResponseStatus(event, 201);
    return {
      ...data,
    };
  }
});
