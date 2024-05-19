import {Status} from "@/utils/DTOs/extra/Status.ts";

export interface CategoryDTO {
    categoryId: number;
    name: string;
    image: string;
    description: string;
    child: boolean;
    status: Status;
    parentId: number;
}