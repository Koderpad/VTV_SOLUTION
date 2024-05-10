import { ListDistrictResponse } from "@/utils/DTOs/common/ProfileCustomer/Response/ListDistrictResponse";
import { ListProvinceResponse } from "@/utils/DTOs/common/ProfileCustomer/Response/ListProvinceResponse";

export const ListProvince = (props: {
  setProvince: (value: string) => void;
  setShowList: (value: number) => void;
  data: ListProvinceResponse;
}): React.ReactElement => {
  const handClick = (item: any) => {
    props.setProvince(item);
    props.setShowList(1);
  };

  return (
    <div className="w-full p-2 px-4 max-h-[200px] overflow-y-scroll">
      <ul className="divide-y divide-gray-200 h-full overflow-auto">
        {props.data.provinceDTOs.map((item) => (
          <li
            className="py-4 px-4 hover:bg-gray-100 cursor-pointer"
            key={item.provinceCode}
            onClick={() => handClick(item)}
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
}): React.ReactElement => {
  const handClick = (item: any) => {
    props.setDistrict(item);
    props.setShowList(2);
  };
  return (
    <div className="w-full p-2 px-4 max-h-[200px] overflow-y-scroll">
      <ul className="divide-y divide-gray-200 h-full overflow-auto">
        {props.data.districtDTOs.map((item) => (
          <li
            className="py-4 px-4 hover:bg-gray-100 cursor-pointer"
            key={item.districtCode}
            onClick={() => handClick(item)}
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
  data: any;
}): React.ReactElement => {
  const handClick = (item: any) => {
    props.setWard(item);
    props.setShowList(-1);
  };
  return (
    <div className="w-full p-2 px-4 max-h-[200px] overflow-y-scroll">
      <ul className="divide-y divide-gray-200 h-full overflow-auto">
        {props.data?.wards?.map((item: any) => (
          <li
            className="py-4 px-4 hover:bg-gray-100 cursor-pointer"
            key={item.code}
            onClick={() => handClick(item)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
