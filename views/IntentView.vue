<script setup>
import { TextstoreView } from "#components";
import { ItemselectorView } from "#components";
import useIntentesSelectStore from "~/state/intentsSelector/storage";
import ItemSelectorView2 from "~/components/ItemSelectorView2/ItemSelectorView2.vue";
</script>
<template>
  <!-- <TextstoreView name="Intents" of="intents"/> -->
  <!-- <ItemselectorView of="intents" :state="useIntentesSelectStore()"/> -->
  <ItemSelectorView2 />
</template>
