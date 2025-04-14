<script setup>
const props = defineProps({
  isShort: {
    type: Boolean,
    require: false,
    default: false,
  },
  headerName: {
    type: String,
    require: false,
  },
  onDelete:{
    type: Function,
    require: false,
  },
  onClick:{
    type: Function,
    require: false,
  },
  activecurrentItem:{
    type: String,
    require: false,
  }
});
</script>
<template>
  <div :class="activecurrentItem==props.headerName? 'ListitemView-001 ListitemViewAction-001':'ListitemView-001'">
    <div class="i-box">
      <div class="i-i-icon" @click="props.onClick">
        <img
          src="../../assets/icon/other/Group 164.png"
          alt=""
        />
       
      </div>
    </div>
    <div class="txt-box" @click="props.onClick">
      <p> {{ props.headerName??"Demo-Header" }} </p>
      <div>start-with  </div>
    </div>
    <div class="i-box">
      <div class="icon" @click="props.onDelete">
        <img src="../../assets/icon/other/delete.png" alt="" />
      </div>
    </div>
  </div>
</template>
<style src="./style.css"></style>
