<script setup>
import { ItemselectorView } from "#components";
import useEntitiesSelectStore from "~/state/Selector copy/storage";


</script>
<template>
  <ItemselectorView
    of="response"
    header="Response"
    client_path="responselist"
    :state="useEntitiesSelectStore()"
  />
</template>
