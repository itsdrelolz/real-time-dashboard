<template>
  <form @submit.prevent="handleSubmit" class="edit-task-form">
    <div class="form-group">
      <label for="title" class="form-label">Title *</label>
      <InputText
        id="title"
        v-model="formData.title"
        placeholder="Enter task title"
        :class="{ 'p-invalid': errors.title }"
        class="form-input"
      />
      <small v-if="errors.title" class="error-message">{{ errors.title }}</small>
    </div>

    <div class="form-group">
      <label for="description" class="form-label">Description</label>
      <Textarea
        id="description"
        v-model="formData.description"
        placeholder="Enter task description (optional)"
        rows="3"
        class="form-textarea"
      />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="status" class="form-label">Status</label>
        <Dropdown
          id="status"
          v-model="formData.status"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          placeholder="Select status"
          class="form-dropdown"
        />
      </div>

      <div class="form-group">
        <label for="priority" class="form-label">Priority</label>
        <Dropdown
          id="priority"
          v-model="formData.priority"
          :options="priorityOptions"
          option-label="label"
          option-value="value"
          placeholder="Select priority"
          class="form-dropdown"
        />
      </div>
    </div>

    <div class="form-group">
      <label for="assigneeId" class="form-label">Assignee</label>
      <Dropdown
        id="assigneeId"
        v-model="formData.assigneeId"
        :options="assigneeOptions"
        option-label="displayName"
        option-value="id"
        placeholder="Select assignee (optional)"
        class="form-dropdown"
      />
    </div>

    <div class="form-actions">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="$emit('cancel')"
        class="cancel-button"
      />
      <Button
        type="submit"
        label="Update Task"
        :loading="isSubmitting"
        class="submit-button"
      />
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useTaskStore } from '@/stores/task'
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['task-updated', 'cancel'])

const taskStore = useTaskStore()
const projectStore = useProjectStore()

const { currentProject } = storeToRefs(projectStore)

const isSubmitting = ref(false)
const errors = ref({})

const formData = reactive({
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  assigneeId: null
})

const statusOptions = [
  { label: 'To Do', value: 'TODO' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Done', value: 'DONE' },
  { label: 'Canceled', value: 'CANCELED' }
]

const priorityOptions = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' }
]

const assigneeOptions = ref([])

// Initialize form data when task prop changes
watch(() => props.task, (newTask) => {
  if (newTask) {
    formData.title = newTask.title || ''
    formData.description = newTask.description || ''
    formData.status = newTask.status || 'TODO'
    formData.priority = newTask.priority || 'MEDIUM'
    formData.assigneeId = newTask.assigneeId || null
  }
}, { immediate: true })

onMounted(async () => {
  // Load project members for assignee dropdown
  if (currentProject.value?.members) {
    assigneeOptions.value = currentProject.value.members.map(member => ({
      id: member.profileId,
      displayName: member.profile?.displayName || member.profile?.email || 'Unknown'
    }))
  }
})

function validateForm() {
  errors.value = {}

  if (!formData.title.trim()) {
    errors.value.title = 'Title is required'
  }

  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  errors.value = {}

  try {
    const updateData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      status: formData.status,
      priority: formData.priority,
      assigneeId: formData.assigneeId || null
    }

    const updatedTask = await taskStore.updateTask(props.task.id, updateData)
    emit('task-updated', updatedTask)
  } catch (err) {
    console.error('Failed to update task:', err)
    if (err.response?.data?.error) {
      errors.value.general = err.response.data.error
    } else {
      errors.value.general = 'Failed to update task. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.edit-task-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  font-weight: 500;
  color: #e2e8f0;
  font-size: 0.875rem;
}

.form-input,
.form-textarea,
.form-dropdown {
  width: 100%;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-button {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #94a3b8;
}

.cancel-button:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
}

.submit-button {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  color: white;
  font-weight: 500;
}

.submit-button:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
}
</style>
