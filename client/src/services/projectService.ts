import type { ProjectData } from "../types";
import apiFetch from "./apiClient";


export const getProjects = async () => {
    const projects = await apiFetch("/workspaces");
    return projects;
}

export const getProjectById = async (id: string) => {
    const project = await apiFetch(`/projects/${id}`);
    return project;
}

export const createProject = async (project: ProjectData) => {
    if (!project || !project.name || !project.ownerId) {
        throw new Error("Project name and owner ID are required");
    }
    const newProject = await apiFetch("/workspaces", {
        method: "POST",
        body: JSON.stringify(project),
    });
    return newProject;
}

export const updateProject = async (project: ProjectData) => {
    if (!project.id) {
        throw new Error("Project ID is required");
    }
    const updatedProject = await apiFetch(`/projects/${project.id}`, {
        method: "PATCH",
        body: JSON.stringify(project),
    });
    return updatedProject;
}

export const deleteProject = async (id: string) => {
    const deletedProject = await apiFetch(`/projects/${id}`, {
        method: "DELETE",
    });
    return deletedProject;
}