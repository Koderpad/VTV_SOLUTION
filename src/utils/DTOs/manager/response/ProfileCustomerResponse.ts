import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";
import {CustomerDTO} from "@/utils/DTOs/manager/dto/CustomerDTO.ts";

export interface ProfileCustomerResponse extends ResponseAbstract {
    customerDTO: CustomerDTO;
}