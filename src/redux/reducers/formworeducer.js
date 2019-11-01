const userState = {
    wo:'',
    form:[],
}

export default userreducer = (state=userState,action) => {
    switch(action.type) {
        case "UPDATE_WO":
            return {
                ...state,
                wo:action.payload,
            }
        case "UPDATE_FORM":
            return {
                ...state,
                form:[...state.form,action.payload],
            }
        default:
            return state;
    }
}