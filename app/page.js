
'use client';
import Image from 'next/image';
import styles from './page.module.css';
import { useState } from 'react';

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [speaking, setSpeaking] = useState(false);

  // Fetch transcript data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/data?topic=${encodeURIComponent(searchInput)}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      setTranscript(json.transcript);
      setHasData(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate and play audio for each line
  const speakTranscript = async () => {
    setSpeaking(true);

    for (const line of transcript) {
      try {
        const ttsRes = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: line.message, speaker: line.speaker }),
        });

        if (!ttsRes.ok) throw new Error('TTS request failed');

        const blob = await ttsRes.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        await new Promise((resolve) => {
          audio.onended = resolve;
          audio.play();
        });

        URL.revokeObjectURL(url);
      } catch (e) {
        console.error('Error playing TTS:', e);
      }
    }

    setSpeaking(false);
  };

  if (!hasData) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.searchContainer}>
            <div className={styles.headerText}>
              What topic would you like to learn about?
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter topic"
            />
            <button onClick={fetchData} className={styles.submitBtn} disabled={isLoading || !searchInput}>
              {isLoading ? 'Loading...' : 'Submit'}
            </button>
            {error && <div className={styles.error}>{error}</div>}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <button onClick={speakTranscript} disabled={speaking || transcript.length === 0}>
          {speaking ? 'Speaking...' : 'Play Conversation'}
        </button>
      </main>
    </div>
  );
}
