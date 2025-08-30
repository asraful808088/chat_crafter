<script setup>
import { CreatdialogView } from "#components";
import { io } from "socket.io-client";
import { onMounted, ref } from "vue";
import addCodeFrameModule from "~/network/addCodeFrameModule/post";
import createCodeFrame from "~/network/createCodeFrames/post";
import getCf from "~/network/getCodeFIle/getCode";
import getCodefile from "~/network/getCodeFrame/getCodeFrames";
import CodemirrorView from "../codemirror/CodemirrorView.vue";
import CoderunnerView from "../CodeRunner/CoderunnerView.vue";
const socket = io();
const showToast = ref(false);
const showModuleList = ref(null);
const listOfItems = ref([]);
const taskCode = ref(null);
const taskTempCode = ref(null);
const activeDetails = ref(null);
const modulenametxt = ref("");
const recom = ref([]);
const codeRunnertxt = ref(null);
const props = defineProps({
  of: {
    type: String,
    require: false,
    default: "custom_actions",
  },
});
onUnmounted(() => {
  socket.off("code_frame_msg_return");
  socket.off("code_update_code_frame");
});
onMounted(() => {
  socket.on("codeFrames_check_type_msg_return", (data) => {
    const output = JSON.parse(data.result["output"]);
    codeRunnertxt.value = JSON.stringify(output, null, 2);
  });
  socket.on("update_code_code_frame", (data) => {
    recom.value = data.reco;
    if (taskCode.value) {
      taskCode.value = {
        ...taskCode.value,
        code:data.code
      }
    }else{
      listOfItems.value = listOfItems.value.map((element, index) => {
      if (element?.name == data?.name) {
        return {
          ...element,
          code: data.code,
        };
      }
      return element;
    });
    }
    


  });

  getCodefile(
    {
      of: props.of,
    },
    (res) => {
      if (res) {
        if (res?.items) {
          listOfItems.value = res?.items;
        }
      }
    }
  );
});

function addModule() {
  addCodeFrameModule(
    {
      of: props?.of,
      item_name: activeDetails.value?.name,
      name: modulenametxt.value,
      typemodule: true,
    },
    (res) => {
      if (res) {
        modulenametxt.value = "";
        if (res.items) {
          activeDetails.value = {
            ...activeDetails.value,
            task_list: res.items,
          };
          listOfItems.value = listOfItems.value.map((element, index) => {
            if (element?.name == activeDetails.value?.name) {
              return {
                ...element,
                task_list: res.items,
              };
            }
            return element;
          });
        }
      }
    }
  );
}

function selectTask(i) {
  if (!i) {
    return;
  }
  if (modulenametxt.value == "task") {
    return;
  }
  if (modulenametxt.value == "Task") {
    return;
  }
  getCf(
    {
      of: props.of,
      item_name: activeDetails.value.name,
      name: i,
    },
    (res) => {
      if (res.file) {
        taskCode.value = res.file;
        taskCode.value = {
          ...taskCode.value,
          name: i,
        };
        taskTempCode.value = {
          ...taskCode.value,
          name: i,
        }
      }
    }
  );
}

function codeRunner() {
  if (!activeDetails.value?.name) {
    return;
  }
  socket.emit("code_runner_code_frame", {
    name: activeDetails.value?.name,
    of: props.of,
  });
}

import deleteCodeframe from "~/network/deleteCodeframe/delete";
function deleteItem(name){
  

if (name == activeDetails?.value?.name) {
  activeDetails.value = null
  showModuleList.value = null
}
  deleteCodeframe({
    of:props.of,
    name:name
  },(res,err)=>{
    if (res?.items) {
                  listOfItems.value = res?.items;

                }
  })

}

const activeListItemActive = ref(true)
const changeActiveListItemActive = ()=>{
  activeListItemActive.value = !activeListItemActive.value
}
</script>
<template>
  <div class="code-frame">
    <CoderunnerView
      v-if="codeRunnertxt"
      :cmdtxt="codeRunnertxt"
      @close="
        () => {
          codeRunnertxt = null;
        }
      "
    />
    <CreatdialogView
      @close="
        () => {
          showToast = false;
        }
      "
      :info="showToast"
      :input-type="false"
      @apply="
        (e) => {
          createCodeFrame(
            { ...e, of: props.of ?? 'custom_actions' },
            (res, err) => {
              if (res) {
                if (res?.items) {
                  listOfItems = res?.items;
                }
              }
            }
          );
        }
      "
    />
    <div :class="activeListItemActive?'menu ':'menu deavtive-code-list'">
      <div class="header">
        <div>Custom-Items</div>
        <div
          class="icon"
          @click="
            () => {
              showToast = true;
            }
          "
        >
          <img src="../../assets/icon/other/Group 3.png" alt="" />
        </div>
      </div>
      <div class="list-box">
        <div
          :class="
            i?.name == activeDetails?.name
              ? 'list-item list-item-active'
              : 'list-item'
          "
          v-for="(i, n) in listOfItems"
          
        >
          <div
            class="icon"
            @click="
              () => {
                taskCode = null
                activeDetails = i;
                showModuleList = i?.task_list;
                showModuleList = true;
                taskCode = null;
              }
            "
          >
            <img src="../../assets/icon/nav/custom-actions.png" alt="" />
          </div>
          <div
            class="txt"
            @click="
              () => {
                taskCode = null
                activeDetails = i;
                showModuleList = i?.task_list;
                activeListItemActive = false

              }
            "
          >
            {{ i.name }}
          </div>
          <div class="icon" @click="()=>{
             showModuleList = true;
             taskCode = null;
             activeDetails = i;
                showModuleList = i?.task_list;
          }">
            <img src="../../assets/icon/other/arrowx.png" alt="" />
          </div>
          <div class="icon" @click="()=>{
            deleteItem(i.name)
          }">
            <img src="../../assets/icon/other/delete.png" alt="" />
          </div>
        </div>
      </div>
    </div>
    <div class="code-box">
      <div class="head-box">
        <div class="name">
          <span 
          @click="()=>{
                activeListItemActive = true
                 showModuleList = null;

          }"
          >Code</span> {{ activeDetails?.name ? `/ ${activeDetails.name}` : null
          }}{{ taskCode?.code ? `/ ${taskCode.name}` : null }}
        </div>
        <div class="icon" @click="codeRunner">
          <img src="../../assets/icon/other/run-all-svgrepo-com.png" alt="" />
        </div>
      </div>
      <div class="code">
        <CodemirrorView
        v-if="activeDetails?.name"
          :recommend="recom"
          :value="taskCode ? taskTempCode?.code : activeDetails?.code"
          @text="
            (e) => {
              if (!activeDetails?.name) {
                return;
              }
              socket.emit('code_update_code_frame', {
                code: e,
                type: taskCode?.name,
                name: activeDetails?.name,
                of: props.of,
              });
            }
          "
        />
        <div class="seletor_banner" v-if="!activeDetails?.name">
            <div class="icon">
              <img src="../../assets/icon/other/Group 391.png" alt="">
            </div>
            <div class="txt">
              Select Custom Actions
            </div>
        </div>
      </div>
      <!-- showModuleList  active-list-pad-->
      <div :class="showModuleList ? 'list-pad active-list-pad' : 'list-pad'">
        <div class="heads-box">
          <div class="name">Modules</div>
          <div
            class="icon"
            @click="
              () => {
                showModuleList = null;
              }
            "
          >
            close
          </div>
        </div>
        <div class="input-frame">
          <div class="input">
            <input
              type="text"
              placeholder="module-name"
              v-model="modulenametxt"
            />
          </div>
          <div class="button" @click="addModule">Add</div>
        </div>
        <div class="list-box">
          <div class="list-item">
            <div
              class="icon"
              @click="
                () => {
                  taskCode = null;
                }
              "
            >
              <img
                src="../../assets/icon/other/module-svgrepo-com.png"
                alt=""
              />
            </div>
            <div
              class="txt"
              @click="
                () => {
                  const findObj = listOfItems.find((element)=>element.name==activeDetails['name'])
                  if (findObj) {
                      activeDetails = findObj
                  }
                  taskCode = null;
                }
              "
            >
              {{ "code_runner" }}
            </div>
          </div>
          <div class="list-item" v-for="(i, n) in activeDetails?.task_list">
            <div class="icon" @click="selectTask(i?.name)">
              <img
                src="../../assets/icon/other/module-svgrepo-com.png"
                alt=""
              />
            </div>
            <div class="txt" @click="selectTask(i?.name)">{{ i?.name }}</div>
            <div class="icons">
              <img src="../../assets/icon/other/delete.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style src="./style.css"></style>
