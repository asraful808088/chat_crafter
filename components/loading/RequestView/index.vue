<script setup>
import animationData from "@/assets/animation/Animation - 1738503827906.json";
import { Vue3Lottie } from "vue3-lottie";
const props = defineProps({
  txt: {
    type: String,
    require: false,
  },
});
</script>

<template>
  <div class="loading-with-txt">
    <div class="anim-box">
      <Vue3Lottie
        :animationData="animationData"
        :loop="true"
        :autoplay="true"
      />
    </div>
    <div class="txt"> {{ props.txt??"Please-Wait..." }} </div>
  </div>
</template>

<style src="./style.css" lang="css"></style>
