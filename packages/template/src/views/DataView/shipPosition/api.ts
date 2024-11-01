import { GET, } from "@/api/api";
const api = '/api';
const indexUrl = {
    'projectInfoList': api + '/project/projectInfo/list',// 系统项目信息
}

/**系统项目信息 */
export const projectInfoList = (param: any = {}) => {
    return GET(indexUrl.projectInfoList, param)
}