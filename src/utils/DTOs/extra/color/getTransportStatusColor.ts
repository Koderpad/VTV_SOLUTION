import {TransportStatus} from "@/utils/DTOs/extra/TransportStatus.ts";

export  const getTransportStatusColor = (status: TransportStatus) => {

    switch (status) {
        case TransportStatus.PENDING:
            return 'blue';
        case TransportStatus.PROCESSING:
            return 'green';
        case TransportStatus.WAITING:
            return 'orange';
        case TransportStatus.PICKUP_PENDING:
            return 'orange';
        case TransportStatus.PICKED_UP:
            return 'green';
        case TransportStatus.IN_TRANSIT:
            return 'blue';
        case TransportStatus.WAREHOUSE:
            return 'blue';
        case TransportStatus.SHIPPING:
            return 'blue';
        case TransportStatus.DELIVERED:
            return 'green';
        case TransportStatus.COMPLETED:
            return 'green';
        case TransportStatus.RETURNED:
            return 'red';
        case TransportStatus.CANCEL:
            return 'red';
        case TransportStatus.UNPAID:
            return 'red';
        default:
            return 'black';
    }

}