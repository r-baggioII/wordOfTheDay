document.addEventListener('DOMContentLoaded', () => {
  displayWord();
});

const getRandomWord = async () => {
  try {
    const response = await fetch('https://random-word-api.herokuapp.com/word');
    if (!response.ok) throw new Error("Error getting random word");
    const data = await response.json();
    return data[0]; // e.g., "apple"
  } catch (err) {
    console.error("Error fetching random word:", err);
    // Fallback words in case the random word API fails
    const fallbackWords = ["serendipity", "ephemeral", "quintessential", "eloquent", "benevolent", "meticulous"];
    return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
  }
};

const getDictionaryData = async (word) => {
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  if (!response.ok) throw new Error("Word not found in dictionary");
  return response.json();
};

const displayWord = async () => {
  let word, data;
  let attempts = 0;
  const maxAttempts = 10; // Increase attempts to find a good word

  while (attempts < maxAttempts) {
    try {
      word = await getRandomWord();
      console.log(`Attempting with word: ${word}`);
      attempts++;

      data = await getDictionaryData(word);
      
      // Successfully found a word with definition
      break;
    } catch (err) {
      console.warn(`Try ${attempts}: Failed to fetch dictionary data for "${word}".`, err);
      
      // Wait briefly before trying again to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  if (!data) {
    document.getElementById("word").textContent = "Error";
    document.getElementById("definition").textContent = "Could not find a valid word after multiple attempts.";
    return;
  }

  const entry = data[0];
  const meaning = entry.meanings[0]?.definitions[0]?.definition || "No definition found.";
  const phonetic = entry.phonetic || entry.phonetics.find(p => p.text)?.text || "";

  document.getElementById("word").textContent = word;
  document.getElementById("definition").textContent = meaning;

  // Add phonetic display if you want (optional)
  // You could add a new element in your HTML for this, like:
  // <div id="phonetic"></div>
  // And then: document.getElementById("phonetic").textContent = phonetic || "";

  document.getElementById("play-audio").onclick = () => {
    // Siempre usar el TTS del navegador, ignorando el audio de la API
    console.log("Usando TTS del navegador para pronunciación");
    useBrowserTTS(word, phonetic);
  };
};

function useBrowserTTS(word) {
  // Check if browser supports speech synthesis
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    
    // Set language to English
    utterance.lang = 'en-US';
    
    // Set rate slightly slower for clearer pronunciation
    utterance.rate = 0.9;
    
    // Use a consistent voice selection approach
    setTimeout(() => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Filter for English voices
        const englishVoices = voices.filter(voice => 
          voice.lang.startsWith('en-')
        );
        
        if (englishVoices.length > 0) {
          // Select only one voice - the first English voice available
          utterance.voice = englishVoices[0];
          
          // Optional: Log which voice is being used for debugging
          console.log(`Using voice: ${utterance.voice.name}`);
        }
      }
      
      // Play the pronunciation
      window.speechSynthesis.speak(utterance);
    }, 100); // Short delay to ensure voices are loaded
  } else {
    alert("Your browser does not support speech synthesis.");
  }
}