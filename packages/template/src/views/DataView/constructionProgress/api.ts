import { GET, } from "@/api/api";
const api = '/api';
const indexUrl = {
    'projectInfoList': api + '/project/projectInfo/list',// 系统项目信息
    'report': api + '/construction/constructionLog/report',
    'schedule': api + '/dashboard/information/bigScreen/schedule',
}

/**系统项目信息 */
export const projectInfoList = (param: any = {}) => {
    return GET(indexUrl.projectInfoList, param)
}

// 施工路由
export const constructionList = (param: any = {}) => {
    return GET(indexUrl.report, param)
}

// 施工进度
export const schedule = (param: any = {}) => {
    return GET(indexUrl.schedule, param)
}