import React from "react"

export default function Switcher(){
    return (
        <div className="main__switcher-wrapper">
            <div className="switcher">
                <input type="checkbox" className="switcher__checkbox"/>
                <div className="switcher__knobs"/>
                <div className="switcher__layer"/>
            </div>
        </div>
    )
}