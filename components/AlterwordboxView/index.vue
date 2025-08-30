<script setup>
import { onMounted, ref } from "vue";
import updateAlternative from "~/network/changeAlternativeQ/changeAlternative";

import { useRoute } from "#app";

const route = useRoute();
const id = route.params.id;
const props = defineProps({
  list_of_item: {
    type: Array,
    require: false,
    default: [],
  },
  item_of_item: {
    type: Array,
    require: false,
    default: [],
  },
  name: {
    type: String,
    require: false,
  },
  of: {
    type: String,
    require: false,
  },
  onNewList: {
    type: Function,
    require: false,
  },
  onClose: {
    type: Function,
    require: false,
  },
  dotHide: {
    type: Boolean,
    require: false,
  },
  onChange: {
    type: Function,
    require: false,
  },
});
const items = ref([]);
onMounted(() => {
  const newList = props.list_of_item.filter((element) => {
    const find = props.item_of_item.find((element2) => element2 == element);
    if (find) {
      return true;
    }
    return false;
  });
  items.value = newList;
});
function onChange(i, remove = false) {
  updateAlternative(
    {
      of: props.of,
      change: remove ? "removeAlter" : "addAlter",
      sent: props.name,
      add: i,
      item: id,
    },
    (res, err) => {
      if (!err) {
        if (res.items) {
          if (props.onNewList) {
            props.onNewList(res.items);
          }
          if (remove) {
            items.value = items.value.filter((element) => element != i);
          } else {
            items.value = [...items.value, i];
          }
        }
      }
    }
  );
}
</script>
<template>
  <div class="alter-bg-layer">
    <div class="board">
      <div class="back-box">
        <div class="button" @click="props.onClose">
          <img src="../../assets/icon/other/backbutton.png" alt="" />
        </div>
      </div>
      <div class="word-head">
        <h3>Synonyms-Words</h3>
      </div>
      <div class="word-box">
        <div class="word-item" v-for="(i, n) in props.list_of_item">
          <div class="icon">
            <img src=".././../assets/icon/other/Group 5.png" alt="" />
          </div>
          <div
            class="txt"
            @click="
              () => {
                if (props.dotHide) {
                  props.onChange(i);
                }
              }
            "
          >
            {{ i }}
          </div>
          <div class="icon" v-if="!props.dotHide">
            <div class="circle" @click="onChange(i, items.includes(i))">
              <div class="dot" v-if="items.includes(i)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="./style.css"></style>
