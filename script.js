document.addEventListener('DOMContentLoaded', function() {
            var typingTimer;
            var doneTypingInterval = 100;
            var $inuk = document.getElementById("inuk");
            var $braille = document.getElementById("braille");
            var wordsWritten = []; // قائمة تخزين الكلمات المكتوبة

            var inukKey = {};
            const SPECIAL_RESPONSES = {};

            // جلب محتوى ملف JSON
            fetch('translations.json')
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
                                if (char === 'ا') return '𐺀';
if (char === 'أ') return '𐺀';
                                if (char === 'ب') return '𐺁';
                                if (char === 'ت') return '𐺄';
                                if (char === 'ث') return '𐺅';
                                if (char === 'ج') return '𐺆';
                                if (char === 'ح') return '𐺉';
                                if (char === 'خ') return '𐺊';
                                if (char === 'د') return '𐺋';
                                if (char === 'ذ') return '𐺌';
                                if (char === 'ر') return '𐺍';
                                if (char === 'ز') return '𐺏';
                                if (char === 'س') return '𐺑';
                                if (char === 'ش') return '𐺒';
                                if (char === 'ص') return '𐺓';
                                if (char === 'ض') return '𐺔';
                                if (char === 'ط') return '𐺕';
                                if (char === 'ظ') return '𐺖';
                                if (char === 'ع') return '𐺗';
                                if (char === 'غ') return '𐺘';
                                if (char === 'ف') return '𐺙';
                                if (char === 'ق') return '𐺜';
                                if (char === 'ك') return '𐺝';
                                if (char === 'ل') return '𐺠';
                                if (char === 'م') return '𐺡';
                                if (char === 'ن') return '𐺢';
                                if (char === 'ه') return '𐺧';
                                if (char === 'و') return '𐺣';
                                if (char === 'ي') return '𐺨';
                                if (char === 'پ') return '𐺂';
                                if (char === 'چ') return '𐺇';
                                if (char === 'ڕ') return '𐺎';
                                if (char === 'ژ') return '𐺐';
                                if (char === 'ڤ') return '𐺛';
                                if (char === 'گ') return '𐺞';
                                if (char === 'ڵ') return '𐺰';
                                if (char === 'ێ') return '𐺩';
                                if (char === 'ە') return '𐺦';
                                if (char === 'ۆ') return '𐺥';
                                if (char === 'وو') return '𐺤';
                                if (char === 'ی') return '𐺨';
                                if (char === 'ؤ') return '𐺤';
                                if (char === 'ە') return '𐺧';
                                if (char === 'ئ') return '𐺱';
                                if (char === 'َ') return '𐺬';
                                if (char === 'ء') return '𐺫';
                                if (char === 'ّ') return '𐺫';
      if (char === 'ً') return '𐺬𐺬';
                                if (char === 'ى') return '𐺱';
                                if (char === 'ة') return '𐺄𐺭';
                                if (char === '𐺣𐺣') return 'وو';
                                if (char === 'ک') return '𐺝';
                                if (char === 'A') return 'A';
                                if (char === 'B') return 'B';
                                if (char === 'C') return 'C';
                                if (char === 'D') return 'D';
                                if (char === 'E') return 'E';
                                if (char === 'F') return 'F';
                                if (char === 'G') return 'G';
                                if (char === 'H') return 'H';
                                if (char === 'I') return 'I';
                                if (char === 'J') return 'J';
                                if (char === 'K') return 'K';
                                if (char === 'L') return 'L';
                                if (char === 'M') return 'M';
                                if (char === 'N') return 'N';
                                if (char === 'O') return 'O';
                                if (char === 'P') return 'P';
                                if (char === 'Q') return 'Q';
                                if (char === 'R') return 'R';
                                if (char === 'S') return 'S';
                                if (char === 'T') return 'T';
                                if (char === 'U') return 'U';
                                if (char === 'V') return 'V';
                                if (char === 'W') return 'W';
                                if (char === 'X') return 'X';
                                if (char === 'Y') return 'Y';
                                if (char === 'Z') return 'Z';
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
