<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
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
}
onMounted(() => {
  socket.on("msg_return", (data) => {
    messageBox.value = [{ txt: data.result, type: "bot" }, ...messageBox.value];
    sendEnable.value = true;
  });
  socket.on("en_msg_return", (data) => {
    messageBox2.value = [{ txt: data.result, type: "bot" }, ...messageBox2.value];
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

  socket.emit("get_model", {
    type: "exe_main",
    msg: inputMessage.value,
    name: info.profile.active.name,
    model: current_model.value?.name,
  });

  inputMessage.value = "";
  sendEnable.value = false;
}

function activedModel(name, type = "type_check") {
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
      <div class="list-item" v-for="i in listOfMainBot">
        <div class="icon">
          <img src="../../assets/icon/other/model.png" alt="" />
        </div>
        <div class="txt" @click="activedModel(i)">{{ i }}</div>
        <div class="icon"></div>
      </div>
    </div>

    <div
      class="chat-box"
      v-if="current_model?.type == 'type_check' && chatboxTab != 3"
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
