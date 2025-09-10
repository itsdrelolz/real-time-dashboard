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

const email = ref('');
const password = ref('');


const handleSubmit = async () => {
  try {
    console.log('Attempting to register with:', { email: email.value, password: password.value });
    console.log('Register successful!');
  } catch (error) {
    console.error('Register failed:', error);
  }
};
</script>

<style scoped>
</style>
