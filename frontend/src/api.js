import axios from "axios";

const api = axios.create({
    baseURL: "https://madhancrackers.gt.tc/api",
});

export default api;