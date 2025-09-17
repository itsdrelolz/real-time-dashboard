import { defineStore } from 'pinia';
import { ref } from 'vue';
import { checkBackendHealth } from '@/services/healthService';

export const useAppStateStore = defineStore('appState', () => {
  const isBackendHealthy = ref(true); // Assume it's healthy until a check fails
  const isCheckingHealth = ref(true); // Start in a loading state

  /**
   * Performs a health check against the backend.
   * Updates the isBackendHealthy state based on the result.
   */
  async function performHealthCheck() {
    isCheckingHealth.value = true;
    try {
      await checkBackendHealth();
      isBackendHealthy.value = true;
    } catch (error) {
      console.error("Backend health check failed:", error);
      isBackendHealthy.value = false;
    } finally {
      isCheckingHealth.value = false;
    }
  }

  return {
    isBackendHealthy,
    isCheckingHealth,
    performHealthCheck,
  };
});
