<script setup >
import getSelectItems from '~/network/get_intentes/get_intents';
import deleteAlterWords from '~/network/add_alternative/delete_word';
import deleteChunk from '~/network/add_alternative/delete_chunk';
import addAlternatives from '~/network/add_alternative/addAlternativeWords';
import useEntitiesFuncStore from "~/state/entities/storage";
import useIntentesStore from "~/state/intentes/storage";
import useRespopnseStore from "~/state/response/storage";
import getAlternativeList from '~/network/add_alternative/getalternative';
import { ref,onMounted } from 'vue';
import { AlterwordboxView } from '#components';

import { useRoute } from "#app";
const route = useRoute();
const id = route.params.id;
const props = defineProps({
  name: {
    type: String,
    require: false,
  },
  of: {
    type: String,
    require: false,
  },
});
let info;
const listOFGlobleSyn = ref(null);

if (props.of == "intents") {
  info = useIntentesStore();
} else if (props.of == "response") {
  info = useRespopnseStore();
} else {
  info = useEntitiesFuncStore();
}
const alternativeMain = ref("");
const alternativeWord = ref("");
function getGlobleSyn(){
  getSelectItems({ of: "synonyms"}, (res, err) => {
    if (res.items) {
      listOFGlobleSyn.value = res.items 
    }
  });
}





function addAlternativeWords() {
  if (!alternativeWord.value) {
    return;
  }
  if (!info.entitiesState.activeAlter) {
    return;
  }
  if (
    !(
      info?.entitiesState?.listOfAlterchunk[
        info.entitiesState.activeAlter
      ] instanceof Array
    )
  ) {
    return;
  }

  addAlternatives(
    {
      name: info.entitiesState.activeAlter,
      of: props.of ?? "entities",
      alternative: alternativeWord.value.trim(),
      item: id,
    },
    (res, err) => {
      if (err) {
        return;
      }
      info.initAlterNativeItems(res.data);
      alternativeWord.value = "";
    }
  );
}




function activeAlternative(i) {
  info.setActiveAlternative(i);
}

onMounted(() => {
  setTimeout(() => {
    getAlternativeList(
      {
        of: props.of ?? "entities",
        item: id,
      },
      (res, err) => {
        if (res) {
          info.initAlterNativeItems(res.data);
        } else {
          info.initAlterNativeItems({});
        }
      }
    );
  }, 1000);
});
function deleteWordChunk(name) {
  deleteChunk(
    {
      name: name,
      of: props.of ?? "entities",
      item: id,
    },
    (res, err) => {
      if (err) {
        return;
      }
      info.initAlterNativeItems(res.data);
      if (info.entitiesState.activeAlter == name) {
        info.setActiveAlternative(null);
      }
    }
  );
}
function deletealternativeWord(word) {
  deleteAlterWords(
    {
      name: info.entitiesState.activeAlter,
      of: props.of ?? "entities",
      alternative: word,
      item: id,
    },
    (res, err) => {
      if (err) {
        return;
      }
      info.initAlterNativeItems(res.data);
      if (info.entitiesState.activeAlter == name) {
        info.setActiveAlternative(null);
      }
    }
  );
}


import addalternative from '~/network/add_alternative/addalternative';
function addAlternativeWord(i) {
  if (!(i||alternativeMain.value.trim())) {
    return
  }
  
  if (typeof(i)=="string") {
    
    addalternative(
    {
      name: i,
      of: props.of ?? "entities",
      item: id,
      syn:true
    },
    (res, err) => {
      if (err) {
        return;
      }
      info.initAlterNativeItems(res.data);
      alternativeMain.value = "";
    }
  );
  return
  }
  addalternative(
    {
      name: alternativeMain.value.trim(),
      of: props.of ?? "entities",
      item: id,
    },
    (res, err) => {
      if (err) {
        return;
      }
      info.initAlterNativeItems(res.data);
      alternativeMain.value = "";
    }
  );
}


</script>
<template>

<div class="part">
  <AlterwordboxView
    v-if="listOFGlobleSyn"
    :list_of_item="listOFGlobleSyn"
    :of="props.of"
    @NewList="addNewList"
    @Close="()=>{
      listOFGlobleSyn = null
    }"
    :dotHide="true"
    @change="(i)=>{
      addAlternativeWord(i)
    }"
  />
        <h3 class="sub-header">
          <span>Alternative-Words</span>
          <span class="import" @click="getGlobleSyn" >Import</span>
        </h3>
        <div class="alter-box">
          <div class="alter-item">
            <div class="input-box">
              <input
                type="text"
                name=""
                id=""
                placeholder="main-word"
                v-model="alternativeMain"
              />
              <div class="button" @click="addAlternativeWord">Add</div>
            </div>
            <div
              class="word-item-box"
              v-if="!info.entitiesState.alterNativewordFatching"
            >
              <div
                class="icon-text-with-delete"
                v-for="(i, n) in Object.keys(
                  info.entitiesState.listOfAlterchunk
                )"
                :key="n"
              >
                <div class="icon">
                  <img
                    src="../../../assets/icon/other/Group 4.png"
                    alt=""
                    @click="activeAlternative(i)"
                  />
                </div>
                <div class="txt" @click="activeAlternative(i)">
                  {{
                    `${!(info?.entitiesState?.listOfAlterchunk[i] instanceof Array) ? "(I)" : ""} ${i}`
                  }}
                </div>
                <div
                  class="active-circle"
                  v-if="info.entitiesState.activeAlter == i"
                ></div>
                <div class="icon delete" @click="deleteWordChunk(i)">
                  <img src="../../../assets/icon/other/delete.png" alt="" />
                </div>
              </div>
            </div>

            <div class="blank-box" v-if=" !info.entitiesState.alterNativewordFatching && Object.keys(
                  info.entitiesState.listOfAlterchunk
                ).length==0" >
              <div class="icon">
                <img src="../../../assets/icon/other/box.png" alt="" />
              </div>
              <div class="txt">Not Found</div>
            </div>

            <LoadingRequestView
              v-if="info.entitiesState.alterNativewordFatching"
            />
          </div>

          <div class="alter-item">
            <div class="input-box">
              <input
                type="text"
                name=""
                id=""
                placeholder="alternative"
                v-model="alternativeWord"
              />
              <div class="button" @click="addAlternativeWords">Add</div>
            </div>
            <div class="word-item-box">
              <div
                class="icon-text-with-delete"
                v-if="
                  info.entitiesState.activeAlter &&
                  !info.entitiesState.listOfAlterchunk[
                    info.entitiesState.activeAlter
                  ].length == 0
                "
                v-for="(i, n) in info.entitiesState.listOfAlterchunk[
                  info.entitiesState.activeAlter
                ]"
                :key="n"
              >
                <div class="icon">
                  <img src="../../../assets/icon/other/Group 5.png" alt="" />
                </div>
                <div class="txt">{{ i }}</div>
                <div class="icon delete" @click="deletealternativeWord(i)">
                  <img src="../../../assets/icon/other/delete.png" alt="" />
                </div>
              </div>
            </div>

            <div
              class="blank-box"
              v-if="
                info.entitiesState.activeAlter &&
                info.entitiesState.listOfAlterchunk[
                  info.entitiesState.activeAlter
                ].length == 0 &&
                info?.entitiesState?.listOfAlterchunk[
                  info.entitiesState.activeAlter
                ] instanceof Array
              "
            >
              <div class="icon">
                <img src="../../../assets/icon/other/box.png" alt="" />
              </div>
              <div class="txt">Empty</div>
            </div>

            <!-- <LoadingRequestView /> -->
            <div class="blank-box" v-if="!info.entitiesState.activeAlter">
              <div class="icon">
                <img src="../../../assets/icon/other/cursor_17346611.png" alt="" />
              </div>
              <div class="txt">Select One</div>
            </div>
          </div>
        </div>
      </div>

</template>
<style lang="css" src="./style.css" >
</style>