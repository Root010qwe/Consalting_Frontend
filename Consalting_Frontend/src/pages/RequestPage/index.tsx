import React, { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store.ts";
import { RequestCard } from "../../components/ReqCard";
import {
  fetchRequestDetail,
  submitDraftRequest,
  deleteDraftRequest,
  updateRequestFields,
  setRequestField,
} from "../../slices/requestDraftSlice.ts";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { setFilters } from "../../slices/requestSlice";
import ConfirmDialog from "../../components/ConfirmDialog";

const RequestPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const request = useAppSelector((state) => state.requestDraftSlice.request);
  const currentUser = useAppSelector((state) => state.user.user);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const contactPhone = request?.contact_phone || "";
  const priorityLevel = request?.priority_level || "Low";

  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePhone = (phone: string) => {
    dispatch(setRequestField({ field: "contact_phone", value: phone }));
  };

  const handleChangePriority = (level: string) => {
    dispatch(setRequestField({ field: "priority_level", value: level }));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (id) {
      dispatch(fetchRequestDetail(id))
        .unwrap()
        .then((requestData) => {
          console.log("Current User:", currentUser);
          console.log("Request Data:", requestData);

          const hasAccess =
            currentUser &&
            (currentUser.username === requestData.client ||
              currentUser.username === requestData.manager ||
              currentUser.is_superuser ||
              currentUser.is_staff);

          console.log("Has Access:", hasAccess);
          console.log("Access Check:", {
            currentUsername: currentUser?.username,
            clientUsername: requestData.client,
            managerUsername: requestData.manager,
            isStaff: currentUser?.is_staff,
            isSuperuser: currentUser?.is_superuser,
          });

          if (!hasAccess) {
            console.log("У вас нет доступа к этой заявке");
            navigate("/requests");
          }
        })
        .catch((error) => {
          console.error("Ошибка при загрузке заявки:", error);
          navigate("/requests");
        });
    }
  }, [dispatch, id, isAuthenticated, currentUser, navigate]);

  const handleSaveFields = () => {
    if (id) {
      dispatch(
        updateRequestFields({
          requestId: id,
          contactPhone,
          priorityLevel,
        })
      )
        .unwrap()
        .then(() => {
          console.log("Поля успешно обновлены!");
        })
        .catch((error) => {
          console.error("Ошибка при обновлении полей заявки:", error);
          console.log("Не удалось обновить поля заявки.");
        });
    }
  };

  const handleSubmitRequest = () => {
    if (id) {
      dispatch(submitDraftRequest(id))
        .unwrap()
        .then(() => {
          console.log("Заявка успешно сформирована!");
          navigate("/requests");
        })
        .catch((error) => {
          console.error("Ошибка при формировании заявки:", error);
          console.log("Не удалось сформировать заявку.");
        });
    }
  };

  const handleDeleteRequest = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (id) {
      dispatch(deleteDraftRequest(id))
        .unwrap()
        .then(() => {
          console.log("Заявка успешно удалена!");
          navigate("/requests");
        })
        .catch((error) => {
          console.error("Ошибка при удалении заявки:", error);
          console.log("Не удалось удалить заявку.");
        });
    }
    setShowConfirm(false);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const handleViewClientRequests = () => {
    if (request?.client) {
      dispatch(
        setFilters({
          dateFrom: "",
          dateTo: "",
          status: "",
          clientFilter: request.client,
        })
      );
      navigate("/requests");
    }
  };

  if (!request) {
    return (
      <div className="container">
        <h3 className="text-center">Загрузка...</h3>
      </div>
    );
  }

  const isDraft = request.status === "Draft";

  return (
    <div className="request-container">
      <div className="request-data">
        <div className="head">
          <div className="line">
            <hr />
          </div>
          <h2 className="title">Заявка в обработке</h2>
          <div className="d-flex justify-content-center gap-2 my-3">
            <button className="btn btn-info" onClick={handleViewClientRequests}>
              Все заявки клиента
            </button>
            {isDraft && (
              <>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmitRequest}
                >
                  Сформировать заявку
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteRequest}
                >
                  Удалить заявку
                </button>
              </>
            )}
          </div>
        </div>
        <div className="mb-3">
          <div className="mb-2">
            <label htmlFor="contactPhone">Контактный телефон:</label>
            {isDraft ? (
              <PhoneInput
                country={"ru"}
                value={contactPhone}
                onChange={handleChangePhone}
                inputStyle={{
                  width: "250px",
                  height: "40px",
                  fontSize: "14px",
                  paddingLeft: "48px",
                }}
                buttonStyle={{
                  display: "none",
                }}
              />
            ) : (
              <div className="readonly-value">
                {contactPhone || "Не указан"}
              </div>
            )}
          </div>

          <div>
            <label>Уровень приоритета:</label>
            {isDraft ? (
              <div className="d-flex gap-3">
                {["Low", "Medium", "High"].map((level) => (
                  <div key={level} className="form-check">
                    <input
                      type="radio"
                      id={`priority-${level}`}
                      className="form-check-input"
                      name="priorityLevel"
                      value={level}
                      checked={priorityLevel === level}
                      onChange={() => handleChangePriority(level)}
                    />
                    <label
                      htmlFor={`priority-${level}`}
                      className="form-check-label"
                    >
                      {level}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="priority-readonly">{priorityLevel}</div>
            )}
          </div>

          {isDraft && (
            <button className="btn btn-primary" onClick={handleSaveFields}>
              Сохранить
            </button>
          )}
        </div>
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between"></div>
            <div className="cards">
              <div className="row g-2">
                {request.service_requests &&
                request.service_requests.length > 0 ? (
                  request.service_requests.map((serviceRequest) => {
                    if (!serviceRequest.service) return null;

                    return (
                      <div className="col-12" key={serviceRequest.id}>
                        <RequestCard
                          id={serviceRequest.id!}
                          service={serviceRequest.service}
                          showRemoveBtn={isDraft}
                        />
                      </div>
                    );
                  })
                ) : (
                  <p>Услуги отсутствуют.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        show={showConfirm}
        message="Вы уверены, что хотите удалить заявку?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default RequestPage;
