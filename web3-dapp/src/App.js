import { useEffect, useState } from "react";
import Web3 from "web3";
import ABI from "./abi.json";
import Accounts from "./components/accountInfo/accounts";
import List from "./components/utilities/list";
import SelectAccount from "./components/utilities/selectAccount";

function App() {
    const [account, setAccount] = useState({ selected: "", options: [] });

    useEffect(() => {
        getAccounts();
    }, []);

    let web3 = new Web3("HTTP://127.0.0.1:7545");
    //initialize the smart contract
    let contract = new web3.eth.Contract(
        ABI,
        "0xdB27fdb789E0E02f8D6050503d266C8d9B8Ed127"
    );

    //get all the accounts in the smart contract
    let getAccounts = async () => {
        let accountData = [];
        try {
            accountData = await web3.eth.getAccounts();
            setAccount({ ...account, options: accountData });
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="App">
            {account && (
                <SelectAccount account={account} setAccount={setAccount} />
            )}
        </div>
    );
}

export default App;
