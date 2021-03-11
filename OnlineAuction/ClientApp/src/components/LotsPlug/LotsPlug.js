import React, {useCallback, useEffect, useState} from "react";
import Lot from "../Lot/Lot";
import Lots from "../Lots/Lots";
import authService from "../api-authorization/AuthorizeService";
import {UserRoles} from "../api-authorization/ApiAuthorizationConstants";
import AdminPanel from "../Lots/AdminPanel";
import LoadingPage from "../LoadingPage/LoadingPage";

export default function LotsPlug(props){
    let [admin, setAdminRights] = useState(null);
    const id = props.match.params.id;
    const pageParams = props.location.search.match(/\?page=(\d)/);
    let page;
    if(pageParams && pageParams[1]){
        page = +pageParams[1];
    }

    const CheckAdminRights = useCallback(async(setAdminRights) => {
        const isAdmin = await authService.hasRole(UserRoles.Administrator);
        setAdminRights(isAdmin)
    }, [])

    useEffect(() => {
        const subscribeId = authService.subscribe(() => CheckAdminRights(setAdminRights));
        CheckAdminRights(setAdminRights);

        return(() => {
            authService.unsubscribe(subscribeId);
        })
    }, [CheckAdminRights])

    if(id){
        return <Lot id={id}/>
    }
    if(admin === null){
        return <LoadingPage/>
    }
    if(!admin){
        if(page && !isNaN(page)){
            return <Lots page={page}/>
        }
        else if(!id && !page){
            return <Lots page={1}/>
        }
    }
    else{
        if(page && !isNaN(page)){
            return <AdminPanel page={page}/>
        }
        else if(!page){
            return <AdminPanel page={1}/>
        }
    }
}