<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  autocomplete: {
    type: String,
    default: 'off'
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="field">
    <label v-if="label" class="label">{{ label }}</label>
    <p class="control has-icons-left" :class="{ 'has-icons-right': type === 'email' }">
      <input
        class="input"
        :type="type"
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
      >
      <span class="icon is-small is-left">
        <i class="fas" :class="{
          'fa-envelope': type === 'email',
          'fa-lock': type === 'password',
          'fa-user': type === 'text'
        }"></i>
      </span>
      <span v-if="type === 'email'" class="icon is-small is-right">
        <i class="fas fa-check"></i>
      </span>
    </p>
  </div>
</template>

<style scoped>
.input {
  background-color: white;
  color: #363636;
}

.label {
  color: #363636;
}
</style>
