import React, {useCallback, useMemo, useState} from "react";
import {lotControllerPath} from "../LotConstants";
import authService from "../api-authorization/AuthorizeService";
import classNames from "classnames"

export default function AddLot(){
    const [file, setFile] = useState(null);

    const fileSelectedHandler = event => {
        console.log(event.target.files[0].name);
        setFile(event.target.files[0]);
    }

    const uploadData = useCallback(async () => {
        const token = await authService.getAccessToken();
        const formData = new FormData();

        console.log(file);
        formData.append('image', file, file.name);

        await fetch(lotControllerPath,{
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        console.log("Загрузка выполнена");
    }, [file])

    const fileUploadHandler = () => {
        uploadData();
    }

    const classes = useMemo(() => {
        return {
            mainClasses : classNames("main", "container", "container-border", "add-lot"),
            titleClasses : classNames("title", "add-lot__title"),
            formClasses : classNames("add-lot__item", "form-item"),
            inputClasses : classNames("form-item__input", "container-border"),
            buttonClasses : classNames("button", "form-item__button"),
            buttonWrapperClasses : classNames("add-lot__item", "form-item", "form-item__buttons-wrapper")
        }
    }, [])

    return (
        <div className={classes.mainClasses}>
            <h2 className={classes.titleClasses}>Adding a new lot</h2>
            <form className="add-lot__form">
                <div className={classes.formClasses}>
                    <label className="form-item__label">Name:</label>
                    <input className={classes.inputClasses} type="text"/>
                </div>
                <div className={classes.formClasses}>
                    <label className="form-item__label">Description:</label>
                    <input className={classes.inputClasses} type="text"/>
                </div>
                <div className={classes.formClasses}>
                    <label className="form-item__label">Minimum price USD:</label>
                    <input className={classes.inputClasses} type="number"/>
                </div>
                <div className={classes.formClasses}>
                    <label className="form-item__label">Duration, sec:</label>
                    <input className={classes.inputClasses} type="number"/>
                </div>
                <div className={classes.buttonWrapperClasses}>
                    <label className={classes.buttonClasses} for="choose-file-input">Choose File...</label>
                    <input className="form-item__file-choose" type="file" onChange={fileSelectedHandler} id="choose-file-input"/>
                </div>
                <div className={classes.buttonWrapperClasses}>
                    <button className={classes.buttonClasses} onClick={fileUploadHandler}>Upload</button>
                </div>
            </form>
        </div>
    )
}