/**
 * 拉去github issues缓存的历史余额数据，手动向monogodb里面导入历史数据,
 * 后续worker只发定时请求事件，存储数据由nodejs服务执行
 */
const axios = require("axios");
const MongoClient = require("mongodb").MongoClient;

require("dotenv").config();

const { REACT_APP_GITHUB_ACCESS_TOKEN ,REACT_APP_MONOGODB_URL} = process.env;
const url = `mongodb://${REACT_APP_MONOGODB_URL}/web3`;

const params = {
  owner: "wangyuanzcm",
  repo: "cronlunch",
  issueNumber: "2",
  accessToken: REACT_APP_GITHUB_ACCESS_TOKEN,
};
// 获取钱包过去所有代币的余额，由于数据量比较多，每次只返回30条数据，所以这里需要处理分页
const getTokenBalanceHistory = async (pageNumber = 1) => {
  const { owner, repo, issueNumber, accessToken } = params;
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments?page=${pageNumber}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  const { data, headers } = response;
  const { link = "" } = headers;
  console.log(link, "link---");
  const result = data.map((item) =>
    JSON.parse(item.body).map((i) => {
      return {
        ...i,
        walletAddress: "0x0f0067cd819cb8f20bda62046daff7a2b5c88280",
      };
    })
  ).flat();
  return {
    result,
    hasNest: Boolean(link),
  };
};
// 执行请求函数
const getAllHistory = async (res = [], pageNumber = 1) => {
  const { result, hasNest } = await getTokenBalanceHistory(pageNumber);
  console.log(result, "=======")
  if (hasNest && result.length > 0) {
    return getAllHistory([...res,...result], pageNumber + 1);
  } else {
    return res;
  }
};

const connectToDatabase = async () => {
  try {
    const client = await MongoClient.connect(url);
    // 准备要插入的数据
    const result = await getAllHistory();
    const db = client.db("web3"); // 如果没有指定数据库名称，则使用默认数据库

    const collection = db.collection("tokenbalances"); // 替换为实际的集合名称
    // 将数据插入到集合中
    const insertResult = await collection.insertMany(result);
    console.log(insertResult)
    client.close(); // 关闭数据库连接
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
};

connectToDatabase();


