"use client"
import React, { useState, useEffect , useCallback } from 'react';
import { nftAbi , tokenAbi } from '../../abi';
import {Select, SelectItem ,Tooltip ,Button} from "@nextui-org/react";

import {
	usePrepareContractWrite,
	useContractWrite,
  } from "wagmi";

export default function FaucetPage() {
	const [messages, setMessages] = useState<any>(null)
	const [hash, setHash] = useState<any>(null)
	
    const { config : configEnableTrading } = usePrepareContractWrite({
		address: `0x${process.env.TOKEN_ADDRESS?.slice(2)}`,
		abi: tokenAbi,
		functionName: "enableTrading"
		});
	  
		const {
		  data: enableTradingResult,
		  writeAsync: setEnableTradingAsync,
		  error:errorEnableTrading,
		} = useContractWrite(configEnableTrading);
		

		//create blackDragon 0
		const { config : configAddPetBlackDragon } = usePrepareContractWrite({
			address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
			abi: nftAbi,
			functionName: "createSpecies",
			args: [
				[{
					image: "https://bafkreigw3j7bn3yhkbqt2ercytjhghzn462n5pxzyig4lptuyv4zv6gn6y.ipfs.nftstorage.link/",
					name: "1",
					attackWinRate: BigInt("20"),
					nextEvolutionLevel: BigInt("1")
				},
				{
					image: "https://bafkreiaqk7mr45wnjwtb4lyv4gpy5rloma3sxq3fq2t6s43tcy3ovnki4m.ipfs.nftstorage.link/",
					name: "2",
					attackWinRate: BigInt("25"),
					nextEvolutionLevel: BigInt("2")
				},
				{
					image: "https://bafkreiav7btv3nuei6znfpttelgln5tdcz7pfllcio333og4qwnbkwltoa.ipfs.nftstorage.link/",
					name: "3",
					attackWinRate: BigInt("35"),
					nextEvolutionLevel: BigInt("3")
				}],
			BigInt("10"),
			true,
			BigInt("0"),
			{ skinColor: BigInt("0"), hornStyle: BigInt("0"), wingStyle: BigInt("0")}]
			});
			const {
				data: addPetBlackDragonResult,
				writeAsync: createPetBlackDragon,
				error:errorAddPetBlackDragon,
			  } = useContractWrite(configAddPetBlackDragon);
					//create blackDragon 1
		const { config : configAddPetBlackDragon1 } = usePrepareContractWrite({
			address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
			abi: nftAbi,
			functionName: "createSpecies",
			args: [
				[{
					image: "https://bafkreigw3j7bn3yhkbqt2ercytjhghzn462n5pxzyig4lptuyv4zv6gn6y.ipfs.nftstorage.link/",
					name: "1",
					attackWinRate: BigInt("20"),
					nextEvolutionLevel: BigInt("1")
				},
				{
					image: "https://bafkreiaqk7mr45wnjwtb4lyv4gpy5rloma3sxq3fq2t6s43tcy3ovnki4m.ipfs.nftstorage.link/",
					name: "2",
					attackWinRate: BigInt("25"),
					nextEvolutionLevel: BigInt("2")
				},
				{
					image: "https://bafkreicq7wfe6ppuq6ecddbyqwxfylx4orh45rt3irbbcq347ihtn6pcza.ipfs.nftstorage.link/",
					name: "3",
					attackWinRate: BigInt("35"),
					nextEvolutionLevel: BigInt("3")
				}],
				
			BigInt("10"),
			true,
			BigInt("0"),
			{ skinColor: BigInt("0"), hornStyle: BigInt("1"), wingStyle: BigInt("1")}
		]
			});
			const {
				data: addPetBlackDragonResult1,
				writeAsync: createPetBlackDragon1,
				error:errorAddPetBlackDragon1,
			  } = useContractWrite(configAddPetBlackDragon1);
						//create blackDragon 2
		const { config : configAddPetBlackDragon2 } = usePrepareContractWrite({
			address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
			abi: nftAbi,
			functionName: "createSpecies",
			args: [
				[{
					image: "https://bafkreigw3j7bn3yhkbqt2ercytjhghzn462n5pxzyig4lptuyv4zv6gn6y.ipfs.nftstorage.link/",
					name: "1",
					attackWinRate: BigInt("20"),
					nextEvolutionLevel: BigInt("1")
				},
				{
					image: "https://bafkreiaqk7mr45wnjwtb4lyv4gpy5rloma3sxq3fq2t6s43tcy3ovnki4m.ipfs.nftstorage.link/",
					name: "2",
					attackWinRate: BigInt("25"),
					nextEvolutionLevel: BigInt("2")
				},
				{
					image: "https://bafkreigggnanw6kfhuyjyekmm24nz7jukju7ermuoycerr3xyeve6hofgu.ipfs.nftstorage.link/",
					name: "3",
					attackWinRate: BigInt("35"),
					nextEvolutionLevel: BigInt("3")
				}],
			BigInt("10"),
			true,
			BigInt("0"),
			{ skinColor: BigInt("0"), hornStyle: BigInt("0"), wingStyle: BigInt("1")}
		]
			});

		  
			const {
			  data: addPetBlackDragonResult2,
			  writeAsync: createPetBlackDragon2,
			  error:errorAddPetBlackDragon2,
			} = useContractWrite(configAddPetBlackDragon2);

						//create blackDragon 3
						const { config : configAddPetBlackDragon3 } = usePrepareContractWrite({
							address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
							abi: nftAbi,
							functionName: "createSpecies",
							args: [
								[{
									image: "https://bafkreigw3j7bn3yhkbqt2ercytjhghzn462n5pxzyig4lptuyv4zv6gn6y.ipfs.nftstorage.link/",
									name: "1",
									attackWinRate: BigInt("20"),
									nextEvolutionLevel: BigInt("1")
								},
								{
									image: "https://bafkreiaqk7mr45wnjwtb4lyv4gpy5rloma3sxq3fq2t6s43tcy3ovnki4m.ipfs.nftstorage.link/",
									name: "2",
									attackWinRate: BigInt("25"),
									nextEvolutionLevel: BigInt("2")
								},
								{
									image: "https://bafkreifd2lwt5rsiav6mbt7q7inp6zs3togsfcuk6xfcewsassjznajnhe.ipfs.nftstorage.link/",
									name: "3",
									attackWinRate: BigInt("35"),
									nextEvolutionLevel: BigInt("3")
								}],
							BigInt("10"),
							true,
							BigInt("0"),
							{ skinColor: BigInt("0"), hornStyle: BigInt("2"), wingStyle: BigInt("1")}]
							});
				
						  
							const {
							  data: addPetBlackDragonResult3,
							  writeAsync: createPetBlackDragon3,
							  error:errorAddPetBlackDragon3,
							} = useContractWrite(configAddPetBlackDragon3);

					



			//---------------------------------------------------------------------------------------
					//create Green 
		const { config : configAddPetGreenDragon } = usePrepareContractWrite({
			address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
			abi: nftAbi,
			functionName: "createSpecies",
			args: [
				[{
					image: "https://bafkreid32fvsd54vejrhsp26zebufsdqnx7jjgtg7j5odp6vyc3b4joecm.ipfs.nftstorage.link/",
					name: "1",
					attackWinRate: BigInt("20"),
					nextEvolutionLevel: BigInt("1")
				},
				{
					image: "https://bafkreiapb7ryik6hqe3hj2sd5fjfsexfvuumyxf7jhlzhv64zjmvdp456q.ipfs.nftstorage.link/",
					name: "2",
					attackWinRate: BigInt("25"),
					nextEvolutionLevel: BigInt("2")
				},
				{
					image: "https://bafkreib432nhq6leyew2nqjubnjzruw4o4mcohqoygzdbghxxalaemzyqy.ipfs.nftstorage.link/",
					name: "3",
					attackWinRate: BigInt("35"),
					nextEvolutionLevel: BigInt("3")
				}],
			BigInt("10"),
			true,
			BigInt("0"),
			{ skinColor: BigInt("1"), hornStyle: BigInt("1"), wingStyle: BigInt("1")}
		]
			});
		  
			const {
			  data: addPetGreenDragonResult,
			  writeAsync: createPetGreenDragon,
			  error:errorAddPetGreenDragon,
			} = useContractWrite(configAddPetGreenDragon);


								//create Green 1
								const { config : configAddPetGreenDragon1 } = usePrepareContractWrite({
									address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
									abi: nftAbi,
									functionName: "createSpecies",
									args: [
										[{
											image: "https://bafkreid32fvsd54vejrhsp26zebufsdqnx7jjgtg7j5odp6vyc3b4joecm.ipfs.nftstorage.link/",
											name: "1",
											attackWinRate: BigInt("20"),
											nextEvolutionLevel: BigInt("1")
										},
										{
											image: "https://bafkreiapb7ryik6hqe3hj2sd5fjfsexfvuumyxf7jhlzhv64zjmvdp456q.ipfs.nftstorage.link/",
											name: "2",
											attackWinRate: BigInt("25"),
											nextEvolutionLevel: BigInt("2")
										},
										{
											image: "https://bafkreibvhepjeiivlvkwxoyupj3jnrnvhnurr3a4xgznm6s2zhc2diuiou.ipfs.nftstorage.link/",
											name: "3",
											attackWinRate: BigInt("35"),
											nextEvolutionLevel: BigInt("3")
										}],
									BigInt("10"),
									true,
									BigInt("0"),
									{ skinColor: BigInt("1"), hornStyle: BigInt("1"), wingStyle: BigInt("0")}
								]
									});
								  
									const {
									  data: addPetGreenDragonResult1,
									  writeAsync: createPetGreenDragon1,
									  error:errorAddPetGreenDragon1,
									} = useContractWrite(configAddPetGreenDragon1);


								//create Green 2
		const { config : configAddPetGreenDragon2 } = usePrepareContractWrite({
			address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
			abi: nftAbi,
			functionName: "createSpecies",
			args: [
				[{
					image: "https://bafkreid32fvsd54vejrhsp26zebufsdqnx7jjgtg7j5odp6vyc3b4joecm.ipfs.nftstorage.link/",
					name: "1",
					attackWinRate: BigInt("20"),
					nextEvolutionLevel: BigInt("1")
				},
				{
					image: "https://bafkreiapb7ryik6hqe3hj2sd5fjfsexfvuumyxf7jhlzhv64zjmvdp456q.ipfs.nftstorage.link/",
					name: "2",
					attackWinRate: BigInt("25"),
					nextEvolutionLevel: BigInt("2")
				},
				{
					image: "https://bafkreiczmbp3x42ldjhlyxf6e6owwg6fij5vir5yp3stmnjbebv6yj6v2a.ipfs.nftstorage.link/",
					name: "3",
					attackWinRate: BigInt("35"),
					nextEvolutionLevel: BigInt("3")
				}],
			BigInt("10"),
			true,
			BigInt("0"),
			{ skinColor: BigInt("1"), hornStyle: BigInt("0"), wingStyle: BigInt("0")}
		]
			});
		  
			const {
			  data: addPetGreenDragonResult2,
			  writeAsync: createPetGreenDragon2,
			  error:errorAddPetGreenDragon2,
			} = useContractWrite(configAddPetGreenDragon2);

		//Beef
		const { config : configAddMoonStone } = usePrepareContractWrite({
			address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
			abi: nftAbi,
			functionName: "createItem",
			args: ["Moon Stone",BigInt("2000"),BigInt("2000"),BigInt("99999") , BigInt("0"),BigInt("0") ,BigInt("0"),false],
			});
		  
			const {
			  data: addItemMoonStone,
			  writeAsync: creatItemMoonStone,
			  error:errorAddMoonStone,
			} = useContractWrite(configAddMoonStone);

		//Beef
		const { config : configAddItemBeef } = usePrepareContractWrite({
			address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
			abi: nftAbi,
			functionName: "createItem",
			args: ["Beef",BigInt("2000"),BigInt("2000"),BigInt("99999") , BigInt("50000000000000"),BigInt("28800") ,BigInt("0"),false],
			});
		  
			const {
			  data: addItemBeefResult,
			  writeAsync: creatItemBeef,
			  error:errorAddBeefItem,
			} = useContractWrite(configAddItemBeef);

			//Water
		const { config : configAddItemWater } = usePrepareContractWrite({
			address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
			abi: nftAbi,
			functionName: "createItem",
			args: ["Water",BigInt("2000"),BigInt("2000"),BigInt("99999") , BigInt("20000000000000"),BigInt("28800") ,BigInt("0"),false],
			});
		  
			const {
			  data: addItemWaterResult,
			  writeAsync: creatItemWater,
			  error:errorAddWaterItem,
			} = useContractWrite(configAddItemWater);	


		//Shield
		const { config : configAddItemShield } = usePrepareContractWrite({
			address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
			abi: nftAbi,
			functionName: "createItem",
			args: ["Shield",BigInt("2000"),BigInt("2000"),BigInt("99999") , BigInt("0"),BigInt("0") ,BigInt("3"),false],
			});
		  
			const {
			  data: addItemShieldResult,
			  writeAsync: creatItemShield,
			  error:errorAddShieldItem,
			} = useContractWrite(configAddItemShield);
					//Holy Water Revival
		const { config : configAddItemRevival } = usePrepareContractWrite({
			address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
			abi: nftAbi,
			functionName: "createItem",
			args: ["Holy Water",BigInt("2000"),BigInt("2000"),BigInt("99999") , BigInt("0"),BigInt("0") ,BigInt("0"),true],
			});
		  
			const {
			  data: addItemRevivalResult,
			  writeAsync: creatItemRevival,
			  error:errorAddRevivalItem,
			} = useContractWrite(configAddItemRevival);	

	return (
		<>
		<div className='pt-10'>

	<div>
	<Button color="primary" className="w-full" onPress={setEnableTradingAsync}>
	set Enable Trading 
	  </Button>
	</div>
	<br/>
	<div>
	<Button color="primary" className="w-full" onPress={createPetBlackDragon}>
	set Black Dragon 0
	  </Button>
	</div>
	<br/>
	<div>
	<Button color="primary" className="w-full" onPress={createPetBlackDragon1}>
	set Black Dragon 1
	  </Button>
	</div>
	<br/>
	<div>
	<Button color="primary" className="w-full" onPress={createPetBlackDragon2}>
	set Black Dragon 2
	  </Button>
	</div>
	<br/>
	<div>
	<Button color="primary" className="w-full" onPress={createPetBlackDragon3}>
	set Black Dragon 3
	  </Button>
	</div>
	<br/>
	
	<div>
	<Button color="primary" className="w-full" onPress={createPetGreenDragon}>
	set Green Dragon 0 
	  </Button>
	</div>
	<br/>

	<div>
	<Button color="primary" className="w-full" onPress={createPetGreenDragon1}>
	set Green Dragon 1
	  </Button>
	</div>
	<br/>
	<div>
	<Button color="primary" className="w-full" onPress={createPetGreenDragon2}>
	set Green Dragon 2
	  </Button>
	</div>
	<br/>
	
	<div>
	<Button color="primary" className="w-full" onPress={creatItemMoonStone}>
		Item Moon Stone
	  </Button>
	  
	</div>
	<br/>
	<div>
	<Button color="primary" className="w-full" onPress={creatItemBeef}>
		Item Beef
	  </Button>
	  
	</div>

	  <br/>
	  
	  <div>
	<Button color="primary" className="w-full" onPress={creatItemWater}>
		Item Water
	  </Button>
	  
	</div>
	<br/>
	<div>
	<Button color="primary" className="w-full" onPress={creatItemShield}>
		Item Shield
	  </Button>
	</div>
	<br/>
	<div>
	<Button color="primary" className="w-full pt-2" onPress={creatItemRevival}>
		Item Revival
	  </Button>
	</div>
	<br/>
	</div>
		</>
	);
}
