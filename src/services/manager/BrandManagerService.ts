import { BASE_URL_VTC } from "@/constants/urls";
import axios from "axios";
import {BrandsResponse} from "@/utils/DTOs/manager/response/BrandsResponse.ts";
import {BrandResponse} from "@/utils/DTOs/manager/response/BrandResponse.ts";

export const getAllBrands = async (): Promise<BrandsResponse> => {
    const response = await axios.get(`${BASE_URL_VTC}/brand/all`);
    return response.data;
}



export const getBrandByBrandId = async (brandId: string | undefined): Promise<BrandResponse> => {
    const response = await axios.get(`${BASE_URL_VTC}/brand/get/${brandId}`);
    return response.data;
}