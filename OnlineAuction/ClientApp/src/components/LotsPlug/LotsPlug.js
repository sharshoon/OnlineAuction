import React from "react";
import Lot from "../Lot/Lot";
import Lots from "../Lots/Lots";

export default function LotsPlug(props){
    const id = props.match.params.id;
    const pageParams = props.location.search.match(/\?page=(\d)/);
    let page;
    if(pageParams && pageParams[1]){
        page = +pageParams[1];
    }

    if(id){
        return <Lot id={id}/>
    }
    if(page && !isNaN(page)){
        return <Lots page={page}/>
    }
    if(!id && !page){
        return <Lots page={1}/>
    }
}