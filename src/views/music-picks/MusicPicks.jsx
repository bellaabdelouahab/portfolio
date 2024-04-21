import { useState, useEffect } from "react";
import styles from "./MusicPicks.module.css";

export default function MusicPicks() {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [podcasts, setPodcasts] = useState([]);

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

  // Set the sample music data to the state variables

  return (
    <div className={styles.MusicPicks}>
      {/* imge at the top */}
      <img
        src="/bg-copy_LE_auto_x2.png"
        width={700}
        style={{
          margin: 10,
          marginBottom: 50,
          borderRadius: 10,
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.",
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
              {/* Render recently played music card */}
              <img
                src={music.image}
                alt={music.title}
                width="175"
                height="175"
              />
              <h3>{music.title}</h3>
              <p>{music.artist}</p>
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
          {podcasts.map((music) => (
            <div key={music.id} className={styles.podcastCard}>
              {/* Render best songs music card */}
              <img
                src={music.image}
                alt={music.title}
                width="150"
                height="150"
              />
              <div className={styles.podcastInfo}>
                <h3>{music.title}</h3>
                <p>{music.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
