# Contact addresses — source and edits

All postal addresses on `/contact` were transcribed on **2026-09-04** from the
live corporate site, <https://www.eurogriptyres.com/contact-us>, at the client's
request. They live in `OFFICES` in `src/pages/Contact.tsx` (plain array, ready
for a CMS).

Groups match the source page: **Corporate & Marketing Office** (2 Chennai
addresses), **Regional Offices** (6), **Manufacturing Unit** (2). The **Design
Centre** (Milan) is ours, not on the source page, and still needs a full address.

## Place names normalised

The source page has a few obvious spelling slips. These were corrected so they
don't ship on the new site — **please confirm with the client**, and revert any
that are actually intentional:

| Source page | Used on the new site | Why |
| --- | --- | --- |
| `Vellaripati, Melur Taluk` | `Vellaripatti, Melur Taluk` | The village is Vellaripatti; matches how the plant is named elsewhere on our site |
| `Chiner Park` (Kolkata) | `Chinar Park` | The Rajarhat locality is Chinar Park |
| `24th North Paragan` (Kolkata) | `North 24 Parganas` | District name |
| `Pant Nagar` (Uttarakhand) | `Pantnagar` | Single word, as used elsewhere on our site |
| `Himayath Nagar` (Hyderabad) | `Himayath Nagar` — **kept as printed** | Both spellings are in common use; left alone |

Formatting-only changes: hyphens before pincodes normalised to en dashes
(`Chennai - 600018` → `Chennai – 600018`), `R No.` expanded to `Room No.`,
`2nd Flr` to `2nd Floor`, `Nr.` to `Near`, `080 26716764` hyphenated to match the
other numbers. Digits themselves are untouched.

## Needs client confirmation

- **Kolkata phone is `040-23222388`** — that's a Hyderabad STD code, and it is
  the same number listed for the Hyderabad office. Almost certainly wrong on the
  source page. Reproduced as printed; needs the real Kolkata number.
- **Registered office** (TVS Building, 7-B West Veli Street, Madurai 625 001)
  was previously shown on our contact page. The source page does not list it, so
  it has been removed per the client's instruction. Confirm it should stay off.
- **Milan design centre** — full street address still outstanding.
- Corporate Office (Chennai, Venus Colony) has no phone number on the source
  page. Only the Marketing Office number is listed.
