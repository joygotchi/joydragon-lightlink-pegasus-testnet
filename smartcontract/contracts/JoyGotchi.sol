// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;

import {SafeTransferLib} from "solmate/src/utils/SafeTransferLib.sol";

import {Owned} from "solmate/src/auth/Owned.sol";
import {ERC721} from "solmate/src/tokens/ERC721.sol";
import {FixedPointMathLib} from "solmate/src/utils/FixedPointMathLib.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {IGameManager} from "./interfaces/IGameManager.sol";
import {IModeFeeSharing} from "./interfaces/IModeFeeSharing.sol";

interface IToken {
    function balanceOf(
        address tokenOwner
    ) external view returns (uint256 balance);

    function totalSupply() external view returns (uint256 supply);

    function transfer(
        address to,
        uint256 tokens
    ) external returns (bool success);

    function transferFrom(
        address from,
        address to,
        uint256 tokens
    ) external returns (bool success);

    function burnFrom(address account, uint256 amount) external;
}

interface FeeSharingNFT{
    function register(address _recipient) external returns (uint256);
}

// ERC721,
contract JoyGotchi is Owned, ERC721 {
    using SafeTransferLib for address payable;
    using FixedPointMathLib for uint256;
    using SafeMath for uint256;

    // dutch auction
    uint private constant DURATION = 10 minutes;
    uint public startingPrice;
    uint public startAt;
    uint public discountRate;

    enum Status {
        HAPPY,
        HUNGRY,
        STARVING,
        DYING,
        DEAD
    }

    uint256 PRECISION = 1 ether;

    IToken public token;

    uint256 public _tokenIds;
    uint256 public _itemIds;

    uint256 public la = 2;
    uint256 public lb = 2;

    // pet properties
    mapping(uint256 => string) public petName;
    mapping(uint256 => uint256) public timeUntilStarving;
    mapping(uint256 => uint256) public petScore;
    mapping(uint256 => uint256) public timePetBorn;
    mapping(uint256 => uint256) public lastAttackUsed;
    mapping(uint256 => uint256) public lastAttacked;
    mapping(uint256 => uint256) public stars;

    // vritual staking
    mapping(uint256 => uint256) public ethOwed;
    mapping(uint256 => uint256) public petRewardDebt;

    uint256 public ethAccPerShare;

    uint256 public totalScores = 0;

    // items/benefits for the pet, general so can be food or anything in the future.
    mapping(uint256 => uint256) public itemPrice;
    mapping(uint256 => uint256) public itemPoints;
    mapping(uint256 => string) public itemName;
    mapping(uint256 => uint256) public itemTimeExtension;

    uint256 public hasTheDiamond;

    IGameManager public gameManager; //way to expand the game mechanics.

    /*//////////////////////////////////////////////////////////////
                             Events
    //////////////////////////////////////////////////////////////*/

    event ItemConsumed(uint256 nftId, address giver, uint256 itemId);
    event PetKilled(
        uint256 nftId,
        uint256 deadId,
        string loserName,
        uint256 reward,
        address killer,
        string winnerName
    );
    event ItemCreated(uint256 id, string name, uint256 price, uint256 points);
    event Attack(
        uint256 attacker,
        uint256 winner,
        uint256 loser,
        uint256 scoresWon
    );
    event RedeemRewards(uint256 indexed petId, uint256 reward);

    event Pass(uint256 from, uint256 to);

    constructor(
        address _token
    ) Owned(msg.sender) ERC721("Joy Gotchi", "Joy Gotchi") {
        token = IToken(_token);

        startingPrice = 2_000 ether;
        startAt = block.timestamp;
        discountRate = 1900 ether / DURATION;
    }

    modifier isApproved(uint256 id) {
        require(
            ownerOf(id) == msg.sender || getApproved[id] == msg.sender,
            "Not approved"
        );

        _;
    }

    function getPrice() public view returns (uint256) {
        uint256 timeElapsed = block.timestamp - startAt;
        if (timeElapsed >= 10 minutes) {
            return 100 ether;
        } else {
            uint256 discount = discountRate * timeElapsed;
            return startingPrice - discount;
        }
    }

    /*//////////////////////////////////////////////////////////////
                        Game Actions
    //////////////////////////////////////////////////////////////*/

    function mint() public {
        require(_tokenIds < 20_000, "Over the limit");

        uint256 price = getPrice();

        startAt = block.timestamp;

        token.burnFrom(msg.sender, price);

        timeUntilStarving[_tokenIds] = block.timestamp + 1 days;
        timePetBorn[_tokenIds] = block.timestamp;

        // mint NFT
        _mint(msg.sender, _tokenIds);
        _tokenIds++;
    }

    function buyAccessory(
        uint256 nftId,
        uint256 itemId
    ) external payable isApproved(nftId) {
        require(itemExists(itemId), "This item doesn't exist");
        require(isPetAlive(nftId), "pet dead"); //no revives

        bool shouldContinue = gameManager.onBuyAccessory(nftId, itemId);

        if (!shouldContinue) return;

        uint256 amount = itemPrice[itemId];

        // recalculate time until starving
        timeUntilStarving[nftId] = block.timestamp + itemTimeExtension[itemId];


        if (petScore[nftId] > 0) {
            ethOwed[nftId] = pendingEth(nftId);
        }

        if (!isPetAlive(nftId)) {
            petScore[nftId] = itemPoints[itemId];
        } else {
            petScore[nftId] += itemPoints[itemId];
        }

        petRewardDebt[nftId] = petScore[nftId].mulDivDown(
            ethAccPerShare,
            PRECISION
        );

        totalScores += itemPoints[itemId];

        token.burnFrom(msg.sender, amount);

        emit ItemConsumed(nftId, msg.sender, itemId);
    }

    function attack(uint256 fromId, uint256 toId) external isApproved(fromId) {
        require(fromId != toId, "Can't hurt yourself");

        (uint256 pct, uint256 odds, bool canAttack) = gameManager.onAttack(
            fromId,
            toId
        );

        if (!canAttack) {
            return;
        }

        lastAttackUsed[fromId] = block.timestamp;
        lastAttacked[toId] = block.timestamp;

        uint256 loser;
        uint256 winner;

        uint256 _random = random(fromId + toId);

        if (_random > odds) {
            loser = fromId;
            winner = toId;
        } else {
            loser = toId;
            winner = fromId;
        }

        uint256 feePercentage = PRECISION.mulDivDown(pct, 1000); // 0.5 pct
        uint256 prizeScore = petScore[loser].mulDivDown(
            feePercentage,
            PRECISION
        );

        uint256 prizeDebt = petRewardDebt[loser].mulDivDown(
            feePercentage,
            PRECISION
        );

        petScore[loser] -= prizeScore;
        petRewardDebt[loser] -= prizeDebt;

        petScore[winner] += prizeScore;
        petRewardDebt[winner] += prizeDebt;

        emit Attack(fromId, winner, loser, prizeScore);
    }

    // kill and burn pets and get in game stars.
    function kill(
        uint256 _deadId,
        uint256 _tokenId
    ) external isApproved(_tokenId) {
        require(
            !isPetAlive(_deadId),
            "The pet has to be starved to claim his points"
        );

        if (hasTheDiamond == _deadId) {
            hasTheDiamond = _tokenId;
        }

        address ownerOfDead = ownerOf(_deadId);

        _burn(_deadId);
        stars[_tokenId] += 1;
        // redeem for dead pet
        _redeem(_deadId, ownerOfDead);

        emit PetKilled(
            _tokenId,
            _deadId,
            petName[_deadId],
            1,
            msg.sender,
            petName[_tokenId]
        );
    }

    function setPetName(
        uint256 _id,
        string memory _name
    ) external isApproved(_id) {
        petName[_id] = _name;
    }

    // just side quest for later to add to ui, one thing in the game that can be passed to other players
    function pass(uint256 from, uint256 to) external isApproved(from) {
        require(hasTheDiamond == from, "you don't have it");
        require(ownerOf(to) != address(0x0), "don't burn it");

        hasTheDiamond = to;

        emit Pass(from, to);
    }

    /*//////////////////////////////////////////////////////////////
                        Game Getters
    //////////////////////////////////////////////////////////////*/

    function getStatus(uint256 pet) public view returns (Status _health) {
        if (!isPetAlive(pet)) {
            return Status.DEAD;
        }

        if (timeUntilStarving[pet] > block.timestamp + 16 hours)
            return Status.HAPPY;
        if (
            timeUntilStarving[pet] > block.timestamp + 12 hours &&
            timeUntilStarving[pet] < block.timestamp + 16 hours
        ) return Status.HUNGRY;

        if (
            timeUntilStarving[pet] > block.timestamp + 8 hours &&
            timeUntilStarving[pet] < block.timestamp + 12 hours
        ) return Status.STARVING;

        if (timeUntilStarving[pet] < block.timestamp + 8 hours)
            return Status.DYING;
    }

    function itemExists(uint256 itemId) public view returns (bool) {
        if (bytes(itemName[itemId]).length > 0) {
            return true;
        } else {
            return false;
        }
    }

    // check that Pet didn't starve
    function isPetAlive(uint256 _nftId) public view returns (bool) {
        uint256 _timeUntilStarving = timeUntilStarving[_nftId];
        if (_timeUntilStarving != 0 && _timeUntilStarving >= block.timestamp) {
            return true;
        } else {
            return false;
        }
    }

    function getItemInfo(
        uint256 _itemId
    )
        public
        view
        returns (
            string memory _name,
            uint256 _price,
            uint256 _points,
            uint256 _timeExtension
        )
    {
        _name = itemName[_itemId];
        _price = itemPrice[_itemId];
        _timeExtension = itemTimeExtension[_itemId];
        _points = itemPoints[_itemId];
    }

    function getPetInfo(
        uint256 _nftId
    )
        public
        view
        returns (
            string memory _name,
            Status _status,
            uint256 _score,
            uint256 _level,
            uint256 _timeUntilStarving,
            uint256 _lastAttacked,
            uint256 _lastAttackUsed,
            address _owner,
            uint256 _rewards
        )
    {
        _name = petName[_nftId];
        _status = getStatus(_nftId);
        _score = petScore[_nftId];
        _level = level(_nftId);
        _timeUntilStarving = timeUntilStarving[_nftId];
        _lastAttacked = lastAttacked[_nftId];
        _lastAttackUsed = lastAttackUsed[_nftId];
        _owner = !isPetAlive(_nftId) && _score == 0
            ? address(0x0)
            : ownerOf(_nftId);
        _rewards = pendingEth(_nftId);
    }

    /*//////////////////////////////////////////////////////////////
                        Metadata
    //////////////////////////////////////////////////////////////*/

    function tokenURI(uint256 id) public view override returns (string memory) {
        // uint256 a = id;
        string memory image = _baseImgUrl();
        string memory attributes = string(
            abi.encodePacked('", "attributes":[', _generateMetadata(id), "]}")
        );
        return
            string(
                abi.encodePacked(
                    "data:application/json;utf8,",
                    (
                        (
                            abi.encodePacked(
                                '{"name":"Joy Gotchi #',
                                _uint2str(id),
                                '","image": ',
                                '"',
                                image,
                                attributes
                            )
                        )
                    )
                )
            );
    }

    function _baseImgUrl() public pure returns (string memory) {
        return
            "https://bafkreiaphqcazr47nn77sr6v3nmnxkkgpndwjn7hwaksr4utc6tzz3ffse.ipfs.nftstorage.link/";
    }

    function _generateMetadata(
        uint256 id
    ) internal view returns (string memory) {
        uint256 _score = petScore[id];
        uint256 _level = level(id);
        Status status = getStatus(id);

        string memory metadata = string(
            abi.encodePacked(
                '{"trait_type": "Score","value":"',
                _uint2str(_score),
                '"},{"trait_type": "Level","value":"',
                _uint2str(_level),
                '"},{"trait_type": "Status","value":"',
                _uint2str(uint256(status)),
                '"},{"trait_type": "Stars","value":"',
                _uint2str(stars[id]),
                '"}'
            )
        );
        return metadata;
    }


    // calculate level based on points
    function level(uint256 tokenId) public view returns (uint256) {
        // This is the formula L(x) = 2 * sqrt(x * 2)

        uint256 _score = petScore[tokenId] / 1e12;
        _score = _score / 100;
        if (_score == 0) {
            return 1;
        }
        uint256 _level = _sqrtu(_score * la);
        return (_level * lb);
    }

    /*//////////////////////////////////////////////////////////////
                         Virtual Staking Logic
    //////////////////////////////////////////////////////////////*/

    function pendingEth(uint256 petId) public view returns (uint256) {
        uint256 _ethAccPerShare = ethAccPerShare;

        //petRewardDebt can sometimes be bigger by 1 wei do to several mulDivDowns so we do extra checks
        if (
            petScore[petId].mulDivDown(_ethAccPerShare, PRECISION) <
            petRewardDebt[petId]
        ) {
            return ethOwed[petId];
        } else {
            return
                (petScore[petId].mulDivDown(_ethAccPerShare, PRECISION))
                    .sub(petRewardDebt[petId])
                    .add(ethOwed[petId]);
        }
    }

    function _redeem(uint256 petId, address _to) internal {
        uint256 pending = pendingEth(petId);

        totalScores -= petScore[petId];
        petScore[petId] = 0;
        ethOwed[petId] = 0;
        petRewardDebt[petId] = 0;

        payable(_to).safeTransferETH(pending);

        emit RedeemRewards(petId, pending);
    }

    function redeem(uint256 petId) public isApproved(petId) {
        _redeem(petId, ownerOf(petId));
    }

    /*//////////////////////////////////////////////////////////////
                        Admin Functions
    //////////////////////////////////////////////////////////////*/

    function setGameManager(IGameManager _gameManager) external onlyOwner {
        gameManager = _gameManager;
    }

    // add items/accessories
    function createItem(
        string calldata name,
        uint256 price,
        uint256 points,
        uint256 timeExtension
    ) external onlyOwner {
        uint256 newItemId = _itemIds;
        itemName[newItemId] = name;
        itemPrice[newItemId] = price;
        itemPoints[newItemId] = points;
        itemTimeExtension[newItemId] = timeExtension;

        _itemIds++;

        emit ItemCreated(newItemId, name, price, points);
    }

    function editItem(
        uint256 _id,
        uint256 _price,
        uint256 _points,
        string calldata _name,
        uint256 _timeExtension
    ) external onlyOwner {
        itemPrice[_id] = _price;
        itemPoints[_id] = _points;
        itemName[_id] = _name;
        itemTimeExtension[_id] = _timeExtension;
    }

    /**
     * Calculate sqrt (x) rounding down, where x is unsigned 256-bit integer
     * number.
     *
     * @param x unsigned 256-bit integer number
     * @return unsigned 128-bit integer number
     */
    function _sqrtu(uint256 x) private pure returns (uint128) {
        if (x == 0) return 0;
        else {
            uint256 xx = x;
            uint256 r = 1;
            if (xx >= 0x100000000000000000000000000000000) {
                xx >>= 128;
                r <<= 64;
            }
            if (xx >= 0x10000000000000000) {
                xx >>= 64;
                r <<= 32;
            }
            if (xx >= 0x100000000) {
                xx >>= 32;
                r <<= 16;
            }
            if (xx >= 0x10000) {
                xx >>= 16;
                r <<= 8;
            }
            if (xx >= 0x100) {
                xx >>= 8;
                r <<= 4;
            }
            if (xx >= 0x10) {
                xx >>= 4;
                r <<= 2;
            }
            if (xx >= 0x8) {
                r <<= 1;
            }
            r = (r + x / r) >> 1;
            r = (r + x / r) >> 1;
            r = (r + x / r) >> 1;
            r = (r + x / r) >> 1;
            r = (r + x / r) >> 1;
            r = (r + x / r) >> 1;
            r = (r + x / r) >> 1; // Seven iterations should be enough
            uint256 r1 = x / r;
            return uint128(r < r1 ? r : r1);
        }
    }

    // ok for the use case, game.
    function random(uint256 seed) private view returns (uint) {
        uint hashNumber = uint(
            keccak256(
                abi.encodePacked(
                    seed,
                    block.difficulty,
                    block.timestamp,
                    msg.sender
                )
            )
        );
        return hashNumber % 100;
    }

    function _uint2str(
        uint256 _i
    ) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    receive() external payable {
        ethAccPerShare += msg.value.mulDivDown(PRECISION, totalScores);
    }

    function registerFeeSharing(IModeFeeSharing feeSharing) external onlyOwner() returns (uint256) {
        return feeSharing.register(owner);
    }
}