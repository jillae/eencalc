Projekt: Intäktsberäkning - Emerald Sweden

Beskrivning:
Detta projekt är en webbaserad intäktsberäkningsapplikation för Emerald Sweden. Användare kan mata in olika parametrar relaterade till sin klinik och de maskiner de är intresserade av för att få en uppskattning av potentiella intäkter och kostnader.

Nyckelfunktioner:
- Beräkning av potentiell nettointäkt baserat på klinikstorlek och antal behandlingar per dag.
- Val av olika maskiner från Emerald Sweden med tillhörande leasingkostnader och driftskostnader (credits/flatrate).
- Justerbar leasingperiod och möjlighet att inkludera försäkring i leasingkostnaden.
- Möjlighet att justera leasingkostnaden manuellt inom vissa gränser (se: "Justera leasingkostnad:").
- Hantering av driftskostnader baserat på antal behandlingar per dag (credits per styck eller flatrate).
- Beräkning av intäkter baserat på kundpris per behandling (se: "Kundpris per behandling (kr) ink moms:").
- Visning av en detaljerad resultattabell med intäkter, kostnader och nettoresultat på dags-, vecko-, månads- och årsbasis.
- Beräkning av potentiella intäkter baserat på olika beläggningsgrader (50%, 75%, 100%) (se: "Beläggning 50%, år 1 (ink moms)", "Beläggning 75%, år 2 (ink moms)", "Beläggning 100%, år 3 (ink moms)").
- Dynamisk visning av element relaterade till credits/flatrate baserat på vald maskin (se: "Credits Styckepris (kr) ex moms per styck:").
- Möjlighet att återställa formuläret till initiala värden (genom att ladda om sidan).

Användning:
1. Öppna filen `index.html` i en webbläsare.
2. Välj klinikstorlek med hjälp av slidern (Small ger 2 behandlingar/dag, Medium ger 4, Large ger 6). Nettoresultat per år visas direkt under slidern.
3. Ange antalet behandlingar per dag manuellt om du vill avvika från klinikstorlekens standard i fältet "Antal behandlingar per dag:".
4. Välj en maskin från rullgardinsmenyn "Välj maskin:".
5. Välj en leasingperiod från rullgardinsmenyn "Leasingperiod:".
6. Välj om försäkring ska inkluderas i leasingkostnaden från rullgardinsmenyn "Försäkring:".
7. Justera eventuellt leasingkostnaden med slidern under "Justera leasingkostnad:". Värdena för min och max leasingkostnad visas ovanför och under slidern.
8. Den justerade leasingkostnaden visas i fältet "Leasingkostnad per månad (kr) ex moms:". Detta fält är readonly.
9. Om den valda maskinen använder credits visas fältet "Credits Styckepris (kr) ex moms per styck:". Detta fält är readonly och uppdateras automatiskt baserat på leasingkostnaden.
10. Om antalet behandlingar per dag är 3 eller fler för en maskin med credits, visas fältet "Credits Flatrate - credits efter behov (kr) ex moms per månad:" istället. Detta fält är readonly.
11. Ange kundpris per behandling i fältet "Kundpris per behandling (kr) ink moms:".
12. Resultattabellen under "Resultat" uppdateras automatiskt med beräknade värden.
13. Observera att texten under resultattabellen påminner om att detta endast är ett beräkningsunderlag och att avtal gäller.

Filstruktur:
- `index.html`: Huvudsidan med användargränssnittet.
- `style.css`: Filen som innehåller stilmallarna för applikationen.
- `script.js`: Filen som innehåller all JavaScript-kod för funktionaliteten och maskindata.
- `readme.txt`: Denna fil, som beskriver projektet.

Beräkningsregler:

Denna applikation beräknar potentiella intäkter och kostnader baserat på följande regler och antaganden:

1. Klinikstorlek och antal behandlingar per dag:
   - Små kliniker antas utföra 2 behandlingar per dag som standard.
   - Mellanstora kliniker antas utföra 4 behandlingar per dag som standard.
   - Stora kliniker antas utföra 6 behandlingar per dag som standard.
   - Användaren har möjlighet att manuellt justera antalet behandlingar per dag i input-fältet.

2. Leasingkostnad (se: "Leasingkostnad per månad (kr) ex moms:"):
   - Leasingkostnaden per månad (exklusive moms) baseras på vald maskin och leasingperiod och beräknas med en tariff.
   - Användaren kan välja om försäkring ska inkluderas i leasingkostnaden, vilket påverkar den beräknade leasingkostnaden.
   - Leasingkostnaden kan justeras manuellt inom ett fördefinierat min- och maxintervall för den valda maskinen med hjälp av slidern "Justera leasingkostnad:".

3. Driftskostnader (Credits/Flatrate) (se: "Credits Styckepris (kr) ex moms per styck:" och "Credits Flatrate - credits efter behov (kr) ex moms per månad:"):
   - För maskiner som använder credits:
     - Om antalet behandlingar per dag är färre än 3, beräknas driftskostnaden baserat på ett styckpris per credit (exklusive moms) som är dynamiskt beroende av den valda leasingkostnaden. Denna kostnad beräknas sedan per månad (antal dagar per månad antas vara 22).
     - Om antalet behandlingar per dag är 3 eller fler, används en fast månadskostnad (flatrate exklusive moms) som är definierad för den valda maskinen.

4. Kundpris per behandling (se: "Kundpris per behandling (kr) ink moms:"):
   - Kundpriset per behandling anges inklusive moms.

5. Beräkning av intäkter:
   - Intäkter per behandling (exklusive moms) beräknas genom att ta Kundpris per behandling (inklusive moms) och dividera med 1 + momssatsen (vi antar en standardmomssats på 25% om inget annat anges).
   - Dagsintäkt (ink moms) = Intäkter per behandling (exklusive moms) * Antal behandlingar per dag * 1.25.
   - Vecko-intäkt (ink moms) = Dagsintäkt (ink moms) * 7.
   - Månadsintäkt (ink moms) = Dagsintäkt (ink moms) * 22.
   - Årsintäkt (ink moms) = Månadsintäkt (ink moms) * 12.

6. Beräkning av kostnader (se: "Leasingkostnad per månad (ex moms)" och "Drift (credits/flatrate) - per månad (ex moms)"):
   - Månatlig leasingkostnad (exklusive moms) beräknas baserat på vald maskin, leasingperiod och eventuell justering via slider.
   - Månatlig driftskostnad (exklusive moms) beräknas enligt punkt 3.
   - Total månatlig kostnad (exklusive moms) = Månatlig leasingkostnad + Månatlig driftskostnad.

7. Beräkning av nettoresultat (se: "Netto per månad (ex moms)" och "Netto per år (ex moms)"):
   - Nettoresultat = Totala intäkter (exklusive moms) - Totala kostnader (exklusive moms). Detta beräknas på månads- och årsbasis.

8. Beräkning vid olika beläggningsgrader (se: "Beläggning 50%, år 1 (ink moms)", "Beläggning 75%, år 2 (ink moms)", "Beläggning 100%, år 3 (ink moms)"):
   - Potentiella intäkter visas även vid 50%, 75% och 100% beläggningsgrad. Detta innebär att den beräknade årsintäkten (exklusive moms) multipliceras med respektive beläggningsgrad och sedan inkluderas moms (multipliceras med 1.25).

9. Moms:
    - I applikationen antas en standardmomssats på 25% för de beräkningar där moms är relevant. Leasing- och driftskostnader anges vanligtvis exklusive moms, medan kundpriser anges inklusive moms.

10. Leasingkostnadsberäkning:
    - Leasingkostnaden beräknas baserat på maskinens pris (inklusive frakt i EUR konverterat till SEK med aktuell växelkurs från Riksbankens API eller en fallback-kurs), vald leasingperiod (med en tillhörande tariff) och om försäkring är inkluderad.

Konstanter:

Dessa värden är definierade som konstanter i applikationens JavaScript-kod:

- `MOMS_SATS`: 0.25 (implicit i beräkningen `kundpris / 1.25`)
- `ANTAL_ARBETS_DAGAR_PER_MANAD`: 22 (används vid beräkning av månadsintäkt och credit-kostnad)
- `ANTAL_VECKOR_PER_MANAD`: 4 (implicit antagande för att härleda månadsintäkt från vecko-intäkt)
- `ANTAL_MANADER_PER_AR`: 12 (används vid beräkning av årsintäkt och nettoresultat)
- `STANDARD_BEHANDLINGAR_PER_DAG_LITEN_KLINIK`: 2 (definieras i funktionen `updateTreatmentsPerDay`)
- `STANDARD_BEHANDLINGAR_PER_DAG_MELLAN_KLINIK`: 4 (definieras i funktionen `updateTreatmentsPerDay`)
- `STANDARD_BEHANDLINGAR_PER_DAG_STOR_KLINIK`: 6 (definieras i funktionen `updateTreatmentsPerDay`)
- `GRANS_FOR_FLATRATE`: 3 (används för att avgöra om flatrate ska användas i `updateCalculations` och `calculateCostPerMonth`)
- `insuranceRates`: `{ 10000: 0.04, 20000: 0.03, 50000: 0.025, Infinity: 0.015 }` (definierar årliga försäkringspremier i procent baserat på maskinpris)
- `shippingCostEur`: 652 (fraktkostnad i EUR)
- Fallback växelkurs (EUR till SEK): 11.49260 (används om API-anrop misslyckas)
- API URL för växelkurs: `https://api.riksbank.se/swea/v1/CrossRates/SEK${fromCurrency.toUpperCase()}PMI/SEK${toCurrency.toUpperCase()}PMI`

Konstant data för varje maskin (leasingkostnader, credit-priser, flatrate, etc.) finns definierad direkt i JavaScript-koden i objektet `machineData`.

