document.addEventListener('DOMContentLoaded', function() {
            var typingTimer;
            var doneTypingInterval = 100; 
            var $inuk = document.getElementById("inuk");
            var $braille = document.getElementById("braille");
            var inputLanguage = document.getElementById("inputLanguage");
            var outputLanguage = document.getElementById("outputLanguage");

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

            loadTranslations(inputLanguage.value);

            $inuk.addEventListener('keyup', function() {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(inuk_to_braille, doneTypingInterval);
            });

            $inuk.addEventListener('keydown', function() {
                clearTimeout(typingTimer);
            });

            function inuk_to_braille() {
                var inputText = $inuk.value.trim();
                var words = inputText.split(' ');
                var result = [];

                words.forEach(word => {
                    var translatedWord = inukKey[word.toLowerCase()];
                    if (translatedWord) {
                        result.push(translatedWord);
                    } else {
                        result.push(word);
                    }
                });

                var brailleText = result.join(' ');

                if (SPECIAL_RESPONSES[inputText.toLowerCase()]) {
                    brailleText = SPECIAL_RESPONSES[inputText.toLowerCase()];
                }

                $braille.value = brailleText;
            }

            inputLanguage.addEventListener('change', function() {
                loadTranslations(inputLanguage.value);
            });

            document.getElementById("copyButton").addEventListener("click", function() {
                $braille.select();
                document.execCommand("copy");
            });

            var scrollButtons1 = {
                up: document.getElementById("scrollUp1"),
                down: document.getElementById("scrollDown1")
            };

            var scrollButtons2 = {
                up: document.getElementById("scrollUp2"),
                down: document.getElementById("scrollDown2")
            };

            scrollButtons1.up.addEventListener("click", function() {
                $inuk.scrollTop -= 20;
            });

            scrollButtons1.down.addEventListener("click", function() {
                $inuk.scrollTop += 20;
            });

            scrollButtons2.up.addEventListener("click", function() {
                $braille.scrollTop -= 20;
            });

            scrollButtons2.down.addEventListener("click", function() {
                $braille.scrollTop += 20;
            });

            // Voice to text functionality
            document.getElementById("startRecording").addEventListener("click", function() {
                var micButton = this;
                micButton.classList.toggle("recording");

                if (micButton.classList.contains("recording")) {
                    startVoiceRecognition();
                } else {
                    stopVoiceRecognition();
                }
            });

            var recognition;
            function startVoiceRecognition() {
                if (!('webkitSpeechRecognition' in window)) {
                    alert("متصفحك لا يدعم التعرف على الصوت");
                    return;
                }

                recognition = new webkitSpeechRecognition();
                recognition.lang = inputLanguage.value === "ar" ? "ar-SA" : "en-US";
                recognition.interimResults = true;
                recognition.continuous = false;

                recognition.onresult = function(event) {
                    var transcript = event.results[0][0].transcript;
                    $inuk.value = transcript;
                };

                recognition.onerror = function(event) {
                    console.error("حدث خطأ أثناء التعرف على الصوت:", event);
                };

                recognition.onend = function() {
                    document.getElementById("startRecording").classList.remove("recording");
                };

                recognition.start();
            }

            function stopVoiceRecognition() {
                if (recognition) {
                    recognition.stop();
                }
            }
        });
