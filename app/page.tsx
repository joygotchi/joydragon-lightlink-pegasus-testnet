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
	useSwitchNetwork
  } from "wagmi";
  
const MAX_ALLOWANCE = BigInt('20000000000000000000000')

//https://wagmi.sh/examples/contract-write
export default function Home() {
//check allowrance
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

  const {
    data: approveResult,
    writeAsync: approveAsync,
    error:errorAllowance,
  } = useContractWrite(configAllowance);

  
  const { isLoading : isLoadingApprove} = useWaitForTransaction({
	hash: approveResult?.hash,
		onSuccess(data) {
			setIsApprove(true);
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
	  const { data, error, isError, write : mint } = useContractWrite(config)
	 
	  const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash,
	  })
	  

	  const { chain  } = useNetwork()
	  const [isClient, setIsClient] = React.useState(true)
	  const [isApprove, setIsApprove] = React.useState(false)
	  const { chains , error : errorSwitchNetwork, isLoading : loadingSwingNetwork, pendingChainId, switchNetwork } =
		useSwitchNetwork({
			onMutate(args) {
				console.log('Mutate', args)
			  },
			onSettled(data, error) {
				console.log('Settled', { data, error })
				setIsClient(true);
			},
			onSuccess(data) {
				console.log('sucess', { data })
				setIsClient(true);
			  }
		  })
		React.useEffect(() => {
			
			if(allowance){
				console.log("allowance",allowance)
				if(allowance >= BigInt(20000)){
					setIsApprove(true)
				}
			}

			if(chain?.id == process.env.CHAIN_ID){
			setIsClient(true);
			}
		},[])
	return (
		<section className="h-full max-w-lg  mx-auto font-medium bg-slate-50 px-8 bg-no-repeat bg-cover" style={{backgroundImage: "url(/Assets/landing.png)"}}>
 
      <div>{errorSwitchNetwork && errorSwitchNetwork.message}</div>
			<div className="inline-block max-w-lg text-center justify-center">
	
				
			</div>

{isClient ? (
(!isApprove) ? (
	<div className="pb-5" style={{paddingTop:"130%"}}>
			<button type="button"   onClick={approveAsync} className="nes-btn bg-white w-full" >
	Approval
</button>
	</div>


   ):(
<>
<div className="pb-5"  style={{paddingTop:"130%"}}>
<button type="button" style={{backgroundImage: "url(/Assets/mint.png)"}} className=" bg-no-repeat bg-center w-full h-16 " disabled={!mint || isLoading} onClick={mint}> </button>
	
</div>

</>

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
		
			<Button
      href={process.env.URL_FAUCET as string}
      as={Link}
      color="primary"
      showAnchorIcon
      variant="solid"
    >
      Faucet ${process.env.TOKEN as string} Testnet
    </Button>
	<Button
     href="/faucet"
      as={Link}
      color="primary"
      showAnchorIcon
      variant="solid"
    >
      Faucet $Joy token
    </Button>
				
				
			</div>

	
		</section>
	);
}
