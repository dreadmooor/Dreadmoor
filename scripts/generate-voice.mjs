import fs from 'node:fs';
import path from 'node:path';

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY is missing!');
  process.exit(1);
}

// صدای مردانه عمیق و راوی‌گونه (Brian - سازگار با مدل چندزبانه فارسی)
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'nPczCjzI2devNBz1zQrb';
const MODEL_ID = 'eleven_multilingual_v2';

const OUTPUT_DIR = path.resolve('public/voice/otagh9');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const SCENES = [
  {
    id: 'scene1',
    text: 'یک هتل قدیمی قرار است تخریب شود. نوید، عکاس جوان، برای تهیه آخرین تصاویر وارد ساختمان می‌شود.',
  },
  {
    id: 'scene2',
    text: 'در راهرو، متوجه دری می‌شود که روی آن نوشته شده: اتاقِ نُه.',
  },
  {
    id: 'scene3',
    text: 'مدیر هتل قبلاً به او هشدار داده بود: هر اتاقی خواستی برو، فقط درِ شماره نُه رو باز نکن.',
  },
  {
    id: 'scene4',
    text: 'صدای زنی از داخل می‌گوید: نوید... بالاخره برگشتی. این دقیقاً صدای مادرش است؛ مادری که پانزده سال پیش فوت کرده.',
  },
  {
    id: 'scene5',
    text: 'از زیر در، یک عکس قدیمی بیرون می‌خزد. عکس کودکی خودش است؛ کنار زنی که نباید زنده باشد.',
  },
  {
    id: 'scene6',
    text: 'دستگیره در شروع به چرخیدن می‌کند...',
  },
  {
    id: 'scene7',
    text: 'پایان قسمت اول: مخاطب تصمیم می‌گیرد. نوید باید چه کار کند؟ گزینه‌ی A: در را باز کند. یا گزینه‌ی B: عکس را بردارد و از هتل فرار کند.',
  },
];

async function generateVoice(scene: { id: string; text: string }) {
  console.log(`🎙️ Generating ${scene.id}.mp3...`);
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY!,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text: scene.text,
      model_id: MODEL_ID,
      voice_settings: {
        stability: 0.55,
        similarity_boost: 0.78,
        style: 0.25,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed for ${scene.id}: ${res.status} - ${errText}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const outPath = path.join(OUTPUT_DIR, `${scene.id}.mp3`);
  fs.writeFileSync(outPath, buffer);
  console.log(`✅ Saved ${outPath}`);
}

async function main() {
  for (const scene of SCENES) {
    await generateVoice(scene);
  }
  console.log('🎉 All voiceovers generated successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
