import React, { useEffect, useState } from "react";
import { useForm, Controller, set } from "react-hook-form";
import {
  useGetAllShopVouchersQuery,
  useUpdateVoucherStatusMutation,
  useGetVoucherDetailQuery,
  useUpdateVoucherMutation,
  useAddVoucherMutation,
} from "@/redux/features/vendor/vouchers/vouchersApiSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VoucherDTO } from "@/utils/DTOs/vendor/vouchers/Response/ListVoucherShopResponse";
import { VoucherShopRequest } from "@/utils/DTOs/vendor/vouchers/Request/VoucherShopRequest";
import { handleApiCall } from "@/utils/HandleAPI/common/handleApiCall";
import { VoucherShopResponse } from "@/utils/DTOs/vendor/vouchers/Response/VoucherShopResponse";
import { ServerError } from "@/utils/DTOs/common/ServerError";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//
const getVietnameseStatus = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "Hoạt động";
    case "INACTIVE":
      return "Không hoạt động";
    case "DELETED":
      return "Đã xóa";
    case "CANCEL":
      return "Đã hủy";
    case "LOCKED":
      return "Đã khóa";
    default:
      return status;
  }
};

const getVietnameseType = (type: string) => {
  switch (type) {
    case "PERCENTAGE_SHOP":
      return "Phần trăm cửa hàng";
    case "PERCENTAGE_SYSTEM":
      return "Phần trăm hệ thống";
    case "MONEY_SHOP":
      return "Tiền cửa hàng";
    case "MONEY_SYSTEM":
      return "Tiền hệ thống";
    default:
      return type;
  }
};

export const Vouchers: React.FC = () => {
  const {
    data: vouchersData,
    isLoading,
    refetch,
  } = useGetAllShopVouchersQuery();
  const [updateVoucherStatus] = useUpdateVoucherStatusMutation();
  const [selectedVoucher, setSelectedVoucher] = useState<number | null>(null);
  const [selectedVoucherDTO, setSelectedVoucherDTO] =
    useState<VoucherDTO | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const { data: voucherDetail, refetch: refetchVoucherDetail } =
    useGetVoucherDetailQuery(selectedVoucher || 0, {
      skip: !selectedVoucher,
    });

  const [updateVoucher] = useUpdateVoucherMutation();
  const [addVoucher] = useAddVoucherMutation();

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
  } = useForm<VoucherShopRequest>({
    mode: "onBlur",
  });
  const {
    control: addControl,
    handleSubmit: handleAddSubmit,
    reset: resetAddForm,
  } = useForm<VoucherShopRequest>({
    mode: "onBlur",
  });

  const openDetailDialog = (voucherId: number) => {
    setSelectedVoucher(voucherId);
    refetchVoucherDetail();
    setIsDetailDialogOpen(true);
  };

  const openEditDialog = (voucherId: number) => {
    setSelectedVoucher(voucherId);
    refetchVoucherDetail();
    setIsEditDialogOpen(true);
  };

  const handleEditDialog = (voucher: VoucherDTO) => {
    // setSelectedVoucher(voucherId);
    setSelectedVoucherDTO(() => voucher);
    resetEditForm();
    setIsEditDialogOpen(true);
  };

  const handleEditVoucher = async (data: VoucherShopRequest) => {
    if (selectedVoucher) {
      handleApiCall<VoucherShopResponse, ServerError>({
        callbackFn: async () => {
          return await updateVoucher({ voucherId: selectedVoucher, data });
        },
        successCallback: (response) => {
          toast.success("Voucher đã được cập nhật thành công");
          setIsEditDialogOpen(false);
          refetch();
        },
        errorFromServerCallback: (error) => {
          toast.error(error.message);
        },
        errorSerializedCallback: (error) => {
          toast.error("Lỗi khi cập nhật voucher: " + error);
        },
        errorCallback: (error) => {
          toast.error("Lỗi khi cập nhật voucher: " + error);
        },
      });
    }
  };

  const handleAddVoucher = async (data: VoucherShopRequest) => {
    handleApiCall<VoucherShopResponse, ServerError>({
      callbackFn: async () => {
        return await addVoucher(data);
      },
      successCallback(data) {
        setIsAddDialogOpen(false);
        refetch();
      },
      errorFromServerCallback: (error) => {
        toast.error(error.message);
      },
      errorSerializedCallback: (error) => {
        toast.error("Lỗi khi thêm voucher:", error);
      },
      errorCallback: (error) => {
        toast.error("Lỗi khi thêm voucher:", error);
      },
    });
  };

  const handleDeleteVoucher = (voucherId: number) => {
    handleApiCall<VoucherShopResponse, ServerError>({
      callbackFn: async () => {
        return await updateVoucherStatus({ voucherId, status: "DELETED" });
      },
      successCallback: () => {
        toast.success("Voucher đã được xóa thành công");
        refetch();
      },
      errorFromServerCallback: (error) => {
        toast.error(error.message);
      },
      errorSerializedCallback: (error) => {
        toast.error("Lỗi khi xóa voucher: " + error);
      },
      errorCallback: (error) => {
        toast.error("Lỗi khi xóa voucher: " + error);
      },
    });
  };

  const handleStatusChange = (voucherId: number, newStatus: string) => {
    handleApiCall<VoucherShopResponse, ServerError>({
      callbackFn: async () => {
        return await updateVoucherStatus({ voucherId, status: newStatus });
      },
      successCallback: () => {
        toast.success("Trạng thái voucher đã được cập nhật thành công");
        refetch();
      },
      errorFromServerCallback: (error) => {
        toast.error(error.message);
      },
      errorSerializedCallback: (error) => {
        toast.error("Lỗi khi cập nhật trạng thái voucher: " + error);
      },
      errorCallback: (error) => {
        toast.error("Lỗi khi cập nhật trạng thái voucher: " + error);
      },
    });
  };

  const filteredVouchers = vouchersData?.voucherDTOs.filter((voucher) => {
    if (filterType === "ALL" && filterStatus === "ALL") return true;
    if (filterType === "ALL" && filterStatus !== "ALL")
      return voucher.status === filterStatus;
    if (filterType !== "ALL" && filterStatus === "ALL")
      return voucher.type === filterType;
    return voucher.type === filterType && voucher.status === filterStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (isLoading) return <div className="text-center py-4">Đang tải...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Quản lý Voucher</h1>

      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <Select
            value={filterType}
            onValueChange={(value) => setFilterType(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn loại voucher" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Loại voucher</SelectLabel>
                <SelectItem value="ALL">Tất cả loại</SelectItem>
                <SelectItem value="PERCENTAGE_SHOP">
                  Phần trăm cửa hàng
                </SelectItem>
                {/* <SelectItem value="PERCENTAGE_SYSTEM">
                  Phần trăm hệ thống
                </SelectItem> */}
                <SelectItem value="MONEY_SHOP">Tiền cửa hàng</SelectItem>
                {/* <SelectItem value="MONEY_SYSTEM">Tiền hệ thống</SelectItem> */}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={filterStatus}
            onValueChange={(value) => setFilterStatus(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Trạng thái</SelectLabel>
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                <SelectItem value="DELETED">Đã xóa</SelectItem>
                <SelectItem value="CANCEL">Đã hủy</SelectItem>
                <SelectItem value="LOCKED">Đã khóa</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => {
            setIsAddDialogOpen(true);
            resetAddForm();
          }}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Thêm Voucher
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Mã</th>
              <th className="py-2 px-4 border-b">Tên</th>
              <th className="py-2 px-4 border-b">Giảm giá</th>
              <th className="py-2 px-4 border-b">Loại</th>
              <th className="py-2 px-4 border-b">Trạng thái</th>
              <th className="py-2 px-4 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredVouchers?.map((voucher: VoucherDTO) => (
              <tr key={voucher.voucherId} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{voucher.code}</td>
                <td className="py-2 px-4 border-b">{voucher.name}</td>
                <td className="py-2 px-4 border-b">{voucher.discount}</td>
                <td className="py-2 px-4 border-b">
                  {getVietnameseType(voucher.type)}
                </td>
                <td className="py-2 px-4 border-b">
                  {getVietnameseStatus(voucher.status)}
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => openDetailDialog(voucher.voucherId)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Chi tiết
                    </Button>
                    <Button
                      onClick={() => handleEditDialog(voucher)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      onClick={() => handleDeleteVoucher(voucher.voucherId)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Xóa
                    </Button>
                    <Select
                      value={voucher.status}
                      onValueChange={(value) =>
                        handleStatusChange(voucher.voucherId, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                        <SelectItem value="INACTIVE">
                          Không hoạt động
                        </SelectItem>
                        {/* <SelectItem value="DELETED">Đã xóa</SelectItem> */}
                        <SelectItem value="CANCEL">Đã hủy</SelectItem>
                        <SelectItem value="LOCKED">Đã khóa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết Voucher</DialogTitle>
          </DialogHeader>
          {voucherDetail && (
            <div className="grid gap-4">
              <div>
                <strong>Mã:</strong> {voucherDetail.voucherDTO.code}
              </div>
              <div>
                <strong>Tên:</strong> {voucherDetail.voucherDTO.name}
              </div>
              <div>
                <strong>Mô tả:</strong> {voucherDetail.voucherDTO.description}
              </div>
              <div>
                <strong>Giảm giá:</strong> {voucherDetail.voucherDTO.discount}
              </div>
              <div>
                <strong>Số lượng:</strong> {voucherDetail.voucherDTO.quantity}
              </div>
              <div>
                <strong>Ngày bắt đầu:</strong>{" "}
                {voucherDetail.voucherDTO.startDate}
              </div>
              <div>
                <strong>Ngày kết thúc:</strong>{" "}
                {voucherDetail.voucherDTO.endDate}
              </div>
              <div>
                <strong>Số lượng đã sử dụng:</strong>{" "}
                {voucherDetail.voucherDTO.quantityUsed}
              </div>
              <div>
                <strong>Loại:</strong>{" "}
                {getVietnameseType(voucherDetail.voucherDTO.type)}
              </div>
              <div>
                <strong>Trạng thái:</strong>{" "}
                {getVietnameseStatus(voucherDetail.voucherDTO.status)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Voucher</DialogTitle>
          </DialogHeader>
          {selectedVoucherDTO && (
            <form
              onSubmit={handleEditSubmit(handleEditVoucher)}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="edit-code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mã voucher
                </label>
                <Controller
                  name="code"
                  control={editControl}
                  defaultValue={selectedVoucherDTO?.code}
                  rules={{ required: "Mã voucher là bắt buộc" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        id="edit-code"
                        {...field}
                        placeholder="Mã voucher"
                      />
                      {error && (
                        <p className="text-red-500 text-xs mt-1">
                          {error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <label
                  htmlFor="edit-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tên voucher
                </label>
                <Controller
                  name="name"
                  control={editControl}
                  defaultValue={selectedVoucherDTO?.name}
                  rules={{ required: "Tên voucher là bắt buộc" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        id="edit-name"
                        {...field}
                        placeholder="Tên voucher"
                      />
                      {error && (
                        <p className="text-red-500 text-xs mt-1">
                          {error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <label
                  htmlFor="edit-description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mô tả
                </label>
                <Controller
                  name="description"
                  control={editControl}
                  defaultValue={selectedVoucherDTO?.description}
                  render={({ field }) => (
                    <Input
                      id="edit-description"
                      {...field}
                      placeholder="Mô tả"
                    />
                  )}
                />
              </div>
              <div>
                <label
                  htmlFor="edit-discount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Giảm giá
                </label>
                <Controller
                  name="discount"
                  control={editControl}
                  defaultValue={selectedVoucherDTO?.discount}
                  rules={{
                    required: "Giảm giá là bắt buộc",
                    min: {
                      value: 0,
                      message: "Giảm giá phải lớn hơn hoặc bằng 0",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        id="edit-discount"
                        {...field}
                        type="number"
                        placeholder="Giảm giá"
                      />
                      {error && (
                        <p className="text-red-500 text-xs mt-1">
                          {error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <label
                  htmlFor="edit-quantity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Số lượng
                </label>
                <Controller
                  name="quantity"
                  control={editControl}
                  defaultValue={selectedVoucherDTO?.quantity}
                  rules={{
                    required: "Số lượng là bắt buộc",
                    min: {
                      value: 0,
                      message: "Số lượng phải lớn hơn hoặc bằng 0",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        id="edit-quantity"
                        {...field}
                        type="number"
                        placeholder="Số lượng"
                      />
                      {error && (
                        <p className="text-red-500 text-xs mt-1">
                          {error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <label
                  htmlFor="edit-startDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ngày bắt đầu
                </label>
                <Controller
                  name="startDate"
                  control={editControl}
                  defaultValue={formatDate(selectedVoucherDTO?.startDate)}
                  rules={{ required: "Ngày bắt đầu là bắt buộc" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input id="edit-startDate" {...field} type="date" />
                      {error && (
                        <p className="text-red-500 text-xs mt-1">
                          {error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <label
                  htmlFor="edit-endDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ngày kết thúc
                </label>
                <Controller
                  name="endDate"
                  control={editControl}
                  defaultValue={formatDate(selectedVoucherDTO.endDate)}
                  rules={{ required: "Ngày kết thúc là bắt buộc" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input id="edit-endDate" {...field} type="date" />
                      {error && (
                        <p className="text-red-500 text-xs mt-1">
                          {error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <label
                  htmlFor="edit-type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Loại voucher
                </label>
                <Controller
                  name="type"
                  control={editControl}
                  defaultValue={
                    selectedVoucherDTO.type === "PERCENTAGE_SHOP"
                      ? "percent"
                      : "money"
                  }
                  rules={{ required: "Loại voucher là bắt buộc" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn loại voucher" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Loại voucher</SelectLabel>
                            <SelectItem value="percent">
                              Phần trăm cửa hàng
                            </SelectItem>
                            <SelectItem value="money">Tiền cửa hàng</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {error && (
                        <p className="text-red-500 text-xs mt-1">
                          {error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Lưu thay đổi</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm Voucher mới</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleAddSubmit(handleAddVoucher)}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="add-code"
                className="block text-sm font-medium text-gray-700"
              >
                Mã voucher
              </label>
              <Controller
                name="code"
                control={addControl}
                defaultValue=""
                rules={{ required: "Mã voucher là bắt buộc" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input id="add-code" {...field} placeholder="Mã voucher" />
                    {error && (
                      <p className="text-red-500 text-xs mt-1">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div>
              <label
                htmlFor="add-name"
                className="block text-sm font-medium text-gray-700"
              >
                Tên voucher
              </label>
              <Controller
                name="name"
                control={addControl}
                defaultValue=""
                rules={{ required: "Tên voucher là bắt buộc" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input id="add-name" {...field} placeholder="Tên voucher" />
                    {error && (
                      <p className="text-red-500 text-xs mt-1">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div>
              <label
                htmlFor="add-description"
                className="block text-sm font-medium text-gray-700"
              >
                Mô tả
              </label>
              <Controller
                name="description"
                control={addControl}
                defaultValue=""
                render={({ field }) => (
                  <Input id="add-description" {...field} placeholder="Mô tả" />
                )}
              />
            </div>
            <div>
              <label
                htmlFor="add-discount"
                className="block text-sm font-medium text-gray-700"
              >
                Giảm giá
              </label>
              <Controller
                name="discount"
                control={addControl}
                defaultValue={0}
                rules={{
                  required: "Giảm giá là bắt buộc",
                  min: {
                    value: 0,
                    message: "Giảm giá phải lớn hơn hoặc bằng 0",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      id="add-discount"
                      {...field}
                      type="number"
                      placeholder="Giảm giá"
                    />
                    {error && (
                      <p className="text-red-500 text-xs mt-1">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div>
              <label
                htmlFor="add-quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Số lượng
              </label>
              <Controller
                name="quantity"
                control={addControl}
                defaultValue={0}
                rules={{
                  required: "Số lượng là bắt buộc",
                  min: {
                    value: 0,
                    message: "Số lượng phải lớn hơn hoặc bằng 0",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      id="add-quantity"
                      {...field}
                      type="number"
                      placeholder="Số lượng"
                    />
                    {error && (
                      <p className="text-red-500 text-xs mt-1">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div>
              <label
                htmlFor="add-startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Ngày bắt đầu
              </label>
              <Controller
                name="startDate"
                control={addControl}
                defaultValue=""
                rules={{ required: "Ngày bắt đầu là bắt buộc" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input id="add-startDate" {...field} type="date" />
                    {error && (
                      <p className="text-red-500 text-xs mt-1">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div>
              <label
                htmlFor="add-endDate"
                className="block text-sm font-medium text-gray-700"
              >
                Ngày kết thúc
              </label>
              <Controller
                name="endDate"
                control={addControl}
                defaultValue=""
                rules={{ required: "Ngày kết thúc là bắt buộc" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input id="add-endDate" {...field} type="date" />
                    {error && (
                      <p className="text-red-500 text-xs mt-1">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div>
              <label
                htmlFor="add-type"
                className="block text-sm font-medium text-gray-700"
              >
                Loại voucher
              </label>
              <Controller
                name="type"
                control={addControl}
                defaultValue=""
                rules={{ required: "Loại voucher là bắt buộc" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn loại voucher" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Loại voucher</SelectLabel>
                          <SelectItem value="percent">
                            Phần trăm cửa hàng
                          </SelectItem>
                          <SelectItem value="money">Tiền cửa hàng</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {error && (
                      <p className="text-red-500 text-xs mt-1">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Thêm Voucher</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default Vouchers;
