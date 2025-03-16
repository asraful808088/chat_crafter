<script setup>
import { LoadingRequestView } from "#components";
const props = defineProps({
  txt: {
    type: String,
    require: false,
    default: null,
  },
  show: {
    type: Boolean,
    require: false,
    default: false,
  },
});
</script>
<template>
  <div class="traning-main" v-if="props.show">
    <div class="dialog-box">
      <div class="load">
        <LoadingRequestView :txt="props.txt" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.traning-main {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.598);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999;
}
.traning-main .dialog-box {
  height: 450px;
  width: 800px;
  box-shadow: 5px 5px 5px rgba(42, 42, 42, 0.598);
  background-color: white;
  border-left: 2px solid rgb(255, 111, 0);
  border-top: 2px solid rgb(255, 111, 0);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.traning-main .dialog-box .load {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 350px;
  aspect-ratio: 1/1;
}
</style>
