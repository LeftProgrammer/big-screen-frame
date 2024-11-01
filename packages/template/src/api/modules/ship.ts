import { GET, POST, FILE, FILEPOST, PUT, GETNOBASE } from "../api";
const api = '/api'
const Url = {
    'getShipData':  `${api}/ship/shipAlarm/queryAlarm`,//获取船舶数据
}

/**获取船舶数据 */
export const getCxwShip = (param: any = {}) => {
    return GET(Url.getShipData, param)
}
