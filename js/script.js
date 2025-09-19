// app.js — pastikan namanya app.js dan berada di folder yang sama dengan index.html
const q = s => document.querySelector(s);
const listEl = q('#list');
const input = q('#todoInput');
const addBtn = q('#addBtn');
const countEl = q('#count');
const clearBtn = q('#clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

let todos = JSON.parse(localStorage.getItem('todos-v1')||'[]');
let filter = 'all';

function save(){ localStorage.setItem('todos-v1', JSON.stringify(todos)); }
function updateCount(){ countEl.textContent = todos.length + (todos.length===1? ' item':' items'); }

function render(){
  listEl.innerHTML = '';
  const visible = todos.filter(t => {
    if(filter==='all') return true;
    if(filter==='active') return !t.done;
    return t.done;
  });

  visible.forEach(todo => {
    const item = document.createElement('div'); item.className='item';

    const chk = document.createElement('div'); chk.className='checkbox'+(todo.done? ' checked':'');
    chk.innerHTML = todo.done? '✓':'';
    chk.onclick = ()=>{ todo.done = !todo.done; save(); render(); }

    const txt = document.createElement('div'); txt.className='text'+(todo.done? ' done':''); txt.textContent = todo.text;
    txt.ondblclick = ()=> editTodo(todo);

    const actions = document.createElement('div'); actions.className='actions';
    const del = document.createElement('button'); del.className='icon-btn'; del.innerHTML='🗑';
    del.title='Delete'; del.onclick = ()=>{ todos = todos.filter(t=>t.id!==todo.id); save(); render(); }

    const edit = document.createElement('button'); edit.className='icon-btn'; edit.innerHTML='✏️'; edit.title='Edit';
    edit.onclick = ()=> editTodo(todo);

    actions.appendChild(edit); actions.appendChild(del);

    item.appendChild(chk); item.appendChild(txt); item.appendChild(actions);
    listEl.appendChild(item);
  });
  updateCount();
}

function addTodo(text){
  const t = { id: Date.now()+Math.random(), text: text.trim(), done:false };
  todos.unshift(t); save(); render();
}

function editTodo(todo){
  const newText = prompt('Edit task', todo.text);
  if(newText===null) return;
  const trimmed = newText.trim();
  if(trimmed===''){
    todos = todos.filter(t=>t.id!==todo.id);
  } else {
    todo.text = trimmed;
  }
  save(); render();
}

addBtn.onclick = ()=>{ if(input.value.trim()) { addTodo(input.value); input.value=''; input.focus(); }}
input.addEventListener('keydown', (e)=>{ if(e.key==='Enter' && input.value.trim()){ addTodo(input.value); input.value=''; }});

clearBtn.onclick = ()=>{ todos = todos.filter(t=>!t.done); save(); render(); }

filterBtns.forEach(b=>{
  b.addEventListener('click', ()=>{
    filterBtns.forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); filter = b.dataset.filter; render();
  });
});

// initial render
render();
