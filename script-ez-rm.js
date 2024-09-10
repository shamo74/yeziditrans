document.addEventListener('DOMContentLoaded', function() {
            var typingTimer;
            var doneTypingInterval = 100;
            var $inuk = document.getElementById("inuk");
            var $braille = document.getElementById("braille");
            var wordsWritten = []; // قائمة تخزين الكلمات المكتوبة

            var inukKey = {};
            const SPECIAL_RESPONSES = {};

            // جلب محتوى ملف JSON
            fetch('ez-arm.json')
                .then(response => response.json())
                .then(data => {
                    // تحديث inukKey و SPECIAL_RESPONSES بالمحتوى المسترجع
                    Object.assign(inukKey, data.inukKey);
                    Object.assign(SPECIAL_RESPONSES, data.SPECIAL_RESPONSES);
                })
                .catch(error => console.error('حدث خطأ في جلب الملف JSON:', error));

            $inuk.addEventListener('keyup', function() {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(inukFunction, doneTypingInterval);
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
                                if (word === key) { // بحث عن الكلمة المطابقة
                                    result += inukKey[key][0] + " " + inukKey[key][1] + " ";
                                    translated = true;
                                    break;
                                }
                            }
                        }

                        if (!translated) {
                            // استبدال الحروف المطلوبة بالحروف الجديدة
                            word = word.split('').map((char) => {
                                if (char === 'كل') return 'همو';

                                if (char === '') return '';
                                return char;
                            }).join('');
                            result += word + " ";
                        }
                        i++;
                    }
                }

                $braille.value = result.trim();
            }
        });

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