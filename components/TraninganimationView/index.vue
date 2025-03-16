<template>
  <div class="traning-aniamtion">
    <div class="part">
      <img class="br" src="../../assets/animation/traning/Group 4.png" alt="" />
    </div>
    <div class="part">
      <div class="gear-box">
        <img
          class="gear"
          src="../../assets/animation/traning/Union 1.png"
          alt=""
        />
      </div>
      <img
        class="traning-n"
        src="../../assets/animation/traning/Path 9.png"
        alt=""
      />
    </div>
  </div>
</template>
<style scoped>
.traning-aniamtion {
  height: 100%;
  aspect-ratio: 1/1;
  position: relative;
  display: flex;
}
.traning-aniamtion .part {
  position: relative;
  width: 50%;
}
.traning-aniamtion .part:nth-child(1) {
}
.traning-aniamtion .part:nth-child(2) {
}
.traning-aniamtion .part:nth-child(2) .gear-box {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: absolute;
}
.traning-aniamtion .part:nth-child(2) > .gear-box > .gear {
  height: 100%;
  width: 200%;
  transform: translateX(-55%) rotate(0);
  animation: gear-rotate 10s linear infinite;
}
.traning-aniamtion .part:nth-child(2) .traning-n {
  position: relative;
  transform: scale(0.58) translateX(-56%) translateY(-0);
  width: 120%;
}
.traning-aniamtion .part:nth-child(1) {
  z-index: 111111;
}
.traning-aniamtion .part:nth-child(1) > .br {
  height: 100%;
  width: 140%;
  transform: scale(0.99) translateX(2%) translateY(-0%);
}

@keyframes gear-rotate {
  0% {
    transform: translateX(-50%) rotate(0);
  }

  100% {
    transform: translateX(-50%) rotate(360deg);
  }
}
</style>
