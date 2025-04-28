<script lang="ts" setup>
import { ItemselectorView } from "#components";
import useIntentesSelectStore from "~/state/intentsSelector/storage";
import ItemSelectorView2 from "~/components/ItemSelectorView2/ItemSelectorView2.vue";
</script>
<template>
   <ItemSelectorView2 of="synonyms" :client_path="'synonymslist'" :header="'Synonyms'"/>

</template>
