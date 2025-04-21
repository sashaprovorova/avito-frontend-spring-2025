import { Dialog } from "@headlessui/react";
import React from "react";
import TaskForm from "./TaskForm";
import { TaskFormModalProps } from "../types/index";

const TaskFormModal: React.FC<TaskFormModalProps> = ({
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
    //  затемняем фон
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      {/* центрируем панель модального окна  */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
          {/* компонент формы создания/редактирования задачи  */}
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
