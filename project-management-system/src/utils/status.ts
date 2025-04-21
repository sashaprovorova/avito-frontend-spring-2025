import { Status } from "../types";

// проверяем эквивалентность статусов с учётом визуального отображения: статус Backlog отображается как ToDo, поэтому считаем их равными

export const isEquivalentStatus = (
  taskStatus: string,
  columnStatus: string
): boolean => {
  return (
    (taskStatus === Status.Backlog && columnStatus === "ToDo") ||
    (taskStatus === "ToDo" && columnStatus === Status.Backlog) ||
    taskStatus === columnStatus
  );
};

// добавляем пробел перед тем как выводить на экран

export const getStatusLabel = (status: string): string => {
  if (status === "ToDo" || status === Status.Backlog) return "To do";
  if (status === "InProgress") return "In progress";
  return "Done";
};

// возвращаем цвет текста для заголовка колонки в зависимости от статуса

export const getStatusColor = (status: string): string => {
  if (status === "ToDo" || status === Status.Backlog) return "text-orange-500";
  if (status === "InProgress") return "text-yellow-500";
  return "text-green-500";
};
