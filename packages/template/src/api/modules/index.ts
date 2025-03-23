import { GET, POST, FILE, FILEPOST, PUT, GETNOBASE } from "../api";

//字典标签专用（通过code获取字典数组）
export const ajaxGetDictItems = async (code: string, params: any) => {
    return await GET(`/sys/dict/getDictItems/${code}`, params).then(({ success, result }) => {
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
    return GET('/dashboard/information/bigScreen/projectInfo', params)
}

// 字典
export const queryTreeList = (params: any = {}) => {
    return GET('/project/myCategory/queryTreeList', params)
};



/**系统项目信息 */
export const projectInfoList = () => {
    return GET('/project/projectInfo/list', {})
}
/**获取数据(风机 海缆 升压站) */
export const getBaseMapData = () => {
    return GET('/project/projectPbs/getBaseMapData', {})
}