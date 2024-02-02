"use client"
import React, { useState, useEffect ,useMemo } from 'react';
import { readContracts  , watchAccount} from '@wagmi/core'
import {Table, TableHeader, TableColumn,Link, TableBody, TableRow, TableCell,Button ,Input , Spinner , Pagination} from "@nextui-org/react";
import { nftAbi , tokenAbi } from '../../abi';
import useSWR from "swr";

const fetcher = async (...args: Parameters<typeof fetch>) => {
	const res = await fetch(...args);
	return res.json();
  };

const InputDataDecoder = require('ethereum-input-data-decoder');
const decoder = new InputDataDecoder(nftAbi);
export default function ActivityPage() {
	const [page, setPage] = React.useState(0);
	const {data, isLoading, mutate } = useSWR( `${process.env.EXPLORER_URL}/api/v2/addresses/${process.env.NFT_ADDRESS}/transactions?page=20&offset`, fetcher, {
	
});
console.log(data)

const loadingState = isLoading || data?.items.length === 0 ? "loading" : "idle";

const rowsPerPage = 20;

const pages = useMemo(() => {
  
  return data?.items.length ? Math.ceil(data?.items.length / rowsPerPage) : 0;
}, [data?.items.length, rowsPerPage]);


const renderCell = React.useCallback(async(element:any, columnKey:any ) => {

	const cellValue = element[columnKey];
	let item : any= {};

	
	  const data = decoder.decodeData(element.input);
		  if(data.method == "buyItem"){
			  const itemInfo : any = await readContracts({
				  contracts: [
					{
					  address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
					  abi: nftAbi,
					  functionName: 'getItemInfo',
					  args: [data.inputs[1]],
					}
				  ],
				})

				const petInfo : any = await readContracts({
				  contracts: [
					{
					  address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
					  abi: nftAbi,
					  functionName: 'getPetInfo',
					  args: [data.inputs[0]],
					}
				  ],
				})

				item = {
				  pet:petInfo[0].result[0] || "Unknow",
				  method:element.method,
				  action:"Feed",
				  log:`${itemInfo[0].result[0]}`
			  }

		  }
		  if(data.method  == "mint"){
			  
			item = {
				  pet:"A new Pet",
				  method:element.method,
				  action:"Mint",
				  log:`Minted`
			  }
		  }
		  if(data.method == "redeem"){
			  const petInfo : any = await readContracts({
				  contracts: [
					{
					  address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
					  abi: nftAbi,
					  functionName: 'getPetInfo',
					  args: [data.inputs[0]],
					}
				  ],
				})
				item = {
				  pet:petInfo[0].result[0],
				  method:element.method,
				  action:"Redeem",
				  log:`Redeemed`
			  }
		  }
		  if(data.method  == "attack"){
			  const petAttack : any = await readContracts({
				  contracts: [
					{
					  address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
					  abi: nftAbi,
					  functionName: 'getPetInfo',
					  args: [data.inputs[0]],
					}
				  ],
				})
				const petWasAttack : any = await readContracts({
				  contracts: [
					{
					  address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
					  abi: nftAbi,
					  functionName: 'getPetInfo',
					  args: [data.inputs[1]],
					}
				  ],
				})
				item = {
				  pet:petAttack[0].result[0],
				  method:element.method,
				  action:"Attacked",
				  log:`${petWasAttack[0].result[0]}`
			  }
		  }
		  if(data.method == "kill"){
			  const petAttack : any = await readContracts({
				  contracts: [
					{
					  address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
					  abi: nftAbi,
					  functionName: 'getPetInfo',
					  args: [data.inputs[0]],
					}
				  ],
				})
				const petWasAttack : any = await readContracts({
				  contracts: [
					{
					  address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
					  abi: nftAbi,
					  functionName: 'getPetInfo',
					  args: [data.inputs[1]],
					}
				  ],
				})
				item = {
				  pet:petAttack[0].result[0],
				  method:element.method,
				  action:"Killed",
				  log:`${petWasAttack[0].result[0]}`
			  }
			  
		
	};
	if(data.method == "setPetName"){
		const pet : any = await readContracts({
			contracts: [
			  {
				address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
				abi: nftAbi,
				functionName: 'getPetInfo',
				args: [data.inputs[0]],
			  }
			],
		  })
		  item = {
			pet:pet[0].result[0],
			method:element.method,
			action:"Changed",
			log:`Name`
		}
	}
	console.log("status",data.method)
	switch (columnKey) {
	  case "pet":
		return (
			<div className="relative flex justify-start items-center gap-2">
			{item.pet}
		  </div>
		);
	  case "action":
		return (
			<div className="relative flex justify-end items-center gap-2">
			<p className="text-bold text-sm capitalize">{item.action}</p>
		  </div>
		);
	  case "info":
		return (
		  <div className="relative flex justify-end items-center gap-2">
			<p className="text-bold text-sm capitalize">{item.log}</p>
			
		  </div>
		);
	  default:
		return cellValue;
	}
  }, []);

	return (
		<>
		<div className='pt-1'>
		<Table 
		 selectionMode="single"
		 classNames={{
			base: "max-h-[520px] pt-3",
			table: "min-h-[420px] pt-3",
		  }}
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
		
		>
      <TableHeader>
        <TableColumn key={"pet"}>Pet.</TableColumn>
        <TableColumn key={"action"}>Action</TableColumn>
        <TableColumn key={"info"}>Info</TableColumn>
      </TableHeader>
      <TableBody
	  	  items={data?.items || []}
			loadingState={loadingState}
			loadingContent={<Spinner label="Loading..." />}
	  
	  >
	  
	  {(item:any)  =>  (
          <TableRow key={item.hash}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
		</div>
		</>
	);
}
