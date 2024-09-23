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

  function loadLanguage(language) {
    fetch(jsonLinks[language])
      .then(response => response.json())
      .then(data => {
        inukKey = data.inukKey || {};
        Object.assign(SPECIAL_RESPONSES, data.SPECIAL_RESPONSES || {});
      })
      .catch(error => console.error('حدث خطأ في جلب الملف JSON:', error));
  }

  const languageSelector1 = document.getElementById('languageSelector1');
  const languageSelector2 = document.getElementById('languageSelector2');

  languageSelector1.addEventListener('change', function() {
    loadLanguage(this.value);
  });

  languageSelector2.addEventListener('change', function() {
    loadLanguage(this.value);
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
    loadLanguage(languageSelector1.value);
  });

  loadLanguage(languageSelector1.value);

  $inuk.addEventListener('keyup', function() {
    const keypressSound = document.getElementById('keypressSound');
    keypressSound.currentTime = 0; // إعادة تشغيل الصوت
    keypressSound.play(); // تشغيل الصوت

    clearTimeout(typingTimer);
    typingTimer = setTimeout(inukFunction, doneTypingInterval);
    adjustFontSize($inuk.value);
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
    adjustFontSize($braille.value);
  }

  function adjustFontSize(text) {
    const wordCount = text.split(/\s+/).length;
    const baseSize = 20;
    const maxSize = 30;
    const minSize = 15;
    const fontSize = Math.max(minSize, Math.min(maxSize, baseSize - wordCount * 0.5));
    $inuk.style.fontSize = fontSize + 'px';
    $braille.style.fontSize = fontSize + 'px';
  }

  const copyButton = document.getElementById('copyButton');

  copyButton.addEventListener('click', () => {
    const translatedText = $braille.value;
    navigator.clipboard.writeText(translatedText)
      .then(() => {
        alert('تم نسخ النص بنجاح!');
      })
      .catch(err => {
        console.error('حدث خطأ أثناء النسخ:', err);
      });
  });

  function copyText() {
    const translatedText = $braille.value;
    navigator.clipboard.writeText(translatedText)
      .then(() => {
        alert('تم نسخ النص المترجم بنجاح!');
      })
      .catch(err => {
        console.error('حدث خطأ أثناء النسخ:', err);
      });
  }
});
