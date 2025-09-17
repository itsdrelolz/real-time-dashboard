<template>
  <div class="auth-container">
    <div class="auth-background">
      <div class="auth-pattern"></div>
    </div>

    <div class="form-card">
      <div class="form-header">
        <div class="logo">
          <i class="pi pi-comments"></i>
        </div>
        <h1 class="form-title">Welcome Back</h1>
        <p class="form-subtitle">Sign in to your account to continue</p>
      </div>

      <form @submit.prevent="handleSubmit" class="form">
        <div class="field">
          <label for="email" class="field-label">Email Address</label>
          <InputText
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            autocomplete="email"
            class="modern-input"
          />
        </div>

        <div class="field">
          <label for="password" class="field-label">Password</label>
          <InputText
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            autocomplete="current-password"
            class="modern-input"
          />
        </div>

        <Button
          type="submit"
          label="Sign In"
          :loading="authStore.isLoading"
          class="submit-button"
          icon="pi pi-sign-in"
        />
      </form>

      <div class="link-container">
        <span class="link-text">Don't have an account?</span>
        <router-link to="/register" class="link">
          <i class="pi pi-user-plus"></i>
          Create Account
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    console.error('Email and password are required.')
    return
  }
  try {
    await authStore.signIn(email.value, password.value)
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 0;
}

.auth-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: float 20s ease-in-out infinite;
}

.form-card {
  width: 100%;
  max-width: 420px;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 1;
  animation: slideUp 0.6s ease-out;
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.form-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-subtitle {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
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

.field-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.modern-input :deep(.p-inputtext) {
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.875rem 1rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.modern-input :deep(.p-inputtext:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: white;
  transform: translateY(-1px);
}

.modern-input :deep(.p-inputtext::placeholder) {
  color: #94a3b8;
}

.submit-button {
  margin-top: 0.5rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  border-radius: 0.75rem;
  padding: 0.875rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.submit-button:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.link-container {
  margin-top: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

.link-text {
  color: #64748b;
  font-size: 0.875rem;
}

.link {
  color: #3b82f6;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  background: rgba(59, 130, 246, 0.1);
}

.link:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Responsive Design */
@media (max-width: 640px) {
  .form-card {
    margin: 1rem;
    padding: 2rem;
    border-radius: 1rem;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .logo {
    width: 3.5rem;
    height: 3.5rem;
    font-size: 1.25rem;
  }
}
</style>
