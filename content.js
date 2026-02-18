let lastChar = null;
let tickCount = 0;

const iastMap = {
  "a": ["a", "ā"],
  "i": ["i", "ī"],
  "u": ["u", "ū"],
  "r": ["r", "ṛ", "ṝ"],
  "l": ["l", "ḷ", "ḹ"],
  "n": ["n", "ṇ", "ṅ", "ñ"],
  "t": ["t", "ṭ"],
  "d": ["d", "ḍ"],
  "s": ["s", "ṣ", "ś"],
  "m": ["m", "ṃ"],
  "h": ["h", "ḥ"]
};

document.addEventListener("keydown", function (e) {

  const active = document.activeElement;

  if (!active || !(
      active.tagName === "INPUT" ||
      active.tagName === "TEXTAREA"
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

    const start = active.selectionStart;
    const end = active.selectionEnd;

    if (start === 0) return;

    active.setRangeText(
      newChar,
      start - 1,
      start,
      "end"
    );

  } else if (e.key.length === 1) {
    lastChar = e.key;
    tickCount = 0;
  }

});
