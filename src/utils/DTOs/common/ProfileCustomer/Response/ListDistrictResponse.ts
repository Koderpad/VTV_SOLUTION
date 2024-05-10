export interface ListDistrictResponse {
  status: string;
  message: string;
  code: number;
  count: number;
  provinceCode: string;
  districtDTOs: DistrictDTO[];
}

export interface DistrictDTO {
  districtCode: string;
  name: string;
  fullName: string;
  administrativeUnitShortName: string;
  provinceCode: string;
  provinceName: string;
}
