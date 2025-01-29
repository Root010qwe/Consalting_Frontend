import Form from "react-bootstrap/Form";
import { FC } from "react";
import { T_Service } from "../../modules/types.ts";
import { useAppDispatch, useAppSelector } from "../../store.ts";
import "./ReqCard.css";
import {
  setServiceData,
  updateServiceComment,
  removeServiceFromRequest,
  fetchRequestDetail,
} from "../../slices/requestDraftSlice.ts";

const defaultImage = "src/assets/5.png";

interface RequestCardProps {
  id: number;
  service: T_Service;
  showRemoveBtn?: boolean;
}

export const RequestCard: FC<RequestCardProps> = ({
  id,
  service,
  showRemoveBtn = false,
}) => {
  const dispatch = useAppDispatch();

  const request = useAppSelector((state) => state.requestDraftSlice.request);
  const isDraft = request?.status === "Draft";
  
  const comment =
    request!.service_requests!.find(
      (serviceRequest) => serviceRequest.id === id
    )?.comment ?? "";

  const handleCommentChange = (e: React.ChangeEvent<any>) => {
    if (!isDraft) return;
    dispatch(setServiceData({ serviceId: id, comment: e.target.value }));
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isDraft) return;

    dispatch(
      updateServiceComment({
        requestId: "" + request!.id,
        serviceId: "" + service.id,
        comment: comment,
      })
    );
  };

  const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!request || !request.id || !service.id || !isDraft) {
      console.error("Ошибка: отсутствуют необходимые данные для удаления или заявка не в статусе Draft");
      return;
    }

    console.log("Удаление услуги:", {
      requestId: String(request.id),
      serviceId: String(service.id),
    });

    dispatch(
      removeServiceFromRequest({
        requestId: String(request.id),
        serviceId: String(service.id),
      })
    );
  };

  return (
    <div className="service-card1">
      <img
        className="service-card1__image"
        src={service.image_url || defaultImage}
        alt="Service Image"
      />
      <div className="service-card1__details">
        <div className="service-card1__info">
          <p className="service-card1__name">{service.name}</p>
          <p className="service-card1__price">
            <strong>Цена:</strong> {service.price} ₽
          </p>
          <p className="service-card1__duration">
            <strong>Длительность:</strong> {service.duration} часов
          </p>
          <Form.Group className="service-card1__comment">
            <strong>Комментарий:</strong>
            <Form.Control
              as="textarea"
              rows={2}
              onChange={handleCommentChange}
              value={comment}
              disabled={!isDraft}
            />
          </Form.Group>
        </div>
        <div className="service-card1__actions">
          {showRemoveBtn && isDraft && (
            <button className="btn btn-danger" onClick={handleRemoveClick}>
              Удалить
            </button>
          )}
          {isDraft && (
            <button className="btn btn-primary" onClick={handleSaveClick}>
              Сохранить
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
