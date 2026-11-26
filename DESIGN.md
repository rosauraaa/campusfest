# Design

World: transit signage in the Lance Wyman tradition. The engineering week is drawn as a metro line, and each event category is a line with its own colour and pictogram.

## Palette

| Token | Value | Use |
|---|---|---|
| `--ink` | `#15161a` | Shell band, primary buttons, body text |
| `--ground` | `#eef0f3` | Page background (cool off-white, signage paper) |
| `--surface` | `#ffffff` | Event cards, inputs, chips |
| `--ink-soft` | `#3d3e45` | Secondary text |
| `--text-muted` | `#5f5b53` when fixed | Meta text. Ships as `#aba69d` on purpose (BUG-7) |
| `--rule` | `#dadee5` | Hairlines and borders |
| `--line-hackathon` | `#d81e6c` | Hackathon line |
| `--line-robotica` | `#d85d0c` | Robotics line |
| `--line-conferencias` | `#0a62b8` | Talks line; also the focus and selection colour |
| `--line-esports` | `#7b2d9c` | E-sports line |
| `--line-feria` | `#0c8a49` | Fair line; registered state |
| `--few` / `--few-bg` | `#b3460a` / `#fdeee2` | Five or fewer spots left |

## Type

Outfit (variable, OFL, self-hosted in `src/fonts/`) for everything; hierarchy comes from weight and size. Scale: 14 / 18 / 23 / 34 px. Display weight is 800 with -0.02em tracking. Tabular numerals everywhere.

## Components

- **Shell band:** ink header with the wordmark, the week range, and the "Mis inscripciones" toggle (outline on dark).
- **Week line (signature):** a white 10px rail with five stations (ink centre, white 7px ring). Today gets a light-blue ring; the selected day scales up with a fill and the talks-line ring. Small line squares under each station show which categories run that day. Clicking a station filters to that day.
- **Pictograms:** rounded squares (12px radius) filled with the line colour; white 2.4-stroke SVG glyphs.
- **Chips:** pill filters with a small pictogram; pressed state inverts to ink.
- **Event card:** white surface, 14px radius, soft two-layer shadow. Head: pictogram, title, then time and venue meta. Foot (after a hairline): spots, price, countdown, and the primary action.
- **Buttons:** ink fill, 10px radius, 44px minimum height. Disabled is a cool gray. Registered is green outline with a check.
- **States:** empty result card with "Limpiar filtros"; error panel for load failures; visible focus ring in the talks blue.

## Motion

One authored moment: stations scale with an exponential ease-out (260ms). Everything else is a short colour transition. Disabled under `prefers-reduced-motion`.
