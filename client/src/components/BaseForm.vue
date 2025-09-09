
<template>
  <form @submit.prevent="$emit('submit', $event)">
  <slot></slot>
  </form>
</template>

<script>
</script>
