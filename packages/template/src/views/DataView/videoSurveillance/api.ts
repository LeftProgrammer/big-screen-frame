import { GET, } from "@/api/api";
const indexUrl = {
    list: '/project/projectCamera/getAllCamera',
}

/**系统项目信息 */
export const list = (param: any = {}) => {
    return GET(indexUrl.list, param)
}