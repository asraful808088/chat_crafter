<script setup>
import ScriptsView from "~/views/ScriptsView/ScriptsView.vue";
import { ItemselectorView } from "#components";
import useIntentesSelectStore from "~/state/intentsSelector/storage";
</script>
<template>
  <!-- <ScriptsView /> -->
  <ItemselectorView of="scripts" :client_path="'scriptslist'" :state="useIntentesSelectStore()"/>
</template>
