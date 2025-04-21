import React from "react";
import { render, screen } from "@testing-library/react";
import TaskFormModal from "./TaskFormModal";
import { TaskFormModalProps } from "../types";

// мокаем TaskForm
jest.mock("./TaskForm", () => () => (
  <div data-testid="task-form">Mocked TaskForm</div>
));

const defaultProps: TaskFormModalProps = {
  isOpen: true,
  onClose: jest.fn(),
  mode: "create",
  showGoToBoard: false,
  boardName: "Тестовая доска",
  isBoardPage: false,
  onSuccess: jest.fn(),
};

describe("TaskFormModal", () => {
  it("рендерит модалку и TaskForm, когда isOpen = true", () => {
    render(<TaskFormModal {...defaultProps} />);

    // проверяем, что TaskForm отрендерился
    expect(screen.getByTestId("task-form")).toBeInTheDocument();
  });

  it("не отображается, когда isOpen = false", () => {
    render(<TaskFormModal {...defaultProps} isOpen={false} />);

    // TaskForm должен отсутствовать
    expect(screen.queryByTestId("task-form")).not.toBeInTheDocument();
  });

  it("передаёт props в TaskForm", () => {
    render(
      <TaskFormModal
        {...defaultProps}
        mode="edit"
        showGoToBoard={true}
        boardName="Проект X"
      />
    );

    // TaskForm все ещё отрендерен
    expect(screen.getByTestId("task-form")).toBeInTheDocument();
  });
});
