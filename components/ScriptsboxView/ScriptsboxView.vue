<script setup>
import ScriptsboxView from "@/components/ScriptsboxView/ScriptsboxView.vue";
import { ref, watchEffect } from "vue";
import addconditionItem from "~/network/addCondition/post";
import deleteAddConditionItem from "~/network/deleteAddConditionItem/delete";
import NexttoastView from "../NextItemToast/NexttoastView.vue";
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
const showtoast = ref(null);
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
const conv_info = ref();

const currentIndex = ref(0);
const nextConvCurrextIndex = ref(0);
const responseConvCurrextIndex = ref(0);
//  next add
//  backword
//  serial break err add
//  serial break on / off
//
//
//
//
//
//
//

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
function nextArrow() {
  if (!(conv_info.value.list_of_store.length - 1 <= 0)) {
    if (
      conv_info.value.list_of_store.length - 1 ==
      nextConvCurrextIndex.value
    ) {
      nextConvCurrextIndex.value = 0;
    } else {
      nextConvCurrextIndex.value += 1;
    }
  }
}

function nextResArrow() {
  if (!(conv_info.value.list_of_response.length - 1 <= 0)) {
    if (
      conv_info.value.list_of_response.length - 1 ==
      responseConvCurrextIndex.value
    ) {
      responseConvCurrextIndex.value = 0;
    } else {
      responseConvCurrextIndex.value += 1;
    }
  }
}
function prevResArrow() {
  if (!(conv_info.value.list_of_response.length - 1 <= 0)) {
    if (responseConvCurrextIndex.value == 0) {
      responseConvCurrextIndex.value =
        conv_info.value.list_of_response.length - 1;
    } else {
      responseConvCurrextIndex.value -= 1;
    }
  }
}

function prevArrow() {
  if (!(conv_info.value.list_of_store.length - 1 <= 0)) {
    if (nextConvCurrextIndex.value == 0) {
      nextConvCurrextIndex.value = conv_info.value.list_of_store.length - 1;
    } else {
      nextConvCurrextIndex.value -= 1;
    }
  }
}

function addNext(type, target, target_id, condition, condition_type) {
  if (conv_info.value.type == "init" && condition && condition_type && "self_add_condition" == type) {
    conv_info.value.condition = condition
    conv_info.value.condition_type = condition_type
    if (props.onUpdate) {
      addconditionItem(
          {
            consdition: condition,
            condition_type: condition_type,
            id: conv_info.value.id,
            target: target,
            nolvl: conv_info.value.nolvl,
          },
          (res) => {
          }
        );
      props.onUpdate(conv_info.value);
    }
    return
  }
  if (type == "fallback") {
    currentIndex.value = 0;
  }
  if (type == "response") {
    const findObj = conv_info.value?.list_of_response?.find(
      (element) => element.target == target && element.type == type
    );
    if (findObj) {
      showtoast.value = null;
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
    showtoast.value = null;

    return;
  }

  if (type == "actions") {
    const findObj = conv_info.value?.list_of_response?.find(
      (element) => element.target == target && element.type == type
    );
    if (findObj) {
      showtoast.value = null;

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
    showtoast.value = null;
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
        const obj  = createBlogObj({
              type: type,
              target: target,
              target_id: target_id,
              condition: condition,
              condition_type: condition_type,
              nolvl: conv_info.value.nolvl+1,
            })
        addconditionItem(
          {
            consdition: condition,
            condition_type: condition_type,
            id: obj.id,
            target: target,
            nolvl: conv_info.value.nolvl+1,
          },
          (res) => {
          }
        );
        conv_info.value = {
          ...conv_info.value,
          list_of_store: [
            ...conv_info.value.list_of_store,obj
            ,
          ],
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

  showtoast.value = null;
}
function changeBreakStatus() {
  if (currentIndex.value != 2) {
    openToast();
    return;
  }
  conv_info.value = {
    ...conv_info.value,
    list_of_next_stap: conv_info?.value?.list_of_next_stap?.map((element) => {
      if (element.type == "serial_break_add") {
        return {
          ...element,
          val: !element.val,
        };
      }
      return element;
    }),
  };
  if (props.onUpdate) {
    props.onUpdate(conv_info.value);
  }
}
function changeOption() {
  if (currentIndex.value == 0) {
    currentIndex.value = 1;
  } else if (currentIndex.value == 1) {
    currentIndex.value = 2;
  } else if (currentIndex.value == 2) {
    if (
      conv_info.value.list_of_store.find((element) => {
        return element.type == "fallback";
      })
    ) {
      currentIndex.value = 4;
    } else {
      currentIndex.value = 3;
    }
  } else if (currentIndex.value == 3) {
    currentIndex.value = 4;
  } else {
    currentIndex.value = 0;
  }
}

function onDelete() {
  deleteAddConditionItem(
    {
      name: conv_info.value.condition,
      type: conv_info.value.condition_type,
      id: conv_info.value.id,
    },
    (res) => {
      if (res) {
        if (props.onDelete) {
          props.onDelete(conv_info.value.id);
        }
      }
    }
  );
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

function openToast() {
  if (currentIndex.value == 0) {
    showtoast.value = {
      type: "t_next",
      of: "intents",
    };
  } else if (currentIndex.value == 1) {
    showtoast.value = {
      type: "t_forwards",
    };
  } else if (currentIndex.value == 3) {
    showtoast.value = {
      type: "fallback",
      of: "intents",
    };
  } else if (currentIndex.value == 4) {
    showtoast.value = {
      type: "add_condition",
      of: "intents",
    };
  }
}

function selfCondition(){
  showtoast.value = {
      type: "self_add_condition",
      of: "intents",
    };
}

function addResponse() {
  {
    showtoast.value = {
      type: "response",
      of: "response",
    };
  }
}
function addActions() {
  {
    showtoast.value = {
      type: "actions",
      of: "custom-actions",
    };
  }
}
function deleteResponse() {
  conv_info.value = {
    ...conv_info.value,
    list_of_response: conv_info.value.list_of_response.filter((element) => {
      return !(
        element.target ==
          conv_info.value?.list_of_response[responseConvCurrextIndex.value]
            .target &&
        element.type ==
          conv_info.value?.list_of_response[responseConvCurrextIndex.value].type
      );
    }),
  };
  responseConvCurrextIndex.value = 0;
  if (props.onUpdate) {
    props.onUpdate(conv_info.value);
  }
}

function deleteSelfCondition(){
  conv_info.value.condition = null
  conv_info.value.condition_type = null
  if (props.onUpdate) {
    props.onUpdate(conv_info.value);
  }
}
</script>
<template>
  <NexttoastView
    v-if="showtoast?.type"
    :items="props?.list_store_id"
    :of="showtoast?.of"
    :condition="showtoast?.type == 'add_condition'"
    @close="
      () => {
        showtoast = null;
      }
    "
    :type="showtoast.type"
    @add="
      (element) => {
        addNext(
          element.type,
          element.target,
          element.id,
          element.condition,
          element.condition_type
        );
      }
    "
  />
  <div class="Scripts-Box" v-if="conv_info">
    <div class="scripts-item">
      <div class="icon-box">
        <div class="icon">
          <div class="icon">
            <img src="../../assets/icon/other/conv_line.png" alt="" />
          </div>
        </div>
      </div>
      <div class="txtx">
        <div class="text" :title="conv_info?.id">
          lvl-{{ `${conv_info?.nolvl}` }}
          {{ conv_info.id ? `(${conv_info.id}) ` : "" }}{{ conv_info.target
          }}{{ ` >${conv_info.type}` }}
        </div>
        <div class="text" :title="conv_info?.id">
          {{
            conv_info.condition_type
              ? `(${conv_info.condition})>${conv_info.condition_type} `
              : ""
          }}
        </div>
        <div class="multi-task">
          <div class="frame">
            <div class="arrow" @click="prevResArrow">
              <img src="../../assets/icon/other/arrow.png" alt="" />
            </div>
            <div class="text-item">
              {{
                conv_info?.list_of_response[responseConvCurrextIndex]?.target
                  ? `${conv_info?.list_of_response[responseConvCurrextIndex]?.target} ${conv_info?.list_of_response[responseConvCurrextIndex]?.type == "actions" ? "(A)" : ""}`
                  : "empty"
              }}
            </div>
            <div class="arrow" @click="nextResArrow">
              <img src="../../assets/icon/other/arrow.png" alt="" />
            </div>
          </div>
          <div
            class="delete-response"
            @click="deleteResponse"
            v-if="conv_info?.list_of_response[responseConvCurrextIndex]"
          >
            <img src="../../assets/icon/other/delete.png" alt="" />
          </div>
          <div class="delete-response" @click="addResponse">
            <img src="../../assets/icon/nav/response.png" alt="" />
          </div>
          <div class="delete-response" @click="addActions">
            <img src="../../assets/icon/nav/custom-actions.png" alt="" />
          </div>
          <!-- <div class="delete-response">
            <img src="../../assets/icon/nav/task.png" alt="" />
          </div> -->
        </div>
        <div class="gap-block" v-if="props.package?.type != 'fallback' ">
          <div class="multi-task" v-if="conv_info?.type != 'serial_break_err'">
            <div class="frame">
              <div class="arrow" @click="prevArrow">
                <img src="../../assets/icon/other/arrow.png" alt="" />
              </div>
              <div class="text-item">
                {{
                  conv_info?.list_of_store[nextConvCurrextIndex]?.target ??
                  "empty"
                }}
              </div>
              <div class="arrow" @click="nextArrow">
                <img src="../../assets/icon/other/arrow.png" alt="" />
              </div>
            </div>
          </div>

          <div class="multi-task" v-if="conv_info?.type != 'serial_break_err'">
            <div class="frame">
              <div class="arrow" @click="changeOption">
                <img src="../../assets/icon/other/arrow.png" alt="" />
              </div>
              <div
                class="text-item"
                @click="changeBreakStatus"
                draggable="true"
              >
                {{ conv_info?.list_of_next_stap[currentIndex].label }}
                <span
                  v-if="
                    conv_info?.list_of_next_stap[currentIndex].label ==
                    'serial-break'
                  "
                >
                  {{
                    conv_info?.list_of_next_stap[currentIndex].val
                      ? "(t)"
                      : "(f)"
                  }}
                </span>
              </div>
              <div class="arrow" @click="changeOption">
                <img src="../../assets/icon/other/arrow.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="delete-box">
        <div v-if="conv_info.type!='init'" class="delete" @click="onDelete">
          <img src="../../assets/icon/other/delete.png" alt="" />
        </div>
        
        <div v-if="conv_info.type=='init' && !conv_info.condition && !conv_info.condition_type" class="delete" @click="selfCondition">
          <img src="../../assets/icon/nav/condition.png" alt="" />
        </div>
        <div v-if="conv_info.type=='init' && conv_info.condition && conv_info.condition_type" class="delete" @click="deleteSelfCondition">
          <img src="../../assets/icon/other/delete.png" alt="" />
        </div>
        <div class="arrow" v-if="conv_info?.type != 'serial_break_err'">
          <img src="../../assets/icon/other/arrowx.png" alt="" />
        </div>
      </div>
    </div>
  </div>

  <ScriptsboxView
    v-if="
      conv_info?.list_of_store?.length > 0 &&
      conv_info?.list_of_store[nextConvCurrextIndex].type != 't_forwards'
    "
    :package="conv_info?.list_of_store[nextConvCurrextIndex]"
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

  <div
    class="backword-001"
    v-if="conv_info?.list_of_store[nextConvCurrextIndex]?.type == 't_forwards'"
  >
    <div class="icon">
      <div class="sub-icon">
        <img src="../../assets/icon/other/loop.png" alt="" />
      </div>
    </div>
    <div class="txt-box">
      <h1>Backward</h1>
      <h3>{{ conv_info?.list_of_store[nextConvCurrextIndex]?.target_id }}</h3>
      <h3>{{ conv_info?.list_of_store[nextConvCurrextIndex]?.target }}</h3>
    </div>
  </div>
</template>
<style src="./style.css"></style>
