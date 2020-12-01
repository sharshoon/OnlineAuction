export const descriptionCheckingFunctions = () => {
    const descriptionMinLength = 20;
    const functions = [];
    functions.push((value) => {
        if(value.length <= descriptionMinLength){
            return `Description length can't be shorter then ${descriptionMinLength}`;
        }
    });

    return functions;
}

export const nameCheckingFunctions = () => {
    const functions = [];

    functions.push((value) => {
        if(!value){
            return "Name can't be empty!";
        }
    });

    return functions;
}

export const minPriceCheckingFunctions = () => {
    const functions = [];
    functions.push((value) => {
        if(isNaN(+value) || value < 0){
            return "Invalid price!";
        }
    });

    return functions;
}

export const durationCheckingFunctions = () => {
    const maxDuration = 86400;
    const functions = [];
    functions.push((value) => {
        if(isNaN(+value)){
            return "Invalid duration!";
        }
    });
    functions.push((value) => {
        if(+value < 10){
            return "Duration is too small"
        }
    });
    functions.push((value) => {
        if(+value > maxDuration){
            return "Duration is too big!";
        }
    });

    return functions;
}