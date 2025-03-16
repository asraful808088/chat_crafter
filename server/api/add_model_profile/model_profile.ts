import fs from "fs";
import path from "path";
import { botinfo } from "~/server/cache/botinfo";

function newProfileBuild(name) {
  return {
    label: name,
    type: "custom",
    learning_rate: {
      active: 0.01,
      list: [0.1, 0.01, 0.001, 0.005, 0.05, 0.0001, 0.0005],
    },
    test_rate: { active: 0.1, list: [0.1, 0.2, 0.3] },
    epoch: { active: 100, list: [100, 200, 500, 700, 1000, 2000] },
    out_dim: { active: 64, list: [60, 50, 55, 64, 32] },
    batch: { active: 32, list: [60, 50, 55, 64, 32] },
    network: [],

    en_network: [],
    batch: {
      active: 50,
      list: [50, 55, 64, 32],
    },
    activation: {
      active: "softmax",
      list: ["sigmoid", "softmax"],
    },
  };
}

export default defineEventHandler(async (event) => {
  if (event.method != "POST") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];
  const body = await readBody(event);

  try {
    const newProfileName = body["name"];
    if (!newProfileName) {
      throw "name empty";
    }
    let filePath = path.resolve(
      process.cwd(),
      "doc",
      botname,
      "profile",
      "profile"
    );
    const data = fs.readFileSync(`${filePath}.json`, "utf-8");
    const parseData = JSON.parse(data);
    const findProfile = parseData.profiles.find(
      (element) => element?.label == newProfileName
    );
    if (!findProfile) {
      parseData.profiles = [
        ...parseData.profiles,
        newProfileBuild(newProfileName.trim()),
      ];
    } else {
      parseData.profiles = [
        ...parseData.profiles,
        newProfileBuild(`${newProfileName.trim()}_${Date.now()}`),
      ];
    }
    fs.writeFileSync(`${filePath}.json`, JSON.stringify(parseData, null, 2));
    return { items: parseData.profiles };
  } catch (error) {
    return {};
  }

  return {};
});
