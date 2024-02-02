export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Joy Dragon",
	description: "Engage in a variety of fun mini-games to keep your Dragon entertained and active.",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
		{
			label: "My Pet",
			href: "/pet",
		},
		{
			label: "Battle",
			href: "/battle",
		},
		{
			label: "Reward",
			href: "/reward",
		},
		{
			label: "Activity",
			href: "/activity",
		},
		{
			label: "Breed",
			href: "/breed",
		},
	],
	navMenuItems: [
		{
			label: "Home",
			href: "/",
		},
		{
			label: "My Pet",
			href: "/pet",
		},
		{
			label: "Leader Board",
			href: "/leaderboard",
		},
		{
			label: "Reward",
			href: "/reward",
		},
		{
			label: "Activity",
			href: "/activity",
		},
	],
	links: {
		github: "https://github.com/nextui-org/nextui",
		twitter: "https://twitter.com/getnextui",
		docs: "https://nextui.org",
		discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev"
	},
};
