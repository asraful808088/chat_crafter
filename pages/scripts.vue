<script setup>
import ScriptsView from "~/views/ScriptsView/ScriptsView.vue";
import { ItemselectorView } from "#components";
import useIntentesSelectStore from "~/state/intentsSelector/storage";
import ItemSelectorView2 from "~/components/ItemSelectorView2/ItemSelectorView2.vue";
</script>
<template>
  <ItemSelectorView2 of="scripts" :client_path="'scriptslist'" :header="'Scripts'"/>
</template>
