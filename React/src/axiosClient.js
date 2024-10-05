import axios from "axios";

const axiosClient = axios.create({
    //baseURL: "https://test.jitume.com/api", 
    baseURL: "http://127.0.0.1:8000/api",
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        try {
            const { response } = error;
            if (response.status === 401) {
                localStorage.removeItem("ACCESS_TOKEN");
            }
        } catch (err) {
            console.log(err);
        }
        throw error;
    }
);

export default axiosClient;