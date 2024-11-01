import { defineStore } from 'pinia';

import { login } from "@/api/modules/login";
import { ElMessage } from "element-plus";
import { getLocalStorage } from "@/utils";
import { StorageEnum, RequestEnum } from "@/enums";
export const useUserStore = defineStore('user', {
    state: () => ({
        userInfo: null,
        ACCESS_TOKEN: null,
    }),
    actions: {
        async login(loginInfo: any) {
            try {
                const res = await login(loginInfo);
                console.log("res", res);

                if (res.code == "200") {
                    const result = res.result;
                    const userInfo = result.userInfo;

                    // 使用 localStorage 替代 Vue.ls
                    localStorage.setItem("ACCESS_TOKEN", result.token);
                    localStorage.setItem("USER_NAME", userInfo.username);
                    localStorage.setItem("USER_INFO", JSON.stringify(userInfo));
                    localStorage.setItem(
                        "UI_CACHE_DB_DICT_DATA",
                        JSON.stringify(result.sysAllDictItems)
                    );
                    this.userInfo = userInfo;
                    this.ACCESS_TOKEN = result.token;
                    ElMessage.success("登录成功");
                    return {
                        code: 200,
                        message: "登录成功",
                        result: {
                            userInfo: userInfo,
                            token: result.token,
                        },
                    };
                } else {
                    // 登录失败处理
                    ElMessage.error(res.message || "登录失败");
                    return {
                        code: res.code,
                        message: res.message || "登录失败",
                        result: null,
                    };
                }
            } catch (error) {
                console.error("登录错误:", error);
                ElMessage.error("登录过程中发生错误");
                return {
                    code: 500,
                    message: "登录过程中发生错误",
                    result: null,
                };
            }
        },
        async logout() {
            this.userInfo = null;
            this.ACCESS_TOKEN = null;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('ACCESS_TOKEN');
            localStorage.removeItem('USER_NAME');
            localStorage.removeItem('USER_INFO');
            localStorage.removeItem('UI_CACHE_DB_DICT_DATA');
            // 跳转到登录页
            return {
                code: 200,
                message: "退出成功",
                result: null,
            };
        },
        loadUserInfo() {
            const storedUserInfo = localStorage.getItem('userInfo');
            if (storedUserInfo) {
                this.userInfo = JSON.parse(storedUserInfo);
            }
        },
    },
    getters: {
        // token: (state) => state.userInfo.token,
        // 获取userInfo
        getUserInfo: (state) => state.userInfo,
        getUserToken: (state) => state.ACCESS_TOKEN || getLocalStorage(StorageEnum.ACCESS_TOKEN),
    },
});
