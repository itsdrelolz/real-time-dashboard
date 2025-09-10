<template>
  <BaseForm @submit="handleSubmit">

    <BaseInput
      v-model="email"
      type="email"
      label="Email Address"
      placeholder="Enter your email"
      autocomplete="email"
    />
    <BaseInput
      v-model="password"
      type="password"
      label="Password"
      placeholder="Enter your password"
      autocomplete="current-password"
    />
    <BaseButton type="submit">Log In</BaseButton>
  </BaseForm>
</template>

<script setup>
import BaseForm from '@/components/BaseForm.vue'
import BaseButton from '@/components/BaseButton.vue'
import { ref } from 'vue'
import BaseInput from '@/components/BaseInput.vue'
import { useAuthStore } from '../stores/auth'

const email = ref('');
const password = ref('');
const authStore = useAuthStore();

const handleSubmit = async () => {
  try {
    await authStore.signIn(email.value, password.value)
  } catch (error) {
    console.error('Login failed:', error);
  }
};
</script>

<style scoped>
</style>
