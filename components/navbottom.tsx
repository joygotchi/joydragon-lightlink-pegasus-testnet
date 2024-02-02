//https://flowbite.com/icons/
import { Link } from "@nextui-org/link";
import {Image} from "@nextui-org/react";
export const NavBottom = () => {
	return (
		<div className={"fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 overflow-hidden"} >
    <div className={"grid h-full max-w-lg grid-cols-5 mx-auto font-medium bg-no-repeat bg-cover "} style={{backgroundImage:"url(/gotchi/Assets/HUDBar2.png)"}}>
        <Link href="/" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group pt-2">
        <Image
    radius={"none"}
    width={50}
src="/gotchi/Assets/Icon_Home.png"
/>
     
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"></span>
        </Link>
        <Link href="/pet" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group pt-2">
    


  <Image
    radius={"none"}
    width={50}
src="/gotchi/Assets/Icon_Pet.png"
/>

            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"></span>
        </Link>
        <Link href="/battle" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group pt-2">
         
        <Image
    radius={"none"}
    width={50}
src="/gotchi/Assets/Icon_Battle.png"
/>
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"></span>
        </Link>
        <Link href="/reward" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group pt-2">
        <Image
    radius={"none"}
    width={50}
src="/gotchi/Assets/Icon_Reward.png"
/>
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"></span>
        </Link>
        <Link href="/breed" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group pt-2">
        
        <Image
    radius={"none"}
    width={50}
src="/Assets/EggIcon.png"
/>
            <span className="text-sm text-gray-500 text-gray-500  group-hover:text-blue-600 dark:group-hover:text-blue-500"></span>
        </Link>
    </div>
</div>
	);
};


