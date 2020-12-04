import {lotControllerPath} from "../LotConstants";

export default async function TryAddLot(token, formData, setAddingResult){
    const response = await fetch(lotControllerPath,{
        method: 'POST',
        headers: !token ? {} : {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`,
        },
        body: formData
    });
    if(response.ok){
        setAddingResult({
            successed: true,
            message: "Lot was successfully added!",
        });
    }else{
        setAddingResult({
            successed: false,
            message: "Lot wasn't added. Check your image for validity",
        });
    }
}