import React from "react";
import Lot from "../Lot/Lot";
import Lots from "../Lots";

export default function LotsPlug(props){
    const id = props.match.params.id;
    if(id){
        return <Lot id={id}/>
    }

    return <Lots/>
}