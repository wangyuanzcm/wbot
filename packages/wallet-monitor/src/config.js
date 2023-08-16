import {
  Link,
} from "react-router-dom";
import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
export const menu_options =[
    {
      key: 'tradelist',
      icon: <UserOutlined />,
      label:  <Link to="/wallet">交易数据</Link>,           

    },
    {
      key: 'analysis',
      icon: <VideoCameraOutlined />,
      label:  <Link to="/dataimport">数据分析</Link>,           
    },
    {
      key: 'tokenfocus',
      icon: <VideoCameraOutlined />,
      label:  <Link to="/tokenfocus">token分析</Link>,           
    }
  ]