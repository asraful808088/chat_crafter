import fs from "fs";
import path from "path";
import { botinfo } from "~/server/cache/botinfo";
import {
  createChatHandel,
  createControllerBuilder,
  createServerCode,
} from "~/server/util/code";
import findNames from "~/server/util/extrator_module_name";
import zipFolder from "~/util/convertZip";
import copyDirectory from "~/util/copy";
import checkAndCreateDir from "~/util/createDir";
import deleteDirWithContents from "~/util/deleteFiles";
import readAllDirs from "~/util/readDir";
import zipFolder from "~/util/convertZip";

function getUniqueList(arr, key) {
  const uniqueMap = new Map();

  arr.forEach((obj) => {
    if (!uniqueMap.has(JSON.stringify(obj))) {
      uniqueMap.set(JSON.stringify(obj), obj);
    }
  });

  return Array.from(uniqueMap.values());
}

function buildIntentType(name, profile) {
  const intentFilePath = fs.readFileSync(
    path.join(process.cwd(), "doc", profile, "intents", name, `details.json`)
  );
  const parsedata = JSON.parse(intentFilePath);
  return parsedata["type"];
}

function traverseAndReplaceTargets(data, profile) {
  return data.map((item) => {
    if (item.target) {
      item.target = buildIntentType(item.target, profile);
    }
    if (item.list_of_store) {
      item.list_of_store = traverseAndReplaceTargets(
        item.list_of_store,
        profile
      );
    }
    return item;
  });
}

function responseAndConditionFetcher(d, p, profileName, randomModel, botname) {
  let response = [];
  let condition = [];
  const getResponseWithCondition = (data, profile) => {
    data.forEach((item) => {
      if (item.target) {
        item.target = buildIntentType(item.target, profile);
      }
      if (item.condition) {
        condition.push({ condition: item.condition });
      }

      if (item.list_of_response.length != 0) {
        response = [...response, ...item.list_of_response];
      }

      if (item.list_of_store) {
        item.list_of_store = getResponseWithCondition(
          item.list_of_store,
          profile
        );
      }
    });
  };
  getResponseWithCondition(d, p);

  copyDirectory(
    path.join(
      process.cwd(),
      "doc",
      botname,
      "response",
      `${"final_default_fallback"}`
    ),
    path.join(
      profileName,
      `bot_${randomModel}`,
      "response",
      "final_default_fallback"
    )
  );





 copyDirectory(
    path.join(
      process.cwd(),
      "doc",
      botname,
      "response",
      `${"default_fallback"}`
    ),
    path.join(
      profileName,
      `bot_${randomModel}`,
      "response",
      "default_fallback"
    )
  );










  for (const element of getUniqueList(response)) {
    try {
      if (element["type"] == "response") {
        checkAndCreateDir(
          path.join(
            profileName,
            `bot_${randomModel}`,
            "response",
            element["target"]
          )
        );
        copyDirectory(
          path.join(
            process.cwd(),
            "doc",
            botname,
            "response",
            `${element["target"]}`
          ),
          path.join(
            profileName,
            `bot_${randomModel}`,
            "response",
            element["target"]
          )
        );
      } else {
        checkAndCreateDir(
          path.join(
            profileName,
            `bot_${randomModel}`,
            "custom_actions",
            element["target"]
          )
        );
        copyDirectory(
          path.join(
            process.cwd(),
            "doc",
            botname,
            "custom_actions",
            `${element["target"]}`
          ),
          path.join(
            profileName,
            `bot_${randomModel}`,
            "custom_actions",
            element["target"]
          )
        );
        const files = readAllDirs(
          path.join(
            process.cwd(),
            "doc",
            botname,
            "custom_actions",
            `${element["target"]}`
          ),
          true
        ).filter((element, index) => {
          return !(
            element == "dev_test.py" ||
            element == "run.py" ||
            element == "__pycache__" ||
            element == "details.json"
          );
        });
        for (const element2 of files) {
          const readFile = fs.readFileSync(
            path.join(
              process.cwd(),
              "doc",
              botname,
              "custom_actions",
              `${element["target"]}`,
              `${element2}`
            ),
            "utf-8"
          );
          try {
            for (const element3 of findNames(readFile)["task"]) {
              checkAndCreateDir(
                path.join(profileName, `bot_${randomModel}`, "task", element3)
              );
              copyDirectory(
                path.join(process.cwd(), "doc", botname, "task", `${element3}`),
                path.join(profileName, `bot_${randomModel}`, "task", element3)
              );
            }
          } catch (error) {}
          try {
            for (const element3 of findNames(readFile)["entities"]) {
              checkAndCreateDir(
                path.join(profileName, `bot_${randomModel}`, "entities_box")
              );
              checkAndCreateDir(
                path.join(
                  profileName,
                  `bot_${randomModel}`,
                  "entities_box",
                  element3
                )
              );
              copyDirectory(
                path.join(
                  process.cwd(),
                  "doc",
                  botname,
                  "entities_box",
                  `${element3}`
                ),
                path.join(
                  profileName,
                  `bot_${randomModel}`,
                  "entities_box",
                  element3
                )
              );
            }
          } catch (error) {}
        }
      }
    } catch (error) {}
  }
  for (const element of getUniqueList(condition)) {
    checkAndCreateDir(
      path.join(
        profileName,
        `bot_${randomModel}`,
        "condition",
        element["condition"]
      )
    );
    copyDirectory(
      path.join(
        process.cwd(),
        "doc",
        botname,
        "condition",
        `${element["condition"]}`
      ),
      path.join(
        profileName,
        `bot_${randomModel}`,
        "condition",
        element["condition"]
      )
    );
    findNames;
    const files = readAllDirs(
      path.join(
        process.cwd(),
        "doc",
        botname,
        "condition",
        `${element["condition"]}`
      ),
      true
    ).filter((element, index) => {
      return !(
        element == "dev_test.py" ||
        element == "run.py" ||
        element == "__pycache__" ||
        element == "details.json" ||
        element == "cat.py"
      );
    });

    for (const element2 of files) {
      const readFile = fs.readFileSync(
        path.join(
          process.cwd(),
          "doc",
          botname,
          "condition",
          `${element["condition"]}`,
          `${element2}`
        ),
        "utf-8"
      );
      try {
        for (const element3 of findNames(readFile)["task"]) {
          checkAndCreateDir(
            path.join(profileName, `bot_${randomModel}`, "task", element3)
          );
          copyDirectory(
            path.join(process.cwd(), "doc", botname, "task", `${element3}`),
            path.join(profileName, `bot_${randomModel}`, "task", element3)
          );
        }
      } catch (error) {}
      try {
        for (const element3 of findNames(readFile)["entities"]) {
          checkAndCreateDir(
            path.join(profileName, `bot_${randomModel}`, "entities_box")
          );
          checkAndCreateDir(
            path.join(
              profileName,
              `bot_${randomModel}`,
              "entities_box",
              element3
            )
          );
          copyDirectory(
            path.join(
              process.cwd(),
              "doc",
              botname,
              "entities_box",
              `${element3}`
            ),
            path.join(
              profileName,
              `bot_${randomModel}`,
              "entities_box",
              element3
            )
          );
        }
      } catch (error) {}
    }
  }
}

function modifyScripts(botname, body) {
  const fileContent = fs.readFileSync(
    path.join(
      path.join(process.cwd(), "doc", botname, "scripts", body["scripts"]),
      `${body["scripts"]}.json`
    ),
    "utf-8"
  );
  return traverseAndReplaceTargets(
    JSON.parse(fileContent)["list_of_intent"],
    botname
  );
}

export default defineEventHandler(async (event) => {
  if (event.method != "POST") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];
  const body = await readBody(event);
  try {
    if (body["buildType"] == "scripts_only") {
      const maindir = path.join(process.cwd(), "build", "scripts_only");
      const profileName = path.join(
        process.cwd(),
        "build",
        "scripts_only",
        botname
      );
      checkAndCreateDir(maindir);
      checkAndCreateDir(profileName);
      fs.writeFileSync(
        `${profileName}/${body["scripts"]}.json`,
        JSON.stringify({
          script: modifyScripts(botname, body),
        })
      );
    } else if (body["buildType"] == "server_with_model") {
      const maindir = path.join(process.cwd(), "build", "server_with_model");
      const profileName = path.join(
        process.cwd(),
        "build",
        "server_with_model",
        botname
      );
      const fileContent = fs.readFileSync(
        path.join(
          path.join(process.cwd(), "doc", botname, "scripts", body["scripts"]),
          `${body["scripts"]}.json`
        ),
        "utf-8"
      );
      const randomModel = Date.now();
      checkAndCreateDir(maindir);
      checkAndCreateDir(profileName);
      checkAndCreateDir(path.join(profileName, `bot_${randomModel}`));
      checkAndCreateDir(
        path.join(profileName, `bot_${randomModel}`, "condition")
      );
      checkAndCreateDir(path.join(profileName, `bot_${randomModel}`, "models"));
      checkAndCreateDir(
        path.join(profileName, `bot_${randomModel}`, "custom_actions")
      );
      checkAndCreateDir(
        path.join(profileName, `bot_${randomModel}`, "response")
      );
      checkAndCreateDir(
        path.join(profileName, `bot_${randomModel}`, "scripts")
      );
      checkAndCreateDir(path.join(profileName, `bot_${randomModel}`, "task"));
      fs.writeFileSync(
        path.join(
          profileName,
          `bot_${randomModel}`,
          "scripts",
          `${body["scripts"]}.json`
        ),
        JSON.stringify({
          script: modifyScripts(botname, body),
        })
      );
      fs.writeFileSync(
        `${profileName}/${`bot_${randomModel}`}/controller.py`,
        createControllerBuilder(body["scripts"], body["model"])
      );
      fs.writeFileSync(
        `${profileName}/${`bot_${randomModel}`}/handler.py`,
        createChatHandel()
      );
      fs.writeFileSync(
        `${profileName}/${`bot_${randomModel}`}/main.py`,
        createServerCode()
      );
      copyDirectory(
        path.join(
          process.cwd(),
          "python",
          "models",
          botname,
          `${body["model"]}`
        ),
        path.join(profileName, `bot_${randomModel}`, "models", body["model"])
      );
      responseAndConditionFetcher(
        JSON.parse(fileContent)["list_of_intent"],
        botname,
        profileName,
        randomModel,
        botname
      );
    } else if (body["buildType"] == "training_model") {
      const maindir = path.join(process.cwd(), "build", "training_model");
      const profileName = path.join(
        process.cwd(),
        "build",
        "training_model",
        botname
      );
      checkAndCreateDir(maindir);
      checkAndCreateDir(profileName);
      copyDirectory(
        path.join(
          process.cwd(),
          "python",
          "models",
          botname,
          `${body["model"]}`
        ),
        path.join(profileName, "models", body["model"])
      );
    } else if (body["buildType"] == "model_pack") {

















      const maindir = path.join(process.cwd(), "build", "model_pack");
      const profileName = path.join(
        process.cwd(),
        "build",
        "model_pack",
        botname
      );
      checkAndCreateDir(maindir);
      checkAndCreateDir(profileName);
      const fileContent = fs.readFileSync(
        path.join(
          path.join(process.cwd(), "doc", botname, "scripts", body["scripts"]),
          `${body["scripts"]}.json`
        ),
        "utf-8"
      );
      const randomModel = Date.now();
      checkAndCreateDir(maindir);
      checkAndCreateDir(profileName);
      checkAndCreateDir(path.join(profileName, `bot_${randomModel}`));
      checkAndCreateDir(
        path.join(profileName, `bot_${randomModel}`, "condition")
      );
      checkAndCreateDir(path.join(profileName, `bot_${randomModel}`, "models"));
      checkAndCreateDir(
        path.join(profileName, `bot_${randomModel}`, "custom_actions")
      );
      checkAndCreateDir(
        path.join(profileName, `bot_${randomModel}`, "response")
      );
      checkAndCreateDir(
        path.join(profileName, `bot_${randomModel}`, "scripts")
      );
      checkAndCreateDir(path.join(profileName, `bot_${randomModel}`, "task"));
      fs.writeFileSync(
        path.join(
          profileName,
          `bot_${randomModel}`,
          "scripts",
          `${body["scripts"]}.json`
        ),
        JSON.stringify({
          script: modifyScripts(botname, body),
        })
      );
      fs.writeFileSync(
        `${profileName}/${`bot_${randomModel}`}/controller.py`,
        createControllerBuilder(body["scripts"], body["model"])
      );
      fs.writeFileSync(
        `${profileName}/${`bot_${randomModel}`}/handler.py`,
        createChatHandel()
      );
      copyDirectory(
        path.join(
          process.cwd(),
          "python",
          "models",
          botname,
          `${body["model"]}`
        ),
        path.join(profileName, `bot_${randomModel}`, "models", body["model"])
      );
      responseAndConditionFetcher(
        JSON.parse(fileContent)["list_of_intent"],
        botname,
        profileName,
        randomModel,
        botname
      );
      zipFolder( path.join(
        process.cwd(),
        "build",
        "model_pack",
        botname,
        `bot_${randomModel}`
      ),path.join(
        process.cwd(),
        "build",
        "model_pack",
        botname,
        `bot_${randomModel}.zip`
      ))








    } else if (body["buildType"] == "without_controller") {
      const maindir = path.join(process.cwd(), "build", "without_controller");
      const profileName = path.join(
        process.cwd(),
        "build",
        "without_controller",
        botname
      );
      checkAndCreateDir(maindir);
      checkAndCreateDir(profileName);
      const fileContent = fs.readFileSync(
        path.join(
          path.join(process.cwd(), "doc", botname, "scripts", body["scripts"]),
          `${body["scripts"]}.json`
        ),
        "utf-8"
      );

      const randomModel = Date.now();
      checkAndCreateDir(maindir);
      checkAndCreateDir(profileName);
      checkAndCreateDir(path.join(profileName, `bot_${randomModel}`));
      checkAndCreateDir(
        path.join(profileName, `bot_${randomModel}`, "condition")
      );
      checkAndCreateDir(path.join(profileName, `bot_${randomModel}`, "models"));
      checkAndCreateDir(
        path.join(profileName, `bot_${randomModel}`, "custom_actions")
      );
      checkAndCreateDir(
        path.join(profileName, `bot_${randomModel}`, "response")
      );
      checkAndCreateDir(
        path.join(profileName, `bot_${randomModel}`, "scripts")
      );
      checkAndCreateDir(path.join(profileName, `bot_${randomModel}`, "task"));
      fs.writeFileSync(
        path.join(
          profileName,
          `bot_${randomModel}`,
          "scripts",
          `${body["scripts"]}.json`
        ),
        JSON.stringify({
          script: modifyScripts(botname, body),
        })
      );
      copyDirectory(
        path.join(
          process.cwd(),
          "python",
          "models",
          botname,
          `${body["model"]}`
        ),
        path.join(profileName, `bot_${randomModel}`, "models", body["model"])
      );
      responseAndConditionFetcher(
        JSON.parse(fileContent)["list_of_intent"],
        botname,
        profileName,
        randomModel,
        botname
      );
      zipFolder(
        path.join(profileName, `bot_${randomModel}`),
        path.join(profileName, `bot_${randomModel}.zip`)
      );
      deleteDirWithContents(path.join(profileName, `bot_${randomModel}`));
    } else if (body["buildType"] == "export_entities") {
      const maindir = path.join(process.cwd(), "build", "export_entities");
      const profileName = path.join(
        process.cwd(),
        "build",
        "export_entities",
        botname
      );
      checkAndCreateDir(maindir);
      checkAndCreateDir(profileName);
      console.log(body);
    }
  } catch (error) {
    console.log(error);
    return {};
  }

  return {};
});
