import axios, { AxiosResponse } from "axios";


axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  patch: (url: string, body: {}) => axios.patch(url, body).then(responseBody),
};

const Auth = {
  register: (form: any) => requests.post("auth/register", form),
  login: (form: any) => requests.post("auth/login", form),

  updatePassword: (form: any) => requests.put("auth/update-password", form),
  updateProfile: (form: any) => requests.put("users/update-profile", form),
  profile: () => requests.get("users/profile"),
  myProgress: () => requests.get("users/my-progress"),
  updateMyProgress: (form: any) => requests.patch("users/my-progress", form),
};

const Subjects = {
  list: () => requests.get("subjects"),
  preRequisites: () => requests.get("subjects/prerequisites-map"),
  postRequisites: () => requests.get("subjects/postrequisites-map"),
};

const agent = { Auth, requests, Subjects };

export default agent;
