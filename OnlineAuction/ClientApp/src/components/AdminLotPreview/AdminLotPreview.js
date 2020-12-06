import React, {useCallback, useMemo, useState} from 'react'
import classNames from "classnames"
import {Link, NavLink} from "react-router-dom";
import {lotControllerPath, startLotMethod} from "../LotConstants";
import {useDispatch} from "react-redux";
import {deleteLot} from "../../redux/actions";
import authService from "../api-authorization/AuthorizeService";

export default function AdminLotPreview({lot, connection, setOperationResult}){
    const dispatch = useDispatch();
    const classes = useMemo(() => {
        return {
            lotPreviewClasses: classNames("main__lot-preview", "main__admin-lot-preview", "admin-lot-preview", "container-border"),
            lotNameClasses: classNames("lot-preview__name title"),
            buttonClasses : classNames("button", "admin-lot-preview__button"),
            buttonSetNexLotClasses : classNames("button", "admin-lot-preview__button", "admin-lot-preview__set-next-lot-button"),
            buttonWarningClasses : classNames("button", "admin-lot-preview__button", "button--warning"),
            inputClasses : classNames("form-item__input", "container-border","admin-lot-preview__input"),
            setNextLotInputClasses : classNames("form-item__input", "container-border","admin-lot-preview__input", "admin-lot-preview__set-next-lot-input")
        }
    }, []);
    const [nextLot, setNextLot] = useState({
        lotId: "",
        previousLotId: "",
        visible : false
    });
    const inputWrapperClasses = classNames("admin-lot-preview__input-wrapper", {"admin-lot-preview__input-wrapper--visible" : nextLot.visible});
    const buttonNextLotClasses = classNames("button", "admin-lot-preview__button", {"admin-lot-preview__button--hidden" : nextLot.visible});
    const startLot = useCallback((lot) => {
        if(!lot.isSold && !lot.isActive){
            connection.invoke(startLotMethod, "active", lot.id);
            setOperationResult({
                message: "Lot started successfully!",
                successed: true
            })
        }
        else{
            setOperationResult({
                message: "The lot has already been sold!",
                successed: false
            })
        }
    }, [connection]);

    const deleteLotCallback = useCallback((id, dispatch) => {
        try{
            dispatch(deleteLot(id));
            setOperationResult({
                message: "Lot was successfully deleted",
                successed: true
            })
        }
        catch(e){
            setOperationResult({
                message: e.message,
                successed: false
            });
        }
    }, [setOperationResult])

    const handleStartAfter = () => {
        setNextLot({
            lotId: "",
            previousLotId: "",
            visible: !nextLot.visible
        })
    }

    const startAfter = async () => {
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
        setNextLot({
            lotId : "",
            previousLotId : "",
            visible: false
        });
    }

    return (
        <div className={classes.lotPreviewClasses}>
            <div>
                <NavLink className={classes.lotNameClasses} to={`/lots/${lot.id}`}  tag={Link}>{lot.name} [ID:{lot.id}]</NavLink>
            </div>
            <div className="admin-lot-preview__buttons-wrapper">
                <button className={classes.buttonClasses} disabled={!connection} onClick={() => startLot(lot)}>Start Lot</button>
                <button
                    className={buttonNextLotClasses}
                    disabled={!connection}
                    onClick={() => handleStartAfter()}
                >
                    Start After...
                </button>
                <div className={inputWrapperClasses}>
                    <input className={classes.setNextLotInputClasses}
                           value={nextLot.nextLotId}
                           onChange={(event) => setNextLot({
                               lotId : lot.id,
                               previousLotId: event.target.value,
                               visible : true
                           })}
                           type="number"
                           required={true}/>
                    <button className={classes.buttonSetNexLotClasses} disabled={!connection} onClick={() => startAfter()}>Set</button>
                </div>
                <button className={classes.buttonWarningClasses} onClick={() => deleteLotCallback(lot.id, dispatch)}>Delete lot</button>
                <div className="admin-lot-preview__link-wrapper">
                    <Link className={classes.buttonClasses} to={`/lots/${lot.id}`} tag={Link}>
                        Go to the lot page
                    </Link>
                </div>
            </div>
        </div>
    )
}