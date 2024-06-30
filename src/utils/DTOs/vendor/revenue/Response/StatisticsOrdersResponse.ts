export interface StatisticsOrdersResponse {
  status: string;
  message: string;
  code: number;
  count: number;
  totalOrder: number;
  totalMoney: number;
  dateStart: string;
  dateEnd: string;
  statisticsOrderDTOs: StatisticsOrderDTO[];
}

export interface StatisticsOrderDTO {
  totalMoney: number;
  totalOrder: number;
  totalProduct: number;
  date: string;
}
