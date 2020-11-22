import React from 'react'

export default function FormErrors({errors}){
    if(errors && errors.length > 0){
        return errors.map(error => <p className="form-item__error">{error}</p>);
    }
    else{
        return '';
    }
}

