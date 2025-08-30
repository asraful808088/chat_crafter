<script setup>
import {
  ChartView,
  DropcardView,
  LayerdiglogView,
  LoadingRequestView,
  LstmcardView,
  TraninganimationView,
  TraningdialogView,
} from "#components";
import { io } from "socket.io-client";
import { onMounted, ref } from "vue";
import addlayerProfile from "~/network/add_network_layer/layer";
import addModelProfile from "~/network/addProfile/add";
import deleteModelProfile from "~/network/delete_model_profile/delete";
import getModelProfile from "~/network/model_profile/get";
import updatelayersProfile from "~/network/updateLayers/update";
import updateMoelProfile from "~/network/updateModelProfile/update";
import useModelNetworkStore from "~/state/model_profile/storage";
import { useBotbuilderStore } from "~/state/state";

const socket = io();
const traningMsg = ref("Verifying...");
const botinfo = useBotbuilderStore();

const model_storage = useModelNetworkStore();
const newProfilename = ref("");
const buttonName = ref("Verifying...");
const error = ref(null);
const textInput1 = ref(0.1);
const textInput2 = ref(0.1);
const textInput3 = ref(1);
const textInput4 = ref(1);
const textInput5 = ref(1);
const layerDiglog = ref(null);
const tempload = ref([]);
const storeEph = ref([]);
const rateload = ref(0);
const graphboxInfo = ref({ e: [], v_loss: [], loss: [], acc: [], v_acc: [] });
const calculatePercentage = (current, maxCount) => {
  if (maxCount === 0) {
    return 0;
  }
  return (current / maxCount) * 100 + 1 < 100
    ? (current / maxCount) * 100 + 1
    : (current / maxCount) * 100;
};

onMounted(() => {
  socket.on("reflection", () => {
    buttonName.value = "Stop Training";
    traningMsg.value = null;
  });
  socket.on("traning_finish", (data) => {
    storeEph.value = [...storeEph.value, ...data.items];
    buttonName.value = "Train-Now";
    traningMsg.value = null;
    rateload.value = calculatePercentage(
      storeEph.value[storeEph.value.length - 1]?.epoch + 1 ?? 0,
      model_storage.model.active_item?.epoch?.active
    );
  });
  socket.on("traning_info", (data) => {
    buttonName.value = "Stop Training";
    storeEph.value = [...storeEph.value, ...data.items];
    rateload.value = calculatePercentage(
      storeEph.value[storeEph.value.length - 1]?.epoch ?? 0,
      model_storage.model.active_item?.epoch?.active
    );
    let tempEpoch = [];
    let loss = [];
    let v_loss = [];
    let v_acc = [];
    let acc = [];
    for (const element of storeEph.value) {
      tempEpoch.push(element.epoch);
      loss.push(element.loss);
      v_loss.push(element.val_loss);
      v_acc.push(element.val_accuracy);
      acc.push(element.accuracy);
    }
    graphboxInfo.value = {
      acc: acc,
      v_acc: v_acc,
      loss: loss,
      v_loss: v_loss,
      e: tempEpoch,
    };
  });
  socket.on("init_train", (data) => {
    if (data.state == "INIT_TRANING") {
      buttonName.value = "Train-Now";
      traningMsg.value = null;
    } else if (data.state == "RUNNING") {
      buttonName.value = "Stop Training";
      storeEph.value = data.items;
      traningMsg.value = null;
    }
  });
  socket.emit("init_train");
  if (model_storage.model.fetching) {
    getModelProfile({}, (res, err) => {
      if (!err) {
        if (res.items) {
          model_storage.initModelItems(res.items);
        }
      }
    });
  }
  socket.on("traing", (data) => {
    if (data["success"]) {
      buttonName.value = "Stop Training";
      setTimeout(() => {
        traningMsg.value = null;
      }, 2000);
    } else {
      if (data.dataset_error) {
        traningMsg.value = "invalid dataset";
        buttonName.value = "Train-Now";
        setTimeout(() => {
        error.value = data.dataset_error;
        traningMsg.value = null;
      }, 2000);
      }else{
        traningMsg.value = "invalid layer architecture";
      buttonName.value = "Train-Now";
      setTimeout(() => {
        error.value = data.msg;
        traningMsg.value = null;
      }, 2000);
      }
      
    }
  });
});

function addNewProfile() {
  addModelProfile({ name: newProfilename.value }, (res, err) => {
    if (!err) {
      if (res.items) {
        model_storage.initModelItems(res.items);
      }
    }
  });
}

function deleteProfile(name) {
  if (true) {
    deleteModelProfile({ name: name }, (res, err) => {
      if (!err) {
        if (res.items) {
          model_storage.initModelItems(res.items);
        }
      }
    });
  }
}

function updateProfile(
  value,
  update_type = 1,
  target_property,
  is_network = false,
  active = true,
  c_profile,
  profile_val
) {
  updateMoelProfile(
    {
      target: profile_val ?? model_storage.model.active_item.label,
      update_type: update_type,
      target_property: target_property,
      value: Number(value),
      is_network: is_network,
      c_profile: c_profile,
    },
    (res, err) => {
      if (!err) {
        if (res.items) {
          model_storage.reload(res.items, res.active);
        } else if (res.active) {
          model_storage.reload(null, res.active);
        }
      }
    }
  );
}
function inputOnchange(
  e,
  min = 0.0000001,
  max = 0.999999999999999999999,
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
  if (inp == 1) {
    textInput1.value = input.value;
  } else if (inp == 2) {
    textInput2.value = input.value;
  } else if (inp == 3) {
    textInput3.value = input.value;
  } else if (inp == 4) {
    textInput4.value = input.value;
  } else if (inp == 5) {
    textInput5.value = input.value;
  }
}
function showDialog(t) {
  layerDiglog.value = t ?? true;
}

function onAddLayer(e) {
  // tempload.value = [...tempload.value,e]
  if (!model_storage.model.active_item.label) {
    return;
  }
  addlayerProfile(
    {
      name: model_storage.model.active_item.label,
      layer: e,
    },
    (res, err) => {
      if (!err) {
        if (res.items) {
          model_storage.reload(res.items, res.active);
        } else if (res.active) {
          model_storage.reload(null, res.active);
        }
      }
    }
  );
}

function updateLayers(i) {
  const newlayers = model_storage.model.active_item?.network?.map((element) => {
    if (element.id == i.id) {
      return i;
    }
    return element;
  });
  updatelayersProfile(
    {
      name: model_storage.model.active_item.label,
      layers: newlayers,
    },
    (res, err) => {
      if (!err) {
        if (res.items) {
          model_storage.reload(res.items, res.active);
        } else if (res.active) {
          model_storage.reload(null, res.active);
        }
      }
    }
  );
}
function deleteLayers(i) {
  const newlayers = model_storage.model.active_item?.network?.filter(
    (element) => {
      return element.id != i.id;
    }
  );
  updatelayersProfile(
    {
      name: model_storage.model.active_item.label,
      layers: newlayers,
    },
    (res, err) => {
      if (!err) {
        if (res.items) {
          model_storage.reload(res.items, res.active);
        } else if (res.active) {
          model_storage.reload(null, res.active);
        }
      }
    }
  );
}
function submitlayer() {
  if (traningMsg.value) {
    return;
  }
  if (buttonName.value == "please wait...") {
    return;
  }
  traningMsg.value = "Verifying...";

  if (buttonName.value != "Stop Training") {
    buttonName.value = "Training...";
    storeEph.value = [];
  }

  setTimeout(() => {
    socket.emit("check_model", {
      network: model_storage.model.active_item?.network,
      otherSets: { ...model_storage.model.active_item, network: null },
      profile: botinfo.profile?.active?.name,
      stop_mode: "Stop Training" == buttonName.value ? true : false,
    });
    if (buttonName.value == "Stop Training") {
      buttonName.value = "please wait...";
    }
  }, 3000);
}



const activeProgressbarView = ref(false)
const changeActiveProgressbarView = ()=>{
  activeProgressbarView.value = !activeProgressbarView.value
}



</script>
<template>
  <div class="traning">
    <TraningdialogView :txt="traningMsg" :show="traningMsg" />
    <LayerdiglogView
      :show="layerDiglog"
      @close="showDialog(false)"
      @change="onAddLayer"
      :layerlist="model_storage.model.active_item?.network"
    />

    <div class="option">
      <div class="t-part">
        <h2> Training-Model 

<div class="icon"  @click="changeActiveProgressbarView" >
                                <img src="../assets/icon/other/menu.png" alt="" />

              </div>
        </h2>
        <div class="loading-boxs" v-if="model_storage.model.fetching">
          <div class="loading">
            <LoadingRequestView />
          </div>
        </div>
        <div class="option-box" v-if="!model_storage.model.fetching">
          <div class="item">
            <h3>P-{{ model_storage.model.active_item.label }}</h3>
            <div class="input-box">
              <input
                type="text"
                name=""
                id=""
                placeholder="add-profile"
                v-model="newProfilename"
              />
              <div class="button" role="button" @click="addNewProfile">add</div>
            </div>
            <!-- code-duplication -->

            <div
              class="items-show"
              v-if="model_storage.model.listOfItems.length > 1"
            >
              <div
                class="items-show-item"
                v-for="(i, n) in model_storage.model.listOfItems"
              >
                <div
                  class="icon"
                  @click="
                    updateProfile(null, null, null, null, null, true, i.label)
                  "
                >
                  <img src="../assets/icon/other/delete.png" alt="" />
                </div>
                <div
                  class="txt"
                  @click="
                    updateProfile(null, null, null, null, null, true, i.label)
                  "
                >
                  {{ i.label }}
                </div>
                <div
                  class="icon"
                  v-if="
                    i.type == 'custom' &&
                    i.label != model_storage.model.active_item.label
                  "
                >
                  <img
                    src="../assets/icon/other/delete.png"
                    alt=""
                    @click="deleteProfile(i.label)"
                  />
                </div>
                <div
                  class="icon"
                  v-if="i.label == model_storage.model.active_item.label"
                >
                  <img
                    src="../assets/icon/other/orange-square-svgrepo-com.png"
                    alt=""
                  />
                </div>
                <!-- i.label == model_storage.model.active_item.label -->
              </div>
            </div>

            <!--  -->
          </div>
          <div class="item">
            <h3>
              L-{{ model_storage.model.active_item?.learning_rate?.active }}
            </h3>
            <div class="input-box">
              <input
                type="number"
                name=""
                id=""
                placeholder="learning-rate"
                :value="textInput1"
                step=".1"
                @input="
                  (e) =>
                    inputOnchange(
                      e,
                      0.000000000000001,
                      0.99999999999999999999999999,
                      'float',
                      1
                    )
                "
              />
              <div
                class="button"
                role="button"
                @click="
                  updateProfile(
                    textInput1,
                    2,
                    'learning_rate',
                    false,
                    i != model_storage.model.active_item?.learning_rate?.active
                  )
                "
              >
                add
              </div>
            </div>
            <!-- code-duplication -->

            <div
              class="items-show"
              v-if="
                model_storage.model.active_item?.learning_rate.list.length > 1
              "
            >
              <div
                class="items-show-item"
                v-for="(i, n) in model_storage.model.active_item?.learning_rate
                  .list"
              >
                <div
                  class="icon"
                  @click="
                    updateProfile(
                      i,
                      1,
                      'learning_rate',
                      false,
                      i !=
                        model_storage.model.active_item?.learning_rate?.active
                    )
                  "
                >
                  <img src="../assets/icon/other/delete.png" alt="" />
                </div>
                <div
                  class="txt"
                  @click="
                    updateProfile(
                      i,
                      1,
                      'learning_rate',
                      false,
                      i !=
                        model_storage.model.active_item?.learning_rate?.active
                    )
                  "
                >
                  {{ i }}
                </div>
                <div
                  class="icon"
                  v-if="
                    i != model_storage.model.active_item?.learning_rate?.active
                  "
                  @click="
                    updateProfile(
                      i,
                      3,
                      'learning_rate',
                      false,
                      i !=
                        model_storage.model.active_item?.learning_rate?.active
                    )
                  "
                >
                  <img src="../assets/icon/other/delete.png" alt="" />
                </div>
                {{ i.learning_rate?.active }}
                <div
                  class="icon"
                  v-if="
                    i == model_storage.model.active_item?.learning_rate?.active
                  "
                >
                  <img
                    src="../assets/icon/other/orange-square-svgrepo-com.png"
                    alt=""
                  />
                </div>
              </div>
            </div>

            <!--  -->
          </div>
          <div class="item">
            <h3>T- {{ model_storage.model.active_item?.test_rate?.active }}</h3>
            <div class="input-box">
              <input
                type="number"
                name=""
                id=""
                placeholder="test-rate"
                step=".1"
                @input="
                  (e) =>
                    inputOnchange(
                      e,
                      0.000000000000001,
                      0.99999999999999999999999999,
                      'float',
                      2
                    )
                "
              />
              <div
                class="button"
                role="button"
                @click="
                  updateProfile(
                    textInput2,
                    2,
                    'test_rate',
                    false,
                    i != model_storage.model.active_item?.learning_rate?.active
                  )
                "
              >
                add
              </div>
            </div>
            <!-- code-duplication -->

            <div
              class="items-show"
              v-if="model_storage.model.active_item?.test_rate?.list.length > 1"
            >
              <div
                class="items-show-item"
                v-for="(i, n) in model_storage.model.active_item?.test_rate
                  ?.list"
              >
                <div
                  class="icon"
                  @click="
                    updateProfile(
                      i,
                      1,
                      'test_rate',
                      false,
                      i != model_storage.model.active_item?.test_rate?.active
                    )
                  "
                >
                  <img src="../assets/icon/other/delete.png" alt="" />
                </div>
                <div
                  class="txt"
                  @click="
                    updateProfile(
                      i,
                      1,
                      'test_rate',
                      false,
                      i != model_storage.model.active_item?.test_rate?.active
                    )
                  "
                >
                  {{ i }}
                </div>
                <div
                  class="icon"
                  v-if="i != model_storage.model.active_item?.test_rate?.active"
                  @click="
                    updateProfile(
                      i,
                      3,
                      'test_rate',
                      false,
                      i != model_storage.model.active_item?.test_rate?.active
                    )
                  "
                >
                  <img src="../assets/icon/other/delete.png" alt="" />
                </div>
                <div
                  class="icon"
                  v-if="i == model_storage.model.active_item?.test_rate?.active"
                >
                  <img
                    src="../assets/icon/other/orange-square-svgrepo-com.png"
                    alt=""
                  />
                </div>
              </div>
            </div>

            <!--  -->
          </div>
          <div class="item">
            <h3>Epoch-{{ model_storage.model.active_item?.epoch?.active }}</h3>
            <div class="input-box">
              <input
                type="number"
                name=""
                id=""
                placeholder="epoch"
                @input="
                  (e) =>
                    inputOnchange(e, 1, 99999999999999999999999999, 'int', 3)
                "
              />
              <div
                class="button"
                role="button"
                @click="
                  updateProfile(
                    textInput3,
                    2,
                    'epoch',
                    false,
                    i != model_storage.model.active_item?.learning_rate?.active
                  )
                "
              >
                add
              </div>
            </div>
            <!-- code-duplication -->

            <div
              class="items-show"
              v-if="model_storage.model.active_item?.epoch.list.length > 1"
            >
              <div
                class="items-show-item"
                v-for="(i, n) in model_storage.model.active_item?.epoch.list"
              >
                <div
                  class="icon"
                  @click="
                    updateProfile(
                      i,
                      1,
                      'epoch',
                      false,
                      i != model_storage.model.active_item?.epoch?.active
                    )
                  "
                >
                  <img src="../assets/icon/other/delete.png" alt="" />
                </div>
                <div
                  class="txt"
                  @click="
                    updateProfile(
                      i,
                      1,
                      'epoch',
                      false,
                      i != model_storage.model.active_item?.epoch?.active
                    )
                  "
                >
                  {{ i }}
                </div>
                <div
                  class="icon"
                  v-if="i != model_storage.model.active_item?.epoch?.active"
                  @click="
                    updateProfile(
                      i,
                      3,
                      'epoch',
                      false,
                      i != model_storage.model.active_item?.epoch?.active
                    )
                  "
                >
                  <img src="../assets/icon/other/delete.png" alt="" />
                </div>
                <div
                  class="icon"
                  v-if="i == model_storage.model.active_item?.epoch?.active"
                >
                  <img
                    src="../assets/icon/other/orange-square-svgrepo-com.png"
                    alt=""
                  />
                </div>
              </div>
            </div>

            <!--  -->
          </div>

          <div class="item">
            <h3>
              Out-dim - {{ model_storage.model.active_item?.out_dim?.active }}
            </h3>
            <div class="input-box">
              <input
                type="number"
                name=""
                id=""
                placeholder="out-dim"
                @input="
                  (e) =>
                    inputOnchange(e, 1, 99999999999999999999999999, 'int', 4)
                "
              />
              <div
                class="button"
                role="button"
                @click="
                  updateProfile(
                    textInput4,
                    2,
                    'out_dim',
                    false,
                    i != model_storage.model.active_item?.learning_rate?.active
                  )
                "
              >
                add
              </div>
            </div>
            <!-- code-duplication -->

            <div
              class="items-show"
              v-if="model_storage.model.active_item?.out_dim.list.length > 1"
            >
              <div
                class="items-show-item"
                v-for="(i, n) in model_storage.model.active_item?.out_dim.list"
              >
                <div
                  class="icon"
                  @click="
                    updateProfile(
                      i,
                      1,
                      'out_dim',
                      false,
                      i != model_storage.model.active_item?.out_dim?.active
                    )
                  "
                >
                  <img src="../assets/icon/other/delete.png" alt="" />
                </div>
                <div
                  class="txt"
                  @click="
                    updateProfile(
                      i,
                      1,
                      'out_dim',
                      false,
                      i != model_storage.model.active_item?.out_dim?.active
                    )
                  "
                >
                  {{ i }}
                </div>
                <div
                  class="icon"
                  v-if="i != model_storage.model.active_item?.out_dim?.active"
                  @click="
                    updateProfile(
                      i,
                      3,
                      'out_dim',
                      false,
                      i != model_storage.model.active_item?.out_dim?.active
                    )
                  "
                >
                  <img src="../assets/icon/other/delete.png" alt="" />
                </div>
                <div
                  class="icon"
                  v-if="i == model_storage.model.active_item?.out_dim?.active"
                >
                  <img
                    src="../assets/icon/other/orange-square-svgrepo-com.png"
                    alt=""
                  />
                </div>
              </div>
            </div>

            <!--  -->
          </div>

          <div class="item">
            <h3>
              Batch Count - {{ model_storage.model.active_item?.batch?.active }}
            </h3>
            <div class="input-box">
              <input
                type="number"
                name=""
                id=""
                placeholder="batch"
                @input="
                  (e) =>
                    inputOnchange(e, 1, 99999999999999999999999999, 'int', 5)
                "
              />
              <div
                class="button"
                role="button"
                @click="
                  updateProfile(
                    textInput5,
                    2,
                    'batch',
                    false,
                    i != model_storage.model.active_item?.batch?.active
                  )
                "
              >
                add
              </div>
            </div>
            <!-- code-duplication -->

            <div
              class="items-show"
              v-if="model_storage.model.active_item?.batch.list.length > 1"
            >
              <div
                class="items-show-item"
                v-for="(i, n) in model_storage.model.active_item?.batch.list"
              >
                <div
                  class="icon"
                  @click="
                    updateProfile(
                      i,
                      1,
                      'batch',
                      false,
                      i != model_storage.model.active_item?.batch?.active
                    )
                  "
                >
                  <img src="../assets/icon/other/delete.png" alt="" />
                </div>
                <div
                  class="txt"
                  @click="
                    updateProfile(
                      i,
                      1,
                      'batch',
                      false,
                      i != model_storage.model.active_item?.batch?.active
                    )
                  "
                >
                  {{ i }}
                </div>
                <div
                  class="icon"
                  v-if="i != model_storage.model.active_item?.batch?.active"
                  @click="
                    updateProfile(
                      i,
                      3,
                      'batch',
                      false,
                      i != model_storage.model.active_item?.batch?.active
                    )
                  "
                >
                  <img src="../assets/icon/other/delete.png" alt="" />
                </div>
                <div
                  class="icon"
                  v-if="i == model_storage.model.active_item?.batch?.active"
                >
                  <img
                    src="../assets/icon/other/orange-square-svgrepo-com.png"
                    alt=""
                  />
                </div>
              </div>
            </div>

            <!--  -->
          </div>
        </div>
        <h2>Neural-Network</h2>
        <div class="neural-network">
          <!-- <div class="add-button">
            <div class="icon">
              <img src="../assets/icon/other/Group 1.png" alt="" />
            </div>
          </div> -->
          <div class="layer-box">
            <div
              class="cover"
              v-for="(i, n) in model_storage.model.active_item?.network"
            >
              <LstmcardView
                :layer_type="i.type"
                :show-off="true"
                @update="updateLayers"
                :layer_info="i"
                v-if="i.type == 'dense'"
                :index="n + 1"
                @delete-layer="deleteLayers"
              />

              <LstmcardView
                :layer_type="i.type"
                :details_board="false"
                :header="'Batch Normalization'"
                :show-off="true"
                @update="updateLayers"
                :layer_info="i"
                v-if="i.type == 'batch_normalization'"
                :index="n + 1"
                @delete-layer="deleteLayers"
              />
              <LstmcardView
                :layer_type="i.type"
                :header="'Global Average Pooling 1D'"
                :details_board="false"
                :show-off="true"
                @update="updateLayers"
                :layer_info="i"
                v-if="i.type == 'global_average_pooling_1D'"
                :index="n + 1"
                @delete-layer="deleteLayers"
              />
              <LstmcardView
                :layer_type="i.type"
                :header="'MHSA'"
                :show-off="true"
                @update="updateLayers"
                :layer_info="i"
                v-if="i.type == 'multi_head_self_attention'"
                :index="n + 1"
                @delete-layer="deleteLayers"
              />
              <DropcardView
                :layer_type="i.type"
                v-if="i.type == 'dropout'"
                :layer_info="i"
                :show-off="true"
                :index="n + 1"
                @update="updateLayers"
                @delete-layer="deleteLayers"
              />
            </div>

            <div class="add-layer" @click="showDialog">
              <div class="icon">
                <img src="../assets/icon/other/Group 1.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div :class="activeProgressbarView? `t-part  `:`t-part deactive-part `">


        
        <div class="icon-box" >
              <div class="icon"  @click="changeActiveProgressbarView" >
                                <img src="../assets/icon/other/cross_2.png" alt="" />

              </div>
        </div>




        <div class="anim-icon">
          <TraninganimationView />
        </div>
        <div class="epoch">epoch</div>
        <div class="counter">
          {{ rateload }}%/{{
            model_storage.model.active_item?.epoch?.active
          }}eph
        </div>

        <div class="loading-box">
          <div class="loading-case">
            <div class="lan" :style="{ width: rateload + '%' }"></div>
          </div>
        </div>

        <div class="traning-button" @click="submitlayer">
          {{ buttonName }}
        </div>
        <div class="error">
          <p v-for="(i, n) in error">{{ i }}</p>
        </div>
      </div>
    </div>
    <h1 class="d-head">Training Visualization</h1>
    <div class="graph-box">
      <div class="item">
        <ChartView
          head="Accuracy"
          :list_of_ep="graphboxInfo.e"
          :list_of_data="graphboxInfo.acc"
        />
      </div>
      <div class="item">
        <ChartView
          head="Loss"
          :list_of_ep="graphboxInfo.e"
          :list_of_data="graphboxInfo.loss"
        />
      </div>
    </div>
    <h1 class="d-head">Validation Visualization</h1>
    <div class="graph-box">
      <div class="item">
        <ChartView
          head="Validation Accuracy"
          :list_of_ep="graphboxInfo.e"
          :list_of_data="graphboxInfo.v_acc"
        />
      </div>
      <div class="item">
        <ChartView
          head="Validation Loss"
          :list_of_ep="graphboxInfo.e"
          :list_of_data="graphboxInfo.v_loss"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>



.traning {
  width: 100%;
  height: calc(100vh - 150px);
  overflow-y: auto;
}

.traning .graph-box {
  width: 100%;
  margin-top: 50px;
  display: flex;
  position: relative;

}
.traning .graph-box .item {
  width: 50%;
  aspect-ratio: 2/1;
  padding: 0 20px;
}
.traning .d-head {
  padding: 0 20px;
  margin-top: 40px;
  font-family: "Fugaz One", sans-serif;

}
.traning .option {
  width: 100%;
  min-height: 800px;
  margin-top: 20px;
  padding: 0 20px;
  display: flex;
  justify-content: center;


}
.traning .option .t-part {
}
.traning .option .t-part .loading-boxs {
  width: 100%;
  height: calc(100vh - (150px + 54px));
  display: flex;
  justify-content: center;
  align-items: center;

}
.traning .option .t-part .loading-boxs .loading {
  height: 560px;
  aspect-ratio: 1/1;
  position: relative;
}

.traning .option .t-part .traning-button {
  width: 350px;
  height: 50px;
  background-color: rgb(255, 106, 0);
  border-radius: 5px;
  color: white;
  font-weight: 900;
  font-size: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: auto;
  margin-top: 10px;
  font-family: "Fugaz One", sans-serif;
}

.traning .option .t-part .neural-network {
  width: 100%;
  padding: 10px 0;
  display: flex;


}
.traning .option .t-part .neural-network .layer-box {
  flex-grow: 1;
  height: 100%;
  /* height: 400px; */
  width: 100%;
  /* overflow-x: scroll; */
  padding: 0 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  /* align-items: center; */
}
.traning .option .t-part .neural-network .layer-box .cover {
  margin: 30px 30px;
}
.traning .option .t-part .neural-network .layer-box .add-layer {
  height: 460px;
  width: 390px;
  background-color: rgb(255, 85, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 5px 5px 15px rgba(121, 121, 121, 0.239);
  transition: 0.2s;
}
.traning .option .t-part .neural-network .layer-box .add-layer:hover {
  box-shadow: 5px 5px 25px rgba(0, 0, 0, 0.239);
}
.traning .option .t-part .neural-network .layer-box .add-layer .icon {
  height: 50px;
  aspect-ratio: 1/1;
}
.traning .option .t-part .neural-network .add-button {
  width: 60px;
  height: 400px;
  background-color: rgb(255, 72, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 900;
  font-size: 30px;
  border-radius: 5px;
  cursor: pointer;
}
.traning .option .t-part .neural-network .add-button .icon {
  height: 35px;
  aspect-ratio: 1/1;
}
.traning .option .t-part h2 {
  font-family: "Fugaz One", sans-serif;
}
.traning .option .t-part .option-box {
  width: 100%;
  display: grid;
  flex-wrap: wrap;
  margin-top: 10px;
   grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
   gap: 5px;

}
.traning .option .t-part .option-box .item {
  width: 100%;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 100;

  aspect-ratio: 1/1;
  max-height: 300px;
  margin-right: 10px;
  margin-bottom: 20px;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
}

.traning .option .t-part .option-box .item .items-show {
  width: 100%;
  flex-grow: 1;
  background-color: rgb(255, 255, 255);
  overflow-y: auto;
  border-radius: 5px;
  box-shadow: 5px 5px 5px rgba(121, 121, 121, 0.239);
  padding: 0 5px;
  display: none;
}
.traning .option .t-part .option-box .item:hover .items-show {
  display: block;
}
.traning .option .t-part .option-box .item .items-show .items-show-item {
  width: 100%;
  height: 40px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
.traning .option .t-part .option-box .item .items-show .items-show-item .icon {
  height: 25px;
  aspect-ratio: 1/1;
  position: relative;
  padding: 2px;
}
.traning .option .t-part .option-box .item .items-show .items-show-item .txt {
  flex-grow: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 500;
}
.traning .option .t-part .option-box .item .input-box {
  width: 100%;
  height: 40px;
  display: flex;
  margin-top: 10px;
}

.traning .option .t-part .option-box .item .input-box input {
  height: 100%;
  background-color: transparent;
  flex-grow: 1;
  border: none;
  outline: none;
  padding: 0 5px;
  font-family: "Fugaz One", sans-serif;
  border-bottom: 2px solid rgb(255, 128, 0);
}

.traning .option .t-part .option-box .item .input-box .button {
  height: 40px;
  aspect-ratio: 2.5/1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  margin-left: 5px;
  text-transform: capitalize;
  background-color: rgb(255, 98, 0);
  color: white;
  font-weight: 900;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}
.traning .option .t-part:nth-child(1) {
  flex-grow: 1;
  height: 100%;
}
.traning .option .t-part:nth-child(1) h2{
    display: flex;
    justify-content: space-between;
    align-items: center;
}  
.traning .option .t-part:nth-child(1) h2 .icon{
  height: 24px;
  aspect-ratio: 1/1;
  cursor: pointer;
  display: none;
} 
.traning .option .t-part:nth-child(2) {
  width: 500px;
  min-height: 800px;
  margin-top: 45px;
}
.traning .option .t-part:nth-child(2)  .icon-box{
  width: 100%;
  display: none;
  justify-content: flex-end;

}
.traning .option .t-part:nth-child(2)  .icon-box .icon{
  height: 24px;
  aspect-ratio: 1/1;
  cursor: pointer;
}
.traning .option .t-part:nth-child(2) .anim-icon {
  height: 200px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.traning .option .t-part:nth-child(2) .epoch {
  margin-top: 20px;
  text-align: center;
  font-family: "Fugaz One", sans-serif;
  font-size: 30px;
  text-transform: capitalize;
}
.traning .option .t-part:nth-child(2) .counter {
  margin-top: 20px;
  text-align: center;
  font-family: "Fugaz One", sans-serif;
  font-size: 18px;
  text-transform: capitalize;
}
.traning .option .t-part:nth-child(2) .loading-box {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.traning .option .t-part:nth-child(2) .loading-box .loading-case {
  width: 350px;
  background-color: rgba(121, 121, 121, 0.239);
  height: 10px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}
.traning .option .t-part:nth-child(2) .loading-box .loading-case .lan {
  width: 20%;
  border-radius: 10px;
  background-color: rgb(255, 140, 0);
  height: 100%;
  transition: 0.2s;
}
.traning .error {
  width: 100%;
  color: rgb(255, 17, 0);
  margin-top: 10px;
  font-size: 16px;
  font-weight: 900;
}
.traning .error p {
  margin-bottom: 10px;
}


@media (max-width:1022px) {
.traning .option .t-part:nth-child(2){
  position: absolute;
  right: 0;
  background-color: white;
  border-top-left-radius: 10px;
  border-left: 2px solid    orange;
  border-top:  2px solid  orange;
  padding: 10px;
  padding-left: 15px;
  padding-top: 20px;
  margin-top: 0;
  width: 100%;
  max-width:500px ;
  z-index: 1;
  transition: .2s;
}
.traning .option .t-part:nth-child(2)  .icon-box{
  display: flex;
}
.deactive-part {
  right: -200% !important;
}
.traning .option .t-part:nth-child(1) h2 .icon{
  display: block;
}
}



@media (max-width:700px) {
  .traning .graph-box {
  flex-direction: column;
}
.traning .graph-box .item {
  width: 100%;
  margin-top: 10px;
}
}

</style>
