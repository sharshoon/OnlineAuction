import {lotControllerPath} from "../LotConstants";

export async function fetchDropDownLots(setDropDown, page, showSold, showUnsold) {
    const response = await fetch(`${lotControllerPath}?page=${page}&showSold=${showSold}&showUnsold=${showUnsold}`);
    if(response.ok){
        const json = await response.json();
        return json;
    }
    return null;
}