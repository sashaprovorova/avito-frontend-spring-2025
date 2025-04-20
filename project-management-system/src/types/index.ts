// // types.ts

// TaskForm
export type TaskFormProps = {
  mode: "create" | "edit";
  initialData?: {
    title: string;
    description: string;
    boardId: number;
    priority: string;
    assigneeId: number;
    status: string;
  };
  isBoardPage?: boolean;
  showGoToBoard?: boolean;
  boardName?: string;
  onGoToBoard?: () => void;
  onSuccess?: () => void;
};

// Full user structure (used across Task + dropdowns)
export interface User {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
}

// You can alias it if needed
export type Assignee = User;

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "ToDo" | "InProgress" | "Done" | "Backlog";
  assignee: Assignee;
  boardId: number;
  boardName: string;
}

// types.ts

// export type TaskFormInitialData = {
//   id?: number;
//   title: string;
//   description: string;
//   boardId: number;
//   priority: string;
//   assigneeId: number;
//   status: string;
// };

// export type TaskFormProps = {
//   mode: "create" | "edit";
//   initialData?: TaskFormInitialData;
//   isBoardPage?: boolean;
//   showGoToBoard?: boolean;
//   boardName?: string;
//   onGoToBoard?: () => void;
//   onSuccess?: () => void;
// };

// export interface User {
//   id: number;
//   fullName: string;
//   email: string;
//   avatarUrl: string;
// }

// export type Assignee = User;

// export interface Task {
//   id: number;
//   title: string;
//   description: string;
//   priority: "Low" | "Medium" | "High";
//   status: "ToDo" | "InProgress" | "Done" | "Backlog";
//   assignee: Assignee;
//   boardId: number;
//   boardName: string;
// }
