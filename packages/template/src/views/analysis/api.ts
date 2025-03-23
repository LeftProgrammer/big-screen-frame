import { GET, } from "@/api/api";
const indexUrl = {
    'projectBigEvent': '/project/projectBigEvent/list',// 工程大事记
    'userBoardRecord': '/sailingcheck/userBoardRecord/list',// 近七日出海船舶
    'shipBoardRecord': '/sailingcheck/shipSailingRecord/list',// 近七日出海船舶
    'getSettledContractList': '/settlement/contractInfo/getSettledContractList',// 结算信息
    'weekWork': '/dashboard/information/bigScreen/weekWork',// 大屏首页7日投入
    'weatherInfo': '/dashboard/information/bigScreen/weatherInfo',// 天气信息
    'weatherAlarm': '/dashboard/information/bigScreen/weatherAlarm',// 天气预警
    'dolphinInfo': '/dashboard/information/bigScreen/dolphinInfo',// 观豚统计
    'projectInfo': '/dashboard/information/bigScreen/projectInfo',// 大屏项目信息
    'getCablePress': '/project/projectProcess/list',// 获取海缆工序
    'projectInfoList': '/project/projectInfo/list',// 系统项目信息
}

/**工程大事记 */
export const projectBigEvent = (param: any = {}) => {
    return GET(indexUrl.projectBigEvent, param)
}

/**近七日出海船舶 */
export const weekWork = () => {
    let param = {
        pageNo: 1,
        pageSize: 999
    };
    return GET(indexUrl.weekWork, param)
}

/**结算信息 */
export const getSettledContractList = (param: any = {}) => {
    return GET(indexUrl.getSettledContractList, param)
}

/**天气信息 */
export const weatherInfo = (param: any = {}) => {
    return GET(indexUrl.weatherInfo, param)
}

/**天气预警 */
export const weatherAlarm = (param: any = {}) => {
    return GET(indexUrl.weatherAlarm, param)
}   
/**观豚统计 */
export const dolphinInfo = (param: any = {}) => {
    return GET(indexUrl.dolphinInfo, param)
}   
/**项目信息 */
export const projectInfo = (param: any = {}) => {
    return GET(indexUrl.projectInfo, param)
}       
/**获取海缆工序 */
export const getCablePress = (param: any = {}) => {
    return GET(indexUrl.getCablePress, param)
}
/**系统项目信息 */
export const projectInfoList = (param: any = {}) => {
    return GET(indexUrl.projectInfoList, param)
}