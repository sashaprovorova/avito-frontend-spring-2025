import { Dialog } from "@headlessui/react";
import React from "react";
import TaskForm from "./TaskForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: {
    title: string;
    description: string;
    boardId: number;
    priority: string;
    assigneeId: number;
    status: string;
  };
  showGoToBoard?: boolean;
  onGoToBoard?: () => void;
  boardName?: string;
  onSuccess: () => void;
  isBoardPage?: boolean;
};

const TaskFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  showGoToBoard,
  onGoToBoard,
  boardName,
  onSuccess,
  isBoardPage,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
          <TaskForm
            mode={mode}
            initialData={initialData}
            onSuccess={onSuccess}
            showGoToBoard={showGoToBoard}
            onGoToBoard={onGoToBoard}
            boardName={boardName}
            isBoardPage={isBoardPage}
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TaskFormModal;

// import { Dialog } from "@headlessui/react";
// import React from "react";
// import TaskForm from "./TaskForm";
// import { Task } from "../types";

// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
//   mode: "create" | "edit";
//   initialData?: Pick<
//     Task,
//     | "id"
//     | "title"
//     | "description"
//     | "boardId"
//     | "priority"
//     | "assigneeId"
//     | "status"
//   >;
//   showGoToBoard?: boolean;
//   onGoToBoard?: () => void;
//   boardName?: string;
//   onSuccess: () => void;
//   isBoardPage?: boolean;
// };

// const TaskFormModal: React.FC<Props> = ({
//   isOpen,
//   onClose,
//   mode,
//   initialData,
//   showGoToBoard,
//   onGoToBoard,
//   boardName,
//   onSuccess,
//   isBoardPage,
// }) => {
//   return (
//     <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
//       <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
//       <div className="fixed inset-0 flex items-center justify-center">
//         <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
//           <TaskForm
//             mode={mode}
//             initialData={initialData}
//             onSuccess={onSuccess}
//             showGoToBoard={showGoToBoard}
//             onGoToBoard={onGoToBoard}
//             boardName={boardName}
//             isBoardPage={isBoardPage}
//           />
//         </Dialog.Panel>
//       </div>
//     </Dialog>
//   );
// };

// export default TaskFormModal;
