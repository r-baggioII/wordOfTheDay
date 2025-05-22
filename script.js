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
  try {
    const res = await fetch('daily-word.json');
    const data = await res.json();

    document.getElementById("word").textContent = data.word;
    document.getElementById("definition").textContent = data.definition;

    document.getElementById("play-audio").onclick = () => {
      useBrowserTTS(data.word, data.phonetic);
    };
  } catch (err) {
    document.getElementById("word").textContent = "Error";
    document.getElementById("definition").textContent = "Failed to load word.";
  }
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