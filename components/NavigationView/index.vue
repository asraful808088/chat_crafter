<script setup>
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
  <div class="navigation-box">
    <div class="navigation-item" @click="changeRoute()">
      <div class="icon">
        <img src="../../assets/icon/nav/intents.png" alt="" />
      </div>
      <div class="arrow">
        <img
          src="../../assets/icon/nav/active.png"
          alt=""
          v-if="currentPath == '/'"
        />
      </div>
    </div>

    <div class="navigation-item" @click="changeRoute('condition')">
      <div class="icon">
        <img src="../../assets/icon/nav/condition.png" alt="" />
      </div>
      <div class="arrow">
        <img
          src="../../assets/icon/nav/active.png"
          alt=""
          v-if="currentPath == '/condition'"
        />
      </div>
    </div>

    <div class="navigation-item" @click="changeRoute('custom-actions')">
      <div class="icon">
        <img src="../../assets/icon/nav/custom-actions.png" alt="" />
      </div>
      <div class="arrow">
        <img
          src="../../assets/icon/nav/active.png"
          alt=""
          v-if="currentPath == '/custom-actions'"
        />
      </div>
    </div>

    <div class="navigation-item" @click="changeRoute('entities')">
      <div class="icon">
        <img src="../../assets/icon/nav/entities.png" alt="" />
      </div>
      <div class="arrow">
        <img
          src="../../assets/icon/nav/active.png"
          alt=""
          v-if="currentPath == '/entities'"
        />
      </div>
    </div>

    <div class="navigation-item" @click="changeRoute('response')">
      <div class="icon">
        <img src="../../assets/icon/nav/response.png" alt="" />
      </div>
      <div class="arrow">
        <img
          src="../../assets/icon/nav/active.png"
          alt=""
          v-if="currentPath == '/response'"
        />
      </div>
    </div>

    <div class="navigation-item" @click="changeRoute('scripts')">
      <div class="icon">
        <img src="../../assets/icon/nav/sctipts.png" alt="" />
      </div>
      <div class="arrow">
        <img
          src="../../assets/icon/nav/active.png"
          alt=""
          v-if="currentPath == '/scripts'"
        />
      </div>
    </div>

    <div class="navigation-item" @click="changeRoute('synonyms')">
      <div class="icon">
        <img src="../../assets/icon/nav/synonym.png" alt="" />
      </div>
      <div class="arrow">
        <img
          v-if="currentPath == '/synonyms'"
          src="../../assets/icon/nav/active.png"
          alt=""
        />
      </div>
    </div>
    <div class="navigation-item task" @click="changeRoute('task')">
      <div class="icon">
        <img src="../../assets/icon/nav/task.png" alt="" />
      </div>
      <div class="arrow">
        <img
          src="../../assets/icon/nav/active.png"
          alt=""
          v-if="currentPath == '/task'"
        />
      </div>
    </div>
  </div>
</template>

<style lang="css" src="./style.css"></style>
