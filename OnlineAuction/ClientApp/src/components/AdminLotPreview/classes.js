import classNames from "classnames";

export const adminLotPreviewClasses =  {
    lotPreviewClasses: classNames("main__lot-preview", "main__admin-lot-preview", "admin-lot-preview", "container-border"),
    lotNameClasses: classNames("lot-preview__name","admin-lot-preview__name","title"),
    minorButtonClasses : classNames("button", "admin-lot-preview__button", "admin-lot-preview__minor-button"),
    majorButtonClasses : classNames("button", "admin-lot-preview__button", "admin-lot-preview__major-button"),
    buttonClasses : classNames("button", "admin-lot-preview__button"),
    buttonSetNexLotClasses : classNames("button", "admin-lot-preview__button", "admin-lot-preview__set-next-lot-button"),
    buttonWarningClasses : classNames("button", "admin-lot-preview__button", "button--warning", "admin-lot-preview__minor-button"),
    inputClasses : classNames("form-item__input", "container-border","admin-lot-preview__input"),
    setNextLotInputClasses : classNames("form-item__input", "container-border","admin-lot-preview__input", "admin-lot-preview__set-next-lot-input"),
    lotPreviewInfo : classNames("admin-lot-preview__info","lot-preview__info", "info"),
    titleWrapperClasses : classNames("lot-preview__title-wrapper", "admin-lot-preview__title-wrapper"),
    descriptionClasses : classNames("admin-lot-preview__description", "lot-preview__description")
};