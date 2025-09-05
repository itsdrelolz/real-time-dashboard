
<template>
  <form @submit.prevent="$emit('submit', $event)">
  <slot></slot>
  </form>
</template>

<script>
import { defineEmit } from 'vue'

defineEmit(['submit'])
</script>
