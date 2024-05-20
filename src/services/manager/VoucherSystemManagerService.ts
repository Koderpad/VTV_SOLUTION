import {BASE_URL_VTC} from "@/constants/urls";
import axios from "axios";
import {VoucherResponse} from "@/utils/DTOs/manager/response/VoucherResponse.ts";
import {ListVoucherResponse} from "@/utils/DTOs/manager/response/ListVoucherResponse.ts";

export const getVoucherByVoucherId = async (voucherId: number): Promise<VoucherResponse> => {
    const response = await axios.get(`${BASE_URL_VTC}/voucher/detail/${voucherId}`);
    return response.data;
}

export const fetchVoucherByVoucherId = async (voucherId: string | undefined) => {
    try {
        const response = await getVoucherByVoucherId(voucherId);
        return response;
    }catch (e) {
        throw e.response.data;
    }
}


export const listVoucherByShopId = async (shopId: number): Promise<ListVoucherResponse> => {
    const response = await axios.get(`${BASE_URL_VTC}/voucher/list-on-shop/${shopId}`);
    return response.data;
}

export const listVoucherSystem = async (): Promise<ListVoucherResponse> => {
    const response = await axios.get(`${BASE_URL_VTC}/voucher/list-on-system`);
    return response.data;
}



export const fetchVoucherSystemsResponse = async () => {
    try {
        const response = await listVoucherSystem();
        return response;
    }catch (e) {
        throw e.response.data;
    }
};


export const listVoucherByType = async (type: string): Promise<ListVoucherResponse> => {
    const response = await axios.get(`${BASE_URL_VTC}/voucher/list-by-type/${type}`);
    return response.data;
}

export const listAllVoucher = async (): Promise<ListVoucherResponse> => {
    const response = await axios.get(`${BASE_URL_VTC}/voucher/list-all`);
    return response.data;
}