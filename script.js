document.addEventListener('DOMContentLoaded', function() {
            var typingTimer;
            var doneTypingInterval = 100; // زمن التأخير بعد التوقف عن الكتابة
            var $inuk = document.getElementById("inuk");
            var $braille = document.getElementById("braille");
            var inputLanguage = document.getElementById("inputLanguage");
            var outputLanguage = document.getElementById("outputLanguage");
            var wordsWritten = []; // قائمة تخزين الكلمات المكتوبة

            var inukKey = {};
            const SPECIAL_RESPONSES = {};

            function loadTranslations(language) {
                var filePath = language === "ar" ? 'language-arabic.json' : 'translations.json';
                
                fetch(filePath)
                    .then(response => response.json())
                    .then(data => {
                        inukKey = data.inukKey;
                        Object.assign(SPECIAL_RESPONSES, data.SPECIAL_RESPONSES);
                    })
                    .catch(error => console.error('حدث خطأ في جلب الملف JSON:', error));
            }

            // تحميل الترجمات عند تحميل الصفحة
            loadTranslations(inputLanguage.value);

            $inuk.addEventListener('keyup', function() {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(inukFunction, doneTypingInterval);
            });

            document.getElementById("swapLanguages").addEventListener('click', function() {
                // تبديل اللغات
                var temp = inputLanguage.value;
                inputLanguage.value = outputLanguage.value;
                outputLanguage.value = temp;

                loadTranslations(inputLanguage.value);
                inukFunction(); // ترجمة النص عند التبديل
            });

            function inukFunction() {
                var inuk = $inuk.value;
                var words = inuk.split(/\s+/); // تقسيم النص إلى كلمات بمسافة
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
                                result += SPECIAL_RESPONSES[phrase][0] + " " + SPECIAL_RESPONSES[phrase][1] + " ";
                                i += phraseWords.length;
                                phraseFound = true;
                                break;
                            }
                        }
                    }

                    if (!phraseFound) {
                        var word = words[i].replace(/[^\u0621-\u064A\u0660-\u0669]/g, " "); // تجاهل الرموز والأرقام
                        
                        // التحقق من عدم تكرار الكلمة
                        if (!wordsWritten.includes(word) && word.length > 0) {
                            wordsWritten.push(word); // إضافة الكلمة إلى القائمة
                        }

                        var translated = false;
                        for (var key in inukKey) {
                            if (inukKey.hasOwnProperty(key)) {
                                if (word === key) { // بحث عن الكلمة المطابقة
                                    result += inukKey[key][0] + " " + inukKey[key][1] + " ";
                                    translated = true;
                                    break;
                                }
                            }
                        }

                        if (!translated) {
                            // إذا لم توجد ترجمة، يتم إضافة الكلمة كما هي
                            result += word + " ";
                        }
                        i++;
                    }
                }

                $braille.value = result.trim();
            }

            // إعداد التعرف على الصوت
            const startRecording = document.getElementById('startRecording');
            const audioStart = new Audio('start.mp3'); // رابط صوت بدء التسجيل
            const audioStop = new Audio('stop.mp3'); // رابط صوت إيقاف التسجيل

            if ('webkitSpeechRecognition' in window) {
                const recognition = new webkitSpeechRecognition();
                recognition.lang = inputLanguage.value; // تعيين اللغة
                recognition.interimResults = false;
                recognition.maxAlternatives = 1;

                startRecording.addEventListener('click', function() {
                    audioStart.play().then(() => {
                        recognition.start(); // بدء التعرف على الصوت بعد تشغيل الصوت المخصص
                    }).catch(err => {
                        console.error("خطأ في تشغيل الصوت:", err);
                    });
                });

                recognition.onresult = function(event) {
                    const transcript = event.results[0][0].transcript; // نص الكلام
                    $inuk.value += transcript; // إضافة النص إلى حقل الإدخال
                    inukFunction(); // الترجمة بعد إضافة النص
                };

                recognition.onend = function() {
                    audioStop.play(); // تشغيل صوت إيقاف التسجيل عند انتهاء التعرف على الصوت
                };

                recognition.onerror = function(event) {
                    console.error('حدث خطأ أثناء التعرف على الصوت:', event.error);
                };
            } else {
                alert('هذا المتصفح لا يدعم واجهة التعرف على الصوت.');
            }
        });

        // نسخ النص
        const copyButton = document.getElementById('copyButton');
        const brailleTextarea = document.getElementById('braille');

        copyButton.addEventListener('click', () => {
            // تحديد النص في الحقل الثاني
            brailleTextarea.select();
            brailleTextarea.setSelectionRange(0, 99999); // للدعم الجيد للمتصفحات

            // نسخ النص إلى الحافظة
            document.execCommand('copy');

            // إزالة التحديد من الحقل
            window.getSelection().removeAllRanges();

            // رسالة تأكيد النسخ
            alert('تم نسخ النص بنجاح!');
        });
