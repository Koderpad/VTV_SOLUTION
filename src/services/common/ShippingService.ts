import { BASE_URL_VTC } from "@/constants/urls";
import axios from "axios";

const API_BASE_URL = `${BASE_URL_VTC}/shipping`;

export const getShippingProvidersByWard = async (
  wardCodeCustomer: string,
  wardCodeShop: string
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/transport-providers?wardCodeCustomer=${wardCodeCustomer}&wardCodeShop=${wardCodeShop}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching shipping providers:", error);
    return [];
  }
};
