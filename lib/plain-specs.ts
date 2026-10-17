/**
 * Plain words for the specification cells, at render time.
 *
 * Vern, 17 Oct 2026, looking at /products/traffic-patterns: "60 BPN, ASTM
 * E303 ... this is the kind of info that is a bit much. We don't need all
 * these numbers and acronyms. Improve readability, site wide." The printed
 * Product Portfolio Book and Studio keep the engineer's figures (the spec
 * sheet PDFs on every page carry the test methods in full); what the page
 * PRINTS is the same fact in words a planner, a property manager or a
 * councillor reads at a glance. The JSON-LD keeps the raw value.
 *
 * Find-and-replace on the whole value, so a cell the book or Studio reword
 * simply prints as written until it is added here. Keep every line true to
 * the figure it replaces (docs/GLOSSARY.md): a mil is a thousandth of an
 * inch, 125 mil is 3.2 mm; 60 BPN on the wet pendulum test (ASTM E303) is
 * good wet grip for a road surface; 8 to 9 on the Mohs scale is as hard as
 * corundum; SR 0.33 reflects a third of the sun's energy.
 */

const PLAIN: Record<string, string> = {
  // Thickness
  "125 mil": "125 mil (about 3 mm)",
  "150 mil": "150 mil (about 4 mm)",
  "125 mil standard / 90 mil ViziGrip": "125 mil (3 mm); 90 mil for bike lane markings",
  // Skid resistance
  "60 BPN, ASTM E303": "High, tested wet",
  "60 BPN (ASTM E303)": "High, tested wet",
  "60 BPN · ASTM E303": "High, tested wet (60 BPN)",
  // Aggregate
  "8–9 Mohs rating": "Very hard, through the full thickness",
  "8–9 Mohs, through the full cross-section": "Very hard, through the full thickness",
  "Anti-skid, intermixed through the full cross-section": "Anti-skid, mixed through the full thickness",
  // Time
  Hours: "Within hours",
  "45–60 min, traffic-ready": "Traffic-ready in about an hour",
  "45–60 min · traffic-ready": "Traffic-ready in about an hour",
  "+3°C": "From 3°C and rising",
  "+3°C and rising": "From 3°C and rising",
  "6–8 years": "6 to 8 years",
  "8+ years / easily refreshed": "8+ years, easily refreshed",
  // Solar reflectance and LEED
  "≥ 0.33 initial": "A third of sunlight reflected (0.33 or more)",
  "≥ 0.33 initial · 12 colours": "A third of sunlight reflected, in 12 colours",
  "V5 SS Credit: Urban Heat Island": "Can contribute to the LEED v5 heat island credit",
  "v5 SS credit: urban heat island (non-roof)": "Can contribute to the LEED v5 heat island credit",
  Optional: "Optional, in the lighter colours",
  // How it goes in
  "Stamping + StreetBond coating": "Stamped, then coloured with StreetBond",
  "Heat-fused": "Heat-applied, bonds to the surface",
  "Heat-fused to asphalt substrate": "Bonded to the asphalt with heat",
  "Zero, flush with road": "Flush with the road",
  "Zero: flush with the road": "Flush with the road",
  "Yes, no shear risk": "Yes: nothing for a blade to catch",
  "Embedded aggregate / non-slip": "Hard aggregate for grip",
  "Embedded aggregate, skid-resistant": "Hard aggregate for grip",
  "Methyl methacrylate (MMA) resin": "Two-part MMA resin (methyl methacrylate)",
  "Integrated glass beads": "Glass beads mixed in: reflects headlights at night",
  "Glass beads through the full cross-section": "Glass beads through the full thickness, reflective as it wears",
  "Vector artwork": "Your vector artwork",
  "63 standard + custom colours": "63 standard colours, plus custom matching",
  "63 standard + custom matching": "63 standard colours, plus custom matching",
  "Recycled and renewable polymer matrix": "Recycled and renewable polymers",
};

/** The value a spec cell prints: plain words where the figure has them, else the value as given. */
export function plainSpec(value: string): string {
  const v = value.trim();
  return PLAIN[v] ?? value;
}

/**
 * The SPECIFY notes on the application spreads, the same way. The book's
 * notes are short; a few lean on a figure or an acronym.
 */
const PLAIN_NOTES: Record<string, string> = {
  "MMA resin: 45–60 minute cure": "MMA resin, traffic-ready in about an hour",
  "LEED compliant SR ≥ 0.33, coatings keep surfaces cooler": "Solar reflective: can contribute to the LEED heat island credit, cooler underfoot",
  "Methyl methacrylate with corundum or sand": "MMA resin with hard aggregate for grip",
};

export function plainNote(note: string): string {
  return PLAIN_NOTES[note.trim()] ?? note;
}
