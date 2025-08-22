import React, { useState, useEffect } from "react";
import { useAuthStore } from "~/store/auth.store"
import { useProjectStore } from "~/store/project.store";
import type { Project } from "~/types/database.types";
export function Sidebar() { 
    
    const [ projects, setProjects] = useState<Project[]>([]);
    const [error, setError] = useState<string | null>(null);
    const setSelectedProject = useProjectStore((state) => state.setSelectedProject);
    useEffect(() => {
    async function fetchProjects() {
	try { 
	const session = useAuthStore.getState().session;

	if (!session) { 
	console.error("No active session found");
	return 
	}
	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, { 
    method: "GET", 
    headers: { 
	    "Content-Type": "application/json", 
	    "Authorization": `Bearer ${session.access_token}`, 
	},
	});

	if (!response.ok) { 
	     const errorData = await response.json();
      console.error("Failed to fetch projects:", errorData.message);
      return;
    }

    const data = await response.json();
    setProjects(data.projects);
    console.log("Projects:", data.projects);
    return data.projects;

  } catch (err) {
    console.error("Network error:", err);
    setError("Network error. Could not connect to the server.");
  }
}
	fetchProjects(); 
    }, []); 

    
    const handleProjectClick = (project: Project) => { 
	setSelectedProject(project); 
}

    return ( 
<div className="flex flex-col h-full p-4 bg-gray-100 dark:bg-gray-800">
      <div className="flex-grow">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        {error && <p className="text-red-500">{error}</p>}
        <ul>
          {projects.map((project) => (
            <li key={project.id} className="mb-2">
              <button
                onClick={() => handleProjectClick(project)}
                className="w-full text-left px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {project.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button className="w-full text-left px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Direct Messages
        </button>
      </div>
    </div>
  );
}
