<template>
  <div class="chart-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
const props = defineProps({
  list_of_ep: {
    type: Array,
    require: false,
    default: [],
  },
  list_of_data: {
    type: Array,
    require: false,
    default: [],
  },
  head: {
    type: String,
    require: false,
  },
});
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { ref, watchEffect } from "vue";
import { Line } from "vue-chartjs";
function setData(x = [], y = []) {
  return {
    labels: x,
    datasets: [
      {
        label: props.head ?? "Demo",
        data: y,
        fill: false,
        borderColor: "rgb(255, 94, 0)",
        tension: 0.35,
      },
    ],
  };
}
const chartData = ref(setData());

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      enabled: true,
    },
  },
};

watchEffect(() => {
  chartData.value = setData(props.list_of_ep, props.list_of_data);
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
