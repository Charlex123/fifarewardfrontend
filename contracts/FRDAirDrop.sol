// SPDX-License-Identifier: MIT

pragma solidity^0.8.9;

/*
  8888888888   88888888       888888888
  8888888888   8888 88888     88888888888
  8888         8888   8888    8888   88888
  8888         8888 88888     8888    88888
  8888888888   8888888        8888    88888
  8888888888   8888888        8888    88888
  8888         8888 8888      8888   88888
  8888         8888   8888    88888888888
  8888         8888    8888   888888888
*/

import "hardhat/console.sol";

interface IBEP20 {
    function transfer(address _to, uint256 _value) external returns (bool);
}

contract FRDAirDrop {
    error Unauthorized();
    error DuplicateAirDropUserNotAllowed();

    uint256 private _airdropIds;
    address admin;
    uint timeNow = block.timestamp;

    constructor() {
        admin = msg.sender; 
    } 

    struct AirDropUsers {
        uint airdropId;
        address walletaddress;
    }

    mapping(address => uint256) private _balanceOf;
    mapping(address => AirDropUsers) private airdropDetails;
    mapping(uint256 => AirDropUsers) private airdropDetailsById;

    event AddAirDropUser(uint indexed airdropId, address walletaddress);
    
    function checkDuplicateBet() internal view returns(bool) {
        if(airdropDetails[msg.sender].walletaddress == msg.sender) {
                return true;
        }
        return false;
    }

    function addAirDropUser() external {
        if(msg.sender == address(0))
            revert Unauthorized();
        if(airdropDetails[msg.sender].walletaddress == msg.sender) 
            revert DuplicateAirDropUserNotAllowed();
        
        
        // user is not registered, register user and add address to User struct and proceed with staking
        _airdropIds += 1;
        uint _airdropId = _airdropIds;
        airdropDetailsById[_airdropId] = AirDropUsers({
            airdropId:_airdropId,
            walletaddress: msg.sender
        });
        airdropDetails[msg.sender].walletaddress = msg.sender;
        emit AddAirDropUser(_airdropId, msg.sender);
            
        
    }
    
    function GetAllAirDroppers() external view returns (AirDropUsers[] memory) {
        uint airdroppersCount = _airdropIds;
        uint currentIndex = 0;

        AirDropUsers[] memory airdropusers = new AirDropUsers[](airdroppersCount);
        for (uint i = 0; i <airdroppersCount; i++) {
            uint currentId = i + 1;
            AirDropUsers storage currentairdropUser = airdropDetailsById[currentId];
            airdropusers[currentIndex] = currentairdropUser;
            currentIndex += 1;
        }
        return airdropusers;
    }

    function getAirDropUsersCount() external view returns (uint) {
        return _airdropIds;
    }

}