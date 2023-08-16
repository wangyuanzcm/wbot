import { useRef, useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Select, Space } from 'antd';
import { useQueryDB,useSearchTokens } from '../../store';

let index = 0;

const walletOptions = [
  '0x0f0067cd819cb8f20bda62046daff7a2b5c88280',
  '0x1865b71742f623ac09f1e999a4b2e939df3da4ab',
]
const WalletSearch = () => {
  const fetchList = useQueryDB((state) => state.fetchList)
  const [items, setItems] = useState(walletOptions);
  const [name, setName] = useState('');
  const inputRef = useRef(null);
  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const addItem = (e) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  // 切换select事件
  const onSelectChange = (item) => {
    fetchList(
      {
      "selector": {
        "walletAddress": item
      }
    }
    )
  }

  return (
    <Select
      style={{
        width: 300,
      }}
      defaultValue={items[0]}
      onChange={onSelectChange}
      placeholder="钱包地址"
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider
            style={{
              margin: '8px 0',
            }}
          />
          <Space
            style={{
              padding: '0 8px 4px',
            }}
          >
            <Input
              placeholder="Please enter item"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
            />
            <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
              Add item
            </Button>
          </Space>
        </>
      )}
      options={items.map((item) => ({
        label: item.slice(-6),
        value: item,
      }))}
    />
  );
};
export default WalletSearch;