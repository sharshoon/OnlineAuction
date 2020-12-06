export const deleteLot = (dispatch, id, setOperationResult) => {
    try{
        dispatch(deleteLot(id));
        setOperationResult({
            message: "Lot was successfully deleted",
            successed: true
        })
    }
    catch(e){
        setOperationResult({
            message: e.message,
            successed: false
        });
    }
}