import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ListAddressResponse } from "@/utils/DTOs/common/ProfileCustomer/Response/ListAddressResponse";
import { useState } from "react";

interface Props {
  addresses: ListAddressResponse;
  handleUpdate: (addressId: number) => void;
  currentAddressId: number;
}

export const AddressDialog: React.FC<Props> = ({
  addresses,
  handleUpdate,
  currentAddressId,
}) => {
  const [address, setAddress] = useState<number>(currentAddressId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Thay đổi</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Địa Chỉ Của Tôi</DialogTitle>
          <DialogDescription>
            Điền thông tin địa chỉ của bạn để chúng tôi giao hàng chính xác nhất
          </DialogDescription>
          <div className="border-t border-gray-300 w-full my-2"></div>
        </DialogHeader>
        <RadioGroup
          defaultValue={currentAddressId.toString()}
          onValueChange={(e) => {
            setAddress(parseInt(e));
          }}
        >
          {addresses &&
            addresses.addressDTOs.map((address) => (
              <div className="flex pt-4" key={address.addressId}>
                <div className="flex items-center space-x-2 pr-4">
                  <RadioGroupItem
                    value={address.addressId.toString()}
                    id={address.addressId.toString()}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex mb-1">
                    <div className="flex mr-2">
                      <span className="font-bold">{address.fullName}</span>
                      <div className="border-r border-gray-300 h-8 mx-2"></div>
                      <span className="font-mono">{address.phone}</span>
                    </div>
                  </div>
                  <div className="flex mb-1">
                    <div className="flex flex-col mr-2">
                      <div className="">{address.fullAddress}</div>
                      <div className="">
                        {address.provinceFullName}, {address.districtFullName},{" "}
                        {address.wardFullName}
                      </div>
                    </div>
                  </div>
                  <div className="flex mt-1">
                    {address.status === "ACTIVE" && (
                      <span className="border border-red-500 px-1 py-[2px] mb-1 text-red-600">
                        Mặc định
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </RadioGroup>
        <DialogFooter className="flex gap-4">
          <div className="border-t border-gray-300 w-full mb-8"></div>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Hủy
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" onClick={() => handleUpdate(address)}>
              Xác nhận
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { ListAddressResponse } from "@/utils/DTOs/common/ProfileCustomer/Response/ListAddressResponse";
// import { useState } from "react";
//
// interface Props {
//   addresses: ListAddressResponse;
//   handleUpdate: (addressId: number) => void;
//   currentAddressId: number;
// }
//
// export const AddressDialog: React.FC<Props> = ({
//   addresses,
//   handleUpdate,
//   currentAddressId,
// }) => {
//   const [address, setAddress] = useState<number>(currentAddressId);
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">Thay đổi</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>Địa Chỉ Của Tôi</DialogTitle>
//           <DialogDescription>
//             Điền thông tin địa chỉ của bạn để chúng tôi giao hàng chính xác nhất
//           </DialogDescription>
//           <div className="border-t border-gray-300 w-full my-2"></div>
//         </DialogHeader>
//         <RadioGroup
//           defaultValue={currentAddressId.toString()}
//           onValueChange={(e) => {
//             console.log(e);
//             setAddress(parseInt(e));
//           }}
//         >
//           {addresses &&
//             addresses.addressDTOs.map((address) => (
//               <div className="flex pt-4">
//                 <div className="flex items-center space-x-2 pr-4">
//                   <RadioGroupItem
//                     value={address.addressId.toString()}
//                     id={address.addressId.toString()}
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <div className="flex mb-1">
//                     <div className="flex mr-2">
//                       <span className="font-bold">{address.fullName}</span>
//                       <div className="border-r border-gray-300 h-8 mx-2"></div>
//                       <span className="font-mono">{address.phone}</span>
//                     </div>
//                   </div>
//                   <div className="flex mb-1">
//                     <div className="flex flex-col mr-2">
//                       <div className="">{address.fullAddress}</div>
//                       <div className="">
//                         {address.provinceFullName}, {address.districtFullName},{" "}
//                         {address.wardFullName}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex mt-1">
//                     {address.status === "ACTIVE" && (
//                       <span className="border border-red-500 px-1 py-[2px] mb-1 text-red-600">
//                         Mặc định
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//         </RadioGroup>
//         <DialogFooter className="flex gap-4">
//           <div className="border-t border-gray-300 w-full mb-8"></div>
//           <DialogClose asChild>
//             <Button type="button" variant="secondary">
//               Hủy
//             </Button>
//           </DialogClose>
//           <DialogClose asChild>
//             <Button type="submit" onClick={() => handleUpdate(address)}>
//               Xác nhận
//             </Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };
