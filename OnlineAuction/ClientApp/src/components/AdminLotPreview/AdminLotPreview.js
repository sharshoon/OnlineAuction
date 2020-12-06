import React, {useCallback, useMemo, useState} from 'react'
import classNames from "classnames"
import {Link, NavLink} from "react-router-dom";
import {useDispatch} from "react-redux";
import {deleteLot} from "../../redux/actions";
import {startAfter} from "./startAfter";
import {handleStartAfter} from "./handleStartAfter";
import {classes} from "../AddLot/addLotClasses";
import {startLot} from "./startLot";

export default function AdminLotPreview({lot, connection, setOperationResult}){
    const dispatch = useDispatch();
    const [nextLot, setNextLot] = useState({
        lotId: "",
        previousLotId: "",
        visible : false
    });
    const inputWrapperClasses = classNames("admin-lot-preview__input-wrapper", {"admin-lot-preview__input-wrapper--visible" : nextLot.visible});
    const buttonNextLotClasses = classNames("button", "admin-lot-preview__button", {"admin-lot-preview__button--hidden" : nextLot.visible});
    const startLotCallback = useCallback((lot) => {
        startLot(lot, connection, setOperationResult);
    }, [connection]);

    const deleteLotCallback = useCallback((id, dispatch) => {
        deleteLot(id, dispatch, setOperationResult);
    }, [setOperationResult])

    return (
        <div className={classes.lotPreviewClasses}>
            <div>
                <NavLink className={classes.lotNameClasses} to={`/lots/${lot.id}`}  tag={Link}>{lot.name} [ID:{lot.id}]</NavLink>
            </div>
            <div className="admin-lot-preview__buttons-wrapper">
                <button className={classes.buttonClasses} disabled={!connection} onClick={() => startLotCallback(lot)}>Start Lot</button>
                <button
                    className={buttonNextLotClasses}
                    disabled={!connection}
                    onClick={() => handleStartAfter(setNextLot, nextLot)}
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
                    <button className={classes.buttonSetNexLotClasses} disabled={!connection} onClick={() => startAfter(lot, nextLot, setOperationResult, setNextLot)}>Set</button>
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