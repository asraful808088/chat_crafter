<script setup>
import { TextstoreView } from "#components";
import { ItemselectorView } from "#components";
import useIntentesSelectStore from "~/state/intentsSelector/storage";
</script>
<template>
  <!-- <TextstoreView name="Intents" of="intents"/> -->
  <ItemselectorView of="intents" :state="useIntentesSelectStore()"/>
</template>
