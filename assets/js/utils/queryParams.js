export const getQueryParams = () =>
  Object.fromEntries(new URLSearchParams(window.location.search).entries());

export const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const updateUrlQuery = (params = {}) => {
  const query = buildQueryString(params);
  const nextUrl = `${window.location.pathname}${query}`;
  window.history.replaceState({}, "", nextUrl);
};
