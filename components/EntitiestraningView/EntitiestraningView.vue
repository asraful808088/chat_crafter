<script setup>
import {
  ChartView,
  LayerdiglogView2,
  LoadingRequestView,
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
import BlstmlayerView from "../BlstmlayerView/BlstmlayerView.vue";
import EntitiesSelectorDialog from "../EntitiesSelectorDialog/EntitiesSelectorDialog.vue";
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
const trainDialogShowStatus = ref(null);
const calculatePercentage = (current, maxCount) => {
  if (maxCount === 0) {
    return 0;
  }
  return (current / maxCount) * 100 + 1 < 100
    ? (current / maxCount) * 100 + 1
    : (current / maxCount) * 100;
};

onMounted(() => {
  socket.on("en_reflection", () => {
    buttonName.value = "Stop Training";
    traningMsg.value = null;
  });
  socket.on("en_traning_finish", (data) => {
    storeEph.value = [...storeEph.value, ...data.items];
    buttonName.value = "Train-Now";
    traningMsg.value = null;
    rateload.value = calculatePercentage(
      storeEph.value[storeEph.value.length - 1]?.epoch + 1 ?? 0,
      model_storage.model.active_item?.epoch?.active
    );
  });
  socket.on("en_traning_info", (data) => {
    trainDialogShowStatus.value = null;
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
  socket.on("en_init_train", (data) => {
    if (data.state == "INIT_TRANING") {
      buttonName.value = "Train-Now";
      traningMsg.value = null;
    } else if (data.state == "RUNNING") {
      buttonName.value = "Stop Training";
      storeEph.value = data.items;
      traningMsg.value = null;
    }
  });
  socket.emit("en_init_train");
  if (model_storage.model.fetching) {
    getModelProfile({}, (res, err) => {
      if (!err) {
        if (res.items) {
          console.log(res.items);
          model_storage.initModelItems(res.items);
        }
      }
    });
  }
  socket.on("en_traning", (data) => {
    if (data["success"]) {
      buttonName.value = "Stop Training";
      setTimeout(() => {
        traningMsg.value = null;
      }, 2000);
    } else {
      traningMsg.value = "invalid layer architecture";
      buttonName.value = "Train-Now";
      setTimeout(() => {
        error.value = data.msg;
        traningMsg.value = null;
      }, 2000);
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
      entype: true,
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
  const newlayers = model_storage.model.active_item?.en_network?.map(
    (element) => {
      if (element.id == i.id) {
        return i;
      }
      return element;
    }
  );
  updatelayersProfile(
    {
      name: model_storage.model.active_item.label,
      layers: newlayers,
      entype: true,
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
  const newlayers = model_storage.model.active_item?.en_network?.filter(
    (element) => {
      return element.id != i.id;
    }
  );
  updatelayersProfile(
    {
      name: model_storage.model.active_item.label,
      layers: newlayers,
      entype: true,
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
  if ("Stop Training" == buttonName.value) {
    socket.emit("en_check_model", {
      network: model_storage.model.active_item?.en_network,
      otherSets: { ...model_storage.model.active_item, network: null },
      profile: botinfo.profile?.active?.name,
      stop_mode: true,
    });
  } else {
    trainDialogShowStatus.value = {};
  }
}
function validatorLayer(i) {
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
  // setTimeout(() => {
  socket.emit("en_check_model", {
    network: model_storage.model.active_item?.en_network,
    otherSets: { ...model_storage.model.active_item, network: null },
    profile: botinfo.profile?.active?.name,
    stop_mode: "Stop Training" == buttonName.value ? true : false,
    entities: i,
  });

  //   if (buttonName.value == "Stop Training") {
  //     buttonName.value = "please wait...";
  //   }
  // }, 3000);
}
</script>
<template>
  <div class="traning">
    <EntitiesSelectorDialog
      v-if="trainDialogShowStatus"
      @submit="validatorLayer"
      @close="
        () => {
          trainDialogShowStatus = null;
        }
      "
    />
    <TraningdialogView :txt="traningMsg" :show="traningMsg" />
    <LayerdiglogView2
      :show="layerDiglog"
      @close="showDialog(false)"
      @change="onAddLayer"
      :layerlist="model_storage.model.active_item?.en_network"
    />

    <div class="option">
      <div class="t-part">
        <h2>Entities Training-Model</h2>
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
                  <img src="../../assets/icon/other/delete.png" alt="" />
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
                    src="../../assets/icon/other/delete.png"
                    alt=""
                    @click="deleteProfile(i.label)"
                  />
                </div>
                <div
                  class="icon"
                  v-if="i.label == model_storage.model.active_item.label"
                >
                  <img
                    src="../../assets/icon/other/orange-square-svgrepo-com.png"
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
                  <img src="../../assets/icon/other/delete.png" alt="" />
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
                  <img src="../../assets/icon/other/delete.png" alt="" />
                </div>
                {{ i.learning_rate?.active }}
                <div
                  class="icon"
                  v-if="
                    i == model_storage.model.active_item?.learning_rate?.active
                  "
                >
                  <img
                    src="../../assets/icon/other/orange-square-svgrepo-com.png"
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
                  <img src="../../assets/icon/other/delete.png" alt="" />
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
                  <img src="../../assets/icon/other/delete.png" alt="" />
                </div>
                <div
                  class="icon"
                  v-if="i == model_storage.model.active_item?.test_rate?.active"
                >
                  <img
                    src="../../assets/icon/other/orange-square-svgrepo-com.png"
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
                  <img src="../../assets/icon/other/delete.png" alt="" />
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
                  <img src="../../assets/icon/other/delete.png" alt="" />
                </div>
                <div
                  class="icon"
                  v-if="i == model_storage.model.active_item?.epoch?.active"
                >
                  <img
                    src="../../assets/icon/other/orange-square-svgrepo-com.png"
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
                  <img src="../../assets/icon/other/delete.png" alt="" />
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
                  <img src="../../assets/icon/other/delete.png" alt="" />
                </div>
                <div
                  class="icon"
                  v-if="i == model_storage.model.active_item?.out_dim?.active"
                >
                  <img
                    src="../../assets/icon/other/orange-square-svgrepo-com.png"
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
                  <img src="../../assets/icon/other/delete.png" alt="" />
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
                  <img src="../../assets/icon/other/delete.png" alt="" />
                </div>
                <div
                  class="icon"
                  v-if="i == model_storage.model.active_item?.batch?.active"
                >
                  <img
                    src="../../assets/icon/other/orange-square-svgrepo-com.png"
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
              v-for="(i, n) in model_storage.model.active_item?.en_network"
            >
              <BlstmlayerView
                :layer_type="i.type"
                :show-off="true"
                @update="updateLayers"
                :layer_info="i"
                v-if="i.type == 'B_LSTM'"
                :index="n + 1"
                @delete-layer="deleteLayers"
              />
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
                :header="'Layer-Normalization'"
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
              <DropcardView
                :layer_type="i.type"
                v-if="i.type == 's1d_dropout'"
                :layer_info="i"
                :show-off="true"
                :index="n + 1"
                @update="updateLayers"
                @delete-layer="deleteLayers"
                drop-type1-ds="true"
              />
            </div>

            <div class="add-layer" @click="showDialog">
              <div class="icon">
                <img src="../../assets/icon/other/Group 1.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="t-part">
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

<style src="./style.css"></style>
