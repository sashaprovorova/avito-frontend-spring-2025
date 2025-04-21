import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import IssuesPage from "./IssuesPage";
import { BrowserRouter } from "react-router-dom";

// мокаем API
jest.mock("../api", () => ({
  __esModule: true,
  default: {
    get: jest.fn((url) => {
      if (url === "/tasks") {
        return Promise.resolve({
          data: { data: [] },
        });
      }
      if (url === "/boards") {
        return Promise.resolve({
          data: { data: [] },
        });
      }
      if (url === "/users") {
        return Promise.resolve({
          data: { data: [] },
        });
      }
      return Promise.resolve({ data: { data: [] } });
    }),
  },
}));

describe("IssuesPage", () => {
  it("рендерит фильтры", () => {
    render(
      <BrowserRouter>
        <IssuesPage />
      </BrowserRouter>
    );

    // проверяем фильтры
    expect(screen.getByPlaceholderText("Поиск")).toBeInTheDocument();
    expect(screen.getByText("Все статусы")).toBeInTheDocument();
    expect(screen.getByText("Все проекты")).toBeInTheDocument();
  });

  it("открывает форму при клике на кнопку создания задачи", () => {
    render(
      <BrowserRouter>
        <IssuesPage />
      </BrowserRouter>
    );

    // кликаем по кнопке "Создать задачу"
    const createButton = screen.getByLabelText("Создать задачу");
    fireEvent.click(createButton);

    // проверяем, что открылось окно с формой
    expect(screen.getByText(/создание задачи/i)).toBeInTheDocument();
  });
});
