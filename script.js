document.addEventListener('DOMContentLoaded', function() {
    var typingTimer;
    var doneTypingInterval = 100;
    var $inuk = document.getElementById("inuk");
    var $braille = document.getElementById("braille");
    var wordsWritten = [];

    var inukKey = {};
    const SPECIAL_RESPONSES = {};
    var currentLanguage = 'ar'; // اللغة الافتراضية (العربية)

    // تحميل ملف JSON الافتراضي عند بداية الصفحة
    loadTranslationFile('translation-sh.json');

    // وظيفة تحميل ملف JSON بناءً على اللغة المختارة
    function loadTranslationFile(fileName) {
        fetch(fileName)
            .then(response => response.json())
            .then(data => {
                Object.assign(inukKey, data.inukKey);
                Object.assign(SPECIAL_RESPONSES, data.SPECIAL_RESPONSES);
            })
            .catch(error => console.error('حدث خطأ في جلب الملف JSON:', error));
    }

    // استبدال اللغات عند الضغط على السهم
    document.getElementById("swapBtn").addEventListener("click", function() {
        if (currentLanguage === 'ar') {
            currentLanguage = 'en';
            loadTranslationFile('translation.json');
            document.querySelector('.lang-btn:first-of-type').textContent = "الإنجليزية";
            document.querySelector('.lang-btn:last-of-type').textContent = "العربية";
        } else {
            currentLanguage = 'ar';
            loadTranslationFile('translation-sh.json');
            document.querySelector('.lang-btn:first-of-type').textContent = "العربية";
            document.querySelector('.lang-btn:last-of-type').textContent = "الإنجليزية";
        }
        $inuk.value = ''; // تفريغ الحقل عند تبديل اللغة
        $braille.value = ''; // تفريغ حقل الترجمة أيضاً
    });

    $inuk.addEventListener('keyup', function() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(inukFunction, doneTypingInterval);
    });

    function inukFunction() {
        var inuk = $inuk.value;
        var words = inuk.split(/\s+/);
        var result = "";
        var i = 0;

        while (i < words.length) {
            var phraseFound = false;

            // تحقق من العبارات الخاصة
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

                // التحقق من عدم تكرار الكلمة في القائمة
                if (!wordsWritten.includes(word)) {
                    wordsWritten.push(word); // إضافة الكلمة إلى القائمة
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

    // كود النسخ
    const copyButton = document.getElementById('copyButton');
    const brailleTextarea = document.getElementById('braille');

    copyButton.addEventListener('click', () => {
        // تحديد النص في الحقل الثاني
        brailleTextarea.select();
        brailleTextarea.setSelectionRange(0, 99999);

        // نسخ النص إلى الحافظة
        document.execCommand('copy');
        
        // إزالة التحديد
        window.getSelection().removeAllRanges();

        alert('تم نسخ النص بنجاح!');
    });
});
