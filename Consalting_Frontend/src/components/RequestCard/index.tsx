import React from "react";
import timeImage from "../../assets/time.svg";
import qrImage from "../../assets/qr-icon.svg";

interface RequestCardProps {
  id: number;
  status: "Draft" | "Submitted" | "Completed" | "Rejected";
  formedAt: string | null;
  priority_level: "Low" | "Medium" | "High";
  totalCost: number;
  qr?: string | null;
  onClick: () => void;
}

const getStatusText = (
  status: "Draft" | "Submitted" | "Completed" | "Rejected"
) => {
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
  qr,
  onClick,
}) => {
  return (
    <div className="request-row" onClick={onClick}>
      <div className="cell request-id">{id}</div>
      <div className="cell status">{getStatusText(status)}</div>
      <div className="cell date-formed">
        {formedAt ? new Date(formedAt).toLocaleDateString("ru-RU") : "—"}
      </div>
      <div className="cell priority-level">
        {getPriorityText(priority_level)}
      </div>
      <div className="cell total-cost">
        {totalCost ? `${Number(totalCost).toLocaleString("ru-RU")} ₽` : "—"}
      </div>

      {/* QR-код */}
      <div className="dinner-icon">
        {status === "Completed" && qr ? (
          <div className="qr-hover-wrapper">
            <img className="status-icon" src={qrImage} alt="QR Icon" />
            <div className="qr-hover">
              <img
                className="qr-code"
                src={`data:image/png;base64,${qr}`}
                alt="QR Code"
              />
            </div>
          </div>
        ) : (
          <img className="status-icon" src={timeImage} alt="Processing" />
        )}
      </div>
    </div>
  );
};

export default RequestCard;
