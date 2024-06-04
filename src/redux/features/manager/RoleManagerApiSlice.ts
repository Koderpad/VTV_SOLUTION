import {apiSlice} from "@/redux/api.ts";
import {ManagerResponse} from "@/utils/DTOs/manager/response/ManagerResponse.ts";
import {ManagerRequest} from "@/utils/DTOs/manager/request/ManagerRequest.ts";
import {ManagerPageResponse} from "@/utils/DTOs/manager/response/ManagerPageResponse.ts";
import {Role} from "@/utils/DTOs/extra/Role.ts";



export const RoleManagerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        managerAddRole: builder.mutation<ManagerResponse, ManagerRequest >({
            query: (body) => ({
                url: '/manager/role/add',
                method: 'POST',
                body,
            }),
        }),



        managerUpdateRole: builder.mutation<ManagerResponse, ManagerRequest >({
            query: (body) => ({
                url: '/manager/role/update',
                method: 'PUT',
                body,
            }),
        }),



        managerDeleteRole: builder.mutation<ManagerResponse, ManagerRequest >({
            query: (body) => ({
                url: '/manager/role/delete',
                method: 'DELETE',
                body,
            }),
        }),



        getManagerPageByRole: builder.query<ManagerPageResponse, { role: Role; page: number; size: number }>({
            query: ({ role, page, size }) => `/manager/role/get-manager-page-by-role?role=${role}&page=${page}&size=${size}`
        }),


        addRoleManager: builder.mutation<ManagerResponse, { usernameCustomer: string }>({
            query: ({ usernameCustomer }) => ({
                url: '/manager/role/add-role-manager',
                method: 'POST',
                body: usernameCustomer,
            }),
        }),


        deleteRoleManager: builder.mutation<ManagerResponse, { usernameCustomer: string }>({
            query: ({ usernameCustomer }) => ({
                url: '/manager/role/remove-role-manager',
                method: 'POST',
                body: usernameCustomer,
            }),
        }),
    }),
});

export const {
    useManagerAddRoleMutation,
    useManagerUpdateRoleMutation,
    useManagerDeleteRoleMutation,
    useGetManagerPageByRoleQuery,
    useAddRoleManagerMutation,
    useDeleteRoleManagerMutation,

} = RoleManagerApiSlice;
