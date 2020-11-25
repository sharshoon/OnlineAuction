import React, {useMemo} from "react"
import classNames from "classnames"
import {iconsPath} from "../LotConstants";

export default function Footer(){
    const classes = useMemo(() => {
        return {
            footerClasses : classNames("casing__footer", "footer", "container-border"),
            cardNameClasses : classNames("footer__card-name", "title")
        }
    }, [])


    return (
        <footer className={classes.footerClasses}>
            <div className="footer__card">
                <div className={classes.cardNameClasses}>copyrights</div>
                <div className="footer__card-info">@2020. Online Auction. All rights reserved</div>
            </div>
            <div className="footer__card footer__card--remove-bottom-indent">
                <div className={classes.cardNameClasses}>connect me</div>
                <ul className="footer__sn-wrapper">
                    <li className="footer__sn">
                        <a className="footer__sn-link" href="mailto:Mickita.Sharshun@itechart-group.com">
                            <img className="footer__sn-icon" src={`${iconsPath}/outlook-icon.png`}/>
                            <span className="footer__card-info">Outlook</span>
                        </a>
                    </li>
                    <li className="footer__sn">
                        <a className="footer__sn-link" href="https://github.com/sharshoon">
                            <img className="footer__sn-icon" src={`${iconsPath}/github-icon.png`}/>
                            <span className="footer__card-info">GitHub</span>
                        </a>
                    </li>
                    <li className="footer__sn">
                        <a className="footer__sn-link" href="https://join.skype.com/invite/b4dT1glZDPZ4">
                            <img className="footer__sn-icon" src={`${iconsPath}/skype-icon.png`}/>
                            <span className="footer__card-info">Skype</span>
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
}