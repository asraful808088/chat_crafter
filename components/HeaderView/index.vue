<script setup>
import { BotselectorView } from "#components";
import { ref, watchEffect } from "vue";
// import { useRouter } from "vue-router";
import EntitiesImage from "~/assets/icon/other/criteria_18112775.png";
import ImageModel from "~/assets/icon/other/model.png";
import PackModel from "~/assets/icon/other/parcel-box-package-icon.png";
import ControllerImage from "~/assets/icon/other/remove_6885281.png";
import ImageScripts from "~/assets/icon/other/script.png";
import ServerModel from "~/assets/icon/other/server-rack-color-icon.png";
import buildItem from "~/network/build/build";
import { useBotbuilderStore } from "~/state/state";
import BotchattesterView from "../bot_chat_tester/BotchattesterView.vue";
// import ImageScripts from '~/assets/icon/other/script.png'
import getSelectItems from "~/network/get_intentes/get_intents";
import { socket } from "../socketIO/socket";
const chatBoxShow = ref(false);
const route = useRoute();
const router = useRouter();
const showBuild = ref(null);
const storeData = ref({
  type: null,
  store_scripts: [],
  store_model: [],
  onlyScripts: false,
  secTar: null,
});
const load_model = ref([]);
const readyToApplyData = ref({});
const showSelectorstatus = ref(false);

const info = useBotbuilderStore();
const toggleLogin = () => {
  info.closeProfile();
};

const showSelector = () => {
  showSelectorstatus.value = !showSelectorstatus.value;
};
const hideSelector = () => {
  showSelectorstatus.value = false;
};
const applyBuild = (data) => {
  buildItem({ ...data }, (res) => {
    if (res) {
      console.log(res);
    }
  });
};

const getScriptsExporter = () => {
  getSelectItems({ of: "scripts" }, (res) => {
    if (res?.items) {
      storeData.value.type = "scripts_only";
      storeData.value.onlyScripts = true;
      storeData.value.store_scripts = res?.items;
    }
  });
};
const modelWithServerBuilder = (type) => {
  getSelectItems({ of: "scripts" }, (res) => {
    if (res?.items) {
      storeData.value.type = type ?? "scripts_only";
      storeData.value.store_scripts = res?.items;
      storeData.value.store_model = load_model.value;
    }
  });
};
const onlyTraningModelBuilder = () => {
  storeData.value.type = "training_model";
  storeData.value.store_model = load_model.value;
};
const modelPackBuilder = () => {
  storeData.value.type = "model_pack";
  storeData.value.store_model = load_model.value;
};
const withoutControllerBuilder = () => {
  storeData.value.type = "without_controller";
  storeData.value.store_model = load_model.value;
};
const exportEntitiesBuilder = () => {
  // console.log(storeData.value)
  //     storeData.value.type = "export_entities"
  //     storeData.value.store_model = load_model.value
};
function clearToast() {
  storeData.value.type = null;
  storeData.value.store_model = [];
  storeData.value.store_scripts = [];
  storeData.value.secTar = null;
  readyToApplyData.value = {};
}
const selectScripts = (i) => {
  if (storeData.value.type == "scripts_only" && storeData.value.onlyScripts) {
    readyToApplyData.value = {
      ...readyToApplyData.value,
      scripts: i,
    };

    applyToBuild({
      ...readyToApplyData.value,
      buildType: "scripts_only",
    });
    clearToast();
    storeData.value.onlyScripts = false;
  } else if (storeData.value.type == "scripts_only") {
    storeData.value.type = "server_with_model";
    readyToApplyData.value = {
      ...readyToApplyData.value,
      scripts: i,
    };
  } else {
    storeData.value.secTar = storeData.value.type;
    storeData.value.type = "server_with_model";
    readyToApplyData.value = {
      ...readyToApplyData.value,
      scripts: i,
    };
  }
};

const selectModel = (i, scripts = false) => {
  if (storeData.value.type == "server_with_model") {
    readyToApplyData.value = {
      ...readyToApplyData.value,
      model: i,
    };
    applyToBuild({
      ...readyToApplyData.value,
      buildType: storeData.value.secTar ?? "server_with_model",
    });
    clearToast();
  } else if (storeData.value.type == "training_model") {
    readyToApplyData.value = {
      ...readyToApplyData.value,
      model: i,
    };

    applyToBuild({
      ...readyToApplyData.value,
      buildType: storeData.value.secTar ?? "training_model",
    });
    clearToast();
  } else {
    readyToApplyData.value = {
      ...readyToApplyData.value,
      scripts: i,
    };
    storeData.value.secTar = storeData.value.type;
    storeData.value.type = "server_with_model";
  }
};

function applyToBuild(data) {
  applyBuild(data);
}
// select()
watchEffect(() => {
  socket.on("pass_model", (data) => {
    load_model.value = data.items;
  });
  if (info.profile.active) {
    socket.emit("get_model", {
      type: "main",
      name: info.profile.active.name,
    });
  }
});

const currentPathObj = computed(() => route.path);
let currentPath = ref(currentPathObj.value);
let mobile_nav_active = ref(false);
function routering(name = "") {
  router.push(`/${name}`);
  currentPath.value = `/${name}`;
  swtMobile_nav()
}
function swtMobile_nav(){
  mobile_nav_active.value = !mobile_nav_active.value 
}
watchEffect(()=>{
   currentPath.value = route.path;
})
</script>

<template>
  <div :class="mobile_nav_active?`mobile-menu-bar mobile-menu-bar-on`:`mobile-menu-bar mobile-menu-bar-off`">
    <div class="icon_w_txt">
      <div class="icon">
        <img src="./../../assets/logo/chat_charfter.png" alt="" />
      </div>
      <div class="txt">Chat Crafter</div>
    </div>

    <div class="nav-item" @click="routering()">
      <div class="icon">
        <img src="`./../../assets/icon/other/Group 295.png`" alt="" />
      </div>
      <div class="txt">Intents</div>
      <div class="icon2" v-if="currentPath == '/'">
        <img src="`./../../assets/icon/other/Polygon 2.png`" alt="" />
      </div>
    </div>
    <div class="nav-item" @click="routering('response')">
      <div class="icon">
        <img src="`./../../assets/icon/other/Group%20315.png`" alt="" />
      </div>
      <div class="txt">Response</div>
      <div class="icon2" v-if="currentPath == '/response'">
        <img src="`./../../assets/icon/other/Polygon 2.png`" alt="" />
      </div>
    </div>
    <div class="nav-item" @click="routering('scripts')">
      <div class="icon">
        <img src="`./../../assets/icon/other/Group%20336.png`" alt="" />
      </div>
      <div class="txt">Scripts</div>
      <div class="icon2" v-if="currentPath == '/scripts'">
        <img src="`./../../assets/icon/other/Polygon 2.png`" alt="" />
      </div>
    </div>
    <div class="nav-item" @click="routering('entities')">
      <div class="icon">
        <img src="`./../../assets/icon/other/Group%20312.png`" alt="" />
      </div>
      <div class="txt">Entities</div>
      <div class="icon2" v-if="currentPath == '/entities'">
        <img src="`./../../assets/icon/other/Polygon 2.png`" alt="" />
      </div>
    </div>

    <div class="nav-item" @click="routering('synonyms')">
      <div class="icon">
        <img src="`./../../assets/icon/other/similar-svgrepo-com.png`" alt="" />
      </div>
      <div class="txt">Synonyms</div>
      <div class="icon2" v-if="currentPath == '/synonyms'">
        <img src="`./../../assets/icon/other/Polygon 2.png`" alt="" />
      </div>
    </div>

    <div class="nav-item" @click="routering('condition')">
      <div class="icon">
        <img src="`./../../assets/icon/other/Group%20337.png`" alt="" />
      </div>
      <div class="txt">Conditions</div>
      <div class="icon2" v-if="currentPath == '/condition'">
        <img src="`./../../assets/icon/other/Polygon 2.png`" alt="" />
      </div>
    </div>

    <div class="nav-item" @click="routering('custom-actions')">
      <div class="icon">
        <img src="`./../../assets/icon/other/Group%20314.png`" alt="" />
      </div>
      <div class="txt">Custom</div>
      <div class="icon2" v-if="currentPath == '/custom-actions'">
        <img src="`./../../assets/icon/other/Polygon 2.png`" alt="" />
      </div>
    </div>

    <div class="nav-item" @click="routering('task')">
      <div class="icon">
        <img src="`./../../assets/icon/other/Group%20316.png`" alt="" />
      </div>
      <div class="txt">Task</div>
      <div class="icon2" v-if="currentPath == '/task'">
        <img src="`./../../assets/icon/other/Polygon 2.png`" alt="" />
      </div>
    </div>

    <div class="more-option" >




          <div :class="currentPath == '/entitiestraning'? 'item active-item':'item'" @click="routering('entitiestraning')" >
        <img src="`./../../assets/icon/other/location-pin.png`" alt="" />

          </div>
  <div class="item" :class="currentPath == '/traning'? 'item active-item':'item'" @click="routering('traning')">
        <img src="`./../../assets/icon/other/brain.png`" alt="" />

          </div>


            <div class="item" >
        <img src="`./../../assets/icon/other/chatbot.png`" alt="" />

          </div>


            <div class="item" >
        <img src="`./../../assets/icon/other/hammer.png`" alt="" />

          </div>


            <div class="item" >
        <img src="`./../../assets/icon/other/logout.png`" alt="" />

          </div>


    </div>  





































  </div>
  <div class="build-dialog-box" v-if="showBuild">
    <div class="dialog-box">
      <div class="head-box">
        <div class="label">Export Build Script Bot</div>
        <div
          class="close"
          @click="
            () => {
              showBuild = null;
              storeData.type = null;
              storeData.store_model = [];
              storeData.store_scripts = [];
            }
          "
        >
          close
        </div>
      </div>
      <div class="grid-box" v-if="storeData.type == null">
        <div
          class="item"
          v-for="(i, n) in [
            {
              name: 'scripts only',
              icon: ImageScripts,
              type: 'scripts_only',
            },
            {
              name: 'server with model',
              icon: ServerModel,
              type: 'server_with_model',
            },
            {
              name: 'training model',
              icon: ImageModel,

              type: 'training_model',
            },
            { name: 'model pack', icon: PackModel, type: 'model_pack' },
            {
              name: 'without controller',
              icon: ControllerImage,
              type: 'without_controller',
            },
            {
              name: 'export entities',
              icon: EntitiesImage,
              type: 'export_entities',
            },
          ]"
          @click="
            () => {
              if (i.type == 'scripts_only') {
                getScriptsExporter();
              } else if (i.type == 'server_with_model') {
                modelWithServerBuilder();
              } else if (i.type == 'training_model') {
                onlyTraningModelBuilder();
              } else if (i.type == 'model_pack') {
                modelWithServerBuilder('model_pack');
              } else if (i.type == 'without_controller') {
                modelWithServerBuilder('without_controller');
              } else if (i.type == 'export_entities') {
                exportEntitiesBuilder();
              }
            }
          "
        >
          <div class="icon">
            <img :src="i.icon" alt="" />
          </div>
          <div class="txt">
            {{ i.name }}
          </div>
        </div>
      </div>

      <div class="list-of-items" v-if="storeData.type != null">
        <div
          class="item"
          v-for="(i, n) in storeData.type == 'scripts_only' ||
          storeData.type == 'model_pack' ||
          storeData.type == 'without_controller'
            ? storeData?.store_scripts
            : storeData?.store_model"
        >
          <div class="icon">
            <img src="./../../assets/icon/other/delete.png" alt="" />
          </div>

          <div
            class="txt"
            @click="
              () => {
                if (storeData.type == 'scripts_only') {
                  selectScripts(i.name ?? i);
                } else if (storeData.type == 'training_model') {
                  selectModel(i.name ?? i);
                } else {
                  selectModel(i.name ?? i);
                }
              }
            "
          >
            {{ i.name ?? i }}
          </div>
          <div class="icon">
            <img src="./../../assets/icon/other/delete.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <BotchattesterView
    v-if="chatBoxShow"
    @close="
      () => {
        chatBoxShow = false;
      }
    "
  />
  <BotselectorView :show="showSelectorstatus" @close="hideSelector" />
  <div class="main-header">
    <div class="part">
      <div class="icon">
        <img src="./../../assets/logo/chat_charfter.png" alt="Logo" />
      </div>
      <div class="text">Chat Crafter</div>
    </div>

    <div class="part exp part-2">
      <div
        :class="info.profile.active ? 'option-item' : 'option-item over-out'"
        @click="toggleLogin"
      >
        <img src="./../../assets/icon/head/power.png" alt="Power" />
      </div>
      <div
        :class="info.profile.active ? 'option-item' : 'option-item over-out'"
        @click="router.push('/traning')"
      >
        <!-- <img src="./../../assets/icon/other/Double Ring@1x-1.0s-200px-200px.gif" alt="Training" /> -->
        <img src="./../../assets/icon/head/traning.png" alt="Training" />
      </div>
      <div
        :class="
          info.profile.active
            ? 'option-item chat'
            : 'option-item profile over-out'
        "
        @click="
          () => {
            chatBoxShow = true;
          }
        "
      >
        <img src="./../../assets/icon/head/chat_box.png" alt="Chat Box" />
      </div>
      <div
        @click="
          () => {
            showBuild = {};
          }
        "
        :class="
          info.profile.active
            ? 'option-item build-padding'
            : 'option-item profile over-out build-padding'
        "
      >
        <img src="./../../assets/icon/other/pngegg.png" alt="Chat Box" />
      </div>
      <div
        :class="
          !info.profile.active
            ? 'option-item profile'
            : 'option-item profile over-out'
        "
        @click="showSelector"
      >
        <img src="./../../assets/icon/head/profile.png" alt="Profile" />
      </div>
    </div>

    <div class="part exp-0 part-2">
      <div :class="'option-item'"  @click="swtMobile_nav()" >
        <img
          src="./../../assets/icon/other/menu2-svgrepo-com.png"
          alt="Power"
        />
      </div>
    </div>
  </div>
</template>

<style lang="css" src="./style.css"></style>
