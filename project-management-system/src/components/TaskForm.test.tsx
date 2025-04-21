import React from "react";
import { render, screen } from "@testing-library/react";
import TaskForm from "./TaskForm";

// мокаем API
jest.mock("../api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(() =>
      Promise.resolve({
        data: { data: [] },
      })
    ),
    post: jest.fn(() => Promise.resolve({})),
    put: jest.fn(() => Promise.resolve({})),
  },
}));

describe("TaskForm", () => {
  it("рендерится с заголовком 'Создание задачи'", () => {
    render(
      <TaskForm
        mode="create"
        isBoardPage={false}
        onSuccess={jest.fn()}
        showGoToBoard={false}
      />
    );

    // проверяем, что заголовок отображается
    expect(
      screen.getByRole("heading", { name: "Создание задачи" })
    ).toBeInTheDocument();
  });

  it("отображает кнопку 'Создать'", () => {
    render(
      <TaskForm
        mode="create"
        isBoardPage={false}
        onSuccess={jest.fn()}
        showGoToBoard={false}
      />
    );

    // проверяем наличие кнопки отправки
    expect(screen.getByRole("button", { name: "Создать" })).toBeInTheDocument();
  });
});
