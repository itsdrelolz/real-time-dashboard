<template>
  <BaseForm @submit="handleSubmit">
    <BaseInput
      v-model="name"
      type="text"
      label="Username"
      placeholder="Enter your username"
      autocomplete="username"
    />
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
      autocomplete="new-password"
    />
    <BaseButton type="submit">Sign Up</BaseButton>
  </BaseForm>
</template>

<script setup>
import BaseForm from '@/components/BaseForm.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const name = ref('');
const email = ref('');
const password = ref('');

const authStore = useAuthStore();



const handleSubmit = async () => {
  try {
    await authStore.signUp(email.value, password.value)
  } catch (error) {
    console.error('Register failed:', error);
  }
};
</script>

<style scoped>
</style>
