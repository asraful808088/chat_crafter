<script setup>
import { PermissionboxView } from "#components";
import RequestView from "@/components/loading/RequestView/index.vue";
import { onMounted, ref } from "vue";
import createBot from "~/network/create_bot/create_bot";
import deleteBot from "~/network/delete_bot/deleteBot";
import getBotList from "~/network/get_bot_list/getBotList";
import getebotStatus from "~/network/get_bot_status/get";
import { useBotbuilderStore } from "~/state/state";

const info = useBotbuilderStore();
const inputTxt = ref("");
const clickable = ref(true);
const deleteIndex = ref(null);
const digloginfo = ref(null);
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
    require: false,
  },
  onClose: {
    type: Function,
    require: false,
  },
});
onMounted(() => {
  if (info.profile?.fetching) {
    // setTimeout(() => {

      getBotList((res, err) => {
        if (res) {
          info.initProfilesItems(res.bot_list);
        } else {
          info.initProfilesItems([]);
        }
      });
      getebotStatus((res, err) => {
        if (res) {
          info.finishActiveProcessing(res.item);
        }
      });


    // }, 2000);
  }
});
function activeProfile(profileinfo) {
  info.readyActiveProcessing();
  setTimeout(() => {
    props.onClose();
    setTimeout(() => {
      info.finishActiveProcessing(profileinfo);
    }, 1000);
  }, 2000);
}
/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
function onYes() {
  deleteBotDoc(digloginfo.value.info, digloginfo.value.index);
  digloginfo.value = null;
}
function onNo() {
  digloginfo.value = null;
}

function onClose() {
  digloginfo.value = null;
}

function deleteBotDoc(botinfo, index) {
  if (deleteIndex.value != null) {
    return;
  }
  deleteIndex.value = index;
  setTimeout(() => {
    deleteBot(botinfo.name, (res, err) => {
      deleteIndex.value = null;

      if (err) {
        info.initProfilesItems([]);
        return;
      }
      if (res.bot_list) {
        info.initProfilesItems(res.bot_list);
      } else {
        info.initProfilesItems([]);
      }
    });
  }, 2000);
}

function deletePanding(info, index) {
  digloginfo.value = { info, index };
}
function createBotDoc() {
  if (!clickable.value) {
    return;
  }
  if (!inputTxt.value) {
    return;
  }
  const findname = info.profile?.listOfItems.find(
    (element) => element.name == inputTxt.value
  );
  if (findname) {
    const items_of = info.profile?.listOfItems.filter(
      (element) => element.name == inputTxt.value
    );
    let temp_L = items_of.length;
    while (true) {
      const findname = info.profile?.listOfItems.find(
        (element) => element.name == `${inputTxt.value}(${temp_L + 1})`
      );
      if (findname) {
        temp_L++;
        continue;
      } else {
        inputTxt.value = `${inputTxt.value}(${temp_L + 1})`;
        break;
      }
    }
  }

  clickable.value = false;
  createBot(inputTxt.value, (res, err) => {
    inputTxt.value = "";
    clickable.value = true;
    if (res) {
      info.initProfilesItems(res.bot_list);
    } else {
      info.initProfilesItems([]);
    }
  });
}
</script>
<template>
  <div class="botselector" v-if="props.show">
    <div class="item">
      <div class="close-line">
        <div class="cross-icon" @click="props.onClose">
          <img src="../../assets/icon/other/backbutton.png" alt="" />
        </div>
      </div>
      <div class="icon-logo">
        <img src="../../assets/icon/other/bot.png" alt="" />
      </div>
      <div class="text">BOT-ITEMS</div>
    </div>
    <div class="item">
      <RequestView
        v-if="info.profile?.fetching || info.profile?.activeProfileProcessing"
      />
      <div
        class="item-box"
        v-if="
          !(info.profile?.fetching || info.profile?.activeProfileProcessing)
        "
      >
        <div class="input-box">
          <input
            type="text"
            name=""
            id=""
            placeholder="Bot-name"
            v-model="inputTxt"
          />
          <div class="button" role="button" @click="createBotDoc">Create</div>
        </div>

        <div class="list-box" v-if="info.profile?.listOfItems.length != 0">
          <div
            :class="
              index == deleteIndex ? 'list-s-item lowopacity' : 'list-s-item'
            "
            v-for="(item, index) in info.profile?.listOfItems"
            :key="index"
          >
            <div class="icon" @click="activeProfile(item)">
              <img src="../../assets/icon/other/bot.png" alt="" />
            </div>
            <div class="txt" @click="activeProfile(item)">{{ item.name }}</div>
            <div class="icon">
              <img
                src="../../assets/icon/other/delete.png"
                alt=""
                @click="deletePanding(item, index)"
              />
            </div>
          </div>
        </div>

        <div class="empty" v-if="info.profile?.listOfItems.length == 0">
          <div class="icon">
            <img src="../../assets/icon/other/box.png" alt="" />
          </div>
          <div class="txt">Empty</div>
        </div>
      </div>
    </div>
  </div>
  <PermissionboxView
    @yes="onYes"
    @no="onNo"
    @close="onClose"
    :show="digloginfo != null"
  />
</template>
<style lang="css" src="./style.css"></style>
