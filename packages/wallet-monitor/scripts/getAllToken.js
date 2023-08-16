// 根据区块号遍历去获取钱包对应的交易记录
const axios = require('axios');
var cheerio = require('cheerio');
const PouchDB = require('pouchdb');

require('dotenv').config();

const walletAddress = '0x0f0067cd819cb8f20bda62046daff7a2b5c88280'; // 钱包地址
const bscApiKey = process.env.BSC_API_KEY; // BSC API 访问令牌
// 大概是7.16 3:15开始的，由于交易量太大，不太好分清楚从什么时间开始
const startblock = 29992389;
const endblock = "latest"

// 添加随机处理，避免因为时间太规律而导致请求失败
function createRequest({ pool = 10, interval = 0, cacheTime = 1000, isRandom = false }) {
  const queue = []; // 请求队列
  const cache = new Map(); // 缓存请求结果
  let running = 0; // 正在运行的请求数

  async function request(promiseFn) {
    const url = promiseFn.toString(); // 将函数转为字符串作为唯一的缓存 key

    // 如果缓存池中存在数据并且未过期，则直接返回缓存数据
    const cachedData = cache.get(url);
    if (cachedData && Date.now() - cachedData.timestamp < cacheTime) {
      return cachedData.response;
    }

    // 如果正在运行的请求数超过最大并发数，则将请求加入队列
    if (running >= pool) {
      return new Promise((resolve, reject) => {
        queue.push({ promiseFn, resolve, reject });
      });
    }

    // 发起新的请求
    running++;

    const response = await promiseFn();
    running--;
    // 更新缓存池
    const timestamp = Date.now();
    cache.set(url, { response, timestamp });

    // 处理队列中的请求
    if (queue.length > 0) {
      const { promiseFn, resolve, reject } = queue.shift();
      // 随机时间在设定时间一半以上
      const intervalTime = isRandom ? (Math.random() + 0.5) * interval : interval;
      setTimeout(() => {
        request(promiseFn).then(resolve).catch(reject);
      }, intervalTime);
    }
    return response;
  }

  return request;
}

const transfromHtml = (from, to, data) => {

  const $ = cheerio.load(data);
  // 选择要删除的子元素
  const $pToDelete = $('.table-responsive');
  // 删除子元素
  $pToDelete.remove();
  // console.log($("#wrapperContent"), '$("#wrapperContent")')
  // 获取交易详情
  const transDetail = $("#wrapperContent")[1].children.map((li) => {
    return $(li).text()
  })

  // 当前的token总数
  const content = $('#ContentPlaceHolder1_maintable .row.align-items-center');
  let keyMaps = content.map((i, row) => {
    const leftKey = $($(row).children()[0]).text();
    const rightKey = $($(row).children()[1]).text();
    const key = String(leftKey).trim().replaceAll(":", "").replaceAll(" ", "");
    const val = String(rightKey).trim().replaceAll("\n", "").replaceAll(" ", "");
    return {
      [key]: val
    }
  }).toArray().reduce((a, b) => ({ ...a, ...b }), {});
  // console.log(keyMaps, 'tabContent');
  // 根据当前查询的主钱包来获取具体的交易数据
  const transData = transDetail.reduce((a, i) => {
    const text = i.split('From')[1].trim();
    const [From, ToText] = text.split('To');
    const [To, ForText] = ToText.split('For');
    if (From.indexOf(from) > -1) {
      a.takeOut = ForText.trim()
      return a;
    } else if (To.indexOf(from) > -1) {
      a.takeIn = ForText.trim()
      return a;
    } else if (To.indexOf(to) === -1 && From.indexOf(to) === -1) {
      a.takeIn = ForText.trim()
      return a;
    } else {
      a.tokenTrans.push(ForText.trim())
      a.walletTrans.push([From.trim(), To.trim()]);
      return a;
    }
  }, {
    tokenTrans: [],
    walletTrans: []
  })
  const takeOutMatch = (transData?.takeOut || '').match(/\((.*?)\)/g)
  const takeInMatch = (transData?.takeIn || '').match(/\((.*?)\)/g)

  const takeOutMoney = takeOutMatch.length > 0 ? takeOutMatch[0].replace(/\(|\)/g, '') : '';
  const takeOutToken = takeOutMatch.length > 1 ? takeOutMatch[1].replace(/\(|\)/g, '') : '';
  const takeInMoney = takeInMatch.length > 0 ? takeInMatch[0].replace(/\(|\)/g, '') : '';
  const takeInToken = takeInMatch.length > 1 ? takeInMatch[1].replace(/\(|\)/g, '') : '';
  return { ...keyMaps, ...transData, From: from, To: to, takeOutMoney, takeOutToken, takeInMoney, takeInToken };

}

// 
/**
 * 将数据存入数据库，首先尝试直接导入，如果报错，则下拉数据，再更新
 * @param {*} db 
 * @param {*} docs 
 */
const bulkDocs = async (db, docs) => {
  try {
    const result = await db.put({ ...docs, _id: docs.TransactionHash });
    console.log(result, "导入成功");
  } catch (err) {
    const doc = await db.get(docs.TransactionHash)
    const latestRev = doc._rev;
    const result = await db.put({ ...docs, _id: docs.TransactionHash, _rev: latestRev });
    console.log(result, "导入成功");
  }

}
const request = createRequest({ pool: 5, interval: 60 * 1000 }); // 最大并发数为3，间隔时间为1秒

var allTokenConfig = {
  method: 'get',
  baseUrl: 'https://api.bscscan.com',
  url: `https://api.bscscan.com/api?module=account&action=txlist&address=${walletAddress}&startblock=${startblock}&endblock=${endblock}&apikey=${bscApiKey}&sort=desc&isError=0`
};

const requestAllToken = async () => {
  const db = new PouchDB(`http://localhost:5984/${walletAddress}`);

  const allTokens = await axios(allTokenConfig);
  const txs = allTokens.data.result;
  // 筛选出成功的交易数据
  const successfulTxs = txs.filter(tx => tx.isError === '0' && tx.txreceipt_status === '1')
  console.log(successfulTxs.length, 'success')
  successfulTxs.forEach(async (tx, i) => {
    const { hash, from, to, ...others } = tx;
    try {
      // const proxy = getRandomProxy();
      const detail = await request(() => axios({
        method: 'get',
        url: `https://bscscan.com/tx/${hash}`,
      }))
      const data = detail.data;
      const singleTransData = transfromHtml(from, to, data);
      const result = { ...others, ...singleTransData }
      console.log(i);
      await bulkDocs(db, result)
    } catch (error) {
      console.log(error)
    }

  })
}


requestAllToken()