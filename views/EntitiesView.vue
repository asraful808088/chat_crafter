<script setup>
import { ItemselectorView } from "#components";
import useEntitiesSelectStore from "~/state/Selector copy/storage";
import ItemSelectorView2 from "~/components/ItemSelectorView2/ItemSelectorView2.vue";
</script>
<template>
  <ItemSelectorView2
    of="entities"
    header="Entities"
    client_path="entitieslist"
  />
</template>
