import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import { validateField } from "../utils/validity";
import { User, Task, TaskFormProps, TaskFields } from "../types";

// создаем и редактируем задачи
const TaskForm: React.FC<TaskFormProps> = ({
  mode,
  initialData,
  isBoardPage,
  showGoToBoard,
  boardName,
  onGoToBoard,
  onSuccess,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [boards, setBoards] = useState<{ id: number; name: string }[]>([]);
  const [boardId, setBoardId] = useState(initialData?.boardId || 0);
  const [priority, setPriority] = useState(initialData?.priority || "");
  const [status, setStatus] = useState(
    initialData?.status === "Backlog" ? "ToDo" : initialData?.status || ""
  );
  const [assigneeId, setAssigneeId] = useState(initialData?.assigneeId || 0);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<TaskFields, string>>>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  // находим имя доски по id или используем переданное имя
  const currentBoardName =
    boards.find((b) => b.id === boardId)?.name || boardName || "Текущий проект";

  // загружаем пользователей и доски при монтировании формы
  useEffect(() => {
    const fetchData = async () => {
      // отменяем предыдущий запрос при повторном вызове
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      try {
        const [usersRes, boardsRes] = await Promise.all([
          api.get("/users"),
          api.get("/boards"),
        ]);
        setUsers(usersRes.data?.data || []);
        setBoards(boardsRes.data?.data || []);
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Запрос отменён");
        } else {
          console.error("Ошибка при загрузке данных", err);
        }
      }
    };
    fetchData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // валидируем отдельные поля
  const handleValidation = (name: TaskFields, value: string | number) => {
    const error = validateField(name, value, mode);
    setErrors((prev) => ({ ...prev, [name]: error || "" }));
  };

  // обрабатываем отправку формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // собираем поля и валидируем
    const fields: Record<TaskFields, string | number> = {
      title,
      description,
      boardId,
      priority,
      status,
      assigneeId,
    };

    let valid = true;
    const newErrors: Partial<Record<TaskFields, string>> = {};

    for (const key in fields) {
      const field = key as TaskFields;
      const message = validateField(field, fields[field], mode);
      if (message) {
        newErrors[field] = message;
        valid = false;
      }
    }

    setErrors(newErrors);
    if (!valid) return;

    // готовим данные для запроса
    const payload = {
      title,
      description,
      boardId,
      priority,
      assigneeId,
      status: status === "ToDo" ? "Backlog" : status,
    };

    try {
      setLoading(true);
      // создаем задачу с нуля
      if (mode === "create") {
        await api.post("/tasks/create", payload);
      }
      // обновляем задачу
      else if (mode === "edit" && initialData?.id) {
        await api.put(`/tasks/update/${initialData.id}`, payload);
      }

      // вызываем коллбек и очищаем форму
      onSuccess?.();
      setTitle("");
      setDescription("");
      setBoardId(0);
      setPriority("");
      setStatus("");
      setAssigneeId(0);
      setErrors({});
    } catch (err: any) {
      console.error("Ошибка при создании задачи", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* заголовок формы */}
      <h2 className="text-2xl font-bold">
        {mode === "edit" ? "Редактирование задачи" : "Создание задачи"}
      </h2>
      {/* список полей */}
      <ul className="space-y-4 list-none p-0">
        {/* название */}
        <li>
          <label htmlFor="task-title" className="visually-hidden">
            Название
          </label>
          <input
            id="task-title"
            aria-describedby={errors.title ? "error-title" : undefined}
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              handleValidation("title", e.target.value);
            }}
            placeholder="Название"
          />
          {errors.title && (
            <p id="error-title" className="text-red-500 text-sm" role="alert">
              {errors.title}
            </p>
          )}
        </li>
        {/* описание */}
        <li>
          <label htmlFor="task-description" className="visually-hidden">
            Описание
          </label>
          <textarea
            id="task-description"
            aria-describedby={
              errors.description ? "error-description" : undefined
            }
            className="w-full border rounded px-3 py-2"
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              handleValidation("description", e.target.value);
            }}
            placeholder="Описание"
          />
          {errors.description && (
            <p
              id="error-description"
              className="text-red-500 text-sm"
              role="alert"
            >
              {errors.description}
            </p>
          )}
        </li>
        {/* проект */}
        <li>
          <label htmlFor="task-board" className="visually-hidden">
            Проект
          </label>
          <select
            id="task-board"
            aria-describedby={errors.boardId ? "error-boardId" : undefined}
            className="w-full border rounded px-3 py-2"
            value={boardId}
            disabled={isBoardPage}
            onChange={(e) => {
              const value = Number(e.target.value);
              setBoardId(value);
              handleValidation("boardId", value);
            }}
          >
            <option value={boardId}>{currentBoardName}</option>
            {!isBoardPage &&
              boards
                .filter((b) => b.id !== boardId)
                .map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))}
          </select>
          {errors.boardId && (
            <p id="error-boardId" className="text-red-500 text-sm" role="alert">
              {errors.boardId}
            </p>
          )}
        </li>
        {/* приоритет */}
        <li>
          <label htmlFor="task-priority" className="visually-hidden">
            Приоритет
          </label>
          <select
            id="task-priority"
            aria-describedby={errors.priority ? "error-priority" : undefined}
            className="w-full border rounded px-3 py-2"
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              handleValidation("priority", e.target.value);
            }}
          >
            <option value="" disabled>
              Приоритет
            </option>
            <option value="High">Высокий</option>
            <option value="Medium">Средний</option>
            <option value="Low">Низкий</option>
          </select>
          {errors.priority && (
            <p
              id="error-priority"
              className="text-red-500 text-sm"
              role="alert"
            >
              {errors.priority}
            </p>
          )}
        </li>
        {/* статус */}
        <li>
          <label htmlFor="task-status" className="visually-hidden">
            Статус
          </label>
          <select
            id="task-status"
            aria-describedby={errors.status ? "error-status" : undefined}
            className="w-full border rounded px-3 py-2"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              handleValidation("status", e.target.value);
            }}
          >
            <option value="" disabled>
              Статус
            </option>
            <option value="ToDo">To Do</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          {errors.status && (
            <p id="error-status" className="text-red-500 text-sm" role="alert">
              {errors.status}
            </p>
          )}
        </li>
        {/* исполнитель */}
        <li>
          <label htmlFor="task-assignee" className="visually-hidden">
            Исполнитель
          </label>
          <select
            id="task-assignee"
            aria-describedby={
              errors.assigneeId ? "error-assigneeId" : undefined
            }
            className="w-full border rounded px-3 py-2"
            value={assigneeId}
            onChange={(e) => {
              const value = Number(e.target.value);
              setAssigneeId(value);
              handleValidation("assigneeId", value);
            }}
          >
            <option value={0} disabled>
              Исполнитель
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName}
              </option>
            ))}
          </select>
          {errors.assigneeId && (
            <p
              id="error-assigneeId"
              className="text-red-500 text-sm"
              role="alert"
            >
              {errors.assigneeId}
            </p>
          )}
        </li>
      </ul>
      {/* кнопки перейти на доску и сохранить */}
      <div className="flex justify-between items-center pt-4">
        {showGoToBoard && onGoToBoard ? (
          <button
            type="button"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white"
            onClick={onGoToBoard}
          >
            Перейти на доску
          </button>
        ) : (
          <span />
        )}

        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white"
          disabled={loading || Object.values(errors).some(Boolean)}
        >
          {loading ? "Сохраняем..." : mode === "edit" ? "Обновить" : "Создать"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
