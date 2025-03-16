<script setup>
import { HeaderView, ItemselectorView, NavigationView } from "#components";
import { useBotbuilderStore } from "~/state/state";
import useIntentesSelectStore from "./state/intentsSelector/storage";
const info = useBotbuilderStore();
</script>
<template>
  <HeaderView />
  <NavigationView />
  <div class="route-view"  v-if="info.profile?.active">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <!-- <ItemselectorView of="intents" :state="useIntentesSelectStore()"/> -->
  </div>
  <IntroView v-if="!info.profile?.active" />
</template>
