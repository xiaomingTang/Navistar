import abi from '../abi/abi.json'

import { getMBTIIndex } from '@/app/components/MessageItem'
import { decodeTagArray } from '@/app/components/TagItem'
import { toError } from '@/errors/utils'

import { ethers } from 'ethers'
import { Alchemy, AssetTransfersCategory, Network } from 'alchemy-sdk'

import type { Tag } from '@/app/components/constants'
import type { ContractContext } from '../abi/abi.d'

const AlchemyConfig = {
  apiKey: 'wnGRa0iHts7X-8RrTxzc18tKvy4QcZtU',
  network: Network.MATIC_MAINNET,
}

const CONTRACT_ADDRESS = '0xE3D239c6A8A65d7e3409a82De29EdDB460439cf3'

const metamaskProvider =
  typeof window === 'undefined' || !window.ethereum
    ? null
    : new ethers.BrowserProvider(window.ethereum)

function getMetamask() {
  if (!metamaskProvider || !window.ethereum) {
    throw new Error('Metamask not exists.')
  }
  return {
    provider: metamaskProvider,
    ethereum: window.ethereum,
  }
}

async function switchNetwork() {
  const { request } = window.ethereum ?? {}
  if (!request) {
    throw new Error('Metamask is required.')
  }
  try {
    await request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: `0x${(137).toString(16)}`,
        },
      ],
    })
  } catch (err) {
    // 4902: chainNotAdded
    if (toError(err).code === 4902) {
      await request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${(137).toString(16)}`,
          },
        ],
      })
    } else {
      throw err
    }
  }
}

export async function getWalletAddress() {
  const { provider } = getMetamask()
  let [account] = await provider.send('eth_accounts', [])
  if (!account) {
    ;[account] = await provider.send('eth_requestAccounts', [])
  }
  await switchNetwork()
  return account ? ethers.getAddress(account) : ''
}

export async function getWalletStatus() {
  const wallet = await getWalletAddress()
  const alchemy = new Alchemy(AlchemyConfig)
  const balance = await alchemy.core.getBalance(wallet, 'latest')
  const { transfers } = await alchemy.core.getAssetTransfers({
    fromBlock: '0x0',
    fromAddress: wallet,
    category: [
      AssetTransfersCategory.EXTERNAL,
      AssetTransfersCategory.INTERNAL,
      AssetTransfersCategory.ERC20,
      AssetTransfersCategory.ERC721,
      AssetTransfersCategory.ERC1155,
    ],
  })
  return {
    isActive: transfers.length > 5,
    isRich: balance.gt(ethers.parseUnits('0.03')),
    transfers,
    balance,
  }
}

export async function getContractSigner() {
  await switchNetwork()
  const { provider } = getMetamask()
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    abi,
    provider
  ) as unknown as ContractContext
  const contractSigner = contract.connect(await provider.getSigner())
  return contractSigner
}

export async function claimDID(
  tags: Tag[],
  walletStatus: Awaited<ReturnType<typeof getWalletStatus>>
) {
  const signer = await getContractSigner()
  // const { provider } = getMetamask()
  // const gas = await provider.estimateGas({
  //   from: await getWalletAddress(),
  // })
  // const gasLimit = ethers.toNumber(gas) * 1.2
  await signer.claimDID(
    [
      walletStatus.isRich ? 1 : 0,
      walletStatus.isActive ? 1 : 0,
      getMBTIIndex(tags[tags.length - 1]?.content),
    ],
    {
      // 暂时写死
      gasLimit: 1800000,
    }
  )
}

export async function getAllUserData() {
  const signer = await getContractSigner()
  const alchemy = new Alchemy(AlchemyConfig)
  const { owners } = await alchemy.nft.getOwnersForContract(CONTRACT_ADDRESS)
  // 返回的是 BigNumber, 需要转回 Number
  const allUserTags = (await signer.getTagsByPage(owners)).map((item) =>
    item.map((i) => Number(i))
  ) as [number, number, number][]
  return owners.map((wallet, idx) => ({
    wallet,
    tags: decodeTagArray(allUserTags[idx]),
  }))
}
