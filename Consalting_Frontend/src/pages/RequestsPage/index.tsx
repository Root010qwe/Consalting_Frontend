import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchRequests, setFilters } from "../../slices/requestSlice";
import RequestCard from "../../components/RequestCard";
import { T_Request } from "../../modules/types";
import "./RequestsPage.css";

const TableHeader = () => (
  <div className="table-header">
    <div className="request-id">№ Заявки</div>
    <div className="status">Статус</div>
    <div className="date-formed">Дата оформления</div>
    <div className="priority-level">Приоритет</div>
    <div className="total-cost">Стоимость</div>
  </div>
);

const RequestsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { requests, dateFrom, dateTo, status, clientFilter, loading, error } = useAppSelector(
    (state) => state.requests
  );
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/403', { state: { from: '/requests', message: 'Для доступа к странице необходимо авторизоваться' } });
      return;
    }

    dispatch(fetchRequests());
  }, [dispatch, dateFrom, dateTo, status, clientFilter, isAuthenticated, navigate]);

  const handleRowClick = (id: number) => {
    navigate(`/request/${id}`);
  };

  const handleClearClientFilter = () => {
    dispatch(setFilters({
      dateFrom: '',
      dateTo: '',
      status: ''
    }));
  };

  if (!isAuthenticated) {
    return null; // Предотвращаем рендер содержимого для неавторизованных пользователей
  }

  return (
    <div className="requests-page">
      <h1>Заявки</h1>
      
      {clientFilter && (
        <div className="alert">
          <span>Показаны заявки клиента: {clientFilter}</span>
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={handleClearClientFilter}
          >
            Сбросить фильтры
          </button>
        </div>
      )}

      {error && <div className="error">{error}</div>}
      
      <div className="filters">
        <label>
          Дата от:
          <input
            type="date"
            value={dateFrom}
            onChange={(e) =>
              dispatch(setFilters({ dateFrom: e.target.value, dateTo, status, clientFilter }))
            }
          />
        </label>
        <label>
          Дата до:
          <input
            type="date"
            value={dateTo}
            onChange={(e) =>
              dispatch(setFilters({ dateFrom, dateTo: e.target.value, status, clientFilter }))
            }
          />
        </label>
        <label>
          Статус:
          <select
            value={status}
            onChange={(e) =>
              dispatch(setFilters({ dateFrom, dateTo, status: e.target.value, clientFilter }))
            }
          >
            <option value="">Все</option>
            <option value="Draft">Черновик</option>
            <option value="Submitted">Подтверждено</option>
            <option value="Completed">Завершено</option>
            <option value="Rejected">Отклонено</option>
          </select>
        </label>
      </div>

      <div className="table-container">
        <TableHeader />
        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : (
          <div className="requests-list">
            {requests.map((request: T_Request) => (
              <RequestCard
                key={request.id}
                id={request.id!}
                status={request.status as "Draft" | "Submitted" | "Completed" | "Rejected"}
                formedAt={request.formed_date || request.creation_date || null}
                priority_level={request.priority_level || "Low"}
                totalCost={parseFloat(request.total_cost || "0")}
                onClick={() => handleRowClick(request.id!)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsPage;
