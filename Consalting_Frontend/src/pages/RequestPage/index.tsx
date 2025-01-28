import { FC, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store.ts";
import { RequestCard } from "../../components/ReqCard";
import {
  fetchRequestDetail,
  submitDraftRequest,
  deleteDraftRequest,
} from "../../slices/requestDraftSlice.ts";

const RequestPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const request = useAppSelector((state) => state.requestDraftSlice.request);

  useEffect(() => {
    if (id && !request) {
      dispatch(fetchRequestDetail(id));
    }
  }, [dispatch, id, request]);

  const handleSubmitRequest = () => {
    if (id) {
      dispatch(submitDraftRequest(id))
        .unwrap()
        .then(() => {
          console.log("Заявка успешно сформирована!");
          alert("Заявка успешно сформирована!");
          navigate("/requests"); // Переход на страницу списка заявок
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
            console.log("Заявка успешно удалена!");
            alert("Заявка успешно удалена!");
            navigate("/requests"); // Переход на страницу списка заявок
          })
          .catch((error) => {
            console.error("Ошибка при удалении заявки:", error);
            alert("Не удалось удалить заявку.");
          });
      }
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
          <h2 className="title">В обработке</h2>
          {isDraft && (
            <div className="d-flex justify-content-end gap-2 my-3">
              <button className="btn btn-primary" onClick={handleSubmitRequest}>
                Сформировать заявку
              </button>
              <button className="btn btn-danger" onClick={handleDeleteRequest}>
                Удалить заявку
              </button>
            </div>
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
    </div>
  );
};

export default RequestPage;
