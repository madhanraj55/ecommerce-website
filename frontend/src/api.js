import axios from "axios";

const api = axios.create({
    baseURL: "http://madhancrackers.gt.tc/api",
});

export default api;