import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
import readAllDirs from "~/util/readDir";

const catcode = `
from enum import Enum
class ConditionTypes(Enum):
      pass
`;

const dev_test = `
import  run 
print(run.run({}))
`;
const condition_runnercode = `
from cat import ConditionTypes
def run_condition(memo={}):
    # return {
    #     "cat":"<-ConditionTypes->",
    #     "memo":memo
    # }
    pass
`;

// const runcode = `
// from condition_runner import run_condition
// from cat import ConditionTypes

// def run(memo={}):
//     try:
//         value = run_condition(memo)
//         if value == None:
//             return None
//         if value["cat"] == None:
//             return None
//         if not isinstance(value["cat"], ConditionTypes):
//             return None
//         if not isinstance(value["memo"], dict):
//             return None
//         return {
//             "success":True,
//             "cat":value["cat"].value,
//             "memo":value["memo"]
//         }
//     except Exception as e:
//         return {
//             "success":False,
//             "error":e
//         }


// `;


const runcode = `
from condition_runner import run_condition
from cat import ConditionTypes
import json

def run(memo={}):
    try:
        value = run_condition(memo)
        if value == None:
            return None
        if value["cat"] == None:
            return None
        if not isinstance(value["cat"], ConditionTypes):
            return None
        if not isinstance(value["memo"], dict):
            return None
        return json.dumps({
            "success":True,
            "cat":value["cat"].value,
            "memo":value["memo"]
        })
    except Exception as e:
        
        return json.dumps({
            "success":False,
            "error":str(e)
        })
`;




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
      "condition",
      body["name"].replaceAll(" ", "_").trim()
    );

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
      const files = [
        { name: "cat.py", content: catcode },
        { name: "condition_runner.py", content: condition_runnercode },
        { name: "run.py", content: runcode },
        { name: "dev_test.py", content: dev_test },
        {
          name: "details.json",
          content: `{"name":"${body["name"].replaceAll(" ", "_").trim()}","des":"${body["des"].trim()}","time":${Date.now()},"types":[],"use_list":[],"task_list":[],"recommendation_list":[] }`,
        },
      ];
      files.forEach((file) => {
        const filePath2 = path.join(filePath, file.name);
        if (!fs.existsSync(filePath2)) {
          fs.writeFileSync(filePath2, file.content, "utf8");
        }
      });
      const fileitems = readAllDirs(
        path.resolve(process.cwd(), "doc", botname, "condition")
      );
      const listOfIems = [];
      for (const element of fileitems) {
        try {
          const readFile = fs.readFileSync(
            path.resolve(
              process.cwd(),
              "doc",
              botname,
              "condition",
              element,
              "details.json"
            ),
            "utf-8"
          );
          const parseData = JSON.parse(readFile);
          listOfIems.push({
            name: parseData["name"],
            types: parseData["types"],
            task_list: parseData["task_list"],
          });
        } catch (error) {}
      }
      return { items: listOfIems };
    }
    return {};
  } catch (error) {
    return {};
  }
  return {};
});
