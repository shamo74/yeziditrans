document.addEventListener('DOMContentLoaded', function() {
  let typingTimer;
  const doneTypingInterval = 100;
  const $inuk = document.getElementById("inuk");
  const $braille = document.getElementById("braille");
  let inukKey = {};
  const SPECIAL_RESPONSES = {};
  const jsonLinks = {
    "arabic": "arabic.json",
    "ezidi": "ezidi.json",
    "khwark": "khwark.json",
    "juanbi": "juanbi.json",
    "walati": "walati.json"
  };

  function loadLanguage(language, translateInput = true) {
    fetch(jsonLinks[language])
      .then(response => response.json())
      .then(data => {
        inukKey = data.inukKey || {};
        Object.assign(SPECIAL_RESPONSES, data.SPECIAL_RESPONSES || {});
        if (translateInput) {
          inukFunction();
        } else {
          translateBrailleToInuk();
        }
      })
      .catch(error => console.error('حدث خطأ في جلب الملف JSON:', error));
  }

  const languageSelector1 = document.getElementById('languageSelector1');
  const languageSelector2 = document.getElementById('languageSelector2');

  languageSelector1.addEventListener('change', function() {
    loadLanguage(this.value, true);
  });

  languageSelector2.addEventListener('change', function() {
    loadLanguage(this.value, false);
  });

  const switchArrow = document.getElementById('switchArrow');
  switchArrow.addEventListener('click', function() {
    this.classList.add('rotating');
    setTimeout(() => {
      this.classList.remove('rotating');
    }, 500);

    const tempValue = languageSelector1.value;
    languageSelector1.value = languageSelector2.value;
    languageSelector2.value = tempValue;

    const tempText = $inuk.value;
    $inuk.value = $braille.value;
    $braille.value = tempText;

    loadLanguage(languageSelector1.value, true);
  });

  loadLanguage(languageSelector1.value, true);

  $inuk.addEventListener('keyup', function() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(inukFunction, doneTypingInterval);
  });

  function inukFunction() {
    const inuk = $inuk.value;
    const words = inuk.split(/\s+/);
    let result = "";
    let i = 0;

    while (i < words.length) {
      let phraseFound = false;

      for (const phrase in SPECIAL_RESPONSES) {
        const phraseWords = phrase.split(" ");
        let match = true;

        for (let j = 0; j < phraseWords.length; j++) {
          if (words[i + j] !== phraseWords[j]) {
            match = false;
            break;
          }
        }

        if (match) {
          result += SPECIAL_RESPONSES[phrase] + " ";
          i += phraseWords.length;
          phraseFound = true;
          break;
        }
      }

      if (!phraseFound) {
        let word = words[i];
        const translated = inukKey[word] || word;
        result += translated + " ";
        i++;
      }
    }

    $braille.value = result.trim();
  }

  function translateBrailleToInuk() {
    const brailleText = $braille.value;
    const words = brailleText.split(/\s+/);
    let result = "";
    let i = 0;

    while (i < words.length) {
      let phraseFound = false;

      for (const phrase in SPECIAL_RESPONSES) {
        const phraseWords = phrase.split(" ");
        let match = true;

        for (let j = 0; j < phraseWords.length; j++) {
          if (words[i + j] !== phraseWords[j]) {
            match = false;
            break;
          }
        }

        if (match) {
          result += SPECIAL_RESPONSES[phrase] + " ";
          i += phraseWords.length;
          phraseFound = true;
          break;
        }
      }

      if (!phraseFound) {
        let word = words[i];
        const translated = Object.keys(inukKey).find(key => inukKey[key] === word) || word;
        result += translated + " ";
        i++;
      }
    }

    $inuk.value = result.trim();
  }
});
