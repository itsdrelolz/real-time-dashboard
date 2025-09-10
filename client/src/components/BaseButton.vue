<template >
  <button
    :type="type"
    class="button"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup>

const props = defineProps({
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

</script>

<style scoped>




</style>
