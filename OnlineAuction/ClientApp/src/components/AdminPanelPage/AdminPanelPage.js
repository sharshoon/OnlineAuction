import React, {useCallback, useEffect, useState} from 'react';
import authService from "../api-authorization/AuthorizeService";
import LoadingPage from "../LoadingPage/LoadingPage";
import AdminPanel from "../AdminPanel/AdminPanel";
import {UserRoles} from "../api-authorization/ApiAuthorizationConstants";
import CustomMessagePage from "../CustomMessagePage/CustomMessagePage";

export default function AdminPanelPage(){
    let [admin, setAdmin] = useState(null);

    const CheckAdminRights = useCallback(async() => {
        const isAdmin = await authService.hasRole(UserRoles.Administrator);
        setAdmin(isAdmin)
    }, [])

    useEffect(() => {
        authService.subscribe(() => CheckAdminRights());
        CheckAdminRights();
    }, [CheckAdminRights])


    if(admin){
        return (
            <div>
                <AdminPanel/>
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
