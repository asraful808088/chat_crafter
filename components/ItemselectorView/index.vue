<script setup>
import { onMounted, ref } from "vue";
import postSelectItem from "~/network/createSelectItem/create";
import deleteSelecteItem from "~/network/deleteSelector/delete";
import getSelectItems from "~/network/get_intentes/get_intents";
import CreatedialogView from "./../CreatdialogView/index.vue";
import { useRouter } from '#app'
const router = useRouter()
const dialogToast1 = ref(null);
const props = defineProps({
  of: {
    type: String,
    require: false,
  },
  header: {
    type: String,
    require: false,
    default:"Intents"
  },
  state: {
    type: Object,
    require: false,
  },
  client_path:{
    type: String,
    require: false,
    default:"intents"
  }
});
function inputCreate(e) {
  postSelectItem({ ...e, of: props.of }, (res, err) => {
    if (res.items) {
      props.state.initEntitiesItems(res.items);
      dialogToast1.value = null;
    }
    dialogToast1.value = null;
  });
}
function showToast(val) {
  dialogToast1.value = val;
}
onMounted(() => {
  getSelectItems({ of: props.of }, (res, err) => {
    if (res.items) {
      props.state.initEntitiesItems(res.items);
    }
  });
});
function deleteSItems(i) {
  deleteSelecteItem({ name: i, of: props.of }, (res, err) => {
    if (res.items) {
      props.state.initEntitiesItems(res.items);
    }
  });
}
</script>
<template>
  <div class="item-seletor">
    <CreatedialogView
      @apply="inputCreate"
      :show="dialogToast1?.l == 1"
      @close="
        () => {
          dialogToast1 = null;
        }
      "
    />
    <div class="item">
      <h2 class="header-with-icon">
        <div> {{ props.header }} </div>
        <div class="icon-box">
          <div class="icon">
            <img src="../../assets/icon/other/delete-all.png" alt="" />
          </div>
          <div class="icon" @click="() => showToast({ l: 1 })">
            <img src="../../assets/icon/other/Path 3.png" alt="" />
          </div>
        </div>
      </h2>
      <div class="intents-box">
        <div
          class="s-item"
          v-for="(item, n) in props?.state?.state?.listOfItems"
        >
          <div class="icon" @click="()=>router.push(`/${props.client_path}/${item}`)" >
            <img src="../../assets/icon/other/text-icon.png" alt="" />
          </div>
          <div class="txt"   @click="()=>router.push(`/${props.client_path}/${item}`)" >
            {{ item }}
          </div>
          <div class="icon delete-icon"  >
            <img src="../../assets/icon/other/info.png" alt="" />
          </div>
          <div class="icon delete-icon" @click="()=>{
            if ('default_fallback' != item) {
              deleteSItems(item) 
            }else{
              router.push(`/${props.client_path}/${item}`)
            }
          }"  >
            <img src="../../assets/icon/other/delete.png" alt="" v-if="'default_fallback' != item" />
          </div>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="d-head">Intents-Name</div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus hic
        animi maiores culpa minus porro, error libero praesentium quam provident
        odit illum omnis! Debitis accusamus, veritatis ipsum fuga minima magni!
        Deleniti, ipsa? Magni minus at tempora iste, voluptate necessitatibus
        sit iure? Est velit perspiciatis assumenda sequi incidunt aspernatur
        minima ratione provident, dolor, sapiente odio architecto tenetur illum
        laboriosam porro asperiores.
      </p>
      <div class="d-head">Type-Name</div>
      <h2 class="t-head">Tracking</h2>
      <div class="info-item">{{ " Day " }}- Monday</div>
      <div class="info-item">Time - 12:30pm</div>
      <div class="info-item">Date - 12/02/25</div>
      <div class="info-item">Size - 12221111<span class="kb">KB</span></div>
      <div class="info-item">Actual Quantity - 100</div>
      <div class="info-item">Total Quantity - 100</div>
      <div class="info-item">Total Items - 100</div>
    </div>
  </div>
</template>
<style src="./style.css"></style>
