import axios from "axios";
import qs from "qs";
import { message as Toast } from "antd";

const workerUrl = "https://cronlunch.hiker.workers.dev/";
const baseUrl = "https://api.bscscan.com/api";
const apikey = "TAM2NJWJ4B7RV2E75MXSA534BSWN9R67XE"; // bsc浏览器接口查询apikey，因为是普通用户，所以没有隐藏
// 获取交易列表数据
export const getTransactionList = async (address) => {
    const params = {
        module: "account",
        action: "txlist",
        address,
        apikey,
        sort: "desc",
    };
    try {
        const { data } = await axios.get(`${baseUrl}?${qs.stringify(params)}`);
        const { status, result, message } = data;
        if (status === "1") {
            return result;
        } else {
            Toast.info(message);
        }
    } catch (err) {
        throw new Error(err);
    }
};

// 获取代币历史价格数据
export const getTokenPrice = async (token, startTime, endTime) => {
    if (token.toUpperCase() === "USDT") {
        Toast.info("USDT不需要查询价格");
        return undefined;
    }
    const params = {
        startTime,
        endTime,
        interval: "1h",
        symbol: `${token}USDT`,
    };
    try {
        const { status, data, statusText } = await axios.get(
            `https://api.binance.com/api/v3/klines?${qs.stringify(params)}`
        );
        if (status === 200) {
            return data;
        } else {
            Toast.info(statusText);
        }
    } catch (err) {
        Toast.info(err);
        return undefined;
    }
};

// 实时获取钱包上所有代币的余额
export const getTokenBalance = async (address) => {
    var config = {
        method: "get",
        url: workerUrl,
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        }
    };
    try {
        // const { data } = await axios(config);
        const data = []
        console.log(data, "data");
        return data;

    } catch (err) {
        Toast.error(err.message);
    }
};
// 获取钱包过去所有代币的余额，由于数据量比较多，每次只返回30条数据，所以这里需要处理分页
export const getTokenBalanceHistory = async ({owner, repo, issueNumber, accessToken}) => {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const {data,headers} = response;
        const {link} = headers
        const result = data.map(item=>JSON.parse(item.body));
        return result;
    } catch (error) {
        // 处理错误情况
        Toast.error(error.message);
    }  
};

// 获取币安上的交易币对
export const getExchangeInfo = async () => {
    try {
        const { data } = await axios.get(
            `https://fapi.binance.com/fapi/v1/exchangeInfo`
        );
        const { status, result, message } = data;
        if (status === "1") {
            return result;
        } else {
            Toast.info(message);
        }
    } catch (err) {
        throw new Error(err);
    }
};
