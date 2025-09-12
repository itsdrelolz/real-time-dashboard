import { ref, computed} from 'vue'
import { defineStore} from 'pinia'

export const useProjectStore = defineStore('project', () => {

  const projects = ref(null)
  const isLoading = ref(false)
  const error = ref(null)



  async function getProjects() {

  }

  async function getProjectById(projectId)  {

  }


  async function createProjects() {

  }


  async function updateProjects() {

  }


  async function deleteProjects() {

  }





return {
    getProjects,
    getProjectById,
    createProjects,
    updateProjects,
    deleteProjects
}

})
