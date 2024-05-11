export interface WardDTO {
  wardCode: string;
  name: string;
  fullName: string;
  administrativeUnitShortName: string;
}

export interface ListWardResponse {
  status: string;
  message: string;
  code: number;
  count: number;
  districtCode: string;
  wardDTOs: WardDTO[];
}
