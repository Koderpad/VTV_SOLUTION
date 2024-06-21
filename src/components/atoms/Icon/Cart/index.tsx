import { TiShoppingCart } from "react-icons/ti";
import { ListCartByShopDTO } from "@/utils/DTOs/common/Cart/Response/ListCartResponse";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
interface Props {
  className?: string;
}

const CartIcon = ({ className }: Props) => {
  const carts: ListCartByShopDTO[] = useSelector(
    (state: RootState) => state.carts.carts
  );
  const countCartItemForAllShop = carts.reduce((acc: number, shop) => {
    return acc + shop.countCartInShop;
  }, 0);
  return (
    <div className="relative">
      <TiShoppingCart className={className} />
      {countCartItemForAllShop > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {countCartItemForAllShop}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
