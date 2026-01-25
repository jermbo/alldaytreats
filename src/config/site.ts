export const siteConfig = {
	name: "All Day Treats",
	location: "Omaha, NE",
	description:
		"Handcrafted candy-coated and chocolate-covered treats made fresh in Omaha, NE.",
	contact: {
		email: "alldaytreats@gmail.com",
		instagram: {
			handle: "@all_day_treats",
			url: "https://instagram.com/all_day_treats",
		},
	},
	delivery: {
		description: "We deliver to the Omaha metro area:",
		zones: [
			{
				fee: 10,
				areas: [
					{
						name: "North",
						zipCodes: ["68105", "68110", "68111", "68131", "68178"],
					},
				],
			},
			{
				fee: 15,
				areas: [
					{ name: "Benson Area", zipCodes: ["68104", "68131", "68132"] },
					{ name: "Northwest Area", zipCodes: ["68114", "68134"] },
					{ name: "Aksarben Area", zipCodes: ["68105", "68106", "68108"] },
				],
			},
		],
	},
} as const;
