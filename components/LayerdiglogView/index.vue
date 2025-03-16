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
        <LstmcardView :model_display="false" @apply="props.onChange" />
        <LstmcardView
          :model_display="false"
          @apply="props.onChange"
          :details_board="false"
          :header="'Global Average Pooling 1D'"
          layer_type="global_average_pooling_1D"
          v-if="!isExsi('global_average_pooling_1D') && isExsi('multi_head_self_attention')"
        />
        <LstmcardView
          :model_display="false"
          @apply="props.onChange"
          :details_board="false"
          :header="'Batch Normalization'"
          layer_type="batch_normalization"
          v-if="!isExsi('batch_normalization') && isExsi('global_average_pooling_1D')"
        />
        <LstmcardView
          :model_display="false"
          @apply="props.onChange"
          :header="'MHSA'"
          layer_type="multi_head_self_attention"
          v-if="!isExsi('global_average_pooling_1D')"
        />
        <DropcardView :model_display="false" @apply="props.onChange" />
      </div>
    </div>
  </div>
</template>

<style src="./style.css"></style>
