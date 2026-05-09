# Backend Requirements for UI Redesign

## Required API Response Format

Your backend must return the following data structure for chapters and verses:

### GET /api/chapters

```json
{
  "data": [
    {
      "id": 1,
      "number": 1,
      "name": "Al Fatihah",
      "name_arabic": "الفاتحة",
      "meaning_en": "The Opener",
      "verses_count": 7,
      "type": "meccan"
    },
    ...
  ]
}
```

### GET /api/chapters/{id}

```json
{
  "data": {
    "id": 1,
    "number": 1,
    "name": "Al Fatihah",
    "name_arabic": "الفاتحة",
    "meaning_en": "The Opener",
    "verses_count": 7,
    "type": "meccan",
    "verses": [
      {
        "number": 1,
        "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        "translation": "In the name of Allah, the Entirely Merciful, the Especially Merciful."
      },
      ...
    ],
    "audioUrls": {
      "1": "https://example.com/audio/1.mp3",
      "2": "https://example.com/audio/2.mp3",
      ...
    }
  }
}
```

## Key Fields Required

### Chapter Object
- `id` (number) - Unique identifier
- `number` (number) - Surah number (1-114)
- `name` (string) - English name
- `name_arabic` (string) - Arabic name **NEW**
- `meaning_en` (string) - English meaning **NEW**
- `verses_count` (number) - Total verses **NEW**
- `type` (string) - "meccan" or "medinan"

### Verse Object
- `number` (number) - Verse number within the chapter
- `text` (string) - Arabic text of the verse
- `translation` (string) - English translation
- `translation_text` (string) - Optional: alternative translation

### Audio URLs
- Object with verse number as key (1, 2, 3, etc.)
- Value is the URL to the audio file

## Migration Checklist

- [ ] Add `name_arabic` field to chapter data
- [ ] Add `meaning_en` field (or use a mapping file)
- [ ] Ensure `verses_count` is included
- [ ] Verify verse numbers are numeric and sequential
- [ ] Test API response format with Postman/curl
- [ ] Ensure CORS headers are set correctly
- [ ] Add audio URLs to response if available

## Example Backend Data Update

If you're using a JSON file or database, ensure the structure looks like this:

```typescript
interface ChapterResponse {
  id: number;
  number: number;
  name: string;
  name_arabic: string;
  meaning_en: string;
  verses_count: number;
  type: 'meccan' | 'medinan';
  verses: {
    number: number;
    text: string;
    translation: string;
  }[];
  audioUrls?: {
    [key: number]: string;
  };
}
```

## Notes

- The frontend expects `verses_count` (with underscore) not `total_verses`
- `verses_count` should match the actual array length of verses
- Audio URLs are optional but enhance functionality
- Ensure all Arabic text is properly encoded as UTF-8
