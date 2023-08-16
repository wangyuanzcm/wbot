import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { getTokenOption, getKlineOptions, columns } from "./config";
import createRequest from '../../utils/request-cache'
import { getTransactionList, getTokenBalance } from '../../services/api'

const request = createRequest({ pool: 1, interval: 30 * 1000 }); // 最大并发数为3，间隔时间为1秒
const TokenTable = ({ options }) => {
    const initData = options.map(record => {
        const { key, data } = record;
        const time = data[0]['时间']
        const tokenContract = data[0].tokenContract
        return {
            key: key,
            time: time,
            tokenNumber: '',
            tokenContract
        }
    }).sort((a, b) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime()
      })
    const [dataSource, setDataSource] = useState(initData)
    useEffect(() => {
        let catchData = initData.slice()
        initData.forEach(async (record, index) => {
            const address = '0x0f0067cd819cb8f20bda62046daff7a2b5c88280'
            const contractaddress = record.tokenContract
            const data = await request(() => getTokenBalance({ address, contractaddress }))
            catchData[index] = {
                ...record,
                tokenNumber:data/(10**18)
            }
            setDataSource([...catchData])
        })
    }, [options])
    return <Table
        title={() => "token首次交易时间"}
        columns={columns}
        dataSource={dataSource}
        style={{ width: "500px" }}
        scroll={{ y: 300 }}
        pagination={false}
    />
}

export default TokenTable