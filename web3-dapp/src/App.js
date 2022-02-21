/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Web3 from "web3";
import ABI from "./abi.json";
import SelectAccount from "./components/accountInfo/selectAccount";
import AllBalance from "./components/balances/allBalance";
import Error from "./components/errorHandlers/error";

function App() {
    //for selecting 'from' account with options
    const [account, setAccount] = useState({
        selected: "",
        options: [],
        balance: null,
    });

    //name and symbol of the smart contract
    const [identity, setIdentity] = useState({
        name: "",
        symbol: "",
    });
    //for selecting 'to' account with options
    const [toAccount, setToAccount] = useState({
        selected: "",
        options: [],
        amount: 1000,
    });
    //for getting all the accounts and balances
    const [allAccounts, setAllAccounts] = useState({
        accounts: [],
        balances: [],
    });

    //for success/failure messages
    const [message, setMessage] = useState({
        data: "",
        visibility: false,
    });

    //initialize the smart contract
    let web3 = new Web3("HTTP://127.0.0.1:7546");
    let contract = new web3.eth.Contract(
        ABI,
        "0xD75ebB592029b5Df7E407013CF408F5C94208338"
    );
    //get the name of the token
    let getIdentity = async () => {
        try {
            let name = await contract.methods.name().call();
            let symbol = await contract.methods.symbol().call();
            setIdentity({ name: name, symbol: symbol });
        } catch (err) {}
    };
    //get all the accounts
    let getAccounts = async () => {
        let accountData = [];
        try {
            accountData = await web3.eth.getAccounts();
            setAccount({
                ...account,
                options: accountData,
                selected: accountData[0],
            });
            setToAccount({
                ...toAccount,
                options: accountData,
                selected: accountData[0],
            });
        } catch (err) {
            console.log(err);
            setMessage({
                data: "error while getting accounts, getAccount",
                visibility: true,
            });
        }
    };
    //get the balance of the account
    let getBalance = (address) => {
        contract.methods
            .balanceOf(address)
            .call()
            .then((data) => setAccount({ ...account, balance: data }));
    };

    //get all the balance of all the accounts
    //in the smart contract
    let getAllBalance = async () => {
        try {
            let accounts = await web3.eth.getAccounts();
            let accountBalance;
            let allAccounts = [];
            let accountBalances = [];
            for (let account of accounts) {
                accountBalance = await contract.methods
                    .balanceOf(account)
                    .call();
                accountBalances.push(accountBalance);
                allAccounts.push(account);
            }
            // console.log(`accounts: ${allAccounts}\nbalance: ${accountBalances}\n`);
            setAllAccounts({
                accounts: allAccounts,
                balances: accountBalances,
            });
        } catch (err) {
            console.error(err);
            setMessage({
                data: "error while checking balance",
                visibility: true,
            });
        }
    };
    let transfer = (from, to, amount) => {
        contract.methods
            .transfer(to, amount)
            .send({ from: from, value: "1000" })
            .on("receipt", (data) => {
                console.log(data);
                setMessage({
                    data: "transfer successful",
                    visibility: true,
                });
                getAllBalance();
                getBalance(account.selected);
            })
            .on("error", (err, receipt) => {
                if (err) {
                    console.error(
                        "error--=====----\n",
                        err,
                        "\nerror--=====----"
                    );
                    setMessage({
                        data: err.message,
                        visibility: true,
                    });
                } else
                    setMessage({
                        data: receipt,
                        visibility: true,
                    });
            });
    };
    ///////////////////////////////////////////////////////////
    useEffect(() => {
        getAccounts();
        getAllBalance();
        getIdentity();
    }, []);

    //this is for displaying table of accounts and balances
    useEffect(() => {
        if (account.selected.length > 0) {
            getBalance(account.selected);
        }
    }, [account.selected]);

    //get all the accounts in the smart contract

    return (
        <div className="App">
            <div className="identity">
                <h3>
                    Token Name: <span>{identity.name}</span>
                </h3>
                <h3>
                    Token Symbol: <span>{identity.symbol}</span>
                </h3>
            </div>
            <div className="title">
                <h2>Fungible Token Example</h2>
            </div>
            <div className="fromAccount flex">
                <h3>select Account:</h3>
                {account && (
                    <SelectAccount account={account} setAccount={setAccount} />
                )}
                <h3>balance:</h3>
                {account.balance}
            </div>

            <div className="toAccount flex">
                <h3>select Account to send token:</h3>
                {toAccount && (
                    <>
                        <SelectAccount
                            account={toAccount}
                            setAccount={setToAccount}
                        />
                        <input
                            type="number"
                            value={toAccount.amount}
                            onChange={(e) => {
                                e.target.value > 0
                                    ? setToAccount({
                                          ...toAccount,
                                          amount: e.target.value,
                                      })
                                    : setToAccount({
                                          ...toAccount,
                                          amount: 0,
                                      });
                            }}
                        />
                        <button
                            onClick={() => {
                                transfer(
                                    account.selected,
                                    toAccount.selected,
                                    toAccount.amount
                                );
                            }}
                        >
                            Send
                        </button>
                    </>
                )}
            </div>

            <div className="allAccounts flex">
                <h3>all Accounts</h3>
                <AllBalance
                    accounts={allAccounts.accounts}
                    balances={allAccounts.balances}
                />
            </div>
            <div className="message flex">
                <h3>notifications</h3>
                {message.visibility && <Error message={message.data} />}
            </div>
        </div>
    );
}

export default App;
