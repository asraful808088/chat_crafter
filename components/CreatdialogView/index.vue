<script setup>
import { onMounted, ref } from "vue";
import AnimationdiglogboxView from "../Animation_diglog_box/AnimationdiglogboxView.vue";

const txt1 = ref("");
const txt2 = ref("");
const txt3 = ref("");
const props = defineProps({
  inputType: {
    type: Boolean,
    require: false,
    default: true,
  },
  onApply: {
    type: Function,
    require: false,
  },
  onClose: {
    type: Function,
    require: false,
  },
  info: {
    type: Object,
    require: false,
  },
});
function create() {
  if (props.inputType) {
    if (txt1.value && txt2.value && txt3.value) {
      if (props.onApply) {
        props.onApply({
          name: txt1.value.trim(),
          des: txt2.value.trim(),
          type: txt3.value.trim().replaceAll(" ", "_"),
        });
      }
    }
  } else {
    if (txt1.value && txt2.value) {
      if (props.onApply) {
        props.onApply({
          name: txt1.value.trim(),
          des: txt2.value.trim(),
        });
      }
    }
  }
  txt1.value = "";
  txt2.value = "";
  txt3.value = "";
}
const showContext = ref(false);
onMounted(() => {
  setTimeout(() => {
    showContext.value = true;
  }, 1);
});
</script>
<template>
  <AnimationdiglogboxView
    :auto-down="props.info"
    @close="
      () => {
        if (props.onClose) {
          props.onClose();
        }
      }
    "
  >
    <div class="Create-txt-input-box">
      <div class="board">
        <div class="header">Create Item</div>
        <div class="hei" v-if="!props.inputType"></div>
        <div class="input-box" v-if="showContext">
          <input
            type="text"
            name=""
            id=""
            class="tx-input"
            placeholder="name"
            v-model="txt1"
          />
        </div>
        <div class="input-box2" v-if="showContext">
          <textarea
            name=""
            id=""
            class="tx-input"
            placeholder="description"
            v-model="txt2"
          ></textarea>
        </div>
        <div class="input-box" v-if="props.inputType && showContext">
          <input
            type="text"
            name=""
            id=""
            class="tx-input"
            placeholder="type"
            v-model="txt3"
          />
        </div>
        <div class="button" @click="create">Create</div>
      </div>
    </div>
  </AnimationdiglogboxView>
</template>
<style src="./style.css"></style>
