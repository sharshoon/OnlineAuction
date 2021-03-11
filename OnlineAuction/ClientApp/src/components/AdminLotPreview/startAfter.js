import authService from "../api-authorization/AuthorizeService";
import {lotControllerPath} from "../LotConstants";

export const startAfter = async (lot, prevLot, setOperationResult, dropDown, setDropDown) => {
    if(!lot.isSold && !lot.isActive) {
        if (prevLot.id) {
            const token = await authService.getAccessToken();
            const response = await fetch(lotControllerPath, {
                method: 'PATCH',
                headers: !token ? {} : {
                    'Accept': '*/*',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    lotId : lot.id,
                    previousLotId : prevLot.id
                })
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
    }
    else{
        setOperationResult({
            successed: false,
            message: "Lot is sold!",
        });
    }

    setDropDown({
        ...dropDown,
        selected : null,
        isOpen : false
    });
}