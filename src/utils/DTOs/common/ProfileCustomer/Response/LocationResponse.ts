export interface ProvinceDTO {
  provinceCode: string;
  name: string;
  fullName: string;
  administrativeUnitShortName: string;
}

export interface DistrictDTO {
  districtCode: string;
  name: string;
  fullName: string;
  administrativeUnitShortName: string;
  provinceCode: string;
  provinceName: string;
}

export interface WardDTO {
  wardCode: string;
  name: string;
  fullName: string;
  administrativeUnitShortName: string;
}

export interface LocationResponse {
  status: string;
  message: string;
  code: number;
  administrativeRegionName: string;
  provinceDTO: ProvinceDTO;
  districtDTO: DistrictDTO;
  wardDTO: WardDTO;
}
