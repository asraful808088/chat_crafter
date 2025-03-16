<script setup>
import { ref } from "vue";
const props = defineProps({
  onText: {
    type: Function,
    require: false,
  },
});
const textInput = ref("");
const enableEnterpress = ref(true);
function clearText() {
  textInput.value = "";
}
function submit() {
  if (textInput.value) {
    let newItems = textInput.value.split("\n").map((element) => element.trim());
    newItems = newItems.filter((element) => element != "");
    if (props.onText) {
      props.onText(newItems);
    }
  }
  textInput.value = "";
}
function changetxtInputSys() {
  enableEnterpress.value = !enableEnterpress.value;
}

function handleKeyDown(event) {
  if (event.key === "Enter" && !event.shiftKey && enableEnterpress.value) {
    event.preventDefault();
    submit();
  }
}
</script>

<template>
  <div class="text-input-box">
    <div class="input-box">
      <textarea
        class="input"
        placeholder="input"
        v-model="textInput"
        @keydown="handleKeyDown"
      ></textarea>
      <div class="option-button">
        <div class="button button-1" @click="clearText">Clear Input</div>
        <div class="button button-1" @click="changetxtInputSys">
          {{ enableEnterpress ? "By Enter Press" : "Press to Submit" }}
        </div>
        <div class="button button-2" @click="submit">Submit</div>
      </div>
    </div>
  </div>
</template>

<style lang="css" src="./style.css"></style>
