import classNames from "classnames";

export const classes =  {
    lotPreviewClasses: classNames("main__lot-preview", "main__admin-lot-preview", "admin-lot-preview", "container-border"),
    lotNameClasses: classNames("lot-preview__name title"),
    buttonClasses : classNames("button", "admin-lot-preview__button"),
    buttonSetNexLotClasses : classNames("button", "admin-lot-preview__button", "admin-lot-preview__set-next-lot-button"),
    buttonWarningClasses : classNames("button", "admin-lot-preview__button", "button--warning"),
    inputClasses : classNames("form-item__input", "container-border","admin-lot-preview__input"),
    setNextLotInputClasses : classNames("form-item__input", "container-border","admin-lot-preview__input", "admin-lot-preview__set-next-lot-input")
};