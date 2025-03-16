<script setup>
import { autocompletion, completeFromList } from "@codemirror/autocomplete";
import { python } from "@codemirror/lang-python";
import { linter, lintGutter } from "@codemirror/lint";
import { ref, watchEffect } from "vue";
import { Codemirror } from "vue-codemirror";
const code = ref(``);
const props = defineProps({
  onText: {
    type: Function,
    require: false,
  },
  value: {
    type: String,
    require: false,
  },
  recommend: {
    type: Array,
    require: false,
  },
});
const pythonFunctions = [
  { label: "print", type: "function", detail: "Built-in print function" },
  { label: "len", type: "function", detail: "Returns length of an object" },
  { label: "range", type: "function", detail: "Generates a range of numbers" },
  { label: "my_function", type: "function", detail: "Your custom function" },
  { label: "import", type: "keyword", detail: "Import a module" },
  {
    label: "from cat import ConditionTypes",
    type: "class",
    detail: "Import Condition Type",
  },
  { label: "cat", type: "module", detail: "Import module" },
  {
    label: "from",
    type: "keyword",
    detail: "Import specific parts of a module",
  },
  { label: "return", type: "keyword", detail: "Return keyword" },
  {
    label: `return {
        "cat":"<-ConditionTypes->",
        "memo":memo
    }`,
    type: "keyword",
    detail: "Return object",
  },

  // Additional Built-in Functions
  { label: "sum", type: "function", detail: "Returns sum of an iterable" },
  { label: "map", type: "function", detail: "Applies a function to all items in an iterable" },
  { label: "filter", type: "function", detail: "Filters elements from an iterable" },
  { label: "sorted", type: "function", detail: "Returns a sorted list" },
  { label: "max", type: "function", detail: "Returns maximum value" },
  { label: "min", type: "function", detail: "Returns minimum value" },

  // More Keywords
  { label: "def", type: "keyword", detail: "Defines a function" },
  { label: "class", type: "keyword", detail: "Defines a class" },
  { label: "if", type: "keyword", detail: "Conditional statement" },
  { label: "elif", type: "keyword", detail: "Else if statement" },
  { label: "else", type: "keyword", detail: "Else statement" },
  { label: "try", type: "keyword", detail: "Try block for exceptions" },
  { label: "except", type: "keyword", detail: "Exception handling" },
  { label: "finally", type: "keyword", detail: "Block that runs after try/except" },
  { label: "with", type: "keyword", detail: "Context manager" },
  { label: "async", type: "keyword", detail: "Defines asynchronous function" },
  { label: "await", type: "keyword", detail: "Waits for an async function to finish" },
  { label: "for", type: "keyword", detail: "Loop statement" },
  { label: "while", type: "keyword", detail: "While loop" },
  { label: "pass", type: "keyword", detail: "Placeholder statement" },
  { label: "break", type: "keyword", detail: "Exits a loop" },
  { label: "continue", type: "keyword", detail: "Skips current iteration in loop" },
  { label: "yield", type: "keyword", detail: "Pauses function execution and returns value" },
  { label: "lambda", type: "keyword", detail: "Creates an anonymous function" },

  // Additional Modules
  { label: "math", type: "module", detail: "Math module for mathematical functions" },
  { label: "os", type: "module", detail: "OS module for interacting with the operating system" },
  { label: "sys", type: "module", detail: "Sys module for system-related functions" },
  { label: "json", type: "module", detail: "JSON module for parsing JSON data" },
  { label: "random", type: "module", detail: "Random module for generating random numbers" },
  { label: "datetime", type: "module", detail: "Datetime module for date and time operations" }
];


const ref_extensions = ref([]);
watchEffect(() => {
  if (props.value) {
    code.value = props.value;
  }
});

watchEffect(() => {
  ref_extensions.value = [...pythonFunctions, ...(props?.recommend ?? [])];
});

const generateClassMethods = (className, methods) => {
  return methods.map((method) => ({
    label: `${className}.${method}`,
    type: "method",
    detail: `Method of ${className}`,
  }));
};

const extensions = [
  python(),
  autocompletion({
    override: [completeFromList(ref_extensions.value)],
  }),
  lintGutter(),
  linter((view) => {
    const errors = [];
    const lines = view.state.doc.toString().split("\n");
    // lines.forEach((line, index) => {
    //   if (line.includes("print")) {
    //     errors.push({
    //       from: view.state.doc.line(index + 1).from,
    //       to: view.state.doc.line(index + 1).to,
    //       severity: "warning",
    //       message: "Avoid using print statements in production code.",
    //     });
    //   }
    // });
    return errors;
  }),
];

const handleTextChange = (newText) => {
  if (props.onText) {
    props.onText(newText);
  }
};
</script>

<template>
  <Codemirror
    v-model="code"
    :extensions="[
      python(),
      autocompletion({
        override: [completeFromList(ref_extensions)],
      }),
      lintGutter(),
      linter((view) => {
        const errors = [];
        const lines = view.state.doc.toString().split('\n');
        return errors;
      }),
    ]"
    placeholder="Write Python code..."
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="4"
    :line-numbers="true"
    class="editor"
    :style="{ width: '100%', height: '100%' }"
    @update:modelValue="handleTextChange"
  />
</template>

<style lang="css" src="./style.css"></style>
