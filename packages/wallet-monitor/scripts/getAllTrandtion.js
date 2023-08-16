/**
 * 通过接口获取全部成功的交易记录，这里只获取交易记录，详细的交易内容需要另外获取
 */
const axios = require("axios");
const qs = require("qs");
const fsPromises = require("fs/promises");
const path = require("path");
const lodash = require("lodash");
const MongoClient = require("mongodb").MongoClient;

require("dotenv").config();

const { REACT_APP_MONOGODB_URL } = process.env;
const url = `mongodb://${REACT_APP_MONOGODB_URL}/web3`;
// 起始区块会随着数据的变化而变化
const startblock = 30685817;
const endblock = "latest";

const walletAddress = "0x0f0067cd819cb8f20bda62046daff7a2b5c88280"; // 钱包地址
const bscApiKey = process.env.BSC_API_KEY; // BSC API 访问令牌

const sleep = (time = 1000) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
// 获取交易数据
const requestTrandtion = async (start = startblock, end = endblock) => {
  var allTokenConfig = {
    method: "get",
    baseUrl: "https://api.bscscan.com",
    url: `https://api.bscscan.com/api?module=account&action=txlist&address=${walletAddress}&startblock=${start}&endblock=${end}&apikey=${bscApiKey}&sort=desc&isError=0`,
  };
  try {
    const allTokens = await axios(allTokenConfig);
    console.log(allTokens.message, "data====", new Date().getTime());

    const txs = allTokens.data.result || [];
    if (Array.isArray(txs)) {
      // 筛选出成功的交易数据
      const successfulTxs = (txs || []).filter(
        (tx) => tx.isError === "0" && tx.txreceipt_status === "1"
      );
      return successfulTxs;
    } else {
      // 如果请求次数超过限制，等待800毫秒，继续请求
      await sleep(1000);
      return await requestTrandtion(start, end);
    }
  } catch (err) {
    console.error(err);
  }
};

const getTrandtionHistory = async (client, start, end) => {
  // 链接数据库
  const data = await requestTrandtion(start, end);
  console.log(data, "data");
  if(data.length>0){
    const db = client.db("web3"); // 如果没有指定数据库名称，则使用默认数据库
    const collection = db.collection("trandtionhistorys"); // 替换为实际的集合名称
    // 将数据插入到集合中
    const insertResult = await collection.insertMany(data);
    console.log(insertResult, "===");
  }

  // 每次查询到的数据直接存储数据库
  if (start >= 0) {
    await sleep(1000);
    return await getTrandtionHistory(client, start - 100000, start);
  } else {
    return;
  }
};
const run = async () => {
  const client = await MongoClient.connect(url);
  await getTrandtionHistory(client, startblock, endblock);
  client.close();
};
run();
