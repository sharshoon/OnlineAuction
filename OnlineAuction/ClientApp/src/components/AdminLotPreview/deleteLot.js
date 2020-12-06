import {deleteLotAction} from "../../redux/actions";

export const deleteLot = (dispatch, id, setOperationResult) => {
    try{
        dispatch(deleteLotAction(id));
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