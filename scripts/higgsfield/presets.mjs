// Environment presets. Each environment is generated ONCE as a "master" composition with a
// neutral placeholder stone; every material is then an edit of that same master, so
// architecture, camera and light stay equivalent between stones.

export const MODEL = "marketing-studio/image/flare";
export const OUTPUT = { resolution: "2k", aspect_ratio: "3:2", quality: "high" };

const PHOTOGRAPHY =
  "Professional architectural interior photograph for a high-end residential design magazine, shot on a full-frame camera on a tripod with a tilt-shift lens: two-point perspective, perfectly vertical lines, natural exposure with soft highlight roll-off, true-to-life white balance, subtle natural grain. Physically plausible materials, correct real-world proportions, believable contact shadows and bounce light. Calm, uncluttered styling with only a few purposeful objects. It must look like a real photograph of a real house, not a 3D render: no CGI gloss, no HDR look, no oversaturation, no glowing edges, no perfectly symmetrical staging. No people, no text, no logos, no watermarks, no borders.";

const PLACEHOLDER =
  "IMPORTANT: every stone surface listed above is a temporary placeholder made of plain, uniform, matte medium-grey stone with NO veins, NO speckles and NO pattern, so it can be replaced later. Every other material is final.";

export const environments = {
  cozinha: {
    name: "Cozinha",
    label: "kitchen",
    surfaces:
      "the kitchen island top, both island waterfall ends down to the floor, the back wall countertop and the full-height backsplash between that countertop and the upper cabinets",
    scale:
      "the island is 3.0 m long and 1.1 m deep with a 4 cm thick top; mineral grains and features must keep their real size relative to it",
    edge: "4 cm straight mitred",
    seams: "the backsplash is one continuous slab; the island top and waterfall ends wrap continuously at the mitred corners",
    keep:
      "the wood cabinetry, microcement floor, white ceiling and glass doors",
    scene:
      "A contemporary high-end kitchen in a modern Brazilian house. Camera: 24 mm tilt-shift lens at 1.35 m height, three-quarter view from the dining side. Centre of the frame: a 3.0 m by 1.1 m kitchen island with a 4 cm thick stone top and stone waterfall ends to the floor, one undermount sink with a slim brushed stainless steel faucet. Behind it, the full back wall: handleless base and upper cabinets in natural freijó wood veneer, a 4 cm stone countertop with a flush induction cooktop, a full-height stone backsplash between countertop and upper cabinets, a concealed range hood. Right side: floor-to-ceiling slim black steel glass doors opening to a green garden; clear morning sun enters at a low angle and draws soft window shadows across the floor and island. Floor: large-format warm light-grey microcement. White ceiling with recessed linear lights switched off. Two slim wooden stools with leather seats on the far side of the island. Styling: one handmade ceramic bowl with lemons, a wooden cutting board, a single olive branch in a clear glass vase.",
  },
  banheiro: {
    name: "Banheiro",
    label: "bathroom",
    surfaces:
      "the vanity countertop and the floor-to-ceiling wall cladding directly behind the vanity",
    scale:
      "the vanity is 2.2 m wide and 55 cm deep with a 3 cm top; the cladding slabs are 1.2 m wide; mineral grains and features must keep their real size",
    edge: "3 cm straight",
    seams: "the wall cladding is made of large slabs with thin, barely visible vertical joints",
    keep:
      "the whole walk-in shower (its walls, its niche and its floor stay light-grey porcelain), the bathroom floor, the ceiling, the mirror frame and the oak drawers",
    scene:
      "A contemporary master bathroom in a modern Brazilian house. Camera: 28 mm tilt-shift lens at 1.3 m height, frontal-oblique view. A 2.2 m wall-hung vanity with a 3 cm stone countertop, two undermount white ceramic basins and wall-mounted brushed nickel faucets; slim drawers below in pale oak. The wall behind the vanity is clad floor to ceiling in large stone slabs. Above the vanity: a wide frameless mirror with a hidden warm LED strip above it, switched off. Left: walk-in shower behind a frameless clear glass panel, with light-grey large-format porcelain floor and walls. Light: soft, diffuse overcast daylight from a high horizontal clerestory window on the right, gentle gradients, quiet atmosphere. Styling: two folded white linen towels on the countertop, a small ceramic soap dish, a eucalyptus sprig in a narrow ceramic vase.",
  },
  lavabo: {
    name: "Lavabo",
    label: "powder room",
    surfaces:
      "the sculpted monolithic washbasin block and the entire wall cladding directly behind it, from the washbasin all the way up to the ceiling",
    scale:
      "the washbasin block is 1.0 m wide, 45 cm deep and 25 cm tall; mineral grains and features must keep their real size",
    edge: "crisp, slightly eased",
    seams: "the washbasin is carved from one single block; the wall cladding is one continuous slab",
    keep:
      "the dark-grey lime plaster side walls, the window reveal, the dark recess under the washbasin, the oak floor and the mirror",
    scene:
      "An intimate, sophisticated powder room (lavabo) in a modern Brazilian house. Camera: 35 mm tilt-shift lens at 1.25 m height, close frontal-oblique view. A sculpted monolithic stone washbasin block, 1.0 m wide, 45 cm deep and 25 cm tall, with a carved gently sloping basin and a hidden slot drain, cantilevered from the wall; a wall-mounted aged-brass spout above it. The wall behind it is clad in the same stone. Side walls in warm dark-grey lime plaster with a soft hand-trowelled texture. An oval mirror with a thin brass frame, a single brass wall sconce casting a warm pool of light, and soft cool daylight from a narrow vertical window on the left; low-key, moody but clearly readable exposure. Floor: smoked dark oak boards. Styling: one linen hand towel on a brass ring, one small dark ceramic vessel.",
  },
  gourmet: {
    name: "Área gourmet",
    label: "outdoor gourmet area",
    surfaces:
      "the long barbecue countertop and the island top with its side panels",
    scale:
      "the countertop is 3.2 m long and 65 cm deep, the island 2.6 m long, both with 4 cm tops; mineral grains and features must keep their real size",
    edge: "4 cm straight mitred",
    seams: "the island top wraps continuously into its side panels at the mitred corners",
    keep:
      "the terracotta brick wall, which stays brick all the way down to the countertop with NO stone backsplash, the barbecue and its hood exactly as they are (the inside of the barbecue stays stainless steel), the cumaru slat cabinets, the ceiling and the floor",
    scene:
      "A covered outdoor gourmet terrace (área gourmet) of a contemporary Brazilian country house. Camera: 24 mm tilt-shift lens at 1.4 m height, three-quarter view. Back wall: a 3.2 m stone countertop with a built-in barbecue grill (churrasqueira) under a dark blackened-steel hood, an undermount sink, base cabinets in vertical cumaru wood slats; the wall around the grill is in handmade light terracotta brick. Foreground: a 2.6 m island with stone top and stone side panels, used as a bar with three wooden stools. Ceiling: exposed concrete slab with wooden beams. One side fully open to a lush tropical garden and the edge of a pool. Light: late-afternoon warm sun raking from the left, soft and not orange, long gentle shadows, open shade inside. Floor: large-format light warm-grey porcelain. Styling: a wooden board, two glasses, a ceramic pitcher, a potted plant near the opening.",
  },
};

export function masterPrompt(environmentId) {
  const env = environments[environmentId];
  return `${env.scene} Stone surfaces: ${env.surfaces}. ${PLACEHOLDER} ${PHOTOGRAPHY}`;
}

/**
 * @param {string} environmentId
 * @param {{ name: string, category: string, description: string, finish: string }} reference
 */
// How the close-up reference maps to full-size surfaces, by kind of stone pattern.
const SCALE = {
  granular:
    "Image 2 shows only a small close-up, roughly 30 cm wide, of the slab: on these much larger surfaces the same grains must look proportionally smaller and more numerous, a fine even speckle when seen from the camera, never large blots, splashes or terrazzo-like chips.",
  veined:
    "Image 2 shows only a small close-up, roughly 30 cm wide, of the slab: on these much larger surfaces the veins and bands continue at real scale as long, natural, gently flowing lines across each whole slab, matched where slabs meet; never repeat, tile or enlarge the close-up.",
  mottled:
    "Image 2 shows only a small close-up, roughly 30 cm wide, of the slab: on these much larger surfaces the same cloudy patches and fissures keep their real size and continue naturally and randomly across each slab; never repeat, tile or enlarge the close-up.",
};

export function materialPrompt(environmentId, reference) {
  const env = environments[environmentId];
  return [
    `Edit image 1. Image 1 is the approved reference photograph of this ${env.label}. Image 2 is a real photograph of the commercial natural stone "${reference.name}" (${reference.category}).`,
    `Task: replace the plain grey placeholder stone ONLY on ${env.surfaces}, with ${reference.name}, so that it looks exactly like the stone in image 2: ${reference.description}`,
    `Scale: ${env.scale}. ${SCALE[reference.pattern ?? "granular"]} Finish: ${reference.finish}, with physically correct reflections and highlights from the existing light. Edges: ${env.edge}, showing the same stone through the thickness. Seams: ${env.seams}.`,
    `Do NOT apply stone anywhere else; these stay exactly as in image 1: ${env.keep}.`,
    "The result must overlay image 1 exactly: identical crop, camera position and field of view; do not zoom, pan, widen, tilt or reframe. Keep EVERYTHING else unchanged: camera position, lens, framing, perspective, architecture, cabinetry, fixtures, objects, plants, light direction, time of day, exposure and colour grading. Do not add, move or remove objects.",
    "Do not turn it into another stone, do not invent veins, patterns or colours that are not in image 2, do not make the pattern look tiled, stretched or repeated.",
    "Output: same landscape 3:2 framing and resolution as image 1, a real architectural photograph. No people or reflections of people, no text, no logos, no watermarks.",
  ].join(" ");
}
