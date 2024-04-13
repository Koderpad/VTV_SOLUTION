import { IoIosSearch } from "react-icons/io";
interface Props {
  className?: string;
}

export const SearchIcon = ({ className }: Props) => {
  return <IoIosSearch className={className} />;
};
