import {TypeWork} from "@/utils/DTOs/extra/TypeWork.ts";

export interface UpdateDeliverWorkRequest {
    typeWork: TypeWork;
    districtCodeWork: string;
    wardsCodeWork: string[];
}