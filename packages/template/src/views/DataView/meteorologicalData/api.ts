import { GET, } from "@/api/api";
const api = '/api';
const indexUrl = {
    'getWeather7days': api + '/dashboard/information/getWeather7days',// pc七天天气
    'processAssess': api + '/sea/weatherInfo/processAssess',// 施工评估与预警
    'sailingAssess': api + '/sea/weatherInfo/sailingAssess', //出航评估与预警
}

/**pc七天天气 */
export const getWeather7days = (param: any = {}) => {
    return GET(indexUrl.getWeather7days, param)
}
/**施工评估与预警 */
export const processAssess = (param: any = {}) => {
    return GET(indexUrl.processAssess, param)
}

/**出航评估与预警 */
export const sailingAssess = (param: any = {}) => {
    return GET(indexUrl.sailingAssess, param)
}

