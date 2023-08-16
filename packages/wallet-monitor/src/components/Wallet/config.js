
// 按时间排序的交易总金额
export const getDateOption = (list = []) => {
  let soldData = [];
  let buyData = [];
  let date = [];
  list.sort((a, b) => Number(a.key) - Number(b.key)).map(i => {
    const { key, data } = i
    Object.values(data).map(item => {
      if (item['交易方式'] === '钱包里交易卖出') {

        soldData.push(Number(item['总金额'].replace('$', '')))
        buyData.push(0)
      } else if (item['交易方式'] === '钱包里交易买入') {
        buyData.push(Number(item['总金额'].replace('$', '')))
        soldData.push(0)
      }else{
        soldData.push(0)
        buyData.push(0)
      }
      date.push(item['时间']);
    })
  })
  return {
    title: {
      text: '买入卖出交易图',
      left: 'center'
    },
    grid: {
      bottom: 80
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        animation: false,
        label: {
          backgroundColor: '#505765'
        }
      }
    },
    legend: {
      data: ['钱包里交易卖出', '钱包里交易买入'],
      left: 10
    },
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 65,
        end: 85
      },
      {
        type: 'inside',
        realtime: true,
        start: 65,
        end: 85
      }
    ],
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: false },
        // prettier-ignore
        data: date.map(function (str) {
          return str.replace(' ', '\n');
        })
      }
    ],
    yAxis: [
      {
        name: '钱包里交易卖出(m³/s)',
        type: 'value'
      },
      {
        name: '钱包里交易卖出(mm)',
        nameLocation: 'start',
        alignTicks: true,
        type: 'value',
        inverse: true
      }
    ],
    series: [
      {
        name: '钱包里交易卖出',
        type: 'line',
        areaStyle: {},
        lineStyle: {
          width: 1
        },
        emphasis: {
          focus: 'series'
        },
        // markArea: {
        //   silent: true,
        //   itemStyle: {
        //     opacity: 0.3
        //   },
        //   data: [
        //     [
        //       {
        //         xAxis: '2009/9/12\n7:00'
        //       },
        //       {
        //         xAxis: '2009/9/22\n7:00'
        //       }
        //     ]
        //   ]
        // },
        // prettier-ignore
        data: soldData
      },
      {
        name: '钱包里交易买入',
        type: 'line',
        yAxisIndex: 1,
        areaStyle: {},
        lineStyle: {
          width: 1
        },
        emphasis: {
          focus: 'series'
        },
        // markArea: {
        //   silent: true,
        //   itemStyle: {
        //     opacity: 0.3
        //   },
        //   data: [
        //     [
        //       {
        //         xAxis: '2009/9/10\n7:00'
        //       },
        //       {
        //         xAxis: '2009/9/20\n7:00'
        //       }
        //     ]
        //   ]
        // },
        // prettier-ignore
        data: buyData
      }
    ]
  };
}



// 按时间排序的token
export const getTokenOption = (list = []) => {
  const token = 'XVS';
  let tradeInData = [];
  let tradeOutData = [];
  let transInData = [];
  let transOutData = [];

  let date = [];

  var emphasisStyle = {
    itemStyle: {
      shadowBlur: 10,
      shadowColor: 'rgba(0,0,0,0.3)'
    }
  };
  list.filter(item=> item.key === token).map(i => {
    const { key, data } = i
    Object.values(data).map(item => {
      if (item['交易方式'] === '钱包里交易买入') {

        tradeInData.push(Number(item['总金额'].replace('$', '')))
        tradeOutData.push(0)
        transInData.push(0)
        transOutData.push(0)
      } else if (item['交易方式'] === '钱包里交易卖出') {

        tradeOutData.push(Number(item['总金额'].replace('$', '')))
        tradeInData.push(0)
        transInData.push(0)
        transOutData.push(0)
      } 
      else if (item['交易方式'] === '钱包里转出') {

        transOutData.push(Number(item['总金额'].replace('$', '')))
        tradeOutData.push(0)
        tradeInData.push(0)
        transInData.push(0)
      } 
      else if (item['交易方式'] === '钱包里转入') {

        transInData.push(Number(item['总金额'].replace('$', '')))
        tradeOutData.push(0)
        transInData.push(0)
        transOutData.push(0)
      } 
      date.push(item['时间']);
    })
  })
  return {
    title: {
      text: `${token}买入卖出交易图`,
      left: 'center'
    },
    legend: {
      data: ['钱包里交易买入','钱包里交易卖出',   '钱包里转入','钱包里转出'],
      left: '10%'
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
    tooltip: {},
    xAxis: {
      data: date,
      name: 'X Axis',
      axisLine: { onZero: true },
      splitLine: { show: false },
      splitArea: { show: false }
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