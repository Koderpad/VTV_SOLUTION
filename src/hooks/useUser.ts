import {  useAppSelector } from "../redux/store";
// import { IUser } from "../../utils/interfaces";

interface IUser {
  //   customerId: 4;
  username: string;
  email: string;
  gender: true;
  fullName: string;
  birthday: string;
  roles: string[];
}

export const useUser = () => {
  const user = useAppSelector((state) => state.auth.user as unknown as IUser);

  return user;
};
// export const useUser = (): IUser | null => {
//   const { user } = useAppSelector<RootState>((state) => state.auth.user);

//   if (!user) {
//     return null;
//   }

//   return user as IUser;
// };
