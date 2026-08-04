# NAP-consistentie & review-flow

Niet onderdeel van de website (niet deployen) — werkdocument.

## NAP-consistentie (Name, Address, Phone)

**Referentie (zoals nu op de site/schema staat — dit moet overal exact zo terugkomen):**
```
Naam:      Audiolyte
Telefoon:  +32 486 40 98 99
E-mail:    info@audiolyte.be
Website:   https://audiolyte.be
Adres:     Genk (Limburg), België — exact straatadres nog aan te vullen (zie GBP-bestand)
```

**Nog te controleren (kon ik niet automatisch verifiëren):**
- [ ] **Instagram-bio** (@audiolyte.be) — Instagram blokkeert onaangemelde/geautomatiseerde
      bezoekers, dus ik kon de bio niet uitlezen. Check zelf of naam/telefoon/website daar
      **exact** overeenkomen met bovenstaande (zelfde spatiëring, zelfde format telefoonnummer).
- [ ] Bestaande vermeldingen op andere platforms (2dehands-advertenties, eventuele oude
      Facebook-pagina, eerdere directory-inschrijvingen) — nazoeken op inconsistenties.
- [ ] Zodra het GBP-adres gekozen is (zie `google-business-profile.md`), dat adres ook
      toevoegen aan de `PostalAddress` in de site's `LocalBusiness`-schema (nu alleen
      `addressLocality: Genk` + `addressRegion: Limburg`, geen straatadres).

**Waarom dit telt:** inconsistente NAP verwart Google over welke gegevens autoritatief zijn en
verzwakt precies het signaal dat je nodig hebt om lokaal te winnen van audiolyte.nl.

---

## Review-generatie flow

⚠️ **Blocked op Google Business Profile.** Een directe review-link (`g.page/r/.../review`)
bestaat pas zodra de GBP-listing is aangemaakt en een Place ID heeft. Zodra dat klaar is:
1. Ga naar je GBP in Google Maps → "Vraag om reviews" → kopieer de gegenereerde link.
2. Vul die link hieronder in bij `[REVIEW-LINK]` en gebruik dit sjabloon voortaan.

### Wanneer vragen
Vraag **binnen 1–3 dagen na afloop van het event** — dan is de ervaring nog vers en de kans op
een reactie het hoogst. Niet vooraf, niet weken later.

### Sjabloon (e-mail of WhatsApp, na een geslaagd event)
```
Onderwerp: Bedankt voor je vertrouwen! 🎉

Hoi [naam],

Bedankt dat je voor Audiolyte koos voor [type event, bv. "je bruiloft" / "het bedrijfsfeest"]!
We hopen dat alles naar wens verliep.

Zou je 30 seconden willen nemen om een review achter te laten? Het helpt ons enorm en andere
mensen die iets vergelijkbaars plannen.

👉 [REVIEW-LINK]

Nogmaals bedankt, en tot een volgende keer!

Team Audiolyte
```

### Cadans
Een **gestage, gelijkmatige stroom** reviews (na elk event, niet in bursts) oogt natuurlijker
voor Google dan af en toe een piek van 10 tegelijk. Bouw dit gewoon in als vaste stap na elk
afgerond event — bv. in je eigen after-event-checklist.

### Reageren
Reageer op **elke** review, positief én negatief. Bij negatieve reviews: kalm, constructief,
nooit defensief — en nooit reviews kopen/faken (zie antipatterns.md in de hasan-seo2-skill:
dit is tegen Google's beleid, detecteerbaar, en risicovol voor je profiel).
