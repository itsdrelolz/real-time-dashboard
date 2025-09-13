<template>
  <div class="auth-container">
    <div class="form-card">
      <h1 class="form-title">Log In!</h1>
      <form @submit.prevent="handleSubmit" class="form">
        <div class="field">
          <label for="email">Email Address</label>
          <InputText id="email" v-model="email" type="email" placeholder="Enter your email" autocomplete="email" />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <InputText id="password" v-model="password" type="password" placeholder="Enter your password" autocomplete="current-password" />
        </div>
        <Button type="submit" label="Log In" :loading="authStore.isLoading" class="submit-button" />
      </form>
      <div class="link-container">
        Don't have an account? <router-link to="/register" class="link">Sign Up</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const authStore = useAuthStore();

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    console.error('Email and password are required.');
    return;
  }
  try {
    await authStore.signIn(email.value, password.value);
  } catch (error) {
    console.error('Login failed:', error);
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
