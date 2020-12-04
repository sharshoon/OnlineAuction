import React, {useCallback, useMemo} from 'react'
import classNames from "classnames"
import {Link, NavLink} from "react-router-dom";
import {startLotMethod} from "../LotConstants";
import {useDispatch} from "react-redux";
import {deleteLot} from "../../redux/actions";

export default function AdminLotPreview({lot, connection, setOperationResult}){
    const dispatch = useDispatch();
    const classes = useMemo(() => {
        return {
            lotPreviewClasses: classNames("main__lot-preview", "main__admin-lot-preview", "admin-lot-preview", "container-border"),
            lotNameClasses: classNames("lot-preview__name title"),
            buttonClasses : classNames("button", "admin-lot-preview__button"),
            buttonWarningClasses : classNames("button", "admin-lot-preview__button", "button--warning"),
        }
    }, []);

    const startLot = useCallback((lot) => {
        if(!lot.isSold){
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

    return (
        <div className={classes.lotPreviewClasses}>
            <NavLink className={classes.lotNameClasses} to={`/lots/${lot.id}`}  tag={Link}>{lot.name}</NavLink>
            <div className="admin-lot-preview__buttons-wrapper">
                <button className={classes.buttonClasses} disabled={!connection} onClick={() => startLot(lot)}>Start Lot</button>
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