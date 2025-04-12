<script setup>
import { DropcardView, LstmcardView } from "#components";
const props = defineProps({
  onChange: {
    type: Function,
    require: false,
  },
  show: {
    type: Boolean,
    require: false,
    default: false,
  },
  onClose: {
    type: Function,
    require: false,
    default: false,
  },
  layerlist: {
    type: Array,
    require: false,
  },
});

function isExsi(name) {
  return props.layerlist.find((elements) => elements.type == name);
}
</script>
<template>
  <div class="Layer-main" v-if="props.show">
    <div class="box">
      <div class="back-box">
        <div class="button" role="button" @click="props.onClose">
          <img src="../../assets/icon/other/backbutton.png" alt="" />
        </div>
      </div>
      <div class="layer-box">
        <LstmcardView
          :model_display="false"
          @apply="props.onChange"
          :header="'MHSA'"
          layer_type="multi_head_self_attention"
        />
      </div>
    </div>
  </div>
</template>

<style src="./style.css"></style>
