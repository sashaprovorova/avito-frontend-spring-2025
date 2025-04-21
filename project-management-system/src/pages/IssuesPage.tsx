import React, { useEffect, useState } from "react";
import api from "../api";
import TaskForm from "../components/TaskForm";
import { useNavigate } from "react-router-dom";
import { Task, User } from "../types";
import TaskFormModal from "../components/TaskFormModal";
import { Board } from "../types/index";
import { isEquivalentStatus, getStatusLabel } from "../utils/status";

// отображаем и фильтруем все задачи с возможностью создания/редактирования
const IssuesPage = () => {
  // состояния для хранения задач, отфильтрованных задач, досок, пользователей
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  // состояния для фильтров и поиска
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [boardFilter, setBoardFilter] = useState<number | null>(null);

  // состояния для модального окна редактирования/создания задачи
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  // загружаем все данные при монтировании: задачи, доски, пользователей
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, boardsRes, usersRes] = await Promise.all([
          api.get("/tasks"),
          api.get("/boards"),
          api.get("/users"),
        ]);

        setTasks(tasksRes.data?.data || []);
        setBoards(boardsRes.data?.data || []);
        setUsers(usersRes.data?.data || []);
      } catch (err) {
        console.error("Ошибка при загрузке данных", err);
      }
    };

    fetchData();
  }, []);

  // фильтруем задачи при изменении состояния
  useEffect(() => {
    let result = [...tasks];

    // фильтр по статусу
    if (statusFilter) {
      const filterValue =
        statusFilter === "ToDo" ? ["ToDo", "Backlog"] : [statusFilter];
      result = result.filter((task) => filterValue.includes(task.status));
    }
    // фильтруем по доске
    if (boardFilter) {
      result = result.filter((task) => task.boardId === boardFilter);
    }

    //  фильтруем по поисковому запросу
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(s) ||
          task.assignee?.fullName.toLowerCase().includes(s)
      );
    }

    setFilteredTasks(result);
  }, [search, statusFilter, boardFilter, tasks]);

  // открываем модальное окно для редактирования задачи
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  // обновляем задачи после успешного создания или редактирования
  const handleSuccess = async () => {
    const updatedTasks = await api.get("/tasks");
    setTasks(updatedTasks.data?.data || []);
    setShowForm(false);
    setSelectedTask(null);
  };

  return (
    <main className="p-6 space-y-4 max-w-5xl mx-auto">
      {/* фильтры */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:text-lg">
        <input
          type="text"
          placeholder="Поиск"
          className="border px-3 py-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded lg:text-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Все статусы</option>
          <option value="ToDo">To do</option>
          <option value="InProgress">In progress</option>
          <option value="Done">Done</option>
        </select>

        <select
          className="border px-3 py-2 rounded lg:text-lg"
          value={boardFilter || 0}
          onChange={(e) => setBoardFilter(Number(e.target.value))}
        >
          <option value={0}>Все проекты</option>
          {boards.map((board) => (
            <option key={board.id} value={board.id}>
              {board.name}
            </option>
          ))}
        </select>
      </div>

      {/* список задач */}
      <ul className="space-y-2">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="border border-black p-4 rounded cursor-pointer hover:bg-gray-50"
            onClick={() => handleTaskClick(task)}
          >
            <h3 className="font-semibold lg:text-2xl font ">{task.title}</h3>
            <p className="text-sm lg:text-lg text-gray-500">
              {task.description}
            </p>
            <p className="text-xs lg:text-lg text-gray-400">
              Статус: {getStatusLabel(task.status)} | Проект: {task.boardName} |
              Исполнитель: {task.assignee?.fullName}
            </p>
          </li>
        ))}
      </ul>

      {/* модальное окно для создания/редактирования задачи */}
      <TaskFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        mode={selectedTask ? "edit" : "create"}
        initialData={
          selectedTask
            ? {
                id: selectedTask.id,
                title: selectedTask.title,
                description: selectedTask.description,
                boardId: selectedTask.boardId,
                status: selectedTask.status,
                priority: selectedTask.priority || "Medium",
                assigneeId: selectedTask.assignee?.id || 0,
              }
            : undefined
        }
        onSuccess={handleSuccess}
        showGoToBoard={!!selectedTask}
        onGoToBoard={() =>
          navigate(`/board/${selectedTask?.boardId}`, {
            state: {
              boardName: boards.find((b) => b.id === selectedTask?.boardId)
                ?.name,
              refresh: true,
            },
          })
        }
        boardName={boards.find((b) => b.id === selectedTask?.boardId)?.name}
      />

      {/* кнопка создания новой задачи */}
      <button
        onClick={() => {
          setSelectedTask(null);
          setShowForm(true);
        }}
        className="fixed bottom-6 right-10 bg-black text-white px-6 py-2 rounded shadow-lg hover:bg-gray-800 transition lg:text-xl"
        aria-label="Создать задачу"
      >
        Создать задачу
      </button>
    </main>
  );
};

export default IssuesPage;
