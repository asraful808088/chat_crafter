<script setup lang="ts">
import ListitemsView from "../ListitemsView/ListitemsView.vue";
const props = defineProps({
  items: {
    type: Array,
    require: false,
  },
  allAlter: {
    type: Boolean,
    require: false,
  },
  onRegenerate: {
    type: Function,
    require: false,
  },
  onDelete: {
    type: Function,
    require: false,
  },
});
</script>

<template>
  <ListitemsView
    :items="props.items"
    :allAlter="props.allAlter"
    @delete="
      (item) => {
        if (props.onDelete) {
          props.onDelete(item);
        }
      }
    "
    @regenerate="
      (item) => {
        props.onRegenerate(item);
      }
    "
  />
</template>
<style lang="css" src="./style.css"></style>
