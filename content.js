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

  if (!active) return;

  if (e.ctrlKey || e.metaKey || e.altKey) return;

  const isInput =
    active.tagName === "INPUT" ||
    active.tagName === "TEXTAREA";

  const isEditable =
    active.isContentEditable;

  if (!isInput && !isEditable) return;

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

    if (isInput) {
      replaceInInput(active, newChar);
    } else if (isEditable) {
      replaceInContentEditable(newChar);
    }

  } else if (e.key.length === 1) {
    lastChar = e.key;
    tickCount = 0;
  }

});

function replaceInInput(element, newChar) {
  const start = element.selectionStart;
  if (start === 0) return;

  element.setRangeText(
    newChar,
    start - 1,
    start,
    "end"
  );
}

function replaceInContentEditable(newChar) {

  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  if (!range.startContainer) return;

  const node = range.startContainer;

  if (node.nodeType !== Node.TEXT_NODE) return;

  const text = node.textContent;
  const offset = range.startOffset;

  if (offset === 0) return;

  node.textContent =
    text.substring(0, offset - 1) +
    newChar +
    text.substring(offset);

  range.setStart(node, offset);
  range.collapse(true);

  selection.removeAllRanges();
  selection.addRange(range);
}
