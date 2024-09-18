document.addEventListener('DOMContentLoaded', function() {
    var typingTimer;
    var doneTypingInterval = 100;
    var $inuk = document.getElementById("inuk");
    var $braille = document.getElementById("braille");
    var wordsWritten = [];
    var inukKey = {};
    var SPECIAL_RESPONSES = {};

    var currentTranslationFile = 'translations.json'; // الملف الافتراضي

    // تحميل محتويات JSON بناءً على اللغة المختارة
    function loadTranslationFile(fileName) {
        fetch(fileName)
            .then(response => response.json())
            .then(data => {
                Object.assign(inukKey, data.inukKey);
                Object.assign(SPECIAL_RESPONSES, data.SPECIAL_RESPONSES);
                translateText();
            })
            .catch(error => console.error('حدث خطأ في جلب الملف JSON:', error));
    }

    // تحميل الملف الافتراضي عند بدء الصفحة
    loadTranslationFile(currentTranslationFile);

    $inuk.addEventListener('keyup', function() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(inukFunction, doneTypingInterval);
    });

    function inukFunction() {
        translateText();
    }

    function translateText() {
        var inuk = $inuk.value;
        var words = inuk.split(/\s+/);
        var result = "";
        var i = 0;

        while (i < words.length) {
            var phraseFound = false;

            for (var phrase in SPECIAL_RESPONSES) {
                if (SPECIAL_RESPONSES.hasOwnProperty(phrase)) {
                    var phraseWords = phrase.split(" ");
                    var match = true;

                    for (var j = 0; j < phraseWords.length; j++) {
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
            }

            if (!phraseFound) {
                var word = words[i];

                if (!wordsWritten.includes(word)) {
                    wordsWritten.push(word);
                }

                var translated = false;
                for (var key in inukKey) {
                    if (inukKey.hasOwnProperty(key)) {
                        if (word === key) {
                            result += inukKey[key][0] + " " + inukKey[key][1] + " ";
                            translated = true;
                            break;
                        }
                    }
                }

                if (!translated) {
                    result += word + " ";
                }
                i++;
            }
        }

        $braille.value = result.trim();
    }

    // تبديل اللغات عند الضغط على السهم
    document.getElementById('swapBtn').addEventListener('click', function() {
        var fromLangBtn = document.getElementById('fromLang');
        var toLangBtn = document.getElementById('toLang');

        if (fromLangBtn.textContent === 'العربية') {
            fromLangBtn.textContent = 'الإنجليزية';
            toLangBtn.textContent = 'العربية';
            document.body.style.direction = "ltr"; // من اليسار لليمين
            currentTranslationFile = 'translations-sh.json'; // التحويل إلى الإنجليزية
        } else {
            fromLangBtn.textContent = 'العربية';
            toLangBtn.textContent = 'الإنجليزية';
            document.body.style.direction = "rtl"; // من اليمين لليسار
            currentTranslationFile = 'translations.json'; // التحويل إلى العربية
        }

        // تحميل الملف الجديد بعد التبديل وتحديث الترجمة
        loadTranslationFile(currentTranslationFile);
    });

    // زر النسخ
    const copyButton =
