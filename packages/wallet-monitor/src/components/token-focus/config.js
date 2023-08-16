import dayjs from 'dayjs'
import { notification,Button } from 'antd';
import { getTokenBalance } from '../../services/api'

const splitTokenData = (list) => {
  let tradeInData = [];
  let tradeOutData = [];
  let transInData = [];
  let transOutData = [];

  let tradeInPriceData = [];
  let tradeOutPriceData = [];
  let transInPriceData = [];
  let transOutPriceData = [];

  let date = [];
  list.map(item => {
    const time = new Date(item['时间']).getTime()
    const total = Number(item['总金额'].replace('$', ''))
    const unitPrice = Number(item['单价'].replace('$', ''))

    if (item['交易方式'] === '钱包里交易买入') {
      tradeInData.push([time, total])
      tradeInPriceData.push([time, unitPrice])

    } else if (item['交易方式'] === '钱包里交易卖出') {
      tradeOutData.push([time, total])
      tradeOutPriceData.push([time, unitPrice])

    }
    else if (item['交易方式'] === '钱包里转出') {
      transOutData.push([time, total])
      transOutPriceData.push([time, unitPrice])

    }
    else if (item['交易方式'] === '钱包里转入') {
      transInData.push([time, total])
      transInPriceData.push([time, unitPrice])

    }
    date.push(time);
  })
  return {
    date, transInData, tradeOutData, tradeInData, transOutData,
    tradeInPriceData,
    tradeOutPriceData,
    transInPriceData,
    transOutPriceData,
  }
}
// 按时间排序的token
export const getTokenOption = (token, list = []) => {

  const { date, transInData, tradeOutData, tradeInData, transOutData } = splitTokenData(list)
  var emphasisStyle = {
    itemStyle: {
      shadowBlur: 10,
      shadowColor: 'rgba(0,0,0,0.3)'
    }
  };

  return {
    title: {
      text: `${token}买入卖出交易图`,
      left: 'center',
    },
    legend: {
      data: ['钱包里交易买入', '钱包里交易卖出', '钱包里转入', '钱包里转出'],
      left: 'center',
      bottom: 0
    },
    brush: {
      toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
      xAxisIndex: 0
    },
    toolbox: {
      feature: {
        magicType: {
          type: ['stack']
        },
        dataView: {}
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      position: function (pos, params, el, elRect, size) {
        var obj = { top: 10 };
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
        return obj;
      }
    },
    axisPointer: {
      link: [{ xAxisIndex: 'all' }]
    },
    xAxis: {
      type: 'time',
      min: date[0],
      max: date[date.length - 1],
      axisLabel: {
        interval: 0,
        rotate: 30,
        formatter: function (value, index) {
          return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    },
    yAxis: {},
    grid: {
      bottom: 100
    },
    series: [
      {
        name: '钱包里交易买入',
        type: 'bar',
        stack: 'one',
        emphasis: emphasisStyle,
        data: tradeInData
      },
      {
        name: '钱包里交易卖出',
        type: 'bar',
        stack: 'one',
        emphasis: emphasisStyle,
        data: tradeOutData
      },
      {
        name: '钱包里转入',
        type: 'bar',
        stack: 'two',
        emphasis: emphasisStyle,
        data: transInData
      },
      {
        name: '钱包里转出',
        type: 'bar',
        stack: 'two',
        emphasis: emphasisStyle,
        data: transOutData
      }
    ]
  };
}

export const getKlineOptions = (token, priceData = [], tokenData) => {
  if (priceData.length === 0) {
    notification.open({
      message: `不存在${token}/USDT价格走势图`,
    });
    return {
      // title: {
      //   text: `${token}/USDT买入卖出交易图`,
      //   left: 'center'
      // },
      // xAxis: { data: [] },
      // yAxis: { data: [] },
    };
  }

  const { tradeInPriceData,
    tradeOutPriceData,
    transInPriceData,
    transOutPriceData, } = splitTokenData(tokenData)

  return {
    title: {
      text: `${token}/USDT买入卖出交易图`,
      left: 'center'
    },
    legend: {
      bottom: 10,
      left: 'center',
      data: ['钱包里交易买入', '钱包里交易卖出', '钱包里转入', '钱包里转出']
    },
    xAxis: {
      type: 'time',
      min: priceData[0][0],
      max: priceData[priceData.length - 1][0],
      axisLabel: {
        interval: 0,
        rotate: 30,
        formatter: function (value, index) {
          return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    },

    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 0,
        end: 100
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: 'slider',
        top: '85%',
        start: 98,
        end: 100
      }
    ],
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: false
        },
        brush: {
          type: ['lineX', 'clear']
        }
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      position: function (pos, params, el, elRect, size) {
        var obj = { top: 10 };
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
        return obj;
      }
    },
    axisPointer: {
      link: [{ xAxisIndex: 'all' }]
    },
    yAxis: {
      scale: true,
      axisLine: { lineStyle: { color: '#8392A5' } },
      splitLine: { show: true }
    },
    series: [
      {
        type: 'candlestick',
        data: priceData,
      },
      {
        name: '钱包里交易买入',
        type: 'line',
        data: tradeInPriceData,
        smooth: true,
        lineStyle: {
          opacity: 0.5,

        }
      },
      {
        name: '钱包里交易卖出',
        type: 'line',
        data: tradeOutPriceData,
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: '钱包里转入',
        type: 'line',
        data: transInPriceData,
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: '钱包里转出',
        type: 'line',
        data: transOutPriceData,
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
    ]
  };
}

export const columns = [
  {
    title: 'token',
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: '首次交易时间',
    dataIndex: 'time',
    key: 'time',
    sorter: (a, b) => {
      return new Date(b).getTime() - new Date(a).getTime()
    }
  },
  {
    title: '合约交易',
    dataIndex: 'jump',
    key: 'jump',
    render: (_, record) => {
      const { key } = record;
      const jumpUrl = `https://www.binance.com/zh-CN/futures/${key}USDT`
      return <Button type="primary">
        <a href={jumpUrl} target="_blank">跳转</a>
      </Button>
    }
  },
  {
    title: '当前token余额',
    dataIndex: 'tokenNumber',
    key: 'tokenNumber',
    render: (tokenNumber, record) => {
      if (!tokenNumber) return '';
      return tokenNumber
    }
  }
];