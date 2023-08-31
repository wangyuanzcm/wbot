/**
 * 通过日志事件来获取交易的详细内容
 * 1. 从数据库/推送交易事件中获取到交易hash
 * 2. 通过交易hash来获取到交易日志
 * 3. 获取到交易日志后，通过日志中的合约address获取到合约的字节码，动态生成合约的ABI，这里可以做一个缓存
 * 4. 通过动态生成合约的ABI，找到对应Transfer 事件的签名
 * 5. 根据时间签名来判断获取对应的交易数据
 */
var axios = require("axios");
var BigNumber = require('bignumber.js');

require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;
const Web3 = require('web3').Web3;
const url = "mongodb://127.0.0.1:27017/web3";
const { REACT_APP_BSC_API_KEY } = process.env;
// 默认一个固定的交易hash
const TXHASH =
    "0xc36cf81a3c3658f7f2f0fb8066439d7d17b989520248d441474a471fd82a494d";
// 链接对应的rpc节点
const web3 = new Web3("https://broken-lingering-forest.bsc.discover.quiknode.pro/829ed01447aad7a4aa348801125bda072b1e5e41/")

// 获取合约中的事件签名
const getDetailFromLogs = async (contractAddress, eventData, topics) => {
    // const  byteCode = await web3.eth.getCode(contractAddress);
    // 这里使用区块链浏览器的接口可以直接返回ABI，所以不用RPC接口实现
    const { data } = await axios.get(`https://api.bscscan.com/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${REACT_APP_BSC_API_KEY}`)
    // 这里会返回合约的全部信息，可以将合约的信息存库，用于缓存使用
    const contractABI = data?.result[0]['ABI'];
    const eventABI = (JSON.parse(contractABI) || []).find(abi => abi.type === 'event' && abi.name === 'Transfer');
    if (eventABI) {
        const contract = await new web3.eth.Contract(JSON.parse(contractABI), contractAddress);
        const symbol = await contract.methods.symbol().call();
        // 解析日志事件
        const parsedLog = web3.eth.abi.decodeLog(eventABI.inputs, eventData, topics);
        const { from, to, value, src, dst, wad } = parsedLog
        // 返回事件签名，这里已经不需要了
        // const transferEventSignature = web3.eth.abi.encodeEventSignature(eventABI);
        const x = new BigNumber(value, 10)          // "11"
        const y = new BigNumber(wad, 10)
        const m = new BigNumber('1000000000000000000', 10)

        return {
            symbol,
            contractAddress,
            contractABI,
            from: from ? from : src,
            to: to ? to : dst,
            value: value ? x.dividedBy(m).toFormat(6) : y.dividedBy(m).toFormat(6)
        }
    }
    return ''
}
const getTransactionReceipt = async (txhash) => {
    try {
        const receipt = await web3.eth.getTransactionReceipt(txhash)
        // 获取交易回执的log字段
        const { logs = [] } = receipt;
        let events = logs.map(async log => {
            const { address, topics = [], data } = log;
            const detailData = await getDetailFromLogs(address, data, topics);
            return detailData ? { ...detailData, transactionHash: txhash } : null
        })
        const eventData = await Promise.all(events);
        return eventData.filter(event => event)
    } catch (err) {
        console.log(err, "err");
    }
};


const getEventByLogs = async (txhash) => {

    const client = await MongoClient.connect(url);
    // 准备要插入的数据
    const result = await getTransactionReceipt(txhash);
    console.log(result, "---")
    const db = client.db("web3"); // 如果没有指定数据库名称，则使用默认数据库

    const collection = db.collection("transactiondetails"); // 替换为实际的集合名称
    // 将数据插入到集合中
    const insertResult = await collection.insertMany(result);
    console.log(insertResult)
    client.close(); // 关闭数据库连接

}

getEventByLogs(TXHASH)