<script setup>
import { useRoute } from "#app";
import { onMounted, ref } from "vue";
import deleteGenItem from "~/network/delete_gen/delete";
import getAllReGenerate from "~/network/getRegenerate";
import reCreateItem from "~/network/reCreate/reCreate";
import useEntitiesFuncStore from "~/state/entities/storage";
import useIntentesStore from "~/state/intentes/storage";
import useRespopnseStore from "~/state/response/storage";
import getGeneratedItems from "~/network/fatchingRenerate/getGenerate";
const route = useRoute();
const id = route.params.id;
const generativeItems = ref([]);
const listBox = ref(null);
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

if (props.of == "intents") {
  info = useIntentesStore();
} else if (props.of == "response") {
  info = useRespopnseStore();
} else {
  info = useEntitiesFuncStore();
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
        info.initAlterSentItem([]);
        setTimeout(() => {
          info.initAlterSentItem(res.items);
        }, 2);
      }
    }
  );
}
onMounted(() => {
  setTimeout(() => {
    getAllReGenerate({ of: props.of ?? "entities", item: id }, (req, err) => {
      if (!err) {
        if (req.items) {
          info.initAlterSentItem(req.items.slice(1, 400));

            

        }
      }
    });
  }, 2000);
});

import { RecycleScroller } from "vue3-virtual-scroller";

const items = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  text: `Item ${i + 1}`,
}));

function fetching(e) {
  getGeneratedItems({
    of:props.of,
    id:id,
    ...e
  },(res)=>{
    if (res.item) {
      
      info.initAlterSentItem([]);
        setTimeout(() => {
          info.initAlterSentItem(res.item);
          
        }, 2);
    }
  })
}

</script>
<template>
  <div class="part">
    <h3 class="sub-header">
      <div>Rebuild Sentence by Alternative Word</div>

      <div class="y-icon" @click="reGenerate">
        <img src="../../../assets/icon/other/reload.png" alt="" />
      </div>
    </h3>

    <div
      class="alter-list-box"
      v-if="
        !info.entitiesState.list_of_alter_sent_panding &&
        info.entitiesState.list_of_alter_sent.length != 0
      "
      ref="listBox"
      @scroll="
        () => {
          const box = listBox;
          if (!box) return;
          const scrollTop = box.scrollTop;
          const scrollHeight = box.scrollHeight;
          const clientHeight = box.clientHeight;
          if (scrollTop === 0) {
            fetching({
              to:'prev',
              item_id:generativeItems[0].id
            })
          }
          if (scrollTop + clientHeight >= scrollHeight - 10) {
            fetching({
              to:'next',
              item_id:generativeItems[generativeItems.length -1].id
            })
          }
        }
      "
    >
      <RecycleScroller
        :items="info.entitiesState.list_of_alter_sent"
        :item-size="1"
        key-field="id"
        v-slot="{ item, index }"
       
      >
        <div class="icon-text-with-delete">
          <div class="icon">
            <img src="../../../assets/icon/other/Group 3.png" alt="" />
          </div>
          <div class="txt">{{ item?.gen }} asd</div>
          <div class="icon delete" @click="delete_gen(item)" >
            <img src="../../../assets/icon/other/delete.png" alt="" />
          </div>
        </div>
      </RecycleScroller>
    </div>

    <div
      class="blank-box"
      v-if="
        !info.entitiesState.list_of_alter_sent_panding &&
        info.entitiesState.list_of_alter_sent.length == 0
      "
    >
      <div class="icon">
        <img src="../../../assets/icon/other/box.png" alt="" />
      </div>
      <div class="txt">Not Found</div>
    </div>
    <div
      class="loading-screen"
      v-if="info.entitiesState.list_of_alter_sent_panding"
    >
      <div class="l">
        <LoadingRequestView />
      </div>
    </div>
  </div>
</template>

<style lang="css" src="./style.css"></style>
