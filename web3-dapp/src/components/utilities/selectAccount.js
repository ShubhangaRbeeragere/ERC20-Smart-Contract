import React from "react";

function SelectAccount({ account, setAccount }) {
    return (
        <select
            name="accounts"
            id="accounts"
            value={account.selected}
            onChange={(e) => {
                setAccount({ ...account, selected: e.target.value });
            }}
        >
            {account.options.map((value, index) => (
                <option key={index} value={value}>
                    {value}
                </option>
            ))}
        </select>
    );
}

export default SelectAccount;
