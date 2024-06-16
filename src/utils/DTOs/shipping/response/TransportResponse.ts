import { TransportDTO } from "../dto/TransportDTO";
import { ResponseAbstract } from "../../extra/ResponseAbstract";

interface TransportResponse extends ResponseAbstract {
    transportDTO: TransportDTO;
}

export default TransportResponse;