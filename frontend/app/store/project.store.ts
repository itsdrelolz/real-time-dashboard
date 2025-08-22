import { create } from "zustand";
import type { Project } from "~/types/database.types";

interface ProjectState {
  selectedProject: Project | null;
  setSelectedProject: (project: Project) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),
}));
