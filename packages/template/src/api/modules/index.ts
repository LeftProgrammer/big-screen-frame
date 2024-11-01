import { GET, POST, FILE, FILEPOST, PUT, GETNOBASE } from "../api";
const api = '/api';

//字典标签专用（通过code获取字典数组）
export const ajaxGetDictItems = async (code: string, params: any) => {
    return await GET(api + `/sys/dict/getDictItems/${code}`, params).then(({ success, result }) => {
        if (success) {
            let res = result.map((item: any) => ({ ...item, label: item.text }))
            console.log('------- 从DB中获取到了字典-------dictCode : ', code, res)
            return Promise.resolve(res)
        } else {
            console.error('getDictItems error: : ', result)
            return Promise.resolve([])
        }
    }).catch((res) => {
        console.error('getDictItems error: ', res)
        return Promise.resolve([])
    })
}

/**获取项目信息 */
export const ProjectInfo = (params: any = {}) => {
    return GET(api + '/dashboard/information/bigScreen/projectInfo', params)
}

// 字典
export const queryTreeList = (params: any = {}) => {
    return GET(api + '/project/myCategory/queryTreeList', params)
};