import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
import readAllDirs from "~/util/readDir";

// function addUniqueType(parseJsonDetails, body) {
//   const newType = {
//     typename: body["name"].trim().replaceAll(" ", "_").toLocaleLowerCase(),
//   };

//   const exists = parseJsonDetails["types"].some(
//     (item) => item.typename === newType.typename
//   );

//   if (!exists) {
//     return [...parseJsonDetails["types"], newType];
//   }

//   return parseJsonDetails["types"];
// }

// function CatPageRemake(list = []) {
//   if (list.length == 0) {
//     return `
// from enum import Enum
// class ConditionTypes(Enum):    
//       pass
    
    
// `;
//   }

//   const enumEntries = list
//     .map((item) => `    ${item.typename} = "${item.typename}"`)
//     .join("\n");

//   return `
// from enum import Enum
// class ConditionTypes(Enum):
// ${enumEntries}


// `;
// }

function NewPageRemake() {
  return `


`;
}

export default defineEventHandler(async (event) => {
  if (event.method != "POST") {
    throw createError({ statusCode: 405, msg: "Method Not Allowed" });
  }
  const botname = botinfo["name"];

  try {
    const body = await readBody(event);

    if (!body["typemodule"]) {
    //   let detailsPath = path.resolve(
    //     process.cwd(),
    //     "doc",
    //     botname,
    //     body["of"],
    //     body["item_name"],
    //     "details.json"
    //   );
    //   const getStringData = fs.readFileSync(detailsPath, "utf-8");
    //   const parseJsonDetails = JSON.parse(getStringData);
    //   parseJsonDetails["types"] = addUniqueType(parseJsonDetails, body);

    //   let cat_pyPath = path.resolve(
    //     process.cwd(),
    //     "doc",
    //     botname,
    //     body["of"],
    //     body["item_name"],
    //     "cat.py"
    //   );
    //   fs.writeFileSync(detailsPath, JSON.stringify(parseJsonDetails), "utf8");
    //   fs.writeFileSync(
    //     cat_pyPath,
    //     CatPageRemake(parseJsonDetails["types"]),
    //     "utf8"
    //   );
    //   return {
    //     items: parseJsonDetails["types"],
    //     type: "types",
    //   };
    } 
    else {
      let detailsPath = path.resolve(
        process.cwd(),
        "doc",
        botname,
        body["of"],
        body["item_name"],
        `${body["name"].trim().replaceAll(" ", "_").toLocaleLowerCase()}_${body["of"] == 'task'?"task":"custom"}_${body["item_name"]}.py`
      );
      if (!fs.existsSync(detailsPath)) {
        fs.writeFileSync(detailsPath, NewPageRemake(), "utf8");
        const fileitems = readAllDirs(
          path.resolve(
            process.cwd(),
            "doc",
            botname,
            body["of"],
            body["item_name"]
          ),
          true
        );
        const filterItem = fileitems.filter(
          (element, index) =>
            !(
              element == "details.json" ||
              element == `${body["item_name"]}_${body["of"] == 'task'?"task":"custom"}_dev_test.py` ||
              element == "__pycache__" ||
              element == "run.py" ||
              element == `${body["item_name"]}_${body["of"] == 'task'?"task":"custom"}_code_runner.py`||
              element == `${body["item_name"]}_${body["of"] == 'task'?"task":"custom"}_code_runners.py`
            )
        );
        let detailsPath2 = path.resolve(
          process.cwd(),
          "doc", 
          botname,
          body["of"],
          body["item_name"],
          "details.json"
        );
        const getStringData = fs.readFileSync(detailsPath2, "utf-8");
        const parseJsonDetails = JSON.parse(getStringData);
        parseJsonDetails["task_list"] = filterItem.map((element, index) => {
          return {
            name: element,
          };
        });
        fs.writeFileSync(
          detailsPath2,
          JSON.stringify(parseJsonDetails),
          "utf8"
        );
        return {
          items: parseJsonDetails["task_list"],
          type: "modules",
        };
      }
    }
    return {};
  } catch (error) {
    return {};
  }

  return {};
});
