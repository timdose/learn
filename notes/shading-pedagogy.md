# Shading Pedagogy — Brainstorming Notes
*May 2026*

---

## The core problem

Students see the terminator and the highlight. They draw a gradient between those two things — dark at the terminator, bright at the highlight. This distorts the form, because the highlight is not the peak of the diffuse shading. The true peak of diffuse shading (the light-facing point) is in a different location. The highlight is a viewer-dependent phenomenon that sits on top of the form shading.

---

## The two-layer model

Shading is two independent, separable things:

**Layer 1 — Form shading** (diffuse):
- Purely about the form's relationship to the light
- Independent of where the viewer is standing
- Peak at the light-facing point
- Falls to zero at the terminator
- Does not move as you orbit the object

**Layer 2 — Highlight** (specular):
- Purely about the viewer's position relative to the light
- Sits on top of the form shading as a separate layer
- Lives at the halfway point between the viewer direction and the light direction
- Moves as you move

The mistake: students treat Layer 2 as if it were the peak of Layer 1. They collapse two independent things into one. A demo where you orbit the sphere and watch the highlight move while the form shading stays completely still might make this visible.

---

## The three-landmark framework

Three key points on a lit sphere:

1. **The light-facing point** — where the surface normal aligns with the light direction. Peak diffuse brightness. Fixed regardless of viewer position.
2. **The terminator** — where the surface normal is perpendicular to the light direction. 90° from the light-facing point. The shadow boundary. Also fixed.
3. **The highlight** — where the surface normal aligns with the half-vector (midpoint between viewer and light directions). Viewer-dependent, moves as you move.

The traditional teaching error is conflating 1 and 3.

---

## Halftone / the middle zone

The "halftone" zone (traditionally: the zone between the lit area and the terminator where shading noticeably darkens) is problematic as a term because:
- "Halftone" implies it's halfway, encouraging students to look for a value level rather than a form orientation
- It shifts attention from geometry to appearance

Geometrically, the zone is roughly 45–70° from the light-facing point. The cosine curve means darkening accelerates toward the terminator — so the halftone zone is actually shifted toward the terminator, not in the middle of the lit area. Students who shade linearly from terminator to light-facing point place their halftones too close to the center.

---

## Alternative vocabulary worth exploring

Instead of describing surface orientation, describe the light-surface encounter:

- **Head-on vs. glancing** — everyday language (a head-on collision vs. a glancing blow). The gradient between them is intuitive.
- **"How high is the light above your horizon"** — imagine standing as an ant on the sphere surface. The terminator is where the light sits exactly on your horizon. Noon sun = facing the light. Setting sun = terminator. Below horizon = shadow. This reuses intuition about daylight and connects to landscape painting.
- **"The edge of the light"** — "find the edge of the light" is vocabulary artists already use. Everything beyond the edge is shadow. Brightness increases as you move away from the edge toward the most-lit point.

---

## The form as a "value mountain"

The light-facing point is the summit. Shading radiates outward from it in all directions toward the terminator (the base). The halftone zone is "one step out from the summit."

This framing makes the light-facing point structurally central rather than just one end of a gradient. It also makes the terminator a circle around the form, not a line.

Could be illustrated as concentric rings on the sphere (like topographic lines), each ring a zone of equal brightness.

---

## The rate-of-change insight

The cosine curve is nearly flat near the facing point — brightness changes slowly when you're close to facing the light. It falls fastest near the terminator (where cosine's derivative, sine, is at maximum).

Practical implication: the halftone zone where shading darkens most dramatically is closer to the terminator than to the facing point. Students who expect it to be "in the middle" are wrong.

---

## The "two-layer" teaching sequence

Teach form shading and highlights as separate lessons:
1. First lesson: matte sphere only. Find the light-facing point. Find the terminator. Shade between them. No highlight.
2. Second lesson: add the highlight as a separate layer. Show that it lives at a different location than the light-facing point. Show that it moves when the viewer moves; the form shading does not.

The highlights demo is designed for lesson 2. The form-direction demo is designed for lesson 1.
