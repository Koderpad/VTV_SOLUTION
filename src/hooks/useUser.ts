import { useAppSelector } from "../redux/store";

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
