/**
 * Looqz — Shared Image Generation Manifest
 *
 * Single source of truth for all regional marketing imagery. Consumed by
 * both `generateImages.js` (Imagen 4) and `generateImagesNano.js`
 * (Gemini 2.5 Flash Image). Keep UK/ZA pairs' lighting, framing, and mood
 * language **identical** — only the subject description changes — so the
 * region toggle feels deliberate and consistent.
 *
 * Shape per entry:
 *   id        — unique slug, e.g. `categories-uk-hairdressers`
 *   prompt    — generation prompt (include full subject + mood descriptors)
 *   ratio     — '16:9' | '4:3' | '3:4' | '1:1' | '9:16'
 *   dest      — output directory relative to project root
 *   filename  — output filename without extension (compressor handles .webp)
 *   page      — section for --section filter (hero|categories|gallery|services|popular|auth|avatars)
 *   region    — 'uk' | 'za' | 'neutral' for auth
 *
 * Totals: 72 entries
 *   6  hero            (3 uk + 3 za, 9:16)
 *   16 categories      (8 uk + 8 za, 4:3)
 *   12 gallery         (6 uk + 6 za, 1:1)
 *   14 services        (7 uk + 7 za, 3:4)
 *   12 popular         (6 uk + 6 za, 4:3)
 *   6  auth            (3 user + 3 salon, 3:4, neutral)
 *   6  avatars         (3 uk + 3 za, 1:1)
 */

// ---------------------------------------------------------------------------
// Reusable subject descriptors — keep these wording-identical for consistency
// ---------------------------------------------------------------------------

// Subject descriptors — supermodel-level beauty to match Fresha/Treatwell
// aspirational marketing look.  Keep wording identical per subject so UK/ZA
// pairs read as the same kind of shot with different subjects.
const UK_WOMAN = 'stunning British woman with fair skin, fashion supermodel beauty, flawless complexion, high-fashion features, aspirational editorial look';
const UK_MAN = 'handsome British man with fair skin, model-level features, chiselled jawline, editorial fashion look';
const ZA_WOMAN = 'stunning Black South African woman, fashion supermodel beauty, radiant dark skin, flawless complexion, high-fashion features, aspirational editorial look';
const ZA_MAN = 'handsome Black South African man, model-level features, strong jawline, editorial fashion look';

// Shared mood tail appended to most people-shots.
// Three critical additions over the old version:
//   1. "hyper-realistic photorealism" — pushes Imagen away from painterly AI look
//   2. "action instantly readable" — key for literacy-low audiences: the service
//      being performed must be obvious from the image alone
//   3. "cinematic 85mm" — camera framing that matches editorial salon photography
const MOOD_TAIL = 'hyper-realistic photorealism shot on 85mm lens, the beauty service being performed is instantly obvious at a glance, soft diffused studio lighting, shallow depth of field, warm editorial tones, premium salon environment with soft bokeh, ultra high resolution, magazine quality, no text no logos, no watermarks';

// ---------------------------------------------------------------------------
// Destinations
// ---------------------------------------------------------------------------

const DEST = {
  fallback:    'looqz_web/src/assets/generated/fallback',
  hero:        'looqz_web/src/assets/generated/hero',
  catUk:       'looqz_web/src/assets/generated/categories/uk',
  catZa:       'looqz_web/src/assets/generated/categories/za',
  galUk:       'looqz_web/src/assets/generated/gallery/uk',
  galZa:       'looqz_web/src/assets/generated/gallery/za',
  svcUk:       'looqz_web/src/assets/generated/services/uk',
  svcZa:       'looqz_web/src/assets/generated/services/za',
  popUk:       'looqz_web/src/assets/generated/popular/uk',
  popZa:       'looqz_web/src/assets/generated/popular/za',
  auth:        'looqz_web/src/assets/generated/auth',
  role:        'looqz_web/src/assets/generated/role',
  partner:     'looqz_web/src/assets/generated/partner',
  avUk:        'looqz_web/src/assets/generated/avatars/uk',
  avZa:        'looqz_web/src/assets/generated/avatars/za',
};

// ---------------------------------------------------------------------------
// Hero marquee (3 UK + 3 ZA, 9:16 tall)
// ---------------------------------------------------------------------------

const HERO = [
  {
    id: 'hero-uk-marquee-1',
    prompt: `Stunning editorial beauty photography: close-up of a ${UK_WOMAN} with flawless glowing skin receiving a luxury facial treatment, ${MOOD_TAIL}`,
    ratio: '9:16', dest: DEST.hero, filename: 'marquee-1.uk', page: 'hero', region: 'uk',
  },
  {
    id: 'hero-uk-marquee-2',
    prompt: `Premium beauty salon editorial: skilled hairstylist creating an elegant blowout on a ${UK_WOMAN}, mirrors and soft reflections in background, ${MOOD_TAIL}`,
    ratio: '9:16', dest: DEST.hero, filename: 'marquee-2.uk', page: 'hero', region: 'uk',
  },
  {
    id: 'hero-uk-marquee-3',
    prompt: `Luxury nail art photography: hands of a ${UK_WOMAN} with immaculate gel manicure in soft pink and gold, elegant spa setting with orchids, ${MOOD_TAIL}`,
    ratio: '9:16', dest: DEST.hero, filename: 'marquee-3.uk', page: 'hero', region: 'uk',
  },
  {
    id: 'hero-za-marquee-1',
    prompt: `Stunning editorial beauty photography: close-up of a ${ZA_WOMAN} with flawless glowing skin receiving a luxury facial treatment, ${MOOD_TAIL}`,
    ratio: '9:16', dest: DEST.hero, filename: 'marquee-1.za', page: 'hero', region: 'za',
  },
  {
    id: 'hero-za-marquee-2',
    prompt: `Premium beauty salon editorial: skilled hairstylist creating an elegant braided updo on a ${ZA_WOMAN}, mirrors and soft reflections in background, ${MOOD_TAIL}`,
    ratio: '9:16', dest: DEST.hero, filename: 'marquee-2.za', page: 'hero', region: 'za',
  },
  {
    id: 'hero-za-marquee-3',
    prompt: `Luxury nail art photography: hands of a ${ZA_WOMAN} with immaculate gel manicure in soft pink and gold, elegant spa setting with orchids, ${MOOD_TAIL}`,
    ratio: '9:16', dest: DEST.hero, filename: 'marquee-3.za', page: 'hero', region: 'za',
  },
];

// ---------------------------------------------------------------------------
// Browse categories (8 UK + 8 ZA, 4:3)
// UK slugs: hairdressers, barbers, nails, massage, beauty, makeup, lashes, spa
// ZA slugs: braids, afro-hair, barber-fades, cornrows, locs, extensions, beauty, nails
// ---------------------------------------------------------------------------

// Literacy-low audience: every category card must convey its service from the
// image alone. Each prompt calls out the specific tool + visible action so the
// subject pose is unambiguous (scissors mid-cut, polish brush mid-stroke, etc).
const CAT_MOOD = 'hyper-realistic photorealism shot on 85mm lens, the beauty service being performed is instantly obvious at a glance without any text, soft diffused salon lighting, warm editorial tones, shallow depth of field, premium salon environment, ultra high resolution, magazine quality, no text no logos, no watermarks';

const CATEGORIES = [
  // --- UK ---
  { id: 'categories-uk-hairdressers',
    prompt: `A professional hairdresser actively styling a ${UK_WOMAN}'s long hair, the stylist's hands clearly holding a round brush and blow dryer mid-blowout, visible strand of hair lifted, bright modern salon chair with mirrors behind, ${CAT_MOOD}`,
    ratio: '4:3', dest: DEST.catUk, filename: 'hairdressers', page: 'categories', region: 'uk' },
  { id: 'categories-uk-barbers',
    prompt: `A skilled barber actively cutting hair — scissors clearly visible in the barber's hand mid-cut right next to the head of a ${UK_MAN} seated in a classic barber chair, black cape around the client, fresh cut hair falling, classic modern barbershop with mirrors, ${CAT_MOOD}`,
    ratio: '4:3', dest: DEST.catUk, filename: 'barbers', page: 'categories', region: 'uk' },
  { id: 'categories-uk-nails',
    prompt: `Hyper-realistic editorial close-up of a ${UK_WOMAN}'s hands proudly showing off freshly finished intricate nail art — long almond-shaped nails featuring detailed hand-painted floral and abstract designs in pastel pinks, whites and gold foil accents, tiny rhinestones and chrome details catching light, flawless glossy top coat, fingers fanned out elegantly, hands the hero of the frame, luxurious nail studio softly blurred in background, ${CAT_MOOD}`,
    ratio: '4:3', dest: DEST.catUk, filename: 'nails', page: 'categories', region: 'uk' },
  { id: 'categories-uk-massage',
    prompt: `A therapist actively performing a back massage — two hands clearly kneading the back of a ${UK_WOMAN} lying face-down on a spa table draped with white linen, warm oils and candles in background, ${CAT_MOOD}`,
    ratio: '4:3', dest: DEST.catUk, filename: 'massage', page: 'categories', region: 'uk' },
  { id: 'categories-uk-beauty',
    prompt: `A beauty therapist actively performing a facial — gloved fingertips clearly massaging cream into the cheek of a ${UK_WOMAN} lying on a treatment bed with a white headband, serum bottles visible, clean modern beauty room, ${CAT_MOOD}`,
    ratio: '4:3', dest: DEST.catUk, filename: 'beauty', page: 'categories', region: 'uk' },
  { id: 'categories-uk-makeup',
    prompt: `A makeup artist actively applying makeup — brush clearly held mid-stroke against the cheekbone of a ${UK_WOMAN} seated at a vanity, palette of shadows visible, studio lights around the mirror, ${CAT_MOOD}`,
    ratio: '4:3', dest: DEST.catUk, filename: 'makeup', page: 'categories', region: 'uk' },
  { id: 'categories-uk-lashes',
    prompt: `A lash technician actively applying eyelash extensions — fine tweezers clearly holding a single lash above the closed eye of a ${UK_WOMAN} lying on a treatment bed, lash tray visible, ${CAT_MOOD}`,
    ratio: '4:3', dest: DEST.catUk, filename: 'lashes', page: 'categories', region: 'uk' },
  { id: 'categories-uk-spa',
    prompt: `A ${UK_WOMAN} lying on a spa bed wrapped in white towel with warm stones placed along her spine, candles and orchids around, therapist's hands visible adjusting a stone, tranquil atmosphere, ${CAT_MOOD}`,
    ratio: '4:3', dest: DEST.catUk, filename: 'spa', page: 'categories', region: 'uk' },

  // --- ZA ---
  { id: 'categories-za-braids',
    prompt: `A professional braider actively creating box braids — hands clearly weaving three strands of hair into a long braid for a ${ZA_WOMAN} seated in a salon chair, partially completed braids visible on one side of her head, bright modern salon, ${CAT_MOOD}`,
    ratio: '4:3', dest: DEST.catZa, filename: 'braids', page: 'categories', region: 'za' },
  { id: 'categories-za-afro-hair',
    prompt: `A stylist actively shaping a natural afro — afro pick or comb clearly held in the stylist's hand lifting and shaping the beautiful full afro of a ${ZA_WOMAN}, bright modern salon chair, mirror reflection, ${CAT_MOOD}`,
    ratio: '4:3', dest: DEST.catZa, filename: 'afro-hair', page: 'categories', region: 'za' },
  { id: 'categories-za-barber-fades',
    prompt: `A skilled barber actively cutting a fade — electric clippers clearly held against the temple of a ${ZA_MAN} seated in a classic barber chair, black cape, crisp clean fade taking shape, classic modern barbershop, ${CAT_MOOD}`,
    ratio: '4:3', dest: DEST.catZa, filename: 'barber-fades', page: 'categories', region: 'za' },
  { id: 'categories-za-cornrows',
    prompt: `A braider actively plaiting cornrows — fingers clearly weaving neat straight cornrow lines across the scalp of a ${ZA_WOMAN}, partially completed cornrows visible, bright modern salon, ${CAT_MOOD}`,
    ratio: '4:3', dest: DEST.catZa, filename: 'cornrows', page: 'categories', region: 'za' },
  { id: 'categories-za-locs',
    prompt: `A loctician actively retwisting dreadlocks — fingers clearly twisting the root of a loc on the head of a ${ZA_WOMAN}, beautiful mature shoulder-length locs visible, bright modern salon chair, ${CAT_MOOD}`,
    ratio: '4:3', dest: DEST.catZa, filename: 'locs', page: 'categories', region: 'za' },
  { id: 'categories-za-extensions',
    prompt: `A stylist actively installing hair extensions — hands clearly sewing or clipping a long sleek weft into the hair of a ${ZA_WOMAN} seated in a salon chair, section of natural hair parted, ${CAT_MOOD}`,
    ratio: '4:3', dest: DEST.catZa, filename: 'extensions', page: 'categories', region: 'za' },
  { id: 'categories-za-beauty',
    prompt: `A beauty therapist actively performing a facial — gloved fingertips clearly massaging cream into the cheek of a ${ZA_WOMAN} lying on a treatment bed with a white headband, serum bottles visible, clean modern beauty room, ${CAT_MOOD}`,
    ratio: '4:3', dest: DEST.catZa, filename: 'beauty', page: 'categories', region: 'za' },
  { id: 'categories-za-nails',
    prompt: `Hyper-realistic editorial close-up of a ${ZA_WOMAN}'s hands proudly showing off freshly finished intricate nail art — long almond-shaped nails featuring detailed hand-painted geometric and abstract designs in rich jewel tones with gold foil accents, chrome details and tiny rhinestones catching light, flawless glossy top coat, fingers fanned out elegantly, hands the hero of the frame, luxurious nail studio softly blurred in background, ${CAT_MOOD}`,
    ratio: '4:3', dest: DEST.catZa, filename: 'nails', page: 'categories', region: 'za' },
];

// ---------------------------------------------------------------------------
// Gallery / inspiration (6 UK + 6 ZA, 1:1)
// UK: salon, barber, nails, spa, makeup, lashes
// ZA: braids, cornrows, locs, fade, afro, extensions
// ---------------------------------------------------------------------------

// Gallery / Inspiration tiles — these showcase the *finished look* in hero
// fashion-editorial style (not the action). Think Vogue / Allure cover crops.
const GAL_MOOD = 'hyper-realistic photorealism shot on 85mm lens, high-fashion editorial square composition, soft natural light, warm tones, premium Vogue beauty magazine aesthetic, flawless finish, shallow depth of field, ultra high resolution, no text no logos, no watermarks';

const GALLERY = [
  // --- UK ---
  { id: 'gallery-uk-salon',
    prompt: `High-fashion editorial portrait of a ${UK_WOMAN} showing off a freshly styled glossy blowout, hair bouncy and voluminous, luxurious hair salon background, ${GAL_MOOD}`,
    ratio: '1:1', dest: DEST.galUk, filename: 'salon', page: 'gallery', region: 'uk' },
  { id: 'gallery-uk-barber',
    prompt: `Classic editorial barbershop portrait of a ${UK_MAN} with a freshly executed sharp classic cut and tight fade, confident expression, vintage chair background, ${GAL_MOOD}`,
    ratio: '1:1', dest: DEST.galUk, filename: 'barber', page: 'gallery', region: 'uk' },
  { id: 'gallery-uk-nails',
    prompt: `Hyper-realistic high-fashion editorial close-up of a ${UK_WOMAN}'s hands proudly showcasing stunning intricate nail art — long almond-shaped nails with detailed hand-painted designs, gold foil accents, marble swirls, tiny rhinestones and chrome finishes catching the light, flawless glossy top coat, fingers artistically posed so the nail designs are the clear hero of the frame, soft luxurious salon background, ${GAL_MOOD}`,
    ratio: '1:1', dest: DEST.galUk, filename: 'nails', page: 'gallery', region: 'uk' },
  { id: 'gallery-uk-spa',
    prompt: `Tranquil editorial spa portrait of a ${UK_WOMAN} with a freshly applied creamy white facial mask, eyes closed in relaxation, candles and orchids softly glowing around her, ${GAL_MOOD}`,
    ratio: '1:1', dest: DEST.galUk, filename: 'spa', page: 'gallery', region: 'uk' },
  { id: 'gallery-uk-makeup',
    prompt: `High-fashion editorial beauty portrait of a ${UK_WOMAN} with luminous bridal makeup, soft pink glossy lips, subtle highlighter catching her cheekbones, perfect brows, ${GAL_MOOD}`,
    ratio: '1:1', dest: DEST.galUk, filename: 'makeup', page: 'gallery', region: 'uk' },
  { id: 'gallery-uk-lashes',
    prompt: `Extreme macro editorial close-up of one of a ${UK_WOMAN}'s eyes showing dramatic fluffy volume lash extensions, perfect eye makeup, ${GAL_MOOD}`,
    ratio: '1:1', dest: DEST.galUk, filename: 'lashes', page: 'gallery', region: 'uk' },

  // --- ZA ---
  { id: 'gallery-za-braids',
    prompt: `High-fashion editorial portrait of a ${ZA_WOMAN} showing off freshly installed long box braids, confident strong pose, braids falling elegantly to her shoulders, ${GAL_MOOD}`,
    ratio: '1:1', dest: DEST.galZa, filename: 'braids', page: 'gallery', region: 'za' },
  { id: 'gallery-za-cornrows',
    prompt: `Editorial top-down portrait of a ${ZA_WOMAN} showing off intricate fresh straight-back cornrow patterns on her scalp, neat clean parting lines, ${GAL_MOOD}`,
    ratio: '1:1', dest: DEST.galZa, filename: 'cornrows', page: 'gallery', region: 'za' },
  { id: 'gallery-za-locs',
    prompt: `High-fashion editorial portrait of a ${ZA_WOMAN} with beautiful mature shoulder-length dreadlocks, golden cuffs woven through a few locs, regal confident expression, ${GAL_MOOD}`,
    ratio: '1:1', dest: DEST.galZa, filename: 'locs', page: 'gallery', region: 'za' },
  { id: 'gallery-za-fade',
    prompt: `Classic editorial barbershop portrait of a ${ZA_MAN} with a crisp freshly executed high-top fade haircut, confident expression, ${GAL_MOOD}`,
    ratio: '1:1', dest: DEST.galZa, filename: 'fade', page: 'gallery', region: 'za' },
  { id: 'gallery-za-afro',
    prompt: `High-fashion editorial portrait of a ${ZA_WOMAN} showing off a beautiful full freshly shaped natural afro, confident radiant expression, ${GAL_MOOD}`,
    ratio: '1:1', dest: DEST.galZa, filename: 'afro', page: 'gallery', region: 'za' },
  { id: 'gallery-za-extensions',
    prompt: `High-fashion editorial portrait of a ${ZA_WOMAN} with long sleek glossy straight hair extensions, hair cascading over one shoulder, confident editorial pose, ${GAL_MOOD}`,
    ratio: '1:1', dest: DEST.galZa, filename: 'extensions', page: 'gallery', region: 'za' },
];

// ---------------------------------------------------------------------------
// Services showcase (7 UK + 7 ZA, 3:4)
// Both regions same services: hair-braiding, makeup, weaves-extensions, nails, skincare, lashes, barbering
// ---------------------------------------------------------------------------

const SVC_MOOD = 'tall 3:4 composition, soft diffused studio lighting, warm editorial tones, shallow depth of field, premium salon atmosphere, ultra high resolution, magazine quality, no text no logos';

const SERVICES = [
  // --- UK ---
  { id: 'services-uk-hair-braiding',
    prompt: `Professional stylist weaving decorative braids into a ${UK_WOMAN}'s hair in a premium salon, ${SVC_MOOD}`,
    ratio: '3:4', dest: DEST.svcUk, filename: 'hair-braiding', page: 'services', region: 'uk' },
  { id: 'services-uk-makeup',
    prompt: `Makeup artist finishing a polished evening makeup look on a ${UK_WOMAN} at a vanity, ${SVC_MOOD}`,
    ratio: '3:4', dest: DEST.svcUk, filename: 'makeup', page: 'services', region: 'uk' },
  { id: 'services-uk-weaves-extensions',
    prompt: `Stylist carefully installing long hair extensions for a ${UK_WOMAN} in a premium salon chair, ${SVC_MOOD}`,
    ratio: '3:4', dest: DEST.svcUk, filename: 'weaves-extensions', page: 'services', region: 'uk' },
  { id: 'services-uk-nails',
    prompt: `Close-up of a nail technician perfecting a gel manicure on a ${UK_WOMAN}, ${SVC_MOOD}`,
    ratio: '3:4', dest: DEST.svcUk, filename: 'nails', page: 'services', region: 'uk' },
  { id: 'services-uk-skincare',
    prompt: `Esthetician performing a luxurious skincare facial on a ${UK_WOMAN} in a calm treatment room, ${SVC_MOOD}`,
    ratio: '3:4', dest: DEST.svcUk, filename: 'skincare', page: 'services', region: 'uk' },
  { id: 'services-uk-lashes',
    prompt: `Lash artist applying volume lash extensions to a ${UK_WOMAN} on a treatment bed, ${SVC_MOOD}`,
    ratio: '3:4', dest: DEST.svcUk, filename: 'lashes', page: 'services', region: 'uk' },
  { id: 'services-uk-barbering',
    prompt: `Barber finishing a sharp classic haircut on a ${UK_MAN} in a premium barbershop chair, ${SVC_MOOD}`,
    ratio: '3:4', dest: DEST.svcUk, filename: 'barbering', page: 'services', region: 'uk' },

  // --- ZA ---
  { id: 'services-za-hair-braiding',
    prompt: `Professional stylist weaving long box braids into a ${ZA_WOMAN}'s hair in a premium salon, ${SVC_MOOD}`,
    ratio: '3:4', dest: DEST.svcZa, filename: 'hair-braiding', page: 'services', region: 'za' },
  { id: 'services-za-makeup',
    prompt: `Makeup artist finishing a polished evening makeup look on a ${ZA_WOMAN} at a vanity, ${SVC_MOOD}`,
    ratio: '3:4', dest: DEST.svcZa, filename: 'makeup', page: 'services', region: 'za' },
  { id: 'services-za-weaves-extensions',
    prompt: `Stylist carefully installing long weaves and extensions for a ${ZA_WOMAN} in a premium salon chair, ${SVC_MOOD}`,
    ratio: '3:4', dest: DEST.svcZa, filename: 'weaves-extensions', page: 'services', region: 'za' },
  { id: 'services-za-nails',
    prompt: `Close-up of a nail technician perfecting a gel manicure on a ${ZA_WOMAN}, ${SVC_MOOD}`,
    ratio: '3:4', dest: DEST.svcZa, filename: 'nails', page: 'services', region: 'za' },
  { id: 'services-za-skincare',
    prompt: `Esthetician performing a luxurious skincare facial on a ${ZA_WOMAN} in a calm treatment room, ${SVC_MOOD}`,
    ratio: '3:4', dest: DEST.svcZa, filename: 'skincare', page: 'services', region: 'za' },
  { id: 'services-za-lashes',
    prompt: `Lash artist applying volume lash extensions to a ${ZA_WOMAN} on a treatment bed, ${SVC_MOOD}`,
    ratio: '3:4', dest: DEST.svcZa, filename: 'lashes', page: 'services', region: 'za' },
  { id: 'services-za-barbering',
    prompt: `Barber finishing a sharp fade haircut on a ${ZA_MAN} in a premium barbershop chair, ${SVC_MOOD}`,
    ratio: '3:4', dest: DEST.svcZa, filename: 'barbering', page: 'services', region: 'za' },
];

// ---------------------------------------------------------------------------
// Popular services (6 UK + 6 ZA, 4:3)
// Both regions same: hair, nails, brows, massage, makeup, facials
// ---------------------------------------------------------------------------

const POP_MOOD = 'landscape 4:3 composition, soft diffused studio lighting, warm editorial tones, shallow depth of field, premium salon environment, ultra high resolution, magazine quality, no text no logos';

const POPULAR = [
  // --- UK ---
  { id: 'popular-uk-hair',
    prompt: `Stylist finishing a glossy blowout on a ${UK_WOMAN} in a bright modern salon chair, ${POP_MOOD}`,
    ratio: '4:3', dest: DEST.popUk, filename: 'hair', page: 'popular', region: 'uk' },
  { id: 'popular-uk-nails',
    prompt: `Overhead shot of a ${UK_WOMAN}'s hands receiving a glossy gel manicure, ${POP_MOOD}`,
    ratio: '4:3', dest: DEST.popUk, filename: 'nails', page: 'popular', region: 'uk' },
  { id: 'popular-uk-brows',
    prompt: `Close-up of a brow artist shaping the eyebrows of a ${UK_WOMAN}, ${POP_MOOD}`,
    ratio: '4:3', dest: DEST.popUk, filename: 'brows', page: 'popular', region: 'uk' },
  { id: 'popular-uk-massage',
    prompt: `${UK_WOMAN} receiving a relaxing shoulder massage on a spa table, white linen, ${POP_MOOD}`,
    ratio: '4:3', dest: DEST.popUk, filename: 'massage', page: 'popular', region: 'uk' },
  { id: 'popular-uk-makeup',
    prompt: `Makeup artist blending foundation on a ${UK_WOMAN} seated at a vanity, ${POP_MOOD}`,
    ratio: '4:3', dest: DEST.popUk, filename: 'makeup', page: 'popular', region: 'uk' },
  { id: 'popular-uk-facials',
    prompt: `Esthetician applying a glowing facial treatment to a ${UK_WOMAN} in a calm spa room, ${POP_MOOD}`,
    ratio: '4:3', dest: DEST.popUk, filename: 'facials', page: 'popular', region: 'uk' },

  // --- ZA ---
  { id: 'popular-za-hair',
    prompt: `Stylist finishing a beautiful protective style on a ${ZA_WOMAN} in a bright modern salon chair, ${POP_MOOD}`,
    ratio: '4:3', dest: DEST.popZa, filename: 'hair', page: 'popular', region: 'za' },
  { id: 'popular-za-nails',
    prompt: `Overhead shot of a ${ZA_WOMAN}'s hands receiving a glossy gel manicure, ${POP_MOOD}`,
    ratio: '4:3', dest: DEST.popZa, filename: 'nails', page: 'popular', region: 'za' },
  { id: 'popular-za-brows',
    prompt: `Close-up of a brow artist shaping the eyebrows of a ${ZA_WOMAN}, ${POP_MOOD}`,
    ratio: '4:3', dest: DEST.popZa, filename: 'brows', page: 'popular', region: 'za' },
  { id: 'popular-za-massage',
    prompt: `${ZA_WOMAN} receiving a relaxing shoulder massage on a spa table, white linen, ${POP_MOOD}`,
    ratio: '4:3', dest: DEST.popZa, filename: 'massage', page: 'popular', region: 'za' },
  { id: 'popular-za-makeup',
    prompt: `Makeup artist blending foundation on a ${ZA_WOMAN} seated at a vanity, ${POP_MOOD}`,
    ratio: '4:3', dest: DEST.popZa, filename: 'makeup', page: 'popular', region: 'za' },
  { id: 'popular-za-facials',
    prompt: `Esthetician applying a glowing facial treatment to a ${ZA_WOMAN} in a calm spa room, ${POP_MOOD}`,
    ratio: '4:3', dest: DEST.popZa, filename: 'facials', page: 'popular', region: 'za' },
];

// ---------------------------------------------------------------------------
// Auth panels (12, 3:4, 6 UK + 6 ZA — full-bleed image panel on auth pages)
// ---------------------------------------------------------------------------
// The left-side brand panel on UserAuthPage & SalonAuthPage swaps based on
// the selected region: UK shows British subjects, ZA shows South African.
// Prompts keep wording identical per slot so the pair reads as "same shot,
// different subject" — matches the rest of the manifest's UK/ZA pattern.

const AUTH_MOOD = 'tall 3:4 portrait composition, hyper-realistic photorealism shot on 85mm lens, soft diffused natural light, warm editorial beauty tones, shallow depth of field, aspirational premium atmosphere, ultra high resolution, magazine quality, candid believable real-person look, no text no logos, no watermarks';

const AUTH = [
  // ── Customer (user) panels — UK ───────────────────────────────────────────
  { id: 'auth-user-signup-uk',
    prompt: `Elegant editorial portrait of a ${UK_WOMAN} relaxing in a stylist chair inside a sunlit modern beauty salon after a fresh blowout, genuine warm smile, welcoming atmosphere, ${AUTH_MOOD}`,
    ratio: '3:4', dest: DEST.auth, filename: 'user-signup-uk', page: 'auth', region: 'uk' },
  { id: 'auth-user-signin-uk',
    prompt: `Editorial portrait of a ${UK_WOMAN} with flawless glowing skin leaning into warm salon light, calm and confident expression, ${AUTH_MOOD}`,
    ratio: '3:4', dest: DEST.auth, filename: 'user-signin-uk', page: 'auth', region: 'uk' },
  { id: 'auth-user-forgot-uk',
    prompt: `Quiet editorial portrait of a ${UK_MAN} with neatly styled hair and a trimmed beard gazing softly through a salon window, tranquil pastel tones, reassuring mood, ${AUTH_MOOD}`,
    ratio: '3:4', dest: DEST.auth, filename: 'user-forgot-uk', page: 'auth', region: 'uk' },

  // ── Customer (user) panels — ZA ───────────────────────────────────────────
  { id: 'auth-user-signup-za',
    prompt: `Elegant editorial portrait of a ${ZA_WOMAN} relaxing in a stylist chair inside a sunlit modern beauty salon after a fresh styling session, genuine warm smile, welcoming atmosphere, ${AUTH_MOOD}`,
    ratio: '3:4', dest: DEST.auth, filename: 'user-signup-za', page: 'auth', region: 'za' },
  { id: 'auth-user-signin-za',
    prompt: `Editorial portrait of a ${ZA_WOMAN} with flawless radiant skin leaning into warm salon light, calm and confident expression, ${AUTH_MOOD}`,
    ratio: '3:4', dest: DEST.auth, filename: 'user-signin-za', page: 'auth', region: 'za' },
  { id: 'auth-user-forgot-za',
    prompt: `Quiet editorial portrait of a ${ZA_MAN} with a sharp modern fade haircut and a trimmed beard gazing softly through a salon window, tranquil pastel tones, reassuring mood, ${AUTH_MOOD}`,
    ratio: '3:4', dest: DEST.auth, filename: 'user-forgot-za', page: 'auth', region: 'za' },

  // ── Professional (salon) panels — UK ──────────────────────────────────────
  { id: 'auth-salon-signup-uk',
    prompt: `Confident ${UK_WOMAN} salon owner in chic modern workwear standing proudly in her elegant modern salon with stylists softly out of focus behind her, welcoming atmosphere, ${AUTH_MOOD}`,
    ratio: '3:4', dest: DEST.auth, filename: 'salon-signup-uk', page: 'auth', region: 'uk' },
  { id: 'auth-salon-signin-uk',
    prompt: `Professional ${UK_MAN} barber in a crisp dark apron at his station in a beautiful modern barbershop, tools neatly arranged, calm focused mood, ${AUTH_MOOD}`,
    ratio: '3:4', dest: DEST.auth, filename: 'salon-signin-uk', page: 'auth', region: 'uk' },
  { id: 'auth-salon-forgot-uk',
    prompt: `Editorial portrait of a ${UK_WOMAN} stylist tidying her station in an empty elegant modern salon bathed in soft morning light, reassuring mood, ${AUTH_MOOD}`,
    ratio: '3:4', dest: DEST.auth, filename: 'salon-forgot-uk', page: 'auth', region: 'uk' },

  // ── Professional (salon) panels — ZA ──────────────────────────────────────
  { id: 'auth-salon-signup-za',
    prompt: `Confident ${ZA_WOMAN} salon owner in chic modern workwear standing proudly in her elegant modern salon with stylists softly out of focus behind her, welcoming atmosphere, ${AUTH_MOOD}`,
    ratio: '3:4', dest: DEST.auth, filename: 'salon-signup-za', page: 'auth', region: 'za' },
  { id: 'auth-salon-signin-za',
    prompt: `Professional ${ZA_MAN} barber in a crisp dark apron at his station in a beautiful modern barbershop, tools neatly arranged, calm focused mood, ${AUTH_MOOD}`,
    ratio: '3:4', dest: DEST.auth, filename: 'salon-signin-za', page: 'auth', region: 'za' },
  { id: 'auth-salon-forgot-za',
    prompt: `Editorial portrait of a ${ZA_WOMAN} stylist tidying her station in an empty elegant modern salon bathed in soft morning light, reassuring mood, ${AUTH_MOOD}`,
    ratio: '3:4', dest: DEST.auth, filename: 'salon-forgot-za', page: 'auth', region: 'za' },
];

// ---------------------------------------------------------------------------
// Role picker modal (2 UK + 2 ZA, 4:3 landscape cards)
// ---------------------------------------------------------------------------
// Shown in the navbar Sign in / Get started modal on the landing page.
// Compose subjects so the face sits in the upper-right third — the bottom-left
// corner is overlaid with a "For clients" / "For business" badge chip and
// must remain clear of the face.

const ROLE_MOOD = 'landscape 4:3 composition, subject framed in the upper right third of the frame, generous negative space in the lower-left corner for a small UI badge overlay, face and eyes unobstructed, hyper-realistic photorealism shot on 85mm lens, soft diffused natural light, warm editorial beauty tones, shallow depth of field, aspirational premium atmosphere, ultra high resolution, magazine quality, no text no logos, no watermarks';

const ROLE = [
  // ── UK Customer ─────────────────────────────────────────────────────────
  { id: 'role-customer-uk',
    prompt: `Editorial beauty portrait of a radiant ${UK_WOMAN} relaxing in a luxury salon chair after a fresh blowout, subtle confident smile, warm golden salon lighting, premium spa atmosphere, ${ROLE_MOOD}`,
    ratio: '4:3', dest: DEST.role, filename: 'customer-uk', page: 'role', region: 'uk' },

  // ── UK Professional ─────────────────────────────────────────────────────
  { id: 'role-professional-uk',
    prompt: `Editorial portrait of a ${UK_MAN} professional barber in a crisp dark apron standing proudly at his station in a beautiful modern barbershop, holding tools, focused confident expression, warm salon lighting, ${ROLE_MOOD}`,
    ratio: '4:3', dest: DEST.role, filename: 'professional-uk', page: 'role', region: 'uk' },

  // ── ZA Customer ─────────────────────────────────────────────────────────
  { id: 'role-customer-za',
    prompt: `Editorial beauty portrait of a radiant ${ZA_WOMAN} relaxing in a luxury salon chair with a freshly styled look, subtle confident smile, warm golden salon lighting, premium spa atmosphere, ${ROLE_MOOD}`,
    ratio: '4:3', dest: DEST.role, filename: 'customer-za', page: 'role', region: 'za' },

  // ── ZA Professional ─────────────────────────────────────────────────────
  { id: 'role-professional-za',
    prompt: `Editorial portrait of a confident ${ZA_WOMAN} salon owner in chic modern workwear standing proudly in her elegant modern salon, warm welcoming expression, stylists working softly out of focus behind her, warm golden salon lighting, ${ROLE_MOOD}`,
    ratio: '4:3', dest: DEST.role, filename: 'professional-za', page: 'role', region: 'za' },
];

// ---------------------------------------------------------------------------
// Partner hero (1 UK + 1 ZA, 1:1 square) — distinct subjects from ROLE set
// so the partner marketing page never reuses an existing portrait.
// ---------------------------------------------------------------------------

const PARTNER_MOOD = 'square 1:1 composition, subject naturally centred with balanced negative space on both sides, hyper-realistic photorealism shot on 85mm lens, soft diffused natural window light, warm editorial beauty tones, shallow depth of field f/2.2, aspirational premium salon atmosphere with soft creamy bokeh, ultra high resolution, magazine quality, candid believable real-person look, no text no logos, no watermarks';

const PARTNER = [
  { id: 'partner-hero-uk',
    prompt: `Editorial portrait of a confident ${UK_WOMAN} independent hair stylist smiling warmly in her chic modern salon, wearing an elegant cream apron over minimal modern workwear, holding a small tablet showing a booking calendar, golden-hour salon lighting pouring through large windows, fresh flowers and styling tools softly out of focus behind her, ${PARTNER_MOOD}`,
    ratio: '1:1', dest: DEST.partner, filename: 'hero-uk', page: 'partner', region: 'uk' },

  { id: 'partner-hero-za',
    prompt: `Editorial portrait of a confident ${ZA_MAN} master barber smiling warmly in his upscale modern barbershop, wearing a crisp dark apron over a fitted shirt, arms gently crossed, leather barber chairs and vintage mirrors softly out of focus behind him, warm amber barbershop lighting, ${PARTNER_MOOD}`,
    ratio: '1:1', dest: DEST.partner, filename: 'hero-za', page: 'partner', region: 'za' },
];

// ---------------------------------------------------------------------------
// Social proof avatars (3 UK + 3 ZA, 1:1 headshots)
// ---------------------------------------------------------------------------

const AV_MOOD = 'hyper-realistic photorealism shot on 85mm lens, authentic relatable happy-client vibe, professional friendly headshot, soft natural light, warm editorial tones, shallow depth of field, clean neutral background, ultra high resolution, no text no logos, no watermarks';

const AVATARS = [
  { id: 'avatars-uk-1',
    prompt: `Warm smiling close-up headshot of a ${UK_WOMAN}, ${AV_MOOD}`,
    ratio: '1:1', dest: DEST.avUk, filename: 'avatar-1', page: 'avatars', region: 'uk' },
  { id: 'avatars-uk-2',
    prompt: `Warm smiling close-up headshot of a ${UK_MAN}, ${AV_MOOD}`,
    ratio: '1:1', dest: DEST.avUk, filename: 'avatar-2', page: 'avatars', region: 'uk' },
  { id: 'avatars-uk-3',
    prompt: `Warm confident close-up headshot of a ${UK_WOMAN} with a subtle smile, ${AV_MOOD}`,
    ratio: '1:1', dest: DEST.avUk, filename: 'avatar-3', page: 'avatars', region: 'uk' },
  { id: 'avatars-za-1',
    prompt: `Warm smiling close-up headshot of a ${ZA_WOMAN}, ${AV_MOOD}`,
    ratio: '1:1', dest: DEST.avZa, filename: 'avatar-1', page: 'avatars', region: 'za' },
  { id: 'avatars-za-2',
    prompt: `Warm smiling close-up headshot of a ${ZA_MAN}, ${AV_MOOD}`,
    ratio: '1:1', dest: DEST.avZa, filename: 'avatar-2', page: 'avatars', region: 'za' },
  { id: 'avatars-za-3',
    prompt: `Warm confident close-up headshot of a ${ZA_WOMAN} with a subtle smile, ${AV_MOOD}`,
    ratio: '1:1', dest: DEST.avZa, filename: 'avatar-3', page: 'avatars', region: 'za' },
];

// ---------------------------------------------------------------------------
// Combined export
// ---------------------------------------------------------------------------

const FALLBACK = [
  {
    id: 'fallback-salon-cover',
    prompt: `Luxurious modern beauty salon interior at golden hour, wide 16:9 cinematic establishing shot, elegant styling chairs and vanity mirrors lined along one wall with warm pendant lighting, polished marble and natural wood finishes, lush indoor plants, soft golden daylight streaming through large windows, calm upscale atmosphere, no people, pristine empty salon showcase, hyper-realistic photorealism shot on 35mm wide lens, premium Fresha-style marketing photography, ultra high resolution, magazine quality, no text no logos, no watermarks`,
    ratio: '16:9', dest: DEST.fallback, filename: 'salon-cover', page: 'fallback', region: 'neutral',
  },
];

export const IMAGES = [
  ...FALLBACK,
  ...HERO,
  ...CATEGORIES,
  ...GALLERY,
  ...SERVICES,
  ...POPULAR,
  ...AUTH,
  ...ROLE,
  ...PARTNER,
  ...AVATARS,
];

export const SECTIONS = ['fallback', 'hero', 'categories', 'gallery', 'services', 'popular', 'auth', 'role', 'partner', 'avatars'];
export const REGIONS = ['uk', 'za', 'neutral'];
