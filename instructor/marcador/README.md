# Marcador del taller (solo instructor)

Los alumnos **no necesitan** esta carpeta.

El marcador lee los participantes de un Issue (o de `participantes.txt`), descarga el código **publicado** de cada alumno (`https://usuario.github.io/campusfest/`) y le corre las **pruebas oficiales** de `official-checks.mjs`. Cada evaluación corre en un proceso Node separado con `--permission` (no puede escribir en disco ni lanzar procesos) y con un límite de 5 segundos.

```powershell
Remove-Item Env:GH_TOKEN -ErrorAction SilentlyContinue   # solo en esta ventana: usa la cuenta personal
$env:GITHUB_TOKEN = (gh auth token)              # cuenta personal; opcional pero recomendado
$env:MARCADOR_ISSUE = "iDiegoIbarra/campusfest#1"
node instructor/marcador/server.mjs              # http://localhost:8080
node instructor/marcador/server.mjs --fuente=raw # plan B: lee la rama main en lugar de Pages
```

| Archivo | Para qué |
|---|---|
| `server.mjs` | Servidor y ciclo de evaluación (cada 45 s) |
| `runner.mjs` | Evalúa a un alumno en un proceso aislado |
| `official-checks.mjs` | Pruebas oficiales y puntos |
| `index.html` | Pantalla del proyector (se actualiza cada 10 s) |
| `participantes.txt` | Plan B: un usuario por línea (opcional) |
| `state.json` | Se genera solo; bórralo para reiniciar |
