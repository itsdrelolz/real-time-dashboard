export interface Profile {
    id: string;
    email: string;
    role: 'ADMIN' | 'USER';
    firstName: string;
    lastName: string;
    displayName: string;
    handle: string;
}

export interface ProjectData {
    id: string; 
    name: string;
    ownerId: string;
    owner: Profile
}

export interface TaskData {
    id: string;
    name: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    projectId: string;
    project: ProjectData;
    createdAt: string;
    updatedAt: string;
    assigneeId: string;
    assignee: Profile;

}


export interface MessageData {
    id: string;
    content: string;
    senderId: string;
    sender: Profile;
    createdAt: string;
    updatedAt: string;
    taskId: string;
    task: TaskData;
}

