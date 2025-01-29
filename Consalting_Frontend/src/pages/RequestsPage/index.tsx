import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchRequests, setFilters } from "../../slices/requestSlice";
import RequestCard from "../../components/RequestCard";
import { T_Request } from "../../modules/types";

const TableHeader = () => (
  <div className="table-header">
    <div className="header-info">
      <div className="header-item request-id">№ Заявки</div>
      <div className="header-item client-name">Клиент</div>
      <div className="header-item status">Статус</div>
      <div className="header-item date-formed">Дата оформления</div>
      <div className="header-item total-cost">Стоимость</div>
    </div>
  </div>
);

const RequestsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { requests, dateFrom, dateTo, status, clientFilter, loading, error } = useAppSelector(
    (state) => state.requests
  );

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch, dateFrom, dateTo, status]);

  const handleRowClick = (id: number) => {
    navigate(`/request/${id}`);
  };

  return (
    <div className="requests-page">
      <h1>Заявки</h1>
      {clientFilter && (
        <div className="alert alert-info">
          Показаны заявки клиента: {clientFilter}
          <button 
            className="btn btn-sm btn-outline-info ms-2"
            onClick={() => dispatch(setFilters({ dateFrom, dateTo, status, clientFilter: '' }))}
          >
            Сбросить фильтр
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
              dispatch(setFilters({ dateFrom: e.target.value, dateTo, status }))
            }
          />
        </label>
        <label>
          Дата до:
          <input
            type="date"
            value={dateTo}
            onChange={(e) =>
              dispatch(setFilters({ dateFrom, dateTo: e.target.value, status }))
            }
          />
        </label>
        <label>
          Статус:
          <select
            value={status}
            onChange={(e) =>
              dispatch(setFilters({ dateFrom, dateTo, status: e.target.value }))
            }
          >
            <option value="">Все</option>
            <option value="Draft">Черновик</option>
            <option value="Submitted">Отправлено</option>
            <option value="Completed">Завершено</option>
            <option value="Rejected">Отклонено</option>
          </select>
        </label>
      </div>

      <TableHeader />

      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="requests-list">
          {requests.map((request: T_Request) => (
            <RequestCard
              key={request.id}
              id={request.id!}
              client={request.client.toString()}
              status={
                request.status as
                  | "Draft"
                  | "Submitted"
                  | "Completed"
                  | "Rejected"
              }
              formedAt={request.creation_date || null}
              totalCost={parseFloat(request.total_cost || "0")}
              onClick={() => handleRowClick(request.id!)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
