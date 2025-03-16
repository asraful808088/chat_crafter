import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
import getTypeReadObj from "~/util/getFuncClassObj";
import getModuleObj from "~/util/getModulesObj";
import readAllDirs from "~/util/readDir";
// const pythonFunctions = [
//   { label: "print", type: "function", detail: "Built-in print function" },
//   { label: "len", type: "function", detail: "Returns length of an object" },
//   { label: "range", type: "function", detail: "Generates a range of numbers" },
//   { label: "my_function", type: "function", detail: "Your custom function" },
//   { label: "import", type: "keyword", detail: "Import a module" },
//   { label: "import2", type: "property", detail: "Import a module2" },
//   {
//     label: "from cat import ConditionType",
//     type: "class",
//     detail: "Import  Condition Type",
//   },
//   { label: "cat", type: "module", detail: "Import  module" },
//   {
//     label: "from",
//     type: "keyword",
//     detail: "Import specific parts of a module",
//   },
//   { label: "MyClass", type: "class", detail: "Custom Python class" },
//   { label: "ConditionType", type: "class", detail: "Custom Python class" },
//   ...generateClassMethods("MyClass", ["method1", "method2", "method3"]),
//   ...generateClassMethods("ConditionType", ["method1", "method2", "method3"]),
// ];

export default function updateCode(data, socket, io) {
  
    const parentDir = path.join(
      process.cwd(),
      "doc",
      botinfo["name"],
      "condition",
      data.name,
      data?.type?`${data?.type}`:"condition_runner.py"
    );
    fs.writeFileSync(parentDir, data.code);
    const reco = [];
    const listOfTask = readAllDirs(path.join(
      process.cwd(),
      "doc",
      botinfo["name"],
      "task"        
    ))
    for (const element of listOfTask) {
      reco.push({
        label: `from task.${element}.run import run`,
        type: "function",
        detail: "function",
      });
    }
    try {
      for (const element of getModuleObj(data.code)) {
        if (element["type"] && element["name"] && element["import"]) {
          const filePath2 = path.join(
            process.cwd(),
            "doc",
            botinfo["name"],
            "condition",
            data.name,
            `${element["name"]}.py`
          );
          try {
            const getTypes = getTypeReadObj(
              fs.readFileSync(filePath2, "utf-8")
            );
            for (const element2 of getTypes) {
              if (element2["name"] == element["import"]) {
                if (element2["type"] == "enum") {
                  for (const element3 of element2["items"]) {
                    reco.push({
                      label: `${element2.name}.${element3}`,
                      type: "property",
                      detail: "Condition Types",
                    });
                    reco.push({
                      label: `return {"cat":${element2.name}.${element3},"memo":memo}`,
                      type: "keyword",
                      detail: "return object",
                    });
                  }
                  break;
                }
                if (element2["type"] == "function") {
                  reco.push({
                    label: `${element2.name}`,
                    type: "function",
                    detail: "use function",
                  });
                  break;
                }
                if (element2["type"] == "class") {
                  reco.push({
                    label: `${element2.name}`,
                    type: "class",
                    detail: "use class",
                  });
                  break;
                }
              }
            }
          } catch (error) {}
        } else if (element["type"] && element["name"] && element["star"]) {
          const filePath2 = path.join(
            process.cwd(),
            "doc",
            botinfo["name"],
            "condition",
            data.name,
            `${element["name"]}.py`
          );
          try {
            const getTypes = getTypeReadObj(
              fs.readFileSync(filePath2, "utf-8")
            );
            for (const element2 of getTypes) {
              if (element2["type"] == "enum") {
                for (const element3 of element2["items"]) {
                  reco.push({
                    label: `${element2.name}.${element3}`,
                    type: "property",
                    detail: "Condition Types",
                  });
                  reco.push({
                    label: `return {"cat":${element2.name}.${element3},"memo":memo}`,
                    type: "keyword",
                    detail: "return object",
                  });
                }
              }
              if (element2["type"] == "function") {
                reco.push({
                  label: `${element2.name}`,
                  type: "function",
                  detail: "use function",
                });
              }
              if (element2["type"] == "class") {
                reco.push({
                  label: `${element2.name}`,
                  type: "class",
                  detail: "use class",
                });
              }
            }
          } catch (error) {}
        } else {
          const filePath2 = path.join(
            process.cwd(),
            "doc",
            botinfo["name"],
            "condition",
            data.name,
            `${element["name"]}.py`
          );
          try {
            const getTypes = getTypeReadObj(
              fs.readFileSync(filePath2, "utf-8")
            );
            for (const element2 of getTypes) {
              if (element2["type"] == "enum") {
                for (const element3 of element2["items"]) {
                  reco.push({
                    label: `${element["name"]}.${element2.name}.${element3}`,
                    type: "property",
                    detail: "Condition Types",
                  });

                  reco.push({
                    label: `return {"cat":${element["name"]}.${element2.name}.${element3},"memo":memo}`,
                    type: "keyword",
                    detail: "return object",
                  });




                }
              }
              if (element2["type"] == "function") {
                reco.push({
                  label: `${element["name"]}.${element2.name}`,
                  type: "function",
                  detail: "use function",
                });
              }
              if (element2["type"] == "class") {
                reco.push({
                  label: `${element["name"]}.${element2.name}`,
                  type: "class",
                  detail: "use class",
                });
              }
            }
          } catch (error) {}
        }
      }
    } catch (error) {}

    socket.emit("update_code_c", {
      code: fs.readFileSync(parentDir, "utf-8"),
      name: data.name,
      reco,
    });
  
}
