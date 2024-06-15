export const transportStatusToString = () => {
    return {
        PENDING: 'Đang chờ xác nhận',
        PROCESSING: 'Đang xử lý',
        WAITING: 'Đang chờ xử lý',
        PICKUP_PENDING: 'Chờ lấy hàng',
        PICKED_UP: 'Đã lấy hàng',
        IN_TRANSIT: 'Đang trung chuyển',
        WAREHOUSE: 'Đang ở kho',
        SHIPPING: 'Đang giao hàng',
        DELIVERED: 'Đã giao hàng',
        COMPLETED: 'Hoàn thành',
        RETURNED: 'Đã trả hàng',
        CANCEL: 'Đã hủy',
        UNPAID: 'Chưa thanh toán',
    }

}