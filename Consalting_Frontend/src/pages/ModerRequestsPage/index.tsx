import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  fetchRequests,
  setFilters,
  updateRequestStatus,
} from "../../slices/requestSlice";
import RequestCard from "../../components/RequestCard";
import { T_Request } from "../../modules/types";
import "./ModerRequestsPage.css";

const TableHeader = () => (
  <div className="table-header">
    <div className="request-id">№ Заявки</div>
    <div className="status">Статус</div>
    <div className="date-formed">Дата оформления</div>
    <div className="priority-level">Приоритет</div>
    <div className="total-cost">Стоимость</div>
    <div className="actions">Действия</div>
  </div>
);

const ModerRequestsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { requests, dateFrom, dateTo, status, clientFilter, loading, error } =
    useAppSelector((state) => state.requests);
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  const isModerator = Boolean(user?.is_staff || user?.is_superuser);

  useEffect(() => {
    if (!isAuthenticated || !isModerator) {
      navigate("/403", {
        state: {
          from: "/moder-requests",
          message: "Для доступа к странице необходимо быть модератором",
        },
      });
      return;
    }

    // Первоначальная загрузка данных
    dispatch(fetchRequests());

    // Установка интервала для Short Polling с более длительным интервалом (10 секунд)
    // увеличили до 10000 мс = 10 секунд

    // Очистка интервала при размонтировании компонента
    return () => {};
  }, [
    dispatch,
    dateFrom,
    dateTo,
    status,
    clientFilter,
    isAuthenticated,
    isModerator,
    navigate,
  ]);

  const handleRowClick = (id: number) => {
    navigate(`/request/${id}`);
  };

  const handleStatusChange = async (
    requestId: number,
    newStatus: "Completed" | "Rejected"
  ) => {
    try {
      await dispatch(
        updateRequestStatus({ requestId, status: newStatus })
      ).unwrap();
    } catch (error) {
      // Ошибка уже будет в state.error, поэтому дополнительно обрабатывать не нужно
      console.error("Error updating status:", error);
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

  if (!isAuthenticated || !isModerator) {
    return null;
  }

  return (
    <div className="requests-page">
      <h1>Модерация заявок</h1>

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
        <label>
          Клиент:
          <input
            type="text"
            value={clientFilter}
            onChange={(e) =>
              dispatch(
                setFilters({
                  dateFrom,
                  dateTo,
                  status,
                  clientFilter: e.target.value,
                })
              )
            }
          />
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
        <TableHeader />
        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : (
          <div className="requests-list">
            {requests.map((request: T_Request) => (
              <div key={request.id} className="request-row">
                <div className="cell request-id">{request.id}</div>
                <div className="cell status">{request.status}</div>
                <div className="cell date-formed">
                  {request.formed_date
                    ? new Date(request.formed_date).toLocaleDateString("ru-RU")
                    : new Date(request.creation_date!).toLocaleDateString(
                        "ru-RU"
                      )}
                </div>
                <div className="cell priority-level">
                  {request.priority_level || "Низкий"}
                </div>
                <div className="cell total-cost">
                  {request.total_cost
                    ? `${Number(request.total_cost).toLocaleString("ru-RU")} ₽`
                    : "—"}
                </div>
                {request.status === "Submitted" && (
                  <div className="cell actions">
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
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModerRequestsPage;
