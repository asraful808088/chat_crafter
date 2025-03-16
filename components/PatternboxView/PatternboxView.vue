<script setup>
import { ref, watchEffect } from "vue";
const props = defineProps({
  info: {
    type: Object,
    require: false,
  },
  onUpdate: {
    type: Function,
    require: false,
  },
  onDelete: {
    type: Function,
    require: false,
  },
});
const pattern = ref("");
const info = ref();
watchEffect(() => {
  if (props.info) {
    info.value = props.info;
  }
});
function inputOnchange(
  e,
  min = 1,
  max = 999999999999999999999,
  type = "float",
  inp = null
) {
  const input = e.target;
  let value = input.value;
  if (type === "float") {
    value = value.replace(/[^0-9.]/g, "");
    if ((value.match(/\./g) || []).length > 1) {
      value = value.slice(0, -1);
    }
  } else if (type === "int") {
    value = value.replace(/[^0-9]/g, "");
  }
  let numValue = parseFloat(value);
  if (isNaN(numValue) || numValue < min) {
    numValue = min;
  } else if (numValue > max) {
    numValue = max;
  }
  input.value = numValue;
  info.value.length = input.value;
  if (props.onUpdate) {
    props.onUpdate(info.value);
  }
}

function addText() {
  if (!pattern.value) {
    return;
  }
  info.value = {
    ...info.value,
    latters: pattern.value,
  };
  pattern.value = "";
  if (props.onUpdate) {
    props.onUpdate(info.value);
  }
}

function deleteItem(i) {
  info.value = {
    ...info.value,
    word_list: info.value.word_list.filter((element) => element != i),
  };
  if (props.onUpdate) {
    props.onUpdate(info.value);
  }
}
function addWordItem() {
  if (!pattern.value) {
    return;
  }
  info.value = {
    ...info.value,
    word_list: [...info.value.word_list, pattern.value],
  };
  pattern.value = "";
  if (props.onUpdate) {
    props.onUpdate(info.value);
  }
}
</script>
<template>
  <div class="generate-pattern-box-item-001" v-if="info">
    <div class="box-head">
      <div class="head-txt">{{ info.id }}</div>
      <div class="head-icon">
        <div
          class="icon"
          v-if="info.randomly_add"
          @click="
            () => {
              info.randomly_add = !info.randomly_add;
              if (props.onUpdate) {
                props.onUpdate(info);
              }
            }
          "
        >
          <img src="../../assets/icon/other/surprise-box.png" alt="" />
        </div>

        <div
          class="icon"
          v-if="!info.randomly_add"
          @click="
            () => {
              info.randomly_add = !info.randomly_add;
              if (props.onUpdate) {
                props.onUpdate(info);
              }
            }
          "
        >
          <img src="../../assets/icon/other/target.png" alt="" />
        </div>

        <div class="icon" @click="props.onDelete" >
          <img src="../../assets/icon/other/delete.png" alt="" />
        </div>
      </div>
    </div>
    <div class="">
      <div class="sub-add-box">
        <input type="text" name="" id="" placeholder="text" v-model="pattern" />
        <div
          class="button"
          @click="
            () => {
              info.useList = !info.useList;
              if (props.onUpdate) {
                props.onUpdate(info);
              }
            }
          "
        >
          {{ info.useList ? "word-list" : "Latter" }}
        </div>
        <div
          class="button"
          @click="
            () => {
              if (!info.useList) {
                addText();
              } else {
                addWordItem();
              }
            }
          "
        >
          add
        </div>
      </div>
    </div>
    <div class="">
      <div class="sub-add-box">
        <input
          type="number"
          name=""
          id=""
          placeholder="length-count"
          :value="info.length"
          @input="inputOnchange"
        />
        <div
          class="button button-count"
          @click="
            () => {
              if (info.length < 999999999999999999999) {
                info.length++;
                if (props.onUpdate) {
                  props.onUpdate(info);
                }
              }
            }
          "
        >
          +
        </div>
        <div
          class="button button-count"
          @click="
            () => {
              if (info.length > 1) {
                info.length--;
                if (props.onUpdate) {
                  props.onUpdate(info);
                }
              }
            }
          "
        >
          -
        </div>
      </div>
    </div>
    <div class="txt-box" v-if="!info.useList">
      {{ info.latters }}
    </div>
    <div class="word-box-list-items" v-if="info.useList">
      <div class="word-box-list-item" v-for="(i, c) in info.word_list">
        <div class="icon">
          <img src="../../assets/icon/nav/synonym.png" alt="" />
        </div>
        <div class="rxrx">{{ i }}</div>
        <div class="icon" @click="deleteItem(i)">
          <img src="../../assets/icon/other/delete.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" src="./style.css"></style>
