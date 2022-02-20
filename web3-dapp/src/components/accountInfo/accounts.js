import React from "react";

function Accounts({ getAccounts, account, setAccount }) {
    getAccounts();
    return (
        <select
            value={account.selected}
            onChange={(value) => {
                setAccount({ ...account, selected: value });
            }}
        >
            {account.options.map((value, index) => {
                return (
                    <option key={index} value={value}>
                        {value}
                    </option>
                );
            })}
        </select>
    );
}

export default Accounts;
