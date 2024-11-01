import { GET, } from "@/api/api";
const api = '/api';
const indexUrl = {
    'projectBigEvent': api + '/project/projectBigEvent/list',// 工程大事记
    'userBoardRecord': api + '/sailingcheck/userBoardRecord/list',// 近七日出海船舶
    'shipBoardRecord': api + '/sailingcheck/shipSailingRecord/list',// 近七日出海船舶
    'getSettledContractList': api + '/settlement/contractInfo/getSettledContractList',// 结算信息
    'weekWork': api + '/dashboard/information/bigScreen/weekWork',// 大屏首页7日投入
    'weatherInfo': api + '/dashboard/information/bigScreen/weatherInfo',// 天气信息
    'weatherAlarm': api + '/dashboard/information/bigScreen/weatherAlarm',// 天气预警
    'dolphinInfo': api + '/dashboard/information/bigScreen/dolphinInfo',// 观豚统计
    'projectInfo': api + '/dashboard/information/bigScreen/projectInfo',// 大屏项目信息
    'getCablePress': api + '/project/projectProcess/list',// 获取海缆工序
    'projectInfoList': api + '/project/projectInfo/list',// 系统项目信息
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