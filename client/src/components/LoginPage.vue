<script>

import { defineComponent } from 'vue'
import BaseButton from '@/components/BaseButton.vue'

export default defineComponent({
  components: { BaseButton }
})
</script>

<template>
<form @submit.prevent="handleSubmit">

  <Log

  <BaseButton>Log In</BaseButton>


</form>
</template>

<style scoped>

</style>
