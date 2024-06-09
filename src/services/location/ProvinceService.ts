import axios from "axios";
import {BASE_URL_VTC} from "@/constants/urls.ts";

export const getAllProvince = async () => {
    const response = await axios.get(`${BASE_URL_VTC}/location/province/get-all`);
    return response.data;
}


export const fetchAllProvince = async () => {
    try {
        const response = await getAllProvince();
        return response;
    }catch (e) {
        // @ts-ignore
        throw e.response.data;
    }
}
