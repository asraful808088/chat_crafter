import * as fs from "fs";
import * as path from "path";
import deleteParentDirectory from "~/util/deleteProfile";
export default defineEventHandler(async (event) => {
  if (event.method !== "DELETE") {
    throw createError({ statusCode: 405, message: "Method Not Allowed" });
  }

  const { profilename } = getQuery(event);
  const filePath = path.resolve(process.cwd(), "doc");
  const configFilePath = path.join(filePath, "config.json");

  if (!profilename) {
    throw createError({
      statusCode: 400,
      message: "Missing required parameter: profilename",
    });
  }
  try {
    const data = fs.readFileSync(configFilePath, "utf-8");
    const parseData = JSON.parse(data);
    const items = parseData.bot_list.filter(
      (element) => element.name != profilename.trim()
    );
    parseData.bot_list = items;
    fs.writeFileSync(configFilePath, JSON.stringify(parseData, null, 2));
    setResponseStatus(event, 201);
    deleteParentDirectory(profilename.trim());
    return { ...parseData };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "server side error",
    });
  }
  throw createError({
    statusCode: 500,
    message: "server side error",
  });
});
