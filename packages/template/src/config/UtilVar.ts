interface UtilVarType {
    baseUrl: any,
    code: string | number,
    noContentCode: number,
    ENC: boolean,//是否进行加密
}

const baseUrl = import.meta.env.VITE_BASE_URL;

console.log('当前环境', import.meta.env.MODE, baseUrl)    
const UtilVar: UtilVarType = {
    baseUrl: baseUrl,
    code: 401, //登陆过期
    noContentCode: 204, //请求成功但没有内容
    ENC: false,

}
const runtimeType: any = {

    production: () => {
        UtilVar.baseUrl = baseUrl
    },
    //开发环境
    development: () => {
        UtilVar.baseUrl = baseUrl
    },
    hash: () => {

    }

}
// console.log(import.meta.env)
runtimeType[import.meta.env.MODE] && runtimeType[import.meta.env.MODE]()
export default UtilVar