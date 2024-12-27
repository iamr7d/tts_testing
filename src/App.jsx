import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const [voiceLoaded, setVoiceLoaded] = useState(false)
  const [customVoice, setCustomVoice] = useState(null)

  useEffect(() => {
    // Function to load and initialize the custom voice
    const loadCustomVoice = async () => {
      try {
        const response = await fetch('/MicrosoftWindows.Voice.en-IN.Neerja.1_1.0.5.0_x64__cw5n1h2txyewy.Msix');
        if (!response.ok) throw new Error('Failed to load voice package');
        
        // Initialize the voice
        if ('speechSynthesis' in window) {
          window.speechSynthesis.onvoiceschanged = () => {
            const voices = window.speechSynthesis.getVoices();
            const neerjaVoice = voices.find(voice => voice.name.includes('Neerja'));
            if (neerjaVoice) {
              setCustomVoice(neerjaVoice);
              setVoiceLoaded(true);
            }
          };
        }
      } catch (error) {
        console.error('Error loading voice:', error);
        // Fallback to default voice
        setVoiceLoaded(true);
      }
    };

    loadCustomVoice();
  }, []);

  const speak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Use custom voice if available
      if (customVoice) {
        utterance.voice = customVoice;
      }

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported in your browser.');
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <div className="container">
      <h1>Text to Speech with Neerja Voice</h1>
      {!voiceLoaded && <p className="loading">Loading voice package...</p>}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert to speech..."
        rows="6"
        className="text-input"
      />
      <div className="button-container">
        <button 
          onClick={speak}
          disabled={speaking || !text || !voiceLoaded}
          className="speak-button"
        >
          {speaking ? 'Speaking...' : 'Speak'}
        </button>
        {speaking && (
          <button 
            onClick={stopSpeaking}
            className="stop-button"
          >
            Stop
          </button>
        )}
      </div>
      <div className="voice-status">
        {customVoice ? 
          <p className="voice-active">Using Neerja Voice</p> : 
          <p className="voice-fallback">Using Default Voice</p>
        }
      </div>
    </div>
  );
}

export default App
