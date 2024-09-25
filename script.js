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

        // بعد تبديل النصوص، قم بترجمة النص في الحقل الثاني إلى الحقل الأول بالعكس
        translateBrailleToInuk();
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
                    result += phrase + " ";
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

        $inuk.value = result.trim();
    }

    const copyButton = document.getElementById("copyButton");
    copyButton.addEventListener("click", copyText);

    function copyText() {
        const textarea = document.getElementById("braille");
        textarea.select();
        document.execCommand("copy");
        alert("تم نسخ النص!");
    }

    // اضافة دالة لترجمة النص عند الضغط على زر الترجمة
    const translateButton = document.getElementById("translateButton");
    translateButton.addEventListener("click", function() {
        const currentLanguage = languageSelector1.value; // اللغة المحددة
        const textToTranslate = $braille.value; // نص الحقل الثاني
        if (textToTranslate.trim() !== "") {
            translateText(textToTranslate, currentLanguage);
        } else {
            alert("يرجى إدخال نص لترجمته.");
        }
    });

    // دالة لترجمة النص
    function translateText(text, language) {
        fetch(jsonLinks[language])
            .then(response => response.json())
            .then(data => {
                inukKey = data.inukKey || {};
                Object.assign(SPECIAL_RESPONSES, data.SPECIAL_RESPONSES || {});

                const words = text.split(/\s+/);
                let result = "";

                for (let word of words) {
                    const translated = inukKey[word] || word; // ترجمة الكلمة أو الاحتفاظ بها إذا لم تكن موجودة
                    result += translated + " ";
                }
                $inuk.value = result.trim(); // إظهار النص المترجم في الحقل الأول
            })
            .catch(error => console.error('حدث خطأ في جلب الملف JSON:', error));
    }
});
