import React, {useCallback, useEffect, useState} from 'react';
import authService from "../api-authorization/AuthorizeService";
import LoadingPage from "../LoadingPage/LoadingPage";
import AdminPanel from "../AdminPanel/AdminPanel";
import {UserRoles} from "../api-authorization/ApiAuthorizationConstants";

export default function AdminPanelPage(){
    let [admin, setAdmin] = useState(false);

    const CheckAdminRights = useCallback(async() => {
        const isAdmin = await authService.hasRole(UserRoles.Administrator);
        setAdmin({
            isAdmin
        })
    }, [])

    useEffect(() => {
        authService.subscribe(() => CheckAdminRights());
        CheckAdminRights();
    }, [])


    if(admin){
        return (
            <div>
                <AdminPanel/>
            </div>
        )
    }
    else{
        return <LoadingPage/>;
    }
}
