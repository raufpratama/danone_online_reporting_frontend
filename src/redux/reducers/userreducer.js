const userState = {
    user_detail:{},
    form:'',
    isLogin:false
}

export default userreducer = (state=userState,action) => {
    switch(action.type) {
        case "USER_LOGIN":
            return {
                ...state,
                user_detail:action.payload,
                isLogin:true
            }
        case "USER_LOGOUT":
            return {
                ...state,
                user_detail:{},
                isLogin:false,
            }
        case "ADD_FORM_WO":
            return {
                ...state,
                form:action.payload,
            }
        default:
            return state;
    }
}