import { useEffect } from "react";
import Trandtion from "./token-actions";
import WalletSearch from "./wallet-search";
// import TokenList from './token-list'
import { useQueryDatesDatas,useQueryTokenDatas} from "../../store";
const Wallet = () => {
  const fetchList = useQueryDatesDatas((state) => state.fetchList);
  const fetchTokenList = useQueryTokenDatas((state) => state.fetchList);

  useEffect(() => {
    fetchList();
    fetchTokenList()
  }, []);
  return (
    <>
      <WalletSearch />
      {/* <TokenList/> */}
      <Trandtion />
    </>
  );
};

export default Wallet;
