let lastChar = null;
let tickCount = 0;

const iastMap = {
  "a": ["a", "ā"],
  "i": ["i", "ī"],
  "u": ["u", "ū"],
  "r": ["r", "ṛ", "ṝ"],
  "l": ["l", "ḷ", "ḹ"],
  "e": ["e"],
  "o": ["o"],

  "n": ["n", "ṇ", "ṅ", "ñ"],

  "t": ["t", "ṭ"],
  "d": ["d", "ḍ"],
  "k": ["k"],
  "g": ["g"],
  "c": ["c"],
  "j": ["j"],
  "p": ["p"],
  "b": ["b"],

  "s": ["s", "ṣ", "ś"],
  "m": ["m", "ṃ"],
  "h": ["h", "ḥ"],
  "y": ["y"],
  "v": ["v"]
};

document.addEventListener("keydown", function (e) {

  const active = document.activeElement;

  if (!active || !(
      active.tagName === "INPUT" ||
      active.tagName === "TEXTAREA" ||
      active.isContentEditable
  )) return;

  
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  
  if (e.key === "`") {

    if (!lastChar) return;

    const baseLower = lastChar.toLowerCase();

    if (!iastMap[baseLower]) return;

    e.preventDefault();

    tickCount++;

    const forms = iastMap[baseLower];
    let newChar = forms[tickCount % forms.length];

   
    if (lastChar === lastChar.toUpperCase()) {
      newChar = newChar.toUpperCase();
    }

    replaceLastCharacter(active, newChar);

  }
  
  else if (e.key.length === 1) {
    lastChar = e.key;
    tickCount = 0;
  }

});

function replaceLastCharacter(element, newChar) {

  if (typeof element.selectionStart !== "number") return;

  const start = element.selectionStart;
  const end = element.selectionEnd;

  if (start === 0) return;

  const text = element.value;

  element.value =
    text.substring(0, start - 1) +
    newChar +
    text.substring(end);

  element.setSelectionRange(start, start);
}

  