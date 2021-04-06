import axios from "axios";
import * as helper from "../services/serviceHelpers";

const endpoint = `${helper.API_HOST_PREFIX}/api/comments`;

let getComments = (entityId, entityTypeId) => {
    const config = {
      method: "GET",
      url: endpoint + `/${entityId}/${entityTypeId}`,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" }
    };
  
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
  };

  let addComment = (payload) => {
    const config = {
      method: "POST",
      url: endpoint,
      data: payload,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" }
    };
  
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
  };

  let editComment = (payload, id) => {
    const config = {
      method: "PUT",
      url: endpoint + "/" + id,
      data: payload,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" }
    };
  
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
  };

export {getComments, addComment, editComment};