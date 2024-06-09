import {ProvinceDTO} from "@/utils/DTOs/location/dto/ProvinceDTO.ts";

export interface ListProvinceResponse {
    count: number;
    provinceDTOs: ProvinceDTO[];
}
