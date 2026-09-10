// Multi-Token DEX Aggregator & Batch Swapper

/**
 * Calculates aggregate swap values and output estimates
 */
export function calculateBatchSwapQuotes({
  selectedTokens,
  targetToken = 'ETH', // 'ETH' or 'USDC'
  ethPriceUSD = 2650,
  slippagePct = 1.0
}) {
  if (!selectedTokens || selectedTokens.length === 0) {
    return {
      totalInputUSD: 0,
      totalGasUSD: 0,
      netOutputUSD: 0,
      estimatedOutputAmount: '0',
      tokensToSwapCount: 0,
      gasSavingsUSD: 0
    }
  }

  const totalInputUSD = selectedTokens.reduce((acc, t) => acc + (t.valueUSD || 0), 0)
  const totalGasUSD = selectedTokens.reduce((acc, t) => acc + (t.estimatedGasUSD || 0.015), 0)

  // Standard separate transactions gas cost vs DustZap batching
  const standardSeparateGasUSD = selectedTokens.length * 0.045 // 1 approve + 1 swap + 1 bridge each
  const batchGasUSD = 0.015 + (selectedTokens.length * 0.008) // 1 single batch tx
  const gasSavingsUSD = Math.max(0, standardSeparateGasUSD - batchGasUSD)

  // Net output after gas and slippage buffer
  const slippageFactor = (100 - slippagePct) / 100
  const netOutputUSD = Math.max(0, (totalInputUSD - batchGasUSD) * slippageFactor)

  let estimatedOutputAmount = '0'
  if (targetToken === 'ETH') {
    const ethAmount = ethPriceUSD > 0 ? netOutputUSD / ethPriceUSD : 0
    estimatedOutputAmount = ethAmount < 0.0001 ? ethAmount.toFixed(6) : ethAmount.toFixed(4)
  } else {
    // USDC
    estimatedOutputAmount = netOutputUSD.toFixed(2)
  }

  return {
    totalInputUSD,
    totalGasUSD: batchGasUSD,
    netOutputUSD,
    estimatedOutputAmount,
    tokensToSwapCount: selectedTokens.length,
    gasSavingsUSD
  }
}
