<script setup>
import { onMounted, ref, watchEffect } from "vue";
import getSelectItems from "~/network/get_intentes/get_intents";
import getConditionItems from "~/network/getConditions/get";
const props = defineProps({
  of: {
    type: String,
    require: false,
  },
  type: {
    type: Object,
    require: false,
  },
  items: {
    type: Array,
    require: false,
  },
  onClose: {
    type: Function,
    require: false,
  },
  onAdd: {
    type: Function,
    require: false,
  },
  condition: {
    type: Boolean,
    require: false,
    default: false,
  },
});
const items = ref([]);
const conditionStap = ref(0);
const conditionItems = ref([]);
const conditionObj = ref({});
const conitionTypes = ref([]);
onMounted(() => {
  getConditionItems((res) => {
    if (res.items) {
      conditionItems.value = res.items;
    }
  });
});
watchEffect(() => {
  if (props.of) {
    getSelectItems(
      {
        of: props.of,
      },
      (res, err) => {
        if (res.items) {
          items.value = res.items;
        }
      }
    );
  } else {
    items.value = props.items;
  }
});

function addItem(i) {
  if (props.onAdd) {
    props.onAdd({
      target: i?.target ?? i,
      id: i?.id ?? null,
      type: props.type,
    });
  }
}

function nextCondition(val) {
  if (conditionStap.value == 0) {
    conditionObj.value = {
      ...conditionObj.value,
      target: val,
    };
    conditionStap.value = 1;
  } else if (conditionStap.value == 1) {
    conditionObj.value = {
      ...conditionObj.value,
      condition: val,
    };
    const obj = conditionItems.value.find((e) => {
      return e.name == val;
    });
    conditionStap.value = 2;
    conitionTypes.value = [...obj.types];
  } else if (conditionStap.value == 2) {
    conditionObj.value = {
      ...conditionObj.value,
      condition_type: val,
      type: props.type,
    };

    if (
      conditionObj.value.target &&
      conditionObj.value.condition &&
      conditionObj.value.condition_type
    ) {
      if (props.onAdd) {
        props.onAdd(conditionObj.value);
      }
      if (props.onClose) {
        props.onClose();
      }
    }
  }
}
</script>
<template>
  <div class="next-dialog">
    <div class="board">
      <div class="back-box">
        <div class="button" @click="props.onClose">
          <img src="../../assets/icon/other/backbutton.png" alt="" />
        </div>
      </div>

      <h2 class="intra-head">What's Next Target ??</h2>

      <div class="listbox" v-if="!props.condition">
        <div class="item" v-for="(i, n) in items" @click="addItem(i)">
          <div class="icon">
            <img src="../../assets/icon/nav/intents.png" alt="" />
          </div>
          <div class="txt" v-if="i.target" :title="i.id">{{ i.target }}</div>
          <div class="txt" v-if="!i.target">{{ i }}</div>
        </div>
      </div>

      <div class="listbox" v-if="props.condition && conditionStap == 0">
        <div class="item" v-for="(i, n) in items" @click="nextCondition(i)">
          <div class="icon">
            <img src="../../assets/icon/nav/intents.png" alt="" />
          </div>
          <div class="txt" v-if="i" :title="i.id">{{ i }}</div>
        </div>
      </div>

      <div class="listbox" v-if="props.condition && conditionStap == 1">
        <div
          class="item"
          v-for="(i, n) in conditionItems"
          @click="nextCondition(i?.name)"
        >
          <div class="icon">
            <img src="../../assets/icon/nav/intents.png" alt="" />
          </div>
          <div class="txt" :title="i.id">{{ i?.name }}</div>
        </div>
      </div>

      <div class="listbox" v-if="props.condition && conditionStap == 2">
        <div
          class="item"
          v-for="(i, n) in conitionTypes"
          @click="nextCondition(i.typename)"
        >
          <div class="icon">
            <img src="../../assets/icon/nav/intents.png" alt="" />
          </div>
          <div class="txt" v-if="i" :title="i">{{ i.typename }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="css" src="./style.css"></style>
