import React, { Dispatch, useEffect, useRef, useState } from "react";
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
} from "@/services/common/AddressService";
import {
  ListProvinceResponse,
  ProvinceDTO,
} from "@/utils/DTOs/common/ProfileCustomer/Response/ListProvinceResponse";
import {
  DistrictDTO,
  ListDistrictResponse,
} from "@/utils/DTOs/common/ProfileCustomer/Response/ListDistrictResponse";
import { ListDistrict, ListProvince, ListWard } from "./ListUtils";

interface AddressSelectProps {
  setProvince: Dispatch<React.SetStateAction<string | undefined>>;
  setDistrict: Dispatch<React.SetStateAction<string | undefined>>;
  setWard: Dispatch<React.SetStateAction<string | undefined>>;
}

const AddressSelect = ({
  setProvince,
  setDistrict,
  setWard,
}: AddressSelectProps) => {
  const [open, setOpen] = useState(false);
  const [showList, setShowList] = useState(0);
  const [address, setAddress] = useState(
    "Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã"
  );
  const ref = useRef<HTMLDivElement>(null);
  const [province, setProvinceState] = useState<ProvinceDTO>();
  const [district, setDistrictState] = useState<DistrictDTO>();
  const [ward, setWardState] = useState<any>(null);
  const [provinces, setProvinces] = useState<ListProvinceResponse>();
  const [districts, setDistricts] = useState<ListDistrictResponse>();
  const [wards, setWards] = useState();

  useEffect(() => {
    const fetchProvinces = async () => {
      const data = await getProvinces();
      console.log("data of province: ", data);
      setProvinces(data);
    };
    console.log("fetch province");
    fetchProvinces();
  }, []);

  useEffect(() => {
    setAddress(
      `${province ? province.name : "Tỉnh/ Thành phố"}, ${district ? district.name : "Quận/Huyện"}, ${
        ward ? ward.name : "Phường/Xã"
      }`
    );
    setProvince(province ? province.name : "Tỉnh/ Thành phố");
    setDistrict(district ? district.name : "Quận/Huyện");
    setWard(ward ? ward.name : "Phường/Xã");
  }, [province, district, ward]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen && setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [setOpen]);

  const handleProvinceClick = async (province: ProvinceDTO) => {
    setProvinceState(province);
    setShowList(1);
    const data = await getDistrictsByProvinceCode(province.code);
    setDistricts(data);
  };

  const handleDistrictClick = async (district: any) => {
    setDistrictState(district);
    setShowList(2);
    const data = await getWardsByDistrictCode(district.code);
    setWards(data);
  };

  const handleWardClick = (item: any) => {
    setWardState(item);
    setShowList(-1);
  };

  if (!provinces) {
    return <>Loading province.....</>;
  }

  if ((!districts && showList === 1) || (!wards && showList === 2)) {
    return <>Loading district and ward.....</>;
  }

  console.log("count: ++");

  return (
    <div className="mb-4">
      <label
        htmlFor="address"
        className="block text-gray-700 text-sm font-medium mb-2"
      >
        Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã
      </label>

      <div className="relative">
        <button
          type="button"
          className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full flex items-center justify-between"
          id="dropdown-button"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => setOpen(!open)}
        >
          {address}
          <svg
            className="w-5 h-5 ml-2 -mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div
          ref={ref}
          className={
            " absolute left-0 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10" +
            (open ? " block " : " hidden ")
          }
        >
          <div className="grid grid-cols-3 gap-4 p-4">
            <div className="col-span-1">
              <div
                className={
                  showList === 0
                    ? "py-2 flex items-center justify-center text-red-600 font-semibold cursor-pointer border-b-2 border-red-500"
                    : "py-2 flex items-center justify-center text-gray-400 font-semibold cursor-pointer"
                }
              >
                Tỉnh/ Thành phố
              </div>
            </div>
            <div className="col-span-1">
              <div
                className={
                  showList === 1
                    ? "py-2 flex items-center justify-center text-red-600 font-semibold cursor-pointer border-b-2 border-red-500"
                    : "py-2 flex items-center justify-center text-gray-400 font-semibold cursor-pointer"
                }
              >
                Quận/ Huyện
              </div>
            </div>
            <div className="col-span-1">
              <div
                className={
                  showList === 2
                    ? "py-2 flex items-center justify-center text-red-600 font-semibold cursor-pointer border-b-2 border-red-500"
                    : "py-2 flex items-center justify-center text-gray-400 font-semibold cursor-pointer"
                }
              >
                Phường/ Xã
              </div>
            </div>
          </div>
          {showList === 0 && (
            <ListProvince
              setProvince={setProvince}
              setShowList={setShowList}
              data={provinces}
              handleProvinceClick={handleProvinceClick}
            />
          )}
          {showList === 1 && (
            <ListDistrict
              setDistrict={setDistrict}
              setShowList={setShowList}
              data={districts!}
              handleDistrictClick={handleDistrictClick}
            />
          )}
          {showList === 2 && (
            <ListWard
              setWard={setWard}
              setShowList={setShowList}
              data={wards}
              handleWardClick={handleWardClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressSelect;

// const ListProvince = (props: {
//   setProvince: (value: string) => void;
//   setShowList: (value: number) => void;
//   data: ListProvinceResponse;
// }): React.ReactElement => {
//   const handClick = (item: any) => {
//     props.setProvince(item);
//     props.setShowList(1);
//   };

//   return (
//     <div className="w-full p-2 px-4 max-h-[200px] overflow-y-scroll">
//       <ul className="divide-y divide-gray-200 h-full overflow-auto">
//         {props.data.map((item) => (
//           <li
//             className="py-4 px-4 hover:bg-gray-100 cursor-pointer"
//             key={item.code}
//             onClick={() => handClick(item)}
//           >
//             {item.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };
// const ListDistrict = (props: {
//   setDistrict: (value: string) => void;
//   setShowList: (value: number) => void;
//   data: any;
// }): React.ReactElement => {
//   const handClick = (item: any) => {
//     props.setDistrict(item);
//     props.setShowList(2);
//   };
//   return (
//     <div className="w-full p-2 px-4 max-h-[200px] overflow-y-scroll">
//       <ul className="divide-y divide-gray-200 h-full overflow-auto">
//         {props.data?.districts?.map((item: any) => (
//           <li
//             className="py-4 px-4 hover:bg-gray-100 cursor-pointer"
//             key={item.code}
//             onClick={() => handClick(item)}
//           >
//             {item.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// const ListWard = (props: {
//   setWard: (value: string) => void;
//   setShowList: (value: number) => void;
//   data: any;
// }): React.ReactElement => {
//   const handClick = (item: any) => {
//     props.setWard(item);
//     props.setShowList(-1);
//   };
//   return (
//     <div className="w-full p-2 px-4 max-h-[200px] overflow-y-scroll">
//       <ul className="divide-y divide-gray-200 h-full overflow-auto">
//         {props.data?.wards?.map((item: any) => (
//           <li
//             className="py-4 px-4 hover:bg-gray-100 cursor-pointer"
//             key={item.code}
//             onClick={() => handClick(item)}
//           >
//             {item.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };
