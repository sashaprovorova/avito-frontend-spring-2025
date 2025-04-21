// types.ts

// TaskForm
export type TaskFormFields = {
  id?: number;
  title: string;
  description: string;
  boardId: number;
  priority: string;
  assigneeId: number;
  status: string;
};

export type TaskFormProps = {
  mode: "create" | "edit";
  initialData?: TaskFormFields;
  isBoardPage?: boolean;
  showGoToBoard?: boolean;
  boardName?: string;
  onGoToBoard?: () => void;
  onSuccess?: () => void;
};

export interface User {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
}

export type Assignee = User;

export enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export enum Status {
  Backlog = "Backlog",
  InProgress = "InProgress",
  Done = "Done",
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignee: Assignee;
  boardId: number;
  boardName: string;
}

// TaskFormModal
export type TaskFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: TaskFormFields;
  showGoToBoard?: boolean;
  onGoToBoard?: () => void;
  boardName?: string;
  onSuccess: () => void;
  isBoardPage?: boolean;
};

// IssuesPage, BoardsPage
export interface Board {
  id: number;
  name: string;
  description?: string;
  taskCount?: number;
}

export type TaskFields =
  | "title"
  | "description"
  | "boardId"
  | "priority"
  | "status"
  | "assigneeId";
