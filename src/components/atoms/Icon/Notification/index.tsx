import { IoIosNotificationsOutline } from "react-icons/io";

interface Props {
  className?: string;
}

const NotificationIcon = ({ className }: Props) => {
  return <IoIosNotificationsOutline className={className} />;
};

export default NotificationIcon;
