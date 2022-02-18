import { useState } from "react";
import Web3 from "web3";
import ABI from "./abi.json";
function App() {
    const [account, setAccount] = useState([]);
    let web3 = new Web3("HTTP://127.0.0.1:7545");
    let contract = new web3.eth.Contract(
        ABI,
        "0xbf12Fe99cBdAeB022b294A2991a125f965CBAe3b"
    );
    let getAccounts = async () => {
        let accounts = [];
        try {
            accounts = await web3.eth.getAccounts();
            setAccount(accounts);
        } catch (err) {
            console.log(err);
        }
    };
    getAccounts();
    return <div className="App">{account}</div>;
}

export default App;
