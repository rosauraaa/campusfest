---
version: 1
slug: "src-index-html"
primary_target: "src/index.html"
related_targets: []
---

## Scope

Single screen `src/index.html`, the CampusFest event listing. Visitor mode: **Operate**. Audience: IT students in a GitHub Actions workshop who browse, search, filter, and register for fictional events, while finding and fixing 8 deliberate bugs that look natural rather than highlighted.

## Direction contract

THESIS: The engineering week read as a metro line. The listing refuses the generic "event cards on gray" page: time is a route, days are stations, and categories are lines.

OWN-WORLD: Wyman-style transit signage. Ink-black shell band, warm off-white ground, five flat saturated line colours (pink hackathon, orange robotics, blue talks, purple e-sports, green fair). Rounded-square geometric pictograms with a 2.4 stroke. Outfit, self-hosted, heavy for display. Tabular numerals.

STORY: The student sees a believable, polished product, notices something wrong (negative spots, $0, "1 lugares", the wrong month), opens the code, and understands that the pipeline will judge the fix.

FIRST VIEWPORT: Ink header with the CampusFest wordmark, the week range, and "Mis inscripciones" on the right. Below it, the full-width week line: five stations, today enlarged with a blue ring, and colour squares for the lines serving each day. Then the toolbar: search field and category chips. Then a 3-column event grid with pictogram, title, date/time, venue, spots, price, countdown, and the primary "Inscribirme" button.

FORM: Comp A (top bar + week line + grid), position 4 on the ordered list (Wyman metro), seed:d237b3e2120394dd.

SIGNATURE: Clicking a station on the week line filters to that day; the station grows and takes the blue ring. Registering updates the spot count and the "Mis inscripciones" counter in place.

## Open decisions

None.
