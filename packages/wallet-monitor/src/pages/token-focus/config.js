import { Button } from "antd";
import dayjs from "dayjs";

export const setOption = (data = []) => {
  let maxTime = '';
  let minTime = '';
  // 将数据转化为可以展示的格式
  const result = data.reduce((acc,cur)=>{
     cur.forEach(i=>{
      const {Symbol,ValueInUSD,created_time} = i||{};
      const USD = ValueInUSD.replace(/[\\$, ]/g, "");

      if(acc[Symbol]){
        acc[Symbol].data.push([created_time,Number(USD)])
      }else{
        acc[Symbol] = {
          name: Symbol,
          type: 'line',
          stack: 'one',
          data: [[created_time,Number(USD)]]
        }
      }
    })
    return acc
  }, {})
  console.log(Object.keys(result),'Object.keys(result)')
  // ecahrts的配置
  return {
    title: {
      text: '钱包内token变化图'
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
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
    legend: {
      data: Object.keys(result),
      left: 'center',
      bottom: 0
    },
    xAxis: {
      type: 'time',
      min: minTime,
      max: maxTime,
      axisLabel: {
        interval: 0,
        rotate: 30,
        formatter: function (value, index) {
          return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    },
    axisPointer: {
      link: [{ xAxisIndex: 'all' }]
    },
    yAxis: {
    },
    series: Object.values(result)
  }
}



export const columns = [
  {
    title: "token",
    dataIndex: "Symbol",
    key: "Symbol",
  },
  {
    title: "token名称",
    dataIndex: "TokenName",
    key: "TokenName",
  },
  {
    title: "数量",
    dataIndex: "Quantity",
    key: "Quantity",
    sorter: (a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    },
  },
  {
    title: "时间",
    dataIndex: "created_time",
    key: "created_time",
    render: (time) => {
      return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "当前价格",
    dataIndex: "TokenPrice",
    key: "TokenPrice",
  },
  {
    title: "交易价值(BNB)",
    dataIndex: "ValueIInBNB",
    key: "ValueIInBNB",
  },
  {
    title: "交易价值(USD)",
    dataIndex: "ValueInUSD",
    key: "ValueInUSD",
  },
  {
    title: "24h涨跌",
    dataIndex: "Change24h",
    key: "Change24h",
  },
  {
    title: "总数",
    dataIndex: "total",
    key: "total",
  },
  {
    title: "钱包总数(eth)",
    dataIndex: "totaleth",
    key: "totaleth",
  },
  {
    title: "钱包总数(USD)",
    dataIndex: "totalusd",
    key: "totalusd",
  },
];
