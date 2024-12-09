export const getOrigin = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  } else return "";
};

export const getAPIOrigin = (host) => {
  if (process.env.NODE_ENV === "production" && typeof window !== "undefined")
    return window.location.origin;
  return host;
};

export const getCurrentPageUrl = () => {
  if (typeof window !== "undefined") return window.location.href;
  else return "";
};
