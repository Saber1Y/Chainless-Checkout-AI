// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract AccessPassNFT is ERC721, ERC721URIStorage, AccessControl {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  uint256 private _nextTokenId;
  string private _baseTokenURI;

  struct PassMetadata {
    uint256 passType;
    string productId;
    uint256 mintedAt;
    bool active;
  }

  mapping(uint256 => PassMetadata) public passMetadata;
  mapping(address => uint256[]) public userPasses;
  mapping(address => mapping(uint256 => bool)) public hasPassType;

  event PassMinted(
    uint256 indexed tokenId,
    address indexed recipient,
    uint256 passType,
    string productId,
    string metadataURI
  );

  event PassDeactivated(uint256 indexed tokenId);
  event BaseURIUpdated(string newBaseURI);

  constructor(
    address defaultAdmin,
    address minter,
    string memory baseURI
  ) ERC721("Chainless Access Pass", "CAP") {
    _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    _grantRole(MINTER_ROLE, minter);
    _baseTokenURI = baseURI;
  }

  function mintPass(
    address to,
    uint256 passType,
    string memory metadataURI
  ) external onlyRole(MINTER_ROLE) returns (uint256) {
    require(to != address(0), "Invalid recipient");
    require(passType > 0, "Invalid pass type");

    _nextTokenId++;
    uint256 tokenId = _nextTokenId;

    _safeMint(to, tokenId);
    _setTokenURI(tokenId, metadataURI);

    passMetadata[tokenId] = PassMetadata({
      passType: passType,
      productId: "",
      mintedAt: block.timestamp,
      active: true
    });

    userPasses[to].push(tokenId);
    hasPassType[to][passType] = true;

    emit PassMinted(tokenId, to, passType, "", metadataURI);

    return tokenId;
  }

  function mintPassWithProduct(
    address to,
    uint256 passType,
    string memory productId,
    string memory metadataURI
  ) external onlyRole(MINTER_ROLE) returns (uint256) {
    require(to != address(0), "Invalid recipient");
    require(passType > 0, "Invalid pass type");
    require(bytes(productId).length > 0, "Invalid productId");

    _nextTokenId++;
    uint256 tokenId = _nextTokenId;

    _safeMint(to, tokenId);
    _setTokenURI(tokenId, metadataURI);

    passMetadata[tokenId] = PassMetadata({
      passType: passType,
      productId: productId,
      mintedAt: block.timestamp,
      active: true
    });

    userPasses[to].push(tokenId);
    hasPassType[to][passType] = true;

    emit PassMinted(tokenId, to, passType, productId, metadataURI);

    return tokenId;
  }

  function hasAccess(address user, uint256 passType) external view returns (bool) {
    return hasPassType[user][passType];
  }

  function getUserPasses(
    address user
  ) external view returns (uint256[] memory) {
    return userPasses[user];
  }

  function getUserPassCount(address user) external view returns (uint256) {
    return userPasses[user].length;
  }

  function deactivatePass(uint256 tokenId) external onlyRole(MINTER_ROLE) {
    require(_ownerOf(tokenId) != address(0), "Token does not exist");
    passMetadata[tokenId].active = false;
    emit PassDeactivated(tokenId);
  }

  function setBaseURI(string memory newBaseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _baseTokenURI = newBaseURI;
    emit BaseURIUpdated(newBaseURI);
  }

  function _baseURI() internal view override returns (string memory) {
    return _baseTokenURI;
  }

  function tokenURI(
    uint256 tokenId
  )
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(
    bytes4 interfaceId
  )
    public
    view
    override(ERC721, ERC721URIStorage, AccessControl)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function totalSupply() external view returns (uint256) {
    return _nextTokenId;
  }
}
