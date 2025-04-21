import { validateField } from "./validity";
import { TaskFields } from "../types";

describe("validateField", () => {
  describe("title", () => {
    it("возвращает ошибку при пустом названии", () => {
      expect(validateField("title", "")).toBe("Введите название задачи.");
    });

    it("не возвращает ошибку при заполненном названии", () => {
      expect(validateField("title", "Test")).toBe("");
    });
  });

  describe("description", () => {
    it("возвращает ошибку при пустом описании", () => {
      expect(validateField("description", "")).toBe("Введите описание задачи.");
    });

    it("не возвращает ошибку при заполненном описании", () => {
      expect(validateField("description", "Some description")).toBe("");
    });
  });

  describe("boardId", () => {
    it("возвращает ошибку в режиме 'create', если boardId = 0", () => {
      expect(validateField("boardId", 0, "create")).toBe("Выберите проект.");
    });

    it("не возвращает ошибку в режиме 'edit', если boardId = 0", () => {
      expect(validateField("boardId", 0, "edit")).toBe("");
    });

    it("не возвращает ошибку при валидном boardId", () => {
      expect(validateField("boardId", 5, "create")).toBe("");
    });
  });

  describe("priority", () => {
    it("возвращает ошибку при пустом значении", () => {
      expect(validateField("priority", "")).toBe("Выберите приоритет.");
    });

    it("не возвращает ошибку при наличии значения", () => {
      expect(validateField("priority", "High")).toBe("");
    });
  });

  describe("status", () => {
    it("возвращает ошибку при пустом статусе", () => {
      expect(validateField("status", "")).toBe("Выберите статус.");
    });

    it("не возвращает ошибку при наличии статуса", () => {
      expect(validateField("status", "InProgress")).toBe("");
    });
  });

  describe("assigneeId", () => {
    it("возвращает ошибку при значении 0", () => {
      expect(validateField("assigneeId", 0)).toBe("Выберите исполнителя.");
    });

    it("не возвращает ошибку при валидном assigneeId", () => {
      expect(validateField("assigneeId", 42)).toBe("");
    });
  });

  describe("неизвестное поле", () => {
    it("возвращает пустую строку", () => {
      expect(validateField("unknown" as TaskFields, "value")).toBe("");
    });
  });
});
