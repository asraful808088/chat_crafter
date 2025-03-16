import { Server as Engine } from "engine.io";
import { defineEventHandler } from "h3";
import type { NitroApp } from "nitropack";
import { Server } from "socket.io";
import updateCode from "../task/code/update/update";
import getEntitiesItem from "../task/get/getEntities";
import checkmodel from "../task/traning/check_model";
import checkTrainStatus from "../task/traning/check_status";
import en_check_model from "../task/traning/en_check_model";
import en_checkTrainStatus from "../task/traning/en_check_status";
import getModel from "../task/traning/get_model";
import getEntitiesModel from "../task/traning/getEntitiesModel";
import CodeRunner from "../task/code/runner/runner";
import codeFrameUpdateCode from "../task/code/update/code_frame_update";
import CodeFrameRunner from "../task/code/runner/codeFramerunner";
export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server();

  io.bind(engine);

  io.on("connection", (socket) => {
    socket.on("init", () => {});
    socket.on("check_model", (data) => {
      checkmodel(data, socket, io);
    });
    socket.on("init_train", (data) => {
      checkTrainStatus(data, socket, io);
    });
    socket.on("en_init_train", (data) => {
      en_checkTrainStatus(data, socket, io);
    });
    socket.on("get_model", (data) => {
      getModel(data, socket, io);
    });
    socket.on("get_socket", (data) => {
      getEntitiesItem(data, socket, io);
    });
    socket.on("en_check_model", (data) => {
      en_check_model(data, socket, io);
    });
    socket.on("get_entitites_model", (data) => {
      getEntitiesModel(data, socket, io);
    });
    socket.on("code_update_c", (data) => {
      updateCode(data, socket, io);
    });
    socket.on("code_update_code_frame", (data) => {
      codeFrameUpdateCode(data, socket, io);
    });
    socket.on("code_runner_c", (data) => {
      CodeRunner(data, socket, io);
    });
    socket.on("code_runner_code_frame", (data) => {
      CodeFrameRunner(data, socket, io);
    });
  });

  nitroApp.router.use(
    "/socket.io/",
    defineEventHandler({
      handler(event) {
        engine.handleRequest(event.node.req, event.node.res);
        event._handled = true;
      },
      websocket: {
        open(peer) {
          engine.prepare(peer._internal.nodeReq);
          engine.onWebSocket(
            peer._internal.nodeReq,
            peer._internal.nodeReq.socket,
            peer.websocket
          );
        },
      },
    })
  );
});
