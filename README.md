# Visual Data Structure

Herramienta educativa interactiva para comprender **listas enlazadas, pilas, colas, árboles BST y grafos** mediante visualización dinámica, ejecución paso a paso y pseudocódigo resaltado.

Proyecto presentado en la **JIC UTP 2026** (Universidad Tecnológica de Panamá, Centro Regional de Colón).

🔗 **Demo en línea:** https://visualdatastructure.xo.je/

<!-- Agrega aquí una captura o GIF: -->
<!-- ![Visual Data Structure](docs/captura.png) -->

## Características

- **Cinco estructuras de datos:** Lista, Pila, Cola, Árbol BST y Grafo, dibujadas en tiempo real con SVG.
- **Modo paso a paso:** cada inserción o eliminación se anima por etapas.
- **Pseudocódigo sincronizado:** la línea que se ejecuta se resalta mientras avanza la animación.
- **Panel informativo** con la descripción y la referencia visual de cada estructura.
- **Juego de preguntas** para poner a prueba lo aprendido.
- **Modo desafíos** con puntos y rachas. El progreso se guarda en el navegador.
- **Tema claro y oscuro.**
- **Módulo de evaluación** de usabilidad y aprendizaje (ver más abajo).

## Módulo de evaluación

Permite medir si la herramienta ayuda a aprender y si es fácil de usar:

1. **Pretest:** conocimiento previo del participante.
2. **Exploración** de la aplicación.
3. **Postest + escala SUS** (System Usability Scale, 10 preguntas) y preguntas abiertas.

Los resultados se guardan en MySQL. Un **panel de administración** (`admin/resultados.html`) muestra el total de participantes, el puntaje SUS promedio, la mejora entre pretest y postest, la distribución por categoría SUS y cuántos usarían la aplicación.

### Resultados del estudio

<!-- Completa con tus datos reales: -->

| Métrica | Resultado |
|---|---|
| Participantes | [N] |
| SUS promedio | [__ / 100] |
| Pretest promedio | [__] |
| Postest promedio | [__] |
| Participantes que mejoraron | [__ %] |

## Tecnologías

- **Frontend:** HTML, CSS y JavaScript (sin frameworks), SVG
- **Backend:** PHP (PDO) y MySQL
- **Móvil:** estructura preparada para Apache Cordova
- **Hosting:** InfinityFree

## Estructura del proyecto

```
.
├── index.html            # Aplicación principal
├── css/style.css         # Estilos y temas
├── js/app.js             # Lógica, visualizaciones, juego, desafíos y evaluación
├── img/logo.png
├── admin/
│   └── resultados.html   # Panel de resultados (requiere clave de administrador)
└── api/
    ├── guardar_evaluacion.php
    ├── obtener_resultados.php
    ├── crear_tabla.sql
    └── config.example.php   # Copia de configuración de ejemplo
```

## Cómo ejecutarlo

### Solo las visualizaciones (sin evaluación)

Abre `index.html` en el navegador, o sírvelo con cualquier servidor estático.

### Con el módulo de evaluación

Necesitas PHP 8+ y MySQL.

1. Crea una base de datos y ejecuta `api/crear_tabla.sql`.
2. Copia `api/config.example.php` a `api/config.php` y completa los datos de tu base de datos y una **clave de administrador propia**.
3. Sirve el proyecto con PHP (por ejemplo `php -S localhost:8000`) y abre `http://localhost:8000`.
4. Entra a `/admin/resultados.html` e ingresa tu clave para ver los resultados.

> `api/config.php` contiene credenciales y está excluido del repositorio mediante `.gitignore`. Nunca lo subas.

## Privacidad

El módulo de evaluación guarda las respuestas del participante (carrera, año, resultados de los tests y comentarios). [Indica aquí si también se registra la IP y cómo se informa al participante.]

## Autor

**Chevesade Ornano**
Estudiante de Desarrollo y Gestión de Software, UTP Centro Regional de Colón.

[LinkedIn](https://www.linkedin.com/in/chevesadeornano/) · [GitHub](https://github.com/ChevesadeO)

## Licencia

[MIT](LICENSE)
