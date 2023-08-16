import React, { useEffect, useRef } from "react";
import { useRequest } from "ahooks";
import { Select, Table, Col, Row } from "antd";
import * as echarts from "echarts";

import { getTokenBalance, getTokenBalanceHistory } from "../../services/api";
import { columns, setOption } from "./config";

const { REACT_APP_GITHUB_ACCESS_TOKEN } = process.env;
const TokenFocus = () => {
  const chartRef = useRef(null);
  const { data: historyData = [], loading: historyLoading } = useRequest(
    () =>
      getTokenBalanceHistory({
        owner: "wangyuanzcm",
        repo: "cronlunch",
        issueNumber: "2",
        accessToken: REACT_APP_GITHUB_ACCESS_TOKEN,
      }),
    {
      cacheKey: "cacheKey-tokenBalance",
      staleTime: 10000*60,
    }
  );
  const { data = [], loading } = useRequest(getTokenBalance, {
    cacheKey: "cacheKey-tokenBalance",
    staleTime: 10000*60,
  });

  const initChart = () => {
    const myChart = echarts.init(chartRef?.current);
    const echartsOption = setOption([...historyData]);
    console.log(echartsOption,'echartsOption')
    myChart.setOption(echartsOption);
  };
  useEffect(() => {
    if (chartRef?.current) {
      initChart();
    }
  }, [chartRef,historyData,data]);
  return (
    <>
      <div ref={chartRef} style={{ width: "80%", margin: "0 auto" ,height:'600px'}}></div>
      {/* 展示钱包中token最新的余额 */}
      <Table dataSource={data} columns={columns} loading={loading} key={(record)=>record.Symbol}/>
    </>
  );
};

export default TokenFocus;
