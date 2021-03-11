import React, {useCallback} from 'react'
import {Link, NavLink} from "react-router-dom";
import {useDispatch} from "react-redux";
import {adminLotPreviewClasses} from "./classes";
import {deleteLot} from "./deleteLot";
import {lotHubPath, startLotMethod} from "../LotConstants";
import * as signalR from "@microsoft/signalr";
import DropDownLots from "../DropDownLots/DropDownLots";
import {fetchLots} from "../../redux/actions";

export default function AdminLotPreview({lot, connection, setOperationResult, page}){
    const dispatch = useDispatch();
    const startLotCallback = useCallback((lot, setOperationResult) => {
        if(!lot.isSold && !lot.isActive){
            const startLotConnection = new signalR.HubConnectionBuilder()
                .withUrl(lotHubPath)
                .build();

            startLotConnection.start().then(() => {
                startLotConnection.invoke(startLotMethod, "active", lot.id);
                setOperationResult({
                    message: "Lot started successfully!",
                    successed: true
                });
            });
        }
        else {
            setOperationResult({
                message: "The lot has already been sold!",
                successed: false
            })
        }
    }, []);

    const deleteLotCallback = useCallback((id, dispatch, page) => {
        deleteLot(dispatch, id, setOperationResult);
        dispatch(fetchLots(page, true, true));
    }, [setOperationResult])

    return (
        <div className={adminLotPreviewClasses.lotPreviewClasses}>
            <div className='admin-lot-preview__image-wrapper'>
                <img className='lot-preview__image' src={lot.imagePath} alt="lot"/>
            </div>
            <div className={adminLotPreviewClasses.lotPreviewInfo}>
                <div className="lot-preview__info-text-wrapper">
                    <div className={adminLotPreviewClasses.titleWrapperClasses}>
                        <NavLink className={adminLotPreviewClasses.lotNameClasses} to={`/lots/${lot.id}`}  tag={Link}>{lot.name} [ID:{lot.id}]</NavLink>
                        {lot.isSold && <div className="lot-preview__sold-lot-message">Lot is sold!</div>}
                    </div>
                    <div className={adminLotPreviewClasses.descriptionClasses}>{lot.description}</div>
                </div>
                <div className="admin-lot-preview__buttons-wrapper">
                    <button className={adminLotPreviewClasses.minorButtonClasses} disabled={!connection} onClick={() => startLotCallback(lot, setOperationResult)}>Start Lot</button>
                    <button className={adminLotPreviewClasses.buttonWarningClasses} onClick={() => deleteLotCallback(lot.id, dispatch, page)}>Delete lot</button>
                    <DropDownLots currentLot={lot} setOperationResult={setOperationResult}/>
                    <div className="admin-lot-preview__major-button">
                        <Link className={adminLotPreviewClasses.buttonClasses} to={`/lots/${lot.id}`} tag={Link}>
                            Go to the lot page
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}