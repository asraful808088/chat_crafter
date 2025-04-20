<script setup>
import { useRoute } from "#app";
import { TextstoretxtitemView } from "#components";
import { onMounted, ref } from "vue";
import addalternative from "~/network/add_alternative/addalternative";
import addAlternatives from "~/network/add_alternative/addAlternativeWords";
import deleteChunk from "~/network/add_alternative/delete_chunk";
import getAlternativeList from "~/network/add_alternative/getalternative";
import geteEntitiesList from "~/network/entities/get";
import getAllReGenerate from "~/network/getRegenerate";
import AnimationdiglogboxView from "../Animation_diglog_box/AnimationdiglogboxView.vue";
const listItems = ref([]);
const safty = ref(false);
const multiline = ref(false);
const textInput = ref("");
const dialogInfo = ref(null);
const alternativeItemWord = ref({});
const route = useRoute();
const id = route.params.id;
const wordTextInput = ref("");
const partOfAlternativeWords = ref([]);
const regenerationSent = ref([]);
const listOFGenratedItems = ref([]);


import postEntities from "~/network/entities/post.";



function splitSentenceByPunctuation(sentence) {
  const sentSplit = sentence.split(" ");
  const enArr = new Array(sentSplit.length).fill("O");
  const mapIndex = sentSplit.map((element, index) => element);
  return [sentence, enArr, mapIndex];
}
function onChangeInput(value) {
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
    const findEn = listItems.value.find(
      (element2) => element.mainsent == element2.mainsent
    );
    if (findEn) {
      return false;
    }
    return true;
  });
  
  postEntities(
    { list: store, of: 'intents', item: 'bye' },
    (res, err) => {
      if (err) {
        return;
      }
      if (res.items) {
        console.log("!312312313")
        listItems.value =  res.items
      }
    }
  );
}






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
onMounted(() => {
  setTimeout(() => {
    geteEntitiesList(props.of ?? "intents", "bye", (res, err) => {
      if (res) {
        listItems.value = res.items;
      }
    });
  }, 1000);

  getAlternativeList(
    {
      of: "intents",
      item: "bye",
    },
    (res, err) => {
      alternativeItemWord.value = res.data;
    }
  );

  setTimeout(() => {
    getAllReGenerate({ of: "intents", item: "bye" }, (req, err) => {
      if (!err) {
        if (req?.items) {
          console.log("find");

          listOFGenratedItems.value = req.items;
          // console.log( req)
        }
      }
    });
  }, 1000);
});

function onTextHanfler(newItems) {
  if (!textInput.value) {
    return;
  }

  if (!multiline.value) {
    const textItems = textInput.value.split("\n");
    if (textItems.length > 1) {
      dialogInfo.value = {};
    } else {
      // dialogInfo.value = {}
    onChangeInput(textItems)

    }
  } else {
    onChangeInput([textInput.value])
  }
  textInput.value = "";
}
function addAlternativeWord(i) {
  if (!(i || wordTextInput.value.trim())) {
    return;
  }

  if (typeof i == "string") {
    addalternative(
      {
        name: i,
        of: "intents",
        item: "bye",
        syn: true,
      },
      (res, err) => {
        if (err) {
          return;
        }
        alternativeItemWord.value = res.data;
        wordTextInput.value = "";
        dialogInfo.value = null;
      }
    );
    return;
  }
  addalternative(
    {
      name: wordTextInput.value.trim(),
      of: "intents",
      item: "bye",
    },
    (res, err) => {
      if (err) {
        return;
      }
      alternativeItemWord.value = res.data;

      wordTextInput.value = "";
    }
  );
}

function deleteWordChunk(name) {
  deleteChunk(
    {
      name: name,
      of: "intents",
      item: "bye",
    },
    (res, err) => {
      if (err) {
        return;
      }
      alternativeItemWord.value = res.data;
    }
  );
}

const activeSynChanks = ref(null);

function addAlternativeWords() {
  if (!wordTextInput.value) {
    return;
  }

  if (!activeSynChanks.value) {
    return;
  }

  if (
    !(alternativeItemWord.value[activeSynChanks.value?.name] instanceof Array)
  ) {
    return;
  }

  addAlternatives(
    {
      name: activeSynChanks.value?.name,
      of: "intents",
      alternative: wordTextInput.value.trim(),
      item: "bye",
    },
    (res, err) => {
      if (err) {
        return;
      }
      activeSynChanks.value = {
        ...activeSynChanks.value,
        items: res.data[activeSynChanks.value?.name],
      };
      alternativeItemWord.value = res.data;
      wordTextInput.value = "";
    }
  );
}

import deleteAlterWords from "~/network/add_alternative/delete_word";
import getSelectItems from "~/network/get_intentes/get_intents";

function deletealternativeWord(word) {
  deleteAlterWords(
    {
      name: activeSynChanks.value?.name,
      of: "intents",
      alternative: word,
      item: "bye",
    },
    (res, err) => {
      if (err) {
        return;
      }
      if (res.data) {
        activeSynChanks.value = {
          ...activeSynChanks.value,
          items: res.data[activeSynChanks.value?.name],
        };
        alternativeItemWord.value = res.data;
      }
    }
  );
}
const listOFGlobleSyn = ref(null);
function getGlobleSyn() {
  getSelectItems({ of: "synonyms" }, (res, err) => {
    if (res.items) {
      setTimeout(() => {
        listOFGlobleSyn.value = res.items;
      }, 500);
    }
  });
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
          listOFGenratedItems.value = res.items;
        }
      }
    }
  );
}


import deleteGenItem from "~/network/delete_gen/delete";
function delete_gen(i) {
  deleteGenItem(
    {
      sent: i.sent,
      of: 'intents',
      gen: i.gen,
      item: "bye",
    },
    (res, err) => {
      if (!err) {
        listOFGenratedItems.value = res.items
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
        dialogInfo = null;
        listOFGlobleSyn = null;
      }
    "
  >
    <div class="dialogbox-text-store">
      <div class="dialogbox-text-store-txt-context-box">
        <h2>Synonyms</h2>
        <div class="list-box">
          <div class="list-box-item" v-for="(i, n) in listOFGlobleSyn">
            <div class="icon">
              <img src="../../assets/icon/nav/synonym.png" alt="" />
            </div>
            <div
              class="txt"
              @click="
                () => {
                  addAlternativeWord(i);
                }
              "
            >
              {{ i }}
            </div>
            <div class="icon"></div>
          </div>
        </div>
      </div>
    </div>
  </AnimationdiglogboxView>
  <div class="txt-store-box-00111">
    <div class="part">
      <h2>Response</h2>
      <div class="txt-box-0011">
        <div class="txt-input">
          <textarea
            name=""
            id=""
            placeholder="text"
            v-model="textInput"
          ></textarea>
        </div>
        <div class="button-options">
          <div class="button-options-part">
            <div
              class="send"
              @click="
                () => {
                  safty = !safty;
                }
              "
            >
              <img
                v-if="safty"
                src="../../assets/icon/other/Group 384.png"
                alt=""
              />
              <img
                v-if="!safty"
                src="../../assets/icon/other/Group 381.png"
                alt=""
              />
            </div>
            <div
              class="send"
              @click="
                () => {
                  multiline = !multiline;
                }
              "
            >
              <img
                v-if="multiline"
                src="../../assets/icon/other/Group 380.png"
                alt=""
              />
              <img
                v-if="!multiline"
                src="../../assets/icon/other/Group 383.png"
                alt=""
              />
            </div>
          </div>
          <div class="button-options-part">
            <div class="send" @click="onTextHanfler">
              <img src="../../assets/icon/other/Group 382.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div class="list-item-box">
        <div class="list-item-part">
          <div class="head">List</div>
          <TextstoretxtitemView
            :items="listItems"
            @regenerate="
              (item) => {
                listOFGenratedItems = item;
              }
            "
          />
        </div>
        <div class="list-item-part">
          <div class="head">
            <div
              @click="
                () => {
                  activeSynChanks = null;
                  wordTextInput = '';
                }
              "
            >
              Synonyms
              {{ activeSynChanks?.name ? `(${activeSynChanks?.name})` : "" }}
            </div>
            <div
              @click="
                () => {
                  dialogInfo = {};

                  getGlobleSyn();
                }
              "
            >
              import
            </div>
          </div>
          <div class="text-input-box">
            <input
              type="text"
              name=""
              v-model="wordTextInput"
              id=""
              placeholder="word"
            />
            <div
              class="button"
              @click="
                () => {
                  if (!activeSynChanks?.name) {
                    addAlternativeWord();
                  } else {
                    addAlternativeWords();
                  }
                }
              "
            >
              Add
            </div>
          </div>
          <div class="list-box">
            <div
              class="list-item"
              v-for="(i, n) in activeSynChanks?.items ??
              Object.keys(alternativeItemWord)"
            >
              <div class="icon">
                <img src="../../assets/icon/nav/synonyms.png" alt="" />
              </div>
              <div
                class="txt"
                @click="
                  () => {
                    if (
                      !activeSynChanks &&
                      alternativeItemWord[i] instanceof Array
                    ) {
                      activeSynChanks = {};
                      activeSynChanks['name'] = i;
                      activeSynChanks['items'] = alternativeItemWord[i];
                      wordTextInput = '';
                    }
                  }
                "
              >
                {{
                  !activeSynChanks?.items
                    ? alternativeItemWord[i] instanceof Array
                      ? `${i}`
                      : `(i) ${i}`
                    : `${i}`
                }}
              </div>

              <div
                class="icon"
                @click="
                  () => {
                    if (activeSynChanks) {
                      deletealternativeWord(i);
                    } else {
                      deleteWordChunk(i);
                    }
                  }
                "
              >
                <img src="../../assets/icon/other/delete.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="part">
      <h2>Properties</h2>
      <div class="info-box">
        <div class="info-item">
          <div class="icon">
            <img src="../../assets/icon/other/function.png" alt="" />
          </div>
          <div class="txt">asd</div>
        </div>
        <div class="info-item">
          <div class="icon">
            <img src="../../assets/icon/other/function.png" alt="" />
          </div>
          <div class="txt">asd</div>
        </div>
        <div class="info-item">
          <div class="icon">
            <img src="../../assets/icon/other/function.png" alt="" />
          </div>
          <div class="txt">asd</div>
        </div>
        <div class="info-item">
          <div class="icon">
            <img src="../../assets/icon/other/function.png" alt="" />
          </div>
          <div class="txt">asd</div>
        </div>
        <div class="info-item">
          <div class="icon">
            <img src="../../assets/icon/other/function.png" alt="" />
          </div>
          <div class="txt">asd</div>
        </div>
        <div class="info-item">
          <div class="icon">
            <img src="../../assets/icon/other/function.png" alt="" />
          </div>
          <div class="txt">asd</div>
        </div>
      </div>
      <div class="generate-con">
        <div class="head">
          <div>Items</div>
          <div
            @click="
              () => {
                reGenerate();
              }
            "
          >
            Generate
          </div>
        </div>
        <TextstoretxtitemView :items="listOFGenratedItems" @delete="(item)=>{
          delete_gen(item)
        }" />
      </div>
    </div>
  </div>
</template>
<style lang="css" src="./style.css"></style>
