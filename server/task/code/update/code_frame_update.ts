import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
import getTypeReadObj from "~/util/getFuncClassObj";
import getModuleObj from "~/util/getModulesObj";
import readAllDirs from "~/util/readDir";

export default function codeFrameUpdateCode(data, socket, io) {

    let parentDir = null
 
    if (data.of != "task") {
       parentDir = path.join(
        process.cwd(),
        "doc",
        botinfo["name"],
        data.of,
        data.name,
        data?.type?`${data?.type}`:"code_runner.py"
      );
    }else{
       parentDir = path.join(
        process.cwd(),
        "doc",
        botinfo["name"],
        data.of,
        data.name,
        data?.type?`${data?.type}`:"code_runners.py"
      );
    }




    const reco = [];

    fs.writeFileSync(parentDir, data.code);

    let taskFiles = readAllDirs(path.join(
      process.cwd(),
      "doc",
      botinfo["name"],
      data.of,
      data.name
      
    ),true)
    taskFiles = taskFiles.filter((element)=>!(element=="details.json" || element=="code_runner.py"|| element=="code_runners.py"||element=="dev_test.py"|| element=="run.py" ||element =="__pycache__"))
    for (const element of taskFiles) {
      
      reco.push({
        label: `import ${element.replace(/\.py$/, "")}`,
        type: "class",
        detail: "import module",
      });
      reco.push({
        label: `from ${element.replace(/\.py$/, "")}`,
        type: "class",
        detail: "import module",
      });  
      const code = fs.readFileSync(path.join(
        process.cwd(),
        "doc",
        botinfo["name"],
        data.of,
        data.name,
        element
      ),"utf-8")
      
      const getTypes = getTypeReadObj(code);
     
      for (const element2 of getTypes) {
        if (element2["type"] == "enum") {
          for (const element3 of element2["items"]) {
            reco.push({
              label: `from ${element.replace(/\.py$/, "")}  import ${element2.name}`,
              type: "property",
              detail: "Enum Types",
            });
          }
        }
        if (element2["type"] == "function") {
          reco.push({
            label: `from ${element.replace(/\.py$/, "")} import ${element2.name}`,
            type: "function",
            detail: "use function",
          });
        }
        if (element2["type"] == "class") {
          reco.push({
            label: `from ${element.replace(/\.py$/, "")} import ${element2.name}`,
            type: "class",
            detail: "use class",
          });
        }
      }









      
    }

    
    if (data.of != "task") {
      const listOfTask = readAllDirs(path.join(
        process.cwd(),
        "doc",
        botinfo["name"],
        "task"        
      ))

      const listOfTaskList = readAllDirs(path.join(
        process.cwd(),
        "doc",
        botinfo["name"],
        "entities_box"        
      ))
      for (const element of listOfTaskList) {
        reco.push({
          label: `from entities_box.${element}.generated import predict_entities`,
          type: "function",
          detail: "function",
        });
      }

      for (const element of listOfTask) {
        reco.push({
          label: `from task.${element}.run import run`,
          type: "function",
          detail: "function",
        });
      }
    }













    reco.push({
        label: `return {"response":"<-- response name -->","memo":memo,"data":{}}`,
        type: "keyword",
        detail: "return object",
      });
      reco.push({
        label: `return {"txt":"<-- txt -->","memo":memo}`,
        type: "keyword",
        detail: "return object",
      });
    try {
      for (const element of getModuleObj(data.code)) {
        if (element["type"] && element["name"] && element["import"]) {
          const filePath2 = path.join(
            process.cwd(),
            "doc",
            botinfo["name"],
            data.of,
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
            data.of,
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
            data.of,
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

    socket.emit("update_code_code_frame", {
      code: fs.readFileSync(parentDir, "utf-8"),
      name: data.name,
      reco,
    });
  
}
