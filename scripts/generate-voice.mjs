import fs from 'node:fs';
import path from 'node:path';

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY is missing!');
  process.exit(1);
}

const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_DIR = path.resolve('public/voice/otagh9');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// کلمات کلیدی فارسی و اسامی ایرانی برای شناسایی صداهای فارسی
const PERSIAN_NAME_KEYWORDS = [
  'persian',
  'iran',
  'farsi',
  'meisam',
  'mohsen',
  'leili',
  'amin',
  'amir',
  'ali',
  'reza',
  'hossein',
  'sara',
  'nima',
  'kian',
  'parisa',
  'nazanin',
  'maryam',
  'mahdi',
  'behzad',
  'farhad',
  'hamed',
  'omid',
  'pouya',
  'sina',
  'soheil',
  'soroush',
  'tarane',
  'taraneh',
  'yasamin',
  'zahra',
  'arash',
  'arman',
  'babak',
  'dariush',
  'ebrahim',
  'esmail',
  'fatemeh',
  'ghazal',
  'hassan',
  'iman',
  'javad',
  'kamran',
  'karim',
  'kaveh',
  'kiarash',
  'mehrdad',
  'milad',
  'mohammad',
  'morteza',
  'navid',
  'neda',
  'nikoo',
  'parsa',
  'payam',
  'pedram',
  'ramin',
  'roham',
  'saeed',
  'sam',
  'saman',
  'sasan',
  'sepideh',
  'shahin',
  'shahram',
  'shayan',
  'siavash',
  'vahid',
  'yaser',
];

const FEMALE_HINTS = [
  'leili',
  'sara',
  'parisa',
  'nazanin',
  'maryam',
  'tarane',
  'taraneh',
  'yasamin',
  'zahra',
  'fatemeh',
  'ghazal',
  'neda',
  'nikoo',
  'sepideh',
  'female',
  'woman',
  'girl',
  'lady',
];

const OLD_HINTS = ['old', 'elder', 'senior', 'grandfather', 'grandpa', 'mohsen', 'dariush', 'ebrahim'];

const ROLE_SETTINGS = {
  narrator: { stability: 0.65, similarity_boost: 0.78, style: 0.12, use_speaker_boost: true },
  old_man: { stability: 0.7, similarity_boost: 0.82, style: 0.25, use_speaker_boost: true },
  woman: { stability: 0.55, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
  young_man: { stability: 0.58, similarity_boost: 0.78, style: 0.2, use_speaker_boost: true },
};

// متن دقیق و کامل داستان «اتاق ۹»
const CLIPS = [
  {
    id: 'scene1_narrator',
    role: 'narrator',
    text: 'یک هتل قدیمی قرار است تخریب شود. نوید، عکاس جوان، برای تهیه آخرین تصاویر وارد ساختمان می‌شود.',
  },
  {
    id: 'scene2_narrator',
    role: 'narrator',
    text: 'در راهرو، متوجه دری می‌شود که روی آن نوشته شده: اتاق ۹.',
  },
  {
    id: 'scene3_narrator',
    role: 'narrator',
    text: 'مدیر هتل قبلاً به او هشدار داده بود:',
  },
  {
    id: 'scene3_manager',
    role: 'old_man',
    text: 'هر اتاقی خواستی برو، فقط درِ شماره ۹ رو باز نکن.',
  },
  {
    id: 'scene4_narrator1',
    role: 'narrator',
    text: 'صدای زنی از داخل می‌گوید:',
  },
  {
    id: 'scene4_mother',
    role: 'woman',
    text: 'نوید... بالاخره برگشتی.',
  },
  {
    id: 'scene4_narrator2',
    role: 'narrator',
    text: 'این دقیقاً صدای مادرش است؛ مادری که ۱۵ سال پیش فوت کرده.',
  },
  {
    id: 'scene5_narrator',
    role: 'narrator',
    text: 'از زیر در، یک عکس قدیمی بیرون می‌خزد. عکس کودکی خودش است؛ کنار زنی که نباید زنده باشد.',
  },
  {
    id: 'scene6_narrator',
    role: 'narrator',
    text: 'دستگیره در شروع به چرخیدن می‌کند...',
  },
  {
    id: 'scene7_narrator',
    role: 'narrator',
    text: 'پایان قسمت اول، مخاطب تصمیم می‌گیرد. نوید باید چه کار کند؟ گزینه A: در را باز کند. یا گزینه B: عکس را بردارد و از هتل فرار کند.',
  },
];

function isPersianVoice(voice) {
  const name = String(voice?.name || '').toLowerCase();
  const labels = voice?.labels ? JSON.stringify(voice.labels).toLowerCase() : '';
  const combined = `${name} ${labels}`;
  return PERSIAN_NAME_KEYWORDS.some((kw) => combined.includes(kw));
}

function pickBestVoice(candidates, predicate) {
  const filtered = candidates.filter(predicate);
  return filtered[0] || candidates[0];
}

async function discoverPersianVoices() {
  const res = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': API_KEY },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch voices: ${res.status} - ${await res.text()}`);
  }

  const data = await res.json();
  const allVoices = Array.isArray(data?.voices) ? data.voices : [];
  const persianVoices = allVoices.filter(isPersianVoice);

  if (persianVoices.length === 0) {
    throw new Error('❌ هیچ صدای فارسی در دسترس پیدا نشد؛ تولید صدا متوقف شد.');
  }

  console.log(
    `🇮🇷 Persian voices found: ${persianVoices.map((v) => `${v.name} [${v.category || 'unknown'}: ${v.voice_id}]`).join(', ')}`
  );

  const narratorVoice = pickBestVoice(persianVoices, (v) => {
    const s = `${v.name} ${JSON.stringify(v.labels || {})}`.toLowerCase();
    return !FEMALE_HINTS.some((h) => s.includes(h));
  });

  const womanVoice = pickBestVoice(persianVoices, (v) => {
    const s = `${v.name} ${JSON.stringify(v.labels || {})}`.toLowerCase();
    return FEMALE_HINTS.some((h) => s.includes(h));
  });

  const oldManVoice = pickBestVoice(persianVoices, (v) => {
    const s = `${v.name} ${JSON.stringify(v.labels || {})}`.toLowerCase();
    return OLD_HINTS.some((h) => s.includes(h)) && !FEMALE_HINTS.some((h) => s.includes(h));
  });

  const youngManVoice = pickBestVoice(
    persianVoices,
    (v) => v.voice_id !== narratorVoice.voice_id && v.voice_id !== oldManVoice.voice_id
  );

  return {
    narrator: { voice: narratorVoice, settings: ROLE_SETTINGS.narrator },
    old_man: { voice: oldManVoice, settings: ROLE_SETTINGS.old_man },
    woman: { voice: womanVoice, settings: ROLE_SETTINGS.woman },
    young_man: { voice: youngManVoice, settings: ROLE_SETTINGS.young_man },
  };
}

async function generateClip(clip, voiceMap) {
  const entry = voiceMap[clip.role];
  const voiceId = entry.voice.voice_id;
  const voiceName = entry.voice.name;

  console.log(`🎙️ Generating ${clip.id}.mp3 [role: ${clip.role}, voice: ${voiceName} (${voiceId})]...`);

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text: clip.text,
      model_id: MODEL_ID,
      voice_settings: entry.settings,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed for ${clip.id}: ${res.status} - ${errText}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const outPath = path.join(OUTPUT_DIR, `${clip.id}.mp3`);
  fs.writeFileSync(outPath, buffer);
  console.log(`✅ Saved ${outPath}`);
}

async function main() {
  const voiceMap = await discoverPersianVoices();
  for (const clip of CLIPS) {
    await generateClip(clip, voiceMap);
  }
  console.log('🎉 All Persian voiceovers generated successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
