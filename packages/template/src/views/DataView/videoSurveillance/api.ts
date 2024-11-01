import { GET, } from "@/api/api";
const api = '/api';
const indexUrl = {
    list: api + '/project/projectCamera/getAllCamera',
}

/**系统项目信息 */
export const list = (param: any = {}) => {
    return GET(indexUrl.list, param)
}