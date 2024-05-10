// api.ts
import { ListProvinceResponse } from "@/utils/DTOs/common/ProfileCustomer/Response/ListProvinceResponse";
import axios from "axios";

const API_BASE_URL = "http://localhost:8585/api/location";

export const getProvinces = async (): Promise<ListProvinceResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/province/get-all`);
    console.log("get all province");
    return response.data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return {} as ListProvinceResponse;
  }
};

export const getDistrictsByProvinceCode = async (provinceCode: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/district/get-all-by-province-code/${provinceCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching districts:", error);
    return [];
  }
};

export const getWardsByDistrictCode = async (districtCode: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/ward/get-all-by-district-code/${districtCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching wards:", error);
    return [];
  }
};
