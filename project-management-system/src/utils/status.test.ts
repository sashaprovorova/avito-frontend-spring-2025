import { getStatusLabel, isEquivalentStatus } from "./status";

describe("getStatusLabel", () => {
  it("возвращает корректный лейбл для известных статусов", () => {
    // ошибка: если функция не объединяет ToDo и Backlog
    expect(getStatusLabel("ToDo")).toBe("To Do");
    // ошибка: если Backlog не отображается как To Do
    expect(getStatusLabel("Backlog")).toBe("To Do");
    // ошибка: если возвращается неверный текст
    expect(getStatusLabel("InProgress")).toBe("In Progress");
    // ошибка: если Done возвращается как что-то иное
    expect(getStatusLabel("Done")).toBe("Done");
  });

  it("возвращает исходное значение для неизвестного статуса", () => {
    // ошибка: если не обрабатываются неизвестные значения
    expect(getStatusLabel("Unknown" as any)).toBe("Unknown");
  });
});

describe("isEquivalentStatus", () => {
  it('считает "ToDo" и "Backlog" эквивалентными', () => {
    // ошибка: если нет логики объединения
    expect(isEquivalentStatus("ToDo", "Backlog")).toBe(true);
    // ошибка: если порядок влияет на результат
    expect(isEquivalentStatus("Backlog", "ToDo")).toBe(true);
  });

  it("возвращает true для одинаковых статусов", () => {
    // ошибка: если строгое сравнение не работает
    expect(isEquivalentStatus("InProgress", "InProgress")).toBe(true);
  });

  it("возвращает false для разных статусов", () => {
    // ошибка: если функция считает разные статусы равными
    expect(isEquivalentStatus("Done", "ToDo")).toBe(false);
  });
});
