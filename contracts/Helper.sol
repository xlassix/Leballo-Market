//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

library Helper {

    function getMax(uint[] storage self) public view returns (uint) {
        uint largest = 0;
        for (uint i = 0; i < self.length; i++) {
            if (self[i] > largest) {
                largest = self[i];
            }
        }
        return largest;
    }

    function checkIfExist(uint256[] storage self, uint256 value)
        public
        view
        returns (bool)
    {
        for (uint256 i = 0; i < self.length; i++) {
            if (self[i] == value) {
                return true;
            }
        }
        return false;
    }

}