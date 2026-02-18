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

// Listen on keydown in capture phase
document.addEventListener("keydown", function(e) {

  if (e.ctrlKey || e.metaKey || e.altKey) return;

  const el = document.activeElement;
  if (!el) return;

  const isInput = el.tagName === "INPUT" || el.tagName === "TEXTAREA";
  const isEditable = el.isContentEditable;

  if (!isInput && !isEditable) return;

  // If backtick is pressed
  if (e.key === "`") {
    if (!lastChar) return;

    const base = lastChar.toLowerCase();
    if (!iastMap[base]) return;

    e.preventDefault();
    tickCount++;

    let forms = iastMap[base];
    let newChar = forms[tickCount % forms.length];

    if (lastChar === lastChar.toUpperCase()) {
      newChar = newChar.toUpperCase();
    }

    // Replace in input/textarea
    if (isInput) {
      const start = el.selectionStart;
      if (start === 0) return;
      el.setRangeText(newChar, start - 1, start, "end");
    } 
    // Replace in contenteditable
    else if (isEditable) {
      const sel = window.getSelection();
      if (!sel.rangeCount) return;
      const range = sel.getRangeAt(0);

      const node = range.startContainer;
      const offset = range.startOffset;
      if (node.nodeType !== Node.TEXT_NODE || offset === 0) return;

      node.textContent =
        node.textContent.slice(0, offset - 1) +
        newChar +
        node.textContent.slice(offset);

      range.setStart(node, offset);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }

  } else if (e.key.length === 1) {
    // Store the last typed character
    lastChar = e.key;
    tickCount = 0;
  }

}, true); // capture phase

