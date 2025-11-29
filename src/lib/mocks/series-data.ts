/**
 * Mock series data for homepage
 * Provides sample data for all homepage sections
 */

import type {
  LatestUpdateItem,
  Series,
  PopularSeries,
} from "@/lib/interface/series.interface";

/**
 * Popular new titles for carousel
 */
export const mockPopularTitles: PopularSeries[] = [
  {
    id: "1",
    title: "Yotaka Futatabi",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Suggestive", "Action", "Comedy"],
    description:
      "The once legendary hitman Nighthawk is now a washed-up, 33-year-old, alcoholic, chain-smoking NEET. Will she ever make her comeback?!",
    author: "Izumida Fuyuki",
    additionalLinks: [
      { label: "Official X", url: "https://x.com/madararamble" },
    ],
    views: 125000,
    likes: 8500,
    rating: 4.8,
  },
  {
    id: "2",
    title: "One Piece",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Action", "Adventure", "Comedy", "Drama"],
    description:
      "Monkey D. Luffy and his pirate crew explore the Grand Line in search of the world's ultimate treasure to become the next Pirate King.",
    author: "Eiichiro Oda",
    views: 5000000,
    likes: 250000,
    rating: 4.9,
  },
  {
    id: "3",
    title: "Attack on Titan",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Action", "Drama", "Horror", "Mystery"],
    description:
      "Humanity fights for survival against the Titans, gigantic humanoid creatures that devour humans seemingly without reason.",
    author: "Hajime Isayama",
    views: 3000000,
    likes: 180000,
    rating: 4.7,
  },
  {
    id: "4",
    title: "Demon Slayer",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Action", "Supernatural", "Historical"],
    description:
      "Tanjiro Kamado sets out to become a demon slayer after his family is slaughtered and his sister is turned into a demon.",
    author: "Koyoharu Gotouge",
    views: 2500000,
    likes: 150000,
    rating: 4.6,
  },
  {
    id: "5",
    title: "Jujutsu Kaisen",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Action", "Supernatural", "School"],
    description:
      "Yuji Itadori joins his school's Occult Club and becomes entangled in the world of Curses and Jujutsu Sorcerers.",
    author: "Gege Akutami",
    views: 2800000,
    likes: 170000,
    rating: 4.8,
  },
];

/**
 * Latest updates for the updates list
 */
export const mockLatestUpdates: LatestUpdateItem[] = [
  {
    id: "1",
    title: "Namaiki na Gal Ane wo Wakaraseru Hanashi",
    coverUrl: "/default-article-cover.jpg",
    chapter: {
      number: "58",
      title: "Part-Time Job 5",
      language: "en",
      url: "/chapter/placeholder",
    },
    groups: [
      { id: "1", name: "AntiPatreon Scan", url: "/group/1" },
      { id: "2", name: "Rashi Scanlation", url: "/group/2" },
    ],
    timestamp: new Date(Date.now() - 60_000), // 1 minute ago
    commentCount: 0,
  },
  {
    id: "2",
    title: "One Piece",
    coverUrl: "/default-article-cover.jpg",
    chapter: {
      number: "1100",
      title: "The Five Elders",
      language: "en",
      url: "/chapter/placeholder",
    },
    groups: [{ id: "3", name: "TCB Scans", url: "/group/3" }],
    timestamp: new Date(Date.now() - 120_000), // 2 minutes ago
    commentCount: 15,
  },
  {
    id: "3",
    title: "Attack on Titan",
    coverUrl: "/default-article-cover.jpg",
    chapter: {
      number: "139",
      title: "The End",
      language: "en",
      url: "/chapter/placeholder",
    },
    groups: [{ id: "4", name: "Kodansha Comics", url: "/group/4" }],
    timestamp: new Date(Date.now() - 300_000), // 5 minutes ago
    commentCount: 42,
  },
  {
    id: "4",
    title: "Demon Slayer",
    coverUrl: "/default-article-cover.jpg",
    chapter: {
      number: "205",
      title: "Epilogue",
      language: "en",
      url: "/chapter/placeholder",
    },
    groups: [{ id: "5", name: "Viz Media", url: "/group/5" }],
    timestamp: new Date(Date.now() - 600_000), // 10 minutes ago
    commentCount: 8,
  },
  {
    id: "5",
    title: "Jujutsu Kaisen",
    coverUrl: "/default-article-cover.jpg",
    chapter: {
      number: "250",
      title: "Inhuman Makyo Shinjuku Showdown",
      language: "en",
      url: "/chapter/placeholder",
    },
    groups: [{ id: "6", name: "Viz Media", url: "/group/6" }],
    timestamp: new Date(Date.now() - 900_000), // 15 minutes ago
    commentCount: 23,
  },
  {
    id: "6",
    title: "Chainsaw Man",
    coverUrl: "/default-article-cover.jpg",
    chapter: {
      number: "150",
      title: "The End of the World",
      language: "en",
      url: "/chapter/placeholder",
    },
    groups: [{ id: "7", name: "Viz Media", url: "/group/7" }],
    timestamp: new Date(Date.now() - 1800_000), // 30 minutes ago
    commentCount: 67,
  },
];

/**
 * Recommended series titles
 */
export const mockRecommended: Series[] = [
  {
    id: "6",
    title: "Chainsaw Man",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Action", "Horror", "Comedy"],
    description:
      "Denji is a teenage boy living with a Chainsaw Devil named Pochita. He becomes a devil hunter to pay off his debt.",
    author: "Tatsuki Fujimoto",
  },
  {
    id: "7",
    title: "Spy x Family",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Action", "Comedy", "Slice of Life"],
    description:
      "A spy on an undercover mission gets married and adopts a child as part of his cover. His wife and daughter have secrets of their own.",
    author: "Tatsuya Endo",
  },
  {
    id: "8",
    title: "My Hero Academia",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Action", "School", "Superhero"],
    description:
      "In a world where most people have superpowers, Izuku Midoriya dreams of becoming a hero despite being born without powers.",
    author: "Kohei Horikoshi",
  },
  {
    id: "9",
    title: "Tokyo Ghoul",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Action", "Horror", "Supernatural"],
    description:
      "Ken Kaneki becomes a half-ghoul after an accident and must learn to survive in both the human and ghoul worlds.",
    author: "Sui Ishida",
  },
  {
    id: "10",
    title: "Death Note",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Mystery", "Psychological", "Supernatural"],
    description:
      "Light Yagami finds a notebook that can kill anyone whose name is written in it. He decides to use it to create a perfect world.",
    author: "Tsugumi Ohba",
  },
  {
    id: "11",
    title: "Fullmetal Alchemist",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Action", "Adventure", "Drama"],
    description:
      "Two brothers search for the Philosopher's Stone to restore their bodies after a failed alchemical experiment.",
    author: "Hiromu Arakawa",
  },
];

/**
 * Self-published series titles
 */
export const mockSelfPublished: Series[] = [
  {
    id: "12",
    title: "Indie Adventure",
    coverUrl: "/default-article-cover.jpg",
    language: "en",
    tags: ["Adventure", "Fantasy"],
    description:
      "A self-published adventure story about a young explorer discovering new worlds.",
    author: "Independent Creator",
  },
  {
    id: "13",
    title: "Digital Dreams",
    coverUrl: "/default-article-cover.jpg",
    language: "en",
    tags: ["Sci-Fi", "Drama"],
    description:
      "A cyberpunk story set in a dystopian future where technology and humanity collide.",
    author: "Digital Artist",
  },
  {
    id: "14",
    title: "Urban Legends",
    coverUrl: "/default-article-cover.jpg",
    language: "en",
    tags: ["Horror", "Mystery"],
    description:
      "A collection of urban legends brought to life through stunning artwork and storytelling.",
    author: "Urban Storyteller",
  },
];

/**
 * Featured series titles
 */
export const mockFeatured: Series[] = [
  {
    id: "15",
    title: "Featured Title: The Legend",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Action", "Adventure", "Fantasy"],
    description:
      "An epic tale of heroes and villains in a world where magic and technology coexist. This featured title showcases the best of modern series storytelling.",
    author: "Featured Author",
    additionalLinks: [
      { label: "Official Website", url: "https://example.com" },
    ],
  },
];

/**
 * Seasonal series (Fall 2025)
 */
export const mockSeasonal: Series[] = [
  {
    id: "16",
    title: "Autumn Leaves",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Drama", "Romance"],
    description: "A seasonal romance story set in autumn.",
    author: "Seasonal Author",
  },
  {
    id: "17",
    title: "Harvest Moon",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Slice of Life", "Comedy"],
    description: "Life in a small farming village during harvest season.",
    author: "Rural Artist",
  },
  {
    id: "18",
    title: "October Winds",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Mystery", "Thriller"],
    description: "A mystery that unfolds as the winds of October blow.",
    author: "Mystery Writer",
  },
  {
    id: "19",
    title: "Fall Festival",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Comedy", "School"],
    description: "High school students prepare for the annual fall festival.",
    author: "School Life Creator",
  },
];

/**
 * Recently added series
 */
export const mockRecentlyAdded: Series[] = [
  {
    id: "20",
    title: "New Release 1",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Action"],
    description: "A brand new action-packed adventure.",
    author: "New Author 1",
  },
  {
    id: "21",
    title: "New Release 2",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Romance"],
    description: "A heartwarming romance story.",
    author: "New Author 2",
  },
  {
    id: "22",
    title: "New Release 3",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Comedy"],
    description: "Laugh-out-loud comedy series.",
    author: "New Author 3",
  },
  {
    id: "23",
    title: "New Release 4",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Horror"],
    description: "A spine-chilling horror story.",
    author: "New Author 4",
  },
  {
    id: "24",
    title: "New Release 5",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Sci-Fi"],
    description: "A futuristic science fiction tale.",
    author: "New Author 5",
  },
  {
    id: "25",
    title: "New Release 6",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Fantasy"],
    description: "An epic fantasy adventure.",
    author: "New Author 6",
  },
  {
    id: "26",
    title: "New Release 7",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Sports"],
    description: "An inspiring sports series.",
    author: "New Author 7",
  },
  {
    id: "27",
    title: "New Release 8",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Music"],
    description: "A story about music and dreams.",
    author: "New Author 8",
  },
  {
    id: "28",
    title: "New Release 9",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Cooking"],
    description: "Delicious recipes and heartwarming stories.",
    author: "New Author 9",
  },
  {
    id: "29",
    title: "New Release 10",
    coverUrl: "/default-article-cover.jpg",
    language: "ja",
    tags: ["Martial Arts"],
    description: "A journey of martial arts mastery.",
    author: "New Author 10",
  },
];
