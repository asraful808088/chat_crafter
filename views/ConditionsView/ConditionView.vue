<script setup>
import { CreatdialogView } from "#components";
import { io } from "socket.io-client";
import { onMounted, ref } from "vue";
import CodemirrorView from "~/components/codemirror/CodemirrorView.vue";
import addModuleOrTypes from "~/network/add_condition_module_or_type/post";
import createCondition from "~/network/createcondition/createCondition";
import getCodefile from "~/network/getCodeFIle/getCode";
import getConditionItems from "~/network/getConditions/get";
import CoderunnerView from "~/components/CodeRunner/CoderunnerView.vue";
const socket = io();
const activeFileAndCondition = ref(null);
const listOfCondition = ref([]);
const showCreateDialog = ref(false);
const activeAsideMenuModule = ref(false);
const task_code = ref(null);
const inputTxt = ref("");
const recom = ref([]);
const codeRunner = ref(null);

function getPyCodeFile(name) {
  getCodefile(
    {
      item_name: activeFileAndCondition?.value?.name,
      name: name,
    },
    (res) => {
      if (res) {
        if (res.file) {
          task_code.value = {
            ...res.file,
            name,
          };
        }
      }
    }
  );
}

onMounted(() => {
  
  socket.on("condition_msg_return",(data)=>{
    const output = JSON.parse(data.result["output"])
     codeRunner.value =  JSON.stringify(output, null, 2) 
     
      
  })
  socket.on("update_code_c", (data) => {
    listOfCondition.value = listOfCondition.value.map((element) => {
      if (element.name == data.name) {
        return {
          ...element,
          code: data.code,
        };
      }

      return element;
    });
    recom.value = data.reco;
    // console.log(recom.value)
  });
  getConditionItems((res) => {
    if (res.items) {
      listOfCondition.value = res.items;
    }
  });
});
onUnmounted(() => {
  socket.off("update_code_c");
});
function getCodePage(i) {
  activeFileAndCondition.value = listOfCondition.value.find(
    (element) => element.name == i
  );
  task_code.value = null;
}

function updateCode(e) {
  if (!activeFileAndCondition?.value?.name) {
    return;
  }
  socket.emit("code_update_c", {
    code: e,
    type: task_code?.value?.name,
    name: activeFileAndCondition?.value?.name,
  });
}

function createModuleOrtypes() {
  if (!inputTxt.value) {
    return;
  }
  if (!activeFileAndCondition.value) {
    return;
  }
  addModuleOrTypes(
    {
      name: inputTxt.value,
      typemodule: activeAsideMenuModule.value,
      item_name: activeFileAndCondition?.value?.name,
    },
    (res) => {
      if (res) {
        if (res.items) {
          if (res.type == "types") {
            activeFileAndCondition.value.types = res.items;
          } else if ("modules" == res.type) {
            activeFileAndCondition.value.task_list = res.items;
          }
        }
      }
    }
  );
}
</script>
<template>
  <div class="condition-main">
    <CreatdialogView
      :show="showCreateDialog"
      :input-type="false"
      @apply="
        (e) => {
          createCondition(
            {
              ...e,
            },
            (res, err) => {
              if (res.items) {
                listOfCondition = res.items;
                showCreateDialog = false;
              }
            }
          );
        }
      "
      @close="
        () => {
          showCreateDialog = false;
        }
      "
    />
    <CoderunnerView v-if="codeRunner" :cmdtxt="codeRunner"  @close="()=>{
      codeRunner = null
    }"/>
    <div class="menu">
      <h2>
        <span>Conditions</span>
        <span
          class="icon"
          @click="
            () => {
              showCreateDialog = true;
            }
          "
        >
          <img src="../../assets/icon/other/Group 3.png" alt="" />
        </span>
      </h2>
      <div class="item-box">
        <div
          :class="
            activeFileAndCondition?.name == i?.name
              ? 'item item-active'
              : 'item'
          "
          v-for="(i, n) in listOfCondition"
        >
          <div class="icon" @click="getCodePage(i.name)">
            <img src="../../assets/icon/nav/condition.png" alt="" />
          </div>
          <div class="txt" @click="getCodePage(i.name)">
            <div class="head">{{ i.name }}</div>
            <div class="counter">
              <div class="counter-item">Types-{{ i?.types.length }}</div>
              <div class="counter-item">Module-{{ i?.task_list.length }}</div>
            </div>
          </div>
          <div class="icon" @click="getCodePage(i.name)">
            <img src="../../assets/icon/other/arrowx.png" alt="" />
          </div>
          <div class="icon">
            <img src="../../assets/icon/other/delete.png" alt="" />
          </div>
        </div>
      </div>
    </div>
    <div class="codebox">
      <h3>
        <div>
          Code / {{ activeFileAndCondition?.name }} /
          {{ !task_code ? "condition_runner" : task_code.name }}
        </div>
        <div
          class="icon"
          @click="
            () => {
              if (!activeFileAndCondition) {
                return;
              }
              socket.emit('code_runner_c', {
                name: activeFileAndCondition?.name,
              });
            }
          "
        >
          <img src="../../assets/icon/other/run-all-svgrepo-com.png" alt="" />
        </div>
      </h3>
      <div class="codepad">
        <CodemirrorView
          v-if="activeFileAndCondition"
          :value="
            task_code != null ? task_code?.code : activeFileAndCondition.code
          "
          @text="updateCode"
          :recommend="recom"
        />
        <div class="" v-if="!activeFileAndCondition">Select</div>
      </div>
    </div>
    <div
      :class="
        !activeFileAndCondition ? 'aside-box' : ' aside-box active-aside-box'
      "
    >
      <h2>
        <span>Modules & Types</span>
        <span
          class="button"
          @click="
            () => {
              activeFileAndCondition = null;
            }
          "
        >
          <img src="../../assets/icon/other/backbutton.png" alt="" />
        </span>
      </h2>
      <div class="option-button">
        <div
          :class="
            activeAsideMenuModule
              ? 'option-button-item'
              : 'option-button-item active-option-button-item'
          "
          @click="
            () => {
              activeAsideMenuModule = false;
            }
          "
        >
          Types
        </div>
        <div
          :class="
            !activeAsideMenuModule
              ? 'option-button-item'
              : 'option-button-item active-option-button-item'
          "
          @click="
            () => {
              activeAsideMenuModule = true;
            }
          "
        >
          Modules
        </div>
      </div>
      <div class="input-box">
        <div class="text-input">
          <input
            type="text"
            name=""
            id=""
            :placeholder="!activeAsideMenuModule ? 'condition-type' : 'modules'"
            v-model="inputTxt"
          />
        </div>
        <div class="buttonx" @click="createModuleOrtypes">Add</div>
      </div>

      <div class="list-of-items list-of-items-m" v-if="activeAsideMenuModule">
        <div class="single-item">
          <div class="icon x-icon">
            <img src="../../assets/icon/other/module-svgrepo-com.png" alt="" />
          </div>
          <div
            class="txt"
            @click="
              () => {
                task_code = null;
              }
            "
          >
            condition_runner
          </div>
        </div>

        <div
          class="single-item"
          v-for="(i, n) in activeFileAndCondition?.task_list"
        >
          <div class="icon x-icon">
            <img src="../../assets/icon/other/module-svgrepo-com.png" alt="" />
          </div>
          <div
            class="txt"
            @click="
              () => {
                getPyCodeFile(i?.name);
              }
            "
          >
            {{ i?.name }}
          </div>
          <div class="icon">
            <img src="../../assets/icon/other/delete.png" alt="" />
          </div>
        </div>
      </div>

      <div class="list-of-items list-of-items-m" v-if="!activeAsideMenuModule">
        <div
          class="single-item"
          v-for="(i, n) in activeFileAndCondition?.types"
        >
          <div class="icon x-icon">
            <img src="../../assets/icon/other/Group 4.png" alt="" />
          </div>
          <div class="txt" @click="() => {}">{{ i?.typename }}</div>
          <div class="icon">
            <img src="../../assets/icon/other/delete.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="./style.css" lang="css"></style>
