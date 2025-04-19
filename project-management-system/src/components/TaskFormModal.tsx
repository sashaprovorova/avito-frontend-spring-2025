import React from "react";
import { Dialog } from "@headlessui/react";
import TaskForm from "./TaskForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const TaskFormModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg">
          <TaskForm
            mode="create"
            onSuccess={() => {
              console.log("SUBMIT SUCCESS");
              onClose();
            }}
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TaskFormModal;
