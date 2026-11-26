# CampusFest · Taller de GitHub Actions

**Del código a la entrega: automatiza pruebas con GitHub Actions**

CampusFest es la cartelera (ficticia) de la Semana de Ingeniería. Tiene **8 bugs** que se ven a simple vista. Tu misión: corregirlos y lograr que tu corrección pase por **4 workflows de GitHub Actions** hasta quedar publicada en internet.

> Puedes usar IA. Aquí el juez no es el instructor ni la IA: **es el pipeline**.

Solo necesitas un navegador y tu cuenta de GitHub. No instalas nada.

---

## Los 4 workflows

| Workflow | Qué hace | Cuándo corre |
|---|---|---|
| **1 · Validar** | Revisa archivos y sintaxis, y corre las pruebas | En cada Pull Request |
| **2 · Compilar** | Prepara el sitio (`dist/`) y lo guarda como artefacto | En cada Pull Request |
| **3 · Respaldo** | Crea un ZIP del código; a mano, además una Release | Al llegar a `main` y a mano |
| **4 · CI/CD** | Valida → Compila → **Publica en GitHub Pages** | Al llegar a `main` |

Si **Validar** falla, **no se publica nada**: tu sitio en línea nunca se rompe.

---

## Paso 1 · Crea tu copia (5 min)

1. Arriba de esta página presiona **Use this template → Create a new repository**.
2. **Owner:** tu usuario. **Repository name:** `campusfest`. Visibilidad: **Public**.
3. Presiona **Create repository**.

## Paso 2 · Activa GitHub Pages (3 min)

1. En **tu** repositorio ve a **Settings → Pages**.
2. En **Build and deployment → Source** elige **GitHub Actions**.
3. Ve a la pestaña **Actions**. Verás **4 · CI/CD** en rojo ❌: falló porque Pages aún no estaba activo. Ábrelo y presiona **Re-run failed jobs**.
4. Cuando esté en verde ✅, abre tu sitio: `https://TU-USUARIO.github.io/campusfest/`

¡Acabas de hacer tu primer despliegue con CI/CD!

## Paso 3 · Regístrate en el marcador (1 min)

Comenta **solo tu usuario de GitHub** en el Issue del taller que te comparta el instructor.

---

## Paso 4 · Bug guiado: cupos negativos (25 min)

La **Batalla de minisumo** dice **“-3 lugares”** y todavía te deja inscribirte. Lo arreglaremos juntos.

**a. Abre el editor web.** En tu repositorio presiona la tecla **`.`** (punto). Se abre **github.dev**, un VS Code en el navegador.

**b. Crea una rama.** Abajo a la izquierda haz clic en **main** → **Create new branch…** → escribe `fix/bug-0` → Enter.

**c. Activa la prueba.** Abre `tests/bugs.test.js` y en la prueba `[BUG-0 · guiado]` cambia `test.skip(` por `test(`.

**d. Haz commit.** Abre **Source Control** (ícono de ramas, o `Ctrl+Shift+G`), escribe el mensaje `Activa la prueba del bug 0` y presiona **Commit & Push**.

**e. Abre un Pull Request.** Regresa a `github.com/TU-USUARIO/campusfest`. Verás el aviso **Compare & pull request**: presiónalo y luego **Create pull request**.

**f. Mira el rojo.** En el PR, el check **1 · Validar** falla ❌. Haz clic en **Details** y lee:

```
❌ [BUG-0 · guiado] Los cupos nunca son negativos y un evento sobrevendido está lleno
    → spotsLeft no debe regresar números negativos
    → Se esperaba: 0
    → Se obtuvo:   -3
```

**g. Corrige el código.** En github.dev abre `src/js/logic.js` y busca la función `spotsLeft`. Haz que nunca regrese números negativos. Commit & Push **en la misma rama**.

**h. Mira el verde.** Regresa al PR: los checks se vuelven a ejecutar solos. Cuando todo esté ✅, presiona **Merge pull request**.

**i. Mira la entrega.** En **Actions** corren **3 · Respaldo** y **4 · CI/CD**. Cuando terminen, recarga tu sitio: la Batalla de minisumo ahora dice **Cupo lleno**.

> Ese es el ciclo completo: **cambio → prueba en rojo → corrección → verde → merge → despliegue.**

---

## Paso 5 · Competencia libre (40 min)

Los otros 7 bugs están en **[BUGS.md](BUGS.md)**. Para cada uno repite el ciclo: rama → quitar `.skip` → PR → rojo → corrección → verde → merge.

**Puntos** (el marcador revisa el código **publicado** en tu sitio con pruebas oficiales):

| Logro | Puntos |
|---|---|
| Sitio publicado en GitHub Pages | 10 |
| Bug guiado (BUG-0) | 20 |
| Cada bug libre (BUG-1 a BUG-7) | 10 |
| Al menos un Pull Request fusionado | 5 |
| Release de respaldo creada | 5 |

Empate: gana quien llegó primero a ese puntaje.

## Paso 6 · Respaldo (5 min)

**Actions → 3 · Respaldo → Run workflow → Run workflow.** Al terminar, revisa la sección **Releases** de tu repositorio: ahí está tu ZIP.

---

## Glosario rápido de GitHub Actions

| Concepto | En este repo |
|---|---|
| **Workflow** | Cada archivo en `.github/workflows/` |
| **Trigger** (`on:`) | Qué lo dispara: `pull_request`, `push`, `workflow_dispatch` (botón **Run workflow**) |
| **Job** | Un grupo de pasos que corre en una máquina limpia (`runs-on: ubuntu-latest`) |
| **Step** | Un comando (`run:`) o una acción reutilizable (`uses:`) |
| **needs** | Orden entre jobs: en CI/CD, Publicar espera a Compilar, que espera a Validar |
| **Reusable workflow** | CI/CD reutiliza Validar y Compilar con `workflow_call` |
| **Artefacto** | Archivo que guarda un workflow: el sitio compilado o el ZIP de respaldo |
| **Permissions** | Lo que el workflow puede hacer: leer código, publicar en Pages, crear releases |
| **Environment** | `github-pages`: el “ambiente de producción” de tu sitio |

## Problemas comunes

| Veo esto | Haz esto |
|---|---|
| **4 · CI/CD** falla en “Verificar que GitHub Pages esté activado” | Paso 2: Settings → Pages → Source: **GitHub Actions**, y luego **Re-run failed jobs** |
| Mi PR no muestra checks | Espera 10–20 segundos y recarga. Revisa que el PR sea hacia `main` de **tu** repositorio |
| “Revisión del sitio”: *app.js usa “x”, pero logic.js ya no lo exporta* | Renombraste o borraste una función. Regresa el nombre original |
| “Error de sintaxis” | Abre el archivo y la línea que indica el log. Suele faltar `)` o `}` |
| Mi sitio no cambia después del merge | Espera a que **4 · CI/CD** termine y recarga con `Ctrl+F5` |
| **Publicar** falla con *No artifacts named "github-pages"* o *Multiple artifacts* | Es un fallo temporal de GitHub. Ve a **Actions → 4 · CI/CD → Run workflow** para lanzar una ejecución nueva |
| Rompí todo | En el PR presiona **Close pull request** y empieza otra rama desde `main` |
| Quiero ver la app en mi compu | Opcional: con Node.js 22 o superior ejecuta `npm start` y abre `http://localhost:5173` |

---

CampusFest es un proyecto **ficticio** con fines educativos. Eventos, lugares y personas son inventados.
Fuente Outfit bajo SIL Open Font License (`src/fonts/OFL.txt`). Código bajo licencia MIT.
