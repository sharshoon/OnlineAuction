import {startLotMethod} from "../LotConstants";

export function startLot(lot, connection, setOperationResult){
    if(!lot.isSold && !lot.isActive){
        connection.invoke(startLotMethod, "active", lot.id);
        setOperationResult({
            message: "Lot started successfully!",
            successed: true
        })
    }
    else {
        setOperationResult({
            message: "The lot has already been sold!",
            successed: false
        })
    }
}