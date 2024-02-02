export default function BattleLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="h-full max-w-lg  mx-auto font-medium bg-slate-50 px-8 bg-no-repeat bg-cover" style={{backgroundImage: "url(/gotchi/Assets/Background.png)"}}>
			{children}
		</section>
	);
}
