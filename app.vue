<script setup>
import { HeaderView, NavigationView } from "#components";
import { useBotbuilderStore } from "~/state/state";
import SidenavView from "./components/SidenavView/SidenavView.vue";
const info = useBotbuilderStore();
</script>
<template>
  <div class="bg-01111111111111111"></div>
  <HeaderView />
  
  <div class="route-view" v-if="info.profile?.active">
    <SidenavView />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <!-- <ItemselectorView of="intents" :state="useIntentesSelectStore()"/> -->
  </div>
  <IntroView v-if="!info.profile?.active" />
</template>
