//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract Helper {

    function getMax(uint256[] memory data) public pure returns (uint256) {
        uint256 largest = 0;
        for (uint256 i = 0; i < data.length; i++) {
            if (data[i] > largest) {
                largest = data[i];
            }
        }
        return largest;
    }

    function checkIfExist(uint256[] memory data, uint256 value)
        public
        pure
        returns (bool)
    {
        for (uint256 i = 0; i < data.length; i++) {
            if (data[i] == value) {
                return true;
            }
        }
        return false;
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}
