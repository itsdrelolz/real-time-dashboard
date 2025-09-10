<template>
  <div class="form-container">
    <form @submit.prevent="$emit('submit', $event)" class="form">
      <slot></slot>
    </form>
  </div>
</template>

<style>
.form-container {
  max-width: 400px;
  margin: 4rem auto 2rem;
  border-radius: 6px;
  padding: 2rem 2rem;
  background-color: #fff;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.form :deep(.field) {
  width: 100%;
}

.form :deep(.button) {
  width: 100%;
  margin-top: 1rem;
}
</style>
