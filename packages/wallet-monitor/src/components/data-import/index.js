import { useEffect, useState } from 'react';
import { Button,message, Table } from 'antd';
import { columns } from './config'
import { useQueryAllDatas } from '../../store';

const DataImport = () => {
    const fetchList = useQueryAllDatas((state) => state.fetchList)
    const list = useQueryAllDatas((state) => state.list)
    useEffect(()=>{
        fetchList()
    },[])
    return <>
        <Table columns={columns} dataSource={list.map(i=>({key:i._id,...i}))} />;
    </>
}

export default DataImport