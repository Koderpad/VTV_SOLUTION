import { useAppSelector } from "../redux/store";

export interface CustomerDTO {
  customerId: number;
  username: string;
  email: string;
  gender: boolean;
  fullName: string;
  birthday: string; // Consider using Date type if needed
  status: string; // Consider defining a more specific type for status
  roles: string[];
}

export const useUser = () => {
  // const user = useAppSelector((state) => state.auth.user as unknown as IUser);
  const user = useAppSelector((state) => state.auth.user);
  return user;
};
// export const useUser = (): IUser | null => {
//   const { user } = useAppSelector<RootState>((state) => state.auth.user);

//   if (!user) {
//     return null;
//   }

//   return user as IUser;
// };
