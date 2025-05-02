import * as fs from "fs";
import * as path from "path";
import { botinfo } from "~/server/cache/botinfo";
import readAllDirs from "~/util/readDir";

const dev_test = `
import os
import sys
base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
sys.path.append(base_path)

for root, dirs, files in os.walk(base_path):
    sys.path.append(os.path.abspath(root))
import  run 
print(run.run())
`;

const custom_runnercode = `
def run_task(memo={}):
    pass
    # return {
    #             "memo":memo,
    #             "response":"",
    #             "data":{
                   
    #             }
    # }
    # return {
    #             "memo":memo,
    #             "txt":"",
    # }
`;

const task_runnercode = `
def run_task(params,memo):

    # todo //
    pass
    # return {
    #     "memo":memo,
    #     "data":{

    #     }
    # }

`;

const custom_runcode = `
from code_runner import run_task
import json
def run(memo={}):
      try:   
        result  = run_task(memo)
        try:
                result["response"]
                try:
                      result["data"]
                      try:
                        return json.dumps({
                          "success":True,
                          "memo":result["memo"],
                          "response":result["response"],
                          "data":result["data"]})
                      except:
                        return json.dumps({
                          "success":True,
                          "memo":memo,
                          "response":result["response"],
                          "data":result["data"]}) 
                except:
                      try:
                            return json.dumps({
                              "success":True,
                              "memo":result["memo"],
                              "response":result["response"],
                              "data":None})
                      except:
                            return json.dumps({
                              "success":True,
                              "memo":memo,
                              "response":result["response"],
                              "data":None})
        except:
                result["txt"]
                try:
                      return  json.dumps({
                                "success":True,
                                "memo":result["memo"],
                                "txt":result["txt"]}) 
                except:
                        return json.dumps({
                                "success":True,
                                "memo":memo,
                                "txt":result["txt"]}) 
      except Exception as a:
            return json.dumps({
                                "success":False,
                                 "result":str(a)})

`;

const custom_runcode2 = `
from code_runners import run_task
import json
def run(memo={}):
      try:   
        result  = run_task(memo)
        try:
                result["response"]
                try:
                      result["data"]
                      try:
                        return json.dumps({
                          "success":True,
                          "memo":result["memo"],
                          "response":result["response"],
                          "data":result["data"]})
                      except:
                        return json.dumps({
                          "success":True,
                          "memo":memo,
                          "response":result["response"],
                          "data":result["data"]}) 
                except:
                      try:
                            return json.dumps({
                              "success":True,
                              "memo":result["memo"],
                              "response":result["response"],
                              "data":None})
                      except:
                            return json.dumps({
                              "success":True,
                              "memo":memo,
                              "response":result["response"],
                              "data":None})
        except:
                result["txt"]
                try:
                      return  json.dumps({
                                "success":True,
                                "memo":result["memo"],
                                "txt":result["txt"]}) 
                except:
                        return json.dumps({
                                "success":True,
                                "memo":memo,
                                "txt":result["txt"]}) 
      except Exception as a:
            return json.dumps({
                                "success":False,
                                 "result":str(a)})

`;

const task_runcode = `
from code_runners import run_task
import json
def run(params={},memo=None):
        try:
                result =  run_task(params,memo)
                result["data"]
                try:
                        return  json.dumps({
                        "success":True,
                        "result":result["data"],
                        "memo":result["memo"]}) 
                        
                except:
                        return  json.dumps({
                        "success":True,
                        "result":result["data"],
                        "memo":memo}) 
                
        except Exception as a:
                return  json.dumps({
                        "success":False,
                        "result":str(a)
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
      body["of"],
      body["name"].replaceAll(" ", "_").trim()
    );

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
      let files = null;

      if (body["of"] != "task") {
        files = [
          { name: "code_runner.py", content: custom_runnercode },
          { name: "run.py", content: custom_runcode },
          { name: "dev_test.py", content: dev_test },
          {
            name: "details.json",
            content: `{"name":"${body["name"].replaceAll(" ", "_").trim()}","des":"${body["des"].trim()}","time":${Date.now()},"use_list":[],"task_list":[] }`,
          },
        ];
      } else {
        files = [
          { name: "code_runners.py", content: task_runnercode },
          { name: "run.py", content: task_runcode  },
          { name: "dev_test.py", content: dev_test },
          {
            name: "details.json",
            content: `{"name":"${body["name"].replaceAll(" ", "_").trim()}","des":"${body["des"].trim()}","time":${Date.now()},"use_list":[],"task_list":[] }`,
          },
        ];
      }

      files.forEach((file) => {
        const filePath2 = path.join(filePath, file.name);
        if (!fs.existsSync(filePath2)) {
          fs.writeFileSync(filePath2, file.content, "utf8");
        }
      });
      const fileitems = readAllDirs(
        path.resolve(process.cwd(), "doc", botname, body["of"])
      );

      if (body["of"] != "task") {
        const listOfIems = [];
      for (const element of fileitems) {
        try {
          const readFile = fs.readFileSync(
            path.resolve(
              process.cwd(),
              "doc",
              botname,
              body["of"],
              element,
              "details.json"
            ),
            "utf-8"
          );
          const parseData = JSON.parse(readFile);
          listOfIems.push({
            name: parseData["name"],
            task_list: parseData["task_list"],
            code: fs.readFileSync(
              path.resolve(
                process.cwd(),
                "doc",
                botname,
                body["of"],
                element,
                "code_runner.py"
              ),
              "utf-8"
            ),
          });
        } catch (error) {}
      }
      return { items: listOfIems };
      }else{
        const listOfIems = [];
        for (const element of fileitems) {
          try {
            const readFile = fs.readFileSync(
              path.resolve(
                process.cwd(),
                "doc",
                botname,
                body["of"],
                element,
                "details.json"
              ),
              "utf-8"
            );
            const parseData = JSON.parse(readFile);
            listOfIems.push({
              name: parseData["name"],
              task_list: parseData["task_list"],
              code: fs.readFileSync(
                path.resolve(
                  process.cwd(),
                  "doc",
                  botname,
                  body["of"],
                  element,
                  "code_runners.py"
                ),
                "utf-8"
              ),
            });
          } catch (error) {}
        }
        return { items: listOfIems };
      }


      
    }
    return {};
  } catch (error) {
    return {};
  }
  return {};
});
