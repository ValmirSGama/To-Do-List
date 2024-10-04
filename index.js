const texto = document.querySelector('.textInsert');
const btnInsert = document.querySelector('.divInsert button');
const btnDeleteAll = document.querySelector('.header button');
const ul = document.querySelector('ul');
const categorySelect = document.getElementById('categorySelect');

var itensDB = [];

btnDeleteAll.onclick = () => {
  const selectedCategory = categorySelect.value;

  // Filtra para manter apenas os itens que não pertencem à categoria atual
  itensDB = itensDB.filter(item => item.category !== selectedCategory);
  updateDB();
};

texto.addEventListener('keypress', e => {
  if (e.key == 'Enter' && texto.value != '') {
    setItemDB();
  }
});

btnInsert.onclick = () => {
  if (texto.value != '') {
    setItemDB();
  }
};

// Atualiza a lista de itens sempre que a categoria selecionada mudar
categorySelect.addEventListener('change', loadItens);

function setItemDB() {
  if (itensDB.length >= 200) {
    alert('Limite máximo de 200 itens atingido!');
    return;
  }

  // Adiciona a nova tarefa com a categoria selecionada
  itensDB.push({ 'item': texto.value, 'status': '', 'category': categorySelect.value });
  updateDB();
}

function updateDB() {
  localStorage.setItem('todolist', JSON.stringify(itensDB));
  loadItens();
}

function loadItens() {
  ul.innerHTML = '';
  itensDB = JSON.parse(localStorage.getItem('todolist')) ?? [];

  // Filtra os itens com base na categoria selecionada
  const selectedCategory = categorySelect.value;
  const filteredItems = itensDB.filter(item => item.category === selectedCategory);

  filteredItems.forEach((item) => {
    insertItemTela(item.item, item.status, itensDB.indexOf(item)); // Passa o índice do item original
  });
}

function insertItemTela(text, status, i) {
  const li = document.createElement('li');
  
  li.innerHTML = `
    <div class="divLi">
      <input type="checkbox" ${status} data-i=${i} onchange="done(this, ${i});" />
      <span data-si=${i}>${text}</span>
      <button onclick="removeItem(${i})" data-i=${i}><i class='bx bx-trash'></i></button>
    </div>
    `;
  ul.appendChild(li);

  if (status) {
    document.querySelector(`[data-si="${i}"]`).classList.add('line-through');
  } else {
    document.querySelector(`[data-si="${i}"]`).classList.remove('line-through');
  }

  texto.value = '';
}

function done(chk, i) {
  itensDB[i].status = chk.checked ? 'checked' : '';
  updateDB();
}

function removeItem(i) {
  itensDB.splice(i, 1);
  updateDB();
}

loadItens();