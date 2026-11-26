# Guía del instructor · Taller CampusFest

Taller: **“Del código a la entrega: automatiza pruebas con GitHub Actions”**
Jueves 26 de noviembre de 2026 · 15:50–18:00 · Aula C24 · ~25 alumnos con laptop Windows y cuenta propia de GitHub.

---

## 1. Preparación (hoy y mañana antes de las 14:00)

### Publicar el template (con tu cuenta personal, NO la corporativa)

```powershell
gh auth login                      # entra con iDiegoIbarra (cuenta personal)
gh auth status                     # confirma que la cuenta activa NO es *_atsolera
cd C:\Repos\Personal\taller-github-actions
gh repo create iDiegoIbarra/campusfest --public --source . --remote origin --push
gh repo edit iDiegoIbarra/campusfest --template --enable-issues
```

> La rama `solucion` es **solo local**. No la publiques: el repo es público y los alumnos la verían.

1. En `github.com/iDiegoIbarra/campusfest` → **Settings → Pages → Source: GitHub Actions** → **Actions → 4 · CI/CD → Re-run failed jobs**.
2. Crea el Issue de registro y fíjalo (**Pin issue**):
   ```powershell
   gh issue create --repo iDiegoIbarra/campusfest --title "🏁 Registro del taller: comenta tu usuario de GitHub" --body "Comenta SOLO tu usuario de GitHub (por ejemplo: juanperez). Si tu repositorio no se llama campusfest, escribe usuario/nombre-del-repo."
   ```
3. Haz una corrida completa con **una cuenta secundaria** (o pide a alguien): template → Pages → bug guiado → PR rojo → verde → merge → sitio publicado → aparece en el marcador. Mide el tiempo.
4. Graba un video corto (2–3 min) de esa corrida como respaldo y toma capturas de: PR en rojo, log con “Se esperaba / Se obtuvo”, PR en verde, grafo de CI/CD, sitio publicado y Release.
5. Revisa `https://www.githubstatus.com` antes de salir y otra vez a las 15:30.

### Llevar

- Laptop con cargador, HDMI/USB-C, hotspot del celular.
- Este repo clonado y probado: `npm run ci` en verde.
- Video y capturas de respaldo **sin conexión** (en la laptop, no en la nube).
- Enlace corto o QR al template: `https://github.com/iDiegoIbarra/campusfest`.

---

## 2. Arranque de los servidores (15:40)

```powershell
cd C:\Repos\Personal\taller-github-actions
node scripts/serve.mjs --lan          # app con bugs en http://localhost:5173/?hoy=2026-11-26
```

En otra terminal:

```powershell
Remove-Item Env:GH_TOKEN -ErrorAction SilentlyContinue   # solo en esta ventana: usa la cuenta personal
$env:GITHUB_TOKEN = (gh auth token)   # de la cuenta personal
$env:MARCADOR_ISSUE = "iDiegoIbarra/campusfest#1"
node instructor/marcador/server.mjs   # marcador en http://localhost:8080
```

---

## 3. Guion (130 min)

| Hora | Bloque | Qué haces | Qué dices (idea, no texto literal) |
|---|---|---|---|
| 15:50 | **Arranque** (10) | Wi-Fi, todos inician sesión en GitHub. QR del template. | “Hoy no se trata de programar más, sino de entregar con confianza.” Se vale usar IA; el pipeline es el juez. |
| 16:00 | **¿Qué es GitHub Actions?** (15) | Proyecta CampusFest con bugs. Recorre los 4 YAML en GitHub y muestra un run de CI/CD como grafo. | Workflow, trigger, job, step, needs. “Si Validar falla, no se publica: producción nunca se rompe.” |
| 16:15 | **Setup** (15) | Pasos 1–3 del README. Recorre el salón. | El primer rojo (Pages sin activar) es normal: “leer un error también es parte del trabajo”. |
| 16:30 | **Bug guiado** (25) | Paso 4 en vivo, en tu pantalla y a la par de ellos. | Detente en el log: “Se esperaba 0, se obtuvo -3”. Luego el verde y el despliegue. |
| 16:55 | **Pausa** (5) | Revisa el marcador: ¿quién no tiene sitio publicado? Ayúdales. | — |
| 17:00 | **Competencia** (40) | Marcador en el proyector. Circula. | Recuerda: un bug por PR es más ordenado. |
| 17:40 | **Respaldo** (5) | Todos ejecutan 3 · Respaldo a mano. | Artefacto vs Release; por qué se respalda. |
| 17:45 | **Cierre** (15) | Top 3 y premios. Preguntas. Foto. | Dónde se usa esto en la industria: PRs con checks obligatorios, despliegues automáticos y respaldos. |

**Premios sin costo:** su fix integrado al repo oficial con mención en el README (*Hall of Fame*); recomendación o aptitud en LinkedIn (con su permiso); 30 min de mentoría para revisar CV y GitHub; mención en los canales de la Escuela.

---

## 4. Plan B

| Si pasa esto | Haz esto |
|---|---|
| Un alumno no tiene cuenta o no puede entrar | Trabaja en pareja con otro alumno (cuenta del compañero). Que cree su cuenta después. |
| **4 · CI/CD** falla en “Verificar Pages” | Paso 2 del README y **Re-run failed jobs**. |
| **Publicar** falla con *No artifacts named "github-pages"* | Bug conocido de GitHub (actions/deploy-pages#451). El workflow ya reintenta solo una vez; si aun así falla: **Actions → 4 · CI/CD → Run workflow** (ejecución nueva). Nunca “Re-run all jobs”: duplica el artefacto. |
| Rompió `main` | Validar bloquea el despliegue: su sitio sigue funcionando. Que haga **Revert** del commit o abra otra rama. |
| Borró workflows o pruebas | **Revert**. El marcador usa pruebas oficiales: no gana puntos “arreglando” pruebas. |
| GitHub Actions lento o en cola | Avanza con la explicación del log usando tus capturas. El marcador se actualiza solo cuando terminan. |
| Pages caído o muy lento | Reinicia el marcador con `--fuente=raw` (lee el código de `main`). Los puntos de “Publicado” no cuentan en ese modo. |
| El Issue de registro no funciona | Escribe usuarios en `instructor/marcador/participantes.txt` (uno por línea). |
| Límite de la API de GitHub | Confirma `$env:GITHUB_TOKEN`. Sin token, PR y Release se revisan cada 10 min. |
| Sin internet en el aula | Hotspot para tu demo. Proyecta la app con `serve.mjs`, explica con el video y las capturas, y haz el ejercicio de lectura de YAML y logs. |
| Se acaba el tiempo | Ruta mínima: Setup → bug guiado → despliegue. Lo demás es bonus. |
| Nadie logra el bug guiado | Haz tú el merge en vivo con tu cuenta de prueba y sigue. |

---

## 5. Después del taller

- Integra el mejor fix de cada top 3 al repo oficial y agrégalos al *Hall of Fame*.
- Comparte el enlace del template con la Universidad para que lo usen como práctica.
- Para reiniciar el marcador borra `instructor/marcador/state.json`.
