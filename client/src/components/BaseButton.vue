<template>
  <button
    :type="type"
    :disabled="disabled"
    class="base-button"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'button'
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['click']);
</script>

<style scoped>
.base-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.base-button:hover {
  background-color: #f0f0f0;
}

.base-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
