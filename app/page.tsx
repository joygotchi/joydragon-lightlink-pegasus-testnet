'use client'
import React from "react";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import {Image,Link,Button} from "@nextui-org/react";
import { nftAbi , tokenAbi } from '../abi';
import { button as buttonStyles  } from "@nextui-org/theme";


import {
	usePrepareContractWrite,
	useContractWrite,
	useContractRead,
	useWaitForTransaction,
	useAccount,
	useConnect,
	useNetwork, 
	useBalance,
	useSwitchNetwork
  } from "wagmi";
  
const MAX_ALLOWANCE = BigInt('20000000000000000000000')

//https://wagmi.sh/examples/contract-write
export default function Home() {
	const { chain  } = useNetwork()
	const [isClient, setIsClient] = React.useState(true)
	const [isBlance, setIsBlance] = React.useState(false)
	const [isEthBlance, setEthBlance] = React.useState(false)
	const [isApprove, setIsApprove] = React.useState(false)
const { address} = useAccount()
const { data: allowance, refetch } = useContractRead({
    address: `0x${process.env.TOKEN_ADDRESS?.slice(2)}`,
    abi: tokenAbi,
    functionName: "allowance",
    args: [`0x${address ? address.slice(2) : ''}`, `0x${process.env.NFT_ADDRESS?.slice(2)}`],
  });

  const { config : configAllowance } = usePrepareContractWrite({
	address: `0x${process.env.TOKEN_ADDRESS?.slice(2)}`,
	abi: tokenAbi,
	functionName: "approve",
	args: [`0x${process.env.NFT_ADDRESS?.slice(2)}`, MAX_ALLOWANCE],
  });
  const { data: tokenBlanceData, isError: tokenBlanceError } = useBalance({
    address: address,
    token: `0x${process.env.TOKEN_ADDRESS?.slice(2)}`,
  });
  const { data: ethBlanceData, isError: ethBlanceError } = useBalance({
    address: address
  });
  const {
    data: approveResult,
    writeAsync: approveAsync,
    error:errorAllowance,
  } = useContractWrite(configAllowance);

  const { config : configFaucet } = usePrepareContractWrite({
	address: `0x${process.env.FAUCET_ADDRESS?.slice(2)}`,
	abi: [
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_token",
					"type": "address"
				}
			],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_to",
					"type": "address"
				}
			],
			"name": "getJoy",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "token",
			"outputs": [
				{
					"internalType": "contract IERC20",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	],
	functionName: "getJoy",
	args: [address],
	});
  
	const {
	  data: faucetData,
	  writeAsync: setFaucetAsync,
	  error:errorFaucet,
	} = useContractWrite(configFaucet);

	const onFaucet = ()=> {
		setFaucetAsync?.();
		fetchMyAPI();
		};
  
  const { isLoading : isLoadingApprove} = useWaitForTransaction({
	hash: approveResult?.hash,
		onSuccess(data) {
			fetchMyAPI();
		}
  })
	
	const {
		config,
		error: prepareError,
		isError: isPrepareError,
	  } = usePrepareContractWrite({
		address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
		abi: nftAbi,
		functionName: 'mint',
	  })
	  const { data, error, isError, writeAsync : mint } = useContractWrite(config)
	 
	  const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash,
		onSuccess(data) {
			fetchMyAPI();
		}
	  })
	  


	  const { chains , error : errorSwitchNetwork, isLoading : loadingSwingNetwork, pendingChainId, switchNetwork } =
		useSwitchNetwork({
			onMutate(args) {
				console.log('Mutate', args)
			  },
			onSettled(data, error) {
				console.log('Settled', { data, error })
				fetchMyAPI();
			},
			onSuccess(data) {
				console.log('sucess', { data })
				fetchMyAPI();
			  }
		  })
		  const fetchMyAPI = async() => {
			if(allowance){
				console.log("allowance",allowance)
				if(allowance >= BigInt(20000)){
					setIsApprove(true)
				}
			}
			if(Number(tokenBlanceData?.formatted) > 0){
				console.log("balance",tokenBlanceData)
				setIsBlance(true)
			}
			console.log("ethbalance",ethBlanceData)
			if(Number(ethBlanceData?.formatted) > 0.001){
				console.log("balance",tokenBlanceData)
				setEthBlance(true)
			}
			if(chain?.id == process.env.CHAIN_ID){
			setIsClient(true);
			}
		}
		React.useEffect(() => {
			fetchMyAPI();

		},[allowance,tokenBlanceData])
	return (
		<section className="h-full max-w-lg  mx-auto font-medium bg-slate-50 px-8 bg-no-repeat bg-container bg-gray-500 bg-center" style={{backgroundImage: "url(/Assets/landing.png)"}}>
 
      <div>{errorSwitchNetwork && errorSwitchNetwork.message}</div>
			<div className="inline-block max-w-lg text-center justify-center">
	
				
			</div>

{isClient ? (
(!isApprove) ? (
	(isBlance) ? (
		<div className="pb-5" style={{paddingTop:"130%"}}>
		<button type="button"   onClick={approveAsync} className="nes-btn bg-white w-full" >
Approval
</button>
</div>
	) : (
		<div className="pb-5" style={{paddingTop:"130%"}}>
		<button type="button"   onClick={onFaucet} className="nes-btn bg-white w-full" >
Faucet $JGT Token
</button>
</div>
	)
   ):(
	(isBlance && isEthBlance) ? (
<>
<div className="pb-5"  style={{paddingTop:"130%"}}>
<button type="button" style={{backgroundImage: "url(/Assets/press_to_mint.gif)"}} className=" bg-no-repeat bg-center w-full h-16 " onClick={mint}> </button>
	
</div>

</>
	) :(
		(!isBlance) ? (
			<div className="pb-5" style={{paddingTop:"130%"}}>
			<button type="button"   onClick={onFaucet} className="nes-btn bg-white w-full" >
	Faucet $JGT Token
	</button>
	</div>
		) :(

			<div className="pb-5" style={{paddingTop:"130%"}}>
					<Button
      href={process.env.URL_FAUCET as string}
      as={Link}
	  className="w-full"
      color="primary"
      showAnchorIcon
      variant="solid"
    >
      Faucet ${process.env.TOKEN as string} Testnet
    </Button>
	</div>
		)

	)


   )

) : (
	<>
	<button
          key={process.env.CHAIN_ID}
          onClick={() => switchNetwork?.(process.env.CHAIN_ID as unknown as number )}
		  className="nes-btn w-52"
        >
       switch to {process.env.CHAIN_NAME} Testnet 
         {loadingSwingNetwork && pendingChainId === process.env.CHAIN_ID && '(switching)'} 
        </button>
		<div><span className="text-red-400">{errorSwitchNetwork && errorSwitchNetwork.message}</span></div>
		</>
)
        
}

			
{isSuccess && (
        <div>
          Successfully minted your NFT!
          <div>
            <a className="text-green-400" href={`${process.env.EXPLORER_URL}/tx/${data?.hash}`}>Scan Tx</a>
          </div>
        </div>
      )}
      {/* {(isPrepareError || isError) && (
        <div><span className="text-red-400">Error: {(prepareError || error)?.message}</span></div>
      )}
	        {(isError) && (
        <div><span className="text-red-400">Error: {error?.message}</span></div>
      )} */}
			<div className="flex gap-3">
	

				
				
			</div>

	
		</section>
	);
}
