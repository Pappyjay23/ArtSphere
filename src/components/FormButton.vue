<script setup>
defineProps({
  text: String,
  type: String,
  children: String,
})
</script>

<template>
  <button
    :type="type"
    class="bg-blue-500 px-5 py-4 rounded-[4px] text-[80%] w-full transition-all duration-500 ease-in-out flex justify-center items-center"
  >
    {{ text }}<slot></slot>
  </button>
</template>

<style>
</style>