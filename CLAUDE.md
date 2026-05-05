# CLAUDE.md — Fundación E.B.A.C. (GitHub Pages repo)

## Rutas del proyecto

| Ubicación | Path |
|-----------|------|
| Local (fuente) | `~/Desktop/Casa Tapputi/Programa de Fortalecimiento de Economías Locales/sitio_web/` |
| Deploy (GitHub Pages) | `~/casatapputi-arch.github.io/` (ROOT del repo) |
| Dominio | fundacionebac.com.mx (DNS Telmex → GitHub Pages) |

## Flujo de edición

1. Editar en la ruta local (`sitio_web/`)
2. Sincronizar al repo con:

```bash
rsync -av --exclude='.DS_Store' --exclude='galeria/' \
  "~/Desktop/Casa Tapputi/Programa de Fortalecimiento de Economías Locales/sitio_web/" \
  "~/casatapputi-arch.github.io/"
```

3. Commit y push:

```bash
cd ~/casatapputi-arch.github.io
git add antecedentes/ assets/ como-nos-relacionamos/ contacto/ galeria/ participa/ programas/ quienes/ index.html LOGO_EBAC.png
git commit -m "$(cat <<'EOF'
Descripción del cambio

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
git push
```

## Arquitectura multi-página (estructura actual)

```
/                        ← index.html (home condensada)
/quienes/                ← Quiénes somos (valores SVG + estructura operativa)
/como-nos-relacionamos/  ← Formas de relación + caracol 4 dimensiones
/programas/              ← El programa + modalidades + HRV (con SVGs)
/participa/              ← Tabs: universidades / estudiantes / microempresas
/antecedentes/           ← Timeline 2018–2026 + testimonial Dr. Barrera
/galeria/                ← Pendiente selección fotográfica
/contacto/               ← Formulario + mapa Google Maps
/assets/css/main.css     ← CSS compartido (todas las páginas)
/assets/js/main.js       ← JS compartido (menu, tabs, form, scroll reveal)
/assets/images/logo/     ← LOGO_EBAC.png
```

## Paleta y variables CSS

```
--verde-oscuro:  #2C5F2E
--verde-medio:   #4A7C59
--verde-claro:   #A8C5A0
--tierra:        #8B5E3C
--arena:         #F5F0E8
--crema:         #FDFAF5
```

Base: `html { font-size: 18px; }` — todos los tamaños en `rem`.

## Reglas de contenido — NO TOCAR

- **Caracol / 4 dimensiones**: SER / ESTRUCTURA / PROGRAMA / OPERACIÓN — términos exactos, sin parafrasear
- **SVG Ejes de acción**: `viewBox="0 0 720 720"`, cx=cy=360, 4-gajo donut — no reescalar viewBox
- **SVG Hikuri Regenerativo**: `viewBox="0 0 760 700"`, 7 segmentos — escalar solo via `max-width` CSS
- **Citas institucionales** (Dr. Barrera): reproducir verbatim
- **Fotos Pexels** en home hero: mantener hasta sustitución con fotos reales

## SVG Ejes de Acción

- `viewBox="0 0 720 720"`, `cx=cy=360`, `r_outer=300`, `r_inner=128`, `r_label=214`
- Gajos: NE `#2C5F2E` | SE `#4A7C59` | SW `#8B5E3C` | NW `#5C8C6A`

## SVG Hikuri Regenerativo

- `viewBox="0 0 760 700"` fijo — no modificar
- Escala CSS: `max-width: 1026px` (= 760 × 1.35)

## Galería (pendiente)

- Criterio: 3–5 imágenes por evento, priorizando calidad técnica, diversidad de actividades y representación territorial
- Validación: Dr. Barrera revisa antes de publicar
- WebP: pendiente conversión (tarea futura)
- 11 eventos documentados (Primera Etapa 2018–2021)

## Diseño y estética

- Skill activo: `frontend-design` + Frontend Aesthetics Cookbook
- Look & feel: bold, distintivo, institucional mexicano
- Tipografía: Georgia serif para títulos + sans-serif para cuerpo
- Evitar estética genérica de IA
