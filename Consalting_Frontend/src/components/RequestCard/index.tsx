import React from "react";

interface RequestCardProps {
  id: number;
  status: "Draft" | "Submitted" | "Completed" | "Rejected";
  formedAt: string | null;
  priority_level: "Low" | "Medium" | "High";
  totalCost: number;
  onClick: () => void;
}

const getStatusText = (status: "Draft" | "Submitted" | "Completed" | "Rejected") => {
  switch (status) {
    case "Draft":
      return "Черновик";
    case "Submitted":
      return "Подтверждено";
    case "Completed":
      return "Завершено";
    case "Rejected":
      return "Отклонено";
    default:
      return "Неизвестен";
  }
};

const getPriorityText = (priority: "Low" | "Medium" | "High") => {
  switch (priority) {
    case "Low":
      return "Низкий";
    case "Medium":
      return "Средний";
    case "High":
      return "Высокий";
    default:
      return "Не указан";
  }
};

const RequestCard: React.FC<RequestCardProps> = ({
  id,
  status,
  formedAt,
  priority_level,
  totalCost,
  onClick,
}) => {
  return (
    <div className="request-row" onClick={onClick}>
      <div className="cell request-id">{id}</div>
      <div className="cell status">{getStatusText(status)}</div>
      <div className="cell date-formed">
        {formedAt ? new Date(formedAt).toLocaleDateString('ru-RU') : "—"}
      </div>
      <div className="cell priority-level">{getPriorityText(priority_level)}</div>

      <div className="cell total-cost">
        {totalCost ? `${Number(totalCost).toLocaleString('ru-RU')} ₽` : "—"}
      </div>
    </div>
  );
};

export default RequestCard;
