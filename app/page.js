'use client';
import Image from 'next/image';
import styles from './page.module.scss';
import { useState,useEffect,useRef  } from 'react';
import MicrophoneContent from './component/MicrophoneSection';
import AudioVisualizer from './component/AudioVisualizer';  // Import the AudioVisualizer component
import MouseLightWrapper from './component/MouseLightWrapper';
export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const [allSpeakersData,setAllSpeakersData] = useState([
    {name:"Chile",gender:"male",language:"english",voiceIndex:0},
    {name:"India",gender:"female",language:"spanish",voiceIndex:1},
  ]);
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(-1); // State to hold the current audio
  const currentAudioRef = useRef(null); // instead of useState(null)
  // const [currentAudio, setCurrentAudio] = useState(null); // State to hold the current audio -->SWAPPED FOR REF



  useEffect(() => {
    // This code will only run on the client
  }, []);


  // Fetch transcript data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/data?topic=${encodeURIComponent(searchInput)}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      setTranscript(json.transcript);
      console.log(json.transcript)
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
    const audioQueue = [];
    const speakerQueue = [];

    // Prefetch first 2 audio clips
    for (let i = 0; i < Math.min(2, transcript.length); i++) {
      const line = transcript[i];
      const audio = await fetchAndCreateAudio(line.message, line.speaker);
      audioQueue[i] = audio;
      speakerQueue[i] = line.speaker;
    }
  
    for (let i = 0; i < transcript.length; i++) {
      const currentAudio = audioQueue[i];
      if (!currentAudio) break;
  
      // Start fetching the next audio while the current one plays
      const nextIndex = i + 2;
      if (nextIndex < transcript.length) {
        fetchAndCreateAudio(transcript[nextIndex].message, transcript[nextIndex].speaker).then((audio) => {
          audioQueue[nextIndex] = audio;
          speakerQueue[nextIndex] = transcript[nextIndex].speaker;
        });
      }

      // setCurrentAudio(currentAudio);  // Set the audio to state  --> Replaced with REF
      currentAudioRef.current = currentAudio;
      setCurrentSpeakerIndex(speakerQueue[i]);

      await new Promise((resolve) => {
        currentAudio.onended = resolve;
        currentAudio.play();
      });
    }
  
    setSpeaking(false);
  };
  
  const fetchAndCreateAudio = async (text, speakerIndex) => {
    const ttsRes = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        speakerIndex: speakerIndex,
        voiceIndex: allSpeakersData[speakerIndex].voiceIndex,
      }),
    });
  
    if (!ttsRes.ok) throw new Error('TTS request failed');
    const blob = await ttsRes.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
  
    // Clean up the object URL after playback
    audio.onended = () => {
      URL.revokeObjectURL(url);
    };
  
    return audio;
  };

  if (!hasData) {
    return (
      <MouseLightWrapper>
        <div className={styles.page}>
          <main className={styles.main}>
            <MicrophoneContent/>
            <div className={styles.searchContainer}>
              <div className={styles.headerText}>
                What topic would you like to learn about?
              </div>
              <form onSubmit={(e) => { e.preventDefault(); fetchData(); }}>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter topic"
                  aria-label="Topic input"
                  required
                />
                <button 
                  type="submit"
                  className={styles.submitBtn} 
                  disabled={isLoading || !searchInput}
                  aria-label={isLoading ? 'Loading, please wait' : 'Submit search'}
                >
                  {isLoading ? 'Generating...' : 'Submit'}
                </button>
              </form>
              {error && <div className={styles.error}>{error}</div>}
            </div>
          </main>
        </div>
      </MouseLightWrapper>
    );
  }
  

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <button onClick={speakTranscript} disabled={speaking || transcript.length === 0}>
          {speaking ? 'Speaking...' : 'Play Conversation'}
        </button>
        
        {/* Only pass audio prop when currentAudio is set */}
        <div className={styles.audioVisualizationContainer}>
          {allSpeakersData.map((speakerData,i)=>{
            return <AudioVisualizer isOn={currentSpeakerIndex == i?true:false} key={i} color={AUDIO_COLORS[i]}/>  
          })}
        </div>
       

      </main>
    </div>
  );
}



const AUDIO_COLORS = [
  "#9e9eff",
  "#ffc0fb",
  "#c0ffd0"
]