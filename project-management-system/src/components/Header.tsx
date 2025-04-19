import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import TaskFormModal from "./TaskFormModal";

const Header = () => {
  const navigate = useNavigate();
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  return (
    <header className="flex items-center justify-between border-b border-black px-6 py-4">
      <nav className="flex gap-6 text-xl font-semibold">
        <button onClick={() => navigate("/issues")} className="text-red-600">
          Все задачи
        </button>
        <button onClick={() => navigate("/boards")} className="text-black">
          Проекты
        </button>
      </nav>

      <button
        onClick={() => setTaskModalOpen(true)}
        className="rounded border border-black px-4 py-1.5 text-black hover:bg-black hover:text-white transition"
      >
        Создать задачу
      </button>

      <TaskFormModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
      />
    </header>
  );
};
export default Header;
