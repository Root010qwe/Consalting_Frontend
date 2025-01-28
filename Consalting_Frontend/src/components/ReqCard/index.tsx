import Form from "react-bootstrap/Form";
import { FC } from "react";
import { T_Service } from "../../modules/types.ts";
import { useAppDispatch, useAppSelector } from "../../store.ts";
import "./ReqCard.css";
import {
  setServiceData,
  updateServiceComment,
  removeServiceFromRequest,
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
  const comment =
    request!.service_requests!.find(
      (serviceRequest) => serviceRequest.id === id
    )?.comment ?? "";

  const handleCommentChange = (e: React.ChangeEvent<any>) => {
    dispatch(setServiceData({ serviceId: id, comment: e.target.value }));
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

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

    if (!request || !request.id || !service.id) {
      console.error("Ошибка: отсутствуют необходимые данные для удаления.");
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
            />
          </Form.Group>
        </div>
        <div className="service-card1__actions">
          {showRemoveBtn && (
            <button className="btn btn-danger" onClick={handleRemoveClick}>
              Удалить
            </button>
          )}
          <button className="btn btn-primary" onClick={handleSaveClick}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};
