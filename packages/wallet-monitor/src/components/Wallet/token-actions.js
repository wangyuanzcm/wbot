import React, { useEffect, useRef } from "react";
import * as echarts from 'echarts';
import { useQueryDatesDatas,useQueryTokenDatas } from '../../store';
// import { getSerisData } from '../../transform'
import { getDateOption,getTokenOption } from './config'
// 展示钱包地址随时间变化的交易记录
const Trandtion = props => {
    const list = useQueryDatesDatas((state) => state.list)
    const tokens = useQueryTokenDatas((state) => state.list)

    const chartRef = useRef(null);
    const tokenchartRef = useRef(null);
    const initChart = (list,tokens) => {
        var tokenChart = echarts.init(tokenchartRef?.current);
        const tokenOption = getTokenOption(tokens)
        tokenChart.setOption(tokenOption);

        var myChart = echarts.init(chartRef?.current);
        const option = getDateOption(list)
        myChart.setOption(option);
    }

    useEffect(() => {
        if (chartRef?.current) {
            initChart(list,tokens)
        }
    }, [chartRef, list,tokens])

    return (<>
        <div ref={tokenchartRef} style={{ width: '80%', margin: '0 auto', height: '600px' }}></div>
        <div ref={chartRef} style={{ width: '80%', margin: '0 auto', height: '600px' }}></div>
    </>
    )
}

export default Trandtion;



