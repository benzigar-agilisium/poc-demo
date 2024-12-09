import { getAPIOrigin } from "@/utils/urls";

const API = {
  HOST: getAPIOrigin("http://localhost:8000"),
  DIRECTORIES_LIST: "/api/directories/get-all-directories",
  CONTENTS_LIST: "/api/contents/get-all-contents",
  CONTENTS_CREATE: "/api/contents/create",
  FILE_CREATE: "/api/files/create",
  SIGNED_URL_GET: "/api/files/get-signed-url",
  CONTENT_SINGLE_GET: "/api/contents/get-content/",
  CONTENT_DELETE: "/api/contents/delete-content/",
};

export default API;
