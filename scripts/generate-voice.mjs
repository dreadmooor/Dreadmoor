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

// نگاشت نقش‌ها به صداهای انتخاب‌شده در داشبورد ElevenLabs
const VOICE_ROLES = {
  narrator: {
    nameKeywords: ['meisam'],
    fallbackId: 'onwK4e9ZLuTAKqWW03F9',
    envKey: 'ELEVENLABS_MEISAM_VOICE_ID',
    settings: { stability: 0.65, similarity_boost: 0.78, style: 0.12, use_speaker_boost: true },
  },
  old_man: {
    nameKeywords: ['mohsen'],
    fallbackId: 'pqHfZKP75CvOlQylNhV4',
    envKey: 'ELEVENLABS_MOHSEN_VOICE_ID',
    settings: { stability: 0.7, similarity_boost: 0.82, style: 0.25, use_speaker_boost: true },
  },
  woman: {
    nameKeywords: ['leili'],
    fallbackId: 'Xb7hH8MSUJpSbSDYk0k2',
    envKey: 'ELEVENLABS_LEILI_VOICE_ID',
    settings: { stability: 0.55, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
  },
  young_man: {
    nameKeywords: ['amin'],
    fallbackId: 'TX3LPaxmHKxFdv7VOQHJ',
    envKey: 'ELEVENLABS_AMIN_VOICE_ID',
    settings: { stability: 0.58, similarity_boost: 0.78, style: 0.2, use_speaker_boost: true },
  },
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

async function resolveVoices() {
  const resolved = {};
  let accountVoices = [];

  try {
    const res = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': API_KEY },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.voices)) {
        accountVoices = data.voices;
      }
    }
  } catch {
    // در صورت عدم دسترسی به لیست صداها، از شناسه پیش‌فرض استفاده می‌شود
  }

  for (const [role, cfg] of Object.entries(VOICE_ROLES)) {
    const envOverride = process.env[cfg.envKey];
    if (envOverride) {
      resolved[role] = { id: envOverride, name: `${role} (env)`, settings: cfg.settings };
      continue;
    }

    const matched = accountVoices.find((v) => {
      const n = String(v?.name || '').toLowerCase();
      return cfg.nameKeywords.some((kw) => n.includes(kw));
    });

    if (matched?.voice_id) {
      resolved[role] = { id: matched.voice_id, name: matched.name, settings: cfg.settings };
    } else {
      resolved[role] = { id: cfg.fallbackId, name: `${role} (default)`, settings: cfg.settings };
    }
  }

  return resolved;
}

async function generateClip(clip, voiceMap) {
  const voice = voiceMap[clip.role];
  console.log(`🎙️ Generating ${clip.id}.mp3 [role: ${clip.role}, voice: ${voice.name} (${voice.id})]...`);

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.id}`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text: clip.text,
      model_id: MODEL_ID,
      voice_settings: voice.settings,
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
  const voiceMap = await resolveVoices();
  for (const clip of CLIPS) {
    await generateClip(clip, voiceMap);
  }
  console.log('🎉 All voiceovers generated successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
