import { useState, useEffect } from 'react';
import { FaMagic, FaCog, FaPlay, FaStop, FaTimes, FaVolumeUp, FaCheck, FaSearch, FaMicrophone } from 'react-icons/fa';
import { generateSpeechText } from './groqApi';
import './App.css';

function VoiceCard({ voice, isSelected, onSelect, onTest, isNirja }) {
  const [isTesting, setIsTesting] = useState(false);

  const handleTest = () => {
    setIsTesting(true);
    onTest("Hello, this is a test of my voice. How do I sound?", voice, () => setIsTesting(false));
  };

  return (
    <div className={`voice-card ${isSelected ? 'selected' : ''} ${isNirja ? 'nirja' : ''}`}>
      <div className="voice-card-content">
        <div className="voice-info">
          <div className="voice-name">
            {isNirja && <FaMicrophone className="nirja-icon" />}
            <h4>{voice.name}</h4>
          </div>
          <span className="voice-lang">{voice.lang}</span>
        </div>
        <div className="voice-actions">
          <button 
            className="voice-test-btn"
            onClick={handleTest}
            disabled={isTesting}
          >
            {isTesting ? <FaStop /> : <FaVolumeUp />}
          </button>
          <button 
            className={`voice-select-btn ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(voice)}
          >
            {isSelected ? <FaCheck /> : 'Select'}
          </button>
        </div>
      </div>
      {isNirja && (
        <div className="nirja-badge">
          Recommended Voice
        </div>
      )}
    </div>
  );
}

function App() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [generating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState("Generate a natural and engaging paragraph that would sound good when read aloud.");
  const [error, setError] = useState('');
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [femaleVoices, setFemaleVoices] = useState([]);
  const [maleVoices, setMaleVoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      console.log('All Available Voices:', availableVoices);
      
      if (availableVoices.length > 0) {
        setVoices(availableVoices);

        const female = [];
        const male = [];
        
        availableVoices.forEach(voice => {
          console.log('Processing voice:', {
            name: voice.name,
            lang: voice.lang,
            isMicrosoft: voice.name.includes('Microsoft')
          });

          if (voice.name.includes('Microsoft')) {
            if (
              voice.name.includes('Nirja') ||
              voice.name.includes('Zira') ||
              voice.name.includes('Heera') ||
              voice.name.includes('Susan') ||
              voice.name.includes('Eva') ||
              voice.name.includes('Catherine') ||
              voice.name.includes('Hazel') ||
              voice.name.includes('Helen') ||
              voice.name.includes('Laura') ||
              voice.name.includes('Sonia') ||
              voice.name.includes('Yaoyao') ||
              voice.name.includes('Huihui') ||
              voice.name.includes('Haruka') ||
              voice.name.includes('Sayaka') ||
              voice.name.includes('Julie') ||
              voice.name.includes('Caroline') ||
              voice.name.includes('Maria') ||
              voice.name.includes('Paulina') ||
              voice.name.includes('Irina') ||
              voice.name.includes('Anna') ||
              voice.name.includes('Hedda')
            ) {
              female.push(voice);
              console.log('Added to female voices:', voice.name);
            } 
            else if (
              voice.name.includes('David') ||
              voice.name.includes('Mark') ||
              voice.name.includes('James') ||
              voice.name.includes('Richard') ||
              voice.name.includes('George') ||
              voice.name.includes('Ravi') ||
              voice.name.includes('Pablo') ||
              voice.name.includes('Raul') ||
              voice.name.includes('Paul') ||
              voice.name.includes('Claude') ||
              voice.name.includes('Stefan') ||
              voice.name.includes('Kangkang') ||
              voice.name.includes('Zhiwei') ||
              voice.name.includes('Ichiro') ||
              voice.name.includes('Daniel') ||
              voice.name.includes('Pavel') ||
              voice.name.includes('Adam')
            ) {
              male.push(voice);
              console.log('Added to male voices:', voice.name);
            }
            else {
              male.push(voice);
              console.log('Added to male voices (fallback):', voice.name);
            }
          } else {
            if (voice.name.toLowerCase().includes('female') || 
                voice.lang.includes('female')) {
              female.push(voice);
              console.log('Added to female voices (non-Microsoft):', voice.name);
            } else {
              male.push(voice);
              console.log('Added to male voices (non-Microsoft):', voice.name);
            }
          }
        });

        console.log('Final Female Voices:', female.map(v => v.name));
        console.log('Final Male Voices:', male.map(v => v.name));

        const priorityOrder = [
          'Nirja',
          'Zira',
          'Heera',
          'Susan',
          'David',
          'Ravi'
        ];

        female.sort((a, b) => {
          const aIndex = priorityOrder.findIndex(name => a.name.includes(name));
          const bIndex = priorityOrder.findIndex(name => b.name.includes(name));
          
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          
          const aLang = a.lang.split('-')[0];
          const bLang = b.lang.split('-')[0];
          if (aLang === 'en') return -1;
          if (bLang === 'en') return 1;
          
          return a.name.localeCompare(b.name);
        });

        male.sort((a, b) => {
          const aIndex = priorityOrder.findIndex(name => a.name.includes(name));
          const bIndex = priorityOrder.findIndex(name => b.name.includes(name));
          
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          
          const aLang = a.lang.split('-')[0];
          const bLang = b.lang.split('-')[0];
          if (aLang === 'en') return -1;
          if (bLang === 'en') return 1;
          
          return a.name.localeCompare(b.name);
        });

        console.log('Sorted Female Voices:', female.map(v => v.name));
        console.log('Sorted Male Voices:', male.map(v => v.name));

        setFemaleVoices(female);
        setMaleVoices(male);

        const nirjaVoice = availableVoices.find(voice => 
          voice.name.includes('Microsoft Nirja')
        );
        
        if (nirjaVoice) {
          console.log('Found Nirja voice:', nirjaVoice.name);
          setSelectedVoice(nirjaVoice);
        } else {
          console.log('Nirja voice not found, trying fallbacks...');
          const ziraVoice = availableVoices.find(voice => 
            voice.name.includes('Microsoft Zira')
          );
          const heeraVoice = availableVoices.find(voice => 
            voice.name.includes('Microsoft Heera')
          );
          const susanVoice = availableVoices.find(voice => 
            voice.name.includes('Microsoft Susan')
          );
          const anyMicrosoftFemale = availableVoices.find(voice => 
            voice.name.includes('Microsoft') && female.includes(voice)
          );
          const anyFemale = female[0];
          
          const selectedVoice = nirjaVoice || 
            ziraVoice || 
            heeraVoice || 
            susanVoice || 
            anyMicrosoftFemale || 
            anyFemale || 
            availableVoices[0];
            
          console.log('Selected fallback voice:', selectedVoice?.name);
          setSelectedVoice(selectedVoice);
        }
      } else {
        console.log('No voices available yet');
      }
    };

    loadVoices();

    window.speechSynthesis.onvoiceschanged = () => {
      console.log('Voices changed event fired');
      loadVoices();
    };

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakText = (textToSpeak, voiceToUse, onEnd = null) => {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.voice = voiceToUse;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      setSpeaking(false);
      if (onEnd) onEnd();
      setError('Error occurred while speaking');
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeak = () => {
    if (!text || !selectedVoice) return;
    speakText(text, selectedVoice);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const handleGenerateText = async () => {
    try {
      setGenerating(true);
      setError('');
      const generatedText = await generateSpeechText(prompt);
      setText(generatedText);
    } catch (err) {
      setError(`Failed to generate text: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const filteredFemaleVoices = femaleVoices.filter(voice => 
    voice.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMaleVoices = maleVoices.filter(voice => 
    voice.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app">
      <div className="card">
        <header className="header">
          <div className="header-title">
            <h1>Text to Speech</h1>
            {selectedVoice && (
              <span className="current-voice">
                Current Voice: {selectedVoice.name}
              </span>
            )}
          </div>
          <div className="header-buttons">
            <button 
              onClick={() => {
                console.log('Manual voice refresh');
                window.speechSynthesis.getVoices();
              }}
              className="refresh-button"
            >
              Refresh Voices
            </button>
            <button 
              className="voice-selector-toggle"
              onClick={() => setShowVoiceSelector(!showVoiceSelector)}
            >
              {showVoiceSelector ? <FaTimes /> : <FaCog />}
              {showVoiceSelector ? 'Close Settings' : 'Voice Settings'}
            </button>
          </div>
        </header>

        <div className="main-container">
          <div className={`voice-selector ${showVoiceSelector ? 'show' : ''}`}>
            <div className="voice-selector-header">
              <h2>Voice Selection</h2>
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search voices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="voice-categories">
              <div className="voice-category">
                <h3>Female Voices ({filteredFemaleVoices.length})</h3>
                <div className="voice-list">
                  {filteredFemaleVoices.map((voice) => (
                    <VoiceCard
                      key={voice.name}
                      voice={voice}
                      isSelected={selectedVoice?.name === voice.name}
                      onSelect={setSelectedVoice}
                      onTest={speakText}
                      isNirja={voice.name.includes('Nirja')}
                    />
                  ))}
                </div>
              </div>

              <div className="voice-category">
                <h3>Male Voices ({filteredMaleVoices.length})</h3>
                <div className="voice-list">
                  {filteredMaleVoices.map((voice) => (
                    <VoiceCard
                      key={voice.name}
                      voice={voice}
                      isSelected={selectedVoice?.name === voice.name}
                      onSelect={setSelectedVoice}
                      onTest={speakText}
                      isNirja={false}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="content">
            <div className="prompt-container glass-effect">
              <h3>AI Prompt</h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="prompt-input"
              />
            </div>

            <div className="text-container glass-effect">
              <h3>Generated Text</h3>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Generated text will appear here..."
                className="text-input"
              />
            </div>

            <div className="controls-panel glass-effect">
              <div className="header-buttons">
                <button
                  onClick={handleGenerateText}
                  disabled={generating}
                  className="generate-button"
                >
                  <FaMagic /> {generating ? 'Generating...' : 'Generate Text'}
                </button>
                <button
                  onClick={handleSpeak}
                  disabled={!text || speaking || !selectedVoice}
                  className="speak-button"
                >
                  <FaPlay /> {speaking ? 'Speaking...' : 'Speak'}
                </button>
                {speaking && (
                  <button
                    onClick={stopSpeaking}
                    className="stop-button"
                  >
                    <FaStop /> Stop
                  </button>
                )}
              </div>

              <div className="voice-controls">
                <div className="control">
                  <label>Rate: {rate.toFixed(1)}x</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                  />
                </div>
                <div className="control">
                  <label>Pitch: {pitch.toFixed(1)}</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                  />
                </div>
                <div className="control">
                  <label>Volume: {Math.round(volume * 100)}%</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {error && <div className="error glass-effect">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
