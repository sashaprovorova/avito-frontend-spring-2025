import React from "react";
import { render, screen } from "@testing-library/react";
import BoardPage from "./BoardPage";
import { BrowserRouter } from "react-router-dom";

// мок задач
const mockTasks = [
  {
    id: 1,
    title: "Задача 1",
    description: "Описание задачи 1",
    priority: "Medium",
    status: "Backlog",
    assignee: {
      id: 1,
      fullName: "Александра Ветрова",
      email: "al.vetrova@avito.ru",
      avatarUrl: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    boardName: "Проект A",
  },
  {
    id: 2,
    title: "Задача 2",
    description: "Описание задачи 2",
    priority: "Medium",
    status: "Done",
    assignee: {
      id: 2,
      fullName: "Илья Романов",
      email: "il.romanov@avito.ru",
      avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    boardName: "Проект A",
  },
];

// мокаем useParams и useLocation
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "1" }),
  useLocation: () => ({ state: { boardName: "Проект A" } }),
}));

// мокаем API
jest.mock("../api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(() =>
      Promise.resolve({
        data: { data: mockTasks },
      })
    ),
    put: jest.fn(() => Promise.resolve({})),
  },
}));

describe("BoardPage", () => {
  it("рендерит заголовок проекта", async () => {
    render(
      <BrowserRouter>
        <BoardPage />
      </BrowserRouter>
    );

    // проверяем заголовок
    expect(await screen.findByText("Проект A")).toBeInTheDocument();
  });

  it("отображает заголовки колонок", async () => {
    render(
      <BrowserRouter>
        <BoardPage />
      </BrowserRouter>
    );

    // дожидаемся отрисовки колонки To Do
    await screen.findByText("To Do");

    // проверяем заголовки колонок
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });
});
