import React, { useEffect, useRef, useState } from "react";
import { Select, Table, Col, Row } from "antd";
import * as echarts from "echarts";
import { useQueryTokenDatas, useTransactionStore } from "../../store";
import { getTokenOption, getKlineOptions, columns } from "./config";
import { getTokenPrice } from "../../services/api";
import TokenTable from './token-table'

const TokenFocus = () => {
  const getTransactionList = useTransactionStore((state) => state.fetchList);
  const fetchList = useQueryTokenDatas((state) => state.fetchList);
  const tokens = useQueryTokenDatas((state) => state.list);
  // const balance = useQueryTokenBalance((state) => state.list);

  const [options, setOptions] = useState([]);

  const tokenchartRef = useRef(null);
  const pricechartRef = useRef(null);
  const handleChange = async (value) => {
    if (value && options.length > 0) {
      initChart(value, options);
    }
  };

  const initChart = async (current, tokens) => {
    const tokenData = tokens.filter((i) => i.value === current)[0].data;

    const startTime = new Date(tokenData[0]["时间"]).getTime();
    const endTime = new Date(tokenData[tokenData.length - 1]["时间"]).getTime();

    const priceData = await getTokenPrice(current, startTime, endTime);
    // token交易表
    var tokenChart = echarts.init(tokenchartRef?.current);
    const tokenOption = getTokenOption(current, tokenData);
    tokenChart.setOption(tokenOption);

    // 价格走势表
    var priceChart = echarts.init(pricechartRef?.current);
    const priceOption = getKlineOptions(current, priceData || [], tokenData);
    priceChart.setOption(priceOption);
  };
  useEffect(() => {
    fetchList();
    // getTransactionList("0x0f0067cd819cb8f20bda62046daff7a2b5c88280")
    // fetchBalanceList()
  }, []);
  useEffect(() => {
    if (tokenchartRef?.current && tokens.length > 0) {
      const selectOption = tokens.slice().map((i) => {
        const data = i.data.sort(
          (a, b) =>
            new Date(a["时间"]).getTime() - new Date(b["时间"]).getTime()
        );
        return { ...i, value: i.key, label: i.key, data };
      });
      setOptions(selectOption);
      handleChange(selectOption[0].value, selectOption);
    }
  }, [tokenchartRef, tokens]);
  return (
    <>
      {/* 选中对应钱包 */}
      <Row>
        <Select
          showSearch
          style={{ width: "500px", marginBottom: "20px" }}
          placeholder="Please select"
          onChange={handleChange}
          options={options}
        />
      </Row>
      <Row>
        {/* 展示钱包中token最新的余额 */}
        <TokenTable
          options={options}
        />
      </Row>
      <Row>
        <Col span={12}>
          <div
            ref={tokenchartRef}
            style={{ width: "80%", margin: "0 auto", height: "600px" }}
          ></div>
        </Col>
        <Col span={12}>
          <div
            ref={pricechartRef}
            style={{ width: "80%", margin: "0 auto", height: "600px" }}
          ></div>
        </Col>
      </Row>
      <iframe>
        <script src="https://widgets.coingecko.com/coingecko-coin-price-chart-widget.js"></script>
        <coingecko-coin-price-chart-widget currency="usd" coin-id="ripple" locale="en" height="300"></coingecko-coin-price-chart-widget>
      </iframe>
    </>
  );
};

export default TokenFocus;
