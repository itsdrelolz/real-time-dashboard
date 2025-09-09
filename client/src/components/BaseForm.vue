
<template>
  <form @submit.prevent="$emit('submit', $event)">
  <slot></slot>
  </form>
</template>

<script>
</script>

<style>
form {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  align-items: center;
  align-self: center;
  border: 1rem black;
  

}
</style>
