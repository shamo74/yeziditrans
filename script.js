document.addEventListener('DOMContentLoaded', function() {
      let typingTimer;
      const doneTypingInterval = 100;
      const $inuk = document.getElementById("inuk");
      const $braille = document.getElementById("braille");
      let inukKey = {};
      const SPECIAL_RESPONSES = {};

      const jsonLinks = {
        "arabic": "arabic.json",
        "translations": "translations.json",
        "khwark": "khwark.json",
        "juanbi": "juanbi.json",
        "walati": "walati.json"
      };

      // تحميل JSON بناءً على اللغة المختارة
      function loadLanguage(language) {
        fetch(jsonLinks[language])
          .then(response => response.json())
          .then(data => {
            inukKey = data.inukKey || {};
            Object.assign(SPECIAL_RESPONSES, data.SPECIAL_RESPONSES || {});
          })
          .catch(error => console.error('حدث خطأ في جلب الملف JSON:', error));
      }

      // عند تغيير أحد اللغتين
      const languageSelector1 = document.getElementById('languageSelector1');
      const languageSelector2 = document.getElementById('languageSelector2');

      languageSelector1.addEventListener('change', function() {
        loadLanguage(this.value);
      });

      languageSelector2.addEventListener('change', function() {
        loadLanguage(this.value);
      });

      // تبديل اللغات عند الضغط على السهم
      const switchArrow = document.getElementById('switchArrow');
      switchArrow.addEventListener('click', function() {
        const tempValue = languageSelector1.value;
        languageSelector1.value = languageSelector2.value;
        languageSelector2.value = tempValue;
        loadLanguage(languageSelector1.value);
      });

      // تحميل اللغة الافتراضية
      loadLanguage(languageSelector1.value);

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

      // نسخ النص
      const copyButton = document.getElementById('copyButton');
      const brailleTextarea = document.getElementById('braille');

      copyButton.addEventListener('click', () => {
        brailleTextarea.select();
        document.execCommand('copy');
        alert('تم نسخ النص بنجاح!');
      });
    });
