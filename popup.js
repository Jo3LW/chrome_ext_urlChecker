document.addEventListener('DOMContentLoaded', function () {
  const checkButton = document.getElementById('checkButton');
  const userUrlInput = document.getElementById('userUrl');
  const useCurrentTabButton = document.getElementById('useCurrentTab');

  checkButton.addEventListener("click", function () {
    const userUrl = userUrlInput.value.trim();

    if (userUrl) {
      checkUrl(userUrl);
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs && tabs[0]) {
          checkUrl(tabs[0].url);
        } else {
          console.error("Error retrieving active tab information");
        }
      });
    }
  });

  useCurrentTabButton.addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs && tabs[0]) {
          userUrlInput.value = tabs[0].url;
        } else {
          console.error("Error retrieving active tab information");
        }
      });
  });
});

function checkUrl(url) {
  // Step 1: Check character match with preferred language
  chrome.i18n.getAcceptLanguages(function (languages) {
    const preferredLanguage = languages[0].split('-')[0];
    const urlCharacters = Array.from(new Set(url.split('')));
    const allowedCharacters = new Set(preferredLanguage);

    const allCharactersMatch = urlCharacters.every(char => allowedCharacters.has(char));

    document.getElementById('language').textContent = allCharactersMatch ? "Yes" : "No";
  });

  // Step 2: Check for Cyrillic characters
  const containsCyrillicCharacters = /[\u0400-\u04FF]/.test(url);
  document.getElementById('cyrillic').textContent = containsCyrillicCharacters ? "Yes" : "No";

  // Step 3: Check for punycode characters
  const containsPunycodeCharacters = /xn--/.test(url);
  document.getElementById('punycode').textContent = containsPunycodeCharacters ? "Yes" : "No";
}
