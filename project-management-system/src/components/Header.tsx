import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import TaskFormModal from "./TaskFormModal";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  // проверяем, находится ли пользователь на странице задач или на странице проектов
  const isIssuesPage = location.pathname.startsWith("/issues");
  const isBoardsPage = location.pathname.startsWith("/boards");

  return (
    <header className="sticky top-0 z-50 bg-white flex items-center justify-between border-b border-black px-6 py-4">
      {/* навигация между страницами */}
      <nav className="flex gap-6 text-xl font-semibold lg:text-2xl">
        <button
          onClick={() => navigate("/issues")}
          // выделяем текущую страницу
          className={isIssuesPage ? "text-red-600" : "text-black"}
        >
          Все задачи
        </button>
        <button
          onClick={() => navigate("/boards")}
          // выделяем текущую страницу
          className={isBoardsPage ? "text-red-600" : "text-black"}
        >
          Проекты
        </button>
      </nav>

      {/* кнопка для открытия модального окна создания задачи */}
      <button
        onClick={() => setTaskModalOpen(true)}
        className="rounded border border-black px-4 py-1.5 text-black hover:bg-black hover:text-white transition lg:text-xl"
      >
        Создать задачу
      </button>

      {/* модальное окно с формой создания задачи */}
      <TaskFormModal
        isOpen={taskModalOpen}
        // закрытие при отмене или успешной отправке
        onClose={() => setTaskModalOpen(false)}
        onSuccess={() => setTaskModalOpen(false)}
        // режим создания задачи
        mode="create"
      />
    </header>
  );
};

export default Header;
