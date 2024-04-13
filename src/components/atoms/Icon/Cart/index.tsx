import { TiShoppingCart } from "react-icons/ti";
interface Props {
  className?: string;
}

const CartIcon = ({ className }: Props) => {
  return <TiShoppingCart className={className} />;
};

export default CartIcon;
