<script setup>
import { io } from "socket.io-client";
import { onMounted, ref } from "vue";

const props = defineProps({
  onSubmit: {
    type: Function,
    require: false,
  },
  onClose: {
    type: Function,
    require: false,
  },
});
let socket = io();
const list_of_entities = ref([]);
const storeEntities = ref([]);
const inputtxt = ref("");
onMounted(() => {
  socket.on("entities_pass", (data) => {
    if (data.items) {
      list_of_entities.value = data.items;
    }
  });
  socket.emit("get_socket");
});
onUnmounted(() => {
  socket = null;
});

function activeButton() {
  return storeEntities.value.length != 0 && inputtxt.value.trim().length != 0;
}
function addAndsetr(i) {
  if (storeEntities.value.includes(i)) {
    storeEntities.value = storeEntities.value.filter((ele) => ele != i);
  } else {
    storeEntities.value = [...storeEntities.value, i];
  }
}

function submittrain() {
  if (!activeButton()) {
    return;
  }
  if (!props.onSubmit) {
    return;
  }
  props.onSubmit({
    item: storeEntities.value,
    name: inputtxt.value,
  });
  inputtxt.value = "";
}
</script>
<template>
  <div class="Entites-selector">
    <div class="board">
      <div class="back-box">
        <div class="button" @click="props.onClose" >
          <img src="../../assets/icon/other/backbutton.png" alt="" />
        </div>
      </div>
      <h2>Select Entities</h2>
      <div class="input-box">
        <input
          type="text"
          name=""
          id=""
          placeholder="entites-name"
          v-model="inputtxt"
        />
      </div>
      <div class="item-box">
        <div
          class="item"
          v-for="(i, n) in list_of_entities"
          @click="addAndsetr(i)"
        >
          <div class="icon">
            <img src="../../assets/icon/nav/entities.png" alt="" />
          </div>
          <div class="txt">{{ i }}</div>
          <div class="radio">
            <div class="dot" v-if="storeEntities.includes(i)"></div>
          </div>
        </div>
      </div>
      <div
        :class="!activeButton() ? 's-button low-opa' : 's-button'"
        @click="submittrain"
      >
        Train-Now
      </div>
    </div>
  </div>
</template>
<style lang="css" src="./style.css"></style>
