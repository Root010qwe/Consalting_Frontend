"use strict";

import { getCookie } from "./Utils";

interface PostParams {
  url: string;
  body: object;
}

interface RequestParams {
  url: string;
  body?: object;
  method: string;
}

class Ajax {
  static get(url: string) {
    return this.makeRequest({ method: "GET", url });
  }

  static post({ url, body }: PostParams) {
    return this.makeRequest({ method: "POST", url, body });
  }

  static put({ url, body }: PostParams) {
    return this.makeRequest({ method: "PUT", url, body });
  }

  static patch({ url, body }: PostParams) {
    return this.makeRequest({ method: "PATCH", url, body });
  }

  static delete({ url, body }: PostParams) {
    return this.makeRequest({ method: "DELETE", url, body });
  }

  private static async makeRequest({
    method,
    url,
    body = {}
  }: RequestParams): Promise<Response> {
    const isFormData = body instanceof FormData;

    const headers: HeadersInit = {};
    if (method !== "GET") {
      headers["X-CSRF-Token"] = `Bearer ${getCookie("csrf_token")}`;
    }
    if (!isFormData && method !== "GET") {
      headers["Content-Type"] = "application/json";
    }

    const request = new Request(url, {
      method,
      headers,
      credentials: "include",
      body: isFormData ? (body as BodyInit) : JSON.stringify(body)
    });

    return await fetch(request);
  }
}

export default Ajax;
