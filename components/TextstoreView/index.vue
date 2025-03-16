<script setup>
import { useRoute } from "#app";
import { LoadingRequestView, TextinputView } from "#components";
import { onBeforeMount, onMounted, ref } from "vue";
import addalternative from "~/network/add_alternative/addalternative";
import addAlternatives from "~/network/add_alternative/addAlternativeWords";
import deleteChunk from "~/network/add_alternative/delete_chunk";
import deleteAlterWords from "~/network/add_alternative/delete_word";
import getAlternativeList from "~/network/add_alternative/getalternative";
import updateAlternative from "~/network/changeAlternativeQ/changeAlternative";
import deleteGenItem from "~/network/delete_gen/delete";
import deleteMainItem from "~/network/deleteTextItem/deleteItem";
import geteEntitiesList from "~/network/entities/get";
import postEntities from "~/network/entities/post.";
import getAllReGenerate from "~/network/getRegenerate";
import reCreateItem from "~/network/reCreate/reCreate";
import updateEntitiesItem from "~/network/updateEntites/update";
import useEntitiesFuncStore from "~/state/entities/storage";
import useIntentesStore from "~/state/intentes/storage";
import useRespopnseStore from "~/state/response/storage";
import EntitieseditorView from "../entitiesEditor/EntitieseditorView..vue";
import getSynItem from "~/network/get_syn/scripts";
import getSelectItems from "~/network/get_intentes/get_intents";
import RebuildsentcontainerView from "./RebuildsentContainer/RebuildsentcontainerView.vue";
import AltercontainerView from "./AlterContainer/AltercontainerView.vue";

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

const route = useRoute();
const id = route.params.id;
// const alternativeMain = ref("");
// const alternativeWord = ref("");
const deletePermission = ref(null);
const submitEnable = ref(false);
const activeWordsToast = ref(null);
const listOFEntities = ref([]);
const listOFGlobleSyn = ref(null);
const currentEntitiesItem = ref(null);
let info;

if (props.of == "intents") {
  info = useIntentesStore();
} else if (props.of == "response") {
  info = useRespopnseStore();
} else {
  info = useEntitiesFuncStore();
}
function splitSentenceByPunctuation(sentence) {
  const sentSplit = sentence.split(" ");
  const enArr = new Array(sentSplit.length).fill("O");
  const mapIndex = sentSplit.map((element, index) => element);
  return [sentence, enArr, mapIndex];
}
function onChangeInput(value) {
  if (!submitEnable.value) {
    return;
  }
  const newItems = value.map((element) => splitSentenceByPunctuation(element));
  let store = [];
  for (const element of newItems) {
    store.push({
      mainsent: element[0],
      mapword: element[1],
      wordlist: element[2],
    });
  }
  store = store.filter((element) => {
    const findEn = info.entitiesState.listOfItems.find(
      (element2) => element.mainsent == element2.mainsent
    );
    if (findEn) {
      return false;
    }
    return true;
  });

  postEntities(
    { list: store, of: props.of ?? "entities", item: id },
    (res, err) => {
      if (err) {
        return;
      }
      if (res.items) {
        info.initEntitiesItems(res.items);
      }
    }
  );
}

// function deleteWordChunk(name) {
//   deleteChunk(
//     {
//       name: name,
//       of: props.of ?? "entities",
//       item: id,
//     },
//     (res, err) => {
//       if (err) {
//         return;
//       }
//       info.initAlterNativeItems(res.data);
//       if (info.entitiesState.activeAlter == name) {
//         info.setActiveAlternative(null);
//       }
//     }
//   );
// }

// function deletealternativeWord(word) {
//   deleteAlterWords(
//     {
//       name: info.entitiesState.activeAlter,
//       of: props.of ?? "entities",
//       alternative: word,
//       item: id,
//     },
//     (res, err) => {
//       if (err) {
//         return;
//       }
//       info.initAlterNativeItems(res.data);
//       if (info.entitiesState.activeAlter == name) {
//         info.setActiveAlternative(null);
//       }
//     }
//   );
// }

// function addAlternativeWords() {
//   if (!alternativeWord.value) {
//     return;
//   }
//   if (!info.entitiesState.activeAlter) {
//     return;
//   }
//   if (
//     !(
//       info?.entitiesState?.listOfAlterchunk[
//         info.entitiesState.activeAlter
//       ] instanceof Array
//     )
//   ) {
//     return;
//   }

//   addAlternatives(
//     {
//       name: info.entitiesState.activeAlter,
//       of: props.of ?? "entities",
//       alternative: alternativeWord.value.trim(),
//       item: id,
//     },
//     (res, err) => {
//       if (err) {
//         return;
//       }
//       info.initAlterNativeItems(res.data);
//       alternativeWord.value = "";
//     }
//   );
// }








// function activeAlternative(i) {
//   info.setActiveAlternative(i);
// }

/**
 * 
 * 


    init




 */
onBeforeMount(() => {
  info.initEntitiesItems([]);
  info.reFatcher();
});
onMounted(() => {
  setTimeout(() => {
    geteEntitiesList(props.of ?? "entities", id, (res, err) => {
      if (res) {
        listOFEntities.value = res.entities;
        info.initEntitiesItems(res.items);
      } else {
        info.initEntitiesItems([]);
      }
      submitEnable.value = true;
    });
  }, 2000);
  // setTimeout(() => {
  //   getAlternativeList(
  //     {
  //       of: props.of ?? "entities",
  //       item: id,
  //     },
  //     (res, err) => {
  //       if (res) {
  //         info.initAlterNativeItems(res.data);
  //       } else {
  //         info.initAlterNativeItems({});
  //       }
  //     }
  //   );
  // }, 1000);
});

/**
 *
 *
 *
 *
 *
 *
 */

function delete_word_chunk() {}
function delete_word() {}

/**
 *
 *
 *
 *
 *
 *
 *
 */
function changesingleAllAlternative(i) {
  updateAlternative(
    {
      of: props.of,
      change: "allAlter",
      currectStatus: !i.allAlter,
      sent: i.mainsent,
      item: id,
    },
    (res, err) => {
      if (err) {
        return;
      }
      if (res?.items) {
        info.initEntitiesItems(res.items);
      }
    }
  );
}
function changesingleAddAlternative() {}
function changesingleRemoveAlternative() {}
function getSingleAlternative(i) {
  if (i.allAlter) {
    return;
  }
  activeWordsToast.value = {
    alter: i.alter,
    words_c: Object.keys(info.entitiesState.listOfAlterchunk),
    name: i.mainsent,
  };
}
function addNewList(val) {
  info.initEntitiesItems(val);
}
function closeToast() {
  activeWordsToast.value = null;
}
function reGenerate(i) {
  info.initAlterSentItemLoading();
  reCreateItem(
    {
      of: props.of,
      sent: i ? i.mainsent : null,
      item: id,
    },
    (res, err) => {
      if (!err) {
        info.initAlterSentItem(res.items);
      }
    }
  );
}

function delete_main_item(i) {
  deleteMainItem(
    {
      sent: i.mainsent,
      of: props.of,
      item: id,
    },
    (res, err) => {
      if (!err) {
        info.initEntitiesItems(res.items);
        info.initAlterSentItem(res.alter_item);
      }
    }
  );
}

function delete_gen(i) {
  deleteGenItem(
    {
      sent: i.sent,
      of: props.of,
      gen: i.gen,
      item: id,
    },
    (res, err) => {
      if (!err) {
        info.initAlterSentItem(res.items);
      }
    }
  );
}
const itemsx = {
  mainsent: "this is entities",
  mapword: ["O", "O", "O"],
  wordlist: ["this", "is", "entities"],
  alter: [],
  allAlter: true,
  reCreate: false,
};
function updateEntities(Eitem) {
  updateEntitiesItem(
    {
      item: id,
      update: Eitem,
    },
    (res, err) => {
      if (res) {
        info.initEntitiesItems(res.items);
        currentEntitiesItem.value = Eitem;
      }
    }
  );
}

// function getGlobleSyn(){
//   getSelectItems({ of: "synonyms"}, (res, err) => {
//     if (res.items) {
//       listOFGlobleSyn.value = res.items 
//     }
//   });
// }

</script>
<template>
  <!-- <PermissionboxView :show="true" /> -->
  <EntitieseditorView
    :item="currentEntitiesItem"
    v-if="currentEntitiesItem != null"
    :entities="listOFEntities"
    @update="updateEntities"
    @close="
      () => {
        currentEntitiesItem = null;
      }
    "
  />
  <AlterwordboxView
    v-if="activeWordsToast != null"
    :list_of_item="activeWordsToast.words_c"
    :item_of_item="activeWordsToast.alter"
    :of="props.of"
    :name="activeWordsToast.name"
    @NewList="addNewList"
    @Close="closeToast"
  />



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



  <div class="entity-main">
    <div class="item">
      <TextinputView @text="onChangeInput" />
      <div>
        <h2 class="items-header">{{ props.name ?? "Entities" }}</h2>
      </div>

      <div
        class="items-box"
        v-if="
          !info.entitiesState.fetching &&
          info.entitiesState.listOfItems.length != 0
        "
      >
        <div
          class="input-item"
          v-for="(i, n) in info.entitiesState.listOfItems"
          :key="n"
        >
          <div
            class="icon"
            @click="
              () => {
                if (props.name == 'Entities') {
                  currentEntitiesItem = i;
                }
              }
            "
          >
            <img src="../../assets/icon/other/txt.png" alt="" />
          </div>
          <div
            :class="props.name == 'Entities' || props.name == 'Response' ? 'txt txt-pointer' : 'txt'"
            @click="
              () => {
                if (props.name == 'Entities' || props.name == 'Response') {
                  currentEntitiesItem = i;
                }
              }
            "
          >
            {{ i.mainsent }}
          </div>
          <div class="delete-icon icon" @click="reGenerate(i)">
            <img src="../../assets/icon/other/reload.png" alt="" />
          </div>
          <div
            :class="
              i.allAlter ? 'delete-icon icon low-opacity' : 'delete-icon icon'
            "
            @click="getSingleAlternative(i)"
          >
            <img src="../../assets/icon/other/alter.png" alt="" />
          </div>
          <div
            :class="
              i.allAlter ? 'delete-icon icon active-bg' : 'delete-icon icon'
            "
            @click="changesingleAllAlternative(i)"
          >
            <img src="../../assets/icon/other/Group 5.png" alt="" />
          </div>
          <div class="delete-icon icon" @click="delete_main_item(i)">
            <img src="../../assets/icon/other/delete.png" alt="" />
          </div>
        </div>
      </div>

      <div
        class="blank-box"
        v-if="
          !info.entitiesState.fetching &&
          info.entitiesState.listOfItems.length == 0
        "
      >
        <div class="icon">
          <img src="../../assets/icon/other/box.png" alt="" />
        </div>
        <div class="txt">Not Found</div>
      </div>
      <div class="loading-screen" v-if="info.entitiesState.fetching">
        <div class="m">
          <LoadingRequestView />
        </div>
      </div>
    </div>
    <div class="item">






      <AltercontainerView :of="props.of"/>







      <RebuildsentcontainerView :of="props.of"/>



















    </div>
  </div>
</template>
<style lang="css" src="./style.css"></style>
