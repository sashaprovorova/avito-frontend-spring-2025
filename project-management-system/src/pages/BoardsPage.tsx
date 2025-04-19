import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

type Board = {
  id: number;
  name: string;
  description: string;
  taskCount: number;
};

const BoardsPage = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/boards")
      .then((res) => setBoards(res.data.data))
      .catch((err) => console.error("Ошибка при загрузке досок", err));
  }, []);

  return (
    <div className="p-6 space-y-4">
      {boards.length === 0 ? (
        <p className="text-center text-gray-500">Нет досок для отображения.</p>
      ) : (
        boards.map((board) => (
          <div
            key={board.id}
            className="flex justify-between items-center border border-black rounded-lg px-4 py-3"
          >
            <div>
              <p className="text-xl font-semibold">{board.name}</p>
              <p className="text-sm text-gray-500">{board.description}</p>
              <p className="text-sm text-gray-400 mt-1">
                Кол-во задач: {board.taskCount}
              </p>
            </div>

            <button
              onClick={() => navigate(`/board/${board.id}`)}
              className="rounded border border-black px-4 py-1.5 text-black hover:bg-black hover:text-white transition"
            >
              Перейти к доске
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default BoardsPage;
