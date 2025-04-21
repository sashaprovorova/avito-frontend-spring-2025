import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

const controllers = new Map<string, AbortController>();

// обертка для GET запросов с возможностью отмены по ключу
export const cancellableGet = async (url: string, key: string) => {
  // если есть активный контроллер с тем же ключом, то отменяем
  if (controllers.has(key)) {
    controllers.get(key)?.abort();
  }

  const controller = new AbortController();
  controllers.set(key, controller);

  try {
    const response = await api.get(url, { signal: controller.signal });
    // удаляем после успешного запроса
    controllers.delete(key);
    return response;
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.warn("Запрос отменён:", key);
    } else {
      throw error;
    }
  }
};

export default api;
