import React, {useCallback, useEffect, useState} from 'react';
import authService from "../api-authorization/AuthorizeService";
import AddLot from "../AddLot/AddLot";
import {UserRoles} from "../api-authorization/ApiAuthorizationConstants";
import LoadingPage from "../LoadingPage/LoadingPage";
import CustomMessagePage from "../CustomMessagePage/CustomMessagePage";

export default function AddLotPage(){
    let [admin, setAdmin] = useState(null);

    const isAdminCallback = useCallback(async(setAdmin) => {
        const isAdmin = await authService.hasRole(UserRoles.Administrator);
        setAdmin(isAdmin)
    }, [])

    useEffect(() => {
        const subscribeId = authService.subscribe(() => isAdminCallback(setAdmin));
        isAdminCallback(setAdmin);

        return(() => {
            authService.unsubscribe(subscribeId);
        })
    }, [isAdminCallback])

    if(admin){
        return (
            <div>
                <AddLot/>
            </div>
        )
    }
    if(admin === false){
        return <CustomMessagePage message={"You dont have access to this component!"}/>
    }
    else{
        return <LoadingPage/>;
    }
}
