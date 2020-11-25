import React, {useCallback, useMemo, useState} from "react";
import {lotControllerPath} from "../LotConstants";
import authService from "../api-authorization/AuthorizeService";
import classNames from "classnames"
import FormErrors from "../FormErrors/FormErrors";
import AddLotTextInput from "../AddLotTextInput/AddLotTextInput";
import ResultTextBlock from "../ResultTextBlock/ResultTextBlock";

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
    const fileSelectedHandler = event => {
        setFile(event.target.files[0]);
    }

    const uploadData = useCallback(async (lotName, lotDescription, lotMinPrice, lotDuration) => {
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
            const response = await fetch(lotControllerPath,{
                method: 'POST',
                headers: !token ? {} : {
                    'Accept': '*/*',
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });
            console.log(response);
            if(response.ok){
                setAddingResult({
                    successed: true,
                    message: "Lot was successfully added!",
                });
            }else{
                setAddingResult({
                    successed: false,
                    message: "Lot wasn't added",
                });
            }
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
        uploadData(lotName.value, lotDescription.value, lotMinPrice.value, lotDuration.value);
    }

    const classes = useMemo(() => {
        return {
            mainClasses : classNames("main", "container", "container-border", "add-lot"),
            titleClasses : classNames("title", "add-lot__title"),
            buttonClasses : classNames("button", "form-item__button"),
            buttonWrapperClasses : classNames("add-lot__item", "form-item", "form-item__buttons-wrapper")
        }
    }, []);

    const descriptionCheckingFunctions = useMemo(() => {
        const descriptionMinLength = 20;
        const functions = [];
        functions.push((value) => {
            if(value.length <= descriptionMinLength){
                return `Description length can't be shorter then ${descriptionMinLength}`;
            }
        });

        return functions;
    }, []);

    const nameCheckingFunctions = useMemo(() => {
        const functions = [];

        functions.push((value) => {
            if(!value){
                return "Name can't be empty!";
            }
        });

        return functions;
    }, []);

    const minPriceCheckingFunctions = useMemo(() => {
        const functions = [];
        functions.push((value) => {
            if(isNaN(+value) || value < 0){
                return "Invalid price!";
            }
        });

        return functions;
    }, []);

    const durationCheckingFunctions = useMemo(() => {
        const maxDuration = 86400;
        const functions = [];
        functions.push((value) => {
            if(isNaN(+value)){
                return "Invalid duration!";
            }
        });
        functions.push((value) => {
            if(+value < 0){
                return "Duration is too small"
            }
        });
        functions.push((value) => {
            if(+value > maxDuration){
                return "Duration is too big!";
            }
        });

        return functions;
    }, []);

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
                    <label className={classes.buttonClasses} for="choose-file-input">{file.name || "Choose File..."}</label>
                    <FormErrors/>
                    <input className="form-item__file-choose" type="file" onChange={fileSelectedHandler} id="choose-file-input"/>
                </div>
                <div className={classes.buttonWrapperClasses}>
                    <button type="submit" className={classes.buttonClasses}>Upload</button>
                </div>
            </form>
        </div>
    )
}