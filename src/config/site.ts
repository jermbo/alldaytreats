export const siteConfig = {
  name: "All Day Treats",
  location: "Omaha, NE",
  description: "Handcrafted candy-coated and chocolate-covered treats made fresh in Omaha, NE.",
  contact: {
    email: "alldaytreats@gmail.com",
    instagram: {
      handle: "@all_day_treats",
      url: "https://instagram.com/all_day_treats",
    },
  },
  delivery: {
    description: "We deliver to the Omaha metro area including:",
    zipCodes: [
      "68102", "68104", "68105", "68106", "68107", "68108",
      "68110", "68111", "68112", "68114", "68116", "68117",
      "68118", "68122", "68124", "68127", "68130", "68131",
      "68132", "68134", "68135", "68137", "68138", "68144",
      "68147", "68152", "68154", "68157", "68164"
    ],
    note: "Don't see your zip code? Contact us — we may still be able to deliver to you!",
  },
} as const;
