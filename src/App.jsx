import { useState } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [speaking, setSpeaking] = useState(false)

  const speak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Try to use the Neerja voice if available
      const voices = window.speechSynthesis.getVoices()
      const neerjaVoice = voices.find(voice => voice.name.includes('Neerja'))
      if (neerjaVoice) {
        utterance.voice = neerjaVoice
      }

      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => setSpeaking(false)
      
      window.speechSynthesis.speak(utterance)
    } else {
      alert('Speech synthesis is not supported in your browser.')
    }
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  return (
    <div className="container">
      <h1>Text to Speech</h1>
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
          disabled={speaking || !text}
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
    </div>
  )
}

export default App
