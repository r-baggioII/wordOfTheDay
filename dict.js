const word = "example"; // Change this to look up a different word

const apiURL = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

fetch(apiURL)
  .then(response => {
    if (!response.ok) throw new Error("Word not found in dictionary.");
    return response.json();
  })
  .then(data => {
    const entry = data[0];
    const meaning = entry.meanings[0]?.definitions[0]?.definition || "No definition found.";
    const audioUrl = entry.phonetics.find(p => p.audio)?.audio;

    document.getElementById("word").textContent = word;
    document.getElementById("definition").textContent = meaning;

    document.getElementById("play-audio").onclick = () => {
      if (audioUrl) {
        new Audio(audioUrl).play();
      } else {
        alert("No pronunciation audio available.");
      }
    };
  })
  .catch(error => {
    document.getElementById("word").textContent = "Error";
    document.getElementById("definition").textContent = "Could not fetch word.";
    console.error(error);
  });
