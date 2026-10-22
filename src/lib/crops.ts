// Demo crop catalogue. Values are approximate, simplified reference ranges for illustration only.
export type Season = "Kharif" | "Rabi" | "Zaid";
export type WaterNeed = "Low" | "Moderate" | "High";
export type CropType = "Cereal" | "Pulse" | "Oilseed" | "Cash" | "Fruit" | "Vegetable";

export interface Crop {
  id: string;
  name: string;
  hindi: string;
  emoji: string;
  type: CropType;
  seasons: Season[];
  water: WaterNeed;
  description: string;
  soils: string[];
  temp: [number, number];
  rainfall: [number, number];
  ph: [number, number];
  npk: { n: [number, number]; p: [number, number]; k: [number, number] };
  humidity: [number, number];
  durationDays: [number, number];
  cultivation: string[];
  costPerAcre: number; // INR, demo
  yieldPerAcre: number; // quintal, demo
  pricePerQuintal: number; // INR, demo
}

export const CROPS: Crop[] = [
  { id: "rice", name: "Rice", hindi: "धान", emoji: "🌾", type: "Cereal", seasons: ["Kharif"], water: "High",
    description: "Staple grain grown in flooded or well-watered fields with warm, humid weather.",
    soils: ["Clay", "Loamy", "Alluvial"], temp: [20, 35], rainfall: [150, 300], ph: [5.5, 7], humidity: [70, 90],
    npk: { n: [60, 100], p: [35, 60], k: [35, 50] }, durationDays: [110, 150],
    cultivation: ["Raise nursery and transplant at 20–25 days", "Keep 2–5 cm standing water", "Weed control in first 40 days"],
    costPerAcre: 28000, yieldPerAcre: 22, pricePerQuintal: 2300 },
  { id: "wheat", name: "Wheat", hindi: "गेहूं", emoji: "🌾", type: "Cereal", seasons: ["Rabi"], water: "Moderate",
    description: "Winter grain that needs cool weather while growing and dry, warm weather at harvest.",
    soils: ["Loamy", "Alluvial", "Black"], temp: [10, 25], rainfall: [40, 110], ph: [6, 7.5], humidity: [40, 70],
    npk: { n: [60, 120], p: [30, 60], k: [20, 45] }, durationDays: [110, 140],
    cultivation: ["Sow in November", "4–6 irrigations at key stages", "Crown root irrigation at 21 days is important"],
    costPerAcre: 24000, yieldPerAcre: 18, pricePerQuintal: 2425 },
  { id: "maize", name: "Maize", hindi: "मक्का", emoji: "🌽", type: "Cereal", seasons: ["Kharif", "Rabi", "Zaid"], water: "Moderate",
    description: "Flexible grain crop used for food and animal feed. Grows in many seasons.",
    soils: ["Loamy", "Alluvial", "Red"], temp: [18, 32], rainfall: [50, 120], ph: [5.5, 7.5], humidity: [50, 80],
    npk: { n: [60, 100], p: [35, 60], k: [15, 35] }, durationDays: [90, 120],
    cultivation: ["Avoid water-logging", "Earthing up at knee height", "Watch for fall armyworm"],
    costPerAcre: 20000, yieldPerAcre: 20, pricePerQuintal: 2090 },
  { id: "chickpea", name: "Chickpea (Chana)", hindi: "चना", emoji: "🫘", type: "Pulse", seasons: ["Rabi"], water: "Low",
    description: "Hardy pulse crop for cool, dry winters. Adds nitrogen to the soil.",
    soils: ["Black", "Loamy", "Sandy loam"], temp: [15, 28], rainfall: [40, 90], ph: [6, 8], humidity: [15, 50],
    npk: { n: [20, 60], p: [55, 80], k: [75, 85] }, durationDays: [90, 120],
    cultivation: ["Seed treatment with Rhizobium", "One irrigation at flowering if dry", "Nip the tips to promote branching"],
    costPerAcre: 15000, yieldPerAcre: 8, pricePerQuintal: 5650 },
  { id: "pigeonpea", name: "Pigeon Pea (Arhar)", hindi: "अरहर", emoji: "🫛", type: "Pulse", seasons: ["Kharif"], water: "Low",
    description: "Deep-rooted pulse that tolerates dry spells. Good for intercropping.",
    soils: ["Red", "Black", "Loamy"], temp: [18, 35], rainfall: [60, 150], ph: [5.5, 7.5], humidity: [40, 70],
    npk: { n: [0, 40], p: [55, 80], k: [15, 25] }, durationDays: [150, 200],
    cultivation: ["Sow at start of monsoon", "Ridge sowing helps drainage", "Watch for pod borer at flowering"],
    costPerAcre: 16000, yieldPerAcre: 7, pricePerQuintal: 7550 },
  { id: "mustard", name: "Mustard", hindi: "सरसों", emoji: "🌼", type: "Oilseed", seasons: ["Rabi"], water: "Low",
    description: "Oilseed crop for cool winters. Needs little water.",
    soils: ["Loamy", "Sandy loam", "Alluvial"], temp: [10, 25], rainfall: [30, 80], ph: [6, 7.5], humidity: [30, 60],
    npk: { n: [60, 100], p: [30, 50], k: [20, 40] }, durationDays: [110, 140],
    cultivation: ["Sow in October", "Thin plants at 15–20 days", "Watch for aphids in January"],
    costPerAcre: 14000, yieldPerAcre: 7, pricePerQuintal: 5950 },
  { id: "groundnut", name: "Groundnut", hindi: "मूंगफली", emoji: "🥜", type: "Oilseed", seasons: ["Kharif", "Zaid"], water: "Moderate",
    description: "Oilseed that forms pods underground. Likes light, well-drained soil.",
    soils: ["Sandy loam", "Red", "Loamy"], temp: [22, 32], rainfall: [50, 125], ph: [6, 7.5], humidity: [50, 75],
    npk: { n: [15, 30], p: [40, 60], k: [30, 50] }, durationDays: [100, 130],
    cultivation: ["Apply gypsum at flowering", "Light soil helps pegging", "Avoid water at harvest time"],
    costPerAcre: 22000, yieldPerAcre: 9, pricePerQuintal: 6780 },
  { id: "cotton", name: "Cotton", hindi: "कपास", emoji: "☁️", type: "Cash", seasons: ["Kharif"], water: "Moderate",
    description: "Fibre crop that needs a long warm season. Grows well in black soil.",
    soils: ["Black", "Alluvial", "Loamy"], temp: [21, 35], rainfall: [60, 120], ph: [6, 8], humidity: [50, 80],
    npk: { n: [100, 140], p: [35, 60], k: [15, 25] }, durationDays: [150, 180],
    cultivation: ["Sow with first monsoon showers", "Monitor pink bollworm with traps", "Pick in 3–4 rounds"],
    costPerAcre: 32000, yieldPerAcre: 10, pricePerQuintal: 7120 },
  { id: "sugarcane", name: "Sugarcane", hindi: "गन्ना", emoji: "🎋", type: "Cash", seasons: ["Zaid", "Kharif"], water: "High",
    description: "Long-duration crop that needs a lot of water and nutrients.",
    soils: ["Loamy", "Alluvial", "Black"], temp: [20, 38], rainfall: [100, 200], ph: [6.5, 7.5], humidity: [60, 85],
    npk: { n: [100, 150], p: [40, 70], k: [40, 80] }, durationDays: [300, 365],
    cultivation: ["Plant 2–3 bud setts", "Trash mulching saves water", "Drip irrigation strongly helpful"],
    costPerAcre: 60000, yieldPerAcre: 350, pricePerQuintal: 340 },
  { id: "watermelon", name: "Watermelon", hindi: "तरबूज", emoji: "🍉", type: "Fruit", seasons: ["Zaid"], water: "Moderate",
    description: "Summer fruit crop with short duration. Likes heat and sandy soil.",
    soils: ["Sandy loam", "Alluvial"], temp: [24, 38], rainfall: [20, 60], ph: [6, 7], humidity: [40, 70],
    npk: { n: [80, 120], p: [10, 40], k: [45, 55] }, durationDays: [80, 100],
    cultivation: ["Sow in raised beds", "Mulching keeps fruit clean", "Reduce watering near harvest"],
    costPerAcre: 30000, yieldPerAcre: 100, pricePerQuintal: 900 },
  { id: "moong", name: "Green Gram (Moong)", hindi: "मूंग", emoji: "🟢", type: "Pulse", seasons: ["Zaid", "Kharif"], water: "Low",
    description: "Short pulse crop that fits between main seasons and improves soil.",
    soils: ["Loamy", "Sandy loam", "Red"], temp: [25, 35], rainfall: [40, 80], ph: [6.2, 7.2], humidity: [60, 85],
    npk: { n: [0, 40], p: [35, 60], k: [15, 25] }, durationDays: [60, 75],
    cultivation: ["Sow after wheat harvest", "2–3 light irrigations", "Pick pods when black"],
    costPerAcre: 12000, yieldPerAcre: 5, pricePerQuintal: 8680 },
  { id: "tomato", name: "Tomato", hindi: "टमाटर", emoji: "🍅", type: "Vegetable", seasons: ["Rabi", "Kharif"], water: "Moderate",
    description: "Popular vegetable with good market demand. Needs care against pests.",
    soils: ["Loamy", "Sandy loam", "Red"], temp: [18, 30], rainfall: [40, 100], ph: [6, 7], humidity: [50, 75],
    npk: { n: [80, 120], p: [50, 80], k: [50, 80] }, durationDays: [90, 120],
    cultivation: ["Transplant 4-week seedlings", "Stake plants", "Watch for leaf curl virus"],
    costPerAcre: 55000, yieldPerAcre: 120, pricePerQuintal: 1200 },
];

export const getCrop = (id: string) => CROPS.find((c) => c.id === id);

export const STATES: Record<string, string[]> = {
  "Andhra Pradesh": ["Guntur", "Krishna", "Kurnool"],
  Bihar: ["Patna", "Gaya", "Muzaffarpur"],
  Gujarat: ["Ahmedabad", "Rajkot", "Junagadh"],
  Haryana: ["Karnal", "Hisar", "Sirsa"],
  Karnataka: ["Belagavi", "Mandya", "Raichur"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Ujjain"],
  Maharashtra: ["Nashik", "Pune", "Nagpur", "Akola"],
  Punjab: ["Ludhiana", "Amritsar", "Bathinda"],
  Rajasthan: ["Jaipur", "Kota", "Bikaner"],
  "Tamil Nadu": ["Thanjavur", "Coimbatore", "Madurai"],
  "Uttar Pradesh": ["Lucknow", "Meerut", "Varanasi"],
  "West Bengal": ["Bardhaman", "Nadia", "Hooghly"],
};

export const SOIL_TYPES = ["Alluvial", "Black", "Red", "Loamy", "Clay", "Sandy loam", "Laterite"];
