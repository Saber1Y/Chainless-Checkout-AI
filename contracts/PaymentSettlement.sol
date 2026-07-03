// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract PaymentSettlement is Ownable, ReentrancyGuard, Pausable {
  IERC20 public usdc;

  struct Payment {
    address buyer;
    string productId;
    uint256 amount;
    uint256 timestamp;
    bool settled;
  }

  mapping(bytes32 => Payment) public payments;
  mapping(address => bytes32[]) public merchantPayments;
  mapping(address => uint256) public merchantBalances;

  event PaymentSettled(
    bytes32 indexed invoiceId,
    address indexed buyer,
    address indexed merchant,
    string productId,
    uint256 amount,
    uint256 timestamp
  );

  event MerchantWithdrawn(
    address indexed merchant,
    uint256 amount,
    uint256 timestamp
  );

  event MerchantUpdated(
    address indexed oldMerchant,
    address indexed newMerchant
  );

  address public merchant;
  uint256 public totalSettled;
  uint256 public paymentCount;

  constructor(address _usdc, address _merchant) Ownable(msg.sender) {
    require(_usdc != address(0), "Invalid USDC address");
    require(_merchant != address(0), "Invalid merchant address");
    usdc = IERC20(_usdc);
    merchant = _merchant;
  }

  function receivePayment(
    address buyer,
    string calldata productId,
    uint256 amount
  ) external nonReentrant whenNotPaused returns (bytes32) {
    require(buyer != address(0), "Invalid buyer");
    require(amount > 0, "Amount must be > 0");
    require(bytes(productId).length > 0, "Invalid productId");

    bytes32 invoiceId = keccak256(
      abi.encodePacked(buyer, productId, block.timestamp)
    );

    require(!payments[invoiceId].settled, "Already settled");

    uint256 allowance = usdc.allowance(msg.sender, address(this));
    require(allowance >= amount, "Insufficient allowance");

    bool success = usdc.transferFrom(msg.sender, merchant, amount);
    require(success, "Transfer failed");

    payments[invoiceId] = Payment({
      buyer: buyer,
      productId: productId,
      amount: amount,
      timestamp: block.timestamp,
      settled: true
    });

    merchantPayments[merchant].push(invoiceId);
    merchantBalances[merchant] += amount;
    totalSettled += amount;
    paymentCount++;

    emit PaymentSettled(
      invoiceId,
      buyer,
      merchant,
      productId,
      amount,
      block.timestamp
    );

    return invoiceId;
  }

  function getPayment(bytes32 invoiceId) external view returns (Payment memory) {
    return payments[invoiceId];
  }

  function getMerchantPayments(
    address merchantAddress
  ) external view returns (bytes32[] memory) {
    return merchantPayments[merchantAddress];
  }

  function getMerchantPaymentCount(
    address merchantAddress
  ) external view returns (uint256) {
    return merchantPayments[merchantAddress].length;
  }

  function updateMerchant(address newMerchant) external onlyOwner {
    require(newMerchant != address(0), "Invalid address");
    emit MerchantUpdated(merchant, newMerchant);
    merchant = newMerchant;
  }

  function pause() external onlyOwner {
    _pause();
  }

  function unpause() external onlyOwner {
    _unpause();
  }
}
