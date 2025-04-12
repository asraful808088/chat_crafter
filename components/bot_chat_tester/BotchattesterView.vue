<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import getSelectItems from "~/network/get_intentes/get_intents";
import { useBotbuilderStore } from "~/state/state";
import { socket } from "../socketIO/socket";

const info = useBotbuilderStore();
const current_model = ref(null);
const listOfMainBot = ref([]);
const messageBox = ref([]);
const messageBox2 = ref([]);
const inputMessage = ref("");
const sendEnable = ref(true);
const chatboxTab = ref(1);
const entitiesBlog = ref([]);
const entitiesModelBlog = ref(null);
const activeEntitiesModelBlog = ref(null);
const activeEntitiesBlog = ref(null);
const chat_model_name = ref(Date.now());
const meno_script = ref(null);
const chatBotModelInfo = ref({
  model: "",
  script: "",
});
const listOfScripts = ref([]);
const props = defineProps({
  onClose: {
    type: Function,
    require: false,
  },
});

function getEntitiesModelBlog(i) {
  activeEntitiesBlog.value = i;
  socket.emit("get_entitites_model", {
    type: "main",
    name: info.profile.active.name,
    i,
  });
}

function setEntitiesActiveEntitiesModelBlog(i) {
  activeEntitiesModelBlog.value = i;
}

function clearEntitesAllBlog() {
  entitiesModelBlog.value = null;
  activeEntitiesModelBlog.value = null;
  activeEntitiesBlog.value = null;
  current_model.value = null;
  // localStorage.setItem("store_chat_obj", null); stage store_covtimeline sent before_res after_res
  chatBotModelInfo.value = {
    model: "",
    script: "",
  };
}
onMounted(() => {
  socket.on("msg_return", (data) => {
    messageBox.value = [{ txt: data.result, type: "bot" }, ...messageBox.value];
    sendEnable.value = true;
  });
  socket.on("get_msg_return_chat", (data) => {
    console.log(data)
    if (data.result) {
      if (data.result["stage"] == "before_res") {
      } else if (data.result["stage"] == "after_res") {
      } else if (data.result["sent"]) {
        messageBox.value = [
          { txt: data.result["sent"], type: "bot" },
          ...messageBox.value,
        ];
        sendEnable.value = true;
      } else if (data.result["store_covtimeline"]) {
        meno_script.value = data.result;
      }
    }
    sendEnable.value = true;
  });
  socket.on("en_msg_return", (data) => {
    messageBox2.value = [
      { txt: data.result, type: "bot" },
      ...messageBox2.value,
    ];
    sendEnable.value = true;
  });

  socket.on("pass_model", (data) => {
    listOfMainBot.value = data.items;
    entitiesBlog.value = data.items2;
  });
  socket.on("pass_model2", (data) => {
    entitiesModelBlog.value = data.items;
  });
  if (info.profile.active) {
    socket.emit("get_model", {
      type: "main",
      name: info.profile.active.name,
    });
  }
  getSelectItems(
    {
      of: "scripts",
    },
    (result, err) => {
      if (result.items) {
        if (listOfScripts.value) {
          listOfScripts.value = result.items;
        }
      }
    }
  );

  // if (localStorage.getItem("store_chat_obj")) {
  //   const dataInfo = JSON.parse(localStorage.getItem("store_chat_obj"));

  //   try {
  //     if (dataInfo["exp"] > Date.now()) {
  //       const d = {
  //         ...dataInfo,
  //         exp: Date.now() + 100000,
  //       };
  //       localStorage.setItem("store_chat_obj", JSON.stringify(d));
  //       current_model.value = d;
  //     } else {
  //       localStorage.setItem("store_chat_obj", null);
  //     }
  //   } catch (error) {
  //     localStorage.setItem("store_chat_obj", null);
  //   }
  // }
});

watch(
  () => info.profile.active,
  (newActive) => {
    if (newActive) {
      socket.emit("get_model", {
        type: "main",
        name: newActive.name,
      });
    }
  }
);

onBeforeUnmount(() => {
  socket.off("msg_return");
  socket.off("pass_model");
});

function sendMessage2() {
  if (!inputMessage.value) return;
  messageBox2.value = [
    { txt: inputMessage.value, type: "me" },
    ...messageBox2.value,
  ];

  socket.emit("get_entitites_model", {
    type: "exe_main",
    msg: inputMessage.value,
    name: info.profile.active.name,
    ch: activeEntitiesBlog.value,
    model: activeEntitiesModelBlog.value,
  });

  inputMessage.value = "";
  sendEnable.value = false;
}

function sendMessage() {
  if (!inputMessage.value) return;

  messageBox.value = [
    { txt: inputMessage.value, type: "me" },
    ...messageBox.value,
  ];
  if (chatboxTab.value == 2) {
    socket.emit("get_model_chat", {
      type: "exe_main_chat",
      msg: inputMessage.value,
      name: info.profile.active.name,
      model: current_model.value.model,
      script: current_model.value?.script,
      chat_model_name: chat_model_name.value,
      meno_script: meno_script.value,
    });
  } else {
    socket.emit("get_model", {
      type: "exe_main",
      msg: inputMessage.value,
      name: info.profile.active.name,
      model: current_model.value?.name,
    });
  }

  inputMessage.value = "";
  sendEnable.value = false;
}

function activedModel(name, type = "type_check") {
  if (chatboxTab.value == 2 && chatBotModelInfo.value.model) {
    chatBotModelInfo.value.script = name;
    current_model.value = {
      type: "type_check_chat",
      model: chatBotModelInfo.value.model,
      script: chatBotModelInfo.value.script,
      exp: Date.now() + 100000,
    };
    // localStorage.setItem("store_chat_obj", JSON.stringify(current_model.value));
    return;
  } else if (chatboxTab.value == 2) {
    chatBotModelInfo.value.model = name;

    return;
  }
  current_model.value = { type, name };
}
</script>
<template>
  <div class="tester-main">
    <div class="back-box"><span @click="props.onClose()">Close</span></div>
    <div class="logo">
      <img src="../../assets/icon/other/tester.png" alt="" />
    </div>
    <div class="menu-button">
      <span
        :class="chatboxTab == 1 ? 'font active-font' : 'font'"
        @click="
          () => {
            chatboxTab = 1;
            clearEntitesAllBlog();
          }
        "
        >Type-check</span
      >
      <span
        :class="chatboxTab == 2 ? 'font active-font' : 'font'"
        @click="
          () => {
            chatboxTab = 2;
            clearEntitesAllBlog();
          }
        "
        >Chat</span
      >
      <span
        :class="chatboxTab == 3 ? 'font active-font' : 'font'"
        @click="
          () => {
            chatboxTab = 3;
            clearEntitesAllBlog();
          }
        "
        >Entity-check</span
      >
    </div>

    <div
      class="list-box"
      v-if="current_model == null && chatboxTab == 3 && !entitiesModelBlog"
    >
      <div class="list-item" v-for="i in entitiesBlog">
        <div class="icon">
          <img src="../../assets/icon/other/model.png" alt="" />
        </div>
        <div class="txt" @click="getEntitiesModelBlog(i)">{{ i }}</div>
        <div class="icon"></div>
      </div>
    </div>

    <div
      class="list-box"
      v-if="
        current_model == null &&
        chatboxTab == 3 &&
        entitiesModelBlog &&
        !activeEntitiesModelBlog
      "
    >
      <div class="list-item" v-for="i in entitiesModelBlog">
        <div class="icon">
          <img src="../../assets/icon/other/model.png" alt="" />
        </div>
        <div class="txt" @click="setEntitiesActiveEntitiesModelBlog(i)">
          {{ i }}
        </div>
        <div class="icon"></div>
      </div>
    </div>

    <div
      class="chat-box"
      v-if="chatboxTab == 3 && entitiesModelBlog && activeEntitiesModelBlog"
    >
      <div class="chat-list-box">
        <div
          :class="i.type == 'me' ? 'txt-msg-box me' : 'txt-msg-box'"
          v-for="(i, n) in messageBox2"
        >
          {{ i.txt }}
        </div>
      </div>
      <div class="type-box">
        <div class="input-box">
          <input
            type="text"
            name=""
            id=""
            placeholder="send"
            v-model="inputMessage"
          />
        </div>
        <div class="send" @click="sendMessage2">
          <img src="../../assets/icon/other/next.png" alt="" />
        </div>
      </div>
    </div>

    <div class="list-box" v-if="current_model == null && chatboxTab != 3">
      <div
        class="list-item"
        v-for="i in chatboxTab == 2 && chatBotModelInfo.model
          ? listOfScripts
          : listOfMainBot"
      >
        <div class="icon">
          <img src="../../assets/icon/other/model.png" alt="" />
        </div>
        <div class="txt" @click="activedModel(i)">{{ i }}</div>
        <div class="icon"></div>
      </div>
    </div>

    <div
      class="list-box"
      v-if="current_model != null && chatboxTab == 1 && current_model['exp']"
    >
      <div
        class="list-item"
        v-for="i in chatboxTab == 2 && chatBotModelInfo.model
          ? listOfScripts
          : listOfMainBot"
      >
        <div class="icon">
          <img src="../../assets/icon/other/model.png" alt="" />
        </div>
        <div class="txt" @click="activedModel(i)">{{ i }}</div>
        <div class="icon"></div>
      </div>
    </div>

    <!-- <div class="list-box" v-if="(current_model == null && chatboxTab == 2 ) ">
      <div
        class="list-item"
        v-for="i in chatboxTab == 2 && chatBotModelInfo.model
          ? listOfScripts
          : listOfMainBot"
      >
        <div class="icon">
          <img src="../../assets/icon/other/model.png" alt="" />
        </div>
        <div class="txt" @click="activedModel(i)">{{ i }}</div>
        <div class="icon"></div>
      </div>
    </div> -->

    <div
      class="chat-box"
      v-if="
        current_model?.type == 'type_check_chat' &&
        chatboxTab != 3 &&
        chatboxTab != 1
      "
    >
      <div class="chat-list-box">
        <div
          :class="i.type == 'me' ? 'txt-msg-box me' : 'txt-msg-box'"
          v-for="(i, n) in messageBox"
        >
          {{ i.txt }}
        </div>
      </div>
      <div class="type-box">
        <div class="input-box">
          <input
            type="text"
            name=""
            id=""
            placeholder="send"
            v-model="inputMessage"
          />
        </div>
        <div class="send" @click="sendMessage">
          <img src="../../assets/icon/other/next.png" alt="" />
        </div>
      </div>
    </div>

    <div
      class="chat-box"
      v-if="
        current_model?.type == 'type_check' &&
        chatboxTab != 3 &&
        chatboxTab != 2
      "
    >
      <div class="chat-list-box">
        <div
          :class="i.type == 'me' ? 'txt-msg-box me' : 'txt-msg-box'"
          v-for="(i, n) in messageBox"
        >
          {{ i.txt }}
        </div>
      </div>
      <div class="type-box">
        <div class="input-box">
          <input
            type="text"
            name=""
            id=""
            placeholder="send"
            v-model="inputMessage"
          />
        </div>
        <div class="send" @click="sendMessage">
          <img src="../../assets/icon/other/next.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" src="./style.css"></style>
