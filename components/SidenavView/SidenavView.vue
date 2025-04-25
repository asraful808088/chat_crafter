<script setup >

import { ref } from "vue";
const route = useRoute();
const router = useRouter();
const currentPathObj = computed(() => route.path);
let currentPath = ref(currentPathObj.value);

function changeRoute(name = "") {
  router.push(`/${name}`);
  currentPath.value = `/${name}`;
}
</script>
<template>
  <div class="menu-nav-001">
    <div class="nav">
      <div class="label">MENU</div>
      <div class="sub-nav">
        <div class="sub-nav-item">
          <div class="item">
            <div class="icon" @click="changeRoute()" >
              <img src="../../assets/icon/other/Group 295.png" alt="" />
            </div>
            <div class="arrow" v-if="currentPath == '/'">
              <img src="../../assets/icon/other/Polygon 2.png" alt="" />
            </div>
          </div>










         
          <div class="item" @click="changeRoute('response')">
            <div class="icon">
              <img src="../../assets/icon/other/Group 315.png" alt="" />
            </div>
            <div class="arrow" v-if="currentPath == '/response'">
              <img src="../../assets/icon/other/Polygon 2.png" alt="" />
            </div>
          </div>

          <div class="item" @click="changeRoute('scripts')">
            <div class="icon">
              <img src="../../assets/icon/other/Group 336.png" alt="" />
            </div>
            <div class="arrow" v-if="currentPath == '/scripts'">
              <img src="../../assets/icon/other/Polygon 2.png" alt="" />
            </div>
          </div>
          <div class="item" @click="changeRoute('entities')">
            <div class="icon">
              <img src="../../assets/icon/other/Group 312.png" alt="" />
            </div>
            <div class="arrow" v-if="currentPath == '/entities'">
              <img src="../../assets/icon/other/Polygon 2.png" alt="" />
            </div>
          </div>
          <div class="item" @click="changeRoute('synonyms')">
            <div class="icon">
              <img src="../../assets/icon/other/similar-svgrepo-com.png" alt="" />
            </div>
            <div class="arrow" v-if="currentPath == '/synonyms'">
              <img src="../../assets/icon/other/Polygon 2.png" alt="" />
            </div>
          </div>


          <div class="item" @click="changeRoute('condition')">
            <div class="icon">
              <img src="../../assets/icon/other/Group 337.png" alt="" />
            </div>
            <div class="arrow" v-if="currentPath == '/condition'">
              <img src="../../assets/icon/other/Polygon 2.png" alt="" />
            </div>
          </div>
          <div class="item" @click="changeRoute('custom-actions')">
            <div class="icon">
              <img src="../../assets/icon/other/Group 314.png" alt="" />
            </div>
            <div class="arrow" v-if="currentPath == '/custom-actions'">
              <img src="../../assets/icon/other/Polygon 2.png" alt="" />
            </div>
          </div>

          <div class="item" @click="changeRoute('task')">
            <div class="icon">
              <img src="../../assets/icon/other/Group 316.png" alt="" />
            </div>
            <div class="arrow" v-if="currentPath == '/task'">
              <img src="../../assets/icon/other/Polygon 2.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-nav">
        <div class="item" @click="changeRoute('traning')">
            <div class="icon">
              <img src="../../assets/icon/other/Group 308.png" alt="" />
            </div>
            <div class="arrow" v-if="currentPath == '/traning'">
              <img src="../../assets/icon/other/Polygon 2.png" alt="" />
            </div>
          </div>

          <div class="item" @click="changeRoute('entitiestraning')">
            <div class="icon">
              <img src="../../assets/icon/other/Group 305.png" alt="" />
            </div>
            <div class="arrow" v-if="currentPath == '/entitiestraning'">
              <img src="../../assets/icon/other/Polygon 2.png" alt="" />
            </div>
          </div>
      </div>
    </div>
   
  </div>
</template>

<style src="./style.css" lang="css"></style>
