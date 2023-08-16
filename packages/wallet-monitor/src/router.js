import React from "react";
import {
    Routes,
    Route,
} from "react-router-dom";
import Wallet from './components/Wallet';
import DataImport from './components/data-import';
import TokenFocus from './pages/token-focus';
const Router = () => {
    return (
        <Routes>
            {/* <Route path="/wallet" element={<Wallet />}></Route>
            <Route path="/dataimport" element={<DataImport />}></Route> */}
            <Route path="/tokenfocus" element={<TokenFocus />}></Route>

        </Routes>
    );
}

export default Router;