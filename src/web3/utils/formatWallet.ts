export function formatWallet(wallet: string) {
  if (!wallet) {
    return '-'
  }
  return `${wallet.slice(0, 5)}...${wallet.slice(-4)}`
}
