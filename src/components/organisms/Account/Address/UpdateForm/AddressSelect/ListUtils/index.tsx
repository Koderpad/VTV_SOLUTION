import {
  DistrictDTO,
  ListDistrictResponse,
} from "@/utils/DTOs/common/ProfileCustomer/Response/ListDistrictResponse";
import {
  ListProvinceResponse,
  ProvinceDTO,
} from "@/utils/DTOs/common/ProfileCustomer/Response/ListProvinceResponse";
import {
  ListWardResponse,
  WardDTO,
} from "@/utils/DTOs/common/ProfileCustomer/Response/ListWardResponse";

export const ListProvince = (props: {
  setProvince: (value: string) => void;
  setShowList: (value: number) => void;
  data: ListProvinceResponse;
  handleProvinceClick: (item: ProvinceDTO) => void;
}): React.ReactElement => {
  return (
    <div className="w-full p-2 px-4 max-h-[200px] overflow-y-scroll">
      <ul className="divide-y divide-gray-200 h-full overflow-auto">
        {props.data.provinceDTOs.map((item) => (
          <li
            className="py-4 px-4 hover:bg-gray-100 cursor-pointer"
            key={item.provinceCode}
            onClick={() => props.handleProvinceClick(item)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
export const ListDistrict = (props: {
  setDistrict: (value: string) => void;
  setShowList: (value: number) => void;
  data: ListDistrictResponse;
  handleDistrictClick: (item: DistrictDTO) => void;
}): React.ReactElement => {
  return (
    <div className="w-full p-2 px-4 max-h-[200px] overflow-y-scroll">
      <ul className="divide-y divide-gray-200 h-full overflow-auto">
        {props.data.districtDTOs.map((item) => (
          <li
            className="py-4 px-4 hover:bg-gray-100 cursor-pointer"
            key={item.districtCode}
            onClick={() => props.handleDistrictClick(item)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const ListWard = (props: {
  setWard: (value: string) => void;
  setShowList: (value: number) => void;
  data: ListWardResponse;
  handleWardClick: (item: WardDTO) => void;
}): React.ReactElement => {
  return (
    <div className="w-full p-2 px-4 max-h-[200px] overflow-y-scroll">
      <ul className="divide-y divide-gray-200 h-full overflow-auto">
        {props.data.wardDTOs.map((item) => (
          <li
            className="py-4 px-4 hover:bg-gray-100 cursor-pointer"
            key={item.wardCode}
            onClick={() => props.handleWardClick(item)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
