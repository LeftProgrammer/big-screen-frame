# jinghe-lanhai 大屏可视化依赖式框架

...
打包：pnpm run build

npm 包推送： 
npm login --registry=http://192.168.10.110:8081/repository/npm-hosted-jinghe/
npm publish @jinghe/jinghe-lanhai --registry=http://192.168.10.110:8081/repository/npm-hosted-jinghe/

删除包： npm unpublish @jinghe/jinghe-lanhai@1.0.0 --registry=http://192.168.10.110:8081/repository/npm-hosted-jinghe/ --force

npm 包使用： pnpm install @jinghe/jinghe-lanhai --filter jinghe-lanhai-template --registry=http://192.168.10.110:8081/repository/npm-hosted-jinghe
...