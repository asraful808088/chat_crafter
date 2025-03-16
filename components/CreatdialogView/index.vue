<script setup>
import { ref } from "vue";
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
  show: {
    type: Boolean,
    require: false,
    default: false,
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
</script>
<template>
  <div class="Create-txt-input-box" v-if="props.show">
    <div class="board">
      <div class="close-box">
        <div class="icon" @click="props.onClose">
          <img src="../../assets/icon/other/backbutton.png" alt="" />
        </div>
      </div>
      <div class="hei" v-if="!props.inputType"></div>
      <div class="input-box">
        <input
          type="text"
          name=""
          id=""
          class="tx-input"
          placeholder="name"
          v-model="txt1"
        />
      </div>
      <div class="input-box2">
        <textarea
          name=""
          id=""
          class="tx-input"
          placeholder="description"
          v-model="txt2"
        ></textarea>
      </div>
      <div class="input-box" v-if="props.inputType">
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
</template>
<style src="./style.css"></style>
