<script setup>
defineProps({
  type: String,
  placeholder: String,
  modelValue: String,
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
    required
    class="bg-white/20 px-5 py-2 rounded-[4px] text-[80%] border-0 outline-none w-full"
  />
</template>



<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-text-fill-color: white !important;
  caret-color: white;
  transition: background-color 5000s ease-in-out 0s;
}
</style>