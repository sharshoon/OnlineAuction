import checkImageSize from "./checkImageSize";

export const fileSelectedHandler = (event, setFile, setFileErrors) => {
    checkImageSize(event.target.files[0], (result) => {
        if(result){
            setFile(event.target.files[0]);
            setFileErrors([]);
        }
        else{
            setFileErrors(["Image size is invalid!"]);
        }
    });
}