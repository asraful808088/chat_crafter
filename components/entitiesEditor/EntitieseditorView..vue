<script setup>
import { useRoute } from "#app";
import { ref } from "vue";
import addEntitiesItem from "~/network/add_entities/update";
const props = defineProps({
  item: {
    type: Object,
    require: false,
  },
  entities: {
    type: Array,
    require: false,
    default: [],
  },
  onUpdate: {
    type: Function,
    require: false,
  },
  onClose: {
    type: Function,
    require: false,
  },
});
const route = useRoute();
const id = route.params.id;

const index = ref(null);
const entitiesIndex = ref(null);
let textInput = ref("");
let items = ref([]);
let entitiesItemObj = ref({});

function setIndex(va) {
  index.value = va;
}

function targetEntities(val) {
  entitiesIndex.value = val;
}
function entitiesModify(i) {
  if (!entitiesIndex) {
    return ``;
  }
  let newItem = { ...props.item };
  newItem["mapword"][entitiesIndex.value] = i.i;
  if (props.onUpdate) {
    props.onUpdate(newItem);
  }
}
function getUniqueArray(arr) {
  const uniqueMap = new Map();
  arr.forEach((item) => uniqueMap.set(item.i, item));
  return Array.from(uniqueMap.values());
}

function deleteEntitiesItem(nameObj) {
  let item1 = nameObj.i;
  let item2 = nameObj.i.replace("B-", "J-");
  items.value = items.value.filter(
    (element) => !(element.i == item1 || element.i == item2)
  );
  addEntitiesItem(
    {
      item: id,
      items: items.value,
    },
    (res, err) => {
      if (res.items) {
        items.value = res.items;
      }
    }
  );
}

function addEntities() {
  if (!textInput.value) {
    return;
  }

  let b_val = `B-${textInput.value.toUpperCase()}`;
  let j_val = `J-${textInput.value.toUpperCase()}`;

  addEntitiesItem(
    {
      item: id,
      items: getUniqueArray([{ i: b_val }, { i: j_val }, ...items.value]),
    },
    (res, err) => {
      if (res.items) {
        items.value = res.items;
      }
    }
  );

  textInput.value = "";
}

watchEffect(() => {
  entitiesItemObj.value = props.item;
});
watchEffect(() => {
  items.value = props.entities;
});
</script>
<template>
  <div class="E-editor">
    <div class="dialog">
      <div class="backbox">
        <div class="button" @click="props.onClose()">
          <img src="../../assets/icon/other/backbutton.png" alt="" />
        </div>
      </div>
      <div class="txt-part">
        <span
          @mouseover="setIndex(n)"
          :class="n == index ? 'txt-orange' : ''"
          v-for="(i, n) in entitiesItemObj?.wordlist"
        >
          {{ `${i} ` }}
        </span>
      </div>

      <div class="txt-part">
        <div class="txt-part-item">
          <div
            :class="n == index ? 'sitem txt-orange' : 'sitem'"
            v-for="(i, n) in entitiesItemObj?.wordlist"
          >
            <div class="spitem" @mouseover="setIndex(n)">{{ i }}</div>
            <div
              :class="
                n == entitiesIndex ? 'spitem target-txt-orange' : 'spitem'
              "
              @mouseover="setIndex(n)"
              @click="targetEntities(n)"
            >
              {{ `${entitiesItemObj?.mapword[n]}` }}
            </div>
          </div>
        </div>
        <div class="txt-part-item">
          <div class="in-p">
            <div class="input-box">
              <input
                type="text"
                name=""
                id=""
                placeholder="add entities"
                v-model="textInput"
              />
            </div>
            <div class="button" @click="addEntities">add</div>
          </div>
          <div class="item-box">
            <div @click="entitiesModify({ i: 'O' })">
              {{ "O" }}
            </div>
            <div
              class="s-item"
              v-for="(i, n) in items"
              @click="entitiesModify(i, n)"
            >
              <div class="txt">
                {{ i.i }}
              </div>

              <div
                class="delete"
                v-if="i.i.startsWith('B-')"
                @click="deleteEntitiesItem(i)"
              >
                <img src="../../assets/icon/other/delete.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="css" src="./style.css"></style>
