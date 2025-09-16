export const getFiltersFromUrl = function () {
  const params = new URLSearchParams(window.location.search);

  return {
    status: params.get("status")?.split(",").filter(Boolean) || [],
    school_id: params.get("school_id")?.split(",").filter(Boolean) || [],
    gateway: params.get("gateway")?.split(",").filter(Boolean) || [],
    date_from: params.get("date_from") || "",
    date_to: params.get("date_to") || "",
    search: params.get("search") || "",
    page: parseInt(params.get("page") || "1"),
    limit: parseInt(params.get("limit") || "10"),
    sort: params.get("sort") || "payment_time",
    order: params.get("order") || "desc",
  };
};

export const updateUrl = function (filters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(function ([key, value]) {
    if (Array.isArray(value) && value.length > 0) {
      params.set(key, value.join(","));
    } else if (value && !Array.isArray(value)) {
      params.set(key, value.toString());
    }
  });

  const newUrl =
    window.location.pathname +
    (params.toString() ? "?" + params.toString() : "");
  window.history.replaceState({}, "", newUrl);
};

export const getShareableUrl = function (filters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(function ([key, value]) {
    if (Array.isArray(value) && value.length > 0) {
      params.set(key, value.join(","));
    } else if (value && !Array.isArray(value)) {
      params.set(key, value.toString());
    }
  });

  return (
    window.location.origin +
    window.location.pathname +
    (params.toString() ? "?" + params.toString() : "")
  );
};
