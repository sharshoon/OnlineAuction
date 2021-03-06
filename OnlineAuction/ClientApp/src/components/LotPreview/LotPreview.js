import React, {useMemo} from 'react'
import classNames from "classnames"
import {Link, NavLink} from "react-router-dom";

export default function LotPreview({lot}){
    const classes = useMemo(() => {
        return {
            lotPreviewClasses: classNames("main__lot-preview", "lot-preview", "container-border"),
            lotPreviewInfo : classNames("lot-preview__info", "info"),
            lotNameClasses: classNames("lot-preview__name title")
        }
    }, []);

    const buttonClasses = useMemo(() => {
        return classNames("button", "lot-preview__button");
    }, [])
    return (
        <div className={classes.lotPreviewClasses}>
            <div className='lot-preview__image-wrapper'>
                <img className='lot-preview__image' src={lot.imagePath} alt="lot"/>
            </div>
            <div className={classes.lotPreviewInfo}>
                <div className="lot-preview__info-text-wrapper">
                    <div className="lot-preview__title-wrapper">
                        <NavLink className={classes.lotNameClasses} to={`/lots/${lot.id}`}  tag={Link}>{lot.name}</NavLink>
                        {lot.isSold && <div className="lot-preview__sold-lot-message">Lot is sold!</div>}
                    </div>
                    <div className='lot-preview__description'>{lot.description}</div>
                </div>
                <div className="lot-preview__info-button-wrapper">
                    <Link className={buttonClasses} to={`/lots/${lot.id}`} tag={Link}>
                            Go to the lot page
                    </Link>
                </div>
            </div>
        </div>
    )
}