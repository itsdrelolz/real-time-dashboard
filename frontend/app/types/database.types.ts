export type Role = "ADMIN" | "MEMBER";
export type Status = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELED";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

// Main table types
export type Profile = {
  id: string;
  email: string;
  role: Role;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
};

export type Project = {
  id: number;
  name: string;
  ownerId: string;
};

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  projectId: number;
  assigneeId: string | null;
};


