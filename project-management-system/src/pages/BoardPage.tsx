// import React, { useEffect, useState } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import api from "../api";
// import { Task } from "../types";
// import TaskFormModal from "../components/TaskFormModal";

// const STATUSES = ["ToDo", "InProgress", "Done"] as const;
// type VisualStatus = (typeof STATUSES)[number];

// const STATUS_COLORS: Record<VisualStatus, string> = {
//   ToDo: "text-orange-500",
//   InProgress: "text-yellow-500",
//   Done: "text-green-500",
// };

// const STATUS_LABELS: Record<string, string> = {
//   ToDo: "To do",
//   InProgress: "In progress",
//   Done: "Done",
// };

// const BoardPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const location = useLocation();
//   const { boardName: passedBoardName } = location.state || {};

//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [boardName, setBoardName] = useState("");
//   const [dragOverStatus, setDragOverStatus] = useState<VisualStatus | null>(
//     null
//   );

//   useEffect(() => {
//     fetchTasks();
//   }, [id]);

//   const fetchTasks = async () => {
//     try {
//       const response = await api.get(`/boards/${id}`);
//       const data = response.data.data || [];

//       const normalized = data.map((t: Task) =>
//         t.status === "Backlog" ? { ...t, status: "ToDo" } : t
//       );

//       setTasks(normalized);

//       if (data.length > 0) {
//         setBoardName(data[0].boardName);
//       }
//     } catch (err) {
//       console.error("Ошибка при загрузке задач доски", err);
//     }
//   };

//   const handleTaskClick = (task: Task) => {
//     setSelectedTask(task);
//     setShowForm(true);
//   };

//   const handleSuccess = async () => {
//     await fetchTasks();
//     setShowForm(false);
//     setSelectedTask(null);
//   };

//   const allowDrop = (
//     e: React.DragEvent<HTMLDivElement>,
//     status: VisualStatus
//   ) => {
//     e.preventDefault();
//     setDragOverStatus(status);
//   };

//   const handleDrop = async (
//     e: React.DragEvent<HTMLDivElement>,
//     newStatus: VisualStatus
//   ) => {
//     e.preventDefault();
//     setDragOverStatus(null);

//     const taskId = e.dataTransfer.getData("taskId");
//     const task = tasks.find((t) => t.id.toString() === taskId);
//     if (!task || isEquivalentStatus(task.status, newStatus)) return;

//     const backendStatus = newStatus === "ToDo" ? "Backlog" : newStatus;

//     try {
//       await api.put(`/tasks/updateStatus/${task.id}`, {
//         status: backendStatus,
//       });

//       setTasks((prev) =>
//         prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
//       );
//     } catch (err) {
//       console.error("Ошибка при обновлении статуса задачи", err);
//     }
//   };

//   const isEquivalentStatus = (a: string, b: string) => {
//     return (
//       (a === "Backlog" && b === "ToDo") ||
//       (a === "ToDo" && b === "Backlog") ||
//       a === b
//     );
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">
//         {passedBoardName || boardName || "Проект"}
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {STATUSES.map((status) => (
//           <div
//             key={status}
//             className={`space-y-2 border border-gray-300 p-3 rounded min-h-[150px] transition-colors ${
//               dragOverStatus === status ? "bg-gray-100" : "bg-white"
//             }`}
//             onDrop={(e) => handleDrop(e, status)}
//             onDragOver={(e) => allowDrop(e, status)}
//             onDragLeave={() => setDragOverStatus(null)}
//           >
//             <h2
//               className={`text-lg lg:text-2xl font-semibold ${STATUS_COLORS[status]}`}
//             >
//               {STATUS_LABELS[status]}
//             </h2>

//             {tasks
//               .filter((t) => isEquivalentStatus(t.status, status))
//               .map((task) => (
//                 <div
//                   key={task.id}
//                   className="border border-black p-3 rounded cursor-pointer hover:bg-gray-50"
//                   draggable
//                   onDragStart={(e) =>
//                     e.dataTransfer.setData("taskId", task.id.toString())
//                   }
//                   onClick={() => handleTaskClick(task)}
//                 >
//                   <h3 className="font-medium lg:text-xl">{task.title}</h3>
//                   <p className="text-sm lg:text-lg text-gray-600">
//                     {task.description}
//                   </p>
//                 </div>
//               ))}
//           </div>
//         ))}
//       </div>

//       {showForm && (
//         <TaskFormModal
//           isOpen={showForm}
//           onClose={() => setShowForm(false)}
//           mode="edit"
//           initialData={
//             selectedTask
//               ? {
//                   title: selectedTask.title,
//                   description: selectedTask.description,
//                   boardId: selectedTask.boardId,
//                   status:
//                     selectedTask.status === "ToDo"
//                       ? "Backlog"
//                       : selectedTask.status,
//                   priority: selectedTask.priority,
//                   assigneeId: selectedTask.assignee.id,
//                 }
//               : undefined
//           }
//           boardName={boardName}
//           showGoToBoard={false}
//           onSuccess={handleSuccess}
//         />
//       )}
//     </div>
//   );
// };

// export default BoardPage;

import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../api";
import { Task } from "../types";
import TaskFormModal from "../components/TaskFormModal";

const STATUSES = ["ToDo", "InProgress", "Done"] as const;

type VisualStatus = (typeof STATUSES)[number];

const STATUS_COLORS: Record<VisualStatus, string> = {
  ToDo: "text-orange-500",
  InProgress: "text-yellow-500",
  Done: "text-green-500",
};

const STATUS_LABELS: Record<string, string> = {
  ToDo: "To do",
  InProgress: "In progress",
  Done: "Done",
};

const BoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [boardName, setBoardName] = useState(location.state?.boardName || "");
  const [dragOverStatus, setDragOverStatus] = useState<VisualStatus | null>(
    null
  );

  useEffect(() => {
    fetchTasks();
  }, [id]);

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/boards/${id}`);
      const data = response.data.data || [];

      const normalized = data.map((t: Task) =>
        t.status === "Backlog" ? { ...t, status: "ToDo" } : t
      );

      setTasks(normalized);

      if (data.length > 0 && !boardName) {
        setBoardName(data[0].boardName);
      }
    } catch (err) {
      console.error("Ошибка при загрузке задач доски", err);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  const handleSuccess = async () => {
    await fetchTasks();
    setShowForm(false);
    setSelectedTask(null);
  };

  const allowDrop = (
    e: React.DragEvent<HTMLDivElement>,
    status: VisualStatus
  ) => {
    e.preventDefault();
    setDragOverStatus(status);
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    newStatus: VisualStatus
  ) => {
    e.preventDefault();
    setDragOverStatus(null);

    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find((t) => t.id.toString() === taskId);
    if (!task || isEquivalentStatus(task.status, newStatus)) return;

    const backendStatus = newStatus === "ToDo" ? "Backlog" : newStatus;

    try {
      await api.put(`/tasks/updateStatus/${task.id}`, {
        status: backendStatus,
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error("Ошибка при обновлении статуса задачи", err);
    }
  };

  const isEquivalentStatus = (a: string, b: string) => {
    return (
      (a === "Backlog" && b === "ToDo") ||
      (a === "ToDo" && b === "Backlog") ||
      a === b
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{boardName || "Проект"}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATUSES.map((status) => (
          <div
            key={status}
            className={`space-y-2 border border-gray-300 p-3 rounded min-h-[150px] transition-colors ${
              dragOverStatus === status ? "bg-gray-100" : "bg-white"
            }`}
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={(e) => allowDrop(e, status)}
            onDragLeave={() => setDragOverStatus(null)}
          >
            <h2
              className={`text-lg lg:text-2xl font-semibold ${STATUS_COLORS[status]}`}
            >
              {STATUS_LABELS[status]}
            </h2>

            {tasks
              .filter((t) => isEquivalentStatus(t.status, status))
              .map((task) => (
                <div
                  key={task.id}
                  className="border border-black p-3 rounded cursor-pointer hover:bg-gray-50"
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("taskId", task.id.toString())
                  }
                  onClick={() => handleTaskClick(task)}
                >
                  <h3 className="font-medium lg:text-xl ">{task.title}</h3>
                  <p className="text-sm lg:text-lg text-gray-600">
                    {task.description}
                  </p>
                </div>
              ))}
          </div>
        ))}
      </div>

      {showForm && (
        <TaskFormModal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          mode="edit"
          initialData={
            selectedTask
              ? {
                  title: selectedTask.title,
                  description: selectedTask.description,
                  boardId: selectedTask.boardId,
                  status:
                    selectedTask.status === "ToDo"
                      ? "Backlog"
                      : selectedTask.status,
                  priority: selectedTask.priority,
                  assigneeId: selectedTask.assignee.id,
                }
              : undefined
          }
          boardName={boardName}
          showGoToBoard={false}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default BoardPage;
