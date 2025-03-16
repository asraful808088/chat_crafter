<script setup>
const props = defineProps({
  model_display: {
    type: Boolean,
    require: false,
    default: true,
  },
  showOff: {
    type: Boolean,
    require: false,
  },
  onApply: {
    type: Function,
    require: false,
  },
  layer_info: {
    type: Object,
    require: false,
  },
  index: {
    type: Number,
    require: false,
  },
  onUpdate: {
    type: Function,
    require: false,
  },
  header: {
    type: String,
    require: false,
    default: "B-LSTM",
  },
  details_board: {
    type: Boolean,
    require: false,
    default: true,
  },
  layer_type: {
    type: String,
    require: false,
    default: "dense",
  },
  onDeleteLayer: {
    type: Function,
    require: false,
  },
});
import { onMounted, ref } from "vue";

const count = ref(1);
const txt1 = ref(1);
const txt2 = ref(2);
const txt3 = ref(0.1111);
const persepInfo = ref({
  persep: {
    active: 64,
    list: [64, 60, 50, 30, 15, 16, 8, 4],
  },
  l1: {
    active: 2,
    list: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  l2: {
    active: null,
    list: [0.1, 0.2, 0.3, 0.4, null],
  },
  activation: {
    active: "tanh",
    list: ["tanh", "relu"],
  },
});
function nextButton() {
  if (count.value == 2) {
    count.value = 1;
  } else {
    count.value = count.value + 1;
  }
}
function prevButton() {
  if (count.value == 1) {
    count.value = 2;
  } else {
    count.value = count.value - 1;
  }
}
function inputOnchange(
  e,
  min = 0.0000001,
  max = 0.999999999999999999999,
  type = "float",
  t = 1
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
  if (t == 1) {
    txt1.value = numValue;
  } else if (t == 2) {
    txt2.value = numValue;
  } else if (t == 3) {
    txt3.value = numValue;
  }
}

function addItem(t) {
  if (t == 1) {
    if (!txt1.value) {
      return;
    }
    let temp1 = persepInfo.value["persep"];
    let temp2 = {
      ...temp1,
      list: [...new Set([txt1.value, ...persepInfo.value["persep"].list])],
    };
    persepInfo.value = {
      ...persepInfo.value,
      persep: temp2,
    };
    if (props.onUpdate) {
      props.onUpdate(persepInfo.value);
    }
  } else if (t == 2) {
    if (!txt2.value) {
      return;
    }
    let temp1 = persepInfo.value["l1"];
    let temp2 = {
      ...temp1,
      list: [...new Set([txt2.value, ...persepInfo.value["l1"].list])],
    };
    persepInfo.value = {
      ...persepInfo.value,
      l1: temp2,
    };
    if (props.onUpdate) {
      props.onUpdate(persepInfo.value);
    }
  } else if (t == 3) {
    if (!txt3.value) {
      return;
    }
    let temp1 = persepInfo.value["l2"];
    let temp2 = {
      ...temp1,
      list: [...new Set([txt3.value, ...persepInfo.value["l2"].list])],
    };
    persepInfo.value = {
      ...persepInfo.value,
      l2: temp2,
    };
    if (props.onUpdate) {
      props.onUpdate(persepInfo.value);
    }
  }
}
function changeActivation() {
  persepInfo.value = {
    ...persepInfo.value,
    activation: {
      ...persepInfo.value.activation,
      active: persepInfo.value.activation.active != "tanh" ? "tanh" : "relu",
    },
  };
  if (props.onUpdate) {
    props.onUpdate(persepInfo.value);
  }
}
function onApply() {
  if (props.onApply) {
    props.onApply({
      ...persepInfo.value,
      id: Date.now(),
      type: props.layer_type,
    });
  }
}

function updateModel(property, val) {
  persepInfo.value = persepInfo.value[property] = {
    ...persepInfo.value[property],
    list: [val, ...persepInfo.value[property].list],
  };
  if (props.onUpdate) {
    props.onUpdate(persepInfo.value);
  }
}

function delUpdateModel(property, val) {
  persepInfo.value[property] = {
    ...persepInfo.value[property],
    list: persepInfo.value[property].list.filter((element) => element != val),
  };
  if (props.onUpdate) {
    props.onUpdate(persepInfo.value);
  }
}

function txtInput(e) {}
onMounted(() => {
  if (props.layer_info) {
    persepInfo.value = props.layer_info;
  }
});

function updateToSelect(property, val) {
  let temp1 = persepInfo.value[property];
  let temp2 = {
    ...temp1,
    active: val,
  };
  persepInfo.value[property] = temp2;
  if (props.onUpdate) {
    props.onUpdate(persepInfo.value);
  }
}
</script>

<template>
  <div class="blatm-card">
    <div class="layer">
      <div class="icon" v-if="!props.model_display">
        <img
          src="../../assets/icon/other/noun-neural-network-6301591.png"
          alt=""
        />
      </div>
      <div class="layer-indi" v-if="props.model_display">
        <div class="indi-part">
          <div class="count">{{ props.index }}</div>
          <div class="txt">Layer</div>
        </div>
        <div
          class="indi-part indi-icon"
          @click="onDeleteLayer(props.layer_info)"
        >
          <img src="../../assets/icon/other/delete.png" alt="" />
        </div>
      </div>
      <div class="head">
        <div>{{ props.header }}</div>
        <div class="arrow" v-if="props.details_board">
          <div class="icon" @click="prevButton">
            <img src="../../assets/icon/other/arrow.png" alt="" />
          </div>
          <div class="icon" @click="nextButton">
            <img src="../../assets/icon/other/arrow.png" alt="" />
          </div>
        </div>
        <div class="apply" @click="onApply">Apply</div>
      </div>
      <div class="select-box-s" v-if="!props.details_board">N/A</div>
      <div class="select-box" v-if="props.details_board">
        <div class="part" v-if="count == 1">
          <div class="input-box">
            <input
              type="number"
              placeholder="perceptron"
              @input="
                (e) =>
                  inputOnchange(
                    e,
                    (min = 1),
                    (max = 100000000),
                    (type = 'float'),
                    1
                  )
              "
            />
            <div class="button" role="button" @click="addItem(1)">Add</div>
          </div>
          <div class="input-items">
            <div
              class="input-items-item"
              v-for="(i, n) in persepInfo.persep.list"
            >
              <div class="icon" @click="updateToSelect('persep', i, 1)">
                <img src="../../assets/icon/other/Group 2.png" alt="" />
              </div>
              <div class="txt" @click="updateToSelect('persep', i, 1)">
                {{ i }}
              </div>
              <div
                class="icon delete-icon"
                v-if="props.showOff && i != persepInfo.persep.active"
                @click="() => delUpdateModel('persep', i)"
              >
                <img src="../../assets/icon/other/delete.png" alt="" />
              </div>
              <div
                class="icon delete-icon"
                v-if="i == persepInfo.persep.active"
              >
                <img
                  src="../../assets/icon/other/orange-square-svgrepo-com.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>

        <div
          class="part"
          v-if="count == 2 && 'multi_head_self_attention' == props.layer_type"
        >
          <div class="input-box">
            <input
              type="number"
              placeholder="head"
              step=".001"
              @input="
                (e) =>
                  inputOnchange(
                    e,
                    (min = 1),
                    (max = 999999999999999999999999),
                    (type = 'float'),
                    2
                  )
              "
            />
            <div class="button" role="button" @click="addItem(2)">Add</div>
          </div>
          <div class="input-items">
            <div class="input-items-item" v-for="(i, n) in persepInfo.l1.list">
              <div class="icon" @click="updateToSelect('l1', i, 2)">
                <img
                  src="../../assets/icon/other/number-one-svgrepo-com.png"
                  alt=""
                />
              </div>
              <div class="txt" @click="updateToSelect('l1', i, 2)">
                {{ i ?? "None" }}
              </div>
              <div
                class="icon delete-icon"
                v-if="
                  props.showOff && !(i == persepInfo.l1.active || i == null)
                "
                @click="() => delUpdateModel('l1', i)"
              >
                <img src="../../assets/icon/other/delete.png" alt="" />
              </div>
              <div class="icon delete-icon" v-if="i == persepInfo.l1.active">
                <img
                  src="../../assets/icon/other/orange-square-svgrepo-com.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>

        <div class="part" v-if="count == 2">
          <div class="input-box">
            <input
              type="number"
              placeholder="drop-rate"
              step=".001"
              @input="
                (e) =>
                  inputOnchange(
                    e,
                    (min = 0.0000001),
                    (max = 0.999999999999999999999),
                    (type = 'float'),
                    3
                  )
              "
            />
            <div class="button" role="button" @click="addItem(3)">Add</div>
          </div>
          <div class="input-items">
            <div class="input-items-item" v-for="(i, n) in persepInfo.l2.list">
              <div class="icon" @click="updateToSelect('l2', i, 3)">
                <img
                  src="../../assets/icon/other/two-circle-fill-svgrepo-com.png"
                  alt=""
                />
              </div>
              <div class="txt" @click="updateToSelect('l2', i, 3)">
                {{ i ?? "None" }}
              </div>
              <div
                class="icon delete-icon"
                v-if="
                  props.showOff && !(i == persepInfo.l2.active || i == null)
                "
                @click="() => delUpdateModel('l2', i)"
              >
                <img src="../../assets/icon/other/delete.png" alt="" />
              </div>
              <div class="icon delete-icon" v-if="i == persepInfo.l2.active">
                <img
                  src="../../assets/icon/other/orange-square-svgrepo-com.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>

        <!-- <div
          class="part"
          v-if="count == 2 && 'multi_head_self_attention' != props.layer_type"
        >
          <div class="input-box">
            <input
              type="text"
              placeholder="Activation"
              readonly
              :value="persepInfo.activation.active"
            />
            <div class="button" role="button" @click="changeActivation">
              {{ persepInfo.activation.active == "tanh" ? "Relu" : "Tanh" }}
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<style src="./style.css"></style>
