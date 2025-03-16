<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  model_display: {
    type: Boolean,
    require: false,
    default: true,
  },
  layer_info: {
    type: Object,
    require: false,
  },
  onApply: {
    type: Function,
    require: false,
  },
  index: {
    type: Number,
    require: false,
  },
  showOff: {
    type: Boolean,
    require: false,
  },
  onUpdate: {
    type: Function,
    require: false,
  },
  onDeleteLayer: {
    type: Function,
    require: false,
  },
  dropType1Ds: {
    type: Boolean,
    require: false,
    default: false,
  },
});
const laterInfo = ref({
  id: Date.now(),
  type: props.dropType1Ds?"s1d_dropout": "dropout",
  active: 0.1,
  list: [0.1, 0.2, 0.3, 0.05, 0.02, 0.03],
});
const txtinput = ref("");
function inputOnchange(
  e,
  min = 0.0000001,
  max = 0.999999999999999999999,
  type = "float"
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
  txtinput.value = numValue;
}

function updateModel() {
  if (txtinput.value.length == 0) {
    return;
  }
  laterInfo.value = {
    ...laterInfo.value,
    list: [txtinput.value, ...laterInfo.value.list],
  };
  if (props.onUpdate) {
    props.onUpdate(laterInfo.value);
  }
  txtinput.value = null;
}

function updateSelect(i) {
  laterInfo.value = {
    ...laterInfo.value,
    active: i,
  };
  if (props.onUpdate) {
    props.onUpdate({
      ...laterInfo.value,
      active: i,
    });
  }
}
onMounted(() => {
  if (props.layer_info) {
    laterInfo.value = props.layer_info;
  }
});
function deleteUpdate(i) {
  laterInfo.value = {
    ...laterInfo.value,
    list: laterInfo.value.list.filter((ele) => ele != i),
  };
  if (props.onUpdate) {
    props.onUpdate(laterInfo.value);
  }
}
</script>
<template>
  <div class="card-002">
    <div class="layer">
      <div class="icon" v-if="!props.model_display">
        <img
          src="../../assets/icon/other/noun-dropout-neural-network-6418844.png"
          alt=""
        />
      </div>
      <div class="layer-indi" v-if="props.model_display">
        <div class="indi-part">
          <div class="count">{{ index }}</div>
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
        <div>{{ props.dropType1Ds?"S1D-Dropout": "Dropout"}}</div>
        <div class="apply" @click="props.onApply(laterInfo)">Apply</div>
      </div>
      <div class="select-box">
        <div class="part">
          <div class="input-box">
            <input
              type="number"
              placeholder="drop-rate"
              @input="
                (e) =>
                  inputOnchange(
                    e,
                    0.00000000000000000000000000000000000000000000000009,
                    0.99999999999999999999999999999999999999999999999999999999999999999999999
                  )
              "
              step="0.001"
            />
            <div class="button" role="button" @click="updateModel">Add</div>
          </div>
          <div class="input-items">
            <div class="input-items-item" v-for="(i, n) in laterInfo.list">
              <div class="icon" @click="updateSelect(i)">
                <img src="../../assets/icon/other/Group 2.png" alt="" />
              </div>
              <div class="txt" @click="updateSelect(i)">{{ i }}</div>
              <div
                class="icon delete-icon"
                v-if="props.showOff && laterInfo.active != i"
                @click="deleteUpdate(i)"
              >
                <img src="../../assets/icon/other/delete.png" alt="" />
              </div>

              <div class="icon delete-icon" v-if="laterInfo.active == i">
                <img
                  src="../../assets/icon/other/orange-square-svgrepo-com.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-002 {
  height: auto;
  width: auto;
}

.card-002 .layer .select-box {
  width: 100%;
  flex-grow: 1;
  display: flex;
  overflow: hidden;
}
.card-002 .layer {
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
}

.card-002 .layer .layer-indi {
  width: 100%;
  aspect-ratio: 2/1;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.card-002 .layer .layer-indi .indi-part {
  height: 60px;
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.card-002 .layer .layer-indi .indi-icon {
  padding: 16px;
}
.card-002 .layer .layer-indi .indi-icon > img {
  cursor: pointer;
}
.card-002 .layer .layer-indi .indi-part .count {
  font-weight: 800;
  font-size: 30px;
}
.card-002 .layer .layer-indi .indi-part .txt {
  font-weight: 800;
  font-size: 16px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
.card-002 .layer .head {
  font-size: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
  align-items: center;
}
.card-002 .layer .head div {
  font-size: 16px;
}
.card-002 .layer .head .apply {
  font-size: 16px;
}
.card-002 .layer .head .apply:hover {
  text-decoration: underline;
  cursor: pointer;
}
.card-002 .layer .head .arrow {
  width: 120px;
  height: 30px;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  font-size: 50px;
  display: flex;
  justify-content: space-between;
}
.card-002 .layer .head .arrow .icon {
  height: 30px;
  aspect-ratio: 1/1;
  padding: 5px 0;
  transform: scale(0.9);
  position: relative;
}
.card-002 .layer .head .arrow .icon:nth-child(1) {
  transform: rotate(-90deg) scale(0.6);
  cursor: pointer;
}
.card-002 .layer .head .arrow .icon:nth-child(2) {
  transform: rotate(90deg) scale(0.6);
  cursor: pointer;
}

.card-002 .layer-box .layer .select-box {
  width: 100%;
  flex-grow: 1;
  display: flex;
  overflow: hidden;
}
.card-002 .layer .select-box .part {
  height: 100%;
  min-width: 100%;
  display: flex;
  flex-direction: column;
}
.card-002 .layer .select-box .part .input-box {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 35px;
}
.card-002 .layer .select-box .part .input-box input {
  flex-grow: 1;
  margin-right: 5px;
  border: none;
  border-bottom: 2px solid rgb(255, 111, 0);
  outline: none;
  height: 100%;
  padding: 0 5px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 700;
  background-color: transparent;
}
.card-002 .layer .select-box .part .input-box .button {
  position: relative;
  aspect-ratio: 2.1/1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  height: 35px;
  background-color: rgb(255, 111, 0);
  border-radius: 5px;
  color: white;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
}
.card-002 .layer .select-box .part .input-items {
  width: 100%;
  flex-grow: 1;
  overflow-y: auto;
}
.card-002 .layer .select-box .part .input-items .input-items-item {
  width: 100%;
  height: 35px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-002 .layer .select-box .part .input-items .input-items-item .icon {
  height: 30px;
  aspect-ratio: 1/1;
  padding: 3px;
}
.card-002 .layer .select-box .part .input-items .input-items-item .delete-icon {
  padding: 5px;
  cursor: pointer;
}
.card-002 .layer .select-box .part .input-items .input-items-item .txt {
  cursor: pointer;

  text-align: start;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 0 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: 700;
  font-size: 14px;
}
</style>
