import { createContext, useContext, type Component, type JSX } from "solid-js";
import { type ProjectData } from "../types";
import { createStore } from "solid-js/store";
import * as ProjectService from "../services/projectService";


type ProjectState = {
    projects: ProjectData[];
    isLoading: boolean;
    error: string | null;
}


type ProjectContextValue = [
    state: ProjectState,
    actions: {
        getProjects: () => Promise<void>;
        getProjectById: (id: string) => Promise<void>;
        createProject: (project: ProjectData) => Promise<void>;
        updateProject: (project: ProjectData) => Promise<void>;
        deleteProject: (id: string) => Promise<void>;
    }
]

const ProjectContext = createContext<ProjectContextValue>();

export const ProjectProvider: Component<{ children: JSX.Element }> = (props) => {
    const [state, setState] = createStore<ProjectState>({
        projects: [],
        isLoading: true,
        error: null,
    });

    const actions = {
        async getProjects() {
            const projects = await ProjectService.getProjects();
            setState({ projects });
        },
        async getProjectById(id: string) {
            const project = await ProjectService.getProjectById(id);
            setState({ projects: [...state.projects, project] });
        },
        async createProject(project: ProjectData) {
            const newProject = await ProjectService.createProject(project);
            setState({ projects: [...state.projects, newProject] });
        },
        async updateProject(project: ProjectData) {
            const updatedProject = await ProjectService.updateProject(project);
            setState({ projects: state.projects.map(p => p.id === project.id ? updatedProject : p) });
        },
        async deleteProject(id: string) {
            await ProjectService.deleteProject(id);
            setState({ projects: state.projects.filter(p => p.id !== id) });
        }
    };

    const store: ProjectContextValue = [state, actions];

    return (
        <ProjectContext.Provider value={store}>
            {props.children}
        </ProjectContext.Provider>
    );
};


export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProject must be used within a ProjectProvider");
    }
    return context;
};


export default ProjectContext;