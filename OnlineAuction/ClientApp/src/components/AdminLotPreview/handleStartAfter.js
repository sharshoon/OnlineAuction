export const handleStartAfter = (setNextLot, nextLot) => {
    setNextLot({
        lotId: "",
        previousLotId: "",
        visible: !nextLot.visible
    })
}