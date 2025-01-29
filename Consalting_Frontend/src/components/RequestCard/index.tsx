import React from "react";

interface RequestCardProps {
  id: number;
  client: string;
  status: "Draft" | "Submitted" | "Completed" | "Rejected";
  formedAt: string | null;
  totalCost: number;
  onClick: () => void;
}

const getStatusText = (
  status: "Draft" | "Submitted" | "Completed" | "Rejected"
) => {
  switch (status) {
    case "Draft":
      return "Черновик";
    case "Submitted":
      return "Отправлено";
    case "Completed":
      return "Завершено";
    case "Rejected":
      return "Отклонено";
    default:
      return "Неизвестен";
  }
};

const RequestCard: React.FC<RequestCardProps> = ({
  id,
  client,
  status,
  formedAt,
  totalCost,
  onClick,
}) => {
  return (
    <div className={`request-card ${status.toLowerCase()}`} onClick={onClick}>
      <div className="request-info">
        <p className="request-id">№ {id}</p>
        <p className="client-name">{client}</p>
        <p className="status">{getStatusText(status)}</p>
        <p className="date-formed">
          {formedAt ? new Date(formedAt).toLocaleDateString() : "—"}
        </p>
      </div>
      <div className="total-cost">{totalCost} ₽</div>
    </div>
  );
};

export default RequestCard;
