import { defineNuxtPlugin } from "#app";
import { Chart } from "chart.js";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("chart", Chart);
});
