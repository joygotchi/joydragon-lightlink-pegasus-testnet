"use client"
import { title } from "@/components/primitives";
import React, { useState, useEffect, useMemo } from 'react';
import {
	useAccount,
	useContractEvent,
  } from "wagmi";
  import {Table, TableHeader, TableColumn,Link, TableBody, TableRow, TableCell, User, Avatar, CardFooter,Button,Spinner ,Pagination} from "@nextui-org/react";
  import { readContracts , watchAccount  , writeContract ,prepareWriteContract} from '@wagmi/core'
  import {Card, CardBody , CardHeader , Divider} from "@nextui-org/react";
  import { nftAbi , tokenAbi } from '../../abi';
  import {Image} from "@nextui-org/react";
  import useSWR from "swr";
  import CountDownTimer from "./CountDownTimer";

  const fetcher = async (...args: Parameters<typeof fetch>) => {
	const res = await fetch(...args);
	return res.json();
  };

  const nftAddress= `0x${process.env.NFT_ADDRESS?.slice(2)}`;
 
  //https://github.com/ChangoMan/nextjs-ethereum-starter/blob/main/frontend/pages/index.tsx
export default function Battle() {
	
	const [listBattle, setListBattle] = useState<any>(null);
	const { address } = useAccount();
	const [page, setPage] = React.useState(0);
	const [ownPet, setOwnPet] = useState<any>(null)
	const [selectedPet, setSelectedPet] = useState<any>('')
	const [activity, setActivity] = useState<any>([])
	const [ownPetAttr, setOwnPetAttr] = React.useState<any>(null)
	const [ownPetEvol, setOwnPetEvol] = React.useState<any>(null)
	const unwatch = watchAccount((account) => {

	})
	
	
	const {data, isLoading, mutate } = useSWR( `${process.env.EXPLORER_URL}/api/v2/tokens/${process.env.NFT_ADDRESS}/instances?page=20&offset${page}`, fetcher, {
	
	  });
	  
	  console.log(data);
	//   let petList = data?.data.filter((item:any) =>item.address !== address && item.address !== '0x0000000000000000000000000000000000000000') ;
	let petList = data?.items?.filter((item:any) =>item.owner.hash !== address && item.owner.hash !== '0x0000000000000000000000000000000000000000');
	  
	
	  const loadingState = isLoading || data?.items?.length === 0 ? "loading" : "idle";

	  const rowsPerPage = 20;
	  const pages = useMemo(() => {
		
		return data?.total ? Math.ceil(data.total / rowsPerPage) : 0;
	  }, [data?.total, rowsPerPage]);
	  
	  const ownedPetId = React.useMemo(() => {
		
		const pet =  typeof window !== 'undefined' ? localStorage.getItem('pet')+"" : "";
		console.log("ownedPet",pet)
			return pet;

	  }, []);
	  
	  const renderCell = React.useCallback(async(data:any, columnKey:any ) => {
		
		const cellValue = data[columnKey];
		const res : any = await readContracts({
			contracts: [
			  {
				address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
				abi: nftAbi,
				functionName: 'getPetInfo',
				args: [data.id],
			  }
			],
		  })
		  const pet  = res[0].result;
		  const InfoAttr : any = await readContracts({
			contracts: [
			  {
				address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
				abi: nftAbi,
				functionName: 'getPetAttributes',
				args: [data.id],
			  }
			],
		  })
		  const petInfoAttr = InfoAttr[0].result
		  const InfoEvol : any = await readContracts({
			contracts: [
			  {
				address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
				abi: nftAbi,
				functionName: 'getPetEvolutionInfo',
				args: [data.id],
			  }
			],
		  })
		  const petInfoEvol = InfoEvol[0].result

		switch (columnKey) {
		  case "pet":
			return (
				<div className="relative flex justify-start items-center gap-2">
				
				<User
				avatarProps={{radius: "lg", className:"p-1" ,src: `/gotchi/animation/${petInfoAttr  &&  petInfoAttr[1] == 0 ? "black_dragon" : "green_dragon"}/${petInfoEvol && petInfoEvol[1]}.gif`}}
				description={'lv:'+pet  && pet[3]}
				name={pet[0] +"#"+data.id || "Unknow" +"#"+data.id}
			   />
			
			  </div>
			);
		  case "score":
			return (
				<div className="relative flex justify-end items-center gap-2">
				<p className="text-bold text-sm capitalize">{Intl.NumberFormat('en-US', {
  notation: "compact",
  maximumFractionDigits: 1
}).format(pet[2])}</p>
		 <p className="text-bold text-sm capitalize text-default-400">Pts.</p>
			  </div>
			);
		  case "actions":
			return (
			  <div className="relative flex justify-end items-center gap-2">
				{
		 ownPet &&	ownPet[3] <  pet[3]  && pet[1] !== 4 && ownPet[1] !== 4 &&  ownPet[6] == BigInt("0") && (pet[5] == BigInt("0")  ||  Math.floor((( Math.abs(Number(new Date( Number(pet[5]) )) * 1000  - Date.now())) /1000)/60)/60 > 1)    && (
<Button isIconOnly size="sm" className="p-2" color="default" aria-label="Like" onPress={()=>onAttack(data.tokenId)}>
	   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				 <g>
					 <path fill="none" d="M0 0h24v24H0z"/>
					 <path fill-rule="nonzero" d="M17.457 3L21 3.003l.002 3.523-5.467 5.466 2.828 2.829 1.415-1.414 1.414 1.414-2.474 2.475 2.828 2.829-1.414 1.414-2.829-2.829-2.475 2.475-1.414-1.414 1.414-1.415-2.829-2.828-2.828 2.828 1.415 1.415-1.414 1.414-2.475-2.475-2.829 2.829-1.414-1.414 2.829-2.83-2.475-2.474 1.414-1.414 1.414 1.413 2.827-2.828-5.46-5.46L3 3l3.546.003 5.453 5.454L17.457 3zm-7.58 10.406L7.05 16.234l.708.707 2.827-2.828-.707-.707zm9.124-8.405h-.717l-4.87 4.869.706.707 4.881-4.879v-.697zm-14 0v.7l11.241 11.241.707-.707L5.716 5.002l-.715-.001z"/>
				 </g>
			 </svg>
   </Button>
			)
		}
		{
		 ownedPetId &&  pet[1] == 4   &&(
<Button isIconOnly size="sm" className="p-2" color="default" aria-label="Like" onPress={()=>onKill(data.tokenId)}>
<Image
    radius={"none"}
    width={40}
src="/gotchi/Icon/skull2.png"
/>
   </Button>
			)
		}
			  </div>
			);
		  default:
			return cellValue;
		}
	  }, [ownPet]);


	  const topContent = React.useMemo(() => {
		return (
		  <div className="flex flex-col gap-4">
			{ownPet ? (
				<Card >
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar isBordered radius="lg" color="primary" size="md" src={`/gotchi/animation/${ownPetAttr  &&  ownPetAttr[1] == 0 ? "black_dragon" : "green_dragon"}/${ownPetEvol && ownPetEvol[1]}.gif`} />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">{ownPet && ownPet[0]}#{ownPet && ownPet[9]}</h4>
            <h5 className="text-small tracking-tight text-default-400">LV:{ownPet && ownPet[3].toString()}</h5>
          </div>
        </div>
		<div>
		<Button
          className={"bg-transparent text-green-500 border-green-500" }
          color="primary"
          radius="full"
          size="sm"
          variant={ "bordered"}
        >
       {ownPet && Intl.NumberFormat('en-US', {
  notation: "compact",
  maximumFractionDigits: 1
}).format(ownPet[2])} Pts
        </Button>
		<Button
          className={"bg-transparent text-blue-500 border-blue-500" }
          color="primary"
          radius="full"
          size="sm"
          variant={ "bordered"}
        >
       <CountDownTimer seconds={ownPet ? parseInt(ownPet[4]) *1000 - Date.now() : 0} />
        </Button>
		<Button
          className={`bg-transparent  ${ownPet  ?  ownPet[1] == 0 ? 'text-green-500 border-green-500' : ownPet[1] == 1 ? 'text-yellow-500 border-yellow-500' :  ownPet[1] == 2 ? 'text-yellow-500 border-yellow-500' :  ownPet[1] == 3 ? 'text-red-500 border-red-500' :  ownPet[1] == 4 ? 'text-neutral-500 border-neutral-500' :'' : ''}`}
          color="primary"
          radius="full"
          size="sm"
          variant={ "bordered"}
        >
        { ownPet  ?  ownPet[1] == 0 ? 'HAPPY' : ownPet[1] == 1 ? 'HUNGRY' :  ownPet[1] == 2 ? 'STARVING' :  ownPet[1] == 3 ? 'DYING' :  ownPet[1] == 4 ? 'DEAD' :'' : ''}
        </Button>	
		</div>
   
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
      </CardBody>
    </Card>
			):(
				<Card>
					<CardHeader className="justify-between">
					<div className="flex gap-5">
            <h4 className="text-small font-semibold leading-none text-default-600">Please Choose Pet To Battle!</h4>
          
        </div>
					</CardHeader>
			
		</Card>
			)}
			
			
			
		  </div>
		);
	  }, [ownPet]);
const onAttack = async ( tokenId : any )=> {
	
	const config =  await prepareWriteContract({
	 address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
	 abi: nftAbi,
	 functionName: "attack",
	 args: [BigInt(ownedPetId) ,tokenId]})
	const tx = await writeContract(config);
	if(tx){

	 const list = activity;
	 list.push(` You Attacked #${tokenId} `)
	 setActivity(list)
	 fetchMyAPI();
	}
    };


const onKill = async( tokenId : any )=> {
       await setSelectedPet(tokenId);
	   const config =  await prepareWriteContract({
		address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
		abi: nftAbi,
		functionName: "kill",
		args: [tokenId ,BigInt(ownedPetId)]})
	   const tx = await writeContract(config);
	   if(tx){

		const list = activity;
		list.push(` You Killed #${tokenId} `)
		setActivity(list)
		fetchMyAPI();
	   }
    };

	

const fetchMyAPI = async()=>{
	mutate();
	const pet =  typeof window !== 'undefined' ? localStorage.getItem('pet')+"" : null;
	console.log("ownedPet",pet)
    if (pet) {
        const Info : any = await readContracts({
            contracts: [
              {
                address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
                abi: nftAbi,
                functionName: 'getPetInfo',
                args: [BigInt(pet)],
              }
            ],
          })
          
          Info[0].result.push(BigInt(pet));
		  
		  const InfoAttr : any = await readContracts({
			contracts: [
			  {
				address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
				abi: nftAbi,
				functionName: 'getPetAttributes',
				args: [BigInt(pet)],
			  }
			],
		  })
		  setOwnPetAttr(InfoAttr[0].result)
		  const InfoEvol : any = await readContracts({
			contracts: [
			  {
				address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
				abi: nftAbi,
				functionName: 'getPetEvolutionInfo',
				args: [BigInt(pet)],
			  }
			],
		  })
		  console.log("InfoEvol[0].result",InfoEvol[0].result)
		  setOwnPetEvol(InfoEvol[0].result)
setOwnPet(Info[0].result);
          
  }
} 

useContractEvent({
	address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
	abi: nftAbi,
	eventName:"Attack",
	listener(logs) {
		async function getlogs() {
			if(logs[0]){
				const petAttacked : any = await readContracts({
					contracts: [
					  {
						address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
						abi: nftAbi,
						functionName: 'getPetInfo',
						args: [selectedPet as bigint],
					  }
					],
				  })
	
				const list = activity;
				//list.push(` Your Pet attacked ${JSON.stringify(petAttacked)} and ${ownPetId == logs[0].args.winner ? "won" : "lost"} ${logs[0].args.scoresWon} points`)
				setActivity(list)
				fetchMyAPI();
			}
		  }
		  getlogs();
	  }
  })
 
  useContractEvent({
	address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
	abi: nftAbi,
	eventName: 'PetKilled',
	listener: (logs) => {
		async function getlogs() {
			if(logs[0]){
				const petDeaded : any = await readContracts({
					contracts: [
					  {
						address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
						abi: nftAbi,
						functionName: 'getPetInfo',
						args: [logs[0].args.deadId as bigint],
					  }
					],
				  })
	
				const list = activity;
				list.push(` You killed ${JSON.stringify(petDeaded)} `)
				fetchMyAPI();
				setActivity(list)
				
			}
		  }
		  getlogs();
	  }
  })

	useEffect(() => {
		fetchMyAPI()
	  }, [])
	return (
		<>
		<div>
<Table isStriped
 topContent={topContent}
 topContentPlacement="outside"
		bottomContent={
			pages > 0 ? (
			  <div className="flex w-full justify-center">
				<Pagination
				  isCompact
				  showControls
				  showShadow
				  color="primary"
				  page={page}
				  total={pages}
				  onChange={(page) => setPage(page)}
				/>
			  </div>
			) : null}
        selectionMode="single"  aria-label="Example static collection table h-44" classNames={{
        base: "max-h-[520px] pt-3",
        table: "min-h-[420px] pt-3",
      }}>
      <TableHeader>
        <TableColumn key="pet" >Info</TableColumn>
        <TableColumn key="score">Score</TableColumn>
        <TableColumn key="actions">Battle</TableColumn>
      </TableHeader>
      <TableBody
	  items={petList || []}
	  loadingState={loadingState}
	  loadingContent={<Spinner label="Loading..." />}
	  
	  >
		
		
		   {(item:any)  =>  (
          <TableRow key={item?.tokenIdString}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
	
       
      </TableBody>
	  
    </Table>
	
	
		</div>
		<br/>
		<Card >
		<CardHeader className="flex gap-3">
			<div className="flex flex-col">
			  <p className="text-md">Activity</p>
			  <p className="text-small text-default-500">list</p>
			</div>
		  </CardHeader>
		  <Divider/>
	  <CardBody>
		{activity.length > 0 && activity.map((item:string,index:number) => (
			<p  key={index}>{item}</p> 
		) )}
			
	  </CardBody>
	</Card>
	<br/>
	<br/>
	<br/>
	</>
		)
}
