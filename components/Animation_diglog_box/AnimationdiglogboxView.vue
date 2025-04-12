<script lang="ts" setup>
import { ref, watchEffect } from "vue";

const props = defineProps({
  onClose: {
    type: Function,
    required: false,
  },
  autoDown: {
    type: Boolean,
    required: false,
  },
});

const amination1 = ref(false);
const amination2 = ref(false);
const hideContainer = ref(false);

watchEffect(() => {
  if (props.autoDown) {
    hideContainer.value = true;

    amination1.value = true;
    amination2.value = true;
  } else {
    amination2.value = false;
    amination1.value = false;

    setTimeout(() => {
      hideContainer.value = false;
      if (props.onClose) {
        props.onClose();
      }
    }, 660);
  }
});

function onClose() {
  amination2.value = false;
  amination1.value = false;

  setTimeout(() => {
    hideContainer.value = false;
    if (props.onClose) {
      props.onClose();
    }
  }, 660);
}
</script>
<template>
  <div class="main-box-animation-box" v-show="hideContainer">
    <div
      :class="
        amination1
          ? 'blur-box-xx222222 main-blur'
          : 'blur-box-xx222222 main-blur-0'
      "
      @click="onClose"
    ></div>
    <div
      :class="
        amination2 ? 'card-box card-box-anim' : 'card-box card-box-anim-0'
      "
    >
      <div class="button-box">
        <div class="button" @click="onClose">
          <img src="../../assets/icon/other/Group 227.png" alt="" />
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>
<style lang="css" src="./style.css"></style>
