import {transportStatusToString} from "@/utils/DTOs/extra/convertToString/transportStatusToString.ts";
import {getTransportStatusColor} from "@/utils/DTOs/extra/color/getTransportStatusColor.ts";
import dayjs from "dayjs";
import {TransportDTO} from "@/utils/DTOs/shipping/dto/TransportDTO.ts";
import {FaUser} from "react-icons/fa"; // Import icons

interface TransportProps {
    transportDTO: TransportDTO;
}

const TransportDetailProps = ({transportDTO}: TransportProps) => {

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">

            <h1 className="text-4xl font-bold text-black mb-8 text-center">
                Chi tiết vận chuyển
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-md shadow-md p-6">
                    <h2 className="text-2xl font-bold text-black mb-4 text-center">
                        Thông tin vận chuyển
                    </h2>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-neutral-800 text-xl font-bold">
                                Mã vận chuyển:
                            </dt>
                            <dd className="mt-1 text-black">{transportDTO.transportId}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 text-xl font-bold">
                                Mã đơn hàng:
                            </dt>
                            <dd className="mt-1 text-black">{transportDTO.orderId}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 text-xl font-bold">
                                Phương thức vận chuyển:
                            </dt>
                            <dd className="mt-1 text-black">{transportDTO.shippingMethod}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 text-xl font-bold">Trạng thái:</dt>
                            <dd
                                className={`mt-1 text-${getTransportStatusColor(
                                    transportDTO.status
                                )}`}
                            >
                                {transportStatusToString[transportDTO.status]}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 text-xl font-bold">Ngày tạo:</dt>
                            <dd className="mt-1 text-black">
                                {dayjs(transportDTO.createAt).format("DD-MM-YYYY")}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 text-xl font-bold">
                                Ngày cập nhật:
                            </dt>
                            <dd className="mt-1 text-black">
                                {dayjs(transportDTO.updateAt).format("DD-MM-YYYY")}
                            </dd>
                        </div>
                    </dl>
                </div>
                <div className="bg-white rounded-md shadow-md p-6">
                    <h2 className="text-2xl font-bold text-black mb-4 text-center">
                        Lịch sử vận chuyển
                    </h2>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-neutral-800 text-xl font-bold">
                                Lịch sử vận chuyển:
                            </dt>
                            <dd className="mt-1 text-black">
                                <ul>
                                    {transportDTO.transportHandleDTOs.map(
                                        (transportHandle, index) => (
                                            <li key={index} className="list-disc list-inside">
                        <span className="font-bold">
                          <FaUser className="mr-2"/>
                            {transportHandle.username}
                        </span>{" "}
                                                -{" "}
                                                <span
                                                    className={`text-${getTransportStatusColor(
                                                        transportHandle.transportStatus
                                                    )}-500`}
                                                >
                            {transportStatusToString[
                                transportHandle.transportStatus
                                ]}
                        </span>



                                                <br/>
                                                <span className="text-gray-500">
                          Ngày:{" "}
                                                    {dayjs(transportHandle.createAt).format(
                                                        "DD-MM-YYYY HH:mm"
                                                    )}
                        </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default TransportDetailProps;