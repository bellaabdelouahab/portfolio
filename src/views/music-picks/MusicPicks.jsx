import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import styles from "./MusicPicks.module.css";

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
    },
    {
      id: 2,
      title: "Dance Monkey",
      artist: "Tones and I",
      image: "music/image2.png",
    },
    {
      id: 3,
      title: "Side Effects",
      artist: "The Chainsmokers ft. Emily Warren",
      image: "music/image3.png",
    },
    {
      id: 4,
      title: "Youngblood",
      artist: "5 Seconds of Summer",
      image: "music/image4.png",
    },
    {
      id: 5,
      title: "Be Alright",
      artist: "Dean Lewis",
      image: "music/image5.png",
    },
  ];

  const samplePodcastsData = [
    {
      id: 1,
      title: "The Daily",
      artist: "The New York Times",
      image: "podcast/image1.png",
    },
    {
      id: 2,
      title: "مستقبل الخوف",
      artist: "السبيل",
      image: "podcast/image2.png",
    },
    {
      id: 3,
      title: "ارض الميعاد",
      artist: "السبيل",
      image: "podcast/image3.png",
    },
    {
      id: 4,
      title: "بنو اسرائيل",
      artist: "السبيل",
      image: "podcast/image4.png",
    },
    {
      id: 5,
      title: "تشرسح الدولة",
      artist: "السبيل",
      image: "podcast/image5.png",
    },
  ];

  const handleImageLoad = (id) => {
    setImageLoaded((prevState) => ({ ...prevState, [id]: true }));
  };

  return (
    <div className={styles.MusicPicks}>
      <img
        src="/bg-copy_LE_auto_x2.png"
        style={{
          margin: 10,
          marginBottom: 50,
          borderRadius: 10,
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
          height: "150px",
        }}
        alt="Music Picks"
      />
      <section className={styles.musicSection}>
        <div className={styles.sectionTitle}>
          <h2>Recently played</h2>
          <button>See all</button>
        </div>
        <div className={styles.musicCards}>
          {recentlyPlayed.map((music) => (
            <div key={music.id} className={styles.musicCard}>
              <div className={styles.imageWrapper}>
                {!imageLoaded[music.id] && (
                  <Skeleton height="175px" width="175px" />
                )}
                <img
                  src={music.image}
                  alt={music.title}
                  width="175"
                  height="175"
                  onLoad={() => handleImageLoad(music.id)}
                  style={{ display: imageLoaded[music.id] ? "block" : "none" }}
                />
              </div>
              {imageLoaded[music.id] ? (
                <>
                  <h3>{music.title}</h3>
                  <p>{music.artist}</p>
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
            </div>
          ))}
        </div>
      </section>
      <section className={styles.musicSection}>
        <div className={styles.sectionTitle}>
          <h2>Podcast picks</h2>
          <button>See all</button>
        </div>
        <div className={styles.podcastCards}>
          {podcasts.map((podcast) => (
            <div key={podcast.id} className={styles.podcastCard}>
              {!imageLoaded[podcast.id] ? (
                <Skeleton height="150px" width="150px" />
              ) : (
                <img
                  src={podcast.image}
                  alt={podcast.title}
                  width="150"
                  height="150"
                  onLoad={() => handleImageLoad(podcast.id)}
                  style={{
                    display: imageLoaded[podcast.id] ? "block" : "none",
                  }}
                />
              )}

              {imageLoaded[podcast.id] ? (
                <div className={styles.podcastInfo}>
                  <h3>{podcast.title}</h3>
                  <p>{podcast.artist}</p>
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
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
