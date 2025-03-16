<script lang="ts" setup>
import { ItemselectorView } from "#components";
import useIntentesSelectStore from "~/state/intentsSelector/storage";
</script>
<template>
  <ItemselectorView of="synonyms" client_path="synonymslist" :state="useIntentesSelectStore()" />
</template>
