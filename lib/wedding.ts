export const WEDDING = {
  groom: "محمد",
  bride: "وصية الرسول",
  dayName: "الخميس",
  dateLabel: "13 أغسطس 2026",
  monthLabel: "أغسطس 2026",
  dayNumber: "13",
  timeLabel: "الساعة 9:00 مساءً",
  // ISO timestamp used by the countdown — Amman is UTC+3 year-round.
  isoDateTime: "2026-08-13T21:00:00+03:00",
  venueName: "صالة البنفسج للافراح",
  venueAddress: "تلاع العلي , عمّان",
  mapsQuery: "https://www.google.com/maps/search/?api=1&query=31.9983957,35.8605166&query_place_id=ChIJZ0aTfNqhHBURH6X6xcK__c8",
  hashtag: "#محمد_ووصية_الرسول",
  groomFatherName: "تيسير الشامي",
  brideFatherName: "ظافر دار محمد",
} as const;

export const COPY = {
  // door-knock intro
  doorKnockHint: "دُقّوا على الباب ثلاث دقّاتٍ ليُفتح",
  openButton: "افتح الدعوة",

  heroKicker: "دعوة زفاف",
  heroSubtitle: "بكم يكتمل الفرح... وبحضوركم تحلو الحكاية",
  heroTagline: "فتحنا لكم بابَ الفرح، وحلّقت البُشرى لتدعوكم",
  heroVenueLine: "صالة البنفسج - تلاع العلي",
  heroTimeLine: "9 مساءً",
  heroScrollHint: "مرر للأسفل",

  invitationVerse:
    "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
  invitationVerseSource: "سورة الروم – الآية 21",
  invitationTitle: "بطاقة دعوة",
  invitationBody:
    "بقلوبٍ يملؤها الحب والامتنان، ندعوكم لمشاركتنا أجمل لحظات العمر، ونكون شهودًا على فرحتنا، فحضوركم يكتمل به السرور، وبدعائكم تدوم الأيام.",
  invitationGroomFamily: "والد العريس",
  invitationBrideFamily: "والد العروس",

  countdownTitle: "باقٍ على فرحنا",
  countdownDone: "بدأ الاحتفال، أهلاً وسهلاً بكم",

  programTitle: "برنامج الحفل",
  programSubtitle: "لمحة عن مسار ليلتنا",

  venueTitle: "مكان الحفل",
  venueMapCta: "الموقع على الخريطة",

  saveTheDateTitle: "احفظ الموعد",
  saveTheDateSubtitle: "أضف الموعد إلى تقويم هاتفك بضغطة",
  addToGoogleCalendar: "تقويم جوجل",
  addToAppleCalendar: "تقويم آيفون",

  notesTitle: "تنويهات",
  contactTitle: "للتواصل ",
  contactPlaceholder: "0789814895",

  footerQuote: "حضوركم هديلُ فرحتنا... وتمامُ بهجتنا",
} as const;

export const COUNTDOWN_LABELS = {
  days: "يوم",
  hours: "ساعة",
  minutes: "دقيقة",
  seconds: "ثانية",
} as const;

export const PROGRAM_ITEMS = [
  { label: "استقبال الضيوف", time: "9:00 مساءً" },
  { label: "زفة العروسين", time: "9:30 مساءً" },
  { label: "حفل العشاء", time: "10:00 مساءً" },
  { label: "السهرة والاحتفال", time: "11:00 مساءً" },
] as const;

export const NOTES_ITEMS = [
  'جنة الاطفال منازلهم' ,
  "الدعوة تشمل حاملها والعائلة الكريمة",
] as const;

