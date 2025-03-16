<script setup>
import { onMounted, ref } from "vue";
import ListitemView from "~/components/ListitemView/ListitemView.vue";
import NexttoastView from "~/components/NextItemToast/NexttoastView.vue";
import ScriptsboxView from "~/components/ScriptsboxView/ScriptsboxView.vue";
import getScriptsItem from "~/network/get_scripts/scripts";
import updateScripts from "~/network/updateScripts/updateScripts";
import { useRoute } from "#app";
const route = useRoute();
const id = route.params.id;
function createBlogObj({
  type = "init",
  target = "Intents",
  store_id = [],
  serial_break_value = false,
  target_id = null,
  condition = null,
  condition_type = null,
  nolvl = 0
}) {
  return {
    id: Date.now(),
    type: type,
    target: target,
    list_of_response: [],
    list_of_store: [],
    store_id: store_id,
    target_id: target_id,
    condition_type:condition_type,
    condition: condition,
    nolvl:nolvl,
    list_of_next_stap: [
      {
        type: "next_add",
        label: "next-intents",
      },
      {
        type: "backward_add",
        label: "backwards-add",
      },
      {
        type: "serial_break_add",
        val: serial_break_value,
        label: "serial-break",
      },
      {
        type: "serial_break_err_add",
        label: "serial break fallout",
      },
      {
        type: "add_condition",
        label: "add-condition",
      },
    ],
  };
}
const showtoast = ref(null);
const activecurrentItem = ref(null);
const listofStartwith = ref([]);
const responseConvCurrextIndex = ref(0);

function addNext(type, target) {
  const find = listofStartwith.value.find(
    (element) => element.target == target
  );
  if (!find) {
    listofStartwith.value = [
      ...listofStartwith.value,
      createBlogObj({
        type: type,
        target: target,
      }),
    ];
    updateScripts({ list: listofStartwith.value,item:id  }, (res) => {
      if (res.items) {
        listofStartwith.value = res.items;
      }
    });
  }
}
function openToast() {
  showtoast.value = {
    type: "init",
    of: "intents",
  };
}

function deleteStartWithItem(ID) {
  listofStartwith.value = listofStartwith.value.filter((ele) => ele.id != ID);
  updateScripts({ list: listofStartwith.value,item:id }, (res) => {
    if (res.items) {
      listofStartwith.value = res.items;
    }
  });
}
function activeItem(i) {
  activecurrentItem.value = i;
}
onMounted(() => {
  getScriptsItem(
    {
      of: "scripts",
      id: id,
    },
    (res) => {
      if (res.items) {
        listofStartwith.value = res.items;
      }
    }
  );
});

function updateScriptsList(update) {
  const newUpdateItems = listofStartwith?.value?.map((element) => {
    if (element.id == update.id) {
      return update;
    }
    return element;
  });
  updateScripts({ list: newUpdateItems,item:id  }, (res) => {
    if (res.items) {
      listofStartwith.value = res.items;
    }
  });
  
}
</script>
<template>
  <NexttoastView
    v-if="showtoast?.type"
    :of="showtoast?.of"
    @close="
      () => {
        showtoast = null;
      }
    "
    :type="showtoast.type"
    @add="(element) => addNext(element.type, element.target, element.id)"
  />
  <div class="script-main">
    <div class="list-box">
      <h2>
        <span>Start-With</span>
        <span @click="openToast">+</span>
      </h2>
      <div class="list-box-2">
        <ListitemView
          v-for="(i, n) in listofStartwith"
          :header-name="i?.target"
          @delete="() => deleteStartWithItem(i?.id)"
          @click="activeItem(i)"
        />
      </div>
    </div>
    <div class="script-box">
      <h2>Chat-Scripts</h2>
      <div class="list-box-2">
        <ScriptsboxView
          v-if="activecurrentItem"
          :package="activecurrentItem"
          @update="updateScriptsList"
        />
      </div>
    </div>
    <div class="list-box">
      <h2>Short-Chunk</h2>
      <div class="list-box-2">
        <ListitemView v-for="(i, n) in [1, 1, 1]" :is-short="true" />
      </div>
    </div>
  </div>
</template>

<style src="./style.css" lang="css"></style>
