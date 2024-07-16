import React, { useState, useEffect, useMemo } from "react";
import {
  useGetAllCategoryShopQuery,
  useUpdateCategoryShopMutation,
  useDeleteCategoryShopMutation,
  useAddCategoryShopMutation,
  useAddProductsToCategoryMutation,
  useDeleteProductsFromCategoryMutation,
  ResponseClass,
} from "@/redux/features/vendor/categories/categoriesApiSlice";
import { useGetPageProductByStatusQuery } from "@/redux/features/vendor/product/productShopApiSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CategoryShopDTO,
  ProductDTO,
} from "@/utils/DTOs/vendor/categories/Response/ListCategoryShopResponse";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getListProductByCategoryShopId } from "@/services/common/ShopService";
import { ServerError } from "@/utils/DTOs/common/ServerError";
import { handleApiCall } from "@/utils/HandleAPI/common/handleApiCall";
import { CategoryShopResponse } from "@/utils/DTOs/vendor/categories/Response/CategoryShopResponse";

export const Categories: React.FC = () => {
  const {
    data: categoriesData,
    isLoading,
    isError,
    refetch: refetchCategories,
  } = useGetAllCategoryShopQuery();
  const [updateCategoryShop] = useUpdateCategoryShopMutation();
  const [deleteCategoryShop] = useDeleteCategoryShopMutation();
  const [addCategoryShop] = useAddCategoryShopMutation();
  const [addProductsToCategory] = useAddProductsToCategoryMutation();
  const [deleteProductsFromCategory] = useDeleteProductsFromCategoryMutation();

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryShopDTO | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isDeleteProductDialogOpen, setIsDeleteProductDialogOpen] =
    useState(false);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState<ProductDTO[]>([]);

  const { data: activeProductsData, isLoading: isProductsLoading } =
    useGetPageProductByStatusQuery({
      page: 1,
      size: 100,
      status: "ACTIVE",
    });

  const handleUpdateCategory = (category: CategoryShopDTO) => {
    setSelectedCategory(category);
    setIsUpdateDialogOpen(true);
  };

  // const handleDeleteCategory = async (categoryShopId: number) => {
  //   if (window.confirm("Are you sure you want to delete this category?")) {
  //     await deleteCategoryShop(categoryShopId);
  //     refetchCategories();
  //   }
  // };
  const handleDeleteCategory = async (categoryShopId: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      handleApiCall<ResponseClass, ServerError>({
        callbackFn: async () => await deleteCategoryShop(categoryShopId),
        successCallback: () => {
          toast.success("Danh mục đã được xóa thành công");
          refetchCategories();
        },
        errorFromServerCallback: (error) => {
          toast.error(`Failed to delete category: ${error.message}`);
        },
        errorSerializedCallback: (error) => {
          toast.error(
            `Failed to delete category: ${error.message || "Unknown error occurred"}`
          );
        },
        errorCallback: (error) => {
          toast.error(
            `Failed to delete category: ${error || "Unknown error occurred"}`
          );
        },
      });
    }
  };

  const handleAddProducts = async (category: CategoryShopDTO) => {
    setSelectedCategory(category);
    try {
      const response = await getListProductByCategoryShopId(
        category.categoryShopId
      );
      setCategoryProducts(response.categoryShopDTO.productDTOs as ProductDTO[]);
      setIsAddProductDialogOpen(true);
    } catch (error) {
      toast.error("Failed to fetch category products");
    }
  };

  const handleDeleteProducts = async (category: CategoryShopDTO) => {
    setSelectedCategory(category);
    try {
      const response = await getListProductByCategoryShopId(
        category.categoryShopId
      );
      setCategoryProducts(response.categoryShopDTO.productDTOs as ProductDTO[]);
      setIsDeleteProductDialogOpen(true);
    } catch (error) {
      toast.error("Failed to fetch category products");
    }
  };

  const handleAddCategory = () => {
    setIsAddCategoryDialogOpen(true);
  };

  if (isLoading || isProductsLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading categories</div>;

  return (
    <div>
      <Button onClick={handleAddCategory}>Thêm danh mục cửa hàng</Button>
      <table>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Hình ảnh</th>
            <th>Số sản phẩm</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categoriesData?.categoryShopDTOs.map((category) => (
            <tr key={category.categoryShopId}>
              <td>{category.name}</td>
              <td>
                <img
                  src={category.image}
                  alt={category.name}
                  style={{ width: "50px", height: "50px" }}
                />
              </td>
              <td>{category.countProduct}</td>
              <td>
                <Button onClick={() => handleUpdateCategory(category)}>
                  Cập nhật
                </Button>
                <Button
                  onClick={() => handleDeleteCategory(category.categoryShopId)}
                >
                  Xóa
                </Button>
                <Button onClick={() => handleAddProducts(category)}>
                  Thêm sản phẩm
                </Button>
                <Button onClick={() => handleDeleteProducts(category)}>
                  Xóa sản phẩm
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddProductsDialog
        isOpen={isAddProductDialogOpen}
        onClose={() => setIsAddProductDialogOpen(false)}
        category={selectedCategory}
        allProducts={activeProductsData?.productDTOs || []}
        categoryProducts={categoryProducts}
        onAddProducts={addProductsToCategory}
        refetchCategories={refetchCategories}
      />

      <DeleteProductsDialog
        isOpen={isDeleteProductDialogOpen}
        onClose={() => setIsDeleteProductDialogOpen(false)}
        category={selectedCategory}
        categoryProducts={categoryProducts}
        onDeleteProducts={deleteProductsFromCategory}
        refetchCategories={refetchCategories}
      />

      <UpdateCategoryDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        category={selectedCategory}
        onUpdate={updateCategoryShop}
        refetchCategories={refetchCategories}
      />

      <AddCategoryDialog
        isOpen={isAddCategoryDialogOpen}
        onClose={() => setIsAddCategoryDialogOpen(false)}
        onAddCategory={addCategoryShop}
        refetchCategories={refetchCategories}
      />

      <ToastContainer position="bottom-right" />
    </div>
  );
};

interface UpdateCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryShopDTO | null;
  onUpdate: (data: { categoryShopId: number; data: FormData }) => void;
  refetchCategories: () => void;
}

const UpdateCategoryDialog: React.FC<UpdateCategoryDialogProps> = ({
  isOpen,
  onClose,
  category,
  onUpdate,
  refetchCategories,
}) => {
  const [name, setName] = useState(category?.name || "");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("image", image);
      formData.append("changeImage", image ? "true" : "false");

      handleApiCall<CategoryShopResponse, ServerError>({
        callbackFn: async () =>
          await onUpdate({
            categoryShopId: category.categoryShopId,
            data: formData,
          }),
        successCallback: () => {
          toast.success("Danh mục đã được cập nhật thành công");
          refetchCategories();
          onClose();
        },
        errorFromServerCallback: (error) => {
          toast.error(`Failed to update category: ${error.message}`);
        },
        errorSerializedCallback: (error) => {
          toast.error(
            `Failed to update category: ${error.message || "Unknown error occurred"}`
          );
        },
        errorCallback: (error) => {
          toast.error(
            `Failed to update category: ${error || "Unknown error occurred"}`
          );
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật danh mục</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Tên
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Hình ảnh
              </Label>
              <Input
                id="image"
                type="file"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="col-span-3"
              />
            </div>
            {category && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Current Image</Label>
                <img
                  src={category.image}
                  alt={category.name}
                  style={{ width: "100px", height: "100px" }}
                  className="col-span-3"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Cập nhật</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface AddProductsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryShopDTO | null;
  allProducts: ProductDTO[];
  categoryProducts: ProductDTO[];
  onAddProducts: (data: {
    categoryShopId: number;
    productIds: number[];
  }) => void;
  refetchCategories: () => void;
}

const AddProductsDialog: React.FC<AddProductsDialogProps> = ({
  isOpen,
  onClose,
  category,
  allProducts,
  categoryProducts,
  onAddProducts,
  refetchCategories,
}) => {
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  const filteredProducts = useMemo(() => {
    const categoryProductIds = new Set(
      categoryProducts.map((p) => p.productId)
    );
    return allProducts.filter(
      (product) => !categoryProductIds.has(product.productId)
    );
  }, [allProducts, categoryProducts]);

  useEffect(() => {
    setSelectedProductIds([]);
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (category && selectedProductIds.length > 0) {
      handleApiCall<CategoryShopResponse, ServerError>({
        callbackFn: async () =>
          await onAddProducts({
            categoryShopId: category.categoryShopId,
            productIds: selectedProductIds,
          }),
        successCallback: () => {
          toast.success("Sản phẩm đã được thêm vào danh mục thành công");
          refetchCategories();
          onClose();
        },
        errorFromServerCallback: (error) => {
          toast.error(`Failed to add products: ${error.message}`);
        },
        errorSerializedCallback: (error) => {
          toast.error(
            `Failed to add products: ${error.message || "Unknown error occurred"}`
          );
        },
        errorCallback: (error) => {
          toast.error(
            `Failed to add products: ${error || "Unknown error occurred"}`
          );
        },
      });
    } else {
      toast.warning("Please select at least one product");
    }
  };

  const handleSelectAll = () => {
    if (filteredProducts.length === selectedProductIds.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.productId));
    }
  };

  if (!isOpen || !category) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm vào {category.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <Button type="button" onClick={handleSelectAll}>
              {selectedProductIds.length === filteredProducts.length
                ? "Bỏ chọn tất cả"
                : "Chọn tất cả"}
            </Button>
            {filteredProducts.length === 0 ? (
              <p>Không có sản phẩm nào đã thêm.</p>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.productId}
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    id={`product-${product.productId}`}
                    checked={selectedProductIds.includes(product.productId)}
                    onChange={() => {
                      setSelectedProductIds((prev) =>
                        prev.includes(product.productId)
                          ? prev.filter((id) => id !== product.productId)
                          : [...prev, product.productId]
                      );
                    }}
                  />
                  <Label htmlFor={`product-${product.productId}`}>
                    {product.name}
                  </Label>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "50px", height: "50px" }}
                  />
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={selectedProductIds.length === 0}>
              Thêm sản phẩm đã chọn
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteProductsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryShopDTO | null;
  categoryProducts: ProductDTO[];
  onDeleteProducts: (data: {
    categoryShopId: number;
    productIds: number[];
  }) => void;
  refetchCategories: () => void;
}

const DeleteProductsDialog: React.FC<DeleteProductsDialogProps> = ({
  isOpen,
  onClose,
  category,
  categoryProducts,
  onDeleteProducts,
  refetchCategories,
}) => {
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  useEffect(() => {
    setSelectedProductIds([]);
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (category && selectedProductIds.length > 0) {
      handleApiCall<CategoryShopResponse, ServerError>({
        callbackFn: async () =>
          await onDeleteProducts({
            categoryShopId: category.categoryShopId,
            productIds: selectedProductIds,
          }),
        successCallback: () => {
          toast.success("Sản phẩm đã được xóa thành công");
          refetchCategories();
          onClose();
        },
        errorFromServerCallback: (error) => {
          toast.error(`Failed to remove products: ${error.message}`);
        },
        errorSerializedCallback: (error) => {
          toast.error(
            `Failed to remove products: ${error.message || "Unknown error occurred"}`
          );
        },
        errorCallback: (error) => {
          toast.error(
            `Failed to remove products: ${error || "Unknown error occurred"}`
          );
        },
      });
    } else {
      toast.warning("Please select at least one product to remove");
    }
  };

  const handleSelectAll = () => {
    if (selectedProductIds.length === categoryProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(categoryProducts.map((p) => p.productId));
    }
  };

  if (!isOpen || !category) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa sản phẩm từ {category.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <Button type="button" onClick={handleSelectAll}>
              {selectedProductIds.length === categoryProducts.length
                ? "Bỏ chọn tất cả"
                : "Chọn tất cả"}
            </Button>
            {categoryProducts.length === 0 ? (
              <p>Không có sản phẩm nào để xóa</p>
            ) : (
              categoryProducts.map((product) => (
                <div
                  key={product.productId}
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    id={`product-${product.productId}`}
                    checked={selectedProductIds.includes(product.productId)}
                    onChange={() => {
                      setSelectedProductIds((prev) =>
                        prev.includes(product.productId)
                          ? prev.filter((id) => id !== product.productId)
                          : [...prev, product.productId]
                      );
                    }}
                  />
                  <Label htmlFor={`product-${product.productId}`}>
                    {product.name}
                  </Label>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "50px", height: "50px" }}
                  />
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={selectedProductIds.length === 0}>
              Xóa sản phẩm đã chọn
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface AddCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (data: FormData) => void;
  refetchCategories: () => void;
}

const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  isOpen,
  onClose,
  onAddCategory,
  refetchCategories,
}) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (image) {
      formData.append("image", image);
      formData.append("changeImage", "true");
    }

    handleApiCall<CategoryShopResponse, ServerError>({
      callbackFn: async () => await onAddCategory(formData),
      successCallback: () => {
        toast.success("Danh mục đã được thêm thành công");
        refetchCategories();
        onClose();
        setName("");
        setImage(null);
      },
      errorFromServerCallback: (error) => {
        toast.error(`Failed to add category: ${error.message}`);
      },
      errorSerializedCallback: (error) => {
        toast.error(
          `Failed to add category: ${error.message || "Unknown error occurred"}`
        );
      },
      errorCallback: (error) => {
        toast.error(
          `Failed to add category: ${error || "Unknown error occurred"}`
        );
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm danh mục mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Tên
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Hình ảnh
              </Label>
              <Input
                id="image"
                type="file"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Thêm danh mục</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Categories;
