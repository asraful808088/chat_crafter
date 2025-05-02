<script setup>
import { useRouter } from "#app";
import { onMounted, ref } from "vue";
import CreatedialogView from "~/components/CreatdialogView/index.vue";
import postSelectItem from "~/network/createSelectItem/create";
import deleteSelecteItem from "~/network/deleteSelector/delete";
import getSelectItems from "~/network/get_intentes/get_intents";
import SelectorItem2View from "../SelectorItem2View/SelectorItem2View.vue";
const router = useRouter();
const dialogToast1 = ref(null);
const listOfItems = ref([]);
const dialogInfoObj = ref(null);
const listOfEnchangeItem = ref([])
const propertyInfo = ref(null)
const props = defineProps({
  of: {
    type: String,
    require: false,
  },
  header: {
    type: String,
    require: false,
    default: "Intents",
  },
  state: {
    type: Object,
    require: false,
  },
  client_path: {
    type: String,
    require: false,
    default: "intents",
  },
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
      listOfItems.value = res.items;
    }
  });
});
function deleteSItems(i) {
  deleteSelecteItem({ name: i, of: props.of }, (res, err) => {
    if (res.items) {
      listOfItems.value = res.items;
    }
  });
}
function inputCreateItem(e) {
  postSelectItem({ ...e, of: props.of }, (res, err) => {
    if (res.items) {
      listOfItems.value = res.items;
      dialogInfoObj.value = null;
    }
    dialogInfoObj.value = null;
  });
}


function exchangeTO(){
  getSelectItems({
    of:props.of == "intents"?"entities":"intents"
  },(res,err)=>{
    if (res.items) {
      
      listOfEnchangeItem.value = {
        items:res.items
      }
    }
  })
}
import AnimationdiglogboxView from "../Animation_diglog_box/AnimationdiglogboxView.vue";
import convertT from "~/network/convertTO/post";
function applyToExchange(convertTO){
  if (!propertyInfo.value?.from_name) {
    return
  }
  convertT({
    to:props.of == "intents"?"entities":"intents",
    from_name: propertyInfo.value.from_name,
    to_name:convertTO,
    from:props.of
  },(res,err)=>{
    listOfEnchangeItem.value = null
  })
}
</script>
<template>
  <div class="container-01111">
    <AnimationdiglogboxView :auto-down="listOfEnchangeItem?.items">
        <h3>{{ props.of =="intents" ? "Entities":"Intents" }}</h3>
        <br>
        <div class="list-box-990901" >
            <div class="item" v-for="(i) in listOfEnchangeItem?.items" @click="()=>{
              applyToExchange(i.name)
            }" >
              <div class="icon">
                <img src="../../assets/icon/other/Group 390.png" alt="">
              </div>
              <div class="txt">{{ i.name }} </div>
            </div>
        </div>
    </AnimationdiglogboxView>
    <CreatedialogView
      :info="dialogInfoObj"
      @apply="
        (a) => {
          inputCreateItem(a);
        }
      "
    />
    <div class="container">
      <div class="title-box">
        <div>{{ props.header }}</div>
        <div
          class="icon"
          @click="
            () => {
              dialogInfoObj = {};
            }
          "
        >
          <img src="../../assets/icon/other/Group 3.png" alt="" />
        </div>
      </div>
      <div class="item-box">
        <div class="grid-box">
          <SelectorItem2View
            v-for="(i, n) in listOfItems"
            :key="n"
            :name="i.name"
            :count="i.length"
            :type="i.type"
            :non_deletable="i.type == 'default_fallback'"
            @select="
              () => {
                router.push(`/${props.client_path}/${i.name}`);
              }
            "
            :date="i.time"
            @properties="()=>{
              propertyInfo = {
                from_name:i.name
              }
            }"
            @drop="
              (i) => {
                deleteSItems(i);
              }
            "
          />
        </div>
      </div>
    </div>
    <div class="details">
      <div class="title-box">Properties</div>
      <div class="info-box">
        <div class="info-container">
          <div class="info-container-item">
            <div class="icon">
              <img src="../../assets/icon/other/Group 297.png" alt="" />
            </div>
            <div class="txt">12/02/21</div>
          </div>

          <div class="info-container-item">
            <div class="icon">
              <img src="../../assets/icon/other/Group 299.png" alt="" />
            </div>
            <div class="txt">Monday</div>
          </div>

          <div class="info-container-item">
            <div class="icon">
              <img src="../../assets/icon/other/Group 304.png" alt="" />
            </div>
            <div class="txt">12:01:23(pm)</div>
          </div>

          <div class="info-container-item">
            <div class="icon">
              <img src="../../assets/icon/other/Group 296.png" alt="" />
            </div>
            <div class="txt">0.225MB</div>
          </div>

          <div class="info-container-item">
            <div class="icon">
              <img src="../../assets/icon/other/Group 300.png" alt="" />
            </div>
            <div class="txt">{{ router.currentRoute.value.path.replaceAll("/","").length!=0?router.currentRoute.value.path.replaceAll("/",""):"intents" }}</div>
          </div>

          <div class="info-container-item">
            <div class="icon">
              <img src="../../assets/icon/other/Group 298.png" alt="" />
            </div>
            <div class="txt">Gretting</div>
          </div>

          <div class="info-container-item">
            <div class="icon">
              <img src="../../assets/icon/other/Group 301.png" alt="" />
            </div>
            <div class="txt">{{listOfItems.length}} (count)</div>
          </div>

          <div class="info-container-item" v-if="propertyInfo?.from_name" >
            <div class="icon">
              <img src="../../assets/icon/other/Group 302.png" alt="" />
            </div>
            <div class="txt">
              {{ propertyInfo?.from_name }}
            </div>
          </div>




          <div class="info-container-item"  @click="
            () => {
              dialogInfoObj = {};
            }
          ">
            <div class="icon">
              <img src="../../assets/icon/other/Group 3.png" alt="" />
            </div>
            <div class="txt cur-p">
              Create-Item
            </div>
          </div>



          <div class="info-container-item">
            <div class="icon">
              <img src="../../assets/icon/head/profile.png" alt="" />
            </div>
            <div class="txt">
              profile-name
            </div>
          </div>
          
          
<div class="info-container-item" v-if="(props.of == 'entities' || props.of == 'intents') && propertyInfo" >
            <div class="icon">
              <img src="../../assets/icon/other/exchange-diagonal-svgrepo-com.png" alt="" />
            </div>
            <div class="txt cur-p" @click="()=>{
                  exchangeTO()
            }">
              Exchange
            </div>
          </div>




        </div>

        <div class="type-input">
          <div class="type-title">Type-Input</div>
          <div class="input-box">
            <input type="text" name="" id="" placeholder="type" />
            <div class="type-button">Inject</div>
          </div>
        </div>
        <div class="des-text-box">
          <div class="type-title">Description</div>
          <div class="context">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius
            eligendi, laborum incidunt suscipit quod obcaecati eum velit
            accusantium quas ipsum magni nobis sed, ducimus ut, assumenda
            recusandae exercitationem. Sint, aliquid?
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" src="./style.css"></style>
