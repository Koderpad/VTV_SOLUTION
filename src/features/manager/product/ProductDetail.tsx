import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {statusToString} from "@/utils/DTOs/extra/statusToString";
import {fetchProductDetail} from "@/services/common/ProductService.ts";
import {ProductDTO} from "@/utils/DTOs/manager/dto/ProductDTO.ts";
import {ProductVariantDTO} from "@/utils/DTOs/manager/dto/ProductVariantDTO.ts";
import {AttributeDTO} from "@/utils/DTOs/manager/dto/AttributeDTO.ts";
import {toast, ToastContainer} from "react-toastify";
import {getStatusColor} from "@/utils/DTOs/extra/getStatusColor.ts";
import LockProduct from "@/features/manager/product/LockProduct.tsx";
import UnlockProduct from "@/features/manager/product/UnlockProduct.tsx";


const ProductDetail = () => {
    const {productId} = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<ProductDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isLock, setIsLock] = useState(false);
    const [isUnLock, setIsUnLock] = useState(false);
    const loadProductDetail = async () => {
        try {
            const productDetail = await fetchProductDetail(Number(productId));
            console.log(productDetail);
            setProduct(productDetail.productDTO);
            setIsLoading(false);
        } catch (e) {
            setError(e as Error);
            setIsLoading(false);
            // toast.error(error.message);
            setTimeout(() => {
                navigate('/manager/products');
            }, 700);
        }
    };
    useEffect(() => {

        loadProductDetail();
    }, [productId]);


    const handleLockSuccess = () => {
        setIsLock(false); // Close the lock modal
        // Reload product data
        loadProductDetail();
    };

    const handleUnLockSuccess = () => {
        setIsUnLock(false); // Đóng modal mở khóa
        // Tải lại dữ liệu sản phẩm
        loadProductDetail();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-xl text-gray-700">Loading...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-xl text-red-500">{error.message}</span>
                <ToastContainer/>

            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                onClick={() => navigate(-1)} // Assuming navigate is available
            >
                Quay Lại
            </button>

            <h1 className="text-4xl font-bold text-black mb-8 text-center">Chi tiết sản phẩm</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Information Section */}
                <div className="bg-white rounded-md shadow-md p-6">
                    <h2 className="text-2xl font-bold text-black mb-4 text-center">Thông tin cơ bản</h2>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-neutral-800 text-xl font-bold">Tên sản phẩm:</dt>
                            <dd className="mt-1 text-black">{product?.name}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Ảnh sản phẩm:</dt>
                            <dd className="mt-1">
                                <img src={product?.image} alt="Product" className="w-full h-auto rounded-md"/>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 text-xl  font-bold">Mô tả:</dt>
                            <dd className="mt-1 text-black">{product?.description}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 text-xl  font-bold">Thông tin:</dt>
                            <dd className="mt-1 text-black">{product?.information}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Trạng thái:</dt>
                            <dd className="mt-1 text-black">{product && statusToString[product.status]}</dd>
                        </div>
                        {/* ... other product details */}
                    </dl>
                </div>

                <div className="bg-white rounded-md shadow-md p-6">
                    <h2 className="text-2xl font-bold text-black mb-4 text-center">Biến thể sản phẩm</h2>
                    {product?.productVariantDTOs.map((variant) => (
                        <div key={variant.productVariantId} className="mb-6">
                            <hr className="my-4"/>
                            <h3 className="text-xl font-bold text-black mb-2">Mã biến thể: {variant.sku}</h3>
                            <div className="flex justify-between items-start">
                                <div className="w-3/5 ">
                                    <dl className="space-y-2">

                                        <div className="flex items-center">
                                            <dt className="text-neutral-800 text-xl font-bold">Trạng thái biến thể:</dt>
                                            <div className="w-4"></div>
                                            <dd className={`mt-1 text-${getStatusColor(variant.status)}`}>
                                                {statusToString[variant.status]}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-neutral-800 text-xl  font-bold">Hình ảnh:</dt>
                                            <dd className="mt-1">
                                                <img src={variant.image} alt="Variant"
                                                     className="w-full h-auto rounded-md"/>
                                            </dd>
                                        </div>


                                        <br/>

                                        <div>
                                            <dt className="text-neutral-800 text-xl  font-bold">Thuộc tính:</dt>
                                            <dd className="mt-1 text-black">
                                                <ul>
                                                    {variant.attributeDTOs.map((attribute: AttributeDTO) => (
                                                        <li key={attribute.attributeId}
                                                            className="list-disc list-inside">
                                                            <span
                                                                className="font-bold">{attribute.name}:</span> {attribute.value}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                                <div className="w-2/5">
                                    <dl className="space-y-1">
                                        <div className="flex items-center">
                                            <dt className="text-neutral-800 font-bold">Giá gốc:</dt>
                                            <div className="w-4"></div>
                                            <dd className="mt-1 text-black">{variant.originalPrice.toLocaleString()} đ</dd>
                                        </div>
                                        <div className="flex items-center">
                                            <dt className="text-neutral-800 font-bold">Giá bán:</dt>
                                            <div className="w-4"></div>
                                            <dd className="mt-1 text-black">{variant.price.toLocaleString()} đ</dd>
                                        </div>
                                        <div className="flex items-center">
                                            <dt className="text-neutral-800 font-bold">Giảm giá:</dt>
                                            <div className="w-4"></div>
                                            <dd className="mt-1 text-black">{variant.discountPercent}</dd>
                                        </div>
                                        <div className="flex items-center">
                                            <dt className="text-neutral-800 font-bold">Số lượng:</dt>
                                            <div className="w-4"></div>
                                            <dd className="mt-1 text-black">{variant.quantity}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


            </div>


            <div className="mt-8 flex justify-between ">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                    onClick={() => navigate(`/product/${product?.productId}`)}
                >
                    Xem Thông Sản Phẩm Tại Sàn VTV
                </button>
                {product?.status === 'LOCKED' ? (
                    <button
                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                        onClick={() => setIsUnLock(true)}
                    >
                        Mở Khóa Sản Phẩm
                    </button>
                ) : (
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={() => setIsLock(true)}
                    >
                        Khóa Sản Phẩm
                    </button>
                )}
            </div>

            {isLock && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-md shadow-md w-1/3">
                        <h2 className="text-4xl font-bold text-black mb-4 text-center">Xác nhận khóa sản phẩm</h2>
                        <p className="text-black text-center">Bạn có chắc chắn muốn khóa sản phẩm này không?</p>
                        <br/>

                        <div className="mt-4 flex justify-center">
                            <LockProduct productId={product?.productId} productName={product?.name}
                                         status={product?.status} onLockSuccess={handleLockSuccess}/>
                            <div className="w-4"></div>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                onClick={() => setIsLock(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isUnLock && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-md shadow-md w-1/3">
                        <h2 className="text-4xl font-bold text-black mb-4 text-center">Xác nhận mở khóa sản phẩm</h2>
                        <p className="text-black text-center">Bạn có chắc chắn muốn mở khóa sản phẩm này không?</p>
                        <br/>
                        <div className="mt-4 flex justify-center">
                            <UnlockProduct productId={product?.productId} productName={product?.name}
                                           onUnLockSuccess={handleUnLockSuccess}/>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                onClick={() => setIsUnLock(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <ToastContainer/>
        </div>
    );
}

export default ProductDetail;
