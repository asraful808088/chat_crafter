<script setup>
import { DropcardView, LstmcardView } from "#components";
import BlstmlayerView from "../BlstmlayerView/BlstmlayerView.vue";
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
          
        <BlstmlayerView :model_display="false"  @apply="props.onChange" layer_type="B_LSTM"
        v-if="!isExsi('multi_head_self_attention')"
        />
        <LstmcardView
          :model_display="false"
          @apply="props.onChange"
          :details_board="false"
          :header="'Layer-Normalization'"
          layer_type="batch_normalization"
         
        />
        <LstmcardView
          :model_display="false"
          @apply="props.onChange"
          :header="'MHSA'"
          layer_type="multi_head_self_attention"
        />
        <DropcardView :model_display="false" @apply="props.onChange" />
        <DropcardView :model_display="false" @apply="props.onChange" drop-type1-ds="true" />
      </div>
    </div>
  </div>
</template>

<style src="./style.css"></style>
