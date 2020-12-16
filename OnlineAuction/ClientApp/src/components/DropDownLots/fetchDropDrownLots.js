import {lotControllerPath} from "../LotConstants";

export async function fetchDropDownLots(setDropDown, page, showSold, showUnsold, isOpen) {
    const response = await fetch(`${lotControllerPath}?page=${page}&showSold=${showSold}&showUnsold=${showUnsold}`);
    const json = await response.json();

    setDropDown({
        lots : json.lots,
        page : page,
        pageCount : json.pagesCount,
        isOpen
    })
}