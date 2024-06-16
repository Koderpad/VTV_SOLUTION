import axios from "axios";
import {BASE_URL_VTC} from "@/constants/urls.ts";



export const getAllDistrictByProvinceCode = async (provinceCode: string) => {
    const response = await axios.get(`${BASE_URL_VTC}/location/district/get-all-by-province-code/${provinceCode}`);
    return response.data;
}