const display = document.getElementById('display');
const keys = document.querySelectorAll('.key');
let caps = false;
let shift = false;
display.focus();

function insertText(txt){
  document.execCommand('insertText', false, txt);
  display.focus();
}

function doBackspace(){
  const sel = window.getSelection();
  if(!sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  if(!range.collapsed){
    range.deleteContents();
    display.focus();
    return;2
  }

  const r = range.cloneRange();
  if(r.startOffset > 0){
    r.setStart(r.startContainer, r.startOffset - 1);
    r.deleteContents();
    const newRange = document.createRange();
    newRange.setStart(r.startContainer, r.startOffset);
    newRange.setEnd(r.startContainer, r.startOffset);
    sel.removeAllRanges();
    sel.addRange(newRange);
    display.focus();
    return;
  }

  try {
    sel.modify('extend', 'backward', 'character');
    sel.deleteFromDocument();
  } catch (err) {
  }
  display.focus();
}

function findKeyByName(name){
  return Array.from(keys).find(k => (k.dataset.key || '').toLowerCase() === name.toLowerCase());
}

keys.forEach(k => {
  k.addEventListener('click', () => {
    const key = (k.dataset.key || '').toLowerCase();

    k.classList.add('pressed');
    setTimeout(()=> k.classList.remove('pressed'), 120);

    if(key === 'back'){
      doBackspace();
      return;
    }

    if(key === 'enter'){
      insertText('\n');
      return;
    }

    if(key === 'space'){
      insertText(' ');
      return;
    }

    if(key === 'tab'){
      insertText('\t');
      return;
    }

    if(key === 'caps'){
      caps = !caps;
      k.style.background = caps ? '#222' : '';
      return;
    }

    if(key === 'shift'){
      shift = true;
      k.style.background = '#222';
      setTimeout(()=> {
        shift = false;
        k.style.background = '';
      }, 300);
      return;
    }

    let out = key;
    if(out.length === 1){
      if(caps || shift) out = out.toUpperCase();
      else out = out.toLowerCase();
    }

    insertText(out);
  });
});

window.addEventListener('keydown', (e) => {
  let name = e.key;
  if(name === ' ') name = 'space';
  if(name === 'Spacebar') name = 'space';
  if(name === 'Esc') name = 'Escape';
  if(name === 'ArrowLeft' || name === 'ArrowRight' || name === 'ArrowUp' || name === 'ArrowDown') {
    return;
  }

  const keyName = name.toLowerCase();

  const vk = findKeyByName(keyName);
  if(vk) vk.classList.add('pressed');

  if(keyName === 'backspace'){
    e.preventDefault();
    doBackspace();
    return;
  }

  if(keyName === 'enter'){
    e.preventDefault();
    insertText('\n');
    return;
  }

  if(keyName === 'tab'){
    e.preventDefault();
    insertText('\t');
    return;
  }

  if(keyName === 'capslock' || keyName === 'caps'){
    e.preventDefault();
    caps = !caps;
    const capKey = findKeyByName('caps');
    if(capKey) capKey.style.background = caps ? '#222' : '';
    return;
  }

  if(keyName === 'shift'){
    const shiftKey = findKeyByName('shift');
    if(shiftKey) shiftKey.classList.add('pressed');
    shift = true;
    return;
  }

});