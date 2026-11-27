import fs from 'node:fs';
import path from 'node:path';

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY is missing!');
  process.exit(1);
}

// مدل eleven_v3 دارای پشتیبانی بومی و طبیعی از زبان فارسی است
const MODEL_ID = 'eleven_v3';
const OUTPUT_DIR = path.resolve('public/voice/otagh9');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// تنظیم صداها برای مدل v3 فارسی
const VOICES = {
  narrator: {
    id: 'JBFqnCBsd6RMkjVDRZzb', // George - راوی مردانه عمیق، گرم و داستان‌گو
    settings: { stability: 0.5, similarity_boost: 0.75, style: 0.35, use_speaker_boost: true },
  },
  old_man: {
    id: 'pqHfZKP75CvOlQylNhV4', // Bill - مرد مسن و جدی (مدیر هتل)
    settings: { stability: 0.55, similarity_boost: 0.8, style: 0.45, use_speaker_boost: true },
  },
  woman: {
    id: 'XrExE9yKIg1WjnnlVkGX', // Matilda - زنانه گرم، احساسی و مرموز (مادر نوید)
    settings: { stability: 0.45, similarity_boost: 0.8, style: 0.45, use_speaker_boost: true },
  },
  young_man: {
    id: 'TX3LPaxmHKxFdv7VOQHJ', // Liam - مرد جوان (برای دیالوگ‌های نوید)
    settings: { stability: 0.5, similarity_boost: 0.75, style: 0.35, use_speaker_boost: true },
  },
};

// متن‌ها با اعراب‌گذاری دقیق برای تلفظ طبیعی و بدون لهجه در فارسی
const CLIPS = [
  {
    id: 'scene1_narrator',
    role: 'narrator',
    text: 'یک هُتِلِ قَدیمی قَرار اَست تَخریب شَوَد. نَوید، عَکّاسِ جَوان، بَرایِ تَهیّه‌یِ آخَرین تَصاویر وارِدِ ساختِمان می‌شَوَد.',
  },
  {
    id: 'scene2_narrator',
    role: 'narrator',
    text: 'دَر راهرو، مُتِوَجّهِ دَری می‌شَوَد که رویِ آن نِوِشته شُده: اُتاقِ نُه.',
  },
  {
    id: 'scene3_narrator',
    role: 'narrator',
    text: 'مُدیرِ هُتِل قَبلاً به او هُشدار داده بود:',
  },
  {
    id: 'scene3_manager',
    role: 'old_man',
    text: 'هَر اُتاقی خواستی بِرو، فَقَط دَرِ شُماره‌یِ نُه رو باز نَکُن.',
  },
  {
    id: 'scene4_narrator1',
    role: 'narrator',
    text: 'صِدایِ زَنی اَز داخِل می‌گویَد:',
  },
  {
    id: 'scene4_mother',
    role: 'woman',
    text: 'نَوید... بِلاخَره بَرگَشتی.',
  },
  {
    id: 'scene4_narrator2',
    role: 'narrator',
    text: 'این دَقیقاً صِدایِ مادَرَش اَست؛ مادَری که پانزدَه سالِ پیش فوت کَرده.',
  },
  {
    id: 'scene5_narrator',
    role: 'narrator',
    text: 'اَز زیرِ دَر، یک عَکسِ قَدیمی بیرون می‌خَزَد. عَکسِ کودَکیِ خودَش اَست؛ کِنارِ زَنی که نَبایَد زِنده باشَد.',
  },
  {
    id: 'scene6_narrator',
    role: 'narrator',
    text: 'دَستگیره‌یِ دَر شُروع به چَرخیدَن می‌کُنَد...',
  },
  {
    id: 'scene7_narrator',
    role: 'narrator',
    text: 'پایانِ قِسمَتِ اَوّل: مُخاطَب تَصمیم می‌گیرَد. نَوید بایَد چِه کار کُنَد؟ گُزینه‌یِ اِی: دَر را باز کُنَد. یا گُزینه‌یِ بی: عَکس را بَردارَد و اَز هُتِل فِرار کُنَد.',
  },
];

async function generateClip(clip) {
  const voiceConfig = VOICES[clip.role];
  console.log(`🎙️ Generating ${clip.id}.mp3 [role: ${clip.role}, model: ${MODEL_ID}]...`);

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.id}`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text: clip.text,
      model_id: MODEL_ID,
      voice_settings: voiceConfig.settings,
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
  for (const clip of CLIPS) {
    await generateClip(clip);
  }
  console.log('🎉 All Persian v3 voiceovers generated successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
