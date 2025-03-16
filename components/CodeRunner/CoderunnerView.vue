<script setup>
const props = defineProps({
  cmdtxt: {
    type: String,
    require: false,
  },
  onClose: {
    type: Function,
    require: false,
  },
});
</script>
<template>
  <div class="bg-taost">
    <div class="cmd-box">
      <div class="backbox">
        <div class="backbutton" @click="props.onClose">
          <img src="../../assets/icon/other/backbutton.png" alt="" />
        </div>
      </div>
      <div class="box">
        <p>{{ props.cmdtxt }}</p>
      </div>
    </div>
  </div>
</template>
<style lang="css" src="./style.css"></style>
