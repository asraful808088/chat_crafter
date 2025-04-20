<script setup>
import { onMounted, ref, watch } from "vue";
import TextstoreitemView from "../TextstoreitemView/TextstoreitemView.vue";
// import updateAlternative from "~/network/entities/updateAlternative";
// import s from '~/'
import getAlternativeList from "~/network/add_alternative/getalternative";
import addEntitiesItem from "~/network/add_entities/update";
import updateAlternative from "~/network/changeAlternativeQ/changeAlternative";
import geteEntitiesList from "~/network/entities/get";
import AnimationdiglogboxView from "../Animation_diglog_box/AnimationdiglogboxView.vue";
import updateEntitiesItem from "~/network/updateEntites/update";





function getUniqueArray(arr) {
  const uniqueMap = new Map();
  arr.forEach((item) => uniqueMap.set(item.i, item));
  return Array.from(uniqueMap.values());
}

const props = defineProps({
  items: {
    type: Array,
    default:[],
  },
  chunkSize: {
    type: Number,
    default: 200,
  },
  onRegenerate: {
    type: Function,
    require:false
  },
  onDelete: {
    type: Function,
    require:false
  },
});

const items = ref([]);
const visibleItems = ref([]);
const loading = ref(false);
const dialogInfo = ref(null);
const targetEntitiesIndex = ref(null)

async function loadNextChunk() {
  if (loading.value) return;

  loading.value = true;
  const nextIndex = visibleItems.value.length;
  const nextChunk = items.value.slice(nextIndex, nextIndex + props.chunkSize);

  await new Promise((resolve) => setTimeout(resolve, 20));
  visibleItems.value.push(...nextChunk);
  loading.value = false;
}

function handleScroll(e) {
  const { scrollTop, scrollHeight, clientHeight } = e.target;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    loadNextChunk();
  }
}

function initializeItems() {
  items.value = props.items;
  visibleItems.value = [];
  loadNextChunk();
}

onMounted(() => {
  initializeItems();
});

watch(
  () => props.items,
  () => {
    initializeItems();
  }
);

function changesingleAllAlternative(i) {
  updateAlternative(
    {
      of: "intents",
      change: "allAlter",
      currectStatus: !i.allAlter,
      sent: i.mainsent,
      item: "bye",
    },
    (res, err) => {
      if (err) {
        return;
      }
      if (res?.items) {
        const newVisibleItems = visibleItems.value.map((item) => {
          if (item.mainsent === i.mainsent) {
            return { ...item, allAlter: !i.allAlter };
          }
          return item;
        });
        visibleItems.value = newVisibleItems;
      }
    }
  );
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

const loadSyc = ref(false);
const wordMap = ref({});
const listOfAlterWords = ref([]);
const entitiesActiveItem = ref(null);
const hoverIndex = ref(-1);
const selectIndex = ref(-1);
const list_of_entities_items = ref([]);
const textInput = ref("");

function injectEntitiesItem(id) {
  list_of_entities_items.value = [];
  geteEntitiesList("intents", id, (res, err) => {
    if (res?.entities) {
      list_of_entities_items.value = res.entities;
    }
  });
}

function addEntities() {
  if (!textInput.value) {
    return;
  }

  let b_val = `B-${textInput.value.toUpperCase()}`;
  let j_val = `J-${textInput.value.toUpperCase()}`;

  addEntitiesItem(
    {
      item: "bye",
      items: getUniqueArray([
        { i: b_val },
        { i: j_val },
        ...list_of_entities_items.value,
      ]),
      of: "intents",
    },
    (res, err) => {
      if (res) {
        list_of_entities_items.value = res.items;
      }
    }
  );

  textInput.value = "";
}
function activeDialog(i, sent) {
  dialogInfo.value = {};
  if (sent) {
    dialogInfo.value["sentence"] = sent;
  }

  dialogInfo.value["type"] = "synonyms";
  listOfAlterWords.value = i?.alter;
  getAlternativeList(
    {
      of: "intents",
      item: "bye",
    },
    (res, err) => {
      if (res.data) {
        wordMap.value = res.data;
        console.log(res.data);
        loadSyc.value = true;
      } else {
      }
    }
  );
}

function deleteEntitiesItem(nameObj) {
  let item1 = nameObj.i;
  let item2 = nameObj.i.replace("B-", "J-");
  list_of_entities_items.value = list_of_entities_items.value.filter(
    (element) => !(element.i == item1 || element.i == item2)
  );
  addEntitiesItem(
    {
      item: "bye",
      items: list_of_entities_items.value,
      of: "intents",
    },
    (res, err) => {
      if (res.items) {
      }
    }
  );
}

function changeAlterWordAddStatus(item) {
  onChange(
    item,
    dialogInfo.value["sentence"],
    listOfAlterWords.value.includes(item)
  );
}

function onChange(i, sent, remove = false) {
  updateAlternative(
    {
      of: "intents",
      change: remove ? "removeAlter" : "addAlter",
      sent: sent,
      add: i,
      item: "bye",
    },
    (res, err) => {
      if (!err) {
        if (res.items) {
          if (listOfAlterWords.value.includes(i)) {
            listOfAlterWords.value = listOfAlterWords.value.filter(
              (element) => element != i
            );
          } else {
            listOfAlterWords.value = [...listOfAlterWords.value, i];
          }
        }
      }
    }
  );
}


function applyModifyEntities(i){
  if (targetEntitiesIndex.value != null) {
      const sentItem  = dialogInfo.value.info
      sentItem["mapword"][targetEntitiesIndex.value] = i.i
     
      updateEntities(sentItem)
  }
}


















function updateEntities(sentItem) {
  updateEntitiesItem(
    {
      item: "bye",
      update: sentItem,
      of: "intents",
    },
    (res, err) => {
      if (res.items) {
        dialogInfo.value.info = sentItem
      items.value =  items.value.map((item) => {
        if (item.mainsent === sentItem.mainsent) {
          return { ...sentItem };
        }
        return item;
      });
      visibleItems.value =  visibleItems.value.map((item) => {
        if (item.mainsent === sentItem.mainsent) {
          return { ...sentItem };
        }
        return item;
      });
      }
    }
  );
}


import reCreateItem from "~/network/reCreate/reCreate";
function reGenerate(i) {
  reCreateItem(
    {
      of: "intents",
      sent: i ? i.mainsent : null,
      item: "bye",
    },
    (res, err) => {
      if (!err) {
        if (res.items) {
          
          if (props.onRegenerate) {
            props.onRegenerate(res.items)
            
          }
        }
      }
    }
  );
}



import deleteMainItem from "~/network/deleteTextItem/deleteItem";
function delete_main_item(i) {
  deleteMainItem(
    {
      sent: i.mainsent,
      of: 'intents',
      item: "bye",
    },
    (res, err) => {
      if (!err) {
        items.value = res.items
        visibleItems.value = [];
        loadNextChunk();
      }
    }
  );
}


</script>

<template>
  
  <AnimationdiglogboxView
    :auto-down="dialogInfo"
    @close="
      () => {
        loadSyc = false;
        dialogInfo = null;
      }
    "
  >
    <div class="list-item-dialog-0009099" v-if="dialogInfo?.type == 'synonyms'">
      <h2 v-if="dialogInfo['type'] == 'synonyms'">Synonyms-Words</h2>
      <div class="list-boxs" v-if="loadSyc && dialogInfo['type'] == 'synonyms'">
        <div
          class="syn-item"
          v-if="loadSyc"
          v-for="(item, index) in Object.keys(wordMap)"
          :key="index"
        >
          <div class="icon">
            <img src="../../assets/icon/other/Group 5.png" alt="" />
          </div>
          <div class="txt">{{ item }}</div>
          <div class="icon">
            <div
              class="circle"
              @click="
                () => {
                  changeAlterWordAddStatus(item);
                }
              "
            >
              <div class="ball" v-if="listOfAlterWords.includes(item)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="list-item-dialog-0009088" v-if="dialogInfo?.type == 'entites'">
      <h2>Words & Entities</h2>
      <div class="text-box">
        <div class="txt-display">
          <div class="txt-items">
            <span
              :class="hoverIndex == n ? ' indicator' : ''"
              v-for="(i, n) in dialogInfo?.info?.wordlist"
              @mouseover="
                () => {
                  hoverIndex = n;
                }
              "
            >
              {{ `${i} ` }}
            </span>
          </div>
          <div class="word-item-box" v-if="!dialogInfo.gen">
            <div class="head">Entities List</div>
            <div class="input-box">
              <input
                type="text"
                name=""
                id=""
                placeholder="item-name"
                v-model="textInput"
              />
              <div
                class="button"
                @click="
                  () => {
                    addEntities();
                  }
                "
              >
                Add
              </div>
            </div>
            <div class="entities-list-box" >
              <div class="entities-list-box-s-item">
                <div class="icon">
                  <img src="../../assets/icon/other/Group 300.png" alt="" />
                </div>
                <div class="txt"  @click="applyModifyEntities({i:'O'})" >--O</div>
              </div>

              <div
                class="entities-list-box-s-item"
                
                v-for="(i, n) in list_of_entities_items"
              >
                <div class="icon">
                  <img src="../../assets/icon/other/Group 300.png" alt="" />
                </div>
                <div class="txt" @click="applyModifyEntities(i)" >{{ i?.i }}</div>
                <div
                  class="icon del"
                  @click="
                    () => {
                      deleteEntitiesItem(i);
                    }
                  "
                >
                  <img src="../../assets/icon/other/delete.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="entities-box">
          <div class="heads">Entities List</div>
          <div class="map-item">
            <div
           
              :class="
                selectIndex == index
                  ? 'map-i green-indicator'
                  : hoverIndex == index
                    ? 'map-i indicator'
                    : 'map-i'
              "
              v-for="(item, index) in dialogInfo?.info?.mapword"
              :key="index"
              @click="
                () => {
                  if (selectIndex == index) {
                    selectIndex = -1;
                    targetEntitiesIndex = null
                  } else {
                    selectIndex = index;
                    targetEntitiesIndex = index
                  }
                }
              "
              @mouseover="
                () => {
                  hoverIndex = index;
                }
              "
            >
              ({{ dialogInfo?.info?.wordlist[index] }} &rArr; {{ item }})
            </div>
          </div>
        </div>
      </div>
    </div>
  </AnimationdiglogboxView>
  <div class="list-of-script-item-container-000011" @scroll="handleScroll">
    <TextstoreitemView
      v-for="item in visibleItems"
      :key="item.id"
      :st="item.mainsent??item.gen"
      :allAlter="item.allAlter"
      :hide-unbutton="item.gen"
      @update-alternative="
        () => {
          changesingleAllAlternative(item);
        }
      "
      @entities-edit="
        () => {
          dialogInfo = {};
          dialogInfo['type'] = 'entites';
          
          if (item.gen) {
            dialogInfo['gen'] = true 
             item.wordlist = item.gen.split(' ');
            item.mapword = item.map_sent;
            

          }
          dialogInfo['info'] = item;

          injectEntitiesItem('bye');
        }
      "
      @active-alternative="
        () => {
          if (!item.allAlter) {
            activeDialog(item, item.mainsent);
          }
        }
      "
      @generate="()=>{
        reGenerate(item)
      }"
      @delete="()=>{
        if (item.gen) {
          if (props.onDelete) {
          props.onDelete(item);
        }
        }else{
          delete_main_item(item)
        }
        
      }"
    />

    <div v-if="loading" class="loading">Loading more...</div>
  </div>
</template>

<style src="./style.css"></style>
