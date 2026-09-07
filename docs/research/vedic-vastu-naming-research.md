# Traditional Hindu / Vedic Naming Principles — Research Report for NameGenius "Vastu Compliance Mode"

**Purpose:** source material for a deterministic, rule-based name-generation mode.
**Date of research:** September 2026.

## How to read this document

Every substantive claim is tagged with one of three provenance levels. This distinction is the
most important thing in the report, because a lot of what circulates online as "ancient Vedic
naming science" is in fact 20th-century practitioner convention or outright invention.

| Tag | Meaning |
|---|---|
| **[SCRIPTURAL]** | Stated in a named pre-modern Sanskrit text, with chapter/verse where available. |
| **[TRADITIONAL]** | Widely attested classical practice with a long pedigree, but the specific written locus is either a late compilation, an oral/regional tradition, or I could not verify a primary text. |
| **[MODERN]** | 19th–21st century practitioner convention. Often presented online as ancient; it is not. |
| **[OUR DESIGN]** | An inference or composition we are making. Not attributable to any tradition. |

A running theme: **the tradition names *people*, not *businesses*.** Everything in sections 1–3
is about the Namakarana samskara for a newborn. Applying it to a brand is [MODERN] at best and
[OUR DESIGN] at worst. Section 5 (Vastu) is about *buildings*, not names. The link between them
(section 6) is the weakest joint in the whole edifice and we should be honest about that in the
product.

---

# 1. Namakarana — the naming ceremony in the scriptures

## 1.1 Which texts govern it

Namakarana is the fifth of the sixteen *samskaras* (life-cycle rites). Its procedural rules come
from the **Grhya Sutras** (domestic ritual manuals, roughly 800–300 BCE), and are supplemented by
the **Dharmashastra** literature (chiefly Manusmriti, c. 200 BCE – 200 CE).

Jyotisha texts — **Brihat Samhita** (Varahamihira, 6th c. CE) and **Brihat Parashara Hora
Shastra** — are frequently cited in modern naming articles but do **not** in fact contain the
naming-syllable rules. Brihat Samhita ch. 53 is about *house-building*; BPHS is about chart
interpretation. Neither contains the Avakahada chakra syllable table. This is worth flagging
internally because vendors routinely miscite them.

### Primary loci

| Text | Locus | What it says |
|---|---|---|
| Āśvalāyana Gṛhya Sūtra | I.15.4–8 | Core phonetic rules; even syllables male, odd female; secret name |
| Pāraskara Gṛhya Sūtra | I.17.1–5 | Tenth day; two or four syllables; varna-based suffixes |
| Śāṅkhāyana Gṛhya Sūtra | I.24.4–6 | Two, four, **or six** syllables; kṛt not taddhita suffix |
| Āpastamba Gṛhya Sūtra | 6.15.2, 6.15.8–11 | Explicitly prescribes a **nakshatra name**; noun+verb structure |
| Gobhila Gṛhya Sūtra | II.8.14 | Parallel rules |
| Manusmṛti | 2.30–2.33, 3.9 | Timing; varna-semantic conventions; rules for women's names; prohibitions |

## 1.2 The actual rules

**[SCRIPTURAL] Timing.** Manusmriti 2.30 allows the tenth or twelfth day after birth; Paraskara
I.17.1 specifies the tenth. [TRADITIONAL] Later and regional practice extends this to the 11th,
12th, 16th, 18th, or any odd-numbered day up to the 21st, subject to muhurta.

**[SCRIPTURAL] Syllable count and gender.** This is the single clearest, most implementable
scriptural rule in the entire corpus.

> "And let them give him a name beginning with a sonant, with a semivowel in it, with the Visarga
> at its end, consisting of two syllables... Or of four syllables... Of two syllables, if he is
> desirous of firm position; of four syllables, if he is desirous of holy lustre... But in every
> case with an even number (of syllables) for men, an uneven for women."
> — Āśvalāyana Gṛhya Sūtra I.15.4–7 (Oldenberg trans., SBE vol. 29)

Decomposed:

1. **Even syllable count for males** (2 or 4; Śāṅkhāyana allows 6). **Odd for females.**
2. **Begins with a sonant** (*ghoṣavat* — a voiced sound: vowel, semivowel, or voiced consonant).
3. **Contains a semivowel** (*antaḥstha* — य ya, र ra, ल la, व va) somewhere inside.
4. **Ends in a long vowel or visarga** (ḥ) for males; **ends in ā** (long) for females.
5. **Uses a kṛt (verbal/primary) suffix, not a taddhita (nominal/secondary) suffix.**
   (Pāraskara I.17.2; Śāṅkhāyana I.24.4. Female names invert this: taddhita is prescribed.)
6. **Semantic loading by desired outcome:** 2 syllables → *pratiṣṭhākāma*, "firm position /
   stability"; 4 syllables → *yaśaskāma*, "holy lustre / renown". **This is directly useful for
   business naming** — it is a scriptural statement that name *length* encodes *intent*.

**[SCRIPTURAL] The "su-" particle.** Āpastamba 6.15.10: a name containing the particle *su-*
("good, well") "has a firm foundation; thus it is said in a Brāhmaṇa."

**[SCRIPTURAL] Noun + verb compound structure.** Āpastamba 6.15.9: "the first part should be a
noun; the second a verb." (e.g. *Dhana-* + *-da*, "wealth-giving".)

**[SCRIPTURAL] Varna-linked semantics and suffixes.** Manusmriti 2.31–2.32 and Paraskara I.17.4:

| Varna | First element denotes | Suffix |
|---|---|---|
| Brāhmaṇa | auspiciousness (*maṅgala*) | *-śarman* (peace/refuge) |
| Kṣatriya | power (*bala*) | *-varman* (protection) |
| Vaiśya | wealth (*dhana*) | *-gupta* (thriving/prosperity) |
| Śūdra | (Manu: "contemptible") | *-dāsa* (service) |

**Note for the product: do not implement the varna rules.** They are unambiguously scriptural,
but Manu 2.31's prescription that a Śūdra's name be *contemptible* is caste-degrading and has been
a live political issue in India for a century. Reproducing it in software would be indefensible.
The *Vaiśya* convention (wealth-semantics, *-gupta* suffix) is the historically business-relevant
one and could arguably be surfaced as an optional "merchant tradition" semantic flavour — but even
that should be decoupled from any user-declared caste. We recommend surfacing the **semantic
categories** (auspiciousness / power / wealth / service) as neutral *intent* options with a note
on their origin, and never asking the user for caste.

**[SCRIPTURAL] Qualitative test for women's names.** Manusmriti 2.33 is the most
modern-sounding line in the corpus and generalises beautifully to brand naming: a name should be
*easily pronounceable, not harsh, of plain meaning, heart-captivating, and auspicious*, ending in
a long vowel and containing a benedictory element.

**[SCRIPTURAL] Prohibitions.** Manusmriti 3.9 (in the context of choosing a bride, applied
by later commentators to naming generally) advises against names denoting **constellations,
trees, rivers, mountains, birds, snakes, or servile/lowly status**, and against names implying
death or terror.

**[SCRIPTURAL] Multiple names.** The Grhya Sutras prescribe at least two names: a *guhya*
(secret) name known only to the parents until initiation, and a *vyāvahārika* (public/transactional)
name. Āpastamba 6.15.2 adds explicitly: **"And he gives him a Nakshatra name."**

This is the scriptural hook for the entire nakshatra-syllable system. Note carefully what it does
and does not say: Āpastamba says *give a nakshatra name*. It does **not** contain the 108-syllable
table. That table is [TRADITIONAL], not [SCRIPTURAL] — see §2.4.

**[TRADITIONAL] Four names.** A widely attested South Indian convention gives four names at the
ceremony: (1) *Kuladevata nama* — the family deity; (2) a month/deity name; (3) the *Nakshatra
nama* — from the birth star; (4) the *vyāvahārika* name for daily use.

**[TRADITIONAL] Deity association.** Naming a child after the *kuladevata* (family/lineage deity)
or an iṣṭa-devatā is near-universal traditional practice and gives semantic content, not phonetic
constraint. For a business, the analogous move — invoking Lakṣmī (wealth), Gaṇeśa (obstacle-removal
/ auspicious beginnings), Kubera (treasury), Sarasvatī (learning/creativity), Viśvakarman
(craft/manufacture) — is [MODERN] as a systematised rule but has obvious traditional grounding and
is what practitioners actually do.

---

# 2. Nakshatra-pada syllables (the Avakahada Chakra)

## 2.1 The structure

The sidereal ecliptic (360°) is divided into 27 nakshatras of **13°20′** each. Each nakshatra is
divided into 4 *padas* (quarters) of **3°20′**. 27 × 4 = **108 padas**, matching the 108 beads of
a japa mala. Each pada is assigned one starting syllable (*akshara*).

The name syllable is determined by **the nakshatra-pada occupied by the Moon at the moment of
birth** (not the Sun, not the ascendant). The Moon crosses a pada in roughly one hour, which is
why birth *time* matters and a date alone is insufficient.

The table is called the **Avakahada Chakra** [TRADITIONAL] — a classical tabular device found in
panchangs and jataka compilations rather than in a single named root text.

## 2.2 The full 108-syllable table

This is the mainstream North Indian / pan-Indian version. It has been cross-validated three ways:
against the Wikipedia *List of Nakshatras* pada table, against practitioner tables
(vedicmarga.com, kundligpt.com, calcatools.com), and — most usefully — against the **12-rashi
syllable lists**, which must partition these same 108 padas into 12 groups of 9. That
partition check (§3.2) is a genuine arithmetic constraint and it resolves several of the
transcription conflicts in the online sources.

```
#   Nakshatra              Pada 1        Pada 2        Pada 3        Pada 4
--  ---------------------  ------------  ------------  ------------  ------------
 1  Ashwini                Chu  चु       Che  चे       Cho  चो       La   ला
 2  Bharani                Li   ली       Lu   लू       Le   ले       Lo   लो
 3  Krittika               A    अ        I    ई        U    उ        E    ए
 4  Rohini                 O    ओ        Va   वा       Vi   वी       Vu   वु
 5  Mrigashira             Ve   वे       Vo   वो       Ka   का       Ki   की
 6  Ardra                  Ku   कु       Gha  घ        Ṅa   ङ        Chha छ
 7  Punarvasu              Ke   के       Ko   को       Ha   हा       Hi   ही
 8  Pushya                 Hu   हु       He   हे       Ho   हो       Ḍa   ड
 9  Ashlesha               Ḍi   डी       Ḍu   डू       Ḍe   डे       Ḍo   डो
10  Magha                  Ma   मा       Mi   मी       Mu   मू       Me   मे
11  Purva Phalguni         Mo   मो       Ṭa   टा       Ṭi   टी       Ṭu   टू
12  Uttara Phalguni        Ṭe   टे       Ṭo   टो       Pa   पा       Pi   पी
13  Hasta                  Pu   पू       Ṣa   ष        Ṇa   ण        Ṭha  ठ
14  Chitra                 Pe   पे       Po   पो       Ra   रा       Ri   री
15  Swati                  Ru   रू       Re   रे       Ro   रो       Ta   ता
16  Vishakha               Ti   ती       Tu   तू       Te   ते       To   तो
17  Anuradha               Na   ना       Ni   नी       Nu   नू       Ne   ने
18  Jyeshtha               No   नो       Ya   या       Yi   यी       Yu   यू
19  Mula                   Ye   ये       Yo   यो       Bha  भा       Bhi  भी
20  Purva Ashadha          Bhu  भू       Dha  धा       Pha  फा       Ḍha  ढा
21  Uttara Ashadha         Bhe  भे       Bho  भो       Ja   जा       Ji   जी
22  Shravana               Khi  खी       Khu  खू       Khe  खे       Kho  खो
23  Dhanishta              Ga   गा       Gi   गी       Gu   गु       Ge   गे
24  Shatabhisha            Go   गो       Sa   सा       Si   सी       Su   सू
25  Purva Bhadrapada       Se   से       So   सो       Da   दा       Di   दी
26  Uttara Bhadrapada      Du   दू       Tha  थ        Jha  झ        Ña   ञ
27  Revati                 De   दे       Do   दो       Cha  च        Chi  ची
```

### Machine-readable form

```json
[
  {"n":1,"name":"Ashwini","lord":"Ketu","padas":["Chu","Che","Cho","La"]},
  {"n":2,"name":"Bharani","lord":"Shukra","padas":["Li","Lu","Le","Lo"]},
  {"n":3,"name":"Krittika","lord":"Surya","padas":["A","I","U","E"]},
  {"n":4,"name":"Rohini","lord":"Chandra","padas":["O","Va","Vi","Vu"]},
  {"n":5,"name":"Mrigashira","lord":"Mangala","padas":["Ve","Vo","Ka","Ki"]},
  {"n":6,"name":"Ardra","lord":"Rahu","padas":["Ku","Gha","Nga","Chha"]},
  {"n":7,"name":"Punarvasu","lord":"Guru","padas":["Ke","Ko","Ha","Hi"]},
  {"n":8,"name":"Pushya","lord":"Shani","padas":["Hu","He","Ho","Da"]},
  {"n":9,"name":"Ashlesha","lord":"Budha","padas":["Di","Du","De","Do"]},
  {"n":10,"name":"Magha","lord":"Ketu","padas":["Ma","Mi","Mu","Me"]},
  {"n":11,"name":"Purva Phalguni","lord":"Shukra","padas":["Mo","Ta","Ti","Tu"]},
  {"n":12,"name":"Uttara Phalguni","lord":"Surya","padas":["Te","To","Pa","Pi"]},
  {"n":13,"name":"Hasta","lord":"Chandra","padas":["Pu","Sha","Na","Tha"]},
  {"n":14,"name":"Chitra","lord":"Mangala","padas":["Pe","Po","Ra","Ri"]},
  {"n":15,"name":"Swati","lord":"Rahu","padas":["Ru","Re","Ro","Ta"]},
  {"n":16,"name":"Vishakha","lord":"Guru","padas":["Ti","Tu","Te","To"]},
  {"n":17,"name":"Anuradha","lord":"Shani","padas":["Na","Ni","Nu","Ne"]},
  {"n":18,"name":"Jyeshtha","lord":"Budha","padas":["No","Ya","Yi","Yu"]},
  {"n":19,"name":"Mula","lord":"Ketu","padas":["Ye","Yo","Bha","Bhi"]},
  {"n":20,"name":"Purva Ashadha","lord":"Shukra","padas":["Bhu","Dha","Pha","Dha2"]},
  {"n":21,"name":"Uttara Ashadha","lord":"Surya","padas":["Bhe","Bho","Ja","Ji"]},
  {"n":22,"name":"Shravana","lord":"Chandra","padas":["Khi","Khu","Khe","Kho"]},
  {"n":23,"name":"Dhanishta","lord":"Mangala","padas":["Ga","Gi","Gu","Ge"]},
  {"n":24,"name":"Shatabhisha","lord":"Rahu","padas":["Go","Sa","Si","Su"]},
  {"n":25,"name":"Purva Bhadrapada","lord":"Guru","padas":["Se","So","Da","Di"]},
  {"n":26,"name":"Uttara Bhadrapada","lord":"Shani","padas":["Du","Tha","Jha","Nya"]},
  {"n":27,"name":"Revati","lord":"Budha","padas":["De","Do","Cha","Chi"]}
]
```

**Implementation warning on Latin collisions.** Several distinct Sanskrit syllables collapse to
the same Latin transliteration and must be disambiguated internally or the generator will produce
wrong matches:

- **Ta/Ti/Tu/Te/To appears twice** — retroflex ṭa (Purva/Uttara Phalguni, Hasta's ṭha) versus
  dental ta (Swati p4, Vishakha, Uttara Bhadrapada's tha). Different rashis (Simha/Kanya vs
  Tula/Vrishchika). Store the diacritic.
- **Da/Di/Du/De/Do appears twice** — retroflex ḍa (Pushya p4, Ashlesha; Karka rashi) versus dental
  da (Purva Bhadrapada, Uttara Bhadrapada p1; Kumbha/Meena rashi).
- **Four distinct nasals** — ṅa (Ardra p3), ṇa (Hasta p3), na (Anuradha p1), ña (U. Bhadrapada p4).
  Two of these collapse to bare "Na" in Latin.
- **Dha appears twice within Purva Ashadha** — p2 is dental धा *dha*, p4 is retroflex ढा *ḍha*.
  Marked `Dha2` in the JSON above; give it a proper distinct key.
- **Sibilants** — ṣa (Hasta p2) and sa (Shatabhisha p2) are distinct sounds; keep them apart even
  though casual transliteration often renders both as "sa"/"sha".

Validating the JSON against the rashi partition confirms exactly twelve colliding Latin forms:
Ta, Ti, Tu, Te, To, Na, Da, Di, Du, De, Do, Tha. Each appears in two different rashis. These are
the twelve keys that need diacritics in the data model.

For a Latin-alphabet domain-name product, these distinctions are largely unrecoverable in the
output string anyway — but they matter for *matching* a candidate name back to a pada, and for
displaying the Devanagari to the user.

## 2.3 Where sources conflict

I found six real disagreements. In each case I state the majority reading and the variant.

| Nakshatra / pada | Majority reading | Variant | Adjudication |
|---|---|---|---|
| **Shravana (22), all four** | Khi, Khu, Khe, Kho | Ju, Je, Jo, Gha *(Wikipedia lists both; MomJunction lists Ju/Je/Jo/So alongside)* | **Khi/Khu/Khe/Kho.** Decisive: the Makara-rashi syllable list is universally given as *Bho, Ja, Ji, Khi, Khu, Khe, Kho, Ga, Gi*. Ja/Ji are already taken by Uttara Ashadha p3–p4. The Ju/Je/Jo variant is a South Indian (Tamil/Malayalam) alternate and would double-assign. |
| **Mrigashira p4** | Ki (की) | Ke | **Ki.** "Ke" is Punarvasu p1; the Mithuna rashi list runs *Ka, Ki, Ku…* |
| **Chitra p4** | Ri (री) | Re | **Ri.** "Re" is Swati p2; Tula list runs *Ra, Ri, Ru, Re, Ro…* |
| **Vishakha p2/p3** | Tu, Te | Te, Tu (order swapped) | **Tu then Te.** Minor; both syllables belong to Vishakha either way, so pada-level output differs but nakshatra-level does not. |
| **Mula p3/p4** | Bha, Bhi | Ba, Bi | Both circulate. Devanagari sources give भा/भी (Bha/Bhi). Aspirated reading preferred. |
| **Purva Ashadha p3/p4** | Pha, Ḍha | Bha, Da / "Bha, Pha" | Genuinely muddled across sources. Wikipedia gives *Bhu, Dha, Bha/Pha, Da*. Devanagari फा/ढा supports Pha/Ḍha. Low confidence. |

**Regional variation, generally.** Tamil, Malayalam, Telugu and Kannada traditions each carry
slightly different syllable sets, largely because those phonologies lack some Sanskrit
distinctions — Tamil has no aspirate/voiced series (only one *ka*, one *ca*, one *ṭa*, one *ta*,
one *pa*), so the ka/kha/ga/gha distinctions that carry information in the Sanskrit table
collapse. Practitioners in those traditions consequently work with *broader* syllable sets and
often accept any of a nakshatra's four padas.

**[TRADITIONAL] Practitioner latitude.** Most sources agree that while the exact pada syllable is
"most precise," **all four syllables of the birth nakshatra are auspicious**. This is important for
the product: it turns a 1-in-108 constraint into a 1-in-27 constraint with 4 options, which is far
more workable for domain-name generation. We should default to offering all four and marking the
exact pada match as "most precise."

## 2.4 Honest note on the table's provenance

The 108-syllable assignment is **[TRADITIONAL], not [SCRIPTURAL]**. Āpastamba GS 6.15.2 mandates
*a nakshatra name*; it does not supply the table. The table as we have it appears in medieval and
early-modern panchang/jataka compilations and is transmitted through the Avakahada Chakra. I could
not locate it in any Grhya Sutra, in Manusmriti, in Brihat Samhita, or in BPHS.

There is also a notable **dissenting traditional view**. The Parasara Jyotish school (following
P.V.R. Narasimha Rao) holds that the 108-pada letter assignment is a *mnemonic coding device* —
its function is to let an astrologer reconstruct someone's birth nakshatra from their name — and
is **not** an astrological prescription. On that view the correct naming principle is different:
name the person after the **strongest yoga-giving planet in the chart** (via the planet→letter
mapping in §6.2), and avoid the letters of a badly-placed malefic.

This is a genuine, well-argued split inside the tradition and we should represent it. It also
suggests a legitimate second derivation mode for the product.

---

# 3. Rashi (moon sign) to syllable

## 3.1 What rashi is and how it differs from the nakshatra system

*Rashi* = the **sidereal Moon sign**: the 30° zodiacal sign the Moon occupied at birth. It is not
the Western Sun sign (tropical, date-only). The two frequently differ by roughly one sign because
of the ~24° ayanamsa offset, plus the Sun/Moon difference.

The relationship to the nakshatra system is **purely arithmetic, not independent**:

- 12 rashis × 30° = 360°; 108 padas × 3°20′ = 360°.
- Each rashi therefore spans exactly **9 padas** = 2.25 nakshatras.
- **The rashi syllable list is just the union of the 9 pada syllables falling in that sign.**

So rashi-based naming is a **coarser** version of the same system, not a rival to it. It is used
when the birth *time* is unknown (in which case the pada, and often the nakshatra, cannot be
determined, but the rashi frequently can be — the Moon spends ~2.25 days in a sign versus ~1 hour
in a pada).

This is the right fallback design for NameGenius: **if the user knows the birth time, use
nakshatra-pada; if not, offer the rashi's 9 syllables.**

## 3.2 The 12 rashis and their 9 syllables

Derived directly from the §2.2 table; this derivation also serves as the validation check that
resolved the Shravana conflict.

| # | Rashi | Western | Lord | Element | 9 syllables | Source padas |
|---|---|---|---|---|---|---|
| 1 | Mesha | Aries | Mangala | Fire | Chu, Che, Cho, La, Li, Lu, Le, Lo, A | Ashwini 1–4, Bharani 1–4, Krittika 1 |
| 2 | Vrishabha | Taurus | Shukra | Earth | I, U, E, O, Va, Vi, Vu, Ve, Vo | Krittika 2–4, Rohini 1–4, Mrigashira 1–2 |
| 3 | Mithuna | Gemini | Budha | Air | Ka, Ki, Ku, Gha, Ṅa, Chha, Ke, Ko, Ha | Mrigashira 3–4, Ardra 1–4, Punarvasu 1–3 |
| 4 | Karka | Cancer | Chandra | Water | Hi, Hu, He, Ho, Ḍa, Ḍi, Ḍu, Ḍe, Ḍo | Punarvasu 4, Pushya 1–4, Ashlesha 1–4 |
| 5 | Simha | Leo | Surya | Fire | Ma, Mi, Mu, Me, Mo, Ṭa, Ṭi, Ṭu, Ṭe | Magha 1–4, P. Phalguni 1–4, U. Phalguni 1 |
| 6 | Kanya | Virgo | Budha | Earth | Ṭo, Pa, Pi, Pu, Ṣa, Ṇa, Ṭha, Pe, Po | U. Phalguni 2–4, Hasta 1–4, Chitra 1–2 |
| 7 | Tula | Libra | Shukra | Air | Ra, Ri, Ru, Re, Ro, Ta, Ti, Tu, Te | Chitra 3–4, Swati 1–4, Vishakha 1–3 |
| 8 | Vrishchika | Scorpio | Mangala | Water | To, Na, Ni, Nu, Ne, No, Ya, Yi, Yu | Vishakha 4, Anuradha 1–4, Jyeshtha 1–4 |
| 9 | Dhanu | Sagittarius | Guru | Fire | Ye, Yo, Bha, Bhi, Bhu, Dha, Pha, Ḍha, Bhe | Mula 1–4, P. Ashadha 1–4, U. Ashadha 1 |
| 10 | Makara | Capricorn | Shani | Earth | Bho, Ja, Ji, Khi, Khu, Khe, Kho, Ga, Gi | U. Ashadha 2–4, Shravana 1–4, Dhanishta 1–2 |
| 11 | Kumbha | Aquarius | Shani | Air | Gu, Ge, Go, Sa, Si, Su, Se, So, Da | Dhanishta 3–4, Shatabhisha 1–4, P. Bhadrapada 1–3 |
| 12 | Meena | Pisces | Guru | Water | Di, Du, Tha, Jha, Ña, De, Do, Cha, Chi | P. Bhadrapada 4, U. Bhadrapada 1–4, Revati 1–4 |

Every one of the 108 padas appears exactly once. I verified this mechanically: parsing the JSON in
§2.2 and slicing it into twelve consecutive groups of nine reproduces all twelve published rashi
syllable lists exactly, and each of the nine Vimshottari lords owns exactly three nakshatras. That
is a strong check — it means the pada table and the rashi tables, which come from independent
sources, are mutually consistent.

Published rashi lists that show only 8 syllables
(several do) have dropped one through transcription error — most often Ḍha in Dhanu or Ña in Meena.

**[TRADITIONAL] "Naam Rashi."** Because the system is deterministic in one direction, it is
traditionally run in reverse: given a person's name, infer their probable rashi. This only works
if the name was actually given per the tradition, so it is an approximation. It does, however,
give NameGenius a nice reverse-lookup feature: "your candidate name *Ravindra* falls in Tula rashi."

---

# 4. Numerology applied to names

## 4.1 Provenance, stated plainly

This section is **[MODERN]** almost in its entirety. Name numerology as practised in India today
descends from the **Chaldean** system popularised in the West by **Cheiro** (William John Warner,
1866–1936) in *Cheiro's Book of Numbers*, and further by L. Dow Balliett and Juno Jordan. It is
*not* from the Grhya Sutras, Manusmriti, or classical Jyotisha.

There is a genuine Indian counting tradition — *Ank Jyotish* / *Ank Shastra* — and the
planet↔number correspondences used (1=Sun, 2=Moon, 3=Jupiter, 4=Rahu, 5=Mercury, 6=Venus, 7=Ketu,
8=Saturn, 9=Mars) are recognisably Indian rather than Western (a Western Chaldean practitioner
would say 4=Uranus, 7=Neptune). But the **letter-to-number table is applied to the Roman
alphabet**, which is decisive: a rule that operates on the Latin script cannot predate the Latin
script's use for Indian names. It is a 20th-century syncretism. We should say so.

That said, it is what the market expects and what practitioners actually use, so we should
implement it — labelled honestly.

## 4.2 Chaldean vs Pythagorean

| | Chaldean | Pythagorean |
|---|---|---|
| Basis | Claimed sound-value / vibration | Sequential alphabet position |
| Range | **1–8 only** | 1–9 |
| The number 9 | **Never assigned to a letter** — held sacred/unmanifest. Can appear only in a total. | Assigned normally |
| Compound numbers | Central; read before reduction | Usually reduced straight to a digit |
| Indian usage | **The conventional choice** | Rarely used for Indian business naming |

**Convention in India is unambiguously Chaldean.** Practitioners justify this on the grounds that
it tracks pronunciation rather than alphabet order, which suits transliterated Indian names. (That
justification is post-hoc and the "sound-based" claim is not well substantiated — C, G, L, S all
share the value 3 despite being phonetically unlike — but the *convention* is real and is what we
should default to.)

### Chaldean letter table

```
1 → A, I, J, Q, Y
2 → B, K, R
3 → C, G, L, S
4 → D, M, T
5 → E, H, N, X
6 → U, V, W
7 → O, Z
8 → F, P
(9 → not assigned to any letter)
```

### Full A–Z, both systems

| Letter | Chaldean | Pythagorean | | Letter | Chaldean | Pythagorean |
|---|---|---|---|---|---|---|
| A | 1 | 1 | | N | 5 | 5 |
| B | 2 | 2 | | O | 7 | 6 |
| C | 3 | 3 | | P | 8 | 7 |
| D | 4 | 4 | | Q | 1 | 8 |
| E | 5 | 5 | | R | 2 | 9 |
| F | 8 | 6 | | S | 3 | 1 |
| G | 3 | 7 | | T | 4 | 2 |
| H | 5 | 8 | | U | 6 | 3 |
| I | 1 | 9 | | V | 6 | 4 |
| J | 1 | 1 | | W | 6 | 5 |
| K | 2 | 2 | | X | 5 | 6 |
| L | 3 | 3 | | Y | 1 | 7 |
| M | 4 | 4 | | Z | 7 | 8 |

## 4.3 Computing compound and root numbers

1. Take the **brand name as customers say it**. Exclude legal suffixes (Pvt Ltd, Inc, LLC, LLP).
2. Map each letter to its Chaldean value; ignore spaces, hyphens, ampersands.
3. Sum → this is the **compound number** (*the unreduced total*).
4. Reduce by adding digits repeatedly → the **root / name number** (1–9).
5. Master numbers (11, 22, 33; some add 51, 65) are conventionally preserved rather than reduced.
   **Note the conflict:** sources disagree on the master-number set. Cheiro's own compound tables
   run 10–52 and do not treat 11/22/33 as a special preserved class — that is a Pythagorean
   convention that has leaked into Chaldean practice. Pick one and document it.

Worked examples (Chaldean):

```
TATA     = T4 + A1 + T4 + A1                          = 10  → root 1
WIPRO    = W6 + I1 + P8 + R2 + O7                     = 24  → root 6
INFOSYS  = I1 + N5 + F8 + O7 + S3 + Y1 + S3           = 28  → root 1
ZOMATO   = Z7 + O7 + M4 + A1 + T4 + O7                = 30  → root 3
SWIGGY   = S3 + W6 + I1 + G3 + G3 + Y1                = 17  → root 8
FLIPKART = F8 + L3 + I1 + P8 + K2 + A1 + R2 + T4      = 29  → root 2
```

**The compound number is the interpretive layer that distinguishes two names with the same root.**
23 and 32 both reduce to 5 but read very differently; 19 and 28 both reduce to 1. Cheiro's own
argument was that the single digit governs the material surface and the compound reveals the
"hidden influences." This is directly useful for us: when the generator produces several
candidates with the same root, **rank by compound**.

## 4.4 Auspicious and inauspicious numbers for business

**[MODERN]** — Cheiro's compound-number readings, as used by Indian practitioners.

**Favourable compounds:**

| Compound | Cheiro's name | Reading |
|---|---|---|
| **19** | The Prince of Heaven | Most fortunate in the system; success, honour, sweeps away surrounding misfortune |
| **23** | The Royal Star of the Lion | Luckiest for worldly help; patronage from those above you in rank |
| **27** | The Sceptre | Authority and command; reward for productive intellect; act on your own plans |
| **37** | — | Fortunate partnerships, alliances, unions |
| 10 | The Wheel of Fortune | Self-reliant rise |
| 14 | — | Movement, trade, dealings with the public |
| 21 | The Crown | Advancement, honour, victory after struggle |
| 24 | — | Magnetic attraction, gain through others |
| 32 | — | Unexpected power and popularity |
| 41, 51 | — | Commonly cited as strong for enterprise |

**Cautionary compounds:**

| Compound | Cheiro's name | Reading |
|---|---|---|
| **16** | The Shattered Citadel / Tower struck by lightning | Structures collapsing at the point of completion; warns against overconfidence |
| **26** | — | **The specific business warning.** Disaster through partnerships, associations, bad advice, bad speculation |
| **13** | Regeneration / Upheaval | Explicitly *not* simply unlucky in Cheiro; a number of forced change. Often avoided anyway |
| 18 | — | Betrayal from close associates; conflict |
| 29 | — | Uncertainty, unreliable partners |

**Root-number planetary signatures** (Indian Ank Jyotish convention):

| Root | Graha | Business character |
|---|---|---|
| 1 | Surya (Sun) | Leadership, originality, founder-driven brands |
| 2 | Chandra (Moon) | Partnership, hospitality, public-facing, fluctuating |
| 3 | Guru (Jupiter) | Knowledge, teaching, advisory, expansion, publishing |
| 4 | Rahu | Disruption, unconventional, technology — but volatile |
| 5 | Budha (Mercury) | Commerce, communications, media, trading, fast-moving |
| 6 | Shukra (Venus) | Luxury, beauty, design, hospitality, arts — **widely regarded as the strongest general business number** |
| 7 | Ketu | Research, depth, spirituality, niche mastery |
| 8 | Shani (Saturn) | Heavy industry, infrastructure, long-horizon — slow and testing |
| 9 | Mangala (Mars) | Energy, competition, defence, sport, engineering |

## 4.5 Harmonising the name number with the person's numbers

Three personal numbers are used:

- **Moolank / Psychic number** — birth *day of month*, reduced. (Born on the 23rd → 2+3 = 5.)
- **Bhagyank / Destiny (Life Path) number** — full DOB (DD+MM+YYYY), reduced.
- **Naamank** — the name number, as computed above.

**[MODERN] Harmony rule:** the business name number should be friendly to the founder's Moolank
(some practitioners weight Bhagyank higher; sources disagree, and no source I found gives a
principled reason to prefer one).

| Founder's number | Friendly business numbers | Avoid |
|---|---|---|
| 1 (Sun) | 1, 3, 5, 9 | 4, 8 |
| 2 (Moon) | 2, 6, 7, 9 | 4, 8 |
| 3 (Jupiter) | 1, 3, 5, 6, 9 | 4, 8 |
| 4 (Rahu) | 4, 5, 6, 7 | 1, 8, 9 |
| 5 (Mercury) | 1, 3, 5, 6 | 2, 9 |
| 6 (Venus) | 3, 5, 6, 8 | 1 |
| 7 (Ketu) | 2, 6, 7 | 8, 9 |
| 8 (Saturn) | 5, 6, 8 | 1, 2, 4 |
| 9 (Mars) | 1, 2, 3, 9 | 4, 5 |

**Two honest caveats.** (a) These friend/enemy tables vary noticeably between practitioners; treat
this one as representative rather than canonical. (b) **The domain spelling matters** under this
system — `namegenius.com` and `name-genius.com` and `namegeniusapp.com` all have different totals.
This is actually a feature for our product: it gives us a principled way to rank spelling variants.

---

# 5. Vastu Shastra

## 5.1 Texts

| Text | Date | Note |
|---|---|---|
| **Bṛhat Saṃhitā** (Varāhamihira), **ch. 53** *Vāstu-vidyā* | 6th c. CE | The earliest well-preserved systematic account; gives the Vastu Purusha myth and both mandala grids with the full deity roster |
| **Mayamatam** | ~9th–12th c. CE, Dravidian | Ch. 7 lists the mandala deities; practical treatise on siting, orientation, dimensions |
| **Mānasāra** | ~5th–7th c. CE | Describes 32 mandala schemes; ch. 7 gives the 64-square *caṇḍita* |
| **Samarāṅgaṇa Sūtradhāra** (Bhoja) | 11th c. CE | Calls the vāstu puruṣa the "spirit of the site" |
| **Viśvakarma Prakāśa** | late | Frequently cited by practitioners |
| **Matsya, Agni, Bhaviṣya Purāṇas** | various | Parallel mandala accounts (Matsya 252; Agni 40, 93) |

## 5.2 The Pancha Mahabhuta and the directions

**[SCRIPTURAL/TRADITIONAL]** The five great elements: **Prithvi** (earth), **Jala/Ap** (water),
**Agni** (fire), **Vayu** (air), **Akasha** (ether/space).

The **eight dikpalas** (directional guardians) are ancient and stable across sources:

| Direction | Sanskrit | Deity | Element | Planet | Qualities |
|---|---|---|---|---|---|
| East | Pūrva / Prācī | **Indra** | — (Sun/light) | Surya | Fame, recognition, authority, new beginnings |
| South-East | Āgneya | **Agni** | **Fire** | Shukra (Venus) | Heat, power, transformation, energy |
| South | Dakṣiṇa | **Yama** | — | Mangala (Mars) | Discipline, order, judgement, endings |
| South-West | Nairṛtya | **Nirṛti** | **Earth** | Rahu | Weight, stability, permanence, control |
| West | Paścima / Pratīcī | **Varuṇa** | — (water/cosmic) | Shani (Saturn) | Gains realised, consolidation, results |
| North-West | Vāyavya | **Vāyu** | **Air** | Chandra (Moon) | Movement, circulation, dispatch, turnover |
| North | Uttara / Udīcī | **Kubera** | **Water** | Budha (Mercury) | **Wealth, opportunity, cash flow** |
| North-East | Īśāna | **Īśāna (Shiva)** | **Water** (also space) | Guru (Jupiter) | Clarity, purity, guidance, the sacred |
| Centre | — | **Brahmā** (Brahmasthana) | **Akasha** | — | Must be kept open and unbuilt |

**Two caveats.** (i) The **direction→planet** column is less stable than the direction→deity
column; several attributions circulate. BPHS 3 gives planetary *dig-bala* (directional strength)
differently again — Sun and Mars strong in the South, Jupiter and Mercury in the East, Saturn in
the West, Moon and Venus in the North. Do not treat direction→planet as settled. (ii) The
North/North-East double-assignment of Water reflects a real split between sources; some assign
North to Water (Kubera) and North-East to Space, others reverse it.

## 5.3 The Vastu Purusha Mandala

**[SCRIPTURAL]** Brihat Samhita 53.2–3 gives the myth: a monster large enough to blot out earth
and sky was pinned face-down by the devas, who then occupied the parts of his body they had
seized. Brahmā designated him the *Vāstupuruṣa*, the house-spirit.

**[SCRIPTURAL]** He lies **head in the north-east, feet in the south-west** (BS 53.51),
knees and elbows toward north-west and south-east, navel at the centre.

**Two canonical grids** (BS 53.42, 53.55–56; Kramrisch):

- **Maṇḍūka / Caṇḍita — 64 squares (8×8).** Prescribed for *prāsādas* (temples). Brahmā occupies
  the four central squares.
- **Paramaśāyika — 81 squares (9×9).** Prescribed for **all secular structures** — which means
  **this is the one relevant to a business premises.** Brahmā occupies the nine central squares;
  32 devas in the outer ring, 13 in the inner.

The 81-pada deity roster is given verbatim in BS 53.43–48 and is worth having in full because it
is genuinely scriptural and specific:

- **East (squares 1–8):** Agni, Parjanya, Jayanta, **Indra**, Sūrya, Satyā, Bhṛśa, Antarikṣa
- **South (9, 18, 27, 36, 45, 54, 63, 72):** Vāyu, Pūṣā, Vitatha, Bṛhatkṣata, **Yama**, Gandharva,
  Bhṛṅgarāja, Mṛga
- **West (81, 80, 79, 78, 77, 76, 75, 74):** Pitṛ, Dauvārika, Sugrīva, Kusumadanta, **Varuṇa**,
  Asura, Śeṣa, Pāpayakṣmā
- **North (73, 64, 55, 46, 37, 28, 19, 10):** Roga, Ahi, Mukhya, Bhallāṭa, Soma, Bhujaga, Aditi, Diti
- **Centre (31–33, 40–42, 49–51):** **Brahmā**
- **Inner ring:** Aryaman, Savitā, Vivasvān, Indra, Mitra, Rājayakṣmā, Pṛthvīdhara, Apavatsa
- **Inner corners:** Āpa (NE), Sāvitra (SE), Jaya (SW), Rudra (NW)

**Concentric zones** (from Mayamatam-tradition practice): **Brahmavīthi** (centre — no
construction), **Devavīthi**, **Manuṣyavīthi** (construction permitted), **Piśācavīthi**
(outermost — no construction). Energy lines (*nāḍī*, *rajju*, *sūtra*) cross the grid; their
intersections are *marma* points which BS 53.57 says must not be pierced by pillars.

**[SCRIPTURAL]** BS 53.66 states plainly that if the Brahmasthana is defiled, "the master of the
house will suffer miseries" — the textual basis for the modern rule that the centre stays open.

**[SCRIPTURAL] Entrance placement matters and is graded.** BS 53.71–72 gives per-square effects
for the main entrance. Reading the eight eastern squares from the NE corner: injury from fire,
birth of daughters, **gain of immense wealth**, **friendship of the king**, increase of anger,
lying, cruelty, theft. This is the classical ancestor of the modern "entrance pada" analysis.

## 5.4 Direction, element and business type

**Provenance: mostly [MODERN].** The pancha-bhuta / dikpala framework is scriptural. The
*application to specific modern business categories* — "chemical plants face SE," "finished goods
in the NW to accelerate dispatch" — is contemporary consultant practice extrapolated from that
framework. The classical texts discuss houses, palaces, temples, forts and towns, not factories
or SaaS companies. Brihat Samhita ch. 41 does classify *commodities* by rashi (Mesha → cotton,
wool, wheat, gold; Vṛṣabha → cloth, flowers, cattle; Makara → timber, sugarcane, gold, black lead;
etc.), which is the nearest classical analogue and is a genuinely interesting under-used source.

Practitioner consensus, which is fairly consistent across sources:

| Zone | Element | Deity | Business functions | Business types |
|---|---|---|---|---|
| **North** | Water | Kubera | Accounts, cash counter, treasury, marketing | **Finance, banking, investment, B2B** |
| **North-East** | Water / Space | Īśāna | Reception, senior leadership, QC, open space, water source | **Wellness, education, spiritual, premium/quality-led** |
| **East** | (light) | Indra | New arrivals, packaging, licensing, PR | **Professional services, government-facing, food (Surya = freshness)** |
| **South-East** | **Fire** | Agni | Boilers, furnaces, transformers, generators, electrical, kitchen | **Manufacturing, chemicals, energy, food production, technical services** |
| **South** | — | Yama | Heavy noisy production, storage, staff | **Law, tax, audit, security — discipline-intensive** |
| **South-West** | **Earth** | Nirṛti | Owner's cabin, heaviest machinery, raw material store | **Anchor/holding functions. Generally avoided as an entrance** |
| **West** | (water/results) | Varuṇa | Storage, consultation, catalogues | **Legal, medical, social enterprise** |
| **North-West** | **Air** | Vāyu | Finished goods, dispatch, sales team | **Logistics, fast-turnover retail, distribution** |
| **Centre** | **Space** | Brahmā | Keep open | — |

Practitioner-stated **entrance** preference for commercial premises: **North** (Kubera → wealth
flow) and **East** (Indra → fame) are best; **North-East** excellent for premium positioning;
**North-West** good for high-turnover; **West** acceptable; **South-East** acceptable especially
for fire-trades; **South** acceptable with care; **South-West** poor.

**Ideal flow for a manufacturing premises** (consultant convention): raw material SW/W → processing
SE → cooling N → QC NE → packing E → finished goods NW.

For our purposes the useful abstraction is: **entrance direction → governing element →
element-flavoured phonetics and semantics.** Which brings us to the weakest link.

---

# 6. Phonetics ↔ element / planet

This is the section where I most want to caution the team, because it is where a plausible-looking
mapping can be assembled that no tradition actually asserts.

## 6.1 The Sanskrit varga structure (uncontroversial)

The *varṇamālā* organises the 25 stop consonants (*sparśa*) into five vargas by place of
articulation:

| Varga | Letters | Articulation |
|---|---|---|
| **ka-varga** | ka kha ga gha ṅa | guttural / velar (*kaṇṭhya*) — root of tongue at soft palate |
| **ca-varga** | ca cha ja jha ña | palatal (*tālavya*) — mid-tongue at hard palate |
| **ṭa-varga** | ṭa ṭha ḍa ḍha ṇa | retroflex / cerebral (*mūrdhanya*) — tongue tip curled to roof |
| **ta-varga** | ta tha da dha na | dental (*dantya*) |
| **pa-varga** | pa pha ba bha ma | labial (*oṣṭhya*) |

Plus: 16 *svara* (vowels), 4 *antaḥstha* (semivowels: ya ra la va), 3 *ūṣman* (sibilants: śa ṣa
sa) + ha, and kṣa. In Mantra Shastra the vargas are the *sparśa*, and ya…kṣa are the *vyāpaka*.

Note that the user's question listed "ta-varga, tha-varga" as separate groups. There is no
*tha-varga*; the two distinct T-series are the **retroflex ṭa-varga** and the **dental ta-varga**.
Likewise "ya-varga" and "sha-varga" are not vargas in the strict sense — they are the semivowel
and sibilant classes. Worth getting right in the UI.

## 6.2 Varga → planet: reasonably well attested [TRADITIONAL]

This mapping comes from the **Śāradā Tilaka Tantra** (c. 11th c.) and is used in Jyotish naming
practice:

| Graha | Letters |
|---|---|
| **Sūrya (Sun)** | all vowels — a ā i ī u ū e ai o au |
| **Maṅgala (Mars)** | **ka-varga** — ka kha ga gha ṅa |
| **Śukra (Venus)** | **ca-varga** — ca cha ja jha ña |
| **Budha (Mercury)** | **ṭa-varga** — ṭa ṭha ḍa ḍha ṇa |
| **Guru (Jupiter)** | **ta-varga** — ta tha da dha na |
| **Śani (Saturn)** | **pa-varga** — pa pha ba bha ma |
| **Candra (Moon)** | semivowels + sibilants — ya ra la va, śa ṣa sa ha, kṣa, aḥ |

The Śāradā Tilaka additionally assigns tantric deities over the vargas: Brahmā over ka- and
ca-varga; Viṣṇu over ṭa- and ta-varga; Śiva over pa- and ya-groups; Rudra over the ṣa group;
Sadāśiva over the vowels.

**This is the most defensible letter↔force mapping available**, and it is what the "name the
strongest yoga-giving planet" school (§2.4) operates on. **I recommend making this our primary
phonetic-symbolism layer**, not the element mapping below.

## 6.3 Varga → element: genuinely contested. Do not present as scriptural.

I found **two mutually incompatible direct mappings**, plus a third that can be derived. All three
disagree.

**Mapping A — Vedadhara, citing Mantra Shastra:**
ka-varga = **Vāyu** · ca-varga = **Agni** · ṭa-varga = **Pṛthvī** · ta-varga = **Jala** ·
pa-varga = **Ākāśa**

**Mapping B — circulating in modern Sanskrit-and-sound literature:**
ka-varga = **Ākāśa** · ca-varga = **Vāyu** · ṭa-varga = **Agni** · ta-varga = **Jala** ·
pa-varga = **Pṛthvī**
*(Source quality here is poor — the text I found asserting this is an AI-generated ebook and it
also miscalls ka-varga "palatal," which is simply an error. Treat as unreliable, though the
subtle-to-gross ordering it follows is the intuition many practitioners voice.)*

**Mapping C — derived, [OUR DESIGN].** Chain two *separately attested* links:

1. varga → planet, from Śāradā Tilaka (§6.2), **and**
2. planet → mahābhūta, from **Brihat Parashara Hora Shastra 3.20**, which is explicit:
   *"The Panchabhutas — space, air, fire, water and earth — are respectively governed by Guru,
   Śani, Maṅgala, Śukra and Budha."*

Composing them:

| Varga | Planet (Śāradā Tilaka) | Element (BPHS 3.20) | Vastu direction |
|---|---|---|---|
| **ka-varga** (ka kha ga gha ṅa) | Maṅgala / Mars | **Agni — Fire** | South-East |
| **ca-varga** (ca cha ja jha ña) | Śukra / Venus | **Jala — Water** | North / North-East |
| **ṭa-varga** (ṭa ṭha ḍa ḍha ṇa) | Budha / Mercury | **Pṛthvī — Earth** | South-West |
| **ta-varga** (ta tha da dha na) | Guru / Jupiter | **Ākāśa — Space** | Centre / Brahmasthana |
| **pa-varga** (pa pha ba bha ma) | Śani / Saturn | **Vāyu — Air** | North-West |
| vowels | Sūrya / Sun | (ātman; no bhūta assigned) | East |
| ya ra la va, sibilants | Candra / Moon | (mind; water-affinity) | North-West / North |

**Both of the links in this chain are attributable. The composition is not.** No source I found
asserts the composed result. It agrees with neither Mapping A nor Mapping B. I recommend we adopt
Mapping C — because its two constituent links are each citable, and BPHS 3.20 in particular is a
crisp, verifiable verse — but we must label it in-product as **our derivation from two traditional
sources, not as a traditional rule**.

**Bottom line for the team: there is no single recognised scriptural varga→element table.** Anyone
who tells you otherwise is either using one of the above and not disclosing that it is contested,
or making it up. This is the joint where a "Vastu naming" product is most likely to be
intellectually dishonest, and where being straight with users is cheap and differentiating.

---

# 7. Auspicious vs inauspicious phonetic and structural qualities

## 7.1 From scripture [SCRIPTURAL]

Restating §1.2 as implementable constraints:

| Rule | Source | Business-name form |
|---|---|---|
| Even syllable count (2 or 4, up to 6) | Āśvalāyana I.15.5–7, Śāṅkhāyana I.24.4 | **2 or 4 syllables.** 2 = stability/firm position; 4 = renown |
| Begin with a *ghoṣavat* (voiced sound) | Āśvalāyana I.15.4 | Prefer initial vowel, semivowel, or voiced consonant (g, j, ḍ, d, b, and nasals) over voiceless (k, c, ṭ, t, p, s, ś, ṣ) |
| Contain an *antaḥstha* (semivowel: y, r, l, v) | Āśvalāyana I.15.4, Pāraskara I.17.2 | Include at least one of y/r/l/v internally |
| End in a long vowel or visarga | Āśvalāyana I.15.4, Pāraskara I.17.2 | End in -a/-ā/-ī/-ū rather than a hard consonant |
| Use a *kṛt* (verbal) not *taddhita* (nominal) suffix | Pāraskara I.17.2 | Prefer agentive/action-derived forms (*-da* giver, *-kara* maker, *-dhara* holder) over abstract nominal endings |
| Noun + verb compound | Āpastamba 6.15.9 | *Dhana-da*, *Vidya-dhara* pattern |
| The *su-* particle gives "firm foundation" | Āpastamba 6.15.10 | *Su-* prefix is explicitly endorsed |
| Easy to pronounce, not harsh, plain in meaning, heart-captivating, auspicious | Manusmṛti 2.33 | The general quality test — and a genuinely good brand-naming heuristic |
| Avoid names of constellations, trees, rivers, mountains, birds, snakes; avoid death/terror/servility semantics | Manusmṛti 3.9 | Semantic blocklist |

Note how well several of these coincide with ordinary good brand-naming practice: pronounceable,
2–4 syllables, ends in a vowel, contains a liquid consonant (r/l), clear meaning. That coincidence
is worth pointing out to users — it lets us be honest about the epistemics while the output remains
genuinely useful.

## 7.2 Akshara weight [TRADITIONAL]

*Akṣara* means both "syllable" and "imperishable." Sanskrit prosody weights syllables:

- **Laghu (light)** — short vowel, not followed by a conjunct.
- **Guru (heavy)** — long vowel, or a short vowel followed by a conjunct consonant, anusvāra, or
  visarga.

**[OUR DESIGN]** I found no traditional rule assigning laghu/guru patterns to auspiciousness in
*naming* specifically (the concept belongs to *chandas*, metrics). But it is a real, well-defined
Sanskrit category we can compute, and using it as a *tiebreaker* — e.g. preferring names ending
guru, which follows naturally from the scriptural "end in a long vowel" rule — is defensible so
long as we label it as our extension.

## 7.3 Practitioner conventions [MODERN]

- **Avoid harsh conjunct clusters** and heavy aspiration stacking (kṣ, tr, śr in sequence).
- **Vowel/consonant balance:** roughly alternating CV structure is favoured; consonant clusters at
  the start are disfavoured. This is partly just Sanskrit phonotactics restated.
- **Avoid the letter of a badly-placed malefic in the founder's chart** (Parasara Jyotish school).
- **Avoid names totalling to a cautionary compound** (16, 26, 18 — §4.4).
- **Prefer the name to be short enough to be said aloud often** — the tradition's stated mechanism
  is that repetition of the sound invokes the associated force, which is an argument for brevity.

---

# 8. What a traditional practitioner actually asks

Here are 16 questions. For each: what it is for, and what it determines in the derivation. The
first five are the load-bearing ones.

### Core astrological inputs

**1. Founder's date of birth.**
*Why:* Required for every downstream calculation.
*Determines:* Bhagyank (destiny number); together with time and place, the Moon's sidereal
longitude → nakshatra, pada, rashi.

**2. Founder's exact time of birth (to the minute, and how confident are you?).**
*Why:* The Moon moves ~13°/day, crossing a 3°20′ pada in roughly **one hour**. A 4-minute error
shifts the ascendant ~1°.
*Determines:* Nakshatra **pada** — i.e. which one of the four syllables is "the" syllable.
*Product note:* We must capture a **confidence flag**. If the user says "around 3pm," the pada is
not reliable and we should fall back to offering all four nakshatra syllables, and say why.

**3. Founder's place of birth (city, ideally lat/long).**
*Why:* Local time → UTC → Julian Day requires the timezone and historical DST rules of that place;
the ascendant requires latitude.
*Determines:* Correct Julian Day; the Lagna if we use it.

**4. Day of the month you were born (if DOB is withheld).**
*Why:* Moolank/psychic number is just the day, reduced.
*Determines:* The numerological harmony target — the single most-used practitioner input.

**5. Are there co-founders/partners, and their birth details?**
*Why:* A name harmonised only to one founder is traditionally considered a partnership risk;
compound 26 is *specifically* the warning about ruin through associations.
*Determines:* Whether we optimise for one chart or seek a name friendly to several; whether to
avoid compound 26.

### Business definition

**6. What exactly is the business — its category and primary activity?**
*Why:* Maps the venture to an element and a governing planet. Manufacturing → Agni/SE;
finance → Kubera/North; logistics → Vāyu/NW; education/advisory → Guru; luxury/design → Śukra.
Brihat Samhita ch. 41's rashi-commodity list is the classical analogue.
*Determines:* Which element's phonetic set (§6.3) and which semantic field to weight.

**7. What is the primary direction the premises entrance faces?**
*Why:* The single most-weighted variable in commercial Vastu. Entrance = the mouth through which
energy enters. BS 53.71–72 grades entrance placement square by square.
*Determines:* Governing dikpala and element; which varga to prefer initially; whether we should
suggest compensating emphasis (e.g. a South-West-facing entrance is poor, so a practitioner would
lean harder on wealth-semantics and a Kubera/North-flavoured name).

**8. Is the business registered/premised yet, or is this greenfield?**
*Why:* If premises are fixed, direction is a constraint; if not, it is advice.
*Determines:* Whether direction is an input or an output of our recommendation.

**9. What is the primary goal for the next 3–5 years — stability, or renown/growth?**
*Why:* **This is directly scriptural.** Āśvalāyana I.15.6: two syllables for one desiring
*pratiṣṭhā* (firm position); four for one desiring *yaśas* (lustre/renown).
*Determines:* Target syllable count. Our cleanest citable rule.

**10. Who is the target market — B2B, B2C, government, export, local?**
*Why:* Directional attributions differ: East/Indra governs fame and government-facing dealings;
North/Kubera governs wealth flow and B2B; NW/Vāyu governs high-turnover consumer movement.
*Determines:* Directional weighting when premises direction is unknown or ambiguous.

**11. What language/script will customers read and say the name in?**
*Why:* The whole system is sound-based. Tamil lacks the aspirate/voiced distinctions that carry
information in the Sanskrit table; a name that works in Devanagari may collapse in Tamil.
*Determines:* Which regional syllable variant set to use; transliteration strategy.

### Refinements a thorough practitioner would add

**12. Do you have a kuladevata or iṣṭa-devatā, or a deity you want invoked?**
*Why:* The traditional first name at Namakarana is the family-deity name. For business:
Lakṣmī (wealth), Gaṇeśa (auspicious beginnings/obstacle removal), Kubera (treasury),
Sarasvatī (learning), Viśvakarman (craft/manufacture), Hanumān (strength/service).
*Determines:* Semantic root pool and the name's opening morpheme.

**13. Which Mahadasha/Antardasha are you currently running?**
*Why:* The Parasara school's core principle — name after the strongest *yoga-giving* planet, and
particularly one whose period is active or upcoming.
*Determines:* Which varga to draw the initial letter from (§6.2). This is the strongest
alternative derivation path to the pada method.

**14. Is there an existing name being changed, and what has gone wrong?**
*Why:* Practitioners treat rectification differently from fresh naming — the classic move is
moving a name off a cautionary compound (26 → 27, 18 → 19) with minimal spelling change.
*Determines:* Whether we generate freely or perturb an existing string.

**15. Do you have a preferred launch date, or do you want one?**
*Why:* Namakarana itself is muhurta-bound (10th/12th day, odd days, avoiding the 13th, 14th,
Sundays, eclipses, Rāhu Kāla). Naming and registering a business is treated the same way.
*Determines:* An additional deliverable — an auspicious registration/launch window. Cheap for us
to compute once we already have an ephemeris.

**16. Is the founder's own name to be part of the brand name?**
*Why:* Very common in Indian family business; it constrains the string and drags its own
numerological weight into the total.
*Determines:* Whether the syllable constraint applies to the whole string or only the coined part.

**Bonus — 17. Do you want the legal entity name and the trading/brand name treated separately?**
The tradition already distinguishes the *guhya* (formal, ritually derived) name from the
*vyāvahārika* (public, everyday) name. That is a genuinely elegant fit for the
registered-entity vs. brand-name distinction and I would build the UI around it.

---

# 9. Computing nakshatra and rashi from birth data

## 9.1 What is actually required

```
1. Local birth date + time
2. Birth place → latitude, longitude, and the correct historical timezone/DST offset
3. → Universal Time → Julian Day (with ΔT handling)
4. → Moon's apparent geocentric TROPICAL ecliptic longitude
5. − ayanamsa  → SIDEREAL longitude λ (0–360°)
6. nakshatraIndex = floor(λ / 13.3333...)          // 0..26
7. padaIndex      = floor((λ mod 13.3333...) / 3.3333...)   // 0..3
8. rashiIndex     = floor(λ / 30)                  // 0..11
```

Only the Moon is strictly needed for naming. The ascendant (Lagna) additionally requires latitude
and sidereal time, and is used by practitioners who cross-check against the Lagna lord.

Two easily-missed pitfalls:

- **Historical timezone data.** India standardised on IST (+5:30) but had Bombay Time and Calcutta
  Time earlier, and ran DST briefly in 1942–45. A naive `+5:30` for a 1943 birth is wrong. Use an
  IANA tz database lookup keyed on the actual coordinates and date (`tzdata` / `luxon` /
  `@vvo/tzdb`), never a fixed offset.
- **ΔT (TT − UT).** Matters at the arcsecond level; any real ephemeris library handles it.

## 9.2 JavaScript / TypeScript options

| Package | Approach | Accuracy | Notes |
|---|---|---|---|
| **`@swisseph/node`** | Native C++ bindings to Swiss Ephemeris; prebuilt binaries for macOS/Linux/Windows | **Highest.** JPL DE431-class; range 13201 BCE – 17191 CE | **Recommended for server-side.** Full TS types. Exposes `setSiderealMode()`, `getAyanamsa()`, `getAyanamsaExUt()`, `SiderealMode.Lahiri`. ~2MB bundled ephemeris |
| **`@swisseph/browser`** | WASM; Moshier ephemeris built in, Swiss files loadable from CDN | Sub-arcsecond with Moshier; full Swiss precision if you load the ~2MB CDN files | ~250KB base. Use if you must compute client-side |
| **`@swisseph/core`** | Types only | — | Auto-installed dependency |
| `swisseph` (older node binding) | Native bindings | Same underlying library | Older, needs a compiler more often, no first-class TS |
| `astronomia` | Pure JS, port of Meeus' *Astronomical Algorithms* | Arcsecond-ish for the Moon | Pure JS, no binaries, but **you must implement the ayanamsa yourself** — it has no sidereal mode. More work, more risk |
| Hosted APIs (Prokerala, VedAstro, Vedika, etc.) | HTTP | Varies | Removes the binary-deployment problem; adds a dependency, per-call cost, and a privacy question about sending users' birth data to a third party |

**Recommendation:** `@swisseph/node` behind our own API route, with the ayanamsa pinned explicitly
and persisted alongside every generated result. Two operational notes: (a) Swiss Ephemeris is
**AGPL or commercially licensed** — if NameGenius is closed-source and we link it server-side, we
need to check whether the AGPL's network-use clause bites. Budget for the commercial licence.
(b) Native binaries and serverless platforms interact badly; verify the prebuilt binary works on
the target runtime before committing (this is a common reason teams end up on a hosted API).

Sketch:

```ts
import {
  dateToJulianDay, calculatePosition, setSiderealMode,
  Planet, SiderealMode, CalculationFlag,
} from '@swisseph/node';

const NAK = 360 / 27;      // 13.3333...
const PADA = NAK / 4;      // 3.3333...

export function moonNakshatra(utcDate: Date) {
  setSiderealMode(SiderealMode.Lahiri);          // pin it; persist the choice
  const jd = dateToJulianDay(utcDate);
  const { longitude } = calculatePosition(
    jd, Planet.Moon,
    CalculationFlag.SwissEphemeris | CalculationFlag.Sidereal,
  );
  const lambda = ((longitude % 360) + 360) % 360;
  const nakshatra = Math.floor(lambda / NAK);            // 0..26
  const pada = Math.floor((lambda % NAK) / PADA);        // 0..3
  const rashi = Math.floor(lambda / 30);                 // 0..11
  const degreesToNextPada = PADA - ((lambda % NAK) % PADA);
  return { lambda, nakshatra, pada, rashi, degreesToNextPada };
}
```

## 9.3 The ayanamsa question

**Ayanamsa** is the angular offset between the tropical zodiac (anchored to the vernal equinox) and
the sidereal zodiac (anchored to the fixed stars), caused by precession (~50.3″/yr). Sidereal
longitude = tropical longitude − ayanamsa. **Different schools use different values, and the
choice changes results near boundaries.**

| System | Anchor / zero epoch | Approx. 2026 value | Who uses it |
|---|---|---|---|
| **Lahiri (Chitrapaksha)** | Spica (Citrā) at 180°; zero epoch ~285 CE | **~24°12′–24°18′** | **Government of India standard**; most panchangs; most Vedic software. **Our default.** |
| Raman | Zero epoch ~397 CE | ~22°40′ | B.V. Raman's school; a minority |
| KP (Krishnamurti) | Tuned for sub-lord divisions | ~24°04′ | Krishnamurti Paddhati practitioners |
| KP New (KPNA) | Refined precession | between KP Old and Lahiri | Newer KP practice |
| Fagan–Bradley | Aldebaran/Antares axis; zero epoch ~221 CE | ~24°50′ | Western sidereal |

Magnitudes: **Lahiri vs KP ≈ 6 arcminutes (0.1°). Lahiri vs Raman ≈ 1.5°.**

**Where it bites for us.** A pada is 3°20′ = 200′ wide. A 6′ Lahiri/KP disagreement flips the pada
for a Moon within 6′ of a boundary — roughly **3% of births**. A 1.5° Lahiri/Raman disagreement
flips the pada for a Moon within 1.5° of a boundary — roughly **45% of births**, and flips the
nakshatra (and therefore the whole syllable set, and the Vimshottari dasha lord) for about 11%.
Raman is not a rounding error; it is a different answer.

**A calibrating fact worth surfacing to users:** a **4-minute birth-time error shifts the
ascendant by about 1°**, comparable to the entire Lahiri–Raman gap. If someone reports birth time
as "about 3pm," ayanamsa choice is noise next to their own uncertainty. This is the honest framing
for our confidence indicator.

**Implementation policy:**

1. **Default to Lahiri.** It is the Indian government standard and matches what a user's family
   astrologer almost certainly used.
2. **Pin it explicitly in code** and **persist the ayanamsa name and value with every saved
   result**, so results are reproducible and we can explain a discrepancy later.
3. Expose Raman / KP as an advanced setting, never mix systems within one calculation.
4. **Compute distance to the nearest pada and nakshatra boundary and surface it.** When the Moon is
   within, say, 30′ of a boundary, tell the user their result is boundary-sensitive and show both
   syllable sets. This is more honest than a false-precision single answer, and no competitor does it.

---

# 10. Ethics and honest framing

## 10.1 How reputable sources describe the epistemic status

**Astrology.** The scientific consensus is unambiguous and we should not soften it. Astrology "has
not demonstrated its effectiveness in controlled studies and has no scientific validity, and is
thus regarded as pseudoscience." There is no proposed mechanism by which planetary positions could
produce the claimed effects without contradicting well-established physics and biology. Astrology
was Karl Popper's most-cited example of a pseudoscience on the falsifiability criterion. Dean and
Kelly documented 25 studies in which inter-astrologer agreement measured about 0.1 — astrologers
do not even reliably agree with each other.

**Vastu Shastra.** Academic assessment is more layered but still clear. Vaastu is "widely regarded
as a pseudo-science, as its concepts are based on a complex system of intuition, astrology,
superstition and philosophy, which can only be partially explained by contemporary science."
Scholarship notes that the manuscripts *state* rules and *threaten consequences* without giving
reasons, because they were written in a context where religious authority sufficed. Some
researchers do find that specific Vastu prescriptions correlate with genuine environmental
sense for the Indian subcontinent — north/east orientation for morning light and thermal comfort,
keeping the centre open for ventilation, heavy mass on the hot south-west — but that is
architectural ergonomics rediscovered, not validation of the metaphysics. And the studies mostly
rely on self-reported comfort. It is also worth knowing that *śāstra* does not mean "science" in
the modern evidentiary sense; that translation does a lot of unearned work in marketing copy.

**Numerology.** Weaker still. As shown in §4.1, the Chaldean system as used in India is a
20th-century syncretism operating on the Roman alphabet, popularised by a professional
entertainer-mystic. It has no scriptural pedigree in the Indian tradition it is marketed under.

## 10.2 The honest case for building this anyway

These systems are **living cultural practice** for hundreds of millions of people. The Namakarana
samskara is a real rite with a 2,500-year textual record. Families genuinely consult astrologers
before naming children and businesses. Building a careful, well-sourced, correctly-computed tool
for that practice is respectful; building a tool that *claims* the practice is scientifically
validated is not.

There is also a defensible functional argument, and it is worth being clear-eyed that it is a
*functional* argument, not a validation: the constraints this system imposes — 2–4 syllables,
pronounceable, ends in a vowel, contains a liquid, has a clear positive meaning, avoids harsh
clusters — are largely good brand-naming constraints on ordinary grounds. A generator that follows
them will produce decent names. Users who value the tradition get a name derived the way their
tradition specifies; the name is also, independently, a reasonable name. We can say both of those
things at once without claiming the first causes commercial success.

## 10.3 Language to use, and to avoid

| Avoid | Use instead |
|---|---|
| "Vastu science proves…" | "Vastu Shastra, a traditional Indian system of architecture, holds that…" |
| "Scientifically aligned with your birth star" | "Derived from your birth star according to the Avakahada Chakra" |
| "This name will bring prosperity" | "This name follows the conventions traditionally associated with prosperity" |
| "Ancient Vedic numerology" | "Chaldean numerology, as commonly applied to Indian business names since the 20th century" |
| "Lucky number" | "The number this name carries in the Chaldean system" |
| "Guaranteed / will succeed" | *no equivalent — do not make outcome claims at all* |

Two further product commitments I would recommend:

- **Show the derivation, always.** "Chu — Ashwini pada 1, from your Moon at 2°14′ Mesha (Lahiri)."
  Transparency is both honest and a differentiator; it also lets a user's own astrologer check us.
- **Never gate on caste, and never present name choice as risk-avoidance.** "This name may cause
  business failure" is manipulative and, for a purchasing decision, arguably unfair commercial
  practice.

## 10.4 Draft disclaimer copy

**Short form (persistent, near the mode toggle):**

> **Vastu Mode** generates names using traditional Hindu naming systems — Namakarana rules from the
> Grhya Sutras, nakshatra-pada syllables, and Chaldean name numerology. These are cultural and
> scriptural traditions, not scientifically validated methods. We show you exactly how each name
> was derived so you can judge it for yourself.

**Long form (info panel / first-run modal):**

> ### About Vastu Mode
>
> Vastu Mode derives name suggestions from traditional Indian naming systems, applied
> deterministically so that the same inputs always produce the same result.
>
> **What we use.** Phonetic and structural rules for names from the Grhya Sutras (Āśvalāyana I.15,
> Pāraskara I.17, Āpastamba 6.15) and Manusmriti 2.30–2.33. The Avakahada Chakra, which assigns a
> starting syllable to each of the 108 nakshatra-padas. Directional and elemental principles from
> Vastu Shastra as set out in Brihat Samhita ch. 53, Mayamatam and Manasara. Chaldean name
> numerology as conventionally practised in India. Astronomical positions from the Swiss Ephemeris
> using the Lahiri (Chitrapaksha) ayanamsa, the Government of India standard.
>
> **What this is.** A careful implementation of a living cultural tradition with a long textual
> history, and a transparent one — every suggestion shows the rule and the source it came from.
>
> **What this is not.** These systems are not scientifically validated. Astrology and Vastu Shastra
> are regarded by the scientific community as pseudoscience: controlled studies have not shown
> predictive effectiveness, and no physical mechanism has been proposed for the claimed effects.
> Name numerology as used in India today descends from the Chaldean system popularised in the West
> in the early 20th century, not from Sanskrit scripture. We make **no claim** that a name chosen
> this way will affect your business's success.
>
> **Where the tradition disagrees with itself.** Sources differ on some syllables, on the mapping
> between sound and element, and on which ayanamsa to use. Where that happens we tell you, show the
> alternatives, and let you choose. Astrological calculations near a boundary are sensitive to birth
> time; if your birth time is approximate, we will say so rather than imply a precision we do not have.
>
> Please treat these suggestions as one input among many — alongside meaning, memorability,
> trademark availability, and your own judgement.

---

# 11. Recommended implementation architecture

**[OUR DESIGN]** — a summary of how the above composes into a deterministic pipeline.

```
INPUTS
  founder DOB + time (+confidence) + place
  business category, entrance direction, goal (stability|renown),
  target market, language, deity preference, co-founder DOBs

STAGE 1 — ASTRONOMY               [computation]
  → Moon sidereal longitude (Lahiri, pinned)
  → nakshatra, pada, rashi, boundary distance
  → (optional) Lagna, current Mahadasha lord

STAGE 2 — SYLLABLE SET            [TRADITIONAL: Avakahada Chakra]
  exact pada syllable                          (weight 1.0, if time confident)
  + other three padas of same nakshatra        (weight 0.7)
  + rashi's nine syllables                     (weight 0.4, fallback if no time)
  ALT PATH: strongest-yoga-planet varga        [TRADITIONAL: Parasara school + Sharada Tilaka]

STAGE 3 — STRUCTURAL FILTER       [SCRIPTURAL: Grhya Sutras]
  syllable count: 2 if goal=stability, 4 if goal=renown   (Asvalayana I.15.6)
  initial must be ghosavat (voiced)
  must contain an antahstha (y/r/l/v)
  must end in a long vowel
  Manusmriti 3.9 semantic blocklist

STAGE 4 — ELEMENT / DIRECTION FLAVOUR   [OUR DESIGN, from Sharada Tilaka + BPHS 3.20]
  entrance direction → element → preferred varga for internal consonants
  business category → deity → semantic root pool
  ** label clearly in UI as our derivation **

STAGE 5 — NUMEROLOGY RANK         [MODERN: Chaldean / Cheiro]
  compute compound + root for name AND for the exact domain string
  reject cautionary compounds (16, 26, 18)
  prefer 19, 23, 27, 37
  rank by harmony with founder's Moolank

STAGE 6 — DOMAIN AVAILABILITY + OUTPUT
  every result carries a full provenance trail:
  syllable → pada → Moon longitude → ayanamsa → rule → citation
```

Two design principles worth holding onto:

1. **Determinism.** Same inputs → same outputs, always. This is what makes the mode feel like an
   astrologer's reasoning rather than an LLM's improvisation, and it is what lets a user's own
   astrologer verify us.
2. **Provenance on every output.** Each name should be able to explain itself down to the verse.
   That is simultaneously the honest thing, the differentiating thing, and the thing that stops us
   from quietly inventing rules.

---

# 12. Sources

### Primary texts (translations online)

- Āśvalāyana Gṛhya Sūtra I.15 (Oldenberg, SBE 29) — https://sacred.plzhalp.us/hin/sbe29/sbe29114.htm
- Pāraskara Gṛhya Sūtra I.17 (Oldenberg, SBE 29) — https://sacred.plzhalp.us/hin/sbe29/sbe29171.htm
- Āpastamba Gṛhya Sūtra 6.15 (Oldenberg, SBE 30) — https://sacred.plzhalp.us/hin/sbe30/sbe30108.htm
- Śāṅkhāyana Gṛhya Sūtra I.24 — https://www.wisdomlib.org/hinduism/book/sankhayana-grihya-sutra/d/doc116478.html
- Manusmṛti 2.31 with Medhātithi's commentary — https://www.wisdomlib.org/hinduism/book/manusmriti-with-the-commentary-of-medhatithi/d/doc145611.html
- Manusmṛti 2.32 with Medhātithi's commentary — https://www.wisdomlib.org/hinduism/book/manusmriti-with-the-commentary-of-medhatithi/d/doc145612.html
- Bṛhat Saṃhitā ch. 53, *Vāstu-vidyā* — https://www.wisdomlib.org/hinduism/book/brihat-samhita/d/doc229297.html
- Bṛhat Saṃhitā ch. 41, *Dravya-niścaya* (commodities by rashi) — https://www.wisdomlib.org/hinduism/book/brihat-samhita/d/doc229186.html
- Bṛhat Parāśara Horā Śāstra ch. 3 v. 20 (planet↔bhūta) — https://www.siva.sh/brihat-parashara-hora-shastra/3/20
- BPHS full English PDF — http://vedic-astro.s3.amazonaws.com/books/bhrihat_parasara_hora_shastra.pdf
- Śāradā Tilaka alphabet (varga↔graha) — https://adhipurusha.com/sarada-tilakam-alphabet/

### Scholarship

- "Nāma in Nāmakaraṇa: Structures of Personal Names Ruled in the Gṛhyasūtras" — https://doi.org/10.4259/ibk.11.341
- "Revisiting the Vāstupuruṣamaṇḍala in Hindu Temples, and Its Meanings" — https://doi.org/10.5659/aikar.2014.16.2.45
- "Maṇḍala in Architecture: Symbolism and Significance for Contemporary Design Education in India" — https://doi.org/10.22492/ije.8.4.10
- "Reviewing the value assessment of Vaastu Shastra in the Walled city of Jaipur" (Politecnico di Milano) — https://re.public.polimi.it/bitstream/11311/1218938/1/Reviewing%20the%20value%20assessment%20of%20Vaastu%20Shastra.pdf
- "Understanding users' comfort levels in homes designed based on the principles of Vaastushastra in Dubai" (Cardiff) — https://orca.cardiff.ac.uk/137385
- "Assessing the Epistemic Value of Astrology" — https://doi.org/10.55544/ijrah.3.4.1
- Wikipedia, *Astrology and science* — https://en.wikipedia.org/wiki/Astrology_and_science
- Vāstu-puruṣa in the Purāṇas — https://www.wisdomlib.org/hinduism/essay/arts-in-the-puranas-study/d/doc1460306.html

### Nakshatra / rashi syllable tables

- Wikipedia, *List of Nakshatras* (pada table) — https://en.wikipedia.org/wiki/List_of_Nakshatras
- Vedic Marga, full nakshatra–pada–alphabet table — https://vedicmarga.com/nakshatra-and-alphabets/
- KundliGPT baby-name calculator (Avakahada chakra) — https://kundligpt.com/calculators/baby-name-calculator/
- CalcaTools Hindu baby name calculator — https://calcatools.com/hindu-calculators/hindu-baby-name-calculator/
- MomJunction nakshatra syllable chart (regional variants) — https://www.momjunction.com/nakshatra-finder-birth-star-calculator/
- Jyotish Nepal, per-nakshatra seed sounds — https://www.old.jyotishnepal.com.np/constellation
- GrahaGuru, rashi ↔ syllable mapping — https://grahaguru.in/how-to/calculate-rashi-by-name
- JyotishGram, rashi by name — https://www.jyotishgram.com/blog/rashi-by-name-find-your-zodiac-sign-by-first-letter/
- AltFTool rashi letter chart (traces each syllable to its pada) — https://www.altftool.com/tools/all/rashi-name-letter-chart
- Nurturepedia, Grhya Sutra rules applied to naming — https://www.nurturepedia.com/blog/hindu-baby-names-nakshatra-meanings

### Namakarana practice

- Indica Today, "Namakarana Samskara — The Rite of Naming a Newborn" — https://www.indica.today/long-reads/namakarana-samskara-rite-naming-a-newborn/
- Parasara Jyotish, "Names, Letters & Planetary Rulerships" (dissenting view on the pada table) — https://parasara.net/learn/names-letters-planetary-rulerships-l108

### Phonetics / varga

- Vedadhara, "Characteristics of Sanskrit alphabets as per Mantra shastra" (varga→bhūta, Mapping A) — https://www.vedadhara.com/characteristics-of-sanskrit-alphabets-as-per-mantra-shastra
- "Basics of Sanskrit Letters" PDF (articulation, Tamil/Malayalam gaps) — https://vedavms.in/docs/articles/00Sanskrit%20Letters.pdf

### Vastu applied to business

- Layered Vastu, industrial element/zone table — https://www.layeredvastu.com/industrial-vastu-expert/vastu-for-industry
- Naksham, Vastu for shop (direction → deity → business effect) — https://nakshamastro.com/astrohub/vastu/tips/vastu-for-shop
- Naksham, Vastu for factory — https://nakshamastro.com/astrohub/vastu/tips/vastu-for-factory
- Engineers Diary, chemical plant Vastu (direction/element/use table) — https://engineersdiary.com/complete-vastu-guide-for-chemical-plants-industrial-buildings-best-placement-for-machinery-boilers-raw-materials-finished-goods-toilets-stairs-more/
- Arun Vyas, Vastumandal (Mayamatam ch. 7 deities, vīthi zones, marma) — https://www.arunvyas.com/vastumandal
- Applied Vastu, 45-deity mandala — https://www.appliedvastu.com/vastu-purusha-mandala

### Numerology

- Cheiro's classical compound-number descriptions — https://bostjanlovrat.com/2024/08/21/classical-cheiros-descriptions-of-compound-numbers/
- Chaldean compound numbers 10–52 — https://diastrologer.com/blog/chaldean-numerology-compound-numbers-meaning
- Compound numbers in Cheiro numerology — https://www.namealigned.com/blog/compound-numbers-cheiro
- Business name numerology with worked Indian brand examples — https://www.namealigned.com/blog/name-numerology-business
- Naksham, Vedic Ank Jyotish + founder-harmony table — https://nakshamastro.com/learn/numerology-for-business-guide
- AstroSight, business name numerology — https://astrosight.ai/numerology/business-name-numerology
- Chaldean vs Pythagorean full A–Z comparison — https://www.oldwesthistory.net/blog/lucky-business-name-numerology

### Computation

- swisseph-js monorepo — https://github.com/swisseph-js/swisseph
- `@swisseph/node` on npm — https://www.npmjs.com/package/@swisseph/node
- swisseph-js API reference (sidereal mode, ayanamsa) — https://github.com/swisseph-js/swisseph/blob/main/docs/api/node.md
- Ayanamsa systems compared (Lahiri / Raman / KP) — https://vedika.io/blog/ayanamsa-lahiri-raman-kp-compared
- Ayanamsa deep dive with 2026 values and worked boundary example — https://vedika.io/blog/ayanamsa-explained-lahiri-raman-kp
- KP New ayanamsa and sub-lord sensitivity — https://jagannathhora.com/kp-new-ayanamsha-explained/
- AstroMedha, what is ayanamsa — https://astromedha.in/insights/concepts/what-is-ayanamsa

---

## Appendix — the six lowest-confidence claims in this report

Flagged so they can be re-verified against a printed classical source before shipping.

1. **Purva Ashadha padas 3 and 4** (Pha / Ḍha). Sources genuinely conflict; Devanagari favours
   this reading but confidence is low.
2. **Varga → element.** No agreed scriptural table exists. Our Mapping C is a composition, not a
   citation. §6.3.
3. **Direction → planet** in §5.2. Less stable than direction → deity, and it conflicts with BPHS
   dig-bala.
4. **The master-number set** in Chaldean practice (11/22/33 vs 11/22/33/51/65 vs none). Sources
   disagree and Cheiro's own tables do not support the preserved-master convention.
5. **Moolank vs Bhagyank** as the harmony target. Practitioners split; no source gives a
   principled reason.
6. **Nakshatra → element.** Several incompatible schemes circulate (contiguous five-band zodiac
   division; nadi-based Vata/Pitta/Kapha; rashi-element inheritance). I would **not** use
   nakshatra→element in the product at all; use direction→element instead, which is better grounded.
