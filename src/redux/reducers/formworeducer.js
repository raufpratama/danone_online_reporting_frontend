const wostate = {
    wo:'',
    form:[],
}

export default formworeducer = (state=wostate,action) => {
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