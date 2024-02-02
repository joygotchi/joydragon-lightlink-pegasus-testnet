"use client"
import React, { useState, useEffect } from 'react';
import {Card, CardBody , CardHeader , Divider , Image ,Button} from "@nextui-org/react";
import { nftAbi , tokenAbi } from '../../abi';
import { readContracts , watchAccount  } from '@wagmi/core'
import {
	usePrepareContractWrite,
	useContractWrite,
	useWaitForTransaction,
	useAccount,
  } from "wagmi";
  import { useDebounce } from './useDebounce'


export default function RewardPage() {
	const [ownPet, setOwnPet] = useState<any>(null)
const [ownPetId, setOwnPetId] = useState<any>(null)
const debouncedOwnPetId = useDebounce(ownPetId, 500)
	useEffect(() => {
		async function fetchMyAPI() {
		  let response : any= await fetch(`${process.env.EXPLORER_URL}/api/tokentx/nft/list?tokenAddress=${process.env.TOKEN_ADDRESS}`)
		  response = await response.json()

		  const pet = localStorage.getItem('pet');
		  let petId : any  = null ;
		if (pet) {
		  petId = BigInt(pet)
		  const Info : any = await readContracts({
			contracts: [
			  {
				address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
				abi: nftAbi,
				functionName: 'getPetInfo',
				args: [petId],
			  }
			],
		  })
		  setOwnPet(Info[0].result)
		  setOwnPetId(pet);
		}
	    
		}
		fetchMyAPI()
	  }, [])


	  const { config : configRedeem } = usePrepareContractWrite({
		address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
		abi: nftAbi,
		functionName: "redeem",
		args: [debouncedOwnPetId ],

		});
	  
		const {
		  data: RedeemData,
		  writeAsync: setRedeemAsync,
		  error:errorRedeem,
		} = useContractWrite(configRedeem);

		
		const { isLoading : isLoadingAttack} = useWaitForTransaction({
			hash: RedeemData?.hash,
			onSuccess(data) {
				async function fetchMyAPI() {
					
		  
					const pet = localStorage.getItem('pet');
					let petId : any  = null ;
				  if (pet) {
					petId = BigInt(pet)
					const Info : any = await readContracts({
					  contracts: [
						{
						  address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
						  abi: nftAbi,
						  functionName: 'getPetInfo',
						  args: [petId],
						}
					  ],
					})
					setOwnPet(Info[0].result)
					setOwnPetId(pet);
				  }
				  
				  }
				  fetchMyAPI()
			},
		  })
		  const onRedeem = ()=> {
			setRedeemAsync?.();
			};


	return (
		<div className="pt-20">
			
	<Card className="pt-3">
		
      <CardHeader className="flex gap-3">
	  <Image
      width={250}
      alt="joy gotchi"
      src="/gotchi/money.gif"
    />	
        <div className="flex flex-col">
          <p className="text-md">BURN PET SCORE </p>
		  <p className="text-md">{ownPet && ownPet[0]}#{ownPetId}</p>
          <p className="text-small text-default-500"> {ownPet && ownPet[2].toString()}</p>
        </div>
      </CardHeader>
      <Divider/>
      <CardBody>
		<h1>RECEIVE:{ownPet && ownPet[8].toString()} Vic</h1>
      </CardBody>
      <Divider/>
    </Card>
	<br/>
	<Button color="primary" className="w-full" onPress={onRedeem}>
      Claim
    </Button>
		</div>
	);
}
