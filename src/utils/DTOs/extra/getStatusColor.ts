import { Status } from "./Status";

export  const getStatusColor = (status: Status) => {
    switch (status) {
        case 'ACTIVE':
            return 'green-600'; // Green color for ACTIVE status
        case 'INACTIVE':
            return 'gray-600'; // Gray color for INACTIVE status
        case 'DELETED':
            return 'red-600'; // Red color for DELETED status
        case 'CANCEL':
            return 'yellow-600'; // Yellow color for CANCEL status
        case 'LOCKED':
            return 'purple-600'; // Purple color for LOCKED status
        default:
            return 'black'; // Default color
    }
};
