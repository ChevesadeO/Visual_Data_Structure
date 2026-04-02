const tabs = document.querySelectorAll(".tab");
const inputValor = document.getElementById("valor");
const visualArea = document.getElementById("visual-area");
const tipoActual = document.getElementById("tipo-actual");
const sizeValue = document.getElementById("size-value");
const lastAction = document.getElementById("last-action");
const descTipo = document.getElementById("desc-tipo");
const visualTitle = document.getElementById("visual-title");
const visualSubtitle = document.getElementById("visual-subtitle");
const legendContent = document.getElementById("legend-content");
const toast = document.getElementById("toast");

const btnInsertar = document.getElementById("btn-insertar");
const btnEliminar = document.getElementById("btn-eliminar");
const btnLimpiar = document.getElementById("btn-limpiar");
const toggleThemeBtn = document.getElementById("toggle-theme");

const codeStructure = document.getElementById("code-structure");
const codeAction = document.getElementById("code-action");
const pseudocodeLines = document.getElementById("pseudocode-lines");
const codeSubtitle = document.getElementById("code-subtitle");

const btnPaso = document.getElementById("btn-paso");
const modoPaso = document.getElementById("modo-paso");

let tipo = "lista";
let estructura = [];
let ultimoInsertado = null;
let operacionActual = "espera";
let enProcesoPaso = false;

const textos = {
  lista: {
    nombre: "Lista",
    titulo: "Visualización de Lista Enlazada",
    subtitulo: "Los nodos se muestran conectados secuencialmente",
    descripcion: "Estructura lineal con nodos enlazados"
  },
  pila: {
    nombre: "Pila",
    titulo: "Visualización de Pila",
    subtitulo: "LIFO: el último en entrar es el primero en salir",
    descripcion: "Estructura LIFO"
  },
  cola: {
    nombre: "Cola",
    titulo: "Visualización de Cola",
    subtitulo: "FIFO: el primero en entrar es el primero en salir",
    descripcion: "Estructura FIFO"
  }
};

const pseudocodigos = {
  lista: {
    espera: {
      subtitulo: "Operación pendiente sobre lista enlazada",
      lineas: [
        "crear lista vacía",
        "esperar operación del usuario",
        "mostrar nodos enlazados en pantalla"
      ],
      activa: -1
    },
    insertar: {
      subtitulo: "Inserción al final de la lista enlazada",
      lineas: [
        "nuevo ← crear nodo(valor)",
        "si lista está vacía entonces",
        "    cabeza ← nuevo",
        "si no",
        "    recorrer hasta el último nodo",
        "    último.siguiente ← nuevo",
        "nuevo.siguiente ← NULL"
      ],
      activa: 5
    },
    eliminar: {
      subtitulo: "Eliminación del último nodo de la lista",
      lineas: [
        "si lista está vacía entonces",
        "    terminar",
        "si solo existe un nodo entonces",
        "    cabeza ← NULL",
        "si no",
        "    recorrer hasta el penúltimo nodo",
        "    penúltimo.siguiente ← NULL"
      ],
      activa: 6
    },
    limpiar: {
      subtitulo: "Reinicio completo de la lista",
      lineas: [
        "mientras la lista tenga nodos",
        "    eliminar referencia al siguiente nodo",
        "vaciar lista",
        "mostrar estructura vacía"
      ],
      activa: 2
    }
  },
  pila: {
    espera: {
      subtitulo: "Operación pendiente sobre pila",
      lineas: [
        "crear pila vacía",
        "esperar operación del usuario",
        "mostrar elementos de abajo hacia arriba"
      ],
      activa: -1
    },
    insertar: {
      subtitulo: "Operación PUSH en pila",
      lineas: [
        "nuevo ← valor",
        "insertar nuevo en el tope",
        "actualizar referencia del tope",
        "mostrar pila actualizada"
      ],
      activa: 1
    },
    eliminar: {
      subtitulo: "Operación POP en pila",
      lineas: [
        "si pila está vacía entonces",
        "    terminar",
        "eliminar elemento del tope",
        "actualizar nuevo tope",
        "mostrar pila actualizada"
      ],
      activa: 2
    },
    limpiar: {
      subtitulo: "Reinicio completo de la pila",
      lineas: [
        "mientras la pila tenga elementos",
        "    desapilar elemento",
        "vaciar pila",
        "mostrar estructura vacía"
      ],
      activa: 2
    }
  },
  cola: {
    espera: {
      subtitulo: "Operación pendiente sobre cola",
      lineas: [
        "crear cola vacía",
        "esperar operación del usuario",
        "mostrar frente y final"
      ],
      activa: -1
    },
    insertar: {
      subtitulo: "Operación ENQUEUE en cola",
      lineas: [
        "nuevo ← valor",
        "insertar nuevo al final",
        "actualizar puntero final",
        "mostrar cola actualizada"
      ],
      activa: 1
    },
    eliminar: {
      subtitulo: "Operación DEQUEUE en cola",
      lineas: [
        "si cola está vacía entonces",
        "    terminar",
        "eliminar elemento del frente",
        "mover frente al siguiente nodo",
        "mostrar cola actualizada"
      ],
      activa: 2
    },
    limpiar: {
      subtitulo: "Reinicio completo de la cola",
      lineas: [
        "mientras la cola tenga elementos",
        "    desencolar elemento",
        "vaciar cola",
        "mostrar estructura vacía"
      ],
      activa: 2
    }
  }
};

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    tipo = tab.dataset.type;
    estructura = [];
    ultimoInsertado = null;
    operacionActual = "espera";

    lastAction.textContent = "Cambio de estructura";
    actualizarTextos();
    actualizarPseudocodigo();
    animarArea();
    render();
    mostrarToast(`Ahora estás en ${textos[tipo].nombre}`);
  });
});

btnInsertar.addEventListener("click", insertar);
btnEliminar.addEventListener("click", eliminar);
btnLimpiar.addEventListener("click", limpiar);
btnPaso.addEventListener("click", ejecutarPasoAPaso);

inputValor.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    insertar();
  }
});

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function resaltarLineaPseudocodigo(indice) {
  const lineas = pseudocodeLines.querySelectorAll("li");
  lineas.forEach((li, i) => {
    li.classList.remove("active");
    if (i === indice) {
      li.classList.add("active");
    }
  });
}

async function ejecutarPasoAPaso() {
  if (enProcesoPaso) return;

  const accion = modoPaso.value;

  if (accion === "insertar") {
    const valor = inputValor.value.trim();
    if (valor === "") {
      mostrarToast("Ingrese un número para insertar");
      return;
    }

    enProcesoPaso = true;
    btnPaso.disabled = true;
    btnInsertar.disabled = true;
    btnEliminar.disabled = true;

    operacionActual = "insertar";
    actualizarPseudocodigo();
    lastAction.textContent = "Paso 1: creando nodo";
    mostrarToast("Paso 1: creando nodo");
    resaltarLineaPseudocodigo(0);
    await esperar(900);

    if (estructura.length === 0) {
      lastAction.textContent = "Paso 2: la lista está vacía";
      mostrarToast("Paso 2: la estructura está vacía");
      resaltarLineaPseudocodigo(1);
      await esperar(900);

      lastAction.textContent = "Paso 3: el nuevo nodo será la cabeza";
      mostrarToast("Paso 3: el nuevo nodo será la cabeza");
      resaltarLineaPseudocodigo(2);
      await esperar(900);
    } else {
      lastAction.textContent = "Paso 2: recorriendo hasta el final";
      mostrarToast("Paso 2: recorriendo hasta el último nodo");
      resaltarLineaPseudocodigo(4);
      await esperar(1000);

      lastAction.textContent = "Paso 3: enlazando nuevo nodo";
      mostrarToast("Paso 3: enlazando nuevo nodo");
      resaltarLineaPseudocodigo(5);
      await esperar(1000);
    }

    estructura.push(valor);
    ultimoInsertado = valor;
    inputValor.value = "";
    animarArea();
    render();

    lastAction.textContent = `Insertado: ${valor}`;
    mostrarToast(`Inserción completada: ${valor}`);
    resaltarLineaPseudocodigo(6);

    await esperar(700);
    btnPaso.disabled = false;
    btnInsertar.disabled = false;
    btnEliminar.disabled = false;
    enProcesoPaso = false;
    return;
  }

  if (accion === "eliminar") {
    if (estructura.length === 0) {
      mostrarToast("La estructura está vacía");
      return;
    }

    enProcesoPaso = true;
    btnPaso.disabled = true;
    btnInsertar.disabled = true;
    btnEliminar.disabled = true;

    operacionActual = "eliminar";
    actualizarPseudocodigo();

    lastAction.textContent = "Paso 1: verificando si está vacía";
    mostrarToast("Paso 1: verificando estructura");
    resaltarLineaPseudocodigo(0);
    await esperar(900);

    if (tipo === "lista") {
      if (estructura.length === 1) {
        lastAction.textContent = "Paso 2: solo existe un nodo";
        mostrarToast("Paso 2: solo existe un nodo");
        resaltarLineaPseudocodigo(2);
        await esperar(900);

        lastAction.textContent = "Paso 3: la cabeza pasa a NULL";
        mostrarToast("Paso 3: eliminando nodo único");
        resaltarLineaPseudocodigo(3);
        await esperar(900);
      } else {
        lastAction.textContent = "Paso 2: recorriendo al penúltimo nodo";
        mostrarToast("Paso 2: buscando penúltimo nodo");
        resaltarLineaPseudocodigo(5);
        await esperar(1000);

        lastAction.textContent = "Paso 3: desconectando el último nodo";
        mostrarToast("Paso 3: desconectando último nodo");
        resaltarLineaPseudocodigo(6);
        await esperar(1000);
      }
    } else if (tipo === "pila") {
      lastAction.textContent = "Paso 2: eliminando el tope";
      mostrarToast("Paso 2: operación POP");
      resaltarLineaPseudocodigo(2);
      await esperar(900);
    } else {
      lastAction.textContent = "Paso 2: eliminando el frente";
      mostrarToast("Paso 2: operación DEQUEUE");
      resaltarLineaPseudocodigo(2);
      await esperar(900);
    }

    let eliminado;
    if (tipo === "pila") {
      eliminado = estructura.pop();
    } else if (tipo === "cola") {
      eliminado = estructura.shift();
    } else {
      eliminado = estructura.pop();
    }

    ultimoInsertado = null;
    animarArea();
    render();

    lastAction.textContent = `Eliminado: ${eliminado}`;
    mostrarToast(`Eliminación completada: ${eliminado}`);

    await esperar(700);
    btnPaso.disabled = false;
    btnInsertar.disabled = false;
    btnEliminar.disabled = false;
    enProcesoPaso = false;
  }
}

function actualizarPseudocodigo() {
  const bloque = pseudocodigos[tipo][operacionActual] || pseudocodigos[tipo].espera;

  codeStructure.textContent = textos[tipo].nombre;
  codeAction.textContent =
    operacionActual === "espera"
      ? "En espera"
      : operacionActual.charAt(0).toUpperCase() + operacionActual.slice(1);

  codeSubtitle.textContent = bloque.subtitulo;
  pseudocodeLines.innerHTML = "";

  bloque.lineas.forEach((linea, index) => {
    const li = document.createElement("li");
    li.textContent = linea;
    li.classList.add("dim");

    if (index === bloque.activa) {
      li.classList.add("active");
    }

    pseudocodeLines.appendChild(li);
  });
}

function actualizarTextos() {
  tipoActual.textContent = textos[tipo].nombre;
  visualTitle.textContent = textos[tipo].titulo;
  visualSubtitle.textContent = textos[tipo].subtitulo;
  descTipo.textContent = textos[tipo].descripcion;
  actualizarLeyenda();
}

function actualizarLeyenda() {
  if (tipo === "lista") {
    legendContent.innerHTML = `
      <div class="legend-item">
        <span class="legend-dot dot-node"></span>
        <span>Nodo</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot dot-special"></span>
        <span>Cabeza / Cola</span>
      </div>
    `;
  } else if (tipo === "pila") {
    legendContent.innerHTML = `
      <div class="legend-item">
        <span class="legend-dot dot-node"></span>
        <span>Elemento</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot dot-special"></span>
        <span>Tope</span>
      </div>
    `;
  } else {
    legendContent.innerHTML = `
      <div class="legend-item">
        <span class="legend-dot dot-node"></span>
        <span>Elemento</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot dot-special"></span>
        <span>Frente / Final</span>
      </div>
    `;
  }
}

function insertar() {
  const valor = inputValor.value.trim();
  if (valor === "") return;

  estructura.push(valor);
  ultimoInsertado = valor;
  operacionActual = "insertar";

  actualizarPseudocodigo();
  lastAction.textContent = `Insertado: ${valor}`;

  inputValor.value = "";
  animarArea();
  render();
  mostrarToast(`Se insertó ${valor}`);
}

function eliminar() {
  if (estructura.length === 0) {
    mostrarToast("La estructura está vacía");
    return;
  }

  const nodos = tipo === "lista"
    ? visualArea.querySelectorAll(".node-box")
    : visualArea.querySelectorAll(".node-stack, .node-queue");

  if (nodos.length > 0) {
    let indice = nodos.length - 1;

    if (tipo === "cola") {
      indice = 0;
    }

    const nodoObjetivo = nodos[indice];
    if (nodoObjetivo) {
      nodoObjetivo.classList.add("node-remove");
    }
  }

  setTimeout(() => {
    let eliminado;

    if (tipo === "pila") {
      eliminado = estructura.pop();
    } else if (tipo === "cola") {
      eliminado = estructura.shift();
    } else {
      eliminado = estructura.pop();
    }

    ultimoInsertado = null;
    operacionActual = "eliminar";
    actualizarPseudocodigo();
    lastAction.textContent = `Eliminado: ${eliminado}`;
    animarArea();
    render();
    mostrarToast(`Se eliminó ${eliminado}`);
  }, 260);
}

function limpiar() {
  if (estructura.length === 0) {
    mostrarToast("No hay elementos para limpiar");
    return;
  }

  visualArea.classList.add("updating");

  setTimeout(() => {
    estructura = [];
    ultimoInsertado = null;
    operacionActual = "limpiar";
    lastAction.textContent = "Estructura reiniciada";
    actualizarPseudocodigo();
    render();
    mostrarToast("Estructura limpiada");
    visualArea.classList.remove("updating");
  }, 180);
}

function animarArea() {
  visualArea.classList.add("updating");
  setTimeout(() => {
    visualArea.classList.remove("updating");
  }, 220);
}

function mostrarToast(mensaje) {
  if (!toast) return;

  toast.textContent = mensaje;
  toast.classList.remove("show");
  void toast.offsetWidth;
  toast.classList.add("show");
}

function renderLista() {
  const wrapper = document.createElement("div");
  wrapper.className = "list-wrapper";

  estructura.forEach((valor, index) => {
    const group = document.createElement("div");
    group.className = "linked-node";

    const content = document.createElement("div");
    content.className = "linked-node-content";

    const nodeBox = document.createElement("div");
    nodeBox.className = "node-box";

    if (index === 0 || index === estructura.length - 1) {
      nodeBox.classList.add("special");
    }

    const dataBox = document.createElement("div");
    dataBox.className = "node-data";
    dataBox.textContent = valor;

    const pointerBox = document.createElement("div");
    pointerBox.className = "node-pointer";
    pointerBox.textContent = "↗";

    nodeBox.appendChild(dataBox);
    nodeBox.appendChild(pointerBox);
    content.appendChild(nodeBox);

    if (estructura.length === 1) {
      const tag = document.createElement("div");
      tag.className = "node-tag";
      tag.textContent = "Cabeza / Cola";
      content.appendChild(tag);
    } else if (index === 0) {
      const tag = document.createElement("div");
      tag.className = "node-tag";
      tag.textContent = "Cabeza";
      content.appendChild(tag);
    } else if (index === estructura.length - 1) {
      const tag = document.createElement("div");
      tag.className = "node-tag";
      tag.textContent = "Cola";
      content.appendChild(tag);
    }

    group.appendChild(content);
    wrapper.appendChild(group);

    const arrow = document.createElement("div");
    arrow.className = "link-arrow";
    arrow.innerHTML = "→";
    wrapper.appendChild(arrow);

    if (index === estructura.length - 1) {
      const nullBox = document.createElement("div");
      nullBox.className = "link-null";
      nullBox.textContent = "NULL";
      wrapper.appendChild(nullBox);
    }
  });

  visualArea.innerHTML = "";
  visualArea.appendChild(wrapper);
}

function renderPila() {
  const wrapper = document.createElement("div");
  wrapper.className = "stack-wrapper";

  estructura.forEach((valor, index) => {
    const node = document.createElement("div");
    node.className = "node-stack node-enter";
    node.textContent = valor;

    if (index === estructura.length - 1) {
      node.classList.add("top");
      const label = document.createElement("span");
      label.className = "stack-label";
      label.textContent = "Tope";
      node.appendChild(label);
    }

    wrapper.appendChild(node);
  });

  visualArea.innerHTML = "";
  visualArea.appendChild(wrapper);
}

function renderCola() {
  const wrapper = document.createElement("div");
  wrapper.className = "queue-wrapper";

  estructura.forEach((valor, index) => {
    const node = document.createElement("div");
    node.className = "node-queue node-enter";
    node.textContent = valor;

    if (estructura.length === 1) {
      node.classList.add("front", "rear");
      const tag = document.createElement("span");
      tag.className = "queue-tag";
      tag.textContent = "Frente / Final";
      node.appendChild(tag);
    } else if (index === 0) {
      node.classList.add("front");
      const tag = document.createElement("span");
      tag.className = "queue-tag";
      tag.textContent = "Frente";
      node.appendChild(tag);
    } else if (index === estructura.length - 1) {
      node.classList.add("rear");
      const tag = document.createElement("span");
      tag.className = "queue-tag";
      tag.textContent = "Final";
      node.appendChild(tag);
    }

    wrapper.appendChild(node);

    if (index < estructura.length - 1) {
      const arrow = document.createElement("div");
      arrow.className = "arrow";
      arrow.innerHTML = "→";
      wrapper.appendChild(arrow);
    }
  });

  visualArea.innerHTML = "";
  visualArea.appendChild(wrapper);
}

function resaltarUltimoInsertado() {
  if (!ultimoInsertado) return;

  const nodos = tipo === "lista"
    ? visualArea.querySelectorAll(".node-box")
    : visualArea.querySelectorAll(".node-stack, .node-queue");

  if (!nodos.length) return;

  const nodoObjetivo = nodos[nodos.length - 1];

  if (nodoObjetivo) {
    nodoObjetivo.classList.add("node-highlight");
    setTimeout(() => {
      nodoObjetivo.classList.remove("node-highlight");
    }, 700);
  }
}

function render() {
  sizeValue.textContent = estructura.length;

  if (estructura.length === 0) {
    visualArea.classList.add("empty");
    visualArea.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">∅</div>
        <p>La estructura está vacía</p>
      </div>
    `;
    return;
  }

  visualArea.classList.remove("empty");

  if (tipo === "lista") {
    renderLista();
  } else if (tipo === "pila") {
    renderPila();
  } else {
    renderCola();
  }

  resaltarUltimoInsertado();
}

/* MODO OSCURO */
function setTheme(mode) {
  if (mode === "dark") {
    document.body.setAttribute("data-theme", "dark");
  } else {
    document.body.removeAttribute("data-theme");
  }
  localStorage.setItem("theme", mode);
}

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  setTheme(savedTheme);
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (prefersDark) {
    setTheme("dark");
  }
}

if (toggleThemeBtn) {
  toggleThemeBtn.addEventListener("click", () => {
    const isDark = document.body.getAttribute("data-theme") === "dark";
    setTheme(isDark ? "light" : "dark");
  });
}

actualizarTextos();
actualizarPseudocodigo();
render();