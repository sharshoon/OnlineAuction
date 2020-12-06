import React, {useCallback, useState} from 'react'
import classNames from "classnames"
import {Link, NavLink} from "react-router-dom";
import {useDispatch} from "react-redux";
import {startAfter} from "./startAfter";
import {handleStartAfter} from "./handleStartAfter";
import {startLot} from "./startLot";
import {adminLotPreviewClasses} from "./classes";
import {deleteLot} from "./deleteLot";
import {lotHubPath, startLotMethod} from "../LotConstants";
import * as signalR from "@microsoft/signalr";

export default function AdminLotPreview({lot, connection, setOperationResult}){
    const dispatch = useDispatch();
    const [nextLot, setNextLot] = useState({
        lotId: "",
        previousLotId: "",
        visible : false
    });
    const inputWrapperClasses = classNames("admin-lot-preview__input-wrapper", {"admin-lot-preview__input-wrapper--visible" : nextLot.visible});
    const buttonNextLotClasses = classNames("button", "admin-lot-preview__button", {"admin-lot-preview__button--hidden" : nextLot.visible});
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
    }, [connection, lot]);

    const deleteLotCallback = useCallback((id, dispatch) => {
        deleteLot(dispatch, id, setOperationResult);
    }, [setOperationResult])

    return (
        <div className={adminLotPreviewClasses.lotPreviewClasses}>
            <NavLink className={adminLotPreviewClasses.lotNameClasses} to={`/lots/${lot.id}`}  tag={Link}>{lot.name} [ID:{lot.id}]</NavLink>
            <div className="admin-lot-preview__buttons-wrapper">
                <button className={adminLotPreviewClasses.buttonClasses} disabled={!connection} onClick={() => startLotCallback(lot, setOperationResult)}>Start Lot</button>
                <button
                    className={buttonNextLotClasses}
                    disabled={!connection}
                    onClick={() => handleStartAfter(setNextLot, nextLot)}
                >
                    Start After...
                </button>
                <div className={inputWrapperClasses}>
                    <input className={adminLotPreviewClasses.setNextLotInputClasses}
                           value={nextLot.nextLotId}
                           onChange={(event) => setNextLot({
                               lotId : lot.id,
                               previousLotId: event.target.value,
                               visible : true
                           })}
                           type="number"
                           required={true}/>
                    <button className={adminLotPreviewClasses.buttonSetNexLotClasses} disabled={!connection} onClick={() => startAfter(lot, nextLot, setOperationResult, setNextLot)}>Set</button>
                </div>
                <button className={adminLotPreviewClasses.buttonWarningClasses} onClick={() => deleteLotCallback(lot.id, dispatch)}>Delete lot</button>
                <div className="admin-lot-preview__link-wrapper">
                    <Link className={adminLotPreviewClasses.buttonClasses} to={`/lots/${lot.id}`} tag={Link}>
                        Go to the lot page
                    </Link>
                </div>
            </div>
        </div>
    )
}