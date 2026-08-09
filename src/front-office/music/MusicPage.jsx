import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import styles from "./MusicPage.module.css";
import SEO from "../../shared/ui/SEO";

export default function MusicPicks() {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [imageLoaded, setImageLoaded] = useState({});

  useEffect(() => {
    setRecentlyPlayed(sampleMusicData);
    setPodcasts(samplePodcastsData);
  }, []);

  const sampleMusicData = [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      image: "music/image1.png",
      url: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
    },
    {
      id: 2,
      title: "Dance Monkey",
      artist: "Tones and I",
      image: "music/image2.png",
      url: "https://open.spotify.com/track/1rgnBhdG2JDFTbYkYRZAku",
    },
    {
      id: 3,
      title: "Side Effects",
      artist: "The Chainsmokers ft. Emily Warren",
      image: "music/image3.png",
      url: "https://open.spotify.com/track/0bGLvHd0ApdT4t0shCfpzG?si=a1bb180330b049a5",
    },
    {
      id: 4,
      title: "Youngblood",
      artist: "5 Seconds of Summer",
      image: "music/image4.png",
      url: "https://open.spotify.com/track/2iUXsYOEPhVqEBwsqP70rE",
    },
    {
      id: 5,
      title: "Be Alright",
      artist: "Dean Lewis",
      image: "music/image5.png",
      url: "https://open.spotify.com/track/5qrSlOut2rNAWv3ubArkNy",
    },
  ];

  const samplePodcastsData = [
    {
      id: 1,
      title: "العرب في 100 عام",
      artist: "ستيب بودكاست",
      image: "podcast/image1.png",
      url: "https://open.spotify.com/episode/5sIQ4ebjXsMVLK5RbEukEZ?si=9e088120474a4a43",
    },
    {
      id: 2,
      title: "مستقبل الخوف",
      artist: "السبيل",
      image: "podcast/image2.png",
      url: "https://open.spotify.com/episode/5jtCNQcTfBD9SdvsByVidX?si=G_X8542vT8CU3QfnMhrU2w",
    },
    {
      id: 3,
      title: "ارض الميعاد",
      artist: "السبيل",
      image: "podcast/image3.png",
      url: "https://open.spotify.com/episode/1LpFIKRzq66CtY0v87jYWZ?si=p9xXf5sBS3aDaa_-UR0HLw",
    },
    {
      id: 4,
      title: "بنو اسرائيل",
      artist: "السبيل",
      image: "podcast/image4.png",
      url: "https://open.spotify.com/episode/6MfOvHRl467MwXHieGvc3I?si=2d0260cc1549404f",
    },
    {
      id: 5,
      title: "تشرسح الدولة",
      artist: "السبيل",
      image: "podcast/image5.png",
      url: "https://open.spotify.com/episode/2wFLyWV2QPuJQole1Ze7Lc?si=91273ebe999a4c1d",
    },
  ];

  const handleImageLoad = (id) => {
    setImageLoaded((prevState) => ({ ...prevState, [id]: true }));
  };

  return (
    <div className="flex w-full flex-col items-center bg-page p-5">
      <SEO
        title="Music & Podcast Picks"
        description="Music and podcast recommendations from Abdelouahab Bella — what a data analyst and software engineer listens to while building."
        keywords="Abdelouahab Bella music picks, developer podcasts, programming playlist"
      />
      <img
        src="music/bg-music.png"
        className="h-auto w-[70%] max-w-full"
        style={{
          margin: 10,
          marginBottom: 50,
          borderRadius: 10,
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
          // height: "150px",
          transform: "scale(0.8)",
        }}
        alt="Music Picks"
      />
      <section className="mb-10 w-full">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ink">Recently played</h2>
          <button className="cursor-pointer border-none bg-transparent text-sm font-bold text-ink-muted hover:text-ink">
            See all
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-5 md:justify-start">
          {recentlyPlayed.map((music) => (
            <a
              href={music.url}
              key={music.id}
              // styles.musicCard is retained purely for the ::after play-button
              // overlay that stayed in the CSS module.
              className={`${styles.musicCard} relative flex w-37.5 flex-col items-center rounded-md bg-[#181818] p-2.5 text-center text-inherit shadow-sm transition-transform duration-200 ease-standard hover:scale-[1.02] md:w-50`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div>
                {!imageLoaded[music.id] && (
                  <Skeleton height="175px" width="175px" />
                )}
                <img
                  src={music.image}
                  alt={music.title}
                  width="175"
                  height="175"
                  className="relative mb-2.5 max-h-37.5 w-full rounded-sm object-cover shadow-md md:max-h-50"
                  onLoad={() => handleImageLoad(music.id)}
                  style={{ display: imageLoaded[music.id] ? "block" : "none" }}
                />
              </div>
              {imageLoaded[music.id] ? (
                <>
                  <h3 className="mb-1.5 w-full text-lg font-bold text-ink">{music.title}</h3>
                  <p className="text-sm leading-normal text-ink-muted">{music.artist}</p>
                </>
              ) : (
                <div>
                  <Skeleton
                    height={24}
                    width={`60%`}
                    style={{ marginBottom: "10px" }}
                  />
                  <Skeleton width={`80%`} />
                </div>
              )}
            </a>
          ))}
        </div>
      </section>
      <section className="mb-10 w-full">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ink">Podcast picks</h2>
          <button className="cursor-pointer border-none bg-transparent text-sm font-bold text-ink-muted hover:text-ink">
            See all
          </button>
        </div>
        {/* Narrower tracks below md so two podcasts still fit side by side. */}
        <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] justify-center gap-12.5 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
          {podcasts.map((podcast) => (
            <a
              href={podcast.url}
              key={podcast.id}
              className="relative flex h-43.75 w-full flex-row items-center rounded-md bg-[#181818] p-2.5 text-center text-inherit shadow-sm transition-transform duration-200 ease-standard hover:scale-[1.02] md:h-31.25 md:w-auto"
              target="_blank"
              rel="noopener noreferrer"
            >
              {!imageLoaded[podcast.id] ? (
                <Skeleton height="150px" width="150px" />
              ) : (
                <img
                  src={podcast.image}
                  alt={podcast.title}
                  width="150"
                  height="150"
                  className="relative h-full max-h-37.5 w-1/2 rounded-sm object-cover shadow-md md:h-auto"
                  onLoad={() => handleImageLoad(podcast.id)}
                  style={{
                    display: imageLoaded[podcast.id] ? "block" : "none",
                  }}
                />
              )}

              {imageLoaded[podcast.id] ? (
                <div className="ml-2.5 flex flex-col items-start justify-center">
                  <h3 className="mb-1.5 text-sm font-bold text-ink md:text-lg">{podcast.title}</h3>
                  <p className="text-xs leading-normal text-ink-muted md:text-sm">{podcast.artist}</p>
                </div>
              ) : (
                <div>
                  <Skeleton
                    height={24}
                    width={`60%`}
                    style={{ marginBottom: "10px" }}
                  />
                  <Skeleton width={`80%`} />
                </div>
              )}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
