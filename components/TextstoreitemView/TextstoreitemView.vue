<script setup lang="ts">
const props = defineProps({
  st: {
    type: String,
    require: false,
  },
  allAlter:{
        type: Boolean,
        require: false,
    },
  onUpdateAlternative:{
        type: Function,
        require: false,

    },
    onActiveAlternative:{
        type: Function,
        require: false,

    },
    onEntitiesEdit:{
      type: Function,
      require: false,
    },
    hideUnbutton:{
      type: Boolean,
      require: false,
    },
    onGenerate:{
      type: Function,
      require: false,
    },
    onDelete:{
      type:Function,
      require:false
    }
  
});
</script>

<template>
  <div class="text-card-view-0002222">
    <div class="bg"></div>
    <div class="image-text">
      <div class="image">
        <img src="../../assets/icon/other/txt.png" alt="" />
      </div>
      <div class="txt">
        {{ props.st }}
      </div>
    </div>
    <div class="options">
      <div class="options-part">
        <div :class="props.allAlter?'icon low-scale low-opacity':'icon low-scale'" v-if="!props.hideUnbutton" @click="()=>{
          if (props.onActiveAlternative) {
            props.onActiveAlternative()
          }
        }">
          <img src="../../assets/icon/other/alter.png" alt="" />
        </div>
        <div :class="props.allAlter? 'icon active-border':'icon'" v-if="!props.hideUnbutton" @click="()=>{
          if (props.onUpdateAlternative) {
            props.onUpdateAlternative()
          }
        }" >
          <img src="../../assets/icon/other/Group 5.png" alt="" />
        </div>
        <div class="icon" @click="()=>{
          if (props.onEntitiesEdit) {
            props.onEntitiesEdit()
          }
        }"  >
          <img src="../../assets/icon/other/Group 300.png" alt="" />
        </div>
        
      </div>
      <div class="options-part">
        <div class="icon" v-if="!props.hideUnbutton" @click="()=>{
          if (props.onGenerate) {
            props.onGenerate()
          }
        }" >
          <img src="../../assets/icon/other/Group 385.png" alt="" />
        </div>
        <div class="icon" @click="props.onDelete" >
          <img src="../../assets/icon/other/delete.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="css" src="./style.css"></style>
