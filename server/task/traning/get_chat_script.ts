import fs from "fs";
import path from "path";
import { botinfo } from "~/server/cache/botinfo";
import { getWsInfo } from "~/server/cache/ws";
import { createChatHandel2, createControllerBuilder } from "~/server/util/code";
import copyDirectory from "~/util/copy";
import checkAndCreateDir from "~/util/createDir";
import deleteDirWithContents from "~/util/deleteFiles";
import readAllDirs from "~/util/readDir";
let wssocketActive = false;
let storeFunc;
let modelName;

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

function modifyScripts(botname, body) {
  const fileContent = fs.readFileSync(
    path.join(
      path.join(process.cwd(), "doc", botname, "scripts", body["script"]),
      `${body["script"]}.json`
    ),
    "utf-8"
  );
  return traverseAndReplaceTargets(
    JSON.parse(fileContent)["list_of_intent"],
    botname
  );
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
      `${'final_default_fallback'}`
    ),
    path.join(
      profileName,
      
      "response",
      "final_default_fallback"
    )
  );


  
  for (const element of [...getUniqueList(response)]) {
    
    try {
      if (element["type"] == "response") {
        checkAndCreateDir(
          path.join(
            profileName,
            
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
            
            "response",
            element["target"]
          )
        );
      } else {
        checkAndCreateDir(
          path.join(
            profileName,
          
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
                path.join(profileName,  "task", element3)
              );
              copyDirectory(
                path.join(process.cwd(), "doc", botname, "task", `${element3}`),
                path.join(profileName, "task", element3)
              );
            }
          } catch (error) {}
          try {
            for (const element3 of findNames(readFile)["entities"]) {
              checkAndCreateDir(
                path.join(profileName,  "entities_box")
              );
              checkAndCreateDir(
                path.join(
                  profileName,
                 
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
            path.join(profileName, "task", element3)
          );
          copyDirectory(
            path.join(process.cwd(), "doc", botname, "task", `${element3}`),
            path.join(profileName,  "task", element3)
          );
        }
      } catch (error) {}
      try {
        for (const element3 of findNames(readFile)["entities"]) {
          checkAndCreateDir(
            path.join(profileName, "entities_box")
          );
          checkAndCreateDir(
            path.join(
              profileName,
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
              "entities_box",
              element3
            )
          );
        }
      } catch (error) {}
    }
  }
}

export default function getChatModel(data, socket,io) {
  const wsinfo = getWsInfo();
  let botname = botinfo["name"];
  let exeC = path.join(
    process.cwd(),
    "python",
    "temp",
    "server_with_model",
    botname,
   
    "handler.py"
  );
  let dirPath = path.join(
    process.cwd(),
    "python",
    "temp",
    "server_with_model",
    botname
   
  );
  let prev_path;

  if (modelName != `bot_${data["chat_model_name"]}` || !modelName) {
    

    const maindir = path.join(
      process.cwd(),
      "python",
      "temp",
      "server_with_model"
    );
    const profileName = path.join(
      process.cwd(),
      "python",
      "temp",
      "server_with_model",
      botname
    );
    const fileContent = fs.readFileSync(
      path.join(
        path.join(process.cwd(), "doc", botname, "scripts", data["script"]),
        `${data["script"]}.json`
      ),
      "utf-8"
    );
    const randomModel = Date.now();
    for (const element of readAllDirs(profileName)) {
      deleteDirWithContents(path.join(profileName, element));
    }
    checkAndCreateDir(maindir);
    checkAndCreateDir(profileName);
    checkAndCreateDir(path.join(profileName));
    checkAndCreateDir(
      path.join(profileName, "condition")
    );
    checkAndCreateDir(
      path.join(profileName,  "models")
    );
    checkAndCreateDir(
      path.join(profileName,  "custom_actions")
    );
    checkAndCreateDir(
      path.join(profileName, "response")
    );
    checkAndCreateDir(
      path.join(profileName, "scripts")
    );
    checkAndCreateDir(
      path.join(profileName,  "task")
    );
    fs.writeFileSync(
      path.join(
        profileName,
        "scripts",
        `${data["script"]}.json`
      ),
      JSON.stringify({
        script: modifyScripts(botname, data),
      })
    );

    fs.writeFileSync(
      `${profileName}/controller.py`,
      createControllerBuilder(data["script"], data["model"])
    );
    fs.writeFileSync(
      `${profileName}/handler.py`,
      createChatHandel2()
    );

    copyDirectory(
      path.join(process.cwd(), "python", "models", botname, `${data["model"]}`),
      path.join(
        profileName,
        "models",
        data["model"]
      )
    );
    responseAndConditionFetcher(
      JSON.parse(fileContent)["list_of_intent"],
      botname,
      profileName,
      "",
      botname
    );

    
    if (modelName!=null && modelName != `bot_${data["chat_model_name"]}`) {
        prev_path = path.join(
          process.cwd(),
          "python",
          "temp",
          "server_with_model",
          botname,
          modelName,
          "handler.py"
        )
    }
    modelName = `bot_${data["chat_model_name"]}`;
  }
  


  if (!storeFunc) {
    storeFunc = true;

    if (wsinfo["ws"]) {
      wsinfo["ws"].on("message", (va) => {
        const parseData = JSON.parse(va.toString());
        if (parseData["emit_type"] == "get_msg_return_chat") {
          io.emit("get_msg_return_chat", { result: parseData["result"] });
        }
      });
    }
  }
  wsinfo["ws"].send(
    JSON.stringify({
      type: "chat_h",
      path: `${exeC.replace(/\\/g, "/")}`,
      msg: data.msg,
      meno_script: data["meno_script"],
      prev_path:prev_path,
      dir_path:dirPath
    })
  );
}
