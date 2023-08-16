[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/wangyuanzcm/wallet-monitor)
0x1865b71742f623ac09f1e999a4b2e939df3da4ab
0x0f0067cd819cb8f20bda62046daff7a2b5c88280




实时推送钱包上的交易信息，动态展示在页面上，滚动展示5条，实际可以滚动50条

如果推送消息中包含新的token，则进行机器人信息推送，并且将这个信息存储到数据库中。更新页面上吗的信息

数据导入数据库后源数据删除。


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

启动web页面

### `npm run build`

构建应用

### `npm run db:token-balance`

手动同步帐户余额到monogodb数据库

### `npm run db:tg-sync`

手动同步推送的交易数据

### `pnpm run db:trandtion`

通过BSCSCAN 浏览器的接口获取交易总体记录信息，目前大概有22w条数据