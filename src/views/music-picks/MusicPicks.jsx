import { useState, useEffect } from 'react';
import styles from './MusicPicks.module.css';

export default function MusicPicks() {
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const [bestSongs, setBestSongs] = useState([]);
    
    useEffect(() => {
        setRecentlyPlayed(sampleMusicData);
        setBestSongs(sampleMusicData);
    }, []);
    const sampleMusicData = [
      {
        id: 1,
        title: "Song 1",
        artist: "Artist 1",
        image: "social/image.png",
      },
      {
        id: 2,
        title: "Song 2",
        artist: "Artist 2",
        image: "social/image.png",
      },
      {
        id: 3,
        title: "Song 3",
        artist: "Artist 3",
        image: "social/image.png",
      },
    ];

    // Set the sample music data to the state variables

    return (
      <div className={styles.MusicPicks}>
        <section className={styles.musicSection}>
          <h2>Recently Played</h2>
          <div className={styles.musicCards}>
            {recentlyPlayed.map((music) => (
              <div key={music.id} className={styles.musicCard}>
                {/* Render recently played music card */}
                <img
                  src={music.image}
                  alt={music.title}
                  width="150"
                  height="150"
                />
                <h3>{music.title}</h3>
                <p>{music.artist}</p>
              </div>
            ))}
          </div>
        </section>
        <section className={styles.musicSection}>
          <h2>Best Songs</h2>
          <div className={styles.musicCards}>
            {bestSongs.map((music) => (
              <div key={music.id} className={styles.musicCard}>
                {/* Render best songs music card */}
                <img
                  src={music.image}
                  alt={music.title}
                  width="150"
                  height="150"
                />
                <h3>{music.title}</h3>
                <p>{music.artist}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
}
