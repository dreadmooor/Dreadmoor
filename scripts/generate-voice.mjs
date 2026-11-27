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

// بانک صداهای پیش‌فرض و استاندارد ElevenLabs بر اساس جنسیت و نقش شخصیت‌ها
const VOICES = {
  narrator: {
    id: 'nPczCjzI2devNBz1zQrb', // Brian - راوی مردانه عمیق و داستان‌گو
    settings: { stability: 0.55, similarity_boost: 0.78, style: 0.25, use_speaker_boost: true },
  },
  old_man: {
    id: 'pqHfZKP75CvOlQylNhV4', // Bill - مرد مسن و جدی (مدیر هتل)
    settings: { stability: 0.65, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true },
  },
  woman: {
    id: 'EXAVITQu4vr4xnSDxMaL', // Sarah - زنانه گرم، آرام و مرموز (مادر نوید)
    settings: { stability: 0.45, similarity_boost: 0.82, style: 0.4, use_speaker_boost: true },
  },
  young_man: {
    id: 'TX3LPaxmHKxFdv7VOQHJ', // Liam - مرد جوان (برای دیالوگ‌های آینده نوید)
    settings: { stability: 0.5, similarity_boost: 0.78, style: 0.3, use_speaker_boost: true },
  },
};

const CLIPS = [
  {
    id: 'scene1_narrator',
    role: 'narrator',
    text: 'یک هتل قدیمی قرار است تخریب شود. نوید، عکاس جوان، برای تهیه آخرین تصاویر وارد ساختمان می‌شود.',
  },
  {
    id: 'scene2_narrator',
    role: 'narrator',
    text: 'در راهرو، متوجه دری می‌شود که روی آن نوشته شده: اتاقِ نُه.',
  },
  {
    id: 'scene3_narrator',
    role: 'narrator',
    text: 'مدیر هتل قبلاً به او هشدار داده بود:',
  },
  {
    id: 'scene3_manager',
    role: 'old_man',
    text: 'هر اتاقی خواستی برو، فقط درِ شماره نُه رو باز نکن.',
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
    text: 'این دقیقاً صدای مادرش است؛ مادری که پانزده سال پیش فوت کرده.',
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
    text: 'پایان قسمت اول: مخاطب تصمیم می‌گیرد. نوید باید چه کار کند؟ گزینه‌ی A: در را باز کند. یا گزینه‌ی B: عکس را بردارد و از هتل فرار کند.',
  },
];

async function generateClip(clip: { id: string; role: keyof typeof VOICES; text: string }) {
  const voiceConfig = VOICES[clip.role];
  console.log(`🎙️ Generating ${clip.id}.mp3 [role: ${clip.role}]...`);

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.id}`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY!,
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
  console.log('🎉 All multi-character voiceovers generated successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
