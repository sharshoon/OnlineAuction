import FormErrors from "../FormErrors/FormErrors";
import React, {useCallback, useMemo, useRef, useState} from "react";
import classNames from "classnames";

export default function AddLotTextInput({labelText, type, checkingFunctions, state, setState}){
    const classes = useMemo(() => {
        return {
            formClasses : classNames("add-lot__item", "form-item"),
            inputClasses : classNames("form-item__input", "container-border", {"form-item__input--error" : state.errors.length !== 0})
        }
    }, [state]);

    const handleChangeText = useCallback((event) => {
        const errors = [];

        for(let func of checkingFunctions){
            const result = func(event.target.value);
            if(result){
                errors.push(result);
            }
        }

        setState({
            value : event.target.value,
            errors: errors
        });
    }, [setState])

    return(
        <div className={classes.formClasses}>
            <label className="form-item__label">{labelText}</label>
            <FormErrors errors={state.errors}/>
            <input className={classes.inputClasses} value={state.value} onChange={(event) => setState({value: event.target.value, errors: []})} onBlur={handleChangeText} type={type} required={true}/>
        </div>
    )
}