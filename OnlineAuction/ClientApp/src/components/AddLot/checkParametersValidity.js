export const checkParametersValidity = (fields) => {
    for(let field of fields){
        if (field.length || (field.errors && field.errors.length)){
            return true;
        }
    }
    return false;
}