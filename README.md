# Raitha Bandhu (ರೈತ ಬಂಧು)
## Region-Specific Crop Recommendation & Agricultural Advisory System for Southern Bengaluru & Ramanagara, Karnataka

**Raitha Bandhu (ರೈತ ಬಂಧು)** is a practical, trustworthy agricultural advisory application designed primarily for farmers in **Harohalli**, **Kanakapura**, **Ramanagara**, **Channapatna**, and the surrounding southern Bengaluru region of Karnataka, India (Agro-Climatic Zone 5: Eastern Dry Zone).

Its purpose is to help farmers identify suitable crops based on local red soils, seasonal rainfall patterns, water resources, and farm requirements.

---

### Key Features

1. **Simple, Uncluttered Dashboard**:
   - Clean, farmer-first interface with zero decorative noise or AI gimmicks.
   - Prominent primary call to action: **Get Crop Recommendation (ಬೆಳೆ ಶಿಫಾರಸು ಪಡೆಯಿರಿ)**.
   - Immediate language toggle between English and Kannada (ಕನ್ನಡ).
   - Farmer profile entry point.

2. **Language Support: Kannada (ಕನ್ನಡ) & English ONLY**:
   - Comprehensive translations across all interface elements, form labels, buttons, error messages, and cultivation guidelines.
   - Natural Kannada terms familiar to farmers in southern Karnataka.

3. **Simple Mobile + OTP Farmer Login & Profile**:
   - Hassle-free login using mobile number (+91) and 6-digit OTP (password-free).
   - Transparently labeled demo authentication.
   - Persistent farm location and soil settings that automatically pre-fill into recommendation forms.
   - Saved crop recommendation history.

4. **Curated Regional Crop Catalogue**:
   - Calibrated exclusively for Zone 5 (Eastern Dry Zone).
   - Core documented regional crops:
     - **Ragi / Finger Millet (ರಾಗಿ)** – Centuries-old regional staple; drought-hardy.
     - **Maize / Musukina Jola (ಮುಸುಕಿನ ಜೋಳ)** – High-yielding dairy fodder and grain.
     - **Red Gram / Togari (ತೊಗರಿ)** – Traditional nitrogen-fixing companion in Akkadi intercropping.
     - **Cowpea / Alasande (ಅಲಸಂದೆ)** – Quick-growing dual-purpose pulse and soil cover.
     - **Horse Gram / Huruli (ಹುರುಳಿ)** – Time-tested drought survival crop on gravelly soils.
     - **Groundnut / Kadalekayi (ಕಡಲೆಕಾಯಿ)** – Commercial oilseed on light red sandy loams.
     - **Mulberry / Sericulture (ಹಿಪ್ಪುನೇರಳೆ - ರೇಷ್ಮೆ ಕೃಷಿ)** – Economic backbone of Ramanagara ("Silk City").
     - **Tomato (ಟೊಮೇಟೊ)** – Premier peri-urban vegetable supplying Bengaluru APMC.
     - **Brinjal / Badanekayi (ಬದನೆಕಾಯಿ)** – Consistent smallholder cash vegetable.
     - **Green Chilli / Menasinakayi (ಹಸಿಮೆಣಸಿನಕಾಯಿ)** – Regular harvest cash crop.
     - **Mango / Mavu (ಮಾವು)** – Famous orchard crop suited to dry red soils.
     - **Coconut / Tengu (ತೆಂಗು)** – Traditional plantation crop along river basins.
     - **Banana / Elakki Bale (ಏಲಕ್ಕಿ ಬಾಳೆ)** – High-value crop under assured irrigation.
     - **Sapota / Chikku (ಸಪೋಟ)** – Rugged dryland fruit orchard crop.
     - **Papaya / Parangi (ಪಪ್ಪಾಯಿ)** – Fast-turnaround commercial fruit.

5. **Region-Specific Agronomic Recommendation Engine**:
   - Evaluates planting season, water availability, irrigation access, soil type, and optional N-P-K & pH values.
   - Soil test values are strictly **optional**; regional baselines for red sandy loam are used when soil tests are unavailable, with transparent explanations.
   - Returns ranked suitable crops with specific regional reasons, limitations, and cultivation advice.

6. **Secondary Advisory Tools**:
   - **Soil Health Analysis (`/soil`)**: Evaluates Soil Health Card values against Karnataka Zone 5 standards.
   - **Weather & Cropping Calendar (`/weather`)**: 7-day agro-weather forecast and sowing/harvest calendar for Harohalli & Kanakapura.
   - **Water & Irrigation Budgeting (`/water`)**: Water requirement calculations and drip irrigation savings.
   - **Cost & Profit Comparison (`/profit`)**: Per-acre economic comparison for regional crops.
   - **Fertilizer Guidance (`/fertilizer`)**: Balanced NPK, FYM, and biofertilizer seed treatment guidelines.
   - **Pest & Disease Advisory (`/pests`)**: Diagnostic symptoms and safe management for regional pests (Blast, FAW, Pod borer, Leaf curl).
   - **Government Schemes (`/schemes`)**: State and central schemes (Raitha Siri, Krishi Bhagya, PMKSY, PM-KISAN, PMFBY, Yashasvini).
   - **Farming Q&A (`/assistant`)**: Common farming questions answered with UAS Bengaluru & KVK recommendations.

---

### Regional Research & References

Agronomic logic and cultivation guidance are informed by:
- **University of Agricultural Sciences, Bengaluru (UAS-B / GKVK)**
- **ICAR - Krishi Vigyan Kendra, Ramanagara (Chandurayanahalli)**
- **Karnataka State Department of Agriculture (KSDA)**
- **Department of Horticulture, Government of Karnataka**
- **Mysore State Gazetteer (C. Hayavadana Rao, 1927–1930)**

---

### Local Development

```sh
# Install dependencies
npm install

# Run type check and unit tests
npm run test

# Start local development server
npm run dev
```

Server runs by default at `http://localhost:8080/`.
