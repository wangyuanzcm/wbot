import { create } from 'zustand'
import { getTransactionList, getTokenBalance } from './services/api'
import PouchDB from 'pouchdb';
import Find from 'pouchdb-find';
import { getAllTokens } from './transform'

PouchDB.plugin(Find);
export const remoteTrandtionDB = new PouchDB('http://localhost:5984/trandtion');
export const remoteDatesDB = new PouchDB('http://localhost:5984/dates');
export const remoteTokenDB = new PouchDB('http://localhost:5984/tokens');

// 获取全部的数据
export const useQueryAllDatas = create((set) => ({
  list: [],
  fetchList: async (args = {}) => {
    const params = {
      selector: {},
      ...args
    };
    const data = await remoteTrandtionDB.find(params)
    set({ list: data.docs })
  },
}))
// 获取以时间为key的数据
export const useQueryDatesDatas = create((set) => ({
  list: [],
  fetchList: async (args = {}) => {
    const params = {
      selector: {},
      ...args
    };
    const data = await remoteDatesDB.find(params)
    set({ list: data.docs })
  },
}))

// 获取token为key的数据
export const useQueryTokenDatas = create((set) => ({
  list: [],
  fetchList: async (args = {}) => {
    const params = {
      selector: {},
      ...args
    };
    const data = await remoteTokenDB.find(params)
    set({ list: data.docs })
  },
}))

export const useQueryDB = create((set) => ({
  list: [],
  tokens: [],
  dates: {},
  fetchList: async (args = {}) => {
    const params = {
      selector: {},
      ...args
    };
    const data = await remoteTrandtionDB.find(params)
    const { tokens, dates } = getAllTokens(data.docs)
    set({ list: data.docs, tokens, dates })
  },
}))

export const useTransactionStore = create((set) => ({
  transactionList: [],
  address: '',
  setAddress: (address) => set({ address }),
  fetchList: async (address) => {
    const response = await getTransactionList(address)
    console.log(response, 'response')

    set({ transactionList: response })
  },
}))


// 获取钱包中所有代币的余额
// export const useQueryTokenBalance = create((set) => ({
//   list: [],
//   fetchList: async (tokens) => {
//     const res = tokens.map(async (record, index) => {
//       const address = '0x0f0067cd819cb8f20bda62046daff7a2b5c88280'
//       const contractaddress = record.data[0].tokenContract
//       const data = request(() => getTokenBalance({ address, contractaddress }))
//       return {
//         key: record.key,
//         data: record.data,
//         tokenContract: data
//       }
//     })
//     set({ list: res })
//   },
// }))