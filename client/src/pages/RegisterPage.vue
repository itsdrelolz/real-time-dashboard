<template>
  <div class="auth-container">
    <div class="form-card">
      <h1 class="form-title">Create an Account</h1>
      <form @submit.prevent="handleSubmit" class="form">
        <div class="field">
          <label for="displayName">Display Name</label>
          <InputText id="displayName" v-model="displayName" type="text" placeholder="Choose a public username" autocomplete="username" />
        </div>
        <div class="field">
          <label for="email">Email Address</label>
          <InputText id="email" v-model="email" type="email" placeholder="Enter your email" autocomplete="email" />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <InputText id="password" v-model="password" type="password" placeholder="Must be at least 6 characters" autocomplete="new-password" />
          <small v-if="passwordError" class="p-error">{{ passwordError }}</small>
        </div>
        <Button type="submit" label="Sign Up" :loading="authStore.isLoading" class="submit-button" />
      </form>
      <div class="link-container">
        Already have an account? <router-link to="/login" class="link">Log In</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const displayName = ref('');
const email = ref('');
const password = ref('');
const passwordError = ref('');
const authStore = useAuthStore();

const validatePassword = () => {
  if (password.value && password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters long.';
    return false;
  }
  passwordError.value = '';
  return true;
};

const handleSubmit = async () => {
  if (!validatePassword() || !email.value || !displayName.value) {
    console.error('Please fill out all fields correctly.');
    return;
  }
  try {
    await authStore.signUp(email.value, password.value, displayName.value);
  } catch (error) {
    console.error('Register failed:', error);
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f7fafc;
}

.form-card {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.form-title {
  font-size: 1.75rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: #1f2937;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-weight: 600;
  color: #4b5563;
}

.p-error {
  font-size: 0.875rem;
  color: var(--p-red-500);
}

.submit-button {
  margin-top: 1rem;
}

.link-container {
  margin-top: 1.5rem;
  text-align: center;
  color: #6b7280;
}

.link {
  color: var(--p-primary-color, #4f46e5);
  font-weight: 600;
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}
</style>
