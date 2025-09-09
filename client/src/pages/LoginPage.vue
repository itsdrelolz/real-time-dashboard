<template>
  <BaseForm @submit="handleSubmit">
    <BaseInput
      v-model="email"
      type="email"
      label="Email Address"
      placeholder="Enter Email"
      autocomplete="email"
    />
    <BaseInput
      v-model="password"
      type="password"
      label="Password"
      autocomplete="current-password"
    />
    <BaseButton type="submit">Log In</BaseButton>
  </BaseForm>
</template>

<script setup>
import BaseForm from '@/components/BaseForm.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import { ref } from 'vue'

const email = ref('');
const password = ref('');

const handleSubmit = async () => {
  try {
    console.log('Attempting to log in with:', { email: email.value, password: password.value });
    console.log('Login successful!');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
</script>

<style scoped>
</style>
