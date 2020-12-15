import React, {useCallback, useState} from 'react'
import classNames from "classnames"
import {Link, NavLink} from "react-router-dom";
import {useDispatch} from "react-redux";
import {startAfter} from "./startAfter";
import {handleStartAfter} from "./handleStartAfter";
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
    const buttonNextLotClasses = classNames("button", "admin-lot-preview__button", "admin-lot-preview__major-button",{"admin-lot-preview__button--hidden" : nextLot.visible});
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
                    <button className={adminLotPreviewClasses.buttonWarningClasses} onClick={() => deleteLotCallback(lot.id, dispatch)}>Delete lot</button>
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
                        <button className={adminLotPreviewClasses.buttonSetNexLotClasses} disabled={!connection} onClick={() => {
                            startAfter(lot, nextLot, setOperationResult, setNextLot)
                        }}>Set</button>
                    </div>
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