export default function PricingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="h-full max-w-lg  mx-auto font-medium bg-slate-50 px-8">
			{children}
		</section>
	);
}
