import axios from "axios";
import * as helper from "./serviceHelpers";

const endpoint = `${helper.API_HOST_PREFIX}/api/users`;

export const register = (formData) => {
  const config = {
    method: "POST",
    url: `${endpoint}/register`,
    data: formData,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

export const login = (formData) => {
  const config = {
    method: "POST",
    url: `${endpoint}/login`,
    data: formData,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

export const logout = () => {
  const config = {
    method: "GET",
    url: `${endpoint}/logout`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export const confirmToken = (token) => {
  const config = {
    method: "PUT",
    url: `${endpoint}/${token}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

export const getCurrentUser = () => {
  const config = {
    method: "GET",
    url: `${endpoint}/current`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getPageUsers = (idx, pgSize) => {
  const config = {
    method: "GET",
    url: `${endpoint}/paginate?pageIndex=${idx}&pageSize=${pgSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getSearchUsers = (idx, pgSize, q) => {
  const config = {
    method: "GET",
    url: `${endpoint}/search?pageIndex=${idx}&pageSize=${pgSize}&query=${q}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const updateStatus = (payload) => {
  const config = {
    method: "PUT",
    url: `${endpoint}/statusupdate`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getSearchByRole = (idx, pgSize, role) => {
  const config = {
    method: "GET",
    url: `${endpoint}/roles?pageIndex=${idx}&pageSize=${pgSize}&role=${role}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getSearchByStatus = (idx, pgSize, status) => {
  const config = {
    method: "GET",
    url: `${endpoint}/status?pageIndex=${idx}&pageSize=${pgSize}&status=${status}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export const getByEmail = (email) => {
    const config ={
        method: "GET",
        url: `${endpoint}/forgotpassword/${email}`,
        data: email,
        crossdomain: true,
        headers: {"Content-Type" : "application/json"}
    };
    return axios(config)
    .then(helper.onGlobalSuccess)
    .catch(helper.onGlobalError)
};

export const resetPassword = (payload) => {
    const config ={
        method: "PUT",
        url: `${endpoint}/updatepassword`,
        data: payload,
        crossdomain: true,
        headers: {"Content-Type" : "application/json"}
    };
    return axios(config)
    .catch(helper.onGlobalError)
};

export const updateUser = (payload) => {
    const config ={
        method: "PUT",
        url: `${endpoint}/updateuser`,
        data: payload,
        crossdomain: true,
        headers: {"Content-Type" : "application/json"}
    };
    return axios(config)
    .catch(helper.onGlobalError)
};

export default {
  getPageUsers,
  getSearchUsers,
  updateStatus,
  getSearchByRole,
  getSearchByStatus,
};
