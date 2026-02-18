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

function getTextNodeBeforeCaret() {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return null;

  const range = sel.getRangeAt(0);
  let node = range.startContainer;
  let offset = range.startOffset;

  // If we're already in a text node, use it directly.
  if (node.nodeType === Node.TEXT_NODE) {
    return { node, offset };
  }

  // Helper: deepest last text node inside a subtree.
  function lastTextNodeIn(node) {
    if (node.nodeType === Node.TEXT_NODE) return node;
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      const found = lastTextNodeIn(node.childNodes[i]);
      if (found) return found;
    }
    return null;
  }

  // Try children before the caret inside the current element.
  if (node.nodeType === Node.ELEMENT_NODE && offset > 0) {
    for (let i = offset - 1; i >= 0; i--) {
      const child = node.childNodes[i];
      const t = lastTextNodeIn(child);
      if (t) {
        return { node: t, offset: t.textContent.length };
      }
    }
  }

  // Walk up the DOM, looking at previous siblings.
  let current = node;
  while (current && current !== document.body && current !== document.documentElement) {
    let sibling = current.previousSibling;
    while (sibling) {
      const t = lastTextNodeIn(sibling);
      if (t) {
        return { node: t, offset: t.textContent.length };
      }
      sibling = sibling.previousSibling;
    }
    current = current.parentNode;
  }

  return null;
}

document.addEventListener("keydown", function(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  const el = document.activeElement;
  if (!el) return;

  const isInput = el.tagName === "INPUT" || el.tagName === "TEXTAREA";
  const isEditable = el.isContentEditable;
  if (!isInput && !isEditable) return;

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

    // Input / textarea
    if (isInput) {
      const start = el.selectionStart;
      const end = el.selectionEnd;

      if (start === 0) {
        el.value = newChar + el.value;
        el.setSelectionRange(1, 1);
      } else {
        el.setRangeText(newChar, start - 1, start, "end");
      }
    }

    // Contenteditable
    else if (isEditable) {
      const caretInfo = getTextNodeBeforeCaret();
      if (!caretInfo) return;

      const { node, offset } = caretInfo;
      if (!node || node.nodeType !== Node.TEXT_NODE || offset === 0) return;

      node.textContent =
        node.textContent.slice(0, offset - 1) +
        newChar +
        node.textContent.slice(offset);

      const sel = window.getSelection();
      if (!sel) return;
      const range = document.createRange();
      range.setStart(node, offset);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }

  } else if (e.key.length === 1) {
    lastChar = e.key;
    tickCount = 0;
  }

}, true); 
