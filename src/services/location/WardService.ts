import axios from "axios";
import {BASE_URL_VTC} from "@/constants/urls.ts";

export const getAllWardByDistrictCode = async (districtCode: string) => {
    const response = await axios.get(`${BASE_URL_VTC}/location/ward/get-all-by-district-code/${districtCode}`);
    return response.data;
}