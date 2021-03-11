import React, {useCallback, useState} from "react";
import authService from "../api-authorization/AuthorizeService";
import FormErrors from "../FormErrors/FormErrors";
import AddLotTextInput from "../AddLotTextInput/AddLotTextInput";
import ResultTextBlock from "../ResultTextBlock/ResultTextBlock";
import {
    descriptionCheckingFunctions,
    durationCheckingFunctions,
    minPriceCheckingFunctions,
    nameCheckingFunctions
} from "./inputCheckingFunctions";
import TryAddLot from "./tryAddLot";
import {classes} from "./addLotClasses";
import {fileSelectedHandler} from "./fileSelectedHandler";
import {checkParametersValidity} from "./checkParametersValidity";

export default function AddLot(){
    const [file, setFile] = useState({
        name: ""
    });
    const [addingResult, setAddingResult] = useState({
        message: "",
        successed: true
    });
    const [lotName, setLotName] = useState({
        value: "",
        errors: []
    });
    const [lotDescription, setDescription] = useState({
        value: "",
        errors: []
    });
    const [lotMinPrice, setMinPrice] = useState({
        value: 0,
        errors: []
    });
    const [lotDuration, setDuration] = useState({
        value: 0,
        errors: []
    });
    const [fileErrors, setFileErrors] = useState([]);

    const uploadDataCallback = useCallback(async (lotName, lotDescription, lotMinPrice, lotDuration) => {
        const token = await authService.getAccessToken();
        const formData = new FormData();

        if(file.name){
            formData.append('image', file, file.name);
        }
        formData.append('name', lotName);
        formData.append('description', lotDescription);
        formData.append('minPrice', lotMinPrice);
        formData.append('duration', lotDuration);

        try{
            await TryAddLot(token, formData, setAddingResult);
        }
        catch (error){
            setAddingResult({
                successed: false,
                message: "An error occurred while adding a new lot!",
            })
        }
        finally {
            setLotName({value : "", errors: []});
            setDescription({value : "", errors: []});
            setMinPrice({value : 0, errors: []});
            setDuration({value : 0, errors: []});
        }
    }, [file])

    const fileUploadHandler = (event) => {
        event.preventDefault();
        uploadDataCallback(lotName.value, lotDescription.value, lotMinPrice.value, lotDuration.value);
    }

    return (
        <div className={classes.mainClasses}>
            <h2 className={classes.titleClasses}>Adding a new lot</h2>
            <ResultTextBlock successed={addingResult.successed} message={addingResult.message}/>
            <form className="add-lot__form" onSubmit={fileUploadHandler}>
                <AddLotTextInput labelText={"Name:"} type={"text"} checkingFunctions={nameCheckingFunctions} state={lotName} setState={setLotName}/>
                <AddLotTextInput labelText={"Description:"} type={"text"} checkingFunctions={descriptionCheckingFunctions} state={lotDescription} setState={setDescription}/>
                <AddLotTextInput labelText={"Minimum price USD:"} type={"number"} checkingFunctions={minPriceCheckingFunctions} state={lotMinPrice} setState={setMinPrice}/>
                <AddLotTextInput labelText={"Duration, sec:"} type={"number"} checkingFunctions={durationCheckingFunctions} state={lotDuration} setState={setDuration}/>
                <div className={classes.buttonWrapperClasses}>
                    <div className={"form-item__error-wrapper"}>
                        <FormErrors errors={fileErrors}/>
                    </div>
                    <label className={classes.buttonClasses} htmlFor="choose-file-input">{file.name || "Choose File..."}</label>
                    <input className="form-item__file-choose" type="file" onChange={(event) => fileSelectedHandler(event, setFile, setFileErrors)} id="choose-file-input"/>
                </div>
                <div className={classes.buttonWrapperClasses}>
                    <button disabled={checkParametersValidity([lotName, lotDescription, lotMinPrice, lotDuration, fileErrors])}
                            type="submit"
                            className={classes.buttonClasses}
                    >
                        Upload
                    </button>
                </div>
            </form>
        </div>
    )
}