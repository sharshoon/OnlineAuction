import React, {useCallback, useEffect, useState} from 'react';
import authService from "../api-authorization/AuthorizeService";
import AddLot from "../AddLot/AddLot";

export default function AddLotPage(){
    let [data, setData] = useState("");

    let fetchData = useCallback(async () => {
        const token = await authService.getAccessToken();
        const response = await fetch('api/admin-panel', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setData(data.message);
    }, [])

    useEffect( () => {
        fetchData();
    }, []);

    if(data){
        return (
            <div>
                <AddLot/>
            </div>
        )
    }
    else{
        return "loading";
    }
}
