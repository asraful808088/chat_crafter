<script setup>
import { useRoute } from "#app";
import { onMounted, ref } from "vue";
import PatternboxView from "~/components/PatternboxView/PatternboxView.vue";
import getePatternSecqunce from "~/network/get_pattern_secunce/get.";
import getSynItem from "~/network/get_syn/scripts";
import getOneSynItem from "~/network/getone_syn/get";
import patternBuild from "~/network/patternBuild/build";
import updateCurrentSynItem from "~/network/update_current_syn/update";
import updatePatternItem from "~/network/updatePatternItem/update";
import updateSyn from "~/network/updateSyn/syn";
const route = useRoute();
const id = route.params.id;
const listOfItems = ref([]);
const divDyComma = ref(false);
const textChunk = ref("");
const activeSyc = ref();
const inputtxt = ref("");
const patternSecounce = ref([]);

function addItems() {
  if (!textChunk.value) {
    return;
  }
  if (divDyComma.value) {
    const filterItems = textChunk.value
      .trim()
      .split(",")
      .filter((ele) => !(ele == null || ele == "" || ele == " "));
    let tempList = [];
    for (const element of filterItems) {
      tempList = [
        {
          main_word: element,
        },
        ...tempList,
      ];
    }
    tempList = tempList.filter((element, index) => {
      const findi = listOfItems.value.find(
        (element2) => element2.main_word == element.main_word
      );
      if (findi) {
        return false;
      }
      return true;
    });
    listOfItems.value = [...tempList, ...listOfItems.value];
    updateSyn({ item: id, list: listOfItems.value, add: tempList }, (res) => {
      if (res.items) {
        listOfItems.value = res.items;
      }
    });
  } else {
    const find = listOfItems.value.find(
      (element) => element.main_word == textChunk.value
    );
    if (!find) {
      listOfItems.value = [
        {
          main_word: textChunk.value,
        },
        ...listOfItems.value,
      ];
      updateSyn(
        {
          item: id,
          list: listOfItems.value,
          add: [
            {
              main_word: textChunk.value,
            },
          ],
        },
        (res) => {
          if (res.items) {
            listOfItems.value = res.items;
          }
        }
      );
    }
  }
  textChunk.value = "";
}

function deleteItem(i) {
  listOfItems.value = listOfItems.value.filter(
    (element) => element.main_word != i
  );
  updateSyn(
    {
      item: id,
      list: listOfItems.value,
      remove: [
        {
          main_word: i,
        },
      ],
    },
    (res) => {
      if (res.items) {
        listOfItems.value = res.items;
      }
    }
  );
}
onMounted(() => {
  getSynItem(
    {
      of: "synonyms",
      id: id,
    },
    (res) => {
      if (res.items) {
        listOfItems.value = res.items;
      }
    }
  );
  getePatternSecqunce(id, (res) => {
    if (res.item) {
      patternSecounce.value = res.item;
    }
  });
});

function getOneItemOfItem(i) {
  getOneSynItem(
    {
      word: i,
      id: id,
    },
    (res) => {
      if (res.item) {
        activeSyc.value = res.item;
      }
    }
  );
}

function updateCurrentAlter(list = []) {
  if (!activeSyc.value) {
    return;
  }
  updateCurrentSynItem(
    { ...activeSyc.value, generate: list, id: id },
    (res) => {
      if (res.items) {
        activeSyc.value.generate = res.items;
      }
    }
  );
}
function removeCurrentalterItem(i) {
  if (!activeSyc.value) {
    return;
  }

  updateCurrentAlter(
    activeSyc.value?.generate.filter((element) => element != i)
  );
}
function addItem() {
  if (!(activeSyc.value && inputtxt.value)) {
    return;
  }
  updateCurrentAlter([...activeSyc.value?.generate, inputtxt.value]);
  inputtxt.value = "";
}

function addPatternSecounce() {
  patternSecounce.value = [
    ...patternSecounce.value,
    {
      id: Date.now(),
      randomly_add: false,
      word_list: [],
      latters: "qwertyuiopasdfghjklzxcvbnm",
      useWord: false,
      length: 7,
      useList: true,
    },
  ];
  updatePatternItem(
    {
      item: id,
      items: patternSecounce.value,
    },
    (res) => {
      if (res.items) {
        patternSecounce.value = res.items;
      }
    }
  );
}

function updatePatternItems(e) {
  patternSecounce.value = patternSecounce.value.map((element, index) => {
    if (element.id == e.id) {
      return e;
    }
    return element;
  });
  updatePatternItem(
    {
      item: id,
      items: patternSecounce.value,
    },
    (res) => {
      if (res.items) {
        patternSecounce.value = res.items;
      }
    }
  );
}

function patternBuilder() {
  if (!activeSyc.value) {
    return;
  }

  patternBuild(
    {
      item: id,
      ...activeSyc.value,
      patternList: patternSecounce.value,
      count: 100,
    },
    (res) => {
      if (res.items) {
        activeSyc.value.generate = res.items;
      }
    }
  );
}

function deleteAllAlterItems() {
  if (!activeSyc.value) {
    return;
  }
  updateCurrentSynItem({ ...activeSyc.value, generate: [], id: id }, (res) => {
    if (res.items) {
      activeSyc.value.generate = res.items;
    }
  });
}
function deletePatternSequnce(i) {
  patternSecounce.value = patternSecounce.value.filter(
    (element, index) => element.id != i.id
  );
  updatePatternItem(
    {
      item: id,
      items: patternSecounce.value,
    },
    (res) => {
      if (res.items) {
        patternSecounce.value = res.items;
      }
    }
  );
}
</script>
<template>
  <div class="syn-main">
    <div class="item">
      <div class="input-box">
        <div class="input">
          <textarea
            name=""
            id=""
            placeholder="text"
            v-model="textChunk"
          ></textarea>
        </div>
        <div class="option-box">
          <div
            class="option-button"
            v-if="divDyComma"
            @click="
              () => {
                divDyComma = !divDyComma;
              }
            "
          >
            Divided By ","
          </div>
          <div
            class="option-button"
            v-if="!divDyComma"
            @click="
              () => {
                divDyComma = !divDyComma;
              }
            "
          >
            Undivided
          </div>
          <div class="option-button add-button" @click="addItems">
            <div class="icon">
              <img src="../../assets/icon/other/next.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <!--  -->
      <!--  -->
      <!--  -->
      <!--  -->

      <div class="word-item-box">
        <div class="word-item" v-for="(i, n) in listOfItems">
          <div class="icon" @click="getOneItemOfItem(i.main_word)">
            <img src="../../assets/icon/nav/synonyms.png" alt="" />
          </div>
          <div class="txt" @click="getOneItemOfItem(i.main_word)">
            {{ i.main_word }}
          </div>
          <div class="icon" v-if="activeSyc?.main_word == i?.main_word">
            <img
              src="../../assets/icon/other/orange-square-svgrepo-com.png"
              alt=""
            />
          </div>
          <div class="icon" @click="deleteItem(i.main_word)">
            <img src="../../assets/icon/other/delete.png" alt="" />
          </div>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="sub-item">
        <div class="sub-head">
          <h3>Alternative</h3>
          <div class="icon" v-if="activeSyc" @click="deleteAllAlterItems">
            <img src="../../assets/icon/other/delete-all.png" alt="" />
          </div>
        </div>
        <div class="sub-add-box">
          <input
            type="text"
            name=""
            id=""
            placeholder="alternative"
            v-model="inputtxt"
          />
          <div class="button" @click="addItem">add</div>
        </div>

        <div class="list-items-alter">
          <div
            class="list-items-alter-item"
            v-for="(i, n) in activeSyc?.generate"
          >
            <div class="icon">
              <img src="../../assets/icon/nav/synonym.png" alt="" />
            </div>
            <div class="txt">{{ i }}</div>

            <div class="icon" @click="removeCurrentalterItem(i)">
              <img src="../../assets/icon/other/delete.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div class="sub-item">
        <div class="sub-head">
          <h3>Generative</h3>
          <div class="icon" v-if="activeSyc" @click="patternBuilder">
            <img src="../../assets/icon/other/pngegg.png" alt="" />
          </div>
        </div>
        <div class="sub-add-box">
          <div class="add-buttonx" @click="addPatternSecounce">
            <div class="icon">
              <img src="../../assets/icon/other/generative.png" alt="" />
            </div>
            <div class="txt">Add-Pattern</div>
          </div>
        </div>
        <div class="generate-pattern-box">
          <PatternboxView
            v-for="(i, c) in patternSecounce"
            :info="i"
            @update="updatePatternItems"
            @delete="deletePatternSequnce(i)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" src="./style.css"></style>
