import React, {useCallback, useEffect, useMemo, useState} from "react"
import {userControllerPath} from "../LotConstants";
import {useDispatch, useSelector} from "react-redux";
import {hideUserLoader, showUserLoader} from "../../redux/actions";
import LoadingPage from "../LoadingPage/LoadingPage";
import CustomMessagePage from "../CustomMessagePage/CustomMessagePage";
import classNames from "classnames";

export default function UserPage(props){
    const userId = props.match.params.id;
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const loading = useSelector(state => state.app.userLoading);

    const fetchUser = useCallback(async (userId) => {
        dispatch(showUserLoader());
        const response = await fetch(`${userControllerPath}/${userId}`);
        if(response.ok){
            const json = await response.json();
            setUser(json);
        }
        else{
            setError("Bad Request!");
        }
        dispatch(hideUserLoader());
    }, [dispatch])

    useEffect(() => {
        fetchUser(userId);
    }, [userId])

    const classes = useMemo(() => {
        return {
            mainClasses : classNames("main", "container-border", "user-page"),
            tableClasses : classNames("table", "user-page__table")
        }
    }, [])

    if(loading){
        return <LoadingPage/>
    }
    else if(error){
        return <CustomMessagePage message={error}/>
    }
    else if(user){
        return(
            <div className={classes.mainClasses}>
                <div className="user-page__item"><span className="user-page__item-name">First Name:</span> {user.firstName}</div>
                <div className="user-page__item"><span className="user-page__item-name">Last Name:</span> {user.lastName}</div>
                <div className="user-page__item"><span className="user-page__item-name">ID:</span> {user.id}</div>
                <div className="user-page__item"><span className="user-page__item-name">Email:</span> {user.email}</div>
                <div>
                    <span className="user-page__item-name">Won Lots: </span>
                    <table className={classes.tableClasses}>
                        <thead className="table__header">
                        <tr>
                            <th className="table__header-item">Lot Name</th>
                            <th className="table__header-item">Sold Price</th>
                        </tr>
                        </thead>
                        <tbody className="table__body">
                        {user.winningLots.map(lot => {
                            return (
                                <tr key={lot.id}>
                                    <th className="table__item">{lot.lotName}</th>
                                    <th className="table__item">{lot.priceUsd} USD</th>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    return null;
}