<script setup>
const props = defineProps({
  messgae: {
    type: String,
    require: false,
  },
  onYes: {
    type: Function,
    require: false,
  },
  onNo: {
    type: Function,
    require: false,
  },
  onClose: {
    type: Function,
    require: false,
  },
  show: {
    type: Boolean,
    require: false,
    default: false,
  },
});
</script>
<template>
  <div class="main-frame" v-if="props.show">
    <div class="diglog-box">
      <div class="cross-box">
        <div class="cross-button" @click="props.onClose">
          <img src="./../../assets/icon/other/backbutton.png" alt="" />
        </div>
      </div>
      <p class="txt">
        {{ props.messgae ?? "Are you sure you want to delete this item?" }}
      </p>
      <div class="button-box">
        <p class="button r" @click="props.onYes">Yes</p>
        <p class="button g" @click="props.onNo">No</p>
      </div>
    </div>
  </div>
</template>

<style lang="css" src="./style.css"></style>
