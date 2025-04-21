import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="h-screen flex flex-col items-center justify-center text-center px-4">
      {/* заголовок с кодом ошибки */}
      <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-black">404</h1>
      {/* сообщение об ошибке */}
      <p className="text-lg lg:text-xl text-gray-600 mb-6">
        Страница не найдена
      </p>
      {/* кнопка возврата на главную страницу */}
      <button
        onClick={() => navigate("/")}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition text-lg"
      >
        На главную
      </button>
    </main>
  );
};

export default NotFoundPage;
