<script setup>
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";

import { AnimationDiglogBoxAnimationdiglogboxView } from "#components";
import { EffectCoverflow } from "swiper/modules";
import { ref, watchEffect } from "vue";
import "vue-glide-js/dist/vue-glide.css";
import ScriptslistView from "~/components/ScriptslistView/ScriptslistView.vue";
import addconditionItem from "~/network/addCondition/post";
import getSelectItems from "~/network/get_intentes/get_intents";
import getConditionItems from "~/network/getConditions/get";

const modules = [EffectCoverflow, Pagination];

const props = defineProps({
  package: {
    type: Object,
    require: false,
  },
  onDelete: {
    type: Function,
    require: false,
  },
  list_store_id: {
    type: Array,
    require: false,
    default: [],
  },
  onUpdate: {
    type: Function,
    require: false,
  },
  indexlvl: {
    type: Number,
    require: false,
  },
});
const conv_info = ref();

const currentIndex = ref(0);
const nextConvCurrextIndex = ref(0);
const responseConvCurrextIndex = ref(0);
const selectorBoxInfo = ref(null);
const listOfSelecItems = ref(null);
const isActionsItemsHold = ref(false);
const intentsIndexItem = ref(0);
const conditionItems = ref(null);
const conditionType = ref(null);
const conditionObj = ref({});
const selfConditionObj = ref({});
const listOfPrivIdList = ref(null);

watchEffect(() => {
  if (props.package) {
    conv_info.value = {
      ...props.package,
      list_store_id: [...props.list_store_id],
      nolvl: props.indexlvl ?? 0,
    };
  }
});
watchEffect(() => {
  if (!props.package) {
    conv_info.value = createBlogObj({
      type: "init",
      target: Date.now().toString(),
      nolvl: props.indexlvl ?? 0,
    });
  }
});
function createBlogObj({
  type = "init",
  target = "Intents",
  store_id = [],
  serial_break_value = false,
  target_id = null,
  condition = null,
  condition_type = null,
  nolvl = 0,
}) {
  return {
    id: Date.now(),
    type: type,
    target: target,
    list_of_response: [],
    list_of_store: [],
    store_id: store_id,
    target_id: target_id,
    condition_type: condition_type,
    condition: condition,
    nolvl: nolvl,
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

function addNext(type, target, target_id, condition, condition_type) {
  if (
    conv_info.value.type == "init" &&
    condition &&
    condition_type &&
    "self_add_condition" == type
  ) {
    conv_info.value.condition = condition;
    conv_info.value.condition_type = condition_type;
    if (props.onUpdate) {
      addconditionItem(
        {
          consdition: condition,
          condition_type: condition_type,
          id: conv_info.value.id,
          target: target,
          nolvl: conv_info.value.nolvl,
        },
        (res) => {}
      );
      props.onUpdate(conv_info.value);
    }
    return;
  }
  if (type == "fallback") {
    currentIndex.value = 0;
  }
  if (type == "response") {
    const findObj = conv_info.value?.list_of_response?.find(
      (element) => element.target == target && element.type == type
    );
    if (findObj) {
      selectorBoxInfo.value = null;
      return;
    }
    conv_info.value = {
      ...conv_info.value,
      list_of_response: [
        ...conv_info.value?.list_of_response,
        {
          type: type,
          target: target,
        },
      ],
    };
    if (props.onUpdate) {
      props.onUpdate(conv_info.value);
    }
    selectorBoxInfo.value = null;

    return;
  }

  if (type == "actions") {
    const findObj = conv_info.value?.list_of_response?.find(
      (element) => element.target == target && element.type == type
    );
    if (findObj) {
      selectorBoxInfo.value = null;

      return;
    }
    conv_info.value = {
      ...conv_info.value,
      list_of_response: [
        ...conv_info.value?.list_of_response,
        {
          type: type,
          target: target,
        },
      ],
    };
    if (props.onUpdate) {
      props.onUpdate(conv_info.value);
    }
    selectorBoxInfo.value = null;
    return;
  }
  if (conv_info.value?.list_of_store) {
    const findCoditionWith = conv_info.value?.list_of_store.find(
      (element, index) => element?.condition
    );
    if (
      (findCoditionWith && condition) ||
      (condition && conv_info.value?.list_of_store.length == 0)
    ) {
      const filterCondition = conv_info.value?.list_of_store?.filter(
        (element) =>
          element?.condition == condition &&
          element?.condition_type == condition_type &&
          element?.target == target
      );

      if (filterCondition.length == 0) {
        const obj = createBlogObj({
          type: type,
          target: target,
          target_id: target_id,
          condition: condition,
          condition_type: condition_type,
          nolvl: conv_info.value.nolvl + 1,
        });

        addconditionItem(
          {
            consdition: condition,
            condition_type: condition_type,
            id: obj.id,
            target: target,
            nolvl: conv_info.value.nolvl + 1,
          },
          (res) => {}
        );
        conv_info.value = {
          ...conv_info.value,
          list_of_store: [...conv_info.value.list_of_store, obj],
        };
      }

      if (props.onUpdate) {
        props.onUpdate(conv_info.value);
      }
    } else if (!findCoditionWith && !condition) {
      const filterCondition = conv_info.value?.list_of_store?.filter(
        (element) => element?.target == target
      );

      if (filterCondition.length == 0) {
        conv_info.value = {
          ...conv_info.value,
          list_of_store: [
            ...conv_info.value.list_of_store,
            createBlogObj({
              type: type,
              target: target,
              target_id: target_id,
            }),
          ],
        };
      }
      if (props.onUpdate) {
        props.onUpdate(conv_info.value);
      }
    } else if (type == "fallback") {
      conv_info.value = {
        ...conv_info.value,
        list_of_store: [
          ...conv_info.value.list_of_store,
          createBlogObj({
            type: type,
            target: target,
            target_id: target_id,
          }),
        ],
      };
    }
  }

  selectorBoxInfo.value = null;
}

function getConditionBreakStatus() {
  if (conv_info.value) {
    const getObj = conv_info.value?.list_of_next_stap?.find(
      (element) => element?.type == "serial_break_add"
    );
    if (getObj) {
      return getObj?.val;
    }
  }
}

function getResposneTypeCount(type = "response") {
  if (conv_info.value) {
    const getList = conv_info.value?.list_of_response?.filter(
      (element) => element?.type == type
    );
    return getList.length;
  }
}
function getNextStap(type = null) {
  if (conv_info.value) {
    if (type != null) {
      const getList = conv_info.value?.list_of_store?.filter(
        (element) => element?.type == type
      );
      return getList.length;
    } else {
      return conv_info.value?.list_of_store.length;
    }
  }
}

function changeBreakeStatus() {
  if (conv_info.value) {
    const getnewObj = conv_info.value?.list_of_next_stap?.map((element) => {
      if (element?.type == "serial_break_add") {
        return {
          ...element,
          val: !element.val,
        };
      }
      return element;
    });
    conv_info.value.list_of_next_stap = getnewObj;
  }
  props.onUpdate(conv_info.value);
}

function getItems(i) {
  if (
    (selectorBoxInfo.value.type == "intents" && i?.type == "t_next") ||
    (selectorBoxInfo.value.type == "intents" && i?.type == "fallback")
  ) {
    getSelectItems(
      {
        of: selectorBoxInfo?.value.type,
      },
      (res, err) => {
        if (res.items) {
          listOfSelecItems.value = res.items;
          selectorBoxInfo.value = {
            ...selectorBoxInfo.value,
            intype: i.type,
          };
        }
      }
    );
  } else if (
    selectorBoxInfo.value.type == "response" &&
    i?.type == "response"
  ) {
    getSelectItems(
      {
        of: "response",
      },
      (res, err) => {
        if (res.items) {
          listOfSelecItems.value = res.items;
          selectorBoxInfo.value = {
            ...selectorBoxInfo.value,
            intype: i.type,
          };
        }
      }
    );
  } else if (
    selectorBoxInfo.value.type == "response" &&
    i?.type == "custom-actions"
  ) {
    getSelectItems(
      {
        of: "custom-actions",
      },
      (res, err) => {
        if (res.items) {
          isActionsItemsHold.value = true;
          listOfSelecItems.value = res.items;
          selectorBoxInfo.value = {
            ...selectorBoxInfo.value,
            intype: i.type,
          };
        }
      }
    );
  } else if (
    selectorBoxInfo.value.type == "intents" &&
    i?.type == "add_condition"
  ) {
    getConditionItems((res) => {
      if (res.items) {
        conditionItems.value = res.items;
        selectorBoxInfo.value = {
          ...selectorBoxInfo.value,
          forCondition: true,
        };
      }
    });
  } else if (
    selectorBoxInfo.value.type == "intents" &&
    i?.type == "t_forwards"
  ) {
    listOfPrivIdList.value = props.list_store_id;
  }
  if (i.itype == "self_condition" && i.type == "self_condition") {
    getConditionItems((res) => {
      if (res.items) {
        conditionItems.value = res.items;
        selectorBoxInfo.value = {
          ...selectorBoxInfo.value,
          intype: "self_condition",
        };
      }
    });
  }
}

function intentDroper(i) {
  if (conv_info.value && i.id) {
    const newIntens = conv_info.value?.list_of_store?.filter(
      (element, index) => element.id != i.id
    );
    conv_info.value.list_of_store = newIntens;
    if (props.onUpdate) {
      props.onUpdate(conv_info.value);
    }
  }
}

function deleteResponse(i) {
  conv_info.value = {
    ...conv_info.value,
    list_of_response: conv_info.value.list_of_response.filter((element) => {
      return !(element.target == i.target && element.type == i.type);
    }),
  };

  if (props.onUpdate) {
    props.onUpdate(conv_info.value);
  }
}

function childDelete(id) {
  conv_info.value = {
    ...conv_info.value,
    list_of_store: conv_info.value.list_of_store.filter(
      (element) => element.id != id
    ),
  };
  nextConvCurrextIndex.value = 0;
  if (props.onUpdate) {
    props.onUpdate(conv_info.value);
  }
}

function addSelfCondition(name, type) {
  conv_info.value = {
    ...conv_info.value,
    condition_type: type,
    condition: name,
  };
  if (props.onUpdate) {
    props.onUpdate(conv_info.value);
  }
}

function clearCondition() {
  conv_info.value = {
    ...conv_info.value,
    condition_type: null,
    condition: null,
  };
  if (props.onUpdate) {
    props.onUpdate(conv_info.value);
  }
}
</script>
<template>
  <AnimationDiglogBoxAnimationdiglogboxView
    :auto-down="selectorBoxInfo"
    @close="
      () => {
        listOfSelecItems = null;
        isActionsItemsHold = null;
        conditionItems = null;
        conditionType = null;
        listOfPrivIdList = null;
        selfConditionObj = null;
      }
    "
  >
    <div class="selector-box-00000001">
      <div class="head">Next Stap</div>

      <div class="intents">
        <div
          class="container"
          v-for="(i, n) in conv_info?.type == 'init'
            ? [
                { type: 't_next', label: 'Next' },
                { type: 'fallback', label: 'Fallback' },
                { type: 'add_condition', label: 'Condition' },
                {
                  type: 'self_condition',
                  label: 'Self Condition',
                  itype: 'self_condition',
                },
              ]
            : [
                { type: 't_next', label: 'Next' },
                { type: 't_forwards', label: 'Backward' },
                { type: 'fallback', label: 'Fallback' },
                { type: 'add_condition', label: 'Condition' },
              ]"
          @click="getItems(i)"
          v-if="
            selectorBoxInfo?.type == 'intents' &&
            !selectorBoxInfo.intype &&
            !conditionItems &&
            !conditionType &&
            !listOfPrivIdList &&
            !selectorBoxInfo?.forCondition
          "
          :key="n"
        >
          <div class="icon">
            <img
              v-if="i.type == 'fallback'"
              src="../../assets/icon/other/Union 4.png"
              alt=""
            />
            <img
              v-if="i.type == 't_forwards'"
              src="../../assets/icon/other/Group 214.png"
              alt=""
            />
            <img
              v-if="i.type == 't_next'"
              src="../../assets/icon/other/Group 222.png"
              alt=""
            />
            <img
              v-if="i.type == 'add_condition'"
              src="../../assets/icon/other/Group 224.png"
              alt=""
            />
            <img
              v-if="i.type == 'self_condition'"
              src="../../assets/icon/other/Group 224.png"
              alt=""
            />
          </div>
          <div class="txt">
            {{ i.label }}
          </div>
        </div>

        <div
          class="container"
          v-if="selectorBoxInfo?.type == 'response' && !selectorBoxInfo.intype"
          v-for="(i, n) in [
            { type: 'response', label: 'Response' },
            { type: 'custom-actions', label: 'Actions' },
          ]"
          :key="n"
          @click="getItems(i)"
        >
          <div class="icon">
            <img
              v-if="i.type == 'response'"
              src="../../assets/icon/other/Group 225.png"
              alt=""
            />
            <img
              v-if="i.type == 'custom-actions'"
              src="../../assets/icon/other/Group 226.png"
              alt=""
            />
          </div>
          <div class="txt">
            {{ i.label }}
          </div>
        </div>

        <div class="list-of-items">
          <div
            class="list-of-items-item"
            v-for="(i, n) in props.list_store_id"
            v-if="
              selectorBoxInfo?.type == 'intents' &&
              listOfPrivIdList &&
              !selectorBoxInfo?.forCondition
            "
            @click="
              () => {
                addNext('t_forwards', i?.target, i?.id);
                selectorBoxInfo = null;
                listOfSelecItems = null;
                listOfPrivIdList = null;
              }
            "
          >
            <div class="icon">
              <img src="../../assets/icon/other/Group 228.png" alt="" />
            </div>
            <div class="txt">{{ i?.target }}</div>
          </div>

          <div
            class="list-of-items-item"
            v-for="(i, n) in selfConditionObj?.items
              ? selfConditionObj?.items
              : selectorBoxInfo?.intype == 'self_condition'
                ? conditionItems
                : listOfSelecItems"
            v-if="
              (selectorBoxInfo?.type == 'intents' &&
                selectorBoxInfo?.intype != 'self_condition' &&
                !selectorBoxInfo?.forCondition) ||
              selectorBoxInfo?.intype == 'self_condition'
            "
            @click="
              () => {
                if (
                  selectorBoxInfo?.type == 'intents' &&
                  selectorBoxInfo?.intype == 'self_condition'
                ) {
                  if (!selfConditionObj?.name) {
                    selfConditionObj = {
                      name: i.name,
                      items: i.types,
                    };
                  } else {
                    addSelfCondition(selfConditionObj.name, i?.typename);
                    selfConditionObj = null;
                    selectorBoxInfo = null;
                    listOfSelecItems = null;
                  }
                } else {
                  addNext(selectorBoxInfo.intype, i);
                  selectorBoxInfo = null;
                  listOfSelecItems = null;
                }
              }
            "
          >
            <div class="icon">
              <img src="../../assets/icon/other/Group 228.png" alt="" />
            </div>
            <div class="txt">{{ i?.typename ?? i?.name ?? i }}</div>
          </div>

          <div
            class="list-of-items-item"
            v-for="(i, n) in listOfSelecItems"
            v-if="
              selectorBoxInfo?.type == 'response' &&
              selectorBoxInfo.intype &&
              !selectorBoxInfo?.forCondition
            "
            @click="
              () => {
                addNext(isActionsItemsHold ? 'actions' : 'response', i);
                isActionsItemsHold.value = null;
                selectorBoxInfo = null;
                listOfSelecItems = null;
              }
            "
          >
            <div class="icon">
              <img src="../../assets/icon/other/response.png" alt="" />
            </div>
            <div class="txt">{{ i }}</div>
          </div>

          <div
            class="list-of-items-item"
            v-for="(i, n) in listOfSelecItems
              ? listOfSelecItems
              : conditionType
                ? conditionType
                : conditionItems"
            v-if="
              (selectorBoxInfo?.type == 'intents' &&
                conditionItems &&
                selectorBoxInfo?.intype != 'self_condition') ||
              (selectorBoxInfo?.type == 'intents' &&
                conditionType &&
                selectorBoxInfo?.intype != 'self_condition')
            "
            @click="
              () => {
                if (i.types) {
                  conditionType = i.types;
                  conditionObj = {
                    name: i.name,
                  };
                } else {
                  if (conditionObj['name'] && !conditionObj['type']) {
                    conditionObj['type'] = i?.typename;
                    getSelectItems(
                      {
                        of: 'intents',
                      },
                      (res, err) => {
                        if (res.items) {
                          listOfSelecItems = res.items;
                        }
                      }
                    );
                  } else {
                    addNext(
                      'add_condition',
                      i,
                      null,
                      conditionObj['name'],
                      conditionObj['type']
                    );
                    listOfSelecItems = null;
                    conditionType = null;
                    conditionObj = null;
                  }
                }
              }
            "
          >
            <div class="icon">
              <img src="../../assets/icon/other/response.png" alt="" />
            </div>
            <div class="txt">{{ i?.typename ?? i?.name ?? i }}</div>
          </div>
        </div>
      </div>
    </div>
  </AnimationDiglogBoxAnimationdiglogboxView>

  <div class="ScriptslistView">
    <div class="info-box">
      <div class="item-box box-1st">
        <div class="icon">
          <img src="../../assets/icon/other/Group 164.png" alt="" />
        </div>
        <div class="txt-box">I-{{ props.indexlvl ?? 0 }}</div>
      </div>

      <div class="item-box">
        <div class="icon">
          <img src="../../assets/icon/other/Group 169.png" alt="" />
        </div>
        <div class="txt-box">{{ conv_info?.id }}</div>
      </div>

      <div class="item-box">
        <div class="icon">
          <img src="../../assets/icon/other/Group 228.png" alt="" />
        </div>
        <div class="txt-box">{{ conv_info?.target }}</div>
      </div>

      <div class="item-box">
        <div class="icon">
          <img src="../../assets/icon/other/share_1639962.png" alt="" />
        </div>
        <div class="txt-box">
          {{ conv_info?.type == "init" ? "Start-With" : conv_info?.type }}
        </div>
      </div>

      <div class="item-box item-box2" @click="changeBreakeStatus()">
        <div class="icon p-p1">
          <img src="../../assets/icon/other/Group 235.png" alt="" />
        </div>
        <div class="txt-box click-text">
          {{
            getConditionBreakStatus()
              ? "Conversition-Break"
              : "Conversition-Unbreak"
          }}
        </div>
      </div>

      <div class="item-box item-box2">
        <div class="icon">
          <img src="../../assets/icon/nav/custom-actions.png" alt="" />
        </div>
        <div class="txt-box">
          Actions ({{ getResposneTypeCount("actions") }})
        </div>
      </div>

      <div class="item-box item-box2">
        <div class="icon">
          <img src="../../assets/icon/other/response.png" alt="" />
        </div>

        <div class="txt-box">Response ({{ getResposneTypeCount() }})</div>
      </div>

      <div class="item-box item-box2">
        <div class="icon">
          <img src="../../assets/icon/other/next.png" alt="" />
        </div>
        <div class="txt-box">Next-Intents ({{ getNextStap() }})</div>
      </div>

      <div class="item-box item-box2">
        <div class="icon p-p1">
          <img src="../../assets/icon/other/Union 5.png" alt="" />
        </div>
        <div class="txt-box">Fallback ({{ getNextStap("fallback") }})</div>
      </div>

      <div class="multiitem">
        <div class="item-box">
          <div class="icon">
            <img src="../../assets/icon/nav/condition.png" alt="" />
          </div>
          <div class="txt-box click-text">
            {{ conv_info.condition ?? "Condition-Free" }}
          </div>
        </div>
        <div class="clicle-box" v-if="conv_info.condition">
          <div class="icon">
            <div class="line"></div>
          </div>
          <div class="txt-box click-text">- {{ conv_info.condition_type }}</div>
          <div
            class="del-icon"
            v-if="conv_info.type == 'init'"
            @click="clearCondition()"
          >
            <img src="../../assets/icon/other/delete.png" alt="" />
          </div>
        </div>
      </div>

      <div class="item-box">
        <div
          class="delete-button"
          @click="
            () => {
              if (props.onDelete) {
                props.onDelete(conv_info.id);
              }
            }
          "
        >
          Drop
        </div>
      </div>
    </div>
    <div class="slide-boxs">
      <div class="slide-box">
        <div class="head">Intents</div>
        <div class="spr">
          <div class="swiper-wrapper-fixed">
            <swiper
              :modules="[EffectCoverflow]"
              effect="coverflow"
              slidesPerView="auto"
              :centeredSlides="true"
              :coverflowEffect="{
                rotate: 10,
                stretch: 0,
                depth: 100,
                modifier: -1,
                slideShadows: false,
              }"
              :pagination="true"
              :slides-per-view="3"
              style="height: 100%; width: 100%"
              class="mySwiper"
            >
            <!-- -->
              <swiper-slide v-for="(i, n) in conv_info?.list_of_store.length == 0?  [{type:'empty'}]:conv_info?.list_of_store" :key="n">
                <div class="slide-box-item">
                  <div class="icon">
                    <img
                      v-if="i.type == 'fallback'"
                      src="../../assets/icon/other/Union 4.png"
                      alt=""
                    />
                    <img
                      v-if="i.type == 't_forwards'"
                      src="../../assets/icon/other/Group 214.png"
                      alt=""
                    />
                    <img
                      v-if="i.type == 't_next'"
                      src="../../assets/icon/other/Group 222.png"
                      alt=""
                    />
                    <img
                      v-if="i.type == 'add_condition'"
                      src="../../assets/icon/other/Group 224.png"
                      alt=""
                    />
                    <img
                      v-if="(i.type == 'empty')"
                      src="../../assets/icon/other/empty-box-icon.png"
                      alt=""
                    />
                  </div>
                  <div class="txt-box">
                    <br />
                    <div v-if="(i.type != 'empty')">
                      <div class="icon">
                        <img src="../../assets/icon/other/Union 4.png" alt="" />
                      </div>
                      <div class="txt">{{ i.target }}</div>
                    </div>
                    <div>
                      <div class="icon"  v-if="(i.type != 'empty')">
                        <img src="../../assets/icon/other/Union 4.png" alt="" />
                      </div>
                      <div class="txt">{{ i.target_id ?? i.id }}</div>
                    </div>
                    <div  v-if="(i.type != 'empty')">
                      <div class="icon"  v-if="(i.type != 'empty')">
                        <img src="../../assets/icon/other/Union 4.png" alt="" />
                      </div>
                      <div class="txt">{{ i.type }}</div>
                    </div>
                    <div v-if="(i.type != 'empty')">
                      <div class="icon"  v-if="(i.type != 'empty')">
                        <img src="../../assets/icon/other/Union 4.png" alt="" />
                      </div>
                      <div class="txt" v-if="(i.type != 'empty')"  >
                        {{ !i.condition ? "Condition" : "" }}
                      </div>
                      <span v-if="(i.type != 'empty')" >-{{ i.condition_type ?? "Free" }}</span>
                      
                    </div>
                   
                    <div class="drop-box"  >
                      <div class="button" v-if="(i.type != 'empty')"  @click="intentDroper(i)">Drop</div>
                      <br v-if="(i.type == 'empty')">
                      <br v-if="(i.type == 'empty')">
                      <br v-if="(i.type == 'empty')">
                      <br v-if="(i.type == 'empty')">
                      <br v-if="(i.type == 'empty')">
                      <br v-if="(i.type == 'empty')">
                      <div class="button button-add" v-if="(i.type == 'empty')"  @click="
              () => {
                selectorBoxInfo = {
                  type: 'intents',
                };
              }
            ">ADD-ITEM</div>
                    </div>
                  </div>
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>
        <div class="add-button-box">
          <div
            class="button"
            @click="
              () => {
                selectorBoxInfo = {
                  type: 'intents',
                };
              }
            "
          >
            Options
          </div>
        </div>
      </div>
      <div class="slide-box">
        <div class="head">Response</div>
        <div class="spr">
          <div class="swiper-wrapper-fixed">
            <swiper
              :modules="[EffectCoverflow]"
              effect="coverflow"
              slidesPerView="auto"
              :centeredSlides="true"
              :coverflowEffect="{
                rotate: 10,
                stretch: 0,
                depth: 100,
                modifier: -1,
                slideShadows: false,
              }"
              :pagination="true"
              :slides-per-view="3"
              style="height: 100%; width: 100%"
              class="mySwiper"
            >
              <swiper-slide
                v-for="(i, n) in  conv_info.list_of_response.length == 0?[{type:'empty'}]: conv_info.list_of_response"
                :key="n"
              >
                <div class="slide-box-item">
                  <div class="icon">
                    <img
                      v-if="i.type == 'response'"
                      src="../../assets/icon/other/Group 225.png"
                      alt=""
                    />
                    <img
                      v-if="i.type == 'actions'"
                      src="../../assets/icon/other/Group 226.png"
                      alt=""
                    />
                    <img
                      v-if="(i.type == 'empty')"
                      src="../../assets/icon/other/empty-box-icon.png"
                      alt=""
                    />
                  </div>
                  <div class="txt-box">
                    <br />
                    <div v-if="(i.type != 'empty')">
                      <div class="icon">
                        <img src="../../assets/icon/other/Union 4.png" alt="" />
                      </div>
                      <div class="txt">{{ i?.target }}</div>
                    </div>

                    <div v-if="(i.type != 'empty')">
                      <div class="icon">
                        <img src="../../assets/icon/other/Union 4.png" alt="" />
                      </div>
                      <div class="txt">{{ i?.type }}</div>
                    </div>
                    <br />
                    <br />

                    <div class="drop-box"  >
                      <div class="button" v-if="(i.type != 'empty')"  @click="deleteResponse(i)">Drop</div>
                      <br v-if="(i.type == 'empty')">
                      <br v-if="(i.type == 'empty')">
                      <br v-if="(i.type == 'empty')">
                      <div class="button button-add" v-if="(i.type == 'empty')"  @click="
              () => {
                selectorBoxInfo = {
                  type: 'response',
                };
              }
            ">ADD-ITEM</div>
                    </div>
                  </div>
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>
        <div class="add-button-box">
          <div
            class="button"
            @click="
              () => {
                selectorBoxInfo = {
                  type: 'response',
                };
              }
            "
          >
            Add
          </div>
        </div>
      </div>
    </div>
  </div>

  <ScriptslistView
    v-if="
      conv_info?.list_of_store?.length > 0 &&
      conv_info?.list_of_store[intentsIndexItem].type != 't_forwards'
    "
    :package="conv_info?.list_of_store[intentsIndexItem]"
    @delete="childDelete"
    @update="
      (update) => {
        if (props.onUpdate) {
          if (conv_info?.list_of_store) {
            conv_info.list_of_store = conv_info?.list_of_store?.map(
              (element, index) => {
                if (element.id == update.id) {
                  return update;
                }
                return element;
              }
            );
            props.onUpdate(conv_info);
          }
        }
      }
    "
    :list_store_id="[
      ...(props.list_store_id ?? []),
      { id: conv_info.id, target: conv_info.target },
    ]"
    :indexlvl="conv_info?.nolvl + 1"
  />
</template>
<style lang="css" src="./style.css"></style>
