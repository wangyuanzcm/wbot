import { Button, Space } from "antd";

export const columns = [
  {
    title: "_id",
    dataIndex: "_id",
    key: "_id",
  },
  {
    title: "时间",
    dataIndex: "时间",
    key: "时间",
  },
  {
    title: "钱包地址",
    dataIndex: "walletAddress",
    key: "walletAddress",
  },
  {
    title: "交易方式",
    dataIndex: "交易方式",
    key: "交易方式",
  },
  {
    title: "token",
    dataIndex: "token",
    key: "token",
  },
  {
    title: "数量",
    dataIndex: "数量",
    key: "数量",
  },
  {
    title: "单价",
    dataIndex: "单价",
    key: "单价",
  },
  {
    title: "总金额",
    dataIndex: "总金额",
    key: "总金额",
  },
  {
    title: "更多",
    dataIndex: "交易",
    key: "交易",
    render: (_, record) => {
      return (
        <Space wrap>
          <Button type="primary">
            <a href={record["钱包"]} target="_blank">查看钱包</a>
          </Button>
          <Button type="primary">
            <a href={record["交易"]} target="_blank">查看交易</a>
          </Button>
          <Button type="primary">
            <a href={record["行情"]} target="_blank">查看行情</a>
          </Button>
        </Space>
      );
    },
  },
];
