// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @dev Minimal interface for ERC20
 */
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function decimals() external view returns (uint8);
}

/**
 * @dev Minimal interface for WETH
 */
interface IWETH is IERC20 {
    function deposit() external payable;
    function withdraw(uint256) external;
}

/**
 * @dev Minimal interface for Uniswap V3 SwapRouter / Aggregator
 */
interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
}

/**
 * @dev Minimal interface for Relay Protocol Bridge
 */
interface IRelayReceiver {
    function deposit(
        address token,
        uint256 amount,
        uint256 toChainId,
        address recipient,
        bytes calldata data
    ) external payable returns (bytes32 depositId);
}

/**
 * @title DustZapRouter
 * @notice Batches multiple dust ERC-20 token swaps into a single asset (ETH/USDC) and bridges directly to Base
 * @dev Optimized for Layer 2s (Arbitrum, Optimism, Polygon, Ethereum) with Base destination (Chain ID: 8453)
 */
contract DustZapRouter {
    address public immutable owner;
    address public immutable weth;
    uint256 public constant BASE_CHAIN_ID = 8453;
    
    // Fee in basis points (e.g. 50 = 0.5%). Default: 0% or configurable
    uint256 public protocolFeeBps = 0; // 0% default for maximum user benefit
    address public feeRecipient;

    event DustZapExecuted(
        address indexed user,
        address indexed recipient,
        uint256 tokensCount,
        uint256 totalOutputAmount,
        address outputToken,
        uint256 targetChainId
    );

    event FeeUpdated(uint256 newFeeBps, address newFeeRecipient);

    modifier onlyOwner() {
        require(msg.sender == owner, "DustZap: caller is not owner");
        _;
    }

    constructor(address _weth, address _feeRecipient) {
        owner = msg.sender;
        weth = _weth;
        feeRecipient = _feeRecipient == address(0) ? msg.sender : _feeRecipient;
    }

    struct SwapItem {
        address tokenIn;
        uint256 amountIn;
        address router; // DEX aggregator or Uniswap router
        bytes swapCallData; // Calldata for DEX execution
        uint256 minAmountOut;
    }

    /**
     * @notice Sweeps multiple tokens, swaps them via specified DEX routes, and bridges the consolidated balance to Base
     * @param swaps Array of token swap configurations
     * @param outputToken The token to consolidate into (e.g. USDC or address(0) for native ETH)
     * @param bridgeReceiver Address of Relay / Across bridge deposit contract
     * @param bridgeCallData Calldata for triggering the bridge deposit to Base
     * @param recipient Recipient address on Base
     */
    function zapAndBridge(
        SwapItem[] calldata swaps,
        address outputToken,
        address bridgeReceiver,
        bytes calldata bridgeCallData,
        address recipient
    ) external payable returns (uint256 totalOutput) {
        require(swaps.length > 0 || msg.value > 0, "DustZap: no tokens provided");
        require(recipient != address(0), "DustZap: invalid recipient");

        uint256 balanceBefore;
        if (outputToken == address(0)) {
            balanceBefore = address(this).balance - msg.value;
        } else {
            balanceBefore = IERC20(outputToken).balanceOf(address(this));
        }

        // Execute batch swaps
        for (uint256 i = 0; i < swaps.length; i++) {
            SwapItem calldata item = swaps[i];
            if (item.amountIn == 0 || item.tokenIn == address(0)) continue;

            // Pull token from user
            IERC20(item.tokenIn).transferFrom(msg.sender, address(this), item.amountIn);

            // Approve router if needed
            IERC20(item.tokenIn).approve(item.router, 0);
            IERC20(item.tokenIn).approve(item.router, item.amountIn);

            // Execute swap
            (bool success, ) = item.router.call(item.swapCallData);
            require(success, "DustZap: swap execution failed");
        }

        uint256 balanceAfter;
        if (outputToken == address(0)) {
            balanceAfter = address(this).balance;
        } else {
            balanceAfter = IERC20(outputToken).balanceOf(address(this));
        }

        totalOutput = balanceAfter - balanceBefore;
        require(totalOutput > 0, "DustZap: zero output amount");

        // Deduct protocol fee if configured
        uint256 amountToBridge = totalOutput;
        if (protocolFeeBps > 0 && feeRecipient != address(0)) {
            uint256 fee = (totalOutput * protocolFeeBps) / 10000;
            if (fee > 0) {
                amountToBridge = totalOutput - fee;
                if (outputToken == address(0)) {
                    payable(feeRecipient).transfer(fee);
                } else {
                    IERC20(outputToken).transfer(feeRecipient, fee);
                }
            }
        }

        // Execute Bridge to Base
        if (bridgeReceiver != address(0) && bridgeCallData.length > 0) {
            if (outputToken == address(0)) {
                (bool bridgeSuccess, ) = bridgeReceiver.call{value: amountToBridge}(bridgeCallData);
                require(bridgeSuccess, "DustZap: bridge execution failed");
            } else {
                IERC20(outputToken).approve(bridgeReceiver, amountToBridge);
                (bool bridgeSuccess, ) = bridgeReceiver.call(bridgeCallData);
                require(bridgeSuccess, "DustZap: bridge execution failed");
            }
        } else {
            // If direct transfer / no bridge provided, transfer directly to recipient
            if (outputToken == address(0)) {
                payable(recipient).transfer(amountToBridge);
            } else {
                IERC20(outputToken).transfer(recipient, amountToBridge);
            }
        }

        emit DustZapExecuted(msg.sender, recipient, swaps.length, totalOutput, outputToken, BASE_CHAIN_ID);
    }

    /**
     * @notice Sets protocol fee
     */
    function setProtocolFee(uint256 _newFeeBps, address _newRecipient) external onlyOwner {
        require(_newFeeBps <= 200, "DustZap: fee too high (max 2%)");
        protocolFeeBps = _newFeeBps;
        if (_newRecipient != address(0)) {
            feeRecipient = _newRecipient;
        }
        emit FeeUpdated(_newFeeBps, feeRecipient);
    }

    /**
     * @notice Emergency rescue function in case tokens get stuck
     */
    function rescueTokens(address token, uint256 amount, address to) external onlyOwner {
        if (token == address(0)) {
            payable(to).transfer(amount);
        } else {
            IERC20(token).transfer(to, amount);
        }
    }

    receive() external payable {}
}
