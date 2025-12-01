"use client";

import { SeriesCard } from "@/components/features/series/series-card";
import { AnimatedGrid, AnimatedSection } from "@/components/shared";
import { SERIES_CONSTANTS } from "@/lib/constants/series.constants";
import type { Series } from "@/lib/interface/series.interface";

/**
 * Demo page showcasing AniChart-style anime cards
 * Horizontal layout: cover image on left, information panel on right
 */
export default function AniChartDemoPage() {
  // Dummy anime data matching AniChart style
  const dummyAnime: Series[] = [
    {
      id: "1",
      title: "Yuusha Kei ni Shosu: Choubatsu Yuusha 9004-tai Keimu Kiroku",
      coverUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1-123456.jpg",
      description: "Hero is the worst punishment in the world. For those convicted of heinous crimes, they are sentenced to become a Hero and forced to enter the mandatory military service in the war against the Demon Lords.",
      tags: ["action", "comedy"],
      status: SERIES_CONSTANTS.RELEASING_STATUS.COMING_SOON,
      averageScore: 75,
      season: "winter",
      seasonYear: 2026,
      source: "Light Novel",
      type: SERIES_CONSTANTS.TYPE.ANIME,
    },
    {
      id: "2",
      title: "Demon Slayer: Infinity Train Arc",
      coverUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx2-234567.jpg",
      description: "Tanjiro and his friends board the Infinity Train to help the Flame Hashira, Rengoku, investigate a series of mysterious disappearances.",
      tags: ["action", "supernatural", "shounen"],
      status: SERIES_CONSTANTS.RELEASING_STATUS.RELEASING,
      averageScore: 92,
      season: "winter",
      seasonYear: 2026,
      source: "Manga",
      type: SERIES_CONSTANTS.TYPE.ANIME,
    },
    {
      id: "3",
      title: "My Hero Academia: Season 7",
      coverUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx3-345678.jpg",
      description: "The heroes continue their fight against the villains as society crumbles around them. Deku must master his new powers to save everyone.",
      tags: ["action", "comedy", "school", "super power"],
      status: SERIES_CONSTANTS.RELEASING_STATUS.RELEASING,
      averageScore: 88,
      season: "spring",
      seasonYear: 2026,
      source: "Manga",
      type: SERIES_CONSTANTS.TYPE.ANIME,
    },
    {
      id: "4",
      title: "Attack on Titan: Final Season Part 3",
      coverUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx4-456789.jpg",
      description: "The final battle between Eren and the world reaches its climax. The fate of humanity hangs in the balance.",
      tags: ["action", "drama", "horror", "military"],
      status: SERIES_CONSTANTS.RELEASING_STATUS.FINISHED,
      averageScore: 95,
      season: "fall",
      seasonYear: 2025,
      source: "Manga",
      type: SERIES_CONSTANTS.TYPE.ANIME,
    },
    {
      id: "5",
      title: "Jujutsu Kaisen: Shibuya Incident Arc",
      coverUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5-567890.jpg",
      description: "Yuji and his allies face off against the cursed spirits in Shibuya. The battle for Tokyo begins.",
      tags: ["action", "horror", "supernatural"],
      status: SERIES_CONSTANTS.RELEASING_STATUS.RELEASING,
      averageScore: 90,
      season: "summer",
      seasonYear: 2025,
      source: "Manga",
      type: SERIES_CONSTANTS.TYPE.ANIME,
    },
    {
      id: "6",
      title: "One Piece: Wano Country Arc",
      coverUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx6-678901.jpg",
      description: "Luffy and the Straw Hat Pirates arrive in Wano Country to take down Kaido and free the oppressed people.",
      tags: ["action", "adventure", "comedy", "fantasy"],
      status: SERIES_CONSTANTS.RELEASING_STATUS.ONGOING,
      averageScore: 87,
      season: "winter",
      seasonYear: 2026,
      source: "Manga",
      type: SERIES_CONSTANTS.TYPE.ANIME,
    },
    {
      id: "7",
      title: "Spy x Family: Season 2",
      coverUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx7-789012.jpg",
      description: "The Forger family continues their mission to maintain world peace while keeping their true identities secret from each other.",
      tags: ["action", "comedy", "slice of life"],
      status: SERIES_CONSTANTS.RELEASING_STATUS.RELEASING,
      averageScore: 89,
      season: "spring",
      seasonYear: 2026,
      source: "Manga",
      type: SERIES_CONSTANTS.TYPE.ANIME,
    },
    {
      id: "8",
      title: "Chainsaw Man: Part 2",
      coverUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx8-890123.jpg",
      description: "Denji continues his life as a devil hunter, facing new threats and uncovering the mysteries of the devil world.",
      tags: ["action", "horror", "supernatural"],
      status: SERIES_CONSTANTS.RELEASING_STATUS.COMING_SOON,
      averageScore: 91,
      season: "summer",
      seasonYear: 2026,
      source: "Manga",
      type: SERIES_CONSTANTS.TYPE.ANIME,
    },
    {
      id: "9",
      title: "Tokyo Ghoul: Re",
      coverUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx9-901234.jpg",
      description: "Haise Sasaki, a member of the CCG, must confront his past as Ken Kaneki while fighting against the ghouls.",
      tags: ["action", "drama", "horror", "psychological"],
      status: SERIES_CONSTANTS.RELEASING_STATUS.FINISHED,
      averageScore: 82,
      season: "fall",
      seasonYear: 2024,
      source: "Manga",
      type: SERIES_CONSTANTS.TYPE.ANIME,
    },
    {
      id: "10",
      title: "Mob Psycho 100: Season 3",
      coverUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx10-012345.jpg",
      description: "Mob continues to grow as a person while dealing with his overwhelming psychic powers and the challenges of adolescence.",
      tags: ["action", "comedy", "slice of life", "supernatural"],
      status: SERIES_CONSTANTS.RELEASING_STATUS.FINISHED,
      averageScore: 94,
      season: "fall",
      seasonYear: 2024,
      source: "Manga",
      type: SERIES_CONSTANTS.TYPE.ANIME,
    },
    {
      id: "11",
      title: "Vinland Saga: Season 2",
      coverUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11-123456.jpg",
      description: "Thorfinn seeks redemption and a new purpose in life after the death of his father, traveling to Vinland.",
      tags: ["action", "adventure", "drama", "historical"],
      status: SERIES_CONSTANTS.RELEASING_STATUS.FINISHED,
      averageScore: 96,
      season: "winter",
      seasonYear: 2025,
      source: "Manga",
      type: SERIES_CONSTANTS.TYPE.ANIME,
    },
    {
      id: "12",
      title: "Death Note: Relight",
      coverUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx12-234567.jpg",
      description: "Light Yagami discovers a mysterious notebook that allows him to kill anyone by writing their name in it.",
      tags: ["mystery", "psychological", "supernatural", "thriller"],
      status: SERIES_CONSTANTS.RELEASING_STATUS.FINISHED,
      averageScore: 93,
      season: "fall",
      seasonYear: 2023,
      source: "Manga",
      type: SERIES_CONSTANTS.TYPE.ANIME,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <AnimatedSection loading={false} data={dummyAnime} className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            AniChart-Style Anime Cards
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Vertical poster-style cards with gradient overlays, status badges, and genre pills
          </p>
        </AnimatedSection>

        {/* Grid of AniChart-style cards - Horizontal layout */}
        <AnimatedGrid
          loading={false}
          data={dummyAnime}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
        >
          {dummyAnime.map((anime, index) => (
            <SeriesCard
              key={anime.id}
              series={anime}
              variant="anichart"
              romajiTitle={anime.title}
              startDate={
                anime.seasonYear
                  ? new Date(anime.seasonYear, anime.season === "winter" ? 0 : anime.season === "spring" ? 3 : anime.season === "summer" ? 6 : 9, index % 28 + 1)
                  : undefined
              }
              totalEpisodes={12}
              genres={anime.tags}
              rank={index + 1}
              studio={anime.source === "Light Novel" ? "Studio KAI" : anime.source === "Manga" ? "MAPPA" : "A-1 Pictures"}
            />
          ))}
        </AnimatedGrid>
      </div>
    </div>
  );
}

