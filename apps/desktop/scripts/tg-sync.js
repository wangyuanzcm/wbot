/**
 * 手动同步交易记录到数据库,这里根据交易单号进行了筛选
 */
const qs = require('qs')
const fsPromises = require('fs/promises');
const path = require('path');
const lodash = require('lodash');
const MongoClient = require("mongodb").MongoClient;

require("dotenv").config();

const { REACT_APP_MONOGODB_URL} = process.env;
const url = `mongodb://${REACT_APP_MONOGODB_URL}/web3`;

// 格式化数据内容
const formatData = (data) => {
    return data.reduce((res, item) => {
        const { id, date, date_unixtime, text_entities } = item;
        // 根据消息的不同先切分成两个数据模块
        const textgroup = text_entities.reduce((pre, cur) => {
            if (cur.type === 'plain' && cur.text.indexOf('监控分组名') > -1) {
                pre.push({})
            } else {
                let curObj = pre[pre.length - 1];
                if (cur.type === 'text_link') {

                    if (cur.text.indexOf('钱包') > -1) {
                        curObj['钱包'] = cur.href
                        curObj.walletAddress = cur.href.split('/').pop()
                    }
                    if (cur.text.indexOf('交易') > -1) {
                        const urlArray = cur.href.split('/');
                        curObj['交易'] = cur.href;
                        curObj['transactionHash'] = urlArray[urlArray.length - 1]

                    }
                    if (cur.text.indexOf('查看行情') > -1) {
                        curObj['查看行情'] = cur.href
                        const urlData = qs.parse(cur.href.split('?')[1])
                        curObj['tokenContract'] = urlData.token || ''
                        curObj['chain'] = urlData.chain || ''
                    }
                }
                if (cur.type === 'plain') {
                    const textArr = cur.text.replaceAll('：', ':').split('\n').filter(i => i)
                    const textObj = textArr.reduce((_pre, cur) => {
                        const index = cur.indexOf(':');
                        if (cur.slice(0, index).indexOf('钱包里') > -1) {
                            _pre.token = cur.slice(index + 1)
                            _pre['交易方式'] = cur.slice(0, index)

                        } else {
                            _pre[cur.slice(0, index)] = cur.slice(index + 1)
                        }
                        return _pre
                    }, {})
                    curObj = { ...curObj, ...textObj }
                }
                pre[pre.length - 1] = curObj;
            }
            return pre
        }, [])
        // console.log(textgroup,'textgroup')
        return [...res, ...textgroup.map(i => {
            return {
                date,
                date_unixtime,
                ...i
            }
        })]

    }, [])
}
// 引入与DiTingRobot的对话数据
const importData = (jsonData = []) => {
    const data = (jsonData || []).filter(i => {
        if(!i){
            return false
        }
        if (i.from_id !== 'user2127644161') {
            return false
        }
        if (!Array.isArray(i.text)) {
            return false
        }
        if (i.text[0].indexOf('监控分组名') === -1) {
            return false

        }
        return true
    })
    const result = formatData(data);
    return lodash.uniqBy(result, 'transactionHash');
}

// 读取文件内容
const getFileContent = async (file) => {
    const content = await fsPromises.readFile(path.join(__dirname, `../data/${file}`), 'utf8');
    if(content){
        return JSON.parse(content);
    }else{
        return {}
    }
}
// 遍历文件目录，读取json中的数据内容
const readJsonFile = async () => {
    try {
        // 链接数据库
        const client = await MongoClient.connect(url);
        // 遍历文件目录
        const files = await fsPromises.readdir(path.join(__dirname, '../data'));
        const filePromiseArray = files.filter(file => file.endsWith('.json')).map(file => getFileContent(file))
        const fileData = await Promise.all(filePromiseArray)
        console.log(fileData,'fileData====')
        let chatData = fileData.map(item => item.messages).flat(1);
        let chatUniqData = lodash.uniqBy(chatData, 'id');
        // 格式化对话中的数据内容
        const dbData = await importData(chatUniqData);
        console.log(dbData,'dbData')
        const db = client.db("web3"); // 如果没有指定数据库名称，则使用默认数据库
        const collection = db.collection("trandtions"); // 替换为实际的集合名称
        // 将数据插入到集合中
        const insertResult = await collection.insertMany(dbData);
        console.log(insertResult,'===')
        client.close(); // 关闭数据库连接
    } catch (err) {
        console.error("Error connecting to the database:", err);
    }

}

readJsonFile()
