export const userLogin = (data) => {
    return {
        type:"USER_LOGIN",
        payload:data
    }
}

export const userLogout = () => {
    return {
        type:"USER_LOGOUT",
        payload:''
    }
}