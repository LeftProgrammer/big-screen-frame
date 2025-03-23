import { GET, POST, FILE, FILEPOST, PUT, GETNOBASE } from "../api";
const Api = {
    'login':  '/sys/login',//登录
}

/**登录接口 */
export const login = (param: any = {}) => {
    return POST(Api.login, param)
}
