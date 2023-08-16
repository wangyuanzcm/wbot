// 校验以太坊钱包地址
export const is_valid_eth_address(address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // Address is not in valid format
        return false;
    } else if (!/^0x[0-9a-f]*$/i.test(address)) {
        // Address contains invalid characters
        return false;
    } else {
        // Address is in valid format, check checksum
        const addressHash = web3.utils.sha3(address.toLowerCase());
        for (let i = 0; i < 40; i++) {
            // Check each character of the address and the corresponding character of the hash
            if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i])
                || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
                // Character case does not match checksum
                return false;
            }
        }
        return true;
    }
}