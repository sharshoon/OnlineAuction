import authService from "../api-authorization/AuthorizeService";
import {lotControllerPath} from "../LotConstants";

export const startAfter = async (lot, nextLot, setOperationResult, dropDown, setDropDown) => {
    if(nextLot.lotId.toString() === nextLot.previousLotId.toString() && nextLot.lotId !==""){
        setOperationResult({
            successed: false,
            message: "Cannot start this lot after itself!",
        });
        return;
    }

    if(!lot.isSold && !lot.isActive) {
        if (nextLot.lotId) {
            const token = await authService.getAccessToken();
            const response = await fetch(lotControllerPath, {
                method: 'PATCH',
                headers: !token ? {} : {
                    'Accept': '*/*',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(nextLot)
            });

            if (response.ok) {
                setOperationResult({
                    successed: true,
                    message: "Next Lot Id was successfully added!",
                });
            } else {
                setOperationResult({
                    successed: false,
                    message: "Id wasn't added, error!",
                });
            }
        }
        else{
            setOperationResult({
                successed: false,
                message: "Lot is sold!",
            });
        }
    }
    setDropDown({
        ...dropDown,
        selected : null,
        isOpen : false
    });
}