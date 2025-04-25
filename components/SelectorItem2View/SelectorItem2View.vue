<script setup>
const props = defineProps({
  name: {
    type: String,
    require: false,
  },
  type: {
    type: String,
    require: false,
  },
  count: {
    type: Number,
    require: false,
  },
  date: {
    type: Number,
    require: false,
  },
  onProperties: {
    type: Function,
    require: false,
  },
  onDrop: {
    type: Function,
    require: false,
  },
  onSelect: {
    type: Function,
    require: false,
  },
});
</script>
<template>
  <div class="card-0000002222">
    <div class="containers" @click="()=>{
        if (props.onSelect) {
          props.onSelect()
        } 
      }">
      <div class="blur-bg"></div>
      <div class="content-box"  >
        <div class="icon-text">
          <section class="iconx">
            <img src="../../assets/icon/other/Group 228.png" alt="" />
          </section>
          <div class="txt">{{ name }}</div>
        </div>
        <div class="text-box">
          <div class="text-box-item">
            Quantity- {{ props.count > 999 ? "999+" : props.count }}
          </div>
          <div class="text-box-item">{{ props.type }}</div>
          <div class="text-box-item short">
            {{
              new Date(props.date).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }}
          </div>
          <div class="text-box-item short">
            {{
              new Date(props.date).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            }}
          </div>
        </div>
      </div>
    </div>
    <div class="button-box">
      <div class="button view">
        <div class="button-x">
          <div class="blur-bg" @click="()=>{
            if (props.onProperties) {
              props.onProperties(props.name, props.type, props.count, props.date);
            }
          }" >Properties</div>
        </div>
      </div>
      <div class="button del">
        <div class="button-x">
          <div class="blur-bg" @click="()=>{
            if (props.onDrop) {
              props.onDrop(props.name, props.type, props.count, props.date);
            }
          }">Drop</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="css" src="./style.css"></style>
