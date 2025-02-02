import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";

// Экшены
import {
  fetchRequests,
  setFilters,
  updateRequestStatus,
} from "../../slices/requestSlice";
import {
  fetchRequestDetail,
  submitDraftRequest,
  deleteDraftRequest,
  updateRequestFields,
  setRequestField,
} from "../../slices/requestDraftSlice";

import { T_Request } from "../../modules/types";

// Иконки
import qrImage from "../../assets/qr-icon.svg";
import timeImage from "../../assets/time.svg";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./RequestsPage.css";

// -------------------------------------------------------------------
// Хелпер для перевода статусов на русский
function getStatusText(status: string) {
  switch (status) {
    case "Draft":
      return "Черновик";
    case "Submitted":
      return "На рассмотрении";
    case "Completed":
      return "Завершено";
    case "Rejected":
      return "Отклонено";
    // если есть "Deleted"
    case "Deleted":
      return "Удалено";
    default:
      return "Неизвестен";
  }
}

// -------------------------------------------------------------------
// Шапка таблицы
const TableHeader: React.FC<{ isModerator: boolean }> = ({ isModerator }) => (
  <div className="table-header">
    <div className="request-id">№ Заявки</div>
    <div className="status">Статус</div>
    <div className="date-formed">Дата оформления</div>
    <div className="priority-level">Приоритет</div>
    <div className="total-cost">Стоимость</div>
    <div className="actions">{isModerator ? "Действия" : "QR-код"}</div>
  </div>
);

// -------------------------------------------------------------------
const RequestsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Данные для списка заявок
  const { requests, dateFrom, dateTo, status, clientFilter, loading, error } =
    useAppSelector((state) => state.requests);

  // Детали конкретной заявки
  const requestDetail = useAppSelector(
    (state) => state.requestDraftSlice.request
  );

  // Данные о пользователе
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  const isModerator = Boolean(user?.is_staff || user?.is_superuser);

  // -------------------------------------------------------------------
  // SHORT POLLING для списка
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    let isUnmounted = false;

    async function pollRequests() {
      if (isUnmounted) return;

      // Загрузить заявки
      await dispatch(fetchRequests());

      // Запланировать следующий запрос через N миллисекунд, например 4000 (4 сек)
      if (!isUnmounted) {
        timerId = setTimeout(pollRequests, 4000);
      }
    }

    // Запуск
    pollRequests();

    // Очистка при размонтировании или смене зависимости
    return () => {
      isUnmounted = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [dispatch, dateFrom, dateTo, status, clientFilter]);
  // В зависимостях указываем фильтры, чтобы при их изменении
  // перезапустить polling с новыми параметрами.

  // -------------------------------------------------------------------
  // Если не авторизован — редирект на логин
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // -------------------------------------------------------------------
  // Если есть id, загружаем детальную информацию (одноразово)
  useEffect(() => {
    if (id) {
      dispatch(fetchRequestDetail(id))
        .unwrap()
        .then((requestData) => {
          const currentUser = user;
          const hasAccess =
            currentUser &&
            (currentUser.username === requestData.client ||
              currentUser.username === requestData.manager ||
              currentUser.is_superuser ||
              currentUser.is_staff);

          if (!hasAccess) {
            alert("У вас нет доступа к этой заявке");
            navigate("/requests");
          }
        })
        .catch((error) => {
          console.error("Ошибка при загрузке заявки:", error);
          navigate("/requests");
        });
    }
  }, [id, dispatch, navigate, user]);

  // -------------------------------------------------------------------
  // Методы для управления заявками
  const handleStatusChange = async (
    requestId: number,
    newStatus: "Completed" | "Rejected"
  ) => {
    try {
      await dispatch(
        updateRequestStatus({ requestId, status: newStatus })
      ).unwrap();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleClearFilters = () => {
    dispatch(
      setFilters({
        dateFrom: "",
        dateTo: "",
        status: "",
        clientFilter: "",
      })
    );
  };

  // Переход на страницу деталей заявки
  const handleRowClick = (requestId: number) => {
    navigate(`/request/${requestId}`);
  };

  // -------------------------------------------------------------------
  // Методы для деталей
  const contactPhone = requestDetail?.contact_phone || "";
  const priorityLevel = requestDetail?.priority_level || "Low";
  const isDraft = requestDetail?.status === "Draft";

  const handleChangePhone = (phone: string) => {
    dispatch(setRequestField({ field: "contact_phone", value: phone }));
  };

  const handleChangePriority = (level: string) => {
    dispatch(setRequestField({ field: "priority_level", value: level }));
  };

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
          alert("Поля успешно обновлены!");
        })
        .catch((error) => {
          console.error("Ошибка при обновлении полей заявки:", error);
          alert("Не удалось обновить поля заявки.");
        });
    }
  };

  const handleSubmitRequest = () => {
    if (id) {
      dispatch(submitDraftRequest(id))
        .unwrap()
        .then(() => {
          alert("Заявка успешно сформирована!");
          navigate("/requests");
        })
        .catch((error) => {
          console.error("Ошибка при формировании заявки:", error);
          alert("Не удалось сформировать заявку.");
        });
    }
  };

  const handleDeleteRequest = () => {
    if (id) {
      if (window.confirm("Вы уверены, что хотите удалить заявку?")) {
        dispatch(deleteDraftRequest(id))
          .unwrap()
          .then(() => {
            alert("Заявка успешно удалена!");
            navigate("/requests");
          })
          .catch((error) => {
            console.error("Ошибка при удалении заявки:", error);
            alert("Не удалось удалить заявку.");
          });
      }
    }
  };

  const handleViewClientRequests = () => {
    if (requestDetail?.client) {
      dispatch(
        setFilters({
          dateFrom: "",
          dateTo: "",
          status: "",
          clientFilter: requestDetail.client,
        })
      );
      navigate("/requests");
    }
  };

  // -------------------------------------------------------------------
  // Если есть id => Детали, иначе => Список
  if (id) {
    // ------------------ ДЕТАЛИ ЗАЯВКИ ------------------
    if (!requestDetail) {
      return (
        <div className="container">
          <h3 className="text-center">Загрузка заявки...</h3>
        </div>
      );
    }

    return (
      <div className="request-container">
        <div className="request-data">
          <div className="head">
            <div className="line">
              <hr />
            </div>
            <h2 className="title">Детали заявки № {id}</h2>

            <div className="d-flex justify-content-center gap-2 my-3">
              <button
                className="btn btn-info"
                onClick={handleViewClientRequests}
              >
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

          {/* Поля редактирования (если черновик) */}
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
                  {["Низкий", "Средний", "Высокий"].map((level) => (
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

          {/* Здесь может быть список услуг в заявке */}
        </div>
      </div>
    );
  } else {
    // ------------------ СПИСОК ЗАЯВОК ------------------
    // Фильтруем черновики и удалённые перед отображением
    const filteredRequests = requests.filter(
      (req) => req.status !== "Draft" && req.status !== "Deleted"
    );

    return (
      <div className="requests-page">
        <h1>Список заявок</h1>

        {/* Фильтры */}
        <div className="filters">
          <label>
            Дата от:
            <input
              type="date"
              value={dateFrom}
              onChange={(e) =>
                dispatch(
                  setFilters({
                    dateFrom: e.target.value,
                    dateTo,
                    status,
                    clientFilter,
                  })
                )
              }
            />
          </label>
          <label>
            Дата до:
            <input
              type="date"
              value={dateTo}
              onChange={(e) =>
                dispatch(
                  setFilters({
                    dateFrom,
                    dateTo: e.target.value,
                    status,
                    clientFilter,
                  })
                )
              }
            />
          </label>
          <label>
            Статус:
            <select
              value={status}
              onChange={(e) =>
                dispatch(
                  setFilters({
                    dateFrom,
                    dateTo,
                    status: e.target.value,
                    clientFilter,
                  })
                )
              }
            >
              <option value="">Все</option>
              <option value="Submitted">На рассмотрении</option>
              <option value="Completed">Завершено</option>
              <option value="Rejected">Отклонено</option>
            </select>
          </label>

          <button
            className="btn btn-outline-primary"
            onClick={handleClearFilters}
          >
            Сбросить фильтры
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="table-container">
          <TableHeader isModerator={isModerator} />

          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : (
            <div className="requests-list">
              {filteredRequests.map((request: T_Request) => (
                <div
                  key={request.id}
                  className="request-row"
                  onClick={() => handleRowClick(request.id!)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="cell request-id">{request.id}</div>

                  {/* Статус по-русски */}
                  <div className="cell status">
                    {getStatusText(request.status || 'Unknown')}
                  </div>

                  <div className="cell date-formed">
                    {request.formed_date
                      ? new Date(request.formed_date).toLocaleDateString(
                          "ru-RU"
                        )
                      : new Date(request.creation_date!).toLocaleDateString(
                          "ru-RU"
                        )}
                  </div>
                  <div className="cell priority-level">
                    {getPriorityText(request.priority_level || "Low")}
                  </div>
                  <div className="cell total-cost">
                    {request.total_cost
                      ? `${Number(request.total_cost).toLocaleString("ru-RU")} ₽`
                      : "—"}
                  </div>

                  {/* Последняя ячейка: либо "Действия" для модератора, либо QR для пользователя */}
                  <div className="cell actions">
                    {isModerator ? (
                      request.status === "Submitted" ? (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(request.id!, "Completed");
                            }}
                            title="Завершить заявку"
                          >
                            ✓
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(request.id!, "Rejected");
                            }}
                            title="Отклонить заявку"
                          >
                            ✕
                          </button>
                        </>
                      ) : null
                    ) : request.status === "Completed" && request.qr ? (
                      <div className="qr-hover-wrapper">
                        <img
                          className="status-icon"
                          src={qrImage}
                          alt="QR Icon"
                        />
                        <div className="qr-hover">
                          <img
                            className="qr-code"
                            src={`data:image/png;base64,${request.qr}`}
                            alt="QR Code"
                          />
                        </div>
                      </div>
                    ) : (
                      <img
                        className="status-icon"
                        src={timeImage}
                        alt="Processing"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
};

function getPriorityText(priority: string) {
  switch (priority) {
    case "Low":
      return "Низкий";
    case "Medium":
      return "Средний";
    case "High":
      return "Высокий";
    default:
      return "Низкий";
  }
}

export default RequestsPage;
