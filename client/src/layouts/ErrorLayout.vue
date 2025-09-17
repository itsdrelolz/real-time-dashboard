<template>
  <div class="error-container">
    <div class="error-card">
      <i class="pi pi-wifi-off error-icon"></i>
      <h1 class="error-title">Connection Error</h1>
      <p class="error-message">
        Could not connect to the server. The application may be temporarily down for maintenance.
      </p>
      <p class="error-message">Please try again later.</p>
    </div>
  </div>
</template>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f7fafc;
  text-align: center;
}

.error-card {
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.error-icon {
  font-size: 4rem;
  color: #ef4444; /* Red-500 */
  margin-bottom: 1.5rem;
}

.error-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
}

.error-message {
  font-size: 1.125rem;
  color: #6b7280;
}
</style>
