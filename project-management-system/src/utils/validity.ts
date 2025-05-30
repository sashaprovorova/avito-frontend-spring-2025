import { TaskFields } from "../types";

// валидируем значения конкретных полей формы
export const validateField = (
  field: TaskFields,
  value: string | number,
  mode: "create" | "edit" = "create"
) => {
  switch (field) {
    case "title":
      return value.toString().trim() ? "" : "Введите название задачи.";
    case "description":
      return value.toString().trim() ? "" : "Введите описание задачи.";
    case "boardId":
      // только проверяем в режиме создания
      return mode === "create" && value === 0 ? "Выберите проект." : "";
    case "priority":
      return value ? "" : "Выберите приоритет.";
    case "status":
      return value ? "" : "Выберите статус.";
    case "assigneeId":
      return value !== 0 ? "" : "Выберите исполнителя.";
    default:
      return "";
  }
};
