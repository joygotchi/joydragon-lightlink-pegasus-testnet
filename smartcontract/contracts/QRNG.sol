//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract QRNG is RrpRequesterV0, Ownable {
    event RandomSeedRequested(bytes32 indexed requestId, address wallet);
    event RandomSeedReceived(bytes32 indexed requestId, uint256 response);

    address public airnode;                 // The address of the QRNG Airnode
    bytes32 public endpointIdUint256;       // The endpoint ID for requesting a single random number
    address public sponsorWallet;           // The wallet that will cover the gas costs of the request

    // wallet's random seed
    mapping(address => uint256) public walletSeed;
    mapping(address =>uint256) public walletLastSeedUpdate;
    mapping(bytes32 => address) public requestIdToWallet;
    uint256 public seedUpdateInterval = 1 hours;

    mapping(bytes32 => bool) public expectingRequestWithIdToBeFulfilled;

    constructor(address _airnodeRrp) RrpRequesterV0(_airnodeRrp) {}

    /// @notice Sets the parameters for making requests
    function setRequestParameters(
        address _airnode,
        bytes32 _endpointIdUint256,
        address _sponsorWallet
    ) external onlyOwner{
        airnode = _airnode;
        endpointIdUint256 = _endpointIdUint256;
        sponsorWallet = _sponsorWallet;
    }

    function setSeedUpdateInterval(uint256 _seedUpdateInterval) external onlyOwner {
        seedUpdateInterval = _seedUpdateInterval;
    }

    function _getWalletSeedAndUpdateIfNeeded() internal returns (uint256) {
        if (block.timestamp - walletLastSeedUpdate[msg.sender] > seedUpdateInterval) {
            _generateRandomSeedForWallet();
            walletLastSeedUpdate[msg.sender] = block.timestamp;
        }
        return walletSeed[msg.sender];
    }

    /// @notice Requests a `uint256`
    /// @dev This request will be fulfilled by the contract's sponsor wallet,
    /// which means spamming it may drain the sponsor wallet.
    function _generateRandomSeedForWallet() internal {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            endpointIdUint256,
            address(this),
            sponsorWallet,
            address(this),
            this.generateRandomSeedForWalletCallback.selector,
            ""
        );
        expectingRequestWithIdToBeFulfilled[requestId] = true;
        requestIdToWallet[requestId] = msg.sender;
        emit RandomSeedRequested(requestId,msg.sender);
    }

    /// @notice Called by the Airnode through the AirnodeRrp contract to
    /// fulfill the request
    function generateRandomSeedForWalletCallback(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(
            expectingRequestWithIdToBeFulfilled[requestId],
            "Request ID not known"
        );
        expectingRequestWithIdToBeFulfilled[requestId] = false;
        uint256 qrngUint256 = abi.decode(data, (uint256));
        walletSeed[requestIdToWallet[requestId]] = qrngUint256;
        emit RandomSeedReceived(requestId, qrngUint256);
    }

    /// @notice To withdraw funds from the sponsor wallet to the contract.
    function withdrawFromAirnodeSponsor() external onlyOwner {
        airnodeRrp.requestWithdrawal(
        airnode,
        sponsorWallet
        );
    }
}