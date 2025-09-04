function MakeQueryString(params: { [key: string]: string }) {
  const queryString = params
    ? Object.entries(params)
        .map((param) => {
          return `${param[0]}=${param[1]}`;
        })
        .join("&")
    : "";

  return queryString;
}

export function getFetch(
  url: string,
  params?: { [key: string]: string },
  headers?: { [key: string]: string },
  credentials: "include" | "omit" | "same-origin" = "include"
) {
  const queryString = MakeQueryString(params ?? {});
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  return fetch(url + (queryString ? "" : "") + queryString, {
    method: "GET",
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  });
}

export function postFetch(
  url: string,
  data: any,
  params?: { [key: string]: string }
) {
  const queryString = MakeQueryString(params ?? {});

  return fetch(url + "?" + queryString, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: data,
  });
}

export function updateFetch(
  url: string,
  data: any,
  method: "PUT" | "PATCH" = "PUT",
  params?: { [key: string]: string }
) {
  const queryString = MakeQueryString(params ?? {});

  return fetch(url + "?" + queryString, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },

    body: data,
  });
}

export function deleteFetch(url: string, params?: { [key: string]: string }) {
  const queryString = MakeQueryString(params ?? {});

  return fetch(url + "?" + queryString, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
