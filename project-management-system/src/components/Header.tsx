import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import TaskFormModal from "./TaskFormModal";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const isIssuesPage = location.pathname.startsWith("/issues");
  const isBoardsPage = location.pathname.startsWith("/boards");

  return (
    <header className="sticky top-0 z-50 bg-white flex items-center justify-between border-b border-black px-6 py-4">
      <nav className="flex gap-6 text-xl font-semibold  lg:text-2xl">
        <button
          onClick={() => navigate("/issues")}
          className={isIssuesPage ? "text-red-600" : "text-black"}
        >
          Все задачи
        </button>
        <button
          onClick={() => navigate("/boards")}
          className={isBoardsPage ? "text-red-600" : "text-black"}
        >
          Проекты
        </button>
      </nav>

      <button
        onClick={() => setTaskModalOpen(true)}
        className="rounded border border-black px-4 py-1.5 text-black hover:bg-black hover:text-white transition  lg:text-xl"
      >
        Создать задачу
      </button>

      <TaskFormModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        mode="create"
        onSuccess={() => setTaskModalOpen(false)}
      />
    </header>
  );
};

export default Header;
