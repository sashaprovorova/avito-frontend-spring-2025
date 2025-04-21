import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../api";
import { Task, Status } from "../types";
import TaskFormModal from "../components/TaskFormModal";
import {
  isEquivalentStatus,
  getStatusLabel,
  getStatusColor,
} from "../utils/status";

// отображает задачи выбранной доски в виде канбан доски с возможностью редактирования и перетаскивания
const BoardPage = () => {
  // получаем id доски из URL
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [boardName, setBoardName] = useState(location.state?.boardName || "");
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // загружаем задачи при монтировании компонента или смене id доски
    fetchTasks();
    // отменяем запрос при размонтировании
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [id, location.state?.refresh]);

  // получаем задачи текущей доски с сервера
  const fetchTasks = async () => {
    // отменяем предыдущий запрос, если он ещё не завершён
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // создаём новый AbortController для текущего запроса
    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
      const response = await api.get(`/boards/${id}`, {
        signal: controller.signal,
      });
      const data = response.data.data || [];
      setTasks(data);

      if (data.length > 0 && !boardName) {
        setBoardName(data[0].boardName);
      }
    } catch (err: any) {
      if (err.name === "CanceledError" || err.name === "AbortError") {
        console.log("Запрос был отменён");
      } else {
        console.error("Ошибка при загрузке задач доски", err);
      }
    }
  };

  // при клике на задачу открываем модальное окно
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  // после успешного создания/редактирования задачи обновляем список
  const handleSuccess = async () => {
    await fetchTasks();
    setShowForm(false);
    setSelectedTask(null);
  };

  // разрешаем перетаскивание задачи в колонку с другим статусом
  const allowDrop = (e: React.DragEvent<HTMLDivElement>, status: string) => {
    e.preventDefault();
    setDragOverStatus(status);
  };

  // обработка события дропа задачи
  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    newStatus: string
  ) => {
    e.preventDefault();
    setDragOverStatus(null);

    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find((t) => t.id.toString() === taskId);
    if (!task || isEquivalentStatus(task.status, newStatus)) return;

    // визуальный ToDo сохраняем как Backlog на сервере
    const backendStatus: Status =
      newStatus === "ToDo" ? Status.Backlog : (newStatus as Status);

    try {
      await api.put(`/tasks/updateStatus/${task.id}`, {
        status: backendStatus,
      });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: newStatus as Status } : t
        )
      );
    } catch (err) {
      console.error("Ошибка при обновлении статуса задачи", err);
    }
  };

  const statusColumns = ["ToDo", "InProgress", "Done"];

  return (
    <main className="p-6 space-y-6">
      {/* заголовок страницы — название проекта */}
      <h1 className="text-2xl font-bold">{boardName || "Проект"}</h1>

      {/* канбан доска с тремя колонками по статусам */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statusColumns.map((status) => (
          <div
            key={status}
            className={`space-y-2 border border-gray-300 p-3 rounded min-h-[150px] transition-colors ${
              dragOverStatus === status ? "bg-gray-100" : "bg-white"
            }`}
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={(e) => allowDrop(e, status)}
            onDragLeave={() => setDragOverStatus(null)}
          >
            {/* заголовок колонки */}
            <h2
              className={`text-lg lg:text-2xl font-semibold ${getStatusColor(
                status
              )}`}
            >
              {getStatusLabel(status)}
            </h2>
            {/* список задач в колонке */}
            <ul className="space-y-2">
              {tasks
                .filter((t) => isEquivalentStatus(t.status, status))
                .map((task) => (
                  <li
                    key={task.id}
                    className="border border-black p-3 rounded cursor-pointer hover:bg-gray-50"
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("taskId", task.id.toString())
                    }
                    onClick={() => handleTaskClick(task)}
                  >
                    <h3 className="font-medium lg:text-xl">{task.title}</h3>
                    <p className="text-sm lg:text-lg text-gray-600">
                      {task.description}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>
      {/* модальное окно для редактирования задачи */}
      {showForm && selectedTask && (
        <TaskFormModal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          mode="edit"
          isBoardPage={true}
          initialData={{
            id: selectedTask.id,
            title: selectedTask.title,
            description: selectedTask.description,
            boardId: selectedTask.boardId,
            status:
              selectedTask.status === Status.Backlog
                ? "ToDo"
                : selectedTask.status,
            priority: selectedTask.priority,
            assigneeId: selectedTask.assignee.id,
          }}
          boardName={boardName}
          showGoToBoard={false}
          onSuccess={handleSuccess}
        />
      )}
    </main>
  );
};

export default BoardPage;
