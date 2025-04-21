import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Board } from "../types/index";

// компонент страницы со списком всех досок проекта
const BoardsPage = () => {
  // локальное состояние для хранения досок
  const [boards, setBoards] = useState<Board[]>([]);
  const navigate = useNavigate();

  // загружаем список досок при монтировании компонента
  useEffect(() => {
    api
      .get("/boards")
      .then((res) => setBoards(res.data.data))
      .catch((err) => console.error("Ошибка при загрузке досок", err));
  }, []);

  return (
    <main className="p-6 space-y-4 max-w-5xl mx-auto" role="main">
      {/* если досок нет, показываем сообщение */}
      {boards.length === 0 ? (
        <p className="text-center text-gray-500" role="status">
          Нет досок для отображения.
        </p>
      ) : (
        // иначе отображаем список досок
        <ul
          className="space-y-4 list-none p-0 m-0"
          role="list"
          aria-label="Список досок"
        >
          {boards.map((board) => (
            <li
              key={board.id}
              className="flex justify-between items-center border border-black rounded-lg px-4 py-3"
              role="listitem"
            >
              <article
                aria-labelledby={`board-title-${board.id}`}
                className="flex-1"
              >
                {/* название доски */}
                <h2
                  id={`board-title-${board.id}`}
                  className="text-xl lg:text-2xl font-semibold"
                >
                  {board.name}
                </h2>
                {/* описание доски и кол задач*/}
                <p className="text-sm lg:text-lg text-gray-500">
                  {board.description}
                </p>
                <p className="text-sm lg:text-md text-gray-400 mt-1">
                  Кол-во задач: {board.taskCount}
                </p>
              </article>

              {/* кнопка перехода на страницу доски */}
              <button
                onClick={() =>
                  navigate(`/board/${board.id}`, {
                    state: { boardName: board.name },
                  })
                }
                className="ml-4 rounded border border-black px-4 py-1.5 text-black hover:bg-black hover:text-white transition lg:text-xl"
                aria-label={`Перейти к доске ${board.name}`}
              >
                Перейти к доске
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default BoardsPage;
