export interface ListProvinceResponse {
  status: string;
  message: string;
  code: number;
  count: number;
  provinceDTOs: ProvinceDTO[];
}

export interface ProvinceDTO {
  provinceCode: string;
  name: string;
  fullName: string;
  administrativeUnitShortName: string;
}
