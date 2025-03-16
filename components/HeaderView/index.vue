<script setup>
import { BotselectorView } from "#components";
import { ref } from "vue";
import { useBotbuilderStore } from "~/state/state";
import { useRouter } from "vue-router";
import BotchattesterView from "../bot_chat_tester/BotchattesterView.vue";
const chatBoxShow = ref(false)
const router = useRouter()

const showSelectorstatus = ref(false);

const info = useBotbuilderStore();
const toggleLogin = () => {
  info.closeProfile()
};

const showSelector = () => {
  showSelectorstatus.value = !showSelectorstatus.value;
};
const hideSelector = () => {
  showSelectorstatus.value = false;
};
</script>

<template>
  <BotchattesterView v-if="chatBoxShow" @close="()=>{chatBoxShow = false}"/>
  <BotselectorView :show="showSelectorstatus" @close="hideSelector" />
  <div class="main-header">
    <div class="part">
      <div class="icon">
        <img src="./../../assets/logo/chat_charfter.png" alt="Logo" />
      </div>
      <div class="text">Chat Crafter</div>
    </div>

    <div class="part">
      <div :class="info.profile.active ? 'option-item' : 'option-item over-out'" @click="toggleLogin" >
        <img src="./../../assets/icon/head/power.png" alt="Power" />
      </div>
      <div :class="info.profile.active ? 'option-item' : 'option-item over-out'" @click="router.push('/traning')">
        <img src="./../../assets/icon/head/traning.png" alt="Training" />
      </div>
      <div :class="info.profile.active ? 'option-item chat' : 'option-item profile over-out'" @click="()=>{chatBoxShow = true}">
        <img src="./../../assets/icon/head/chat_box.png" alt="Chat Box" />
      </div>

      <div
        :class="!info.profile.active ? 'option-item profile' : 'option-item profile over-out'"
        @click="showSelector"
      >
        <img src="./../../assets/icon/head/profile.png" alt="Profile" />
      </div>
    </div>
  </div>
</template>

<style lang="css" src="./style.css"></style>
