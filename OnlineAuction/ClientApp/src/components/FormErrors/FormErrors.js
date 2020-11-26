import React from 'react'

export default function FormErrors({errors}){
    if(errors && errors.length > 0){
        return errors.map((error, id) => <p className="form-item__error" key={id}>{error}</p>);
    }
    else{
        return '';
    }
}

