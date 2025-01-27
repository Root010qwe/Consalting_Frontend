/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Login {
  /**
   * Username
   * @minLength 1
   */
  username: string;
  /**
   * Password
   * @minLength 1
   */
  password: string;
}

export interface User {
  /** ID */
  id?: number;
  /**
   * Username
   * @minLength 1
   * @maxLength 50
   */
  username: string;
  /**
   * Password
   * @minLength 1
   */
  password: string;
}

export interface Request {
  /** ID */
  id?: number;
  /** Client */
  client: number;
  /** Status */
  status?: "Draft" | "Submitted" | "Completed" | "Rejected" | "Deleted";
  /**
   * Creation date
   * @format date-time
   */
  creation_date?: string;
  /**
   * Completion date
   * @format date-time
   */
  completion_date?: string | null;
  /**
   * Manager username
   * @minLength 1
   */
  manager_username?: string;
  /**
   * Total cost
   * @format decimal
   */
  total_cost?: string | null;
}

export interface Service {
  /** ID */
  id?: number;
  /**
   * Name
   * @minLength 1
   * @maxLength 100
   */
  name: string;
  /** Description */
  description?: string | null;
  /** Status */
  status?: "A" | "D";
  /**
   * Price
   * @format decimal
   */
  price: string;
  /**
   * Duration
   * Длительность в часах
   * @min 0
   * @max 2147483647
   */
  duration?: number | null;
  /**
   * Image url
   * Ссылка на изображение услуги
   * @format uri
   * @maxLength 200
   */
  image_url?: string | null;
}

export interface ServiceRequest {
  /** ID */
  id?: number;
  service?: Service;
  /** Comment */
  comment?: string | null;
}

export interface RequestDetail {
  /** ID */
  id?: number;
  /** Client */
  client: number;
  /** Manager */
  manager?: number | null;
  /** Status */
  status?: "Draft" | "Submitted" | "Completed" | "Rejected" | "Deleted";
  /**
   * Creation date
   * @format date-time
   */
  creation_date?: string;
  /**
   * Completion date
   * @format date-time
   */
  completion_date?: string | null;
  service_requests?: ServiceRequest[];
  /**
   * Total cost
   * @format decimal
   */
  total_cost?: string | null;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8000" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Signs the user in
     *
     * @tags api
     * @name ApiUsersLoginCreate
     * @request POST:/api/users/login/
     * @secure
     */
    apiUsersLoginCreate: (data: Login, params: RequestParams = {}) =>
      this.request<Login, any>({
        path: `/api/users/login/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Деавторизирует текущего пользователя.
     *
     * @tags api
     * @name ApiUsersLogoutCreate
     * @request POST:/api/users/logout/
     * @secure
     */
    apiUsersLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Обновляет данные текущего пользователя (partial=True)
     *
     * @tags api
     * @name ApiUsersUpdateUpdate
     * @request PUT:/api/users/update/
     * @secure
     */
    apiUsersUpdateUpdate: (data: User, params: RequestParams = {}) =>
      this.request<User, void>({
        path: `/api/users/update/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  requestItems = {
    /**
     * No description
     *
     * @tags request-items
     * @name RequestItemsDeleteDelete
     * @request DELETE:/request-items/{request_id}/{service_id}/delete/
     * @secure
     */
    requestItemsDeleteDelete: (requestId: string, serviceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/request-items/${requestId}/${serviceId}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Обновляет комментарий к услуге (service_id) в заявке (request_id)
     *
     * @tags request-items
     * @name RequestItemsUpdateUpdate
     * @request PUT:/request-items/{request_id}/{service_id}/update/
     * @secure
     */
    requestItemsUpdateUpdate: (
      requestId: string,
      serviceId: string,
      data: {
        /** Комментарий к услуге */
        comment: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/request-items/${requestId}/${serviceId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  requests = {
    /**
     * @description Получает список заявок. Доступно менеджеру/админу - все заявки; обычному пользователю - только свои
     *
     * @tags requests
     * @name RequestsList
     * @request GET:/requests/
     * @secure
     */
    requestsList: (
      query?: {
        /** Начальная дата (формат: YYYY-MM-DD) */
        start_date?: string;
        /** Конечная дата (формат: YYYY-MM-DD) */
        end_date?: string;
        /** Фильтр по статусу */
        status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Request[], any>({
        path: `/requests/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает детальную информацию о заявке по ID
     *
     * @tags requests
     * @name RequestsRead
     * @request GET:/requests/{id}/
     * @secure
     */
    requestsRead: (id: string, params: RequestParams = {}) =>
      this.request<RequestDetail, void>({
        path: `/requests/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Менеджер меняет статус заявки на Completed или Rejected
     *
     * @tags requests
     * @name RequestsCompleteOrRejectUpdate
     * @request PUT:/requests/{id}/complete-or-reject/
     * @secure
     */
    requestsCompleteOrRejectUpdate: (
      id: string,
      data: {
        /** Допустимые значения: 'Completed' или 'Rejected' */
        status: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/requests/${id}/complete-or-reject/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Удаляет заявку только если она в статусе Draft
     *
     * @tags requests
     * @name RequestsDeleteDelete
     * @request DELETE:/requests/{id}/delete/
     * @secure
     */
    requestsDeleteDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/requests/${id}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Переводит черновую заявку в 'Submitted', если все условия выполнены
     *
     * @tags requests
     * @name RequestsFormUpdate
     * @request PUT:/requests/{id}/form/
     * @secure
     */
    requestsFormUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/requests/${id}/form/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * @description Обновляет заявку (для менеджера)
     *
     * @tags requests
     * @name RequestsUpdateUpdate
     * @request PUT:/requests/{id}/update/
     * @secure
     */
    requestsUpdateUpdate: (id: string, data: Request, params: RequestParams = {}) =>
      this.request<Request, void>({
        path: `/requests/${id}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  services = {
    /**
     * @description Возвращает список активных услуг. Можно передать параметр 'name' для фильтрации.
     *
     * @tags services
     * @name ServicesList
     * @request GET:/services/
     * @secure
     */
    servicesList: (
      query?: {
        /** Фильтровать по подстроке в имени услуги */
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/services/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Создаёт новую услугу
     *
     * @tags services
     * @name ServicesCreateCreate
     * @request POST:/services/create/
     * @secure
     */
    servicesCreateCreate: (data: Service, params: RequestParams = {}) =>
      this.request<Service, void>({
        path: `/services/create/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает детальную информацию об услуге по ID
     *
     * @tags services
     * @name ServicesRead
     * @request GET:/services/{id}/
     * @secure
     */
    servicesRead: (id: string, params: RequestParams = {}) =>
      this.request<Service, void>({
        path: `/services/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags services
     * @name ServicesAddToDraftCreate
     * @request POST:/services/{id}/add-to-draft/
     * @secure
     */
    servicesAddToDraftCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/services/${id}/add-to-draft/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Помечает услугу как 'Deleted'
     *
     * @tags services
     * @name ServicesDeleteDelete
     * @request DELETE:/services/{id}/delete/
     * @secure
     */
    servicesDeleteDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/services/${id}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags services
     * @name ServicesUpdateUpdate
     * @request PUT:/services/{id}/update/
     * @secure
     */
    servicesUpdateUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/services/${id}/update/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags services
     * @name ServicesUpdateImageCreate
     * @request POST:/services/{service_id}/update-image/
     * @secure
     */
    servicesUpdateImageCreate: (serviceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/services/${serviceId}/update-image/`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  user = {
    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags user
     * @name UserList
     * @request GET:/user/
     * @secure
     */
    userList: (params: RequestParams = {}) =>
      this.request<User[], any>({
        path: `/user/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Создаёт нового пользователя
     *
     * @tags user
     * @name UserCreate
     * @request POST:/user/
     * @secure
     */
    userCreate: (data: User, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/user/`,
        method: "POST",
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags user
     * @name UserRead
     * @request GET:/user/{id}/
     * @secure
     */
    userRead: (id: number, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags user
     * @name UserUpdate
     * @request PUT:/user/{id}/
     * @secure
     */
    userUpdate: (id: number, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags user
     * @name UserPartialUpdate
     * @request PATCH:/user/{id}/
     * @secure
     */
    userPartialUpdate: (id: number, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags user
     * @name UserDelete
     * @request DELETE:/user/{id}/
     * @secure
     */
    userDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
}
