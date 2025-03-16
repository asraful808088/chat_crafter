<script setup>
import { ItemselectorView } from "#components";
import useEntitiesSelectStore from "~/state/Selector copy/storage";
</script>
<template>
  <ItemselectorView
    of="entities"
    header="Entities"
    client_path="entitieslist"
    :state="useEntitiesSelectStore()"
  />
</template>
