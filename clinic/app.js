const state = {
  activeSection: "dashboard",
  selectedCustomer: null,
  customers: [
    { id: 1, name: "سارا کریمی", phone: "۰۹۱۲ ۸۴۳ ۲۱۶۵", email: "sara.karimi@email.com", pets: [{ name: "میلو", species: "گربه", breed: "پرشین", age: "۳ سال", weight: "۴.۸ کیلو" }], lastVisit: "امروز، ۰۹:۰۰", color: "blue" },
    { id: 2, name: "امیر رحیمی", phone: "۰۹۱۰ ۳۴۵ ۷۸۲۱", email: "amir.rahimi@email.com", pets: [{ name: "راکی", species: "سگ", breed: "ژرمن شپرد", age: "۵ سال", weight: "۲۹ کیلو" }, { name: "بادی", species: "سگ", breed: "پودل", age: "۲ سال", weight: "۶.۲ کیلو" }], lastVisit: "۲ روز پیش", color: "peach" },
    { id: 3, name: "نسترن محمدی", phone: "۰۹۱۹ ۶۱۲ ۴۴۰۲", email: "nasrin.m@email.com", pets: [{ name: "پونه", species: "خرگوش", breed: "هلندی", age: "۲ سال", weight: "۱.۹ کیلو" }], lastVisit: "امروز، ۱۲:۰۰", color: "purple" },
    { id: 4, name: "کامران توکلی", phone: "۰۹۳۵ ۲۲۱ ۸۹۰۱", email: "kamran.t@email.com", pets: [{ name: "لونا", species: "سگ", breed: "گلدن رتریور", age: "۴ سال", weight: "۲۴ کیلو" }], lastVisit: "شنبه، ۱۴:۳۰", color: "green" },
    { id: 5, name: "الهام نادری", phone: "۰۹۱۱ ۷۶۵ ۳۲۱۰", email: "elham.n@email.com", pets: [{ name: "آریا", species: "گربه", breed: "اگزوتیک", age: "۱ سال", weight: "۳.۲ کیلو" }], lastVisit: "یک هفته پیش", color: "blue" }
  ],
  pets: [
    { name: "میلو", species: "گربه", breed: "پرشین", age: "۳ سال", weight: "۴.۸ کیلو", owner: "سارا کریمی", status: "پایدار", statusClass: "success", emoji: "🐱", typeClass: "cat" },
    { name: "راکی", species: "سگ", breed: "ژرمن شپرد", age: "۵ سال", weight: "۲۹ کیلو", owner: "امیر رحیمی", status: "پیگیری لازم", statusClass: "warning", emoji: "🐶", typeClass: "dog" },
    { name: "پونه", species: "خرگوش", breed: "هلندی", age: "۲ سال", weight: "۱.۹ کیلو", owner: "نسترن محمدی", status: "مراقبت ویژه", statusClass: "blue-status", emoji: "🐰", typeClass: "rabbit" },
    { name: "لونا", species: "سگ", breed: "گلدن رتریور", age: "۴ سال", weight: "۲۴ کیلو", owner: "کامران توکلی", status: "پایدار", statusClass: "success", emoji: "🐕", typeClass: "dog" },
    { name: "آریا", species: "گربه", breed: "اگزوتیک", age: "۱ سال", weight: "۳.۲ کیلو", owner: "الهام نادری", status: "پایدار", statusClass: "success", emoji: "🐈", typeClass: "cat" },
    { name: "بادی", species: "سگ", breed: "پودل", age: "۲ سال", weight: "۶.۲ کیلو", owner: "امیر رحیمی", status: "پیگیری لازم", statusClass: "warning", emoji: "🐩", typeClass: "dog" }
  ]
};

const jalaliMonths = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
const breedsBySpecies = {
  سگ: ["گلدن رتریور", "ژرمن شپرد", "لابرادور رتریور", "هاسکی سیبری", "پودل", "بولداگ فرانسوی", "بولداگ انگلیسی", "بیگل", "روتوایلر", "دوبرمن", "شی‌هواوا", "پاگ", "شیتزو", "مالتیز", "یورکشایر تریر", "داشهوند", "باکسر", "کولی", "سگ آبی پرتغالی", "سگ گله استرالیایی", "سایر"],
  گربه: ["پرشین", "بریتیش شورت‌هِیر", "اسکاتیش فولد", "مین‌کون", "سیامی", "راگ‌دال", "بنگال", "اسفینکس", "اگزوتیک شورت‌هِیر", "آمریکن شورت‌هِیر", "حبشی", "روسی آبی", "بیرمن", "آنغورا", "موکوتاه اروپایی", "ساوانا", "نروژی جنگلی", "مانچکین", "کورنیش رکس", "دون رکس", "سایر"],
  خرگوش: ["هلندی", "هلندی لوپ", "مینی لوپ", "هلند لوپ", "نِدرلند دورف", "رکس", "مینی رکس", "آنگورا", "آنگورای انگلیسی", "آنگورای فرانسوی", "فلمنیش جاینت", "کالیفرنیایی", "هیمالین", "هوتوت کوتوله", "چینچیلا", "هاوانا", "پولیش", "ساتین", "لاین‌هد", "آلاسکا", "سایر"],
  پرنده: ["مرغ عشق", "عروس هلندی", "کاسکو", "ماکائو آبی و طلایی", "ماکائو قرمز", "کاکادو", "گرین‌چیک", "لاوبرد", "فنچ زبرا", "فنچ جاوا", "قناری", "مرغ مینا", "شاه‌طوطی", "طوطی سنگال", "طوطی آمازون", "توکان", "مرغ عشق انگلیسی", "پاراکیت راهب", "کونور خورشیدی", "طوطی اکلکتوس", "سایر"]
};

// Advanced Lab Tests Data from Pet Meal system
const labTestsCatalog = {
  "🩸 آزمایش خون (CBC)": {
    icon: "tint",
    tests: [
      { name: "گلبول قرمز (RBC)", unit: "×10⁶/µL", normal_dog: "5.5-8.5", normal_cat: "5-10", field: "rbc" },
      { name: "هموگلوبین (HGB)", unit: "g/dL", normal_dog: "12-18", normal_cat: "8-15", field: "hgb" },
      { name: "هماتوکریت (HCT)", unit: "%", normal_dog: "37-55", normal_cat: "30-45", field: "hct" },
      { name: "گلبول سفید (WBC)", unit: "×10³/µL", normal_dog: "6-17", normal_cat: "5.5-19.5", field: "wbc" },
      { name: "پلاکت (PLT)", unit: "×10³/µL", normal_dog: "200-500", normal_cat: "200-500", field: "plt" }
    ]
  },
  "🧪 بیوشیمی خون (Blood Chemistry)": {
    icon: "vial",
    tests: [
      { name: "گلوکز (GLU)", unit: "mg/dL", normal_dog: "70-140", normal_cat: "70-150", field: "glu" },
      { name: "BUN (نیتروژن اوره)", unit: "mg/dL", normal_dog: "7-27", normal_cat: "16-36", field: "bun" },
      { name: "کراتینین (CREA)", unit: "mg/dL", normal_dog: "0.5-1.5", normal_cat: "0.6-2.2", field: "crea" },
      { name: "ALT (آلانین آمینوترانسفراز)", unit: "U/L", normal_dog: "10-100", normal_cat: "20-100", field: "alt" },
      { name: "AST (آسپارتات آمینوترانسفراز)", unit: "U/L", normal_dog: "10-50", normal_cat: "10-50", field: "ast" },
      { name: "ALP (آلکالین فسفاتاز)", unit: "U/L", normal_dog: "20-150", normal_cat: "10-80", field: "alp" },
      { name: "پروتئین تام (TP)", unit: "g/dL", normal_dog: "5.4-7.6", normal_cat: "5.7-7.9", field: "tp" },
      { name: "آلبومین (ALB)", unit: "g/dL", normal_dog: "2.6-3.6", normal_cat: "2.5-3.9", field: "alb" },
      { name: "بیلی روبین (TBIL)", unit: "mg/dL", normal_dog: "0.1-0.6", normal_cat: "0.1-0.5", field: "tbil" }
    ]
  },
  "💊 الکترولیت‌ها و مواد معدنی (Electrolytes)": {
    icon: "flask",
    tests: [
      { name: "سدیم (Na)", unit: "mEq/L", normal_dog: "140-155", normal_cat: "150-165", field: "na" },
      { name: "پتاسیم (K)", unit: "mEq/L", normal_dog: "3.5-5.5", normal_cat: "3.5-5.5", field: "k" },
      { name: "کلر (Cl)", unit: "mEq/L", normal_dog: "105-120", normal_cat: "115-130", field: "cl" },
      { name: "کلسیم (Ca)", unit: "mg/dL", normal_dog: "8.5-11.5", normal_cat: "8.5-11", field: "ca" },
      { name: "فسفر (PHOS)", unit: "mg/dL", normal_dog: "2.5-6", normal_cat: "3-6", field: "phos" }
    ]
  },
  "🦠 آزمایشات هورمونی (Hormones)": {
    icon: "dna",
    tests: [
      { name: "T4 (تیروکسین)", unit: "µg/dL", normal_dog: "1.5-4", normal_cat: "1.5-4.8", field: "t4" },
      { name: "کورتیزول (Cortisol)", unit: "µg/dL", normal_dog: "1-6", normal_cat: "1-5", field: "cortisol" },
      { name: "انسولین (Insulin)", unit: "µIU/mL", normal_dog: "5-20", normal_cat: "5-20", field: "insulin" }
    ]
  },
  "🧪 آزمایش ادرار (Urinalysis)": {
    icon: "toilet",
    tests: [
      { name: "pH ادرار", unit: "", normal_dog: "5.5-7.5", normal_cat: "6-7.5", field: "urine_ph" },
      { name: "وزن مخصوص (USG)", unit: "", normal_dog: "1.015-1.045", normal_cat: "1.020-1.050", field: "usg" },
      { name: "پروتئین ادرار", unit: "mg/dL", normal_dog: "neg-trace", normal_cat: "neg-trace", field: "urine_protein" },
      { name: "گلوکز ادرار", unit: "", normal_dog: "negative", normal_cat: "negative", field: "urine_glucose" },
      { name: "کتون ادرار", unit: "", normal_dog: "negative", normal_cat: "negative", field: "urine_ketone" },
      { name: "گلبول قرمز ادرار", unit: "/HPF", normal_dog: "0-3", normal_cat: "0-3", field: "urine_rbc" },
      { name: "گلبول سفید ادرار", unit: "/HPF", normal_dog: "0-5", normal_cat: "0-5", field: "urine_wbc" },
      { name: "باکتری ادرار", unit: "", normal_dog: "negative", normal_cat: "negative", field: "urine_bacteria" },
      { name: "کریستال ادرار", unit: "", normal_dog: "none", normal_cat: "none", field: "urine_crystal" }
    ]
  }
};

// Diseases and Conditions Data from Pet Meal system
const diseasesCatalog = [
  { fa: "✅ سالم", en: "Healthy", species: ["dog", "cat"], hasSubItems: false },
  { fa: "چاقی", en: "Obesity", species: ["dog", "cat"], hasSubItems: false },
  { fa: "دیابت", en: "Diabetes Mellitus", species: ["dog", "cat"], hasSubItems: false },
  { fa: "بیماری مزمن کلیه", en: "Chronic Kidney Disease (CKD)", species: ["dog", "cat"], hasSubItems: false },
  { fa: "سنگ کلیه و مثانه", en: "Urinary Stones (Urolithiasis)", species: ["dog", "cat"], hasSubItems: true, subItems: [
    { fa: "سنگ اگزالات کلسیم", en: "Calcium Oxalate Stone" },
    { fa: "سنگ استروویت", en: "Struvite Stone" },
    { fa: "سنگ سیستین", en: "Cystine Stone" },
    { fa: "سنگ اورات", en: "Urate Stone" }
  ]},
  { fa: "پانکراتیت", en: "Pancreatitis", species: ["dog", "cat"], hasSubItems: false },
  { fa: "بیماری کبد چرب", en: "Fatty Liver Disease (Hepatic Lipidosis)", species: ["cat"], hasSubItems: false },
  { fa: "بیماری قلبی", en: "Heart Disease (Cardiomyopathy)", species: ["dog", "cat"], hasSubItems: false },
  { fa: "آرتروز", en: "Osteoarthritis", species: ["dog", "cat"], hasSubItems: false },
  { fa: "کمکاری تیروئید", en: "Hypothyroidism", species: ["dog"], hasSubItems: false },
  { fa: "پرکاری تیروئید", en: "Hyperthyroidism", species: ["cat"], hasSubItems: false },
  { fa: "بیماری التهابی روده", en: "Inflammatory Bowel Disease (IBD)", species: ["dog", "cat"], hasSubItems: false },
  { fa: "آلرژی غذایی", en: "Food Allergy", species: ["dog", "cat"], hasSubItems: false },
  { fa: "صرع", en: "Epilepsy", species: ["dog", "cat"], hasSubItems: false },
  { fa: "بیماری کوشینگ", en: "Cushing's Disease", species: ["dog", "cat"], hasSubItems: false },
  { fa: "کم‌خونی", en: "Anemia", species: ["dog", "cat"], hasSubItems: false },
  { fa: "لوسمی گربه", en: "Feline Leukemia (FeLV)", species: ["cat"], hasSubItems: false },
  { fa: "ایدز گربه", en: "Feline Immunodeficiency Virus (FIV)", species: ["cat"], hasSubItems: false }
];

// Ingredients Data from Pet Meal system
const ingredientsCatalog = {
  "🥩 پروتئین حیوانی (Animal Protein)": [
    { fa: "سینه مرغ", en: "Chicken Breast" }, { fa: "ران مرغ", en: "Chicken Thigh" },
    { fa: "جگر مرغ", en: "Chicken Liver" }, { fa: "قلب مرغ", en: "Chicken Heart" },
    { fa: "گوشت گوساله", en: "Beef" }, { fa: "گوشت بره", en: "Lamb" },
    { fa: "ماهی سالمون", en: "Salmon" }, { fa: "ماهی تن", en: "Tuna" },
    { fa: "تخم‌مرغ", en: "Egg" }, { fa: "ماست یونانی", en: "Greek Yogurt" },
    { fa: "پنیر کم نمک", en: "Low-Salt Cheese" }, { fa: "بوقلمون", en: "Turkey" },
    { fa: "گوشت اردک", en: "Duck" }, { fa: "ماهی ساردین", en: "Sardine" },
    { fa: "گوشت شترمرغ", en: "Ostrich Meat" }, { fa: "ماهی سفید", en: "White Fish" }
  ],
  "🥬 سبزیجات مجاز (Vegetables)": [
    { fa: "کدو سبز", en: "Zucchini" }, { fa: "کدو حلوایی", en: "Pumpkin" },
    { fa: "لوبیا سبز", en: "Green Beans" }, { fa: "کلم بروکلی", en: "Broccoli" },
    { fa: "هویج", en: "Carrot" }, { fa: "خیار", en: "Cucumber" },
    { fa: "کاهو", en: "Lettuce" }, { fa: "اسفناج", en: "Spinach" },
    { fa: "کرفس", en: "Celery" }, { fa: "فلفل دلمه‌ای", en: "Bell Pepper" },
    { fa: "کلم قمری", en: "Kohlrabi" }, { fa: "مارچوبه", en: "Asparagus" },
    { fa: "نخود فرنگی", en: "Peas" }, { fa: "کدو تنبل", en: "Butternut Squash" },
    { fa: "تره فرنگی", en: "Leek" }, { fa: "کلم بروکسل", en: "Brussels Sprouts" }
  ],
  "🫒 چربی‌های سالم (Healthy Fats)": [
    { fa: "روغن ماهی", en: "Fish Oil" }, { fa: "روغن زیتون", en: "Olive Oil" },
    { fa: "روغن نارگیل", en: "Coconut Oil" }, { fa: "روغن کانولا", en: "Canola Oil" },
    { fa: "روغن بذر کتان", en: "Flaxseed Oil" }, { fa: "روغن آووکادو", en: "Avocado Oil" },
    { fa: "روغن کنجد", en: "Sesame Oil" }, { fa: "کره بادام زمینی", en: "Peanut Butter" },
    { fa: "چربی مرغ", en: "Chicken Fat" }, { fa: "چربی گاو", en: "Beef Tallow" },
    { fa: "روغن آفتابگردان", en: "Sunflower Oil" }, { fa: "روغن گردو", en: "Walnut Oil" },
    { fa: "روغن دانه کتان", en: "Linseed Oil" }, { fa: "روغن جوانه گندم", en: "Wheat Germ Oil" },
    { fa: "روغن هسته انگور", en: "Grape Seed Oil" }, { fa: "روغن خردل", en: "Mustard Oil" }
  ],
  "🍚 کربوهیدرات سالم (Healthy Carbs)": [
    { fa: "برنج سفید", en: "White Rice" }, { fa: "برنج قهوه‌ای", en: "Brown Rice" },
    { fa: "جو دوسر", en: "Oats" }, { fa: "سیب‌زمینی شیرین", en: "Sweet Potato" },
    { fa: "کینوا", en: "Quinoa" }, { fa: "گندم سیاه", en: "Buckwheat" },
    { fa: "بلغور", en: "Bulgur" }, { fa: "ارزن", en: "Millet" },
    { fa: "جو", en: "Barley" }, { fa: "سیب‌زمینی", en: "Potato" },
    { fa: "ذرت", en: "Corn" }, { fa: "کوسکوس", en: "Couscous" },
    { fa: "آمارانت", en: "Amaranth" }, { fa: "اسپلت", en: "Spelt" },
    { fa: "چودار", en: "Rye" }, { fa: "تاج خروس", en: "Sorghum" }
  ],
  "💊 مکمل‌ها (Supplements)": [
    { fa: "پودر پوسته تخم‌مرغ", en: "Eggshell Powder" }, { fa: "پودر استخوان", en: "Bone Meal" },
    { fa: "پودر تورین", en: "Taurine Powder" }, { fa: "مولتی ویتامین", en: "Multivitamin" },
    { fa: "گلوکزآمین", en: "Glucosamine" }, { fa: "پروبیوتیک", en: "Probiotic" },
    { fa: "پودر جلبک اسپیرولینا", en: "Spirulina Powder" }, { fa: "پودر کلرلا", en: "Chlorella Powder" },
    { fa: "کلسیم سیترات", en: "Calcium Citrate" }, { fa: "منیزیم", en: "Magnesium" },
    { fa: "روی", en: "Zinc" }, { fa: "ویتامین D3", en: "Vitamin D3" },
    { fa: "ویتامین E", en: "Vitamin E" }, { fa: "کود تن Q10", en: "Coenzyme Q10" },
    { fa: "ال-کارنیتین", en: "L-Carnitine" }, { fa: "متیونین", en: "Methionine" }
  ],
  "🍎 میوه‌های مجاز (Fruits)": [
    { fa: "سیب", en: "Apple" }, { fa: "موز", en: "Banana" },
    { fa: "هندوانه", en: "Watermelon" }, { fa: "زغال اخته", en: "Blueberry" },
    { fa: "توت فرنگی", en: "Strawberry" }, { fa: "گلابی", en: "Pear" },
    { fa: "انبه", en: "Mango" }, { fa: "پاپایا", en: "Papaya" },
    { fa: "هلو", en: "Peach" }, { fa: "زردآلو", en: "Apricot" },
    { fa: "کیوی", en: "Kiwi" }, { fa: "طالبی", en: "Cantaloupe" },
    { fa: "گرمک", en: "Honeydew" }, { fa: "تمشک", en: "Raspberry" },
    { fa: "شاتوت", en: "Blackberry" }, { fa: "گیلاس", en: "Cherry" }
  ],
  "💧 مایعات (Liquids)": [
    { fa: "آب", en: "Water" }, { fa: "آب قلم", en: "Bone Broth" },
    { fa: "آب مرغ", en: "Chicken Broth" }, { fa: "آب استخوان", en: "Beef Broth" },
    { fa: "کفیر", en: "Kefir" }, { fa: "شیر بز", en: "Goat Milk" },
    { fa: "آب نارگیل", en: "Coconut Water" }, { fa: "دوغ", en: "Buttermilk" },
    { fa: "آب گوشت", en: "Meat Broth" }, { fa: "آب سبزیجات", en: "Vegetable Broth" },
    { fa: "چای بابونه", en: "Chamomile Tea" }, { fa: "آب برنج", en: "Rice Water" },
    { fa: "الکترولیت", en: "Electrolyte Solution" }, { fa: "سرم نمکی", en: "Saline Solution" },
    { fa: "آب جوشیده خنک", en: "Cooled Boiled Water" }
  ]
};

// Toxic Foods Data from Pet Meal system
const toxicFoods = [
  "پیاز", "سیر", "انگور", "کشمش", "شکلات", "زایلیتول", "قهوه", "الکل",
  "آووکادو (گوشت)", "خشکبار هسته‌دار", "نوشابه‌های گازدار", "ماست نانو", "گوشت خام",
  "شیر خام", "خمیر ترش", "سس سویا", "نمک زیاد", "استخوان ماهی", "آجیل ناسالم",
  "چغندر", "لوبیا چیتی", "سیب‌زمینی خام", "سبزیجات صلیبی", "قارچ وحشی"
];

// BCS (Body Condition Score) System from Pet Meal
const bcsSystem = {
  calculate: function(bcs) {
    const score = parseInt(bcs);
    if (score <= 3) {
      return {
        status: "⚠️ لاغر",
        advice: "افزایش کالری 20-40%",
        factor: 1.3,
        recommendation: "توصیه می‌شود وزن حیوان افزایش یابد. به وزن‌گیری اهمیت دهید."
      };
    } else if (score <= 4) {
      return {
        status: "⚠️ کمی لاغر",
        advice: "افزایش کالری 10-20%",
        factor: 1.15,
        recommendation: "وضعیت وزنی قابل قبول است اما می‌تواند بهتر شود."
      };
    } else if (score <= 5.5) {
      return {
        status: "✅ ایده‌آل",
        advice: "کالری نگهدارنده",
        factor: 1.1,
        recommendation: "وضعیت وزنی عالی است. از رژیم فعلی ادامه دهید."
      };
    } else if (score <= 7) {
      return {
        status: "⚠️ اضافه وزن",
        advice: "کاهش کالری 10-20%",
        factor: 0.85,
        recommendation: "کاهش کالری و افزایش فعالیت بدنی توصیه می‌شود."
      };
    } else {
      return {
        status: "❌ چاق",
        advice: "کاهش کالری 20-30%",
        factor: 0.75,
        recommendation: "وضعیت چاقی خطرناک است. رژیم سخت و فعالیت بدنی لازم است."
      };
    }
  },
  
  calculateWaterNeed: function(weight) {
    if (!weight || weight <= 0) return "---";
    const min = Math.round(weight * 50);
    const max = Math.round(weight * 60);
    return `${min}-${max} ml`;
  },
  
  calculateCalories: function(weight, bcs, species, ageGroup, neutered, pregnant, lactating) {
    if (!weight || weight <= 0) return 0;

    // RER (Resting Energy Requirement)
    const rer = Math.round(70 * Math.pow(weight, 0.75));
    
    // BCS factor
    const bcsResult = this.calculate(bcs);
    const bcsFactor = bcsResult.factor;
    
    // Species factor
    let speciesFactor = 1.1; // default for dog
    if (species === "cat") {
      speciesFactor = 1.2;
    }
    
    // Age factor
    let ageFactor = 1.0;
    if (ageGroup === "puppy/kitten") {
      ageFactor = 2.5; // growing animals need more calories
    } else if (ageGroup === "senior") {
      ageFactor = 0.8; // senior animals need fewer calories
    }
    
    // Neutered factor
    const neuteredFactor = neutered === "yes" ? 0.8 : 1.0;
    
    // Pregnancy factor
    let pregnancyFactor = 1.0;
    if (pregnant === "early") pregnancyFactor = 1.1;
    else if (pregnant === "mid") pregnancyFactor = 1.3;
    else if (pregnant === "late") pregnancyFactor = 1.5;
    
    // Lactation factor
    const lactationFactor = lactating === "yes" ? 2.0 : 1.0;
    
    // Calculate total calories
    const totalCalories = Math.round(rer * bcsFactor * speciesFactor * ageFactor * neuteredFactor * pregnancyFactor * lactationFactor);
    
    return {
      rer: rer,
      mer: totalCalories,
      breakdown: {
        rer: rer,
        bcs_adjustment: Math.round(rer * bcsFactor),
        species_adjustment: Math.round(rer * bcsFactor * speciesFactor),
        age_adjustment: Math.round(rer * bcsFactor * speciesFactor * ageFactor),
        neutered_adjustment: Math.round(rer * bcsFactor * speciesFactor * ageFactor * neuteredFactor),
        pregnancy_adjustment: Math.round(rer * bcsFactor * speciesFactor * ageFactor * neuteredFactor * pregnancyFactor),
        lactation_adjustment: totalCalories
      }
    };
  }
};
const initialNotePresets = [
  "حساسیت دارویی یا غذایی شناخته‌شده ندارد.",
  "واکسیناسیون طبق برنامه انجام شده است.",
  "نیازمند بررسی وضعیت انگل‌های داخلی و خارجی است.",
  "مالک، کاهش اشتها را در روزهای اخیر گزارش کرده است.",
  "مصرف آب حیوان بیشتر از حد معمول گزارش شده است.",
  "سابقه بیماری کلیوی در پرونده خانوادگی ثبت شده است.",
  "سابقه حساسیت پوستی و خارش دوره‌ای دارد.",
  "حیوان برای معاینه دوره‌ای و چکاپ مراجعه کرده است.",
  "آخرین واکسن در دفترچه سلامت ثبت و تصویر آن دریافت شد.",
  "حیوان در محیط خانه نگهداری می‌شود.",
  "حیوان دسترسی منظم به فضای باز دارد.",
  "رژیم غذایی فعلی شامل غذای خشک تجاری است.",
  "رژیم غذایی فعلی شامل غذای خانگی است.",
  "مصرف تشویقی‌ها باید در برنامه تغذیه کنترل شود.",
  "مالک درباره کنترل وزن و کاهش کالری درخواست راهنمایی دارد.",
  "سابقه جراحی یا بستری ثبت نشده است.",
  "داروی جاری ندارد؛ بررسی داروهای قبلی انجام شد.",
  "به دلیل اضطراب، در محیط کلینیک نیازمند آرام‌سازی ملایم است.",
  "اطلاعات میکروچیپ هنوز در پرونده ثبت نشده است.",
  "پیشنهاد می‌شود آزمایش خون پایه در اولین مراجعه انجام شود.",
  "نیازمند بررسی سلامت دهان و دندان است.",
  "الگوی خواب و فعالیت حیوان طبیعی گزارش شده است.",
  "مالک درخواست برنامه جیره‌سازی اختصاصی دارد.",
  "برای مراقبت ویژه و پیگیری نزدیک علامت‌گذاری شد."
];

const medicationCatalog = {
  antibiotics: {
    label: "\u0622\u0646\u062a\u06cc\u200c\u0628\u06cc\u0648\u062a\u06cc\u06a9\u200c\u0647\u0627",
    items: [
      ["amoxicillin", "\u0622\u0645\u0648\u06a9\u0633\u06cc\u200c\u0633\u06cc\u0644\u06cc\u0646", "\u0642\u0631\u0635 / \u0634\u0631\u0628\u062a / \u062a\u0632\u0631\u06cc\u0642", "\u062a\u0646\u0647\u0627 \u0628\u0627 \u062a\u0634\u062e\u06cc\u0635 \u0648 \u0646\u0638\u0631 \u062f\u0627\u0645\u067e\u0632\u0634\u06a9"],
      ["amoxiclav", "\u0622\u0645\u0648\u06a9\u0633\u06cc\u200c\u06a9\u0644\u0627\u0648", "\u0642\u0631\u0635 / \u0634\u0631\u0628\u062a", "\u0628\u0631\u0631\u0633\u06cc \u06a9\u0628\u062f \u0648 \u06a9\u0644\u06cc\u0647 \u062f\u0631 \u0645\u0648\u0627\u0631\u062f \u0644\u0627\u0632\u0645"],
      ["cephalexin", "\u0633\u0641\u0627\u0644\u06a9\u0633\u06cc\u0646", "\u0642\u0631\u0635 / \u0634\u0631\u0628\u062a", "\u062f\u0648\u0632 \u0628\u0631 \u0627\u0633\u0627\u0633 \u0648\u0632\u0646 \u0648 \u0646\u0648\u0639 \u0628\u06cc\u0645\u0627\u0631\u06cc"],
      ["doxycycline", "\u062f\u0648\u06a9\u0633\u06cc\u200c\u0633\u0627\u06cc\u06a9\u0644\u06cc\u0646", "\u0642\u0631\u0635 / \u06a9\u067e\u0633\u0648\u0644", "\u062f\u0631 \u06af\u0631\u0628\u0647 \u0628\u0627 \u0622\u0628 \u06cc\u0627 \u063a\u0630\u0627 \u0645\u0635\u0631\u0641 \u0634\u0648\u062f"],
      ["metronidazole", "\u0645\u062a\u0631\u0648\u0646\u06cc\u062f\u0627\u0632\u0648\u0644", "\u0642\u0631\u0635 / \u0645\u062d\u0644\u0648\u0644", "\u062f\u0648\u0632 \u0628\u0627\u06cc\u062f \u062f\u0642\u06cc\u0642 \u0631\u0639\u0627\u06cc\u062a \u0634\u0648\u062f"],
      ["enrofloxacin", "\u0627\u0646\u0631\u0648\u0641\u0644\u0648\u06a9\u0633\u0627\u0633\u06cc\u0646", "\u0642\u0631\u0635 / \u062a\u0632\u0631\u06cc\u0642", "\u062f\u0631 \u062d\u06cc\u0648\u0627\u0646 \u062c\u0648\u0627\u0646 \u0628\u0627 \u0627\u062d\u062a\u06cc\u0627\u0637 \u0645\u0635\u0631\u0641 \u0634\u0648\u062f"],
      ["clindamycin", "\u06a9\u0644\u06cc\u0646\u062f\u0627\u0645\u0627\u06cc\u0633\u06cc\u0646", "\u0642\u0631\u0635 / \u0645\u062d\u0644\u0648\u0644", "\u062f\u0648\u0632 \u0628\u0631 \u0627\u0633\u0627\u0633 \u0648\u0632\u0646"]
    ]
  },
  pain: {
    label: "\u0636\u062f\u062f\u0631\u062f \u0648 \u0636\u062f\u0627\u0644\u062a\u0647\u0627\u0628",
    items: [
      ["meloxicam", "\u0645\u0644\u0648\u06a9\u0633\u06cc\u06a9\u0627\u0645", "\u0642\u0631\u0635 / \u0645\u062d\u0644\u0648\u0644", "\u0645\u0646\u0639 \u062f\u0631 \u0628\u06cc\u0645\u0627\u0631\u06cc \u06a9\u0644\u06cc\u0648\u06cc \u0648 \u06a9\u0645\u200c\u0622\u0628\u06cc \u0628\u0627 \u0646\u0638\u0631 \u067e\u0632\u0634\u06a9"],
      ["carprofen", "\u06a9\u0627\u0631\u067e\u0631\u0648\u0641\u0646", "\u0642\u0631\u0635 / \u062c\u0648\u06cc\u062f\u0646\u06cc", "\u0628\u0631\u0627\u06cc \u0633\u06af \u0628\u0627 \u067e\u0627\u06cc\u0634 \u06a9\u0628\u062f"],
      ["firocoxib", "\u0641\u06cc\u0631\u0648\u06a9\u0648\u06a9\u0633\u06cc\u0628", "\u0642\u0631\u0635 \u062c\u0648\u06cc\u062f\u0646\u06cc", "\u062f\u0648\u0632 \u0648 \u0645\u062f\u062a \u0645\u0635\u0631\u0641 \u062a\u0648\u0633\u0637 \u067e\u0632\u0634\u06a9"],
      ["gabapentin", "\u06af\u0627\u0628\u0627\u067e\u0646\u062a\u06cc\u0646", "\u0642\u0631\u0635 / \u06a9\u067e\u0633\u0648\u0644 / \u0645\u062d\u0644\u0648\u0644", "\u0645\u0645\u06a9\u0646 \u0627\u0633\u062a \u062e\u0648\u0627\u0628\u200c\u0622\u0644\u0648\u062f\u06af\u06cc \u0628\u062f\u0647\u062f"],
      ["buprenorphine", "\u0628\u0648\u067e\u0631\u0646\u0648\u0631\u0641\u06cc\u0646", "\u062a\u0632\u0631\u06cc\u0642", "\u0645\u0648\u0627\u062f \u06a9\u0646\u062a\u0631\u0644\u200c\u0634\u062f\u0647\u061b \u062b\u0628\u062a \u062f\u0642\u06cc\u0642 \u0644\u0627\u0632\u0645"],
      ["tramadol", "\u062a\u0631\u0627\u0645\u0627\u062f\u0648\u0644", "\u0642\u0631\u0635 / \u06a9\u067e\u0633\u0648\u0644", "\u062a\u0646\u0647\u0627 \u0628\u0627 \u0646\u0638\u0631 \u062f\u0627\u0645\u067e\u0632\u0634\u06a9"]
    ]
  },
  antiparasitic: {
    label: "\u0636\u062f\u0627\u0646\u06af\u0644 \u0648 \u0636\u062f\u06a9\u0631\u0645",
    items: [
      ["selamectin", "\u0633\u0644\u0627\u0645\u06a9\u062a\u06cc\u0646", "\u067e\u0648\u0631\u0627\u0646\u06cc", "\u0628\u0627 \u062a\u0639\u06cc\u06cc\u0646 \u0648\u0632\u0646"],
      ["fluralaner", "\u0641\u0644\u0648\u0631\u0627\u0644\u0627\u0646\u0631", "\u0642\u0631\u0635 / \u067e\u0648\u0631\u0627\u0646\u06cc", "\u0645\u0635\u0631\u0641 \u0628\u0631 \u0627\u0633\u0627\u0633 \u0648\u0632\u0646"],
      ["milbemycin", "\u0645\u06cc\u0644\u0628\u0645\u0627\u06cc\u0633\u06cc\u0646", "\u0642\u0631\u0635", "\u0628\u0631\u0631\u0633\u06cc \u0646\u0648\u0639 \u0646\u0698\u0627\u062f \u0648 \u0648\u0632\u0646"],
      ["praziquantel", "\u067e\u0631\u0627\u0632\u06cc\u06a9\u0648\u0627\u0646\u062a\u0644", "\u0642\u0631\u0635 / \u062a\u0632\u0631\u06cc\u0642", "\u0636\u062f\u06a9\u0631\u0645 \u062a\u062e\u0635\u0635\u06cc"],
      ["fenbendazole", "\u0641\u0646\u0628\u0646\u062f\u0627\u0632\u0648\u0644", "\u067e\u0648\u062f\u0631 / \u0634\u0631\u0628\u062a", "\u0645\u062f\u062a \u062f\u0631\u0645\u0627\u0646 \u0628\u0631 \u0627\u0633\u0627\u0633 \u062a\u0634\u062e\u06cc\u0635"]
    ]
  },
  gastrointestinal: {
    label: "\u06af\u0648\u0627\u0631\u0634\u06cc",
    items: [
      ["omeprazole", "\u0627\u0645\u067e\u0631\u0627\u0632\u0648\u0644", "\u06a9\u067e\u0633\u0648\u0644 / \u062a\u0632\u0631\u06cc\u0642", "\u0628\u0631 \u0627\u0633\u0627\u0633 \u062a\u0634\u062e\u06cc\u0635"],
      ["famotidine", "\u0641\u0627\u0645\u0648\u062a\u06cc\u062f\u06cc\u0646", "\u0642\u0631\u0635 / \u062a\u0632\u0631\u06cc\u0642", "\u0645\u0642\u062f\u0627\u0631 \u0645\u0635\u0631\u0641 \u062a\u0648\u0633\u0637 \u067e\u0632\u0634\u06a9"],
      ["maropitant", "\u0645\u0627\u0631\u0648\u067e\u06cc\u062a\u0627\u0646\u062a", "\u0642\u0631\u0635 / \u062a\u0632\u0631\u06cc\u0642", "\u0636\u062f\u0627\u0633\u062a\u0641\u0631\u0627\u063a \u062f\u0627\u0645\u067e\u0632\u0634\u06a9\u06cc"],
      ["metoclopramide", "\u0645\u062a\u0648\u06a9\u0644\u0648\u067e\u0631\u0627\u0645\u06cc\u062f", "\u0642\u0631\u0635 / \u0645\u062d\u0644\u0648\u0644 / \u062a\u0632\u0631\u06cc\u0642", "\u062f\u0631 \u0627\u0646\u0633\u062f\u0627\u062f \u06af\u0648\u0627\u0631\u0634\u06cc \u0645\u0645\u0646\u0648\u0639"],
      ["probiotic", "\u067e\u0631\u0648\u0628\u06cc\u0648\u062a\u06cc\u06a9 \u062f\u0627\u0645\u067e\u0632\u0634\u06a9\u06cc", "\u067e\u0648\u062f\u0631 / \u067e\u0627\u0633\u062a\u06cc\u0644", "\u0645\u062d\u0635\u0648\u0644 \u062d\u0645\u0627\u06cc\u062a\u06cc"]
    ]
  },
  dermatology: {
    label: "\u067e\u0648\u0633\u062a \u0648 \u06af\u0648\u0634",
    items: [
      ["chlorhexidine", "\u06a9\u0644\u0631\u0647\u06a9\u0633\u06cc\u062f\u06cc\u0646", "\u0634\u0627\u0645\u067e\u0648 / \u0645\u062d\u0644\u0648\u0644", "\u0627\u0632 \u062a\u0645\u0627\u0633 \u0628\u0627 \u0686\u0634\u0645 \u062c\u0644\u0648\u06af\u06cc\u0631\u06cc \u0634\u0648\u062f"],
      ["miconazole", "\u0645\u06cc\u06a9\u0648\u0646\u0627\u0632\u0648\u0644", "\u0634\u0627\u0645\u067e\u0648 / \u0645\u0648\u0636\u0639\u06cc", "\u0636\u062f\u0642\u0627\u0631\u0686"],
      ["otic-cleaner", "\u067e\u0627\u06a9\u200c\u06a9\u0646\u0646\u062f\u0647 \u06af\u0648\u0634 \u062f\u0627\u0645\u067e\u0632\u0634\u06a9\u06cc", "\u0645\u062d\u0644\u0648\u0644 \u06af\u0648\u0634", "\u067e\u0631\u062f\u0647 \u06af\u0648\u0634 \u0628\u0631\u0631\u0633\u06cc \u0634\u0648\u062f"],
      ["prednisolone", "\u067e\u0631\u062f\u0646\u06cc\u0632\u0648\u0644\u0648\u0646", "\u0642\u0631\u0635 / \u0645\u0648\u0636\u0639\u06cc", "\u0628\u0627 \u0646\u0638\u0631 \u067e\u0632\u0634\u06a9 \u0648 \u06a9\u0645\u200c\u06a9\u0631\u062f\u0646 \u062a\u062f\u0631\u06cc\u062c\u06cc"],
      ["oclacitinib", "\u0627\u0648\u06a9\u0644\u0627\u0633\u06cc\u062a\u06cc\u0646\u06cc\u0628", "\u0642\u0631\u0635", "\u062f\u0631 \u0639\u0641\u0648\u0646\u062a\u200c\u0647\u0627 \u0628\u0627 \u0627\u062d\u062a\u06cc\u0627\u0637"]
    ]
  },
  supplements: {
    label: "\u0645\u06a9\u0645\u0644\u200c\u0647\u0627 \u0648 \u067e\u0634\u062a\u06cc\u0628\u0627\u0646\u06cc",
    items: [
      ["omega3", "\u0627\u0645\u06af\u0627\u06f3 \u062f\u0627\u0645\u067e\u0632\u0634\u06a9\u06cc", "\u06a9\u067e\u0633\u0648\u0644 / \u0631\u0648\u063a\u0646", "\u0628\u0631\u0631\u0633\u06cc \u06a9\u0627\u0644\u0631\u06cc \u0648 \u062a\u0641\u0627\u0639\u0644 \u0628\u0627 \u062f\u0627\u0631\u0648\u0647\u0627"],
      ["joint-support", "\u0645\u06a9\u0645\u0644 \u0645\u0641\u0627\u0635\u0644", "\u062c\u0648\u06cc\u062f\u0646\u06cc / \u067e\u0648\u062f\u0631", "\u0645\u0635\u0631\u0641 \u0628\u0631 \u0627\u0633\u0627\u0633 \u0648\u0632\u0646"],
      ["liver-support", "\u0645\u06a9\u0645\u0644 \u062d\u0645\u0627\u06cc\u062a \u06a9\u0628\u062f", "\u0642\u0631\u0635 / \u06a9\u067e\u0633\u0648\u0644", "\u062c\u0627\u06cc\u06af\u0632\u06cc\u0646 \u062f\u0631\u0645\u0627\u0646 \u0646\u06cc\u0633\u062a"],
      ["renal-support", "\u0645\u06a9\u0645\u0644 \u062d\u0645\u0627\u06cc\u062a \u06a9\u0644\u06cc\u0647", "\u067e\u0648\u062f\u0631 / \u06a9\u067e\u0633\u0648\u0644", "\u0628\u0627 \u0622\u0632\u0645\u0627\u06cc\u0634 \u0648 \u0646\u0638\u0631 \u067e\u0632\u0634\u06a9"],
      ["electrolyte", "\u0645\u062d\u0644\u0648\u0644 \u0627\u0644\u06a9\u062a\u0631\u0648\u0644\u06cc\u062a", "\u067e\u0648\u062f\u0631 / \u0645\u062d\u0644\u0648\u0644", "\u062f\u0631 \u06a9\u0645\u200c\u0622\u0628\u06cc \u0634\u062f\u06cc\u062f \u062c\u0627\u06cc\u06af\u0632\u06cc\u0646 \u062f\u0631\u0645\u0627\u0646 \u0646\u06cc\u0633\u062a"]
    ]
  },
  // Advanced categories from Pet Meal system
  corticosteroids: {
    label: "\u06a9\u0648\u0631\u062a\u0648\u0646 (Corticosteroids)",
    items: [
      ["prednisolone", "\u067e\u0631\u062f\u0646\u06cc\u0632\u0648\u0644\u0648\u0646", "\u0642\u0631\u0635 / \u0645\u0648\u0636\u0639\u06cc", "\u0628\u0627 \u0646\u0638\u0631 \u067e\u0632\u0634\u06a9 \u0648 \u06a9\u0645\u200c\u06a9\u0631\u062f\u0646 \u062a\u062f\u0631\u06cc\u062c\u06cc"],
      ["dexamethasone", "\u062f\u06a9\u0633\u0627\u0645\u062a\u0627\u0632\u0648\u0646", "\u0642\u0631\u0635 / \u062a\u0632\u0631\u06cc\u0642", "\u0627\u0641\u06a9\u062a \u0648 \u062f\u0631\u0645\u0627\u0646 \u0647\u0627\u06cc \u0627\u0644\u062a\u0647\u0627\u0628\u06cc"],
      ["methylprednisolone", "\u0645\u062a\u06cc\u0644 \u067e\u0631\u062f\u0646\u06cc\u0632\u0648\u0644\u0648\u0646", "\u0642\u0631\u0635 / \u062a\u0632\u0631\u06cc\u0642", "\u062f\u0631\u0645\u0627\u0646 \u0647\u0627\u06cc \u0631\u0648\u0645\u0627\u062a\u06cc\u06a9"],
      ["hydrocortisone", "\u0647\u06cc\u062f\u0631\u0648\u06a9\u0648\u0631\u062a\u06cc\u0632\u0648\u0646", "\u0642\u0631\u0635 / \u062a\u0632\u0631\u06cc\u0642", "\u062c\u0627\u06cc\u06af\u0632\u06cc\u0646 \u062f\u0631\u0645\u0627\u0646 \u0647\u0627\u06cc \u062f\u0631\u0648\u0646\u06cc"],
      ["betamethasone", "\u0628\u062a\u0627\u0645\u062a\u0627\u0632\u0648\u0646", "\u0642\u0631\u0635 / \u0645\u0648\u0636\u0639\u06cc", "\u062f\u0631\u0645\u0627\u0646 \u0647\u0627\u06cc \u067e\u0648\u0633\u062a\u06cc"],
      ["triamcinolone", "\u062a\u0631\u06cc\u0627\u0645\u0633\u06cc\u0646\u0648\u0644\u0648\u0646", "\u0642\u0631\u0635 / \u062a\u0632\u0631\u06cc\u0642", "\u062f\u0631\u0645\u0627\u0646 \u0647\u0627\u06cc \u0627\u0644\u062a\u0647\u0627\u0628\u06cc"],
      ["fluticasone", "\u0641\u0644\u0648\u062a\u06cc\u06a9\u0627\u0632\u0648\u0646", "\u0627\u0633\u067e\u0631\u06cc / \u0645\u0648\u0636\u0639\u06cc", "\u062f\u0631\u0645\u0627\u0646 \u0647\u0627\u06cc \u0622\u0633\u0645\u0627"],
      ["budesonide", "\u0628\u0648\u062f\u0632\u0648\u0646\u0627\u06cc\u062f", "\u0642\u0631\u0635 / \u0627\u0633\u067e\u0631\u06cc", "\u062f\u0631\u0645\u0627\u0646 \u0647\u0627\u06cc \u06af\u0648\u0627\u0631\u0634\u06cc"],
      ["clobetasol", "\u06a9\u0644\u0648\u0628\u062a\u0627\u0632\u0648\u0644", "\u0645\u0648\u0636\u0639\u06cc", "\u062f\u0631\u0645\u0627\u0646 \u0647\u0627\u06cc \u067e\u0648\u0633\u062a\u06cc \u0634\u062f\u06cc\u062f"],
      ["deflazacort", "\u062f\u0641\u0644\u0627\u0632\u0627\u06a9\u0648\u0631\u062a", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0647\u0627\u06cc \u0639\u0635\u0628\u06cc \u0648 \u0645\u0639\u062f\u06cc"]
    ]
  },
  nsaid: {
    label: "NSAIDs",
    items: [
      ["carprofen", "\u06a9\u0627\u0631\u067e\u0631\u0648\u0641\u0646", "\u0642\u0631\u0635 / \u062c\u0648\u06cc\u062f\u0646\u06cc", "\u0628\u0631\u0627\u06cc \u0633\u06af \u0628\u0627 \u067e\u0627\u06cc\u0634 \u06a9\u0628\u062f"],
      ["meloxicam", "\u0645\u0644\u0648\u06a9\u0633\u06cc\u06a9\u0627\u0645", "\u0642\u0631\u0635 / \u0645\u062d\u0644\u0648\u0644", "\u0645\u0646\u0639 \u062f\u0631 \u0628\u06cc\u0645\u0627\u0631\u06cc \u06a9\u0644\u06cc\u0648\u06cc \u0648 \u06a9\u0645\u200c\u0622\u0628\u06cc"],
      ["rimadyl", "\u0631\u06cc\u0645\u0627\u062f\u06cc\u0644", "\u0642\u0631\u0635", "\u0646\u0627\u0645 \u062a\u062c\u0627\u0631\u06cc \u06a9\u0627\u0631\u067e\u0631\u0648\u0641\u0646"],
      ["piroxicam", "\u067e\u06cc\u0631\u0648\u06a9\u0633\u06cc\u06a9\u0627\u0645", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0633\u0631\u0637\u0627\u0646 \u0648 \u0627\u0644\u062a\u0647\u0627\u0628"],
      ["diclofenac", "\u062f\u06cc\u06a9\u0644\u0648\u0641\u0646\u0627\u06a9", "\u0642\u0631\u0635", "\u0645\u0646\u0639 \u062f\u0631 \u0628\u06cc\u0645\u0627\u0631\u06cc \u0647\u0627\u06cc \u0645\u0635\u0631\u0641\u06cc"],
      ["ibuprofen", "\u0627\u06cc\u0628\u0648\u067e\u0631\u0648\u0641\u0646", "\u0642\u0631\u0635", "\u0645\u0646\u0639 \u062f\u0631 \u0628\u06cc\u0645\u0627\u0631\u06cc \u0647\u0627\u06cc \u0645\u0635\u0631\u0641\u06cc"],
      ["naproxen", "\u0646\u0627\u067e\u0631\u0648\u06a9\u0633\u0646", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0627\u0644\u062a\u0647\u0627\u0628 \u0645\u0641\u0635\u0644\u06cc"],
      ["celecoxib", "\u0633\u0644\u06a9\u0648\u06a9\u0633\u06cc\u0628", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0627\u0644\u062a\u0647\u0627\u0628 \u0645\u0641\u0635\u0644\u06cc"],
      ["etodolac", "\u0627\u062a\u0648\u062f\u0648\u0644\u0627\u06a9", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0627\u0644\u062a\u0647\u0627\u0628 \u0645\u0641\u0635\u0644\u06cc"],
      ["ketoprofen", "\u06a9\u062a\u0648\u067e\u0631\u0648\u0641\u0646", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0627\u0644\u062a\u0647\u0627\u0628 \u0648 \u062f\u0631\u062f"]
    ]
  },
  anticonvulsant: {
    label: "\u0636\u062f \u062a\u0634\u0646\u062c",
    items: [
      ["phenobarbital", "\u0641\u0646\u0648\u0628\u0627\u0631\u0628\u06cc\u062a\u0627\u0644", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0635\u0631\u0639 \u0627\u0635\u0644\u06cc"],
      ["potassium-bromide", "\u067e\u062a\u0627\u0633\u06cc\u0645 \u0628\u0631\u0648\u0645\u0627\u06cc\u062f", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0635\u0631\u0639 \u0627\u0635\u0644\u06cc"],
      ["levetiracetam", "\u0644\u0648\u062a\u06cc\u0631\u0627\u0633\u062a\u0627\u0645", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0635\u0631\u0639 \u0627\u0635\u0644\u06cc"],
      ["gabapentin", "\u06af\u0627\u0628\u0627\u067e\u0646\u062a\u06cc\u0646", "\u0642\u0631\u0635 / \u06a9\u067e\u0633\u0648\u0644", "\u062f\u0631\u0645\u0627\u0646 \u0635\u0631\u0639 \u0627\u0635\u0644\u06cc \u0648 \u062f\u0631\u062f"],
      ["zonisamide", "\u0632\u0648 \u0646\u06cc\u0632\u0627\u0645\u0627\u06cc\u062f", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0635\u0631\u0639 \u0627\u0635\u0644\u06cc"],
      ["topiramate", "\u062a\u0648\u067e\u06cc\u0631\u0627\u0645\u0627\u062a", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0635\u0631\u0639 \u0627\u0635\u0644\u06cc"],
      ["pregabalin", "\u067e\u0631\u06af\u0627\u0628\u0627\u0644\u06cc\u0646", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0635\u0631\u0639 \u0627\u0635\u0644\u06cc"],
      ["valproate-sodium", "\u0648\u0627\u0644\u067e\u0631\u0648\u0627\u062a \u0633\u062f\u06cc\u0645", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0635\u0631\u0639 \u0627\u0635\u0644\u06cc"],
      ["clonazepam", "\u06a9\u0644\u0648\u0646\u0627\u0632\u067e\u0627\u0645", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0635\u0631\u0639 \u0627\u0635\u0644\u06cc"],
      ["diazepam", "\u062f\u06cc\u0627\u0632\u067e\u0627\u0645", "\u0642\u0631\u0635 / \u062a\u0632\u0631\u06cc\u0642", "\u062f\u0631\u0645\u0627\u0646 \u0635\u0631\u0639 \u0627\u0635\u0644\u06cc"]
    ]
  },
  cardiac: {
    label: "\u062f\u0627\u0631\u0648\u0647\u0627\u06cc \u0642\u0644\u0628\u06cc",
    items: [
      ["pimobendan", "\u067e\u06cc\u0645\u0648\u0628\u0646\u062f\u0627\u0646", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0646\u0627\u062f\u0642\u06cc \u0642\u0644\u0628"],
      ["enalapril", "\u0627\u0646\u0627\u0644\u0627\u067e\u0631\u06cc\u0644", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0646\u0627\u062f\u0642\u06cc \u0642\u0644\u0628"],
      ["benazepril", "\u0628\u0646\u0627\u0632\u067e\u0631\u06cc\u0644", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0646\u0627\u062f\u0642\u06cc \u0642\u0644\u0628"],
      ["furosemide", "\u0641\u0648\u0631\u0648\u0633\u0627\u06cc\u062f", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0646\u0627\u062f\u0642\u06cc \u0642\u0644\u0628"],
      ["spironolactone", "\u0627\u0633\u067e\u06cc\u0631\u0648\u0646\u0648\u0644\u0627\u06a9\u062a\u0648\u0646", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0646\u0627\u062f\u0642\u06cc \u0642\u0644\u0628"],
      ["digoxin", "\u062f\u06cc\u06af\u0648\u06a9\u0633\u06cc\u0646", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0646\u0627\u062f\u0642\u06cc \u0642\u0644\u0628"],
      ["atenolol", "\u0627\u062a\u0646\u0648\u0644\u0648\u0644", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0646\u0627\u062f\u0642\u06cc \u0642\u0644\u0628"],
      ["carvedilol", "\u06a9\u0627\u0631\u0648\u062f\u06cc\u0644\u0648\u0644", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0646\u0627\u062f\u0642\u06cc \u0642\u0644\u0628"],
      ["amlodipine", "\u0627\u0645\u0644\u0648\u062f\u06cc\u067e\u06cc\u0646", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0641\u0634\u0631 \u062e\u0648\u0646"],
      ["hydralazine", "\u0647\u06cc\u062f\u0631\u0627\u0644\u0627\u0632\u06cc\u0646", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u0641\u0634\u0631 \u062e\u0648\u0646"]
    ]
  },
  insulin: {
    label: "\u0627\u0646\u0633\u0648\u0644\u06cc\u0646",
    items: [
      ["nph-insulin", "\u0627\u0646\u0633\u0648\u0644\u06cc\u0646 NPH", "\u062a\u0632\u0631\u06cc\u0642", "\u062f\u0631\u0645\u0627\u0646 \u062f\u06cc\u0627\u0628\u062a"],
      ["glargine-insulin", "\u0627\u0646\u0633\u0648\u0644\u06cc\u0646 \u06af\u0644\u0627\u0631\u0698\u06cc\u0646", "\u062a\u0632\u0631\u06cc\u0642", "\u062f\u0631\u0645\u0627\u0646 \u062f\u06cc\u0627\u0628\u062a"],
      ["vetsulin", "Vetsulin", "\u062a\u0632\u0631\u06cc\u0642", "\u062f\u0631\u0645\u0627\u0646 \u062f\u06cc\u0627\u0628\u062a"],
      ["degludec-insulin", "\u0627\u0646\u0633\u0648\u0644\u06cc\u0646 \u062f\u06af\u0644\u0648\u062f\u06a9", "\u062a\u0632\u0631\u06cc\u0642", "\u062f\u0631\u0645\u0627\u0646 \u062f\u06cc\u0627\u0628\u062a"],
      ["aspart-insulin", "\u0627\u0646\u0633\u0648\u0644\u06cc\u0646 \u0622\u0633\u067e\u0627\u0631\u062a", "\u062a\u0632\u0631\u06cc\u0642", "\u062f\u0631\u0645\u0627\u0646 \u062f\u06cc\u0627\u0628\u062a"],
      ["lispro-insulin", "\u0627\u0646\u0633\u0648\u0644\u06cc\u0646 \u0644\u06cc\u0633\u067e\u0631\u0648", "\u062a\u0632\u0631\u06cc\u0642", "\u062f\u0631\u0645\u0627\u0646 \u062f\u06cc\u0627\u0628\u062a"],
      ["regular-insulin", "\u0627\u0646\u0633\u0648\u0644\u06cc\u0646 \u0631\u06af\u0648\u0644\u0627\u0631", "\u062a\u0632\u0631\u06cc\u0642", "\u062f\u0631\u0645\u0627\u0646 \u062f\u06cc\u0627\u0628\u062a"],
      ["detemir-insulin", "\u0627\u0646\u0633\u0648\u0644\u06cc\u0646 \u062f\u062a\u0645\u06cc\u0631", "\u062a\u0632\u0631\u06cc\u0642", "\u062f\u0631\u0645\u0627\u0646 \u062f\u06cc\u0627\u0628\u062a"],
      ["prozinc", "ProZinc", "\u062a\u0632\u0631\u06cc\u0642", "\u062f\u0631\u0645\u0627\u0646 \u062f\u06cc\u0627\u0628\u062a"],
      ["caninsulin", "Caninsulin", "\u062a\u0632\u0631\u06cc\u0642", "\u062f\u0631\u0645\u0627\u0646 \u062f\u06cc\u0627\u0628\u062a"]
    ]
  },
  thyroid: {
    label: "\u062f\u0627\u0631\u0648\u0647\u0627\u06cc \u062a\u06cc\u0631\u0648\u0626\u06cc\u062f",
    items: [
      ["levothyroxine", "\u0644\u0648\u0648\u062a\u06cc\u0631\u0648\u06a9\u0633\u06cc\u0646", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u06a9\u0645\u06a9\u0627\u0631\u06cc \u062a\u06cc\u0631\u0648\u0626\u06cc\u062f"],
      ["methimazole", "\u0645\u062a\u06cc \u0645\u0627\u0632\u0648\u0644", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u067e\u0631\u06a9\u0627\u0631\u06cc \u062a\u06cc\u0631\u0648\u0626\u06cc\u062f"],
      ["carbimazole", "\u06a9\u0627\u0631\u0628\u06cc\u0645\u0627\u0632\u0648\u0644", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u067e\u0631\u06a9\u0627\u0631\u06cc \u062a\u06cc\u0631\u0648\u0626\u06cc\u062f"],
      ["propylthiouracil", "\u067e\u0631\u0648\u067e\u06cc\u0644 \u062a\u06cc\u0631\u0648\u0627\u0633\u06cc\u0644", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u067e\u0631\u06a9\u0627\u0631\u06cc \u062a\u06cc\u0631\u0648\u0626\u06cc\u062f"],
      ["liothyronine-sodium", "\u0644\u0648\u062a\u06cc\u0631\u0648\u06a9\u0633\u06cc\u0646 \u0633\u062f\u06cc\u0645", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u06a9\u0645\u06a9\u0627\u0631\u06cc \u062a\u06cc\u0631\u0648\u0626\u06cc\u062f"],
      ["thyrotropin", "\u062a\u06cc\u0631\u0648\u062a\u0631\u0648\u067e\u06cc\u0646", "\u062a\u0632\u0631\u06cc\u0642", "\u062a\u0633\u062a \u0647\u0648\u0631\u0645\u0648\u0646\u06cc"],
      ["triiodothyronine", "\u062a\u0631\u06cc \u0627\u06cc\u0648\u062f\u0648\u062a\u06cc\u0631\u0648\u0646\u06cc\u0646", "\u0642\u0631\u0635", "\u062a\u0633\u062a \u0647\u0648\u0631\u0645\u0648\u0646\u06cc"],
      ["potassium-iodide", "\u06cc\u0648\u062f\u06cc\u062f \u067e\u062a\u0627\u0633\u06cc\u0645", "\u0642\u0631\u0635", "\u062a\u0633\u062a \u0647\u0648\u0631\u0645\u0648\u0646\u06cc"],
      ["thyrozol", "\u062a\u06cc\u0631\u0648\u0632\u0648\u0644", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u067e\u0631\u06a9\u0627\u0631\u06cc \u062a\u06cc\u0631\u0648\u0626\u06cc\u062f"],
      ["methimazole", "\u0645\u062a\u06cc\u0645\u0627\u0632\u0648\u0644", "\u0642\u0631\u0635", "\u062f\u0631\u0645\u0627\u0646 \u067e\u0631\u06a9\u0627\u0631\u06cc \u062a\u06cc\u0631\u0648\u0626\u06cc\u062f"]
    ]
  }
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const API_BASE = "http://127.0.0.1:8001/api";
let remoteModuleData = {
  imaging: [],
  prescriptions: [],
  nutrition: [],
  inventory: [],
  shopProducts: [],
  shopSales: [],
  shopReport: null
};
let shopCart = [];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));
}

function normalizeWeight(value) {
  const weight = Number.parseFloat(String(value ?? "").replace(",", "."));
  return Number.isFinite(weight) && weight > 0 ? weight : 1;
}

async function apiRequest(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (session?.token) headers.Authorization = `Bearer ${session.token}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `خطای API (${response.status})`);
  return payload;
}

async function loadRemoteData() {
  if (!session?.token) return;
  const results = await Promise.allSettled([
    apiRequest("/customers"),
    apiRequest("/pets"),
    apiRequest("/appointments"),
    apiRequest("/records"),
    apiRequest("/labs"),
    apiRequest("/lab-requests"),
    apiRequest("/imaging"),
    apiRequest("/prescriptions"),
    apiRequest("/nutrition"),
    apiRequest("/inventory")
  ]);
  const [customersResult, petsResult, appointmentsResult, recordsResult, labsResult, labRequestsResult, imagingResult, prescriptionsResult, nutritionResult, inventoryResult] = results;
  const itemsOf = result => result.status === "fulfilled" ? (result.value.items || []) : [];
  const remoteCustomers = itemsOf(customersResult);
  const remotePets = itemsOf(petsResult);
  remoteData.appointments = itemsOf(appointmentsResult);
  remoteData.records = itemsOf(recordsResult);
  remoteData.labs = itemsOf(labsResult);
  remoteData.labRequests = itemsOf(labRequestsResult);
  remoteData.loaded = true;
  if (remoteCustomers.length) {
    state.customers = remoteCustomers.map(customer => ({
      ...customer,
      email: customer.email || "ایمیل ثبت نشده",
      pets: remotePets.filter(pet => pet.owner_id === customer.id).map(pet => ({
        ...pet,
        weight: pet.weight ? `${pet.weight} کیلو` : "ثبت نشده"
      })),
      lastVisit: customer.last_visit || "هنوز مراجعه‌ای ثبت نشده",
      color: "teal"
    }));
    state.pets = remotePets.map(pet => ({
      ...pet,
      owner: pet.owner_name,
      weight: pet.weight ? `${pet.weight} کیلو` : "ثبت نشده",
      statusClass: "success",
      emoji: pet.species === "گربه" ? "🐱" : pet.species === "خرگوش" ? "🐰" : pet.species === "پرنده" ? "🦜" : "🐶",
      typeClass: pet.species === "گربه" ? "cat" : pet.species === "خرگوش" ? "rabbit" : "dog"
    }));
  }
  remoteModuleData = {
    imaging: itemsOf(imagingResult),
    prescriptions: itemsOf(prescriptionsResult).map(item => ({
      ...item,
      id: String(item.id),
      petName: item.pet_name,
      owner: item.owner_name,
      instructions: item.instructions || [item.dose, item.duration].filter(Boolean).join(" · "),
      status: item.status || (item.dispensed === "تحویل به مالک" ? "تحویل‌شده" : "در انتظار بررسی")
    })),
    nutrition: itemsOf(nutritionResult),
    inventory: itemsOf(inventoryResult),
    shopProducts: remoteModuleData.shopProducts || [],
    shopSales: remoteModuleData.shopSales || [],
    shopReport: remoteModuleData.shopReport || null
  };
  if (remoteModuleData.inventory.length) {
    pharmacyStore.inventory = remoteModuleData.inventory.map(item => ({
      ...item,
      name: item.name,
      category: item.category || "دارو",
      form: item.medicine_form || "",
      stock: Number(item.stock) || 0,
      unit: item.unit || "واحد",
      reorder: Number(item.reorder) || 0
    }));
  }
  if (remoteModuleData.prescriptions.length) {
    pharmacyStore.prescriptions = remoteModuleData.prescriptions;
  }
  if (state.activeSection === "appointments") renderAppointmentsWorkspace();
  if (state.activeSection === "laboratory") renderLaboratoryResponseWorkspace();
  if (state.activeSection === "records") renderExamWorkspace();
}

function getStored(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function saveState() {
  localStorage.setItem("petclinic-customers", JSON.stringify(state.customers));
  localStorage.setItem("petclinic-pets", JSON.stringify(state.pets));
}

state.customers = getStored("petclinic-customers", state.customers);
state.pets = getStored("petclinic-pets", state.pets);
let session = getStored("petclinic-session", null);
let clinicalStore = getStored("petclinic-clinical", {});
let clinicAppointments = getStored("petclinic-appointments", []);
const remoteData = {
  appointments: [],
  records: [],
  labs: [],
  labRequests: [],
  loaded: false
};
let pharmacyStore = getStored("petclinic-pharmacy", {
  inventory: [
    { name: "آموکسی‌سیلین", category: "آنتی‌بیوتیک", stock: 24, unit: "بسته", reorder: 8 },
    { name: "ملوکسی‌کام", category: "ضددرد و ضدالتهاب", stock: 16, unit: "بسته", reorder: 5 },
    { name: "فنبندازول", category: "ضدانگل", stock: 12, unit: "بسته", reorder: 4 },
    { name: "امپرازول", category: "گوارشی", stock: 9, unit: "بسته", reorder: 3 },
    { name: "مکمل مفاصل", category: "مکمل", stock: 18, unit: "بسته", reorder: 6 }
  ],
  dispenseStatus: {},
  prescriptions: []
});
pharmacyStore = {
  inventory: Array.isArray(pharmacyStore?.inventory) ? pharmacyStore.inventory : [],
  dispenseStatus: pharmacyStore?.dispenseStatus && typeof pharmacyStore.dispenseStatus === "object" ? pharmacyStore.dispenseStatus : {},
  prescriptions: Array.isArray(pharmacyStore?.prescriptions) ? pharmacyStore.prescriptions : []
};
let editingCustomerId = null;
let editingPetName = null;
const actionDraftItems = { labRequest: [], medication: [], labAnswer: [] };
const examOptionDefaults = {
  complaint: ["بی‌اشتهایی", "استفراغ", "اسهال", "سرفه یا تنگی نفس", "خارش و ضایعات پوستی", "لنگش یا درد", "چکاپ دوره‌ای", "کنترل وزن"],
  finding: ["هوشیار و پاسخ‌گو", "دمای بدن طبیعی", "مخاط صورتی و مرطوب", "کم‌آبی خفیف", "درد شکمی", "صدای قلب و ریه طبیعی", "نیازمند بررسی تکمیلی"],
  diagnosis: ["وضعیت عمومی پایدار", "گاستروانتریت", "حساسیت پوستی", "اضافه‌وزن", "مشکوک به بیماری کلیوی", "نیازمند آزمایش تکمیلی"],
  plan: ["مراقبت حمایتی و پایش", "آزمایش خون پایه", "تصویربرداری تکمیلی", "اصلاح جیره غذایی", "تجویز دارو و پیگیری", "مراجعه مجدد طبق نیاز"]
};
const examOptionLabels = { complaint: "شکایت اصلی", finding: "یافته معاینه", diagnosis: "تشخیص اولیه", plan: "برنامه درمانی" };

function saveClinicalStore() {
  localStorage.setItem("petclinic-clinical", JSON.stringify(clinicalStore));
}

function petNameFromValue(value = "") {
  return String(value).split(" · ")[0].trim();
}

function getPetClinicalRecord(name) {
  const stored = clinicalStore[name] || {};
  const base = petClinicalData[name] || {};
  const asArray = value => Array.isArray(value) ? value : [];
  const remoteRecords = remoteData.records
    .filter(item => item.pet_name === name)
    .map(item => {
      let details = {};
      try { details = typeof item.details_json === "string" ? JSON.parse(item.details_json) : (item.details_json || {}); } catch {}
      return {
        id: item.id,
        date: item.visit_date,
        diagnosis: item.diagnosis || details.diagnosis || "",
        complaint: details.complaint || "",
        finding: details.finding || "",
        plan: details.plan || "",
        note: item.notes || details.note || "",
        treatment: item.treatment || ""
      };
    });
  const remoteLabs = getUnifiedLabResultsForPet(name);
  const remoteLabRequests = remoteData.labRequests
    .filter(item => item.pet_name === name)
    .map(item => {
      const answers = remoteLabs.filter(result => result.requestId === item.id);
      return {
        id: item.id,
        panel: item.panel,
        sample: item.sample,
        priority: item.priority,
        reason: item.reason,
        doctor: item.doctor,
        status: labApiToUiStatus[item.status] || item.status,
        accessionNumber: item.accession_number,
        answers,
        result: answers.map(answer => `${answer.name}: ${answer.result}`).join(" · "),
        unit: answers.map(answer => answer.unit).filter(Boolean).join(" · "),
        interpretation: answers.map(answer => answer.interpretation).filter(Boolean).join(" · "),
        createdAt: item.created_at,
        completedAt: item.completed_at
      };
    });
  const remoteImaging = remoteModuleData.imaging
    .filter(item => item.pet_name === name)
    .map(item => ({
      id: item.id,
      type: item.study_type,
      result: item.report || (item.status || "ثبت‌شده"),
      date: item.created_at || "",
      area: item.body_area,
      fileName: item.file_name,
      fileType: item.file_type,
      fileSize: item.file_size,
      fileData: item.file_data,
      status: item.status,
      priority: item.priority,
      reason: item.reason
    }));
  const remotePlans = remoteModuleData.nutrition
    .filter(item => item.pet_name === name)
    .sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
  const remoteMedicines = remoteModuleData.prescriptions
    .filter(item => item.pet_name === name)
    .map(item => [item.medicine, item.dose, item.duration, item.dispensed].filter(Boolean).join(" · "));
  const latestRemotePlan = remotePlans[0];
  let remoteNutrition = null;
  if (latestRemotePlan) {
    let plan = {};
    try { plan = typeof latestRemotePlan.plan_json === "string" ? JSON.parse(latestRemotePlan.plan_json) : (latestRemotePlan.plan_json || {}); } catch { plan = {}; }
    remoteNutrition = {
      title: `جیره ${latestRemotePlan.goal}`,
      formula: plan.formula || plan.limits || plan.generatedText || "برنامه تغذیه ثبت‌شده",
      calories: latestRemotePlan.mer || latestRemotePlan.calories ? `${latestRemotePlan.mer || latestRemotePlan.calories} کیلوکالری` : "ثبت نشده",
      review: latestRemotePlan.status || "پیش‌نویس",
      planId: latestRemotePlan.id,
      plan
    };
  }
  return {
    ...base,
    ...stored,
    allergies: asArray(stored.allergies).length ? stored.allergies : (asArray(base.allergies).length ? base.allergies : ["حساسیت دارویی ثبت نشده"]),
    labs: getUnifiedLabResultsForPet(name),
    imaging: remoteImaging.length ? remoteImaging : [...asArray(base.imaging), ...asArray(stored.imaging)],
    labRequests: remoteData.loaded ? remoteLabRequests : (asArray(stored.labRequests).length ? stored.labRequests : asArray(base.labRequests)),
    imagingRequests: [...asArray(base.imagingRequests), ...asArray(stored.imagingRequests)],
    followups: [...asArray(base.followups), ...asArray(stored.followups)],
    visits: remoteData.loaded ? remoteRecords : [...asArray(base.visits), ...asArray(stored.visits)],
    nutrition: {
      title: "جیره ثبت نشده است",
      formula: "برای این پت هنوز جیره‌ای ثبت نشده است.",
      calories: "—",
      review: "در انتظار اطلاعات",
      ...(base.nutrition || {}),
      ...(stored.nutrition || {}),
      ...(remoteNutrition || {})
    },
    medicines: remoteMedicines.length ? remoteMedicines : (Array.isArray(stored.medicines) && stored.medicines.length ? stored.medicines : (Array.isArray(base.medicines) && base.medicines.length ? base.medicines : ["داروی جاری ثبت نشده"])),
    notes: stored.notes || base.notes || "یادداشت بالینی ثبت نشده است."
  };
}

function parseLabResultJson(value) {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : (value || {});
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
}

function normalizeLabResult(item, answer = {}, source = "lab") {
  const flag = answer.flag || answer.status || "";
  const test = answer.testKey ? getLabTest(answer.testKey) : null;
  const species = speciesKey(answer.species || item.species);
  const range = test?.[species];
  const numericResult = Number(String(answer.result ?? answer.value ?? "").replace(",", "."));
  const calculatedFlag = !flag && range && Number.isFinite(numericResult)
    ? numericResult >= range[0] && numericResult <= range[1] ? "طبیعی" : "بحرانی"
    : flag;
  const normalizedStatus = answer.status === "danger" || answer.status === "critical" ? "danger"
    : answer.status === "success" || answer.status === "normal" ? "success"
      : calculatedFlag === "بحرانی" ? "danger"
        : calculatedFlag === "طبیعی" || calculatedFlag === "منفی" ? "success" : "warning";
  return {
    id: `${source}-${item.id || item.request_id || "local"}-${answer.testKey || answer.name || item.panel || "result"}`,
    requestId: item.request_id || item.id || null,
    name: answer.name || answer.label || item.panel || "نتیجه آزمایش",
    testKey: answer.testKey || "",
    result: answer.result ?? answer.value ?? answer.text ?? "—",
    unit: answer.unit || "",
    reference: answer.reference || (range ? `${range[0]} تا ${range[1]} ${test.unit || ""}`.trim() : ""),
    interpretation: answer.interpretation || answer.note || "",
    date: item.created_at || item.completed_at || "",
    species: answer.species || item.species || "",
    flag,
    status: normalizedStatus
  };
}

function remoteLabResults(petName, petId = null) {
  return remoteData.labs
    .filter(item => item.pet_name === petName || (petId && Number(item.pet_id) === Number(petId)))
    .flatMap(item => parseLabResultJson(item.result_json).map(answer => normalizeLabResult(item, answer, "lab")));
}

function getUnifiedLabResultsForPet(petName, petId = null) {
  const labRows = remoteLabResults(petName, petId);
  const requestRows = remoteData.labRequests
    .filter(item => (item.pet_name === petName || (petId && Number(item.pet_id) === Number(petId))) && item.status === "completed")
    .flatMap(item => parseLabResultJson(item.result_json).map(answer => normalizeLabResult(item, answer, "request")))
    .filter(row => !labRows.some(lab => (
      lab.requestId && row.requestId && lab.requestId === row.requestId &&
      (lab.testKey === row.testKey || lab.name === row.name) &&
      String(lab.result) === String(row.result)
    )));
  if (remoteData.loaded) return [...labRows, ...requestRows];

  const localLabs = value => Array.isArray(value) ? value : [];
  const local = [...localLabs((petClinicalData[petName] || {}).labs), ...localLabs((clinicalStore[petName] || {}).labs)]
    .map((answer, index) => normalizeLabResult(
      { id: `local-${petName}-${index}`, created_at: answer.date, species: state.pets.find(pet => pet.name === petName)?.species },
      answer,
      "local"
    ));
  const remote = [...labRows, ...requestRows];
  return [...remote, ...local.filter(row => !remote.some(item =>
    item.name === row.name && String(item.result) === String(row.result)
  ))];
}

function labFieldForResult(lab) {
  if (lab?.testKey) return lab.testKey;
  const match = flattenLaboratoryCatalog().find(test =>
    test.label === lab?.name || test.name === lab?.name || lab?.name?.includes(test.label || test.name)
  );
  return match?.testKey || match?.field || "";
}

function updateClinicalRecord(name, patch) {
  if (!name) return;
  clinicalStore[name] = { ...(clinicalStore[name] || {}), ...patch };
  saveClinicalStore();
}

const roleLabels = { customer: "مشتری", vet: "دامپزشک", admin: "مدیر سیستم" };
const roleNames = { customer: "پروفایل من", vet: "دامپزشک ناظر", admin: "ادمین سیستم" };
const customerSections = new Set(["dashboard", "customers", "pets"]);
const simpleHiddenSections = new Set(["reports", "settings"]);

function getUiMode() {
  const saved = localStorage.getItem("petclinic-ui-mode");
  if (saved === "simple" || saved === "professional") return saved;
  return session?.role === "customer" ? "simple" : "professional";
}

function applyUserPreferences() {
  const mode = getUiMode();
  const largeUi = localStorage.getItem("petclinic-font-scale") === "large";
  const highContrast = localStorage.getItem("petclinic-high-contrast") === "on";
  document.body.classList.toggle("simple-mode", mode === "simple");
  document.body.classList.toggle("professional-mode", mode === "professional");
  document.body.classList.toggle("large-ui", largeUi);
  document.body.classList.toggle("high-contrast", highContrast);
  const modeToggle = $("#uiModeToggle");
  if (modeToggle) {
    modeToggle.textContent = mode === "simple" ? "حالت ساده" : "حالت حرفه‌ای";
    modeToggle.setAttribute("aria-pressed", mode === "simple" ? "true" : "false");
    modeToggle.title = mode === "simple" ? "تغییر به حالت حرفه‌ای" : "تغییر به حالت ساده";
  }
  const guide = $("#simpleModeGuide");
  if (guide) guide.hidden = mode !== "simple" || isCustomerSession();
  $$(".nav-item").forEach(item => {
    const staffOnly = item.dataset.permission === "staff";
    const shopOnly = item.dataset.permission === "shop";
    item.hidden = (isCustomerSession() && (staffOnly || shopOnly))
      || (shopOnly && !isShopSession())
      || (isShopSellerSession() && !["dashboard", "pet-shop"].includes(item.dataset.section))
      || (!isCustomerSession() && mode === "simple" && simpleHiddenSections.has(item.dataset.section));
  });
  if (mode === "simple" && simpleHiddenSections.has(state.activeSection) && !isCustomerSession()) navigate("dashboard");
  const profileMode = $("#profileUiMode");
  if (profileMode) profileMode.value = mode;
  const profileLarge = $("#profileLargeUi");
  if (profileLarge) profileLarge.checked = largeUi;
  const profileContrast = $("#profileHighContrast");
  if (profileContrast) profileContrast.checked = highContrast;
}

function toggleUiMode() {
  localStorage.setItem("petclinic-ui-mode", getUiMode() === "simple" ? "professional" : "simple");
  applyUserPreferences();
  toast(getUiMode() === "simple" ? "حالت ساده فعال شد." : "حالت حرفه‌ای فعال شد.");
}

function currentCustomer() {
  return session?.role === "customer" ? state.customers.find(customer => customer.id === Number(session.customerId)) : null;
}

const petClinicalData = {
  "میلو": {
    diagnosis: "وضعیت عمومی پایدار",
    allergies: ["حساسیت دارویی شناخته‌شده ندارد", "حساسیت غذایی ثبت نشده"],
    labRequests: [{ id: "demo-milo-cbc", panel: "CBC / شمارش کامل سلول‌های خون", sample: "خون کامل", priority: "عادی", reason: "چکاپ دوره‌ای", status: "درخواست‌شده", createdAt: "امروز، ۰۹:۱۵" }],
    labs: [{ name: "CBC", result: "طبیعی", date: "۱۴۰۵/۰۵/۲۶", status: "success" }, { name: "ALT", result: "۴۵ U/L", date: "۱۴۰۵/۰۵/۲۶", status: "success" }],
    imaging: [{ type: "سونوگرافی شکم", result: "بدون یافته نگران‌کننده", date: "۱۴۰۵/۰۵/۲۰" }],
    nutrition: { title: "جیره نگهداری گربه بالغ", formula: "مرغ پخته ۴۰٪ · برنج ۲۵٪ · کدو ۱۵٪ · مکمل ویتامینی ۲۰٪", calories: "۲۶۰ کیلوکالری در روز", review: "تأیید شده توسط دامپزشک ناظر" },
    medicines: ["داروی جاری ندارد"],
    notes: "نیازمند کنترل وزن و چکاپ شش‌ماهه."
  },
  "راکی": {
    diagnosis: "نیازمند پیگیری عملکرد کلیه",
    allergies: ["حساسیت به پنی‌سیلین ثبت شده است", "حساسیت غذایی ثبت نشده"],
    labRequests: [{ id: "demo-raki-chemistry", panel: "بیوشیمی کامل", sample: "سرم", priority: "فوری", reason: "بررسی عملکرد کلیه", status: "در حال انجام", createdAt: "امروز، ۱۰:۴۵" }],
    labs: [{ name: "کراتینین", result: "۳.۸ mg/dL", date: "۱۴۰۵/۰۵/۲۸", status: "danger" }, { name: "CBC", result: "نیازمند تأیید پزشک", date: "۱۴۰۵/۰۵/۲۸", status: "warning" }],
    imaging: [{ type: "رادیولوژی قفسه سینه", result: "گزارش تأیید شده", date: "۱۴۰۵/۰۵/۲۷" }],
    nutrition: { title: "جیره درمانی کنترل فسفر", formula: "پروتئین محدود ۲۸٪ · کربوهیدرات ۳۵٪ · فیبر ۱۲٪ · مکمل کلیوی", calories: "۷۸۰ کیلوکالری در روز", review: "در انتظار بازبینی دامپزشک" },
    medicines: ["داروی فعلی: مکمل حمایت کلیه، طبق نسخه"],
    notes: "کنترل آب مصرفی و تکرار آزمایش در ۱۴ روز."
  },
  "پونه": {
    diagnosis: "مراقبت ویژه تغذیه‌ای",
    allergies: ["حساسیت دارویی ثبت نشده", "به یونجه بی‌کیفیت حساسیت گوارشی دارد"],
    labs: [{ name: "گلوکز", result: "۹۸ mg/dL", date: "۱۴۰۵/۰۵/۲۷", status: "success" }],
    imaging: [{ type: "سونوگرافی شکم", result: "نیازمند گزارش تکمیلی", date: "۱۴۰۵/۰۵/۲۵" }],
    nutrition: { title: "جیره پرفیبر خرگوش", formula: "یونجه باکیفیت ۵۵٪ · سبزی تازه ۳۰٪ · پلت کنترل‌شده ۱۵٪", calories: "۱۶۰ کیلوکالری در روز", review: "در انتظار تأیید" },
    medicines: ["داروی جاری ندارد"],
    notes: "مصرف فیبر و وضعیت دندان‌ها در هر مراجعه بررسی شود."
  }
};

function isCustomerSession() {
  return session?.role === "customer" && Boolean(currentCustomer());
}

Object.assign(roleLabels, { shop_seller: "فروشنده پت‌شاپ" });
Object.assign(roleNames, { shop_seller: "فروشنده پت‌شاپ" });

function isShopSession() {
  return session?.role === "shop_seller" || session?.role === "admin";
}

function isShopSellerSession() {
  return session?.role === "shop_seller";
}

const shopMoney = value => `${Number(value || 0).toLocaleString("fa-IR")} تومان`;

async function loadPetShopData() {
  if (!session?.token) return { products: [], sales: [], report: null, movements: [] };
  const results = await Promise.all([
    apiRequest("/shop/products?active=true"),
    apiRequest("/shop/sales"),
    apiRequest("/shop/reports/summary"),
    apiRequest("/shop/stock-movements")
  ]);
  return {
    products: results[0].items || [],
    sales: results[1].items || [],
    report: results[2].report || {},
    movements: results[3].items || []
  };
}

function shopCartTotal() {
  return shopCart.reduce((sum, item) => sum + Number(item.unit_price || 0) * Number(item.quantity || 0), 0);
}

let shopActiveModule = "shop-dashboard";

const shopModules = [
  ["shop-dashboard", "داشبورد", "▦"],
  ["shop-products", "کالاها و کاتالوگ", "▤"],
  ["shop-inventory", "انبارگردانی", "◫"],
  ["shop-sales", "فروش و صندوق", "▣"],
  ["shop-invoices", "فاکتورها", "▧"],
  ["shop-reports", "گزارش‌ها", "◌"]
];

function renderShopSidebar() {
  return `<aside class="shop-sidebar">
    <div class="shop-brand"><div class="shop-brand-mark">🛒</div><div><strong>پت‌شاپ پرو</strong><span>مدیریت فروش و انبار</span></div></div>
    <div class="shop-operator"><div class="shop-operator-avatar">ف</div><div><strong>${escapeHtml(session?.name || "فروشنده پت‌شاپ")}</strong><span>حساب فروشنده</span></div><i>●</i></div>
    <nav class="shop-nav" aria-label="منوی فروشگاه">
      <small class="shop-nav-label">مدیریت فروشگاه</small>
      ${shopModules.map(([id, label, icon]) => `<button type="button" class="shop-nav-item ${shopActiveModule === id ? "active" : ""}" data-shop-module="${id}"><span>${icon}</span><b>${label}</b>${id === "shop-sales" ? `<em>POS</em>` : ""}</button>${id === "shop-products" ? `<div class="shop-products-submenu"><button type="button" class="shop-new-product" data-shop-action="new-product">＋ ثبت کالای جدید</button><button type="button" data-shop-action="product-list">فهرست کالاها</button></div>` : ""}`).join("")}
    </nav>
    <div class="shop-sidebar-footer"><div class="shop-security"><span>✓</span><div><strong>سیستم امن و فعال</strong><small>آخرین همگام‌سازی همین الان</small></div></div><button type="button" class="shop-exit" id="shopExitClinic">↩ بازگشت به کلینیک</button></div>
  </aside>`;
}

function focusShopProductForm() {
  shopActiveModule = "shop-products";
  renderPetShopWorkspace();
  window.setTimeout(() => {
    const form = $("#shopProductForm");
    form?.scrollIntoView({ behavior: "smooth", block: "start" });
    form?.querySelector("input[name='name']")?.focus();
  }, 250);
}

function shopSectionTitle(eyebrow, title, description, action = "") {
  return `<div class="shop-page-header"><div><div class="shop-eyebrow">${eyebrow}</div><h1>${title}</h1><p>${description}</p></div>${action}</div>`;
}

function shopProductRows(products) {
  return products.map(item => `<tr><td><div class="shop-product-name"><span>${escapeHtml((item.name || "ک").slice(0, 1))}</span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.brand || item.category || "بدون دسته‌بندی")}</small></div></td><td><code>${escapeHtml(item.barcode)}</code></td><td>${shopMoney(item.purchase_price)}</td><td>${shopMoney(item.sale_price)}</td><td><strong>${item.stock}</strong> ${escapeHtml(item.unit)}</td><td><span class="status ${Number(item.stock) <= Number(item.reorder_level) ? "warning" : "success"}">${Number(item.stock) <= Number(item.reorder_level) ? "نیازمند تأمین" : "موجود"}</span></td><td><button class="text-button shop-edit-product" data-product-id="${item.id}">ویرایش</button></td></tr>`).join("");
}

function renderShopModule(module, data) {
  const section = $('.page-section[data-view="pet-shop"]');
  const body = $("#shopModuleBody", section);
  if (!body) return;
  const products = data.products || [];
  const report = data.report || {};
  const productOptions = products.map(item => `<option value="${item.id}">${escapeHtml(item.name)} · ${escapeHtml(item.barcode)} · موجودی ${item.stock}</option>`).join("");
  const rows = shopProductRows(products);
  const salesRows = (data.sales || []).map(sale => `<div class="shop-sale-row"><span><strong>${escapeHtml(sale.invoice_number)}</strong><small>${escapeHtml(sale.customer_name || "مشتری آزاد")} · ${escapeHtml(sale.created_at || "")}</small></span><b>${shopMoney(sale.total)}</b><span class="status ${sale.status === "completed" ? "success" : "warning"}">${sale.status === "completed" ? "تکمیل‌شده" : sale.status === "returned" ? "مرجوع‌شده" : escapeHtml(sale.status)}</span>${sale.status === "completed" ? `<button class="text-button shop-return-sale" data-sale-id="${sale.id}">مرجوعی</button>` : ""}</div>`).join("") || `<div class="shop-empty">هنوز فروشی ثبت نشده است.</div>`;
  const invoiceRows = (data.sales || []).map(sale => `<article class="shop-invoice-row" data-invoice-search="${escapeHtml(`${sale.invoice_number} ${sale.customer_name || ""} ${sale.customer_phone || ""}`.toLowerCase())}"><div class="shop-invoice-icon">▧</div><div class="shop-invoice-main"><strong>${escapeHtml(sale.invoice_number)}</strong><small>${escapeHtml(sale.customer_name || "مشتری آزاد")} · ${escapeHtml(sale.customer_phone || "بدون تلفن")} · ${escapeHtml(sale.created_at || "")}</small><span>${(sale.items || []).length} قلم کالا · پرداخت ${escapeHtml(sale.payment_method || "نقدی")}</span></div><div><b>${shopMoney(sale.total)}</b><small>سود ${shopMoney(sale.profit)}</small></div><span class="status ${sale.status === "completed" ? "success" : "warning"}">${sale.status === "completed" ? "تکمیل‌شده" : sale.status === "returned" ? "مرجوع‌شده" : escapeHtml(sale.status)}</span><div class="shop-invoice-actions">${sale.status === "completed" ? `<button class="text-button shop-return-sale" data-sale-id="${sale.id}">مرجوعی</button>` : ""}<button class="text-button shop-print-invoice" data-sale-id="${sale.id}">چاپ</button></div></article>`).join("") || `<div class="shop-empty">فاکتوری ثبت نشده است.</div>`;
  const cartRows = shopCart.map((item, index) => `<div class="shop-cart-row"><span>${escapeHtml(item.name)}<small>${item.quantity} × ${shopMoney(item.unit_price)}</small></span><strong>${shopMoney(item.quantity * item.unit_price)}</strong><button type="button" class="row-more shop-remove-cart" data-cart-index="${index}">×</button></div>`).join("") || `<div class="shop-empty">سبد خرید خالی است.</div>`;
  const kpis = `<div class="shop-kpi-grid"><div class="shop-kpi teal"><span>درآمد کل</span><strong>${shopMoney(report.revenue)}</strong><small>فروش تکمیل‌شده</small></div><div class="shop-kpi purple"><span>سود ناخالص</span><strong>${shopMoney(report.profit)}</strong><small>حاشیه سود فعلی</small></div><div class="shop-kpi orange"><span>فاکتورهای فروش</span><strong>${report.sales_count || 0}</strong><small>ثبت‌شده در سیستم</small></div><div class="shop-kpi red"><span>هشدار موجودی</span><strong>${report.low_stock_count || 0}</strong><small>نیازمند تأمین</small></div></div>`;
  const shopGreeting = escapeHtml(session?.name || "فروشنده");
  let html = "";
  if (module === "shop-dashboard") {
    html = `${shopSectionTitle("مرکز کنترل فروشگاه", `سلام، ${shopGreeting} 👋`, "عملیات فروش، موجودی و عملکرد پت‌شاپ را از یک صفحه کنترل کنید.", `<button class="shop-refresh" id="shopRefresh">↻ بروزرسانی</button>`)}${kpis}<div class="shop-dashboard-grid"><div class="shop-card"><div class="shop-section-title"><div><h2>آخرین فاکتورها</h2><p>آخرین فعالیت‌های فروشگاه</p></div><button class="shop-link" data-shop-target="shop-invoices">مشاهده همه ←</button></div><div class="shop-sales-list">${salesRows}</div></div><div class="shop-card shop-quick-card"><div class="shop-section-title"><div><h2>دسترسی سریع</h2><p>عملیات پرتکرار صندوق‌دار</p></div></div><div class="shop-quick-actions"><button type="button" data-shop-target="shop-sales"><span>▣</span><b>فروش جدید</b><small>ثبت فاکتور و دریافت وجه</small></button><button type="button" data-shop-action="new-product"><span>＋</span><b>ثبت کالای جدید</b><small>افزودن به کاتالوگ</small></button><button type="button" data-shop-target="shop-inventory"><span>◫</span><b>ورود به انبار</b><small>ثبت خرید و اصلاح موجودی</small></button></div></div></div>`;
  } else if (module === "shop-products") {
    html = `${shopSectionTitle("کاتالوگ و قیمت‌گذاری", "کالاها و کاتالوگ", "کالاها، بارکد، SKU، قیمت خرید و فروش را حرفه‌ای مدیریت کنید.", `<button class="shop-refresh" id="shopRefresh">↻ بروزرسانی</button>`)}<div class="shop-card shop-form-card"><div class="shop-section-title"><div><h2>ثبت کالای جدید</h2><p>اطلاعات کالا را کامل و دقیق وارد کنید.</p></div><span class="shop-badge">کاتالوگ</span></div><form id="shopProductForm" class="shop-form-grid shop-product-form"><label>نام کالا<input name="name" placeholder="مثلاً غذای خشک سگ" required /></label><label>بارکد<input name="barcode" placeholder="6260000000000" required /></label><label>SKU<input name="sku" placeholder="SKU-001" /></label><label>دسته‌بندی<input name="category" placeholder="غذا، اسباب‌بازی..." /></label><label>برند<input name="brand" placeholder="برند کالا" /></label><label>واحد<input name="unit" value="عدد" /></label><label>قیمت خرید<input name="purchase_price" type="number" min="0" placeholder="۰" required /></label><label>قیمت فروش<input name="sale_price" type="number" min="0" placeholder="۰" required /></label><label>حد سفارش<input name="reorder_level" type="number" min="0" value="0" /></label><div class="shop-form-submit"><button class="button primary" type="submit">＋ ثبت کالا</button></div></form></div><div class="shop-card shop-products-card"><div class="shop-section-title"><div><h2>فهرست کالاها</h2><p>${products.length} کالا در کاتالوگ فعال است.</p></div><label class="shop-search">⌕<input id="shopProductSearch" placeholder="نام، SKU یا بارکد..." /></label></div><div class="shop-table-wrap"><table class="shop-table"><thead><tr><th>کالا</th><th>بارکد</th><th>خرید</th><th>فروش</th><th>موجودی</th><th>وضعیت</th><th></th></tr></thead><tbody id="shopProductRows">${rows || `<tr><td colspan="7"><div class="shop-empty">کالایی ثبت نشده است.</div></td></tr>`}</tbody></table></div></div>`;
  } else if (module === "shop-inventory") {
    const movementRows = (data.movements || []).slice(0, 15).map(item => `<div class="shop-movement-row"><span><strong>${escapeHtml(item.product_name || "کالا")}</strong><small>${escapeHtml(item.reference || item.movement_type || "")}</small></span><b class="${Number(item.quantity) < 0 ? "negative" : "positive"}">${Number(item.quantity) > 0 ? "+" : ""}${item.quantity}</b><span>${escapeHtml(item.created_at || "")}</span></div>`).join("") || `<div class="shop-empty">گردش انباری ثبت نشده است.</div>`;
    html = `${shopSectionTitle("کنترل موجودی و تأمین", "انبارگردانی", "ورود کالا، اصلاح موجودی و گردش انبار را با ردپای کامل ثبت کنید.", `<button class="shop-refresh" id="shopRefresh">↻ بروزرسانی</button>`)}<div class="shop-card shop-form-card"><div class="shop-section-title"><div><h2>ثبت گردش انبار</h2><p>خرید، اصلاح موجودی یا مرجوعی خرید</p></div><span class="shop-badge">انبار</span></div><form id="shopStockForm" class="shop-form-grid shop-stock-form"><label>کالا<select name="product_id" required>${productOptions}</select></label><label>نوع گردش<select name="movement_type"><option value="purchase">خرید</option><option value="adjustment">اصلاح موجودی</option><option value="return">مرجوعی خرید</option></select></label><label>تعداد<input name="quantity" type="number" min="0.001" step="0.001" placeholder="تعداد" required /></label><label>قیمت واحد<input name="unit_cost" type="number" min="0" placeholder="قیمت خرید" /></label><label>رسید یا مرجع<input name="reference" placeholder="شماره رسید یا فاکتور" /></label><div class="shop-form-submit"><button class="button primary" type="submit">＋ ثبت گردش</button></div></form></div><div class="shop-card"><div class="shop-section-title"><div><h2>آخرین گردش‌های انبار</h2><p>۱۵ گردش اخیر برای کنترل و حسابرسی</p></div></div><div class="shop-movement-list">${movementRows}</div></div>`;
  } else if (module === "shop-sales") {
    html = `${shopSectionTitle("صندوق و فروش", "فروش جدید", "با جستجوی سریع کالا، فاکتور استاندارد صادر و فروش را ثبت کنید.", `<span class="shop-pos-status"><i></i> صندوق آنلاین</span>`)}<div class="shop-sales-layout"><div class="shop-card shop-sale-card"><div class="shop-section-title"><div><h2>افزودن به سبد خرید</h2><p>کالا و تعداد را انتخاب کنید.</p></div><span class="shop-badge">POS</span></div><form id="shopCartForm" class="shop-form-grid"><label>کالا<select name="product_id" required>${productOptions}</select></label><label>تعداد<input name="quantity" type="number" min="0.001" step="0.001" value="1" required /></label><div class="shop-form-submit"><button class="button ghost" type="submit">＋ افزودن به سبد</button></div></form><div class="shop-cart">${cartRows}</div><div class="shop-cart-total"><span>جمع سبد</span><strong>${shopMoney(shopCartTotal())}</strong></div><form id="shopSaleForm" class="shop-form-grid shop-checkout-form shop-sale-form"><label>نام مشتری<input name="customer_name" placeholder="اختیاری" /></label><label>تلفن مشتری<input name="customer_phone" placeholder="۰۹..." /></label><label>روش پرداخت<select name="payment_method"><option value="cash">نقدی</option><option value="card">کارت‌خوان</option><option value="transfer">انتقال بانکی</option></select></label><label>تخفیف<input name="discount" type="number" min="0" value="0" /></label><label>مالیات درصدی<input name="tax_percent" type="number" min="0" value="0" /></label><div class="shop-form-submit"><button class="button primary" type="submit">ثبت و صدور فاکتور</button></div></form></div><div class="shop-card"><div class="shop-section-title"><div><h2>فاکتورهای اخیر</h2><p>پیگیری فروش و مرجوعی</p></div></div><div class="shop-sales-list">${salesRows}</div></div></div>`;
  } else if (module === "shop-invoices") {
    html = `${shopSectionTitle("اسناد مالی فروشگاه", "فاکتورها", "تمام فاکتورهای صادرشده را جستجو، پیگیری، چاپ و در صورت نیاز مرجوع کنید.", `<button class="shop-refresh" id="shopRefresh">↻ بروزرسانی</button>`)}<div class="shop-card shop-invoices-card"><div class="shop-section-title"><div><h2>دفتر فاکتورها</h2><p>${(data.sales || []).length} فاکتور در سیستم ثبت شده است.</p></div><label class="shop-search"><span>⌕</span><input id="shopInvoiceSearch" class="shop-invoice-search" placeholder="شماره فاکتور، نام یا تلفن مشتری..." /></label></div><div id="shopInvoiceList" class="shop-invoice-list">${invoiceRows}</div></div>`;
  } else {
    html = `${shopSectionTitle("تحلیل عملکرد", "گزارش‌های فروشگاه", "درآمد، سود، فروش و هشدارهای موجودی را شفاف و قابل پیگیری ببینید.", `<button class="shop-refresh" id="shopRefresh">↻ بروزرسانی</button>`)}${kpis}<div class="shop-card"><div class="shop-section-title"><div><h2>خلاصه عملکرد</h2><p>شاخص‌های کلیدی فروشگاه بر اساس اطلاعات ثبت‌شده</p></div></div><div class="shop-report-grid"><div><span>تعداد کالاهای فعال</span><strong>${products.length}</strong></div><div><span>تعداد گردش انبار</span><strong>${(data.movements || []).length}</strong></div><div><span>آخرین فروش</span><strong>${data.sales?.[0] ? shopMoney(data.sales[0].total) : "—"}</strong></div><div><span>وضعیت انبار</span><strong>${report.low_stock_count ? "نیازمند تأمین" : "مطلوب"}</strong></div></div></div>`;
  }
  body.innerHTML = html;
  bindPetShopEvents(section, data);
  $$(".shop-nav-item", section).forEach(button => button.addEventListener("click", () => {
    shopActiveModule = button.dataset.shopModule;
    renderShopModule(shopActiveModule, data);
  }));
  $$("[data-shop-action]", section).forEach(button => button.addEventListener("click", () => {
    if (button.dataset.shopAction === "new-product") return focusShopProductForm();
    shopActiveModule = "shop-products";
    renderShopModule(shopActiveModule, data);
    window.setTimeout(() => $("#shopProductSearch", section)?.focus(), 100);
  }));
  $("#shopExitClinic", section)?.addEventListener("click", () => {
    document.body.classList.remove("shop-mode");
    shopActiveModule = "shop-dashboard";
    navigate("dashboard");
  });
  $$(".shop-nav-item", section).forEach(button => button.classList.toggle("active", button.dataset.shopModule === module));
  $$("[data-shop-target]", section).forEach(button => button.addEventListener("click", () => { shopActiveModule = button.dataset.shopTarget; renderShopModule(shopActiveModule, data); }));
}

async function renderPetShopWorkspace() {
  const section = $('.page-section[data-view="pet-shop"]');
  if (!section || !isShopSession()) return;
  section.innerHTML = `<div class="shop-page-shell">${renderShopSidebar()}<div class="shop-main"><div id="shopModuleBody"><div class="shop-empty">در حال بارگذاری اطلاعات فروشگاه...</div></div></div></div>`;
  try {
    const data = await loadPetShopData();
    remoteModuleData.shopProducts = data.products;
    remoteModuleData.shopSales = data.sales;
    remoteModuleData.shopReport = data.report;
    renderShopModule(shopActiveModule, data);
  } catch (error) {
    $("#shopModuleBody", section).innerHTML = `<div class="health-alert"><strong>خطا در دریافت اطلاعات فروشگاه</strong><p>${escapeHtml(error.message)}</p></div>`;
  }
}

function bindPetShopEvents(section, data) {
  $("#shopRefresh", section)?.addEventListener("click", () => renderPetShopWorkspace());
  $("#shopProductSearch", section)?.addEventListener("input", event => {
    const term = event.target.value.trim().toLowerCase();
    $$("#shopProductRows tr", section).forEach(row => row.hidden = !row.textContent.toLowerCase().includes(term));
  });
  $("#shopInvoiceSearch", section)?.addEventListener("input", event => {
    const term = event.target.value.trim().toLowerCase();
    $$("#shopInvoiceList .shop-invoice-row", section).forEach(row => row.hidden = !row.dataset.invoiceSearch.includes(term));
  });
  $("#shopProductForm", section)?.addEventListener("submit", async event => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    ["purchase_price", "sale_price", "reorder_level"].forEach(key => payload[key] = Number(payload[key] || 0));
    try { await apiRequest("/shop/products", { method: "POST", body: JSON.stringify(payload) }); toast("کالا با موفقیت ثبت شد."); renderPetShopWorkspace(); }
    catch (error) { toast(error.message); }
  });
  $("#shopStockForm", section)?.addEventListener("submit", async event => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    payload.product_id = Number(payload.product_id); payload.quantity = Number(payload.quantity); payload.unit_cost = Number(payload.unit_cost || 0);
    try { await apiRequest("/shop/stock-movements", { method: "POST", body: JSON.stringify(payload) }); toast("گردش انبار ثبت شد."); renderPetShopWorkspace(); }
    catch (error) { toast(error.message); }
  });
  $("#shopCartForm", section)?.addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const product = (data.products || []).find(item => item.id === Number(form.get("product_id")));
    const quantity = Number(form.get("quantity"));
    if (!product || !quantity || quantity <= 0) return toast("کالا و تعداد معتبر انتخاب کنید.");
    const current = shopCart.find(item => item.product_id === product.id);
    if (current) current.quantity += quantity;
    else shopCart.push({ product_id: product.id, name: product.name, quantity, unit_price: Number(product.sale_price), unit_cost: Number(product.purchase_price) });
    renderPetShopWorkspace();
  });
  $$(".shop-remove-cart", section).forEach(button => button.addEventListener("click", () => { shopCart.splice(Number(button.dataset.cartIndex), 1); renderPetShopWorkspace(); }));
  $("#shopSaleForm", section)?.addEventListener("submit", async event => {
    event.preventDefault();
    if (!shopCart.length) return toast("سبد خرید خالی است.");
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    payload.discount = Number(payload.discount || 0); payload.tax_percent = Number(payload.tax_percent || 0);
    payload.items = shopCart.map(item => ({ product_id: item.product_id, quantity: item.quantity }));
    try { const result = await apiRequest("/shop/sales", { method: "POST", body: JSON.stringify(payload) }); shopCart = []; toast(`فاکتور ${result.item.invoice_number} ثبت شد.`); renderPetShopWorkspace(); }
    catch (error) { toast(error.message); }
  });
  $$(".shop-return-sale", section).forEach(button => button.addEventListener("click", async () => {
    if (!window.confirm("این فاکتور مرجوع و موجودی به انبار بازگردانده شود؟")) return;
    try { await apiRequest(`/shop/sales/${button.dataset.saleId}/return`, { method: "POST", body: "{}" }); toast("مرجوعی ثبت شد."); renderPetShopWorkspace(); }
    catch (error) { toast(error.message); }
  }));
  $$(".shop-print-invoice", section).forEach(button => button.addEventListener("click", () => {
    const sale = (data.sales || []).find(item => item.id === Number(button.dataset.saleId));
    if (!sale) return;
    const lines = (sale.items || []).map(item => `<tr><td>${escapeHtml(item.product_name || item.name || "کالا")}</td><td>${item.quantity}</td><td>${shopMoney(item.unit_price)}</td><td>${shopMoney(item.subtotal)}</td></tr>`).join("");
    const printWindow = window.open("", "_blank", "width=850,height=700");
    if (!printWindow) return toast("پنجره چاپ توسط مرورگر مسدود شده است.");
    printWindow.document.write(`<html dir="rtl"><head><meta charset="utf-8"><title>فاکتور ${escapeHtml(sale.invoice_number)}</title><style>body{font-family:Tahoma,Arial;padding:28px;color:#102a43}h1{font-size:22px}p{font-size:12px;color:#607780}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #cddde0;padding:9px;text-align:right;font-size:12px}th{background:#edf7f6}.total{margin-top:18px;text-align:left;font-size:16px;font-weight:bold}.sign{display:flex;justify-content:space-between;margin-top:55px;font-size:11px}</style></head><body><h1>فاکتور فروش پت‌شاپ</h1><p>شماره فاکتور: <b>${escapeHtml(sale.invoice_number)}</b> · تاریخ: ${escapeHtml(sale.created_at || "—")}</p><p>مشتری: ${escapeHtml(sale.customer_name || "مشتری آزاد")} · تلفن: ${escapeHtml(sale.customer_phone || "—")}</p><table><thead><tr><th>کالا</th><th>تعداد</th><th>قیمت واحد</th><th>جمع</th></tr></thead><tbody>${lines || "<tr><td colspan='4'>قلمی ثبت نشده است.</td></tr>"}</tbody></table><div class="total">جمع کل: ${shopMoney(sale.total)}</div><p>تخفیف: ${shopMoney(sale.discount)} · مالیات: ${shopMoney(sale.tax)} · روش پرداخت: ${escapeHtml(sale.payment_method || "نقدی")}</p><div class="sign"><span>امضای مشتری: ................</span><span>مهر فروشگاه: ................</span></div><script>window.onload=()=>window.print();</script></body></html>`);
    printWindow.document.close();
  }));
  $$(".shop-edit-product", section).forEach(button => button.addEventListener("click", async () => {
    const product = (data.products || []).find(item => item.id === Number(button.dataset.productId));
    if (!product) return;
    const sale = window.prompt("قیمت فروش جدید را وارد کنید:", product.sale_price);
    if (sale === null) return;
    try { await apiRequest(`/shop/products/${product.id}`, { method: "PATCH", body: JSON.stringify({ sale_price: Number(sale) }) }); toast("قیمت کالا ویرایش شد."); renderPetShopWorkspace(); }
    catch (error) { toast(error.message); }
  }));
}

function populateLoginCustomers() {
  const select = $("#loginCustomer");
  if (!select) return;
  select.innerHTML = state.customers.map(customer => `<option value="${customer.id}">${customer.name} · ${customer.phone}</option>`).join("");
}

function setLoginRole(role) {
  $$(".role-card").forEach(card => card.classList.toggle("active", card.dataset.loginRole === role));
  $("#customerAccountField")?.classList.toggle("hidden-field", role !== "customer");
  $("#loginEmailField")?.classList.toggle("hidden-field", role === "customer");
  const submit = $(".login-submit");
  if (submit) submit.innerHTML = `ورود به ${role === "customer" ? "پنل مشتری" : role === "vet" ? "پنل دامپزشک" : role === "shop_seller" ? "پنل پت‌شاپ" : "پنل ادمین"} <span>←</span>`;
  $("#loginForm").dataset.role = role;
}

function renderCustomerDashboard() {
  if (!isCustomerSession()) return;
  const customer = currentCustomer();
  const dashboard = $('.page-section[data-view="dashboard"]');
  if (!dashboard) return;
  dashboard.innerHTML = `
    <div class="page-heading"><div><div class="eyebrow">حساب شخصی شما</div><h1>سلام ${customer.name} 👋</h1><p>در این پنل فقط اطلاعات حساب و حیوانات متعلق به شما نمایش داده می‌شود.</p></div><button class="button primary" id="customerAddPet">＋ معرفی پت جدید</button></div>
    <div class="customer-dashboard">
      <div class="customer-welcome"><div class="eyebrow">پروفایل مشتری</div><h2>${customer.name}</h2><p>${customer.phone}<br />${customer.email}<br /><br />تعداد پت‌های ثبت‌شده: <strong>${customer.pets.length}</strong></p><button class="button ghost" id="customerViewProfile">مشاهده پروفایل من</button></div>
      <div class="customer-summary-card"><h3>پت‌های من</h3>${customer.pets.map(pet => `<button class="my-pet-row pet-summary-trigger" data-pet-name="${pet.name}"><div class="pet-avatar ${pet.species === "گربه" ? "cat" : pet.species === "خرگوش" ? "rabbit" : "dog"}">${pet.species === "گربه" ? "🐱" : pet.species === "خرگوش" ? "🐰" : "🐶"}</div><div><strong>${pet.name}</strong><small>${pet.species} · ${pet.breed} · ${pet.age}</small></div><span>←</span></button>`).join("") || `<p class="empty-copy">هنوز حیوانی ثبت نشده است.</p>`}</div>
    </div>
    <div class="workspace-grid two customer-private-cards"><div class="workspace-card"><div class="workspace-toolbar"><div><h2>نوبت‌های من</h2><p>اطلاعات عمومی نوبت‌های اختصاصی شما</p></div><span class="status success">فعال</span></div><div class="metric-line"><span>نوبت بعدی</span><b>امروز، ۱۲:۰۰</b><em>ویزیت تغذیه</em></div><div class="metric-line"><span>کل مراجعه‌ها</span><b>${customer.pets.length + 2}</b><em>در پرونده شما</em></div></div><div class="workspace-card"><div class="workspace-toolbar"><div><h2>پیام‌های کلینیک</h2><p>اطلاع‌رسانی‌های مرتبط با حساب شما</p></div></div><div class="health-alert"><span>✓</span><div><strong>پرونده شما کامل است</strong><p>برای مشاهده جزئیات پزشکی با کلینیک تماس بگیرید.</p></div></div></div></div>`;
  $("#customerAddPet")?.addEventListener("click", () => openPetModal(customer.name));
  $("#customerViewProfile")?.addEventListener("click", () => navigate("customers"));
  $$(".pet-summary-trigger").forEach(button => button.addEventListener("click", () => openPetSummary(button.dataset.petName)));
}

function findPetByName(name) {
  return state.pets.find(pet => pet.name === name && (!isCustomerSession() || pet.owner === currentCustomer()?.name)) || currentCustomer()?.pets.find(pet => pet.name === name);
}

function openPetSummary(name) {
  const pet = findPetByName(name);
  if (!pet) return toast("این پرونده برای حساب شما قابل مشاهده نیست.");
  const clinical = getPetClinicalRecord(pet.name);
  /*
    diagnosis: "اطلاعات تشخیصی هنوز ثبت نشده است",
    allergies: ["حساسیت دارویی ثبت نشده"],
    labs: [],
    imaging: [],
    nutrition: { title: "جیره هنوز ساخته نشده است", formula: "—", calories: "—", review: "در انتظار اطلاعات" },
    medicines: ["داروی جاری ثبت نشده است"],
    notes: pet.note || "یادداشت بالینی ثبت نشده است."
  };
  */
  $("#petSummaryContent").innerHTML = `
    <div class="summary-header"><div class="pet-avatar ${pet.typeClass || "dog"}">${pet.emoji || "🐾"}</div><div><div class="eyebrow">خلاصه پرونده سلامت</div><h2>${pet.name}</h2><p>${pet.species} · ${pet.breed} · ${pet.age} · ${pet.weight}</p></div><span class="status ${pet.statusClass || "blue-status"}">${pet.status || "پرونده فعال"}</span></div>
    <div class="summary-owner"><span>صاحب حیوان</span><strong>${pet.owner || currentCustomer()?.name || "ثبت نشده"}</strong><span>تشخیص/وضعیت فعلی</span><strong>${clinical.diagnosis}</strong></div>
    <div class="summary-section"><div class="summary-section-title"><h3>حساسیت‌های دارویی و غذایی</h3><span>⚠</span></div><div class="summary-tags">${clinical.allergies.map(item => `<span class="summary-tag allergy">${item}</span>`).join("")}</div></div>
    <div class="summary-columns"><div class="summary-section"><div class="summary-section-title"><h3>آخرین آزمایش‌ها</h3><span>⌁</span></div>${clinical.labs.length ? clinical.labs.map(item => `<div class="summary-list-row"><span><b>${item.name}</b><small>${item.date}</small></span><strong class="${item.status === "danger" ? "danger-text" : ""}">${item.result}</strong><em class="status ${item.status === "danger" ? "danger" : item.status === "warning" ? "warning" : "success"}">${item.status === "danger" ? "بحرانی" : item.status === "warning" ? "نیازمند بررسی" : "طبیعی"}</em></div>`).join("") : "<p class='empty-copy'>آزمایشی ثبت نشده است.</p>"}</div><div class="summary-section"><div class="summary-section-title"><h3>رادیولوژی و سونوگرافی</h3><span>◉</span></div>${clinical.imaging.length ? clinical.imaging.map(item => `<div class="summary-list-row"><span><b>${item.type}</b><small>${item.date}${item.fileName ? ` · ${item.fileName}` : ""}${item.area ? ` · ${item.area}` : ""}</small></span><strong>${item.result}</strong></div>`).join("") : "<p class='empty-copy'>مطالعه تصویربرداری ثبت نشده است.</p>"}</div></div>
    <div class="summary-section nutrition-summary"><div class="summary-section-title"><h3>فرمول تغذیه</h3><span>✣</span></div><strong>${clinical.nutrition.title}</strong><p>${clinical.nutrition.formula}</p><div class="nutrition-meta"><span>نیاز انرژی: <b>${clinical.nutrition.calories}</b></span><span class="status ${clinical.nutrition.review.includes("در انتظار") ? "warning" : "success"}">${clinical.nutrition.review}</span></div></div>
    <div class="summary-section"><div class="summary-section-title"><h3>داروها و یادداشت بالینی</h3><span>✚</span></div><p>${clinical.medicines.join(" · ")}</p><p>${clinical.notes}</p></div>`;
  openModal("#petSummaryModal");
}

function applyAccessControl() {
  const loginScreen = $("#loginScreen");
  const appShell = $(".app-shell");
  if (session?.role === "customer" && !currentCustomer()) {
    session = null;
    localStorage.removeItem("petclinic-session");
  }
  if (!session) {
    loginScreen?.classList.remove("hidden");
    appShell?.classList.add("locked-app");
    return;
  }
  loginScreen?.classList.add("hidden");
  appShell?.classList.remove("locked-app");
  document.body.classList.toggle("customer-mode", isCustomerSession());
  if ($("#addCustomerButton")) $("#addCustomerButton").hidden = isCustomerSession();
  const user = currentCustomer();
  $("#sessionUserName").textContent = user?.name || (session.role === "vet" ? "دکتر پارسا" : "مریم احمدی");
  $("#sessionUserRole").textContent = roleNames[session.role];
  const customerNav = $('[data-section="customers"]');
  const petsNav = $('[data-section="pets"]');
  if (isCustomerSession()) {
    if (customerNav) customerNav.innerHTML = "<span>♙</span> پروفایل من";
    if (petsNav) petsNav.innerHTML = "<span>♡</span> پت‌های من";
    $("#globalSearch").placeholder = "جستجوی پت‌های من...";
    state.selectedCustomer = currentCustomer();
    renderCustomerDashboard();
    renderCustomerPreview();
  } else {
    if (customerNav) customerNav.innerHTML = "<span>♙</span> مشتریان";
    if (petsNav) petsNav.innerHTML = "<span>♡</span> پرونده حیوانات";
  }
  applyUserPreferences();
}

function initializeLogin() {
  populateLoginCustomers();
  setLoginRole("customer");
  $$(".role-card").forEach(card => card.addEventListener("click", () => setLoginRole(card.dataset.loginRole)));
  $$(".role-card").forEach(card => card.addEventListener("click", () => {
    if (card.dataset.loginRole === "shop_seller") $(".login-submit").innerHTML = "ورود به پنل پت‌شاپ <span>←</span>";
  }));
  $("#loginForm")?.addEventListener("submit", async event => {
    event.preventDefault();
    const role = event.currentTarget.dataset.role || "customer";
    if (role === "shop_seller" && !$("#loginEmail").value.trim()) $("#loginEmail").value = "shopkeeper@petclinic.local";
    if ($("#loginPassword").value !== "123456") return toast("رمز عبور آزمایشی باید ۱۲۳۴۵۶ باشد.");
    if (role !== "customer") {
      const email = $("#loginEmail").value.trim() || (role === "vet" ? "vet@petclinic.local" : role === "shop_seller" ? "shopkeeper@petclinic.local" : "admin@petclinic.local");
      try {
        const result = await apiRequest("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password: $("#loginPassword").value })
        });
        session = { ...result.user, token: result.token, loginAt: new Date().toISOString() };
        await loadRemoteData();
      } catch (error) {
        return toast(error.message);
      }
    } else {
      session = { role, customerId: Number($("#loginCustomer").value), loginAt: new Date().toISOString() };
    }
    localStorage.setItem("petclinic-session", JSON.stringify(session));
    applyAccessControl();
    navigate(role === "shop_seller" ? "pet-shop" : "dashboard");
    toast(`ورود موفق به ${roleLabels[role]}`);
  });
  applyAccessControl();
  if (isShopSellerSession()) navigate("pet-shop");
}

const sectionNames = {
  dashboard: "نمای کلی", customers: "مشتریان", pets: "پرونده حیوانات", appointments: "نوبت‌ها",
  records: "پرونده پزشکی", laboratory: "آزمایشگاه", imaging: "تصویربرداری", nutrition: "جیره‌سازی هوشمند",
  reports: "گزارش‌ها", settings: "تنظیمات"
};
sectionNames.pharmacy = "داروخانه";
sectionNames["pet-shop"] = "پت‌شاپ";

function navigate(section) {
  if (isCustomerSession() && !customerSections.has(section)) section = "dashboard";
  if (isShopSellerSession() && !["dashboard", "pet-shop"].includes(section)) section = "pet-shop";
  document.body.classList.toggle("shop-mode", section === "pet-shop" && isShopSession());
  state.activeSection = section;
  $$(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.section === section));
  $$(".page-section").forEach(view => view.classList.toggle("active", view.dataset.view === section));
  $("#pageTitle").textContent = sectionNames[section] || "نمای کلی";
   if (section === "customers") renderCustomers();
   if (section === "pets") renderPets();
   if (section === "appointments") renderAppointmentsWorkspace();
   if (section === "records") renderExamWorkspace();
  if (section === "pharmacy") renderProfessionalPharmacyWorkspace();
  if (section === "pet-shop") renderPetShopWorkspace();
  if (section === "nutrition") nutritionSystem.init();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$$(".nav-item").forEach(item => item.addEventListener("click", () => { navigate(item.dataset.section); closeDrawer(); }));
$$("[data-section-link]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.sectionLink)));

function renderCustomers(filter = "") {
  const list = $("#customerList");
  if (!list) return;
  const term = filter.trim().toLowerCase();
  const visibleCustomers = isCustomerSession() ? [currentCustomer()] : state.customers;
  const customers = visibleCustomers.filter(Boolean).filter(c => `${c.name} ${c.phone}`.toLowerCase().includes(term));
  $("#customerCount").textContent = `${customers.length} پروفایل نمایش داده می‌شود`;
  list.innerHTML = customers.map((customer, index) => `
    <button class="customer-item ${state.selectedCustomer?.id === customer.id ? "selected" : ""}" data-customer="${customer.id}">
      <div class="customer-avatar ${customer.color}">${customer.name[0]}</div>
      <div><strong>${customer.name}</strong><small>${customer.phone}</small></div>
      <span class="pet-count">${customer.pets.length} پت</span>
    </button>`).join("") || `<div class="empty-preview"><span>⌕</span><h2>موردی پیدا نشد</h2><p>عبارت جستجو را تغییر دهید.</p></div>`;
  $$(".customer-item", list).forEach(item => item.addEventListener("click", () => selectCustomer(Number(item.dataset.customer))));
}

function selectCustomer(id) {
  if (isCustomerSession() && Number(id) !== Number(session.customerId)) return;
  state.selectedCustomer = state.customers.find(customer => customer.id === id);
  renderCustomers($("#customerSearch")?.value || "");
  renderCustomerPreview();
}

function renderCustomerPreview() {
  const preview = $("#customerPreview");
  const customer = state.selectedCustomer;
  if (!preview || !customer) return;
  const firstPet = customer.pets[0];
  preview.innerHTML = `
    <div class="profile-header"><div class="customer-avatar">${customer.name[0]}</div><div><h2>${customer.name}</h2><p>${customer.phone} · ${customer.email}</p></div><div class="profile-actions"><button class="icon-button small" title="ویرایش" data-customer-edit="${customer.id}">✎</button><button class="icon-button small" title="بیشتر">•••</button></div></div>
    <div class="profile-meta"><div><small>تعداد پت‌ها</small><strong>${customer.pets.length} حیوان ثبت‌شده</strong></div><div><small>آخرین مراجعه</small><strong>${customer.lastVisit}</strong></div><div><small>عضویت از</small><strong>فروردین ۱۴۰۳</strong></div><div><small>وضعیت حساب</small><strong class="status success">فعال</strong></div></div>
    <div class="sub-heading"><h3>پت‌های ${customer.name}</h3><button class="text-button" id="addPetForCustomer">＋ افزودن پت</button></div>
    ${customer.pets.map(pet => `<div class="profile-pet"><div class="pet-avatar ${pet.species === "گربه" ? "cat" : pet.species === "خرگوش" ? "rabbit" : "dog"}">${pet.species === "گربه" ? "🐱" : pet.species === "خرگوش" ? "🐰" : "🐶"}</div><div><strong>${pet.name}</strong><small>${pet.species} ${pet.breed} · ${pet.age} · ${pet.weight}</small></div><button class="row-more pet-edit-action" data-pet-edit="${pet.name}" data-tooltip="ویرایش" aria-label="ویرایش پت" type="button">•••</button></div>`).join("")}
    <div class="sub-heading"><h3>یادداشت مراقبتی</h3></div>
    <div class="health-alert"><span>✓</span><div><strong>پرونده مشتری کامل است</strong><p>رضایت‌نامه‌ها و اطلاعات تماس تأیید شده‌اند.</p></div></div>`;
  $("#addPetForCustomer")?.addEventListener("click", () => openPetModal(customer.name));
  $$("[data-pet-edit]", preview).forEach(button => button.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    const petName = button.dataset.petEdit;
    const pet = state.pets.find(item => item.name === petName) || customer.pets.find(item => item.name === petName);
    if (pet) {
      openPetModal(customer.name, { ...pet, owner: customer.name });
      $("#petForm h2").textContent = "ویرایش پرونده پت";
    }
    else toast("پرونده این پت پیدا نشد.");
  }));
  $("[data-customer-edit]", preview)?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    openCustomerModal(customer);
  });
}

function renderPets(filter = "") {
  const grid = $("#petGrid");
  if (!grid) return;
  const term = filter.trim().toLowerCase();
  const visiblePets = isCustomerSession() ? state.pets.filter(pet => pet.owner === currentCustomer()?.name) : state.pets;
  const pets = visiblePets.filter(pet => `${pet.name} ${pet.owner} ${pet.breed}`.toLowerCase().includes(term));
  grid.innerHTML = pets.map(pet => `<article class="pet-card"><div class="pet-card-top"><div class="pet-avatar ${pet.typeClass}">${pet.emoji}</div><span class="status ${pet.statusClass}">${pet.status}</span></div><h3>${pet.name}</h3><span class="breed">${pet.species} · ${pet.breed}</span><div class="pet-card-meta"><div><small>سن</small><strong>${pet.age}</strong></div><div><small>وزن</small><strong>${pet.weight}</strong></div><div><small>صاحب</small><strong>${pet.owner.split(" ")[0]}</strong></div></div></article>`).join("") || `<div class="empty-preview"><span>⌕</span><h2>پتی پیدا نشد</h2><p>نام یا صاحب پت را جستجو کنید.</p></div>`;
}

function openExamForPet(petName) {
  navigate("records");
  const workspace = $("#examWorkspace");
  if (workspace && petName) {
    workspace.dataset.selectedPet = petNameFromValue(petName);
    renderExamWorkspace();
  }
}

function allKnownPets() {
  const byName = new Map();
  state.pets.forEach(pet => byName.set(pet.name, { ...pet }));
  state.customers.forEach(customer => (customer.pets || []).forEach(pet => {
    byName.set(pet.name, { ...byName.get(pet.name), ...pet, owner: pet.owner || customer.name });
  }));
  return [...byName.values()];
}

function allMedicationOrders() {
  const directOrders = pharmacyStore.prescriptions.map(order => ({
    ...order,
    status: pharmacyStore.dispenseStatus?.[order.id]?.status || pharmacyStore.dispenseStatus?.[order.id] || order.status || "در انتظار بررسی"
  }));
  const directKeys = new Set(directOrders.map(order => `${order.petName}::${order.medicine}`));
  const legacyOrders = allKnownPets().flatMap(pet => {
    const clinical = getPetClinicalRecord(pet.name);
    return clinical.medicines
      .filter(item => item && item !== "داروی جاری ثبت نشده" && item !== "داروی جاری ندارد")
      .map((item, index) => {
        const parts = String(item).split(" · ");
        const legacyKey = `${pet.name}::${parts[0] || item}::`;
        return {
          id: `${pet.name}-${index}-${item}`,
          petName: pet.name,
          owner: pet.owner,
          medicine: parts[0] || item,
          instructions: parts.slice(1).join(" · ") || "دستور مصرف ثبت نشده",
          status: pharmacyStore.dispenseStatus[`${pet.name}-${index}-${item}`]?.status || pharmacyStore.dispenseStatus[`${pet.name}-${index}-${item}`] || (item.includes("تحویل به") ? "تحویل‌شده" : "در انتظار بررسی"),
          legacyKey
        };
      });
  });
  return [...directOrders, ...legacyOrders.filter(order => !directKeys.has(`${order.petName}::${order.medicine}`))];
}

function renderPharmacyWorkspace(filter = "") {
  const target = $('.page-section[data-view="pharmacy"]');
  if (!target) return;
  const orders = allMedicationOrders();
  const term = String(filter).trim().toLowerCase();
  const visible = orders.filter(item => `${item.petName} ${item.owner} ${item.medicine} ${item.instructions}`.toLowerCase().includes(term));
  const pending = orders.filter(item => item.status !== "تحویل‌شده").length;
  const dispensed = orders.filter(item => item.status === "تحویل‌شده").length;
  const lowStock = pharmacyStore.inventory.filter(item => Number(item.stock) <= Number(item.reorder)).length;
  const orderRows = visible.map(order => `<div class="data-row pharmacy-order-row"><span><strong>${order.medicine}</strong><small>${order.instructions}</small></span><span>${order.petName} · ${order.owner}</span><span class="status ${order.status === "تحویل‌شده" ? "success" : "warning"}">${order.status}</span><button type="button" class="button ${order.status === "تحویل‌شده" ? "ghost" : "primary"} pharmacy-dispense" data-pharmacy-order="${encodeURIComponent(order.id)}">${order.status === "تحویل‌شده" ? "ثبت مجدد تحویل" : "ثبت تحویل"}</button></div>`).join("");
  const inventoryRows = pharmacyStore.inventory.map(item => `<div class="data-row pharmacy-inventory-row"><span><strong>${item.name}</strong><small>${item.category}</small></span><span>${item.stock} ${item.unit}</span><span class="status ${Number(item.stock) <= Number(item.reorder) ? "warning" : "success"}">${Number(item.stock) <= Number(item.reorder) ? "نیازمند تأمین" : "موجود"}</span></div>`).join("");
  target.innerHTML = `<div class="workspace-page pharmacy-page"><div class="page-heading"><div><div class="eyebrow">مدیریت داروخانه کلینیک</div><h1>داروخانه</h1><p>نسخه‌های ثبت‌شده، تحویل دارو و کنترل موجودی را از یک صفحه مدیریت کنید.</p></div><button type="button" class="button primary" data-action="medication">＋ ثبت نسخه جدید</button></div><div class="workspace-grid three"><div class="workspace-card accent-card"><span class="workspace-icon orange">✚</span><small>در انتظار تحویل</small><strong>${pending}</strong><em>نسخه باز</em></div><div class="workspace-card accent-card"><span class="workspace-icon teal">✓</span><small>تحویل‌شده</small><strong>${dispensed}</strong><em>نسخه تکمیل‌شده</em></div><div class="workspace-card accent-card"><span class="workspace-icon red">!</span><small>موجودی کم</small><strong>${lowStock}</strong><em>قلم نیازمند سفارش</em></div></div><div class="workspace-card pharmacy-orders"><div class="workspace-toolbar"><div><h2>صف نسخه‌ها و تحویل دارو</h2><p>دارو پس از ثبت نسخه در اینجا برای تحویل پیگیری می‌شود.</p></div><label class="table-search">⌕ <input id="pharmacySearch" value="${filter}" placeholder="جستجوی پت، صاحب یا دارو..." /></label></div><div class="data-table"><div class="data-row head"><span>دارو و دستور مصرف</span><span>پت و صاحب</span><span>وضعیت</span><span>عملیات</span></div>${orderRows || `<div class="empty-copy">هنوز نسخه‌ای برای داروخانه ثبت نشده است.</div>`}</div></div><div class="workspace-card pharmacy-inventory"><div class="workspace-toolbar"><div><h2>موجودی داروخانه</h2><p>موجودی نمونه برای کنترل داخلی کلینیک</p></div></div><div class="data-table"><div class="data-row head"><span>دارو</span><span>موجودی</span><span>وضعیت</span></div>${inventoryRows}</div></div></div>`;
  $("#pharmacySearch", target)?.addEventListener("input", event => renderPharmacyWorkspace(event.target.value));
  $$(".pharmacy-dispense", target).forEach(button => button.addEventListener("click", () => {
    const id = decodeURIComponent(button.dataset.pharmacyOrder);
    const order = orders.find(item => item.id === id);
    if (!order) return toast("نسخه پیدا نشد.");
    pharmacyStore.dispenseStatus[id] = order.status === "تحویل‌شده" ? "در انتظار تحویل" : "تحویل‌شده";
    localStorage.setItem("petclinic-pharmacy", JSON.stringify(pharmacyStore));
    renderPharmacyWorkspace($("#pharmacySearch", target)?.value || "");
    toast(pharmacyStore.dispenseStatus[id] === "تحویل‌شده" ? "تحویل دارو ثبت شد." : "نسخه به وضعیت در انتظار تحویل برگشت.");
  }));
}

const pharmacyWorkflow = ["در انتظار بررسی", "در حال آماده‌سازی", "آماده تحویل", "تحویل‌شده"];
function pharmacyOrderStatus(order) {
  const saved = pharmacyStore.dispenseStatus?.[order.id];
  if (typeof saved === "string") return saved === "تحویل‌شده" ? "تحویل‌شده" : saved;
  if (saved?.status) return saved.status;
  if (order.status) return order.status;
  return order.dispensed === "تحویل به مالک" ? "تحویل‌شده" : "در انتظار بررسی";
}

function printPharmacyReceipt(orderId) {
  const order = allMedicationOrders().find(item => item.id === orderId);
  if (!order) return toast("نسخه پیدا نشد.");
  const printWindow = window.open("", "_blank", "width=760,height=760");
  if (!printWindow) return toast("پنجره چاپ توسط مرورگر مسدود شده است.");
  printWindow.document.write(`<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><title>رسید داروخانه</title><style>body{font-family:Tahoma,Arial;padding:32px;color:#172b3a}h1{font-size:22px}table{width:100%;border-collapse:collapse;margin-top:20px}td,th{border:1px solid #ccd8dc;padding:10px;text-align:right}.muted{color:#75858c;font-size:12px}.sign{margin-top:55px;display:flex;justify-content:space-between}</style></head><body><h1>رسید تحویل دارو · ${order.prescriptionNo}</h1><p>پت: <b>${order.petName}</b> · صاحب: <b>${order.owner}</b></p><p class="muted">تاریخ: ${new Intl.DateTimeFormat("fa-IR").format(new Date())} · وضعیت: ${pharmacyOrderStatus(order)}</p><table><tr><th>دارو</th><th>دستور مصرف</th><th>مقدار</th></tr><tr><td>${order.medicine}</td><td>${order.instructions}</td><td>${order.quantity}</td></tr></table><p>هشدار: دارو طبق نسخه دامپزشک مصرف شود. تغییر دوز یا قطع خودسرانه مجاز نیست.</p><div class="sign"><span>امضای تحویل‌گیرنده: ................</span><span>مسئول داروخانه: ................</span></div><script>window.onload=()=>window.print();</script></body></html>`);
  printWindow.document.close();
}

async function patchPrescriptionRemote(orderId, patch) {
  const numericId = Number(orderId);
  if (!Number.isInteger(numericId)) return false;
  await apiRequest(`/prescriptions/${numericId}`, {
    method: "PATCH",
    body: JSON.stringify(patch)
  });
  await loadRemoteData();
  return true;
}

function renderProfessionalPharmacyWorkspace(filter = "", statusFilter = "all") {
  const target = $('.page-section[data-view="pharmacy"]');
  if (!target) return;
  const orders = allMedicationOrders().map(order => ({ ...order, status: pharmacyOrderStatus(order), prescriptionNo: `RX-${String(Math.abs(hashCode(order.id))).padStart(5, "0")}`, priority: order.priority || "عادی", quantity: order.quantity || "طبق نسخه", allergy: getPetClinicalRecord(order.petName).allergies?.[0] || "حساسیت ثبت نشده" }));
  const term = String(filter).trim().toLowerCase();
  const visible = orders.filter(item => `${item.petName} ${item.owner} ${item.medicine} ${item.instructions}`.toLowerCase().includes(term)).filter(item => statusFilter === "all" || item.status === statusFilter);
  const count = value => orders.filter(item => item.status === value).length;
  const lowStock = pharmacyStore.inventory.filter(item => Number(item.stock) <= Number(item.reorder)).length;
  const statusClass = item => item.status === "تحویل‌شده" ? "success" : item.status === "آماده تحویل" ? "blue-status" : item.status === "در حال آماده‌سازی" ? "purple-status" : "warning";
  const orderRows = visible.map(order => `<article class="pharmacy-order-card"><div class="pharmacy-order-main"><div class="pharmacy-rx-badge">${order.prescriptionNo}</div><div><h3>${order.medicine}</h3><p>${order.petName} · ${order.owner} · ${order.instructions}</p><small>حساسیت: ${order.allergy}</small></div><span class="status ${statusClass(order)}">${order.status}</span></div><div class="pharmacy-order-meta"><span>اولویت <b>${order.priority}</b></span><span>مقدار <b>${order.quantity}</b></span><span>ثبت نسخه <b>${order.createdAt || "امروز"}</b></span><span>مسئول <b>${pharmacyStore.dispenseStatus?.[order.id]?.staff || "تعیین نشده"}</b></span></div><div class="pharmacy-order-actions"><button type="button" class="button ghost pharmacy-next-status" data-pharmacy-order="${encodeURIComponent(order.id)}">${order.status === "تحویل‌شده" ? "بازگردانی به بررسی" : "انتقال به مرحله بعد"}</button><button type="button" class="button ghost pharmacy-print" data-pharmacy-print="${encodeURIComponent(order.id)}">چاپ رسید</button><button type="button" class="button primary pharmacy-detail" data-pharmacy-detail="${encodeURIComponent(order.id)}">جزئیات و تحویل</button></div></article>`).join("");
  const inventoryRows = pharmacyStore.inventory.map(item => `<div class="data-row pharmacy-inventory-row"><span><strong>${item.name}</strong><small>${item.category}</small></span><span>${item.stock} ${item.unit}</span><span class="status ${Number(item.stock) <= Number(item.reorder) ? "warning" : "success"}">${Number(item.stock) <= Number(item.reorder) ? "نیازمند تأمین" : "موجود"}</span></div>`).join("");
  target.innerHTML = `<div class="workspace-page pharmacy-page"><div class="page-heading"><div><div class="eyebrow">داروخانه دامپزشکی · صف عملیاتی</div><h1>صف تحویل دارو</h1><p>نسخه‌ها را بررسی، آماده‌سازی، کنترل موجودی و با ثبت مسئول تحویل تکمیل کنید.</p></div><div class="heading-actions"><button type="button" class="button ghost" id="pharmacyPrintAll">🖨 چاپ صف</button><button type="button" class="button primary" data-action="medication">＋ ثبت نسخه جدید</button></div></div><div class="workspace-grid three pharmacy-kpis"><div class="workspace-card accent-card"><span class="workspace-icon orange">⌁</span><small>در انتظار بررسی</small><strong>${count("در انتظار بررسی")}</strong><em>نسخه جدید</em></div><div class="workspace-card accent-card"><span class="workspace-icon purple">◌</span><small>در حال آماده‌سازی</small><strong>${count("در حال آماده‌سازی")}</strong><em>در دست اقدام</em></div><div class="workspace-card accent-card"><span class="workspace-icon teal">✓</span><small>آماده یا تحویل‌شده</small><strong>${count("آماده تحویل") + count("تحویل‌شده")}</strong><em>${lowStock} هشدار موجودی</em></div></div><div class="workspace-card pharmacy-orders"><div class="workspace-toolbar"><div><h2>صف نسخه‌ها</h2><p>هر کارت یک نسخه یا قلم دارویی قابل پیگیری است.</p></div><label class="table-search">⌕ <input id="pharmacySearch" value="${filter}" placeholder="جستجوی شماره نسخه، پت، صاحب یا دارو..." /></label></div><div class="pharmacy-filter-bar">${[["all","همه"],...pharmacyWorkflow.map(item => [item,item])].map(([key,label]) => `<button type="button" class="filter-chip ${statusFilter === key ? "active" : ""}" data-pharmacy-filter="${key}">${label} <b>${key === "all" ? orders.length : count(key)}</b></button>`).join("")}</div><div class="pharmacy-order-list">${orderRows || `<div class="empty-copy">نسخه‌ای با این فیلتر پیدا نشد.</div>`}</div></div><div class="workspace-card pharmacy-inventory"><div class="workspace-toolbar"><div><h2>کنترل موجودی و تأمین</h2><p>موجودی قبل از تحویل بررسی شود؛ اقلام کم‌موجودی نیازمند سفارش هستند.</p></div></div><div class="data-table"><div class="data-row head"><span>دارو</span><span>موجودی</span><span>وضعیت</span></div>${inventoryRows}</div></div></div>`;
  $("#pharmacySearch", target)?.addEventListener("input", event => renderProfessionalPharmacyWorkspace(event.target.value, statusFilter));
  $$("[data-pharmacy-filter]", target).forEach(button => button.addEventListener("click", () => renderProfessionalPharmacyWorkspace($("#pharmacySearch", target)?.value || "", button.dataset.pharmacyFilter)));
  $$(".pharmacy-next-status", target).forEach(button => button.addEventListener("click", async () => {
    const id = decodeURIComponent(button.dataset.pharmacyOrder);
    const order = orders.find(item => item.id === id);
    if (!order) return;
    const next = order.status === "تحویل‌شده" ? "در انتظار بررسی" : pharmacyWorkflow[Math.min(pharmacyWorkflow.indexOf(order.status) + 1, pharmacyWorkflow.length - 1)];
    const patch = { status: next, dispense_staff: session?.role === "vet" ? "دامپزشک ناظر" : "کاربر داروخانه" };
    if (next === "تحویل‌شده") patch.dispensed = "تحویل به مالک";
    try {
      if (session?.token && /^\d+$/.test(id)) {
        await patchPrescriptionRemote(id, patch);
      } else {
        pharmacyStore.dispenseStatus[id] = { ...patch, updatedAt: new Date().toISOString() };
        localStorage.setItem("petclinic-pharmacy", JSON.stringify(pharmacyStore));
      }
    } catch (error) {
      return toast(error.message);
    }
    renderProfessionalPharmacyWorkspace(filter, statusFilter);
    toast(`وضعیت نسخه به «${next}» تغییر کرد.`);
  }));
  $$(".pharmacy-print", target).forEach(button => button.addEventListener("click", () => printPharmacyReceipt(decodeURIComponent(button.dataset.pharmacyPrint))));
  $$(".pharmacy-detail", target).forEach(button => button.addEventListener("click", async () => {
    const id = decodeURIComponent(button.dataset.pharmacyDetail);
    const order = orders.find(item => item.id === id);
    if (!order) return;
    const staff = window.prompt("نام مسئول تحویل را وارد کنید:", pharmacyStore.dispenseStatus?.[id]?.staff || "کاربر داروخانه")?.trim();
    if (!staff) return;
    const receiver = window.prompt("نام تحویل‌گیرنده / صاحب پت را وارد کنید:", order.owner)?.trim();
    if (!receiver) return;
    try {
      if (session?.token && /^\d+$/.test(id)) {
        await patchPrescriptionRemote(id, {
          status: "تحویل‌شده",
          dispensed: "تحویل به مالک",
          dispense_staff: staff,
          dispense_receiver: receiver
        });
      } else {
        pharmacyStore.dispenseStatus[id] = { status: "تحویل‌شده", staff, receiver, updatedAt: new Date().toISOString() };
        localStorage.setItem("petclinic-pharmacy", JSON.stringify(pharmacyStore));
      }
    } catch (error) {
      return toast(error.message);
    }
    renderProfessionalPharmacyWorkspace(filter, statusFilter);
    toast("تحویل دارو با نام مسئول و تحویل‌گیرنده ثبت شد.");
  }));
  $("#pharmacyPrintAll", target)?.addEventListener("click", () => window.print());
}

function hashCode(value) {
  return String(value).split("").reduce((hash, char) => ((hash << 5) - hash) + char.charCodeAt(0) | 0, 0);
}

const appointmentStatusLabels = {
  scheduled: "در انتظار",
  confirmed: "تأیید شده",
  in_progress: "در حال ویزیت",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
  no_show: "عدم مراجعه"
};

function renderAppointmentsWorkspace(filter = "all") {
  const section = $('.page-section[data-view="appointments"]');
  if (!section) return;
  const appointments = remoteData.loaded ? remoteData.appointments : clinicAppointments;
  const visible = appointments
    .filter(item => filter === "all" || item.status === filter)
    .sort((a, b) => String(a.starts_at || a.createdAt || "").localeCompare(String(b.starts_at || b.createdAt || "")));
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = appointments.filter(item => String(item.starts_at || "").startsWith(today)).length;
  const completedCount = appointments.filter(item => item.status === "completed" || item.status === "تکمیل‌شده").length;
  const waitingCount = appointments.filter(item => item.status === "scheduled" || item.status === "در انتظار").length;
  const rows = visible.map(item => {
    const status = item.status || "scheduled";
    const label = appointmentStatusLabels[status] || status;
    const date = item.starts_at ? new Date(item.starts_at).toLocaleString("fa-IR", { dateStyle: "short", timeStyle: "short" }) : (item.createdAt || "—");
    return `<div class="data-row">
      <b>${escapeHtml(date)}</b>
      <span>${escapeHtml(item.pet_name || item.petName || item.pet || "—")} · ${escapeHtml(item.customer_name || item.owner || "—")}</span>
      <span>${escapeHtml(item.service || "—")}</span>
      <span>${escapeHtml(item.doctor || "—")}</span>
      <span class="status ${status === "completed" ? "success" : status === "cancelled" ? "danger" : "warning"}">${escapeHtml(label)}</span>
      <span class="toolbar-actions">
        ${status !== "completed" && status !== "cancelled" ? `<button type="button" class="button ghost appointment-status-button" data-appointment-id="${item.id}" data-next-status="${status === "scheduled" ? "confirmed" : status === "confirmed" ? "in_progress" : "completed"}">${status === "scheduled" ? "تأیید" : status === "confirmed" ? "شروع ویزیت" : "تکمیل"}</button>` : ""}
        ${status !== "cancelled" && status !== "completed" ? `<button type="button" class="button ghost appointment-status-button" data-appointment-id="${item.id}" data-next-status="cancelled">لغو</button>` : ""}
      </span>
    </div>`;
  }).join("") || `<div class="empty-copy">نوبتی با این فیلتر پیدا نشد.</div>`;
  section.innerHTML = `<div class="workspace-page">
    <div class="page-heading"><div><div class="eyebrow">برنامه‌ریزی کلینیک</div><h1>نوبت‌ها و تقویم پزشکان</h1><p>تمام نوبت‌ها از پایگاه‌داده خوانده و تغییر وضعیت آن‌ها در API ثبت می‌شود.</p></div><button type="button" class="button primary" data-action="appointment">＋ رزرو نوبت جدید</button></div>
    <div class="workspace-grid three">
      <div class="workspace-card accent-card"><small>نوبت‌های امروز</small><strong>${toPersianDigits(todayCount)}</strong><em>بر اساس تاریخ سیستم</em></div>
      <div class="workspace-card accent-card"><small>در انتظار</small><strong>${toPersianDigits(waitingCount)}</strong><em>نیازمند پیگیری پذیرش</em></div>
      <div class="workspace-card accent-card"><small>تکمیل‌شده</small><strong>${toPersianDigits(completedCount)}</strong><em>ثبت‌شده در پرونده</em></div>
    </div>
    <div class="workspace-card"><div class="workspace-toolbar"><div><h2>صف نوبت‌ها</h2><p>${toPersianDigits(appointments.length)} نوبت ثبت‌شده</p></div><div class="toolbar-actions">${["all", "scheduled", "confirmed", "in_progress", "completed", "cancelled"].map(key => `<button type="button" class="filter-chip ${filter === key ? "active" : ""}" data-appointment-filter="${key}">${key === "all" ? "همه" : appointmentStatusLabels[key]}</button>`).join("")}</div></div>
      <div class="data-table"><div class="data-row head"><span>زمان</span><span>حیوان و صاحب</span><span>خدمت</span><span>پزشک</span><span>وضعیت</span><span>عملیات</span></div>${rows}</div>
    </div>
  </div>`;
  $$("[data-action]", section).forEach(button => button.addEventListener("click", () => openActionModal(button.dataset.action)));
  $$("[data-appointment-filter]", section).forEach(button => button.addEventListener("click", () => renderAppointmentsWorkspace(button.dataset.appointmentFilter)));
  $$(".appointment-status-button", section).forEach(button => button.addEventListener("click", () => updateAppointmentStatus(button.dataset.appointmentId, button.dataset.nextStatus)));
}

async function updateAppointmentStatus(id, status) {
  if (!session?.token) return toast("برای تغییر وضعیت نوبت باید وارد حساب کاربری شوید.");
  try {
    await apiRequest(`/appointments/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ status }) });
    await loadRemoteData();
    renderAppointmentsWorkspace();
    toast(`وضعیت نوبت به «${appointmentStatusLabels[status] || status}» تغییر کرد.`);
  } catch (error) {
    toast(error.message);
  }
}

function renderOperationalSections() {
  if (!$('.page-section[data-view="pet-shop"]')) {
    $("#appView")?.insertAdjacentHTML("beforeend", '<section class="page-section placeholder-section" data-view="pet-shop"><div class="placeholder-icon">🛒</div><div class="eyebrow">فروشگاه پت‌شاپ</div><h1>فروش کالا و مدیریت انبار</h1><p>کاتالوگ کالا، سبد خرید، فاکتور، قیمت‌گذاری و گزارش فروش.</p></section>');
  }
  if (!$('.page-section[data-view="pharmacy"]')) {
    $("#appView")?.insertAdjacentHTML("beforeend", '<section class="page-section placeholder-section" data-view="pharmacy"><div class="placeholder-icon">✚</div><div class="eyebrow">داروخانه کلینیک</div><h1>نسخه‌ها، موجودی و تحویل دارو</h1><p>مدیریت نسخه‌های ثبت‌شده و وضعیت تحویل دارو به صاحب پت.</p></section>');
  }
  if (!$('.nav-item[data-section="pharmacy"]')) {
    $('.nav-item[data-section="nutrition"]')?.insertAdjacentHTML("afterend", '<button class="nav-item" data-section="pharmacy" data-permission="staff"><span>✚</span> داروخانه</button>');
    $('.nav-item[data-section="pharmacy"]')?.addEventListener("click", () => { navigate("pharmacy"); closeDrawer(); });
  }
  const content = {
    appointments: `<div class="workspace-page"><div class="page-heading"><div><div class="eyebrow">برنامه‌ریزی کلینیک</div><h1>نوبت‌ها و تقویم پزشکان</h1><p>تقویم روزانه، صف پذیرش و نوبت‌های پیش‌رو را یکجا مدیریت کنید.</p></div><button type="button" class="button primary" data-action="appointment">＋ رزرو نوبت جدید</button></div><div class="workspace-grid three"><div class="workspace-card accent-card"><span class="workspace-icon purple">◷</span><small>نوبت‌های امروز</small><strong>۲۸</strong><em>۵ مورد در انتظار پذیرش</em></div><div class="workspace-card accent-card"><span class="workspace-icon teal">✓</span><small>تکمیل‌شده</small><strong>۱۹</strong><em>از ابتدای امروز</em></div><div class="workspace-card accent-card"><span class="workspace-icon orange">!</span><small>عدم مراجعه</small><strong>۲</strong><em>نیازمند پیگیری پذیرش</em></div></div><div class="workspace-card"><div class="workspace-toolbar"><div><h2>صف نوبت‌های امروز</h2><p>پنج‌شنبه، ۲۹ مرداد ۱۴۰۵</p></div><div class="toolbar-actions"><button type="button" class="filter-chip active">همه</button><button type="button" class="filter-chip">در انتظار</button><button type="button" class="filter-chip">تکمیل‌شده</button></div></div><div class="data-table"><div class="data-row head"><span>ساعت</span><span>حیوان و صاحب</span><span>خدمت</span><span>پزشک</span><span>وضعیت</span><span>عملیات</span></div><div class="data-row"><b>۰۹:۰۰</b><span>میلو · سارا کریمی</span><span>معاینه دوره‌ای</span><span>دکتر رضایی</span><span class="status success">تأیید شده</span><button type="button" class="button ghost appointment-exam-button" data-appointment-pet="میلو">شروع معاینه</button></div><div class="data-row"><b>۱۰:۳۰</b><span>راکی · امیر رحیمی</span><span>آزمایش خون</span><span>دکتر پارسا</span><span class="status warning">در انتظار</span><button type="button" class="button ghost appointment-exam-button" data-appointment-pet="راکی">شروع معاینه</button></div><div class="data-row"><b>۱۲:۰۰</b><span>پونه · نسترن محمدی</span><span>ویزیت تغذیه</span><span>دکتر موسوی</span><span class="status blue-status">در حال ویزیت</span><button type="button" class="button ghost appointment-exam-button" data-appointment-pet="پونه">شروع معاینه</button></div><div class="data-row"><b>۱۴:۳۰</b><span>لونا · کامران توکلی</span><span>سونوگرافی</span><span>بخش تصویربرداری</span><span class="status success">تأیید شده</span><button type="button" class="button ghost appointment-exam-button" data-appointment-pet="لونا">شروع معاینه</button></div></div></div></div>`,
    records: `<div class="workspace-page exam-page"><div class="page-heading"><div><div class="eyebrow">ویزیت و معاینه دامپزشک</div><h1>صفحه یکپارچه معاینه پت</h1><p>از ثبت علائم و تشخیص تا درخواست آزمایش، تصویربرداری، دارو، جیره و مراجعه بعدی، همه در یک پرونده.</p></div><button class="button primary" data-action="record">＋ شروع معاینه جدید</button></div><div id="examWorkspace"></div></div>`,
    laboratory: `<div class="workspace-page laboratory-page"><div class="page-heading"><div><div class="eyebrow">آزمایشگاه کلینیک</div><h1>پاسخ‌دهی و پیگیری آزمایش‌ها</h1><p>بیمار را انتخاب کنید، درخواست‌ها را ببینید، وضعیت نمونه را تغییر دهید و جواب را ثبت و چاپ کنید.</p></div><div class="heading-actions"><button type="button" class="button ghost" id="printLabButton">🖨 چاپ برگه آزمایش</button><button type="button" class="button primary" data-action="lab">＋ درخواست آزمایش</button></div></div><div class="workspace-grid three"><div class="workspace-card accent-card"><span class="workspace-icon red">!</span><small>نیازمند پاسخ</small><strong id="labPendingCount">۰</strong><em>درخواست باز</em></div><div class="workspace-card accent-card"><span class="workspace-icon orange">⌁</span><small>در حال انجام</small><strong id="labInProgressCount">۰</strong><em>در آزمایشگاه</em></div><div class="workspace-card accent-card"><span class="workspace-icon teal">✓</span><small>انجام‌شده</small><strong id="labCompletedCount">۰</strong><em>نتیجه ثبت‌شده</em></div></div><div id="labResponseWorkspace"></div></div>`,
    imaging: `<div class="workspace-page"><div class="page-heading"><div><div class="eyebrow">تصویربرداری پزشکی</div><h1>رادیولوژی و سونوگرافی</h1><p>مطالعات تصویری، فایل‌ها، گزارش پزشک و وضعیت تأیید را مدیریت کنید.</p></div><button class="button primary" data-action="imaging">＋ ثبت مطالعه جدید</button></div><div class="workspace-grid two"><div class="workspace-card upload-card"><div class="upload-icon">⇧</div><h2>آپلود تصاویر پزشکی</h2><p>JPG، PNG و PDF در نسخه فعلی؛ آماده توسعه برای DICOM و PACS.</p><button class="button ghost" data-action="upload">انتخاب فایل</button></div><div class="workspace-card"><div class="workspace-toolbar"><div><h2>مطالعات اخیر</h2><p>تصاویر و گزارش‌های ثبت‌شده</p></div></div><div class="study-list"><div><div class="study-thumb blue-thumb">◉</div><span><b>سونوگرافی شکم · لونا</b><small>امروز، ۱۴:۵۵ · در انتظار گزارش</small></span><em class="status warning">Pending</em></div><div><div class="study-thumb purple-thumb">◉</div><span><b>رادیولوژی قفسه سینه · راکی</b><small>دیروز، ۱۱:۲۰ · گزارش تأیید شد</small></span><em class="status success">Approved</em></div><div><div class="study-thumb orange-thumb">◉</div><span><b>سونوگرافی کلیه · پونه</b><small>شنبه، ۱۵:۴۰ · گزارش تأیید شد</small></span><em class="status success">Approved</em></div></div></div></div></div>`,
    nutrition: `<div class="workspace-page nutrition-page"><div class="page-heading"><div><div class="eyebrow">تغذیه درمانی هوشمند</div><h1>جیره‌سازی هوشمند</h1><p>پیشنهاد جیره با استفاده از وضعیت سلامت، آزمایش‌ها، بودجه و تأیید دامپزشک.</p></div><button class="button primary" data-action="nutrition">＋ شروع جیره‌سازی</button></div><div class="workspace-grid three"><div class="workspace-card accent-card"><span class="workspace-icon teal">✣</span><small>در انتظار بررسی</small><strong>۱۲</strong><em>جیره پیشنهادی</em></div><div class="workspace-card accent-card"><span class="workspace-icon purple">✓</span><small>تأییدشده این ماه</small><strong>۴۸</strong><em>توسط دامپزشک ناظر</em></div><div class="workspace-card accent-card"><span class="workspace-icon orange">₮</span><small>میانگین هزینه</small><strong>۲۸۵k</strong><em>تومان به ازای هر کیلو</em></div></div><div class="workspace-card"><div class="workspace-toolbar"><div><h2>صف بررسی جیره‌ها</h2><p>هیچ جیره‌ای بدون تأیید پزشک برای مشتری ارسال نمی‌شود.</p></div><button class="filter-chip active">Pending</button></div><div class="data-table"><div class="data-row head"><span>حیوان</span><span>هدف</span><span>محدودیت سلامت</span><span>سطح قیمت</span><span>وضعیت</span><span></span></div><div class="data-row"><span>راکی · سگ ژرمن</span><span>کاهش وزن</span><span>کنترل فسفر</span><span>Silver</span><span class="status warning">در انتظار</span><button class="text-button">بازبینی</button></div><div class="data-row"><span>میلو · گربه پرشین</span><span>نگهداری</span><span>بدون محدودیت</span><span>Gold</span><span class="status success">تأیید شده</span><button class="text-button">مشاهده</button></div><div class="data-row"><span>پونه · خرگوش</span><span>افزایش فیبر</span><span>مراقبت ویژه</span><span>Bronze</span><span class="status warning">در انتظار</span><button class="text-button">بازبینی</button></div></div></div></div>`,
    reports: `<div class="workspace-page"><div class="page-heading"><div><div class="eyebrow">تحلیل عملکرد کلینیک</div><h1>گزارش‌ها و داشبورد مدیریتی</h1><p>دید دقیق‌تری از درآمد، مراجعه، ظرفیت پزشکان و سلامت پرونده‌ها داشته باشید.</p></div><button class="button primary" data-action="report">↓ خروجی گزارش</button></div><div class="workspace-grid two report-grid"><div class="workspace-card"><div class="workspace-toolbar"><div><h2>روند درآمد</h2><p>شش ماه اخیر · تومان</p></div><span class="trend positive">↗ ۲۱٪</span></div><div class="fake-chart"><i style="height:34%"></i><i style="height:45%"></i><i style="height:39%"></i><i style="height:58%"></i><i style="height:68%"></i><i style="height:84%"></i><i style="height:76%"></i><i style="height:96%"></i></div><div class="chart-labels"><span>فروردین</span><span>اردیبهشت</span><span>خرداد</span><span>تیر</span><span>مرداد</span></div></div><div class="workspace-card"><div class="workspace-toolbar"><div><h2>خلاصه عملکرد</h2><p>این ماه</p></div></div><div class="metric-line"><span>ویزیت‌های تکمیل‌شده</span><b>۸۶۴</b><em>۸۲٪ ظرفیت</em></div><div class="metric-line"><span>رضایت مشتری</span><b>۹۴٪</b><em>+۴٪ رشد</em></div><div class="metric-line"><span>پرونده‌های نیازمند پیگیری</span><b>۳۶</b><em>۱۲ مورد جدید</em></div></div></div></div>`,
    settings: `<div class="workspace-page"><div class="page-heading"><div><div class="eyebrow">پیکربندی سامانه</div><h1>تنظیمات کلینیک</h1><p>تنظیمات هویت بصری، نقش‌ها، خدمات، تعرفه‌ها و قوانین را کنترل کنید.</p></div><button class="button primary" data-action="save-settings">ذخیره تغییرات</button></div><div class="settings-layout"><div class="settings-menu"><button class="active">عمومی</button><button>کاربران و نقش‌ها</button><button>خدمات و تعرفه‌ها</button><button>قوانین تغذیه‌ای</button><button>اعلان‌ها</button><button>پشتیبان‌گیری</button></div><div class="workspace-card settings-form"><h2>اطلاعات عمومی کلینیک</h2><p>این اطلاعات در سربرگ نسخه‌ها و گزارش‌ها نمایش داده می‌شود.</p><div class="settings-fields"><label>نام کلینیک<input value="کلینیک دامپزشکی دکتر پارسا" /></label><label>شعبه<select><option>شعبه ونک</option><option>شعبه سعادت‌آباد</option></select></label><label>شماره تماس<input value="۰۲۱-۸۸۷۷۶۶۵۵" /></label><label>منطقه زمانی<select><option>تهران (UTC+03:30)</option></select></label></div><div class="health-alert"><span>✓</span><div><strong>همگام‌سازی تنظیمات فعال است</strong><p>تغییرات شما در تمام صفحات سامانه اعمال می‌شود.</p></div></div></div></div></div>`
  };
  Object.entries(content).forEach(([section, html]) => {
    const target = $(`.page-section[data-view="${section}"]`);
    if (target && !(section === "nutrition" && $("#nutritionWorkspace", target))) target.innerHTML = html;
  });
  $$("[data-action]").forEach(button => button.addEventListener("click", () => {
    openActionModal(button.dataset.action);
  }));
  renderExamWorkspace();
  renderLaboratoryResponseWorkspace();
  
  // Initialize nutrition system when nutrition section is loaded
  if (currentSection === "nutrition") {
    nutritionSystem.init();
  }
}

const labApiToUiStatus = {
  requested: "Ø¯Ø±Ø®ÙˆØ§Ø³Øªâ€ŒØ´Ø¯Ù‡",
  sampling: "Ù†Ù…ÙˆÙ†Ù‡â€ŒÚ¯ÛŒØ±ÛŒ",
  received: "Ù†Ù…ÙˆÙ†Ù‡ Ø¯Ø±ÛŒØ§ÙØª Ø´Ø¯",
  processing: "Ø¯Ø± Ø­Ø§Ù„ Ø§Ù†Ø¬Ø§Ù…",
  completed: "Ø§Ù†Ø¬Ø§Ù…â€ŒØ´Ø¯Ù‡"
};
const labUiToApiStatus = Object.fromEntries(Object.entries(labApiToUiStatus).map(([key, value]) => [value, key]));

function allLabRequests() {
  if (remoteData.loaded) {
    return remoteData.labRequests.map(request => {
      const pet = state.pets.find(item => item.id === request.pet_id || item.name === request.pet_name);
      return {
        ...request,
        status: labApiToUiStatus[request.status] || request.status,
        petName: request.pet_name || pet?.name,
        owner: request.customer_name || pet?.owner,
        species: pet?.species || ""
      };
    });
  }
  return state.pets.flatMap(pet => getPetClinicalRecord(pet.name).labRequests.map(request => ({ ...request, petName: pet.name, owner: pet.owner, species: pet.species })));
}

function renderLaboratoryResponseWorkspace(selectedPetName = "") {
  const target = $("#labResponseWorkspace");
  if (!target) return;
  const requests = allLabRequests();
  const petNames = [...new Set(requests.map(item => item.petName))];
  const selected = selectedPetName || target.dataset.selectedPet || petNames[0] || "";
  target.dataset.selectedPet = selected;
  const selectedRequests = requests.filter(item => item.petName === selected);
  $("#labPendingCount").textContent = toPersianDigits(requests.filter(item => !item.status || item.status === "درخواست‌شده").length);
  $("#labInProgressCount").textContent = toPersianDigits(requests.filter(item => item.status === "در حال انجام").length);
  $("#labCompletedCount").textContent = toPersianDigits(requests.filter(item => item.status === "انجام‌شده").length);
  const patients = petNames.map(name => {
    const pet = state.pets.find(item => item.name === name);
    const openCount = requests.filter(item => item.petName === name && item.status !== "انجام‌شده").length;
    const urgent = requests.some(item => item.petName === name && item.priority === "بحرانی" && item.status !== "انجام‌شده");
    return `<button type="button" class="lab-patient-item ${name === selected ? "selected" : ""}" data-lab-patient="${name}"><span class="pet-avatar mini ${pet?.typeClass || "dog"}">${pet?.emoji || "🐾"}</span><span><strong>${name}</strong><small>${pet?.owner || "صاحب ثبت نشده"} · ${openCount} درخواست باز</small></span>${urgent ? `<i class="critical-dot" title="درخواست بحرانی"></i>` : ""}<b>${requests.filter(item => item.petName === name).length}</b></button>`;
  }).join("") || `<div class="empty-copy">هنوز درخواست آزمایشی ثبت نشده است.</div>`;
  const rows = selectedRequests.map((request, index) => `
    <article class="lab-request-card" data-lab-request-index="${index}">
      <div class="lab-request-head"><div><strong>${request.panel || request.testKey || "آزمایش جدید"}</strong><small>شماره پذیرش: ${request.accessionNumber || "در انتظار پذیرش"} · ${request.sample || "نمونه ثبت نشده"} · ${request.createdAt || "تاریخ ثبت نشده"}</small></div><span class="status ${request.status === "انجام‌شده" ? "success" : request.status === "در حال انجام" ? "blue-status" : request.status === "نمونه دریافت شد" ? "purple-status" : "warning"}">${request.status || "درخواست‌شده"}</span></div>
      <div class="lab-stepper">${["درخواست‌شده", "نمونه‌گیری", "نمونه دریافت شد", "در حال انجام", "انجام‌شده"].map(step => `<span class="${step === request.status ? "active" : ["درخواست‌شده", "نمونه‌گیری", "نمونه دریافت شد", "در حال انجام", "انجام‌شده"].indexOf(step) < ["درخواست‌شده", "نمونه‌گیری", "نمونه دریافت شد", "در حال انجام", "انجام‌شده"].indexOf(request.status) ? "done" : ""}">${step}</span>`).join("")}</div>
      <div class="lab-request-meta"><span>اولویت <b>${request.priority || "عادی"}</b></span><span>پزشک درخواست‌کننده <b>${request.doctor || "دکتر پارسا"}</b></span><span>علت <b>${request.reason || "ثبت نشده"}</b></span></div>
      <div class="lab-request-actions"><button type="button" class="button ghost lab-status-button" data-lab-status="نمونه‌گیری" data-lab-pet="${selected}" data-lab-index="${index}">نمونه‌گیری</button><button type="button" class="button ghost lab-status-button" data-lab-status="نمونه دریافت شد" data-lab-pet="${selected}" data-lab-index="${index}">دریافت نمونه</button><button type="button" class="button ghost lab-status-button" data-lab-status="در حال انجام" data-lab-pet="${selected}" data-lab-index="${index}">شروع آزمایش</button><button type="button" class="button primary lab-answer-button" data-lab-answer="${selected}" data-lab-index="${index}">ثبت جواب</button>${request.status === "انجام‌شده" ? `<button type="button" class="button ghost lab-status-button" data-lab-status="در حال انجام" data-lab-pet="${selected}" data-lab-index="${index}">بازگشت به در حال انجام</button>` : ""}</div>
      ${request.answers?.length ? `<div class="lab-answer-preview"><strong>نتیجه ثبت‌شده:</strong><div class="lab-answer-result-grid">${request.answers.map(answer => `<div class="lab-answer-result-item"><span>${escapeHtml(answer.name)}</span><b>${escapeHtml(answer.result)} ${escapeHtml(answer.unit)}</b><small>${escapeHtml(answer.reference || "بازه مرجع ثبت نشده")} ${answer.interpretation ? `· ${escapeHtml(answer.interpretation)}` : ""}</small></div>`).join("")}</div></div>` : request.result ? `<div class="lab-answer-preview"><strong>نتیجه ثبت‌شده:</strong> ${escapeHtml(request.result)} ${escapeHtml(request.unit || "")}<small>${escapeHtml(request.interpretation || "")}</small></div>` : ""}
    </article>`).join("") || `<div class="empty-copy">برای این بیمار درخواست آزمایش وجود ندارد.</div>`;
  target.innerHTML = `<div class="lab-queue-toolbar"><label class="table-search">⌕ <input id="labPatientSearch" placeholder="جستجوی بیمار یا صاحب..." /></label><div class="lab-queue-filters"><button type="button" class="filter-chip active" data-lab-filter="all">همه</button><button type="button" class="filter-chip" data-lab-filter="open">باز</button><button type="button" class="filter-chip" data-lab-filter="critical">بحرانی</button><button type="button" class="filter-chip" data-lab-filter="done">انجام‌شده</button></div></div><div class="lab-response-layout"><aside class="workspace-card lab-patient-list"><div class="workspace-toolbar"><div><h2>صف بیماران آزمایشگاه</h2><p>${petNames.length} بیمار · مرتب‌شده بر اساس اولویت</p></div></div><div id="labPatientItems">${patients}</div></aside><section class="workspace-card lab-request-list"><div class="workspace-toolbar"><div><h2>برگه کار آزمایشگاه · ${selected || "بیمار"}</h2><p>هر درخواست از پذیرش نمونه تا تأیید نتیجه قابل پیگیری است.</p></div><div class="lab-toolbar-actions"><button type="button" class="button ghost" id="labPrintSelected">🖨 چاپ برگه</button><button type="button" class="button ghost" data-lab-open-exam="${selected}">مشاهده پرونده</button></div></div><div class="lab-print-area">${rows}</div></section></div>`;
  $$("[data-lab-patient]", target).forEach(button => button.addEventListener("click", () => renderLaboratoryResponseWorkspace(button.dataset.labPatient)));
  $$("[data-lab-status]", target).forEach(button => button.addEventListener("click", () => updateLabRequestStatus(button.dataset.labPet, Number(button.dataset.labIndex), button.dataset.labStatus)));
  $$("[data-lab-answer]", target).forEach(button => button.addEventListener("click", () => openLabAnswerModal(button.dataset.labAnswer, Number(button.dataset.labIndex))));
  $("#labPrintSelected", target)?.addEventListener("click", () => printLaboratoryPatient(selected));
  $("[data-lab-open-exam]", target)?.addEventListener("click", () => openExamForPet(selected));
  $("#labPatientSearch", target)?.addEventListener("input", event => {
    const query = event.target.value.trim().toLowerCase();
    $$(".lab-patient-item", target).forEach(item => { item.hidden = !item.textContent.toLowerCase().includes(query); });
  });
  $$("[data-lab-filter]", target).forEach(button => button.addEventListener("click", () => {
    $$("[data-lab-filter]", target).forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.labFilter;
    $$(".lab-patient-item", target).forEach(item => {
      const name = item.dataset.labPatient;
      const patientRequests = requests.filter(item => item.petName === name);
      const show = filter === "all" || (filter === "open" && patientRequests.some(item => item.status !== "انجام‌شده")) || (filter === "done" && patientRequests.every(item => item.status === "انجام‌شده")) || (filter === "critical" && patientRequests.some(item => item.priority === "بحرانی"));
      item.hidden = !show;
    });
  }));
  $("#printLabButton")?.addEventListener("click", () => printLaboratoryPatient(selected));
}

async function updateLabRequestStatus(petName, index, status) {
  const record = getPetClinicalRecord(petName);
  const requests = [...record.labRequests];
  if (remoteData.loaded && requests[index]?.id && /^\d+$/.test(String(requests[index].id))) {
    try {
      await apiRequest(`/lab-requests/${requests[index].id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: labUiToApiStatus[status] || status,
          accession_number: requests[index].accessionNumber || null,
          received_at: status === "Ù†Ù…ÙˆÙ†Ù‡ Ø¯Ø±ÛŒØ§ÙØª Ø´Ø¯" ? new Date().toISOString() : null
        })
      });
      await loadRemoteData();
      renderLaboratoryResponseWorkspace(petName);
      renderExamWorkspace();
      return toast(`ÙˆØ¶Ø¹ÛŒØª Ø¢Ø²Ù…Ø§ÛŒØ´ Ø¨Ù‡ Â«${status}Â» ØªØºÛŒÛŒØ± Ú©Ø±Ø¯.`);
    } catch (error) {
      return toast(error.message);
    }
  }
  if (!requests[index]) return toast("درخواست آزمایش پیدا نشد.");
  requests[index] = {
    ...requests[index],
    status,
    accessionNumber: requests[index].accessionNumber || (status === "نمونه دریافت شد" || status === "در حال انجام" || status === "انجام‌شده" ? `LAB-${Date.now().toString().slice(-6)}` : ""),
    receivedAt: status === "نمونه دریافت شد" ? new Intl.DateTimeFormat("fa-IR").format(new Date()) : requests[index].receivedAt
  };
  updateClinicalRecord(petName, { labRequests: requests });
  renderLaboratoryResponseWorkspace(petName);
  renderExamWorkspace();
  toast(`وضعیت آزمایش به «${status}» تغییر کرد.`);
}

function openLabAnswerModal(petName, index) {
  const request = remoteData.loaded
    ? allLabRequests().filter(item => item.petName === petName)[index]
    : getPetClinicalRecord(petName).labRequests[index];
  if (!request) return toast("درخواست آزمایش پیدا نشد.");
  openActionModal("lab-answer", petName);
  $("#actionForm").dataset.labPet = petName;
  $("#actionForm").dataset.labIndex = String(index);
  $("#actionForm").dataset.labRequestId = String(request.id || "");
  const testSelect = $("select[name='answerTest']", $("#actionFields"));
  if (testSelect) {
    const requestedTest = flattenLaboratoryCatalog().find(test =>
      test.label === request.panel || test.testKey === request.testKey
    );
    if (requestedTest) testSelect.value = requestedTest.testKey;
    testSelect.dispatchEvent(new Event("change"));
  }
}

function printLaboratoryPatient(petName) {
  const pet = state.pets.find(item => item.name === petName);
  const record = getPetClinicalRecord(petName);
  const results = getUnifiedLabResultsForPet(petName, pet?.id);
  const requestsById = new Map(record.labRequests.map(item => [item.id, item]));
  const resultRows = results.map(item => {
    const request = requestsById.get(item.requestId);
    return `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.result)} ${escapeHtml(item.unit)}</td><td>${escapeHtml(item.reference || "بازه مرجع ثبت نشده")}</td><td>${item.status === "danger" ? "بحرانی" : item.status === "warning" ? "نیازمند بررسی" : "طبیعی"}</td><td>${escapeHtml(item.interpretation || "—")}</td><td>${escapeHtml(item.date || request?.createdAt || "—")}</td></tr>`;
  }).join("");
  const pendingRows = record.labRequests
    .filter(item => !results.some(result => result.requestId === item.id))
    .map(item => `<tr><td>${escapeHtml(item.panel || "آزمایش")}</td><td>—</td><td>—</td><td>${escapeHtml(item.status || "درخواست‌شده")}</td><td>نتیجه هنوز ثبت نشده است</td><td>${escapeHtml(item.createdAt || "—")}</td></tr>`)
    .join("");
  const rows = resultRows || pendingRows;
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return toast("پنجره چاپ توسط مرورگر مسدود شده است.");
  printWindow.document.write(`<html dir="rtl"><head><meta charset="utf-8"><title>جواب آزمایش ${escapeHtml(petName)}</title><style>body{font-family:Tahoma,Arial;padding:30px;color:#102a43}h1{font-size:22px;margin-bottom:6px}p{color:#5d707b}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #b9c9cf;padding:9px;text-align:right;font-size:12px}th{background:#edf7f6}.muted{color:#7b8d94;font-size:11px}.danger{color:#b55c5e;font-weight:700}.warning{color:#a06c38;font-weight:700}.sign{display:flex;justify-content:space-between;margin-top:55px}.empty{text-align:center;padding:18px}</style></head><body><h1>جواب آزمایش پت‌کلینیک</h1><p>بیمار: <b>${escapeHtml(petName)}</b> · صاحب: <b>${escapeHtml(pet?.owner || "—")}</b> · گونه: <b>${escapeHtml(pet?.species || "—")}</b></p><p class="muted">تاریخ چاپ: ${escapeHtml(new Intl.DateTimeFormat("fa-IR").format(new Date()))} · بازه‌های مرجع بر اساس گونه و کاتالوگ آزمایشگاه</p><table><thead><tr><th>آزمایش</th><th>نتیجه</th><th>بازه مرجع</th><th>وضعیت</th><th>تفسیر</th><th>تاریخ</th></tr></thead><tbody>${rows || "<tr><td class='empty' colspan='6'>جواب یا درخواست آزمایشی ثبت نشده است.</td></tr>"}</tbody></table><div class="sign"><span>امضای دامپزشک: ................</span><span>مهر آزمایشگاه: ................</span></div><script>window.onload=()=>window.print();</script></body></html>`);
  printWindow.document.close();
}

function renderExamWorkspace() {
  const target = $("#examWorkspace");
  if (!target) return;
  const pets = state.pets.filter(pet => !isCustomerSession() || pet.owner === currentCustomer()?.name);
  const selectedName = target.dataset.selectedPet || pets[0]?.name;
  const pet = pets.find(item => item.name === selectedName) || pets[0];
  if (!pet) {
    target.innerHTML = `<div class="workspace-card empty-preview"><span>🐾</span><h2>هنوز پتی برای معاینه ثبت نشده است</h2><p>ابتدا یک مشتری و حیوان ثبت کنید.</p></div>`;
    return;
  }
  target.dataset.selectedPet = pet.name;
  const clinical = getPetClinicalRecord(pet.name);
  const requests = [...clinical.labRequests.map(item => ({ ...item, kind: "آزمایش" })), ...clinical.imagingRequests.map(item => ({ ...item, kind: "تصویربرداری" }))];
  const resultRows = [
    ...clinical.labs.map(item => `<div class="exam-result-row"><span class="exam-result-icon lab">⌁</span><div><strong>${item.name}</strong><small>${item.date} · ${item.reference || "بازه مرجع ثبت نشده"}</small></div><b class="${item.status === "danger" ? "danger-text" : ""}">${item.result}</b><em class="status ${item.status === "danger" ? "danger" : item.status === "warning" ? "warning" : "success"}">${item.status === "danger" ? "بحرانی" : item.status === "warning" ? "نیازمند بررسی" : "طبیعی"}</em></div>`),
    ...clinical.imaging.map(item => `<div class="exam-result-row"><span class="exam-result-icon imaging">◉</span><div><strong>${item.type}</strong><small>${item.date}${item.fileName ? ` · ${item.fileName}` : ""}</small></div><b>${item.result}</b><em class="status success">${item.fileName ? "دریافت شد" : "ثبت شد"}</em></div>`)
  ].join("");
  const requestRows = requests.map(item => `<div class="exam-result-row"><span class="exam-result-icon request">◷</span><div><strong>${item.kind} · ${item.panel || item.type || "درخواست جدید"}</strong><small>${item.createdAt || "امروز"} · اولویت: ${item.priority || "عادی"}</small></div><b>${item.status || "درخواست‌شده"}</b><em class="status warning">در انتظار</em></div>`).join("");
  const medicationRows = clinical.medicines.map(item => `<span class="summary-tag medicine">${item}</span>`).join("");
  const followupRows = clinical.followups.map(item => `<div class="metric-line"><span>${item.reason || "مراجعه بعدی"}</span><b>${item.date || "ثبت نشده"}</b><em>${item.note || "یادآوری فعال"}</em></div>`).join("");
  target.innerHTML = `
    <div class="exam-toolbar workspace-card">
      <div><h2>پرونده جاری: ${pet.name}</h2><p>${pet.species} · ${pet.breed} · صاحب: ${pet.owner} · ${pet.age} · ${pet.weight}</p></div>
      <label>انتخاب پت<select id="examPetSelect">${pets.map(item => `<option value="${item.name}" ${item.name === pet.name ? "selected" : ""}>${item.name} · ${item.owner}</option>`).join("")}</select></label>
    </div>
    <div class="exam-layout">
      <section class="workspace-card exam-main-card">
        <div class="workspace-toolbar"><div><h2>معاینه و تصمیم درمانی</h2><p>اطلاعات بالینی این مراجعه را ثبت کنید.</p></div><span class="status ${pet.statusClass || "blue-status"}">${pet.status || "فعال"}</span></div>
        <div class="exam-summary-grid"><div><small>وضعیت فعلی</small><strong>${clinical.diagnosis}</strong></div><div><small>حساسیت‌ها</small><strong>${clinical.allergies.join(" · ")}</strong></div><div><small>یادداشت پرونده</small><strong>${clinical.notes}</strong></div></div>
        <div class="exam-action-grid">
          <button type="button" data-exam-action="record"><span>▤</span><strong>ثبت معاینه</strong><small>علائم، تشخیص و یادداشت</small></button>
          <button type="button" data-exam-action="lab-request"><span>⌁</span><strong>درخواست آزمایش</strong><small>پنل و اولویت نمونه</small></button>
          <button type="button" data-exam-action="lab"><span>✓</span><strong>ثبت جواب آزمایش</strong><small>نتیجه و محدوده نرمال</small></button>
          <button type="button" data-exam-action="imaging-request"><span>◉</span><strong>درخواست تصویربرداری</strong><small>رادیولوژی یا سونوگرافی</small></button>
          <button type="button" data-exam-action="upload"><span>⇧</span><strong>دریافت تصویر/گزارش</strong><small>پیوست به همین پرونده</small></button>
          <button type="button" data-exam-action="medication"><span>✚</span><strong>ثبت دارو و تحویل</strong><small>نسخه و وضعیت تحویل</small></button>
          <button type="button" data-exam-action="nutrition"><span>✣</span><strong>جیره‌نویسی</strong><small>پیش‌نویس و تأیید پزشک</small></button>
          <button type="button" data-exam-action="followup"><span>◷</span><strong>مراجعه بعدی</strong><small>فقط در صورت نیاز</small></button>
        </div>
      </section>
      <aside class="workspace-card exam-next-card"><div class="workspace-toolbar"><div><h2>خلاصه این مراجعه</h2><p>نتایج ثبت‌شده در همین صفحه</p></div></div><div class="exam-counter"><span>درخواست‌ها<b>${requests.length}</b></span><span>نتایج<b>${clinical.labs.length + clinical.imaging.length}</b></span><span>داروها<b>${clinical.medicines.length}</b></span></div>${followupRows || `<div class="empty-copy">برای این پت مراجعه بعدی ثبت نشده است.</div>`}</aside>
    </div>
    <section class="workspace-card exam-results-card"><div class="workspace-toolbar"><div><h2>پیگیری درخواست‌ها و جواب‌ها</h2><p>پزشک می‌تواند وضعیت آزمایش و تصویربرداری را در همین صفحه دنبال کند.</p></div></div>${requestRows || `<div class="empty-copy">درخواستی برای این مراجعه ثبت نشده است.</div>`}${resultRows || `<div class="empty-copy">هنوز جواب یا تصویر دریافت نشده است.</div>`}</section>
    <section class="workspace-card exam-medication-card"><div class="workspace-toolbar"><div><h2>دارو و جیره</h2><p>نسخه، وضعیت تحویل دارو و برنامه تغذیه‌ای پت</p></div></div><div class="summary-tags">${medicationRows || `<span class="empty-copy">دارویی ثبت نشده است.</span>`}</div><div class="nutrition-summary"><strong>${clinical.nutrition.title}</strong><p>${clinical.nutrition.formula}</p><span class="status warning">${clinical.nutrition.review}</span></div></section>`;
  $("#examPetSelect")?.addEventListener("change", event => {
    target.dataset.selectedPet = event.target.value;
    renderExamWorkspace();
  });
}

function renderLaboratoryCatalog() {
  const section = $('.page-section[data-view="laboratory"]');
  if (!section || $(".lab-catalog-panel", section)) return;
  const groups = Object.entries(laboratoryCatalog).map(([key, group]) => {
    const rows = Object.entries(group.tests).map(([testKey, test]) => {
      const dog = test.dog ? `${test.dog[0]} تا ${test.dog[1]}` : "—";
      const cat = test.cat ? `${test.cat[0]} تا ${test.cat[1]}` : "—";
      return `<div class="lab-catalog-row"><span>${test.label}</span><span>${test.unit}</span><span>${dog}</span><span>${cat}</span><button class="text-button" data-lab-group="${key}" data-lab-test="${testKey}">انتخاب</button></div>`;
    }).join("");
    return `<div class="lab-catalog-group"><h3>${group.label}</h3><div class="lab-catalog-head"><span>عنوان آزمایش</span><span>واحد</span><span>سگ</span><span>گربه</span><span></span></div>${rows}</div>`;
  }).join("");
  section.insertAdjacentHTML("beforeend", `<div class="workspace-card lab-catalog-panel"><div class="workspace-toolbar"><div><h2>کاتالوگ آزمایش‌های پیش‌فرض</h2><p>گروه‌بندی، عنوان، واحد و بازه مرجع عمومی سگ و گربه</p></div><span class="status blue-status">قابل تنظیم</span></div><div class="lab-catalog-note">بازه‌های زیر راهنمای عمومی هستند و باید با بازه مرجع همان آزمایشگاه، دستگاه، روش و جمعیت مورد استفاده تطبیق داده شوند.</div>${groups}</div>`);
  $$(".lab-catalog-row button", section).forEach(button => button.addEventListener("click", () => {
    openActionModal("lab");
    $("#labGroupSelect").value = button.dataset.labGroup;
    $("#labGroupSelect").dispatchEvent(new Event("change"));
    $("#labTestSelect").value = button.dataset.labTest;
    updateLabMeta();
  }));
}

function renderImagingWorkspace() {
  const section = $('.page-section[data-view="imaging"]');
  const card = $(".upload-card", section);
  if (!card) return;
  card.innerHTML = `<div class="upload-icon">⇧</div><h2>آپلود تصویر یا گزارش پزشکی</h2><p>هر فایل به پرونده پت و رکورد تصویربرداری متصل و در دیتابیس کلینیک ذخیره می‌شود.</p><div class="upload-steps"><span>۱. انتخاب پت</span><span>۲. انتخاب نوع تصویر</span><span>۳. انتخاب فایل</span></div><button class="button primary" data-action="upload">انتخاب فایل و ثبت در پرونده</button><small class="upload-help">فرمت‌های مجاز: JPG، PNG، WEBP، PDF و DICOM · سقف فایل: ۱٫۲ مگابایت</small>`;
  $("[data-action='upload']", card)?.addEventListener("click", () => openActionModal("upload"));
  const list = $(".study-list", section);
  if (!list) return;
  const studies = remoteModuleData.imaging.length
    ? remoteModuleData.imaging
    : allKnownPets().flatMap(pet => getPetClinicalRecord(pet.name).imaging.map(item => ({ ...item, pet_name: pet.name })));
  list.innerHTML = studies.map(item => {
    const fileHref = String(item.file_data || item.fileData || "").startsWith("data:") ? item.file_data || item.fileData : "";
    const fileAction = fileHref
      ? `<a class="button ghost" download="${escapeHtml(item.file_name || item.fileName || "imaging-file")}" href="${fileHref}" target="_blank" rel="noopener">مشاهده فایل</a>`
      : "";
    const stateLabel = item.status || (item.report ? "گزارش ثبت‌شده" : "در انتظار گزارش");
    const stateClass = ["تأییدشده", "تأیید شده", "ثبت‌شده"].includes(stateLabel) ? "success" : "warning";
    return `<div><div class="study-thumb blue-thumb">◉</div><span><b>${escapeHtml(item.study_type || item.type || "تصویربرداری")} · ${escapeHtml(item.pet_name || item.petName || "پت")}</b><small>${escapeHtml(item.body_area || item.area || "")} · ${escapeHtml(item.created_at || item.date || "امروز")}${item.file_name || item.fileName ? ` · ${escapeHtml(item.file_name || item.fileName)}` : ""}</small></span><em class="status ${stateClass}">${escapeHtml(stateLabel)}</em>${fileAction}</div>`;
  }).join("") || `<div class="empty-copy">هنوز مطالعه تصویربرداری ثبت نشده است.</div>`;
}

function getExamOptions(key) {
  return [...new Set([...(examOptionDefaults[key] || []), ...getStored(`petclinic-exam-options-${key}`, [])])];
}

function addExamOption(key) {
  const value = window.prompt(`گزینه جدید برای «${examOptionLabels[key]}» را وارد کنید:`);
  const clean = String(value || "").trim();
  if (!clean) return;
  const custom = getStored(`petclinic-exam-options-${key}`, []);
  if (!custom.includes(clean)) {
    custom.push(clean);
    localStorage.setItem(`petclinic-exam-options-${key}`, JSON.stringify(custom));
  }
  renderRecordFields();
  toast("گزینه جدید به فهرست اضافه شد.");
}

function renderRecordFields() {
  const fields = $("#actionFields");
  if (!fields) return;
  const pets = state.pets.filter(pet => !isCustomerSession() || pet.owner === currentCustomer()?.name);
  const optionField = key => `<label>${examOptionLabels[key]}<div class="field-with-action"><select name="${key}" required>${getExamOptions(key).map(item => `<option>${item}</option>`).join("")}</select><button type="button" class="mini-add-button" data-add-exam-option="${key}">＋ افزودن</button></div></label>`;
  fields.innerHTML = `
    <label>حیوان<select name="pet" required>${pets.map(pet => `<option value="${pet.name} · ${pet.owner}">${pet.name} · ${pet.owner}</option>`).join("")}</select></label>
    ${optionField("complaint")}
    ${optionField("finding")}
    ${optionField("diagnosis")}
    ${optionField("plan")}
    <label class="action-wide">شرح تکمیلی معاینه<textarea name="note" placeholder="علائم، مدت شروع، یافته‌های مهم و توصیه‌های پزشک"></textarea></label>
    <label>تاریخ پیگیری اختیاری<input name="followup" type="date" /></label>`;
  $$("[data-add-exam-option]", fields).forEach(button => button.addEventListener("click", () => addExamOption(button.dataset.addExamOption)));
}

function renderLabRequestFields() {
  const fields = $("#actionFields");
  if (!fields) return;
  const pets = state.pets.filter(pet => !isCustomerSession() || pet.owner === currentCustomer()?.name);
  fields.innerHTML = `
    <div class="request-form-grid">
      <label>حیوان<select name="pet" required>${pets.map(pet => `<option value="${pet.name} · ${pet.owner}">${pet.name} · ${pet.owner}</option>`).join("")}</select></label>
      <label>گروه آزمایش<select name="group" id="requestLabGroup" required>${Object.entries(laboratoryCatalog).map(([key, group]) => `<option value="${key}">${group.label}</option>`).join("")}</select></label>
      <label>عنوان آزمایش<select name="testKey" id="requestLabTest" required></select></label>
      <label>نوع نمونه<select name="sample" required><option>خون کامل</option><option>سرم</option><option>ادرار</option><option>مدفوع</option><option>سوآب</option></select></label>
      <label>اولویت<select name="priority" required><option>عادی</option><option>فوری</option><option>بحرانی</option></select></label>
      <label>علت درخواست<input name="reason" placeholder="مثلاً بررسی کم‌خونی یا کلیه" /></label>
    </div>
    <button type="button" class="button ghost add-draft-button" id="addLabDraft">＋ افزودن آزمایش به فهرست</button>
    <div class="draft-list" id="labDraftList"></div>`;
  const refresh = () => {
    const group = laboratoryCatalog[$("#requestLabGroup").value];
    const species = getPetSpeciesForLab($('select[name="pet"]', fields).value);
    const tests = Object.entries(group.tests).filter(([, test]) => test[species]);
    $("#requestLabTest").innerHTML = tests.map(([key, test]) => `<option value="${key}">${test.label}</option>`).join("");
  };
  $("#requestLabGroup").addEventListener("change", refresh);
  $('select[name="pet"]', fields).addEventListener("change", refresh);
  $("#addLabDraft").addEventListener("click", () => {
    const form = $("#actionForm");
    const test = getLabTest($("#requestLabTest").value);
    if (!test) return toast("عنوان آزمایش را انتخاب کنید.");
    actionDraftItems.labRequest.push({
      pet: $('select[name="pet"]', form).value,
      panel: test.label,
      testKey: $("#requestLabTest").value,
      sample: $('select[name="sample"]', form).value,
      priority: $('select[name="priority"]', form).value,
      reason: $('input[name="reason"]', form).value
    });
    renderDraftLists();
    toast("آزمایش به فهرست درخواست‌ها اضافه شد.");
  });
  refresh();
  renderDraftLists();
}

function renderMedicationCatalogFields() {
  const fields = $("#actionFields");
  if (!fields) return;
  const pets = state.pets.filter(pet => !isCustomerSession() || pet.owner === currentCustomer()?.name);
  const categories = Object.entries(medicationCatalog);
  const allItems = categories.flatMap(([category, group]) => group.items.map(item => ({ category, group: group.label, key: item[0], name: item[1], form: item[2], warning: item[3] })));
  fields.innerHTML = `
    <div class="request-form-grid">
      <label>حیوان<select name="pet" required>${pets.map(pet => `<option value="${pet.name} · ${pet.owner}">${pet.name} · ${pet.owner}</option>`).join("")}</select></label>
      <label>دسته دارویی<select name="medicineCategory" id="medicineCategory" required><option value="all">همه دسته‌ها</option>${categories.map(([key, group]) => `<option value="${key}">${group.label}</option>`).join("")}</select></label>
      <label>نام دارو<select name="medicineKey" id="medicineSelect" required></select></label>
      <label>شکل دارویی<input name="medicineForm" readonly /></label>
      <label>دوز و روش مصرف<input name="dose" required placeholder="مثلاً هر ۱۲ ساعت، ۱ قرص" /></label>
      <label>مدت مصرف<input name="duration" required placeholder="مثلاً ۷ روز" /></label>
      <label>وضعیت تحویل<select name="dispensed" required><option>تحویل نشده</option><option>تحویل به مالک</option><option>تحویل از داروخانه</option></select></label>
      <label>توضیح کوتاه<input name="note" placeholder="هشدار یا توصیه مصرف" /></label>
    </div>
    <div class="medicine-safety-note">⚕ فهرست دارویی برای سرعت ثبت نسخه است؛ انتخاب دارو، دوز و مدت مصرف باید توسط دامپزشک و بر اساس گونه، وزن، تشخیص و آزمایش‌های پت تأیید شود.</div>
    <div class="medicine-warning" id="medicineWarning" role="status"></div>
    <button type="button" class="button ghost add-draft-button" id="addMedicationDraft">＋ افزودن دارو به فهرست</button>
    <div class="draft-list" id="medicationDraftList"></div>`;
  const categorySelect = $("#medicineCategory");
  const medicineSelect = $("#medicineSelect");
  const medicineForm = $('input[name="medicineForm"]', fields);
  const warning = $("#medicineWarning");
  const refreshDetails = () => {
    const item = allItems.find(entry => entry.key === medicineSelect.value);
    medicineForm.value = item?.form || "";
    warning.textContent = item ? `⚠ ${item.warning}` : "";
  };
  const refreshOptions = () => {
    const items = categorySelect.value === "all" ? allItems : allItems.filter(item => item.category === categorySelect.value);
    medicineSelect.innerHTML = items.map(item => `<option value="${item.key}">${item.name}</option>`).join("") + `<option value="custom">＋ داروی سفارشی / ثبت دستی</option>`;
    refreshDetails();
  };
  categorySelect.addEventListener("change", refreshOptions);
  medicineSelect.addEventListener("change", refreshDetails);
  refreshOptions();
  $("#addMedicationDraft").addEventListener("click", () => {
    const form = $("#actionForm");
    const selected = allItems.find(item => item.key === medicineSelect.value);
    let medicine = selected?.name || "";
    if (medicineSelect.value === "custom") {
      medicine = window.prompt("نام داروی سفارشی را وارد کنید:")?.trim() || "";
    }
    if (!medicine) return toast("نام دارو را انتخاب یا وارد کنید.");
    actionDraftItems.medication.push({
      pet: $('select[name="pet"]', form).value,
      medicine,
      medicineKey: selected?.key || "custom",
      category: selected?.group || "داروی سفارشی",
      medicineForm: medicineForm.value,
      dose: $('input[name="dose"]', form).value,
      duration: $('input[name="duration"]', form).value,
      dispensed: $('select[name="dispensed"]', form).value,
      note: $('input[name="note"]', form).value
    });
    renderDraftLists();
    ["dose", "duration", "note"].forEach(name => { const input = $(`[name="${name}"]`, form); if (input) input.value = ""; });
    toast("دارو به فهرست نسخه اضافه شد.");
  });
  renderDraftLists();
}

function renderMedicationFields() {
  const fields = $("#actionFields");
  if (!fields) return;
  const pets = state.pets.filter(pet => !isCustomerSession() || pet.owner === currentCustomer()?.name);
  fields.innerHTML = `
    <div class="request-form-grid">
      <label>حیوان<select name="pet" required>${pets.map(pet => `<option value="${pet.name} · ${pet.owner}">${pet.name} · ${pet.owner}</option>`).join("")}</select></label>
      <label>نام دارو<input name="medicine" required placeholder="مثلاً آموکسی‌سیلین" /></label>
      <label>دوز و روش مصرف<input name="dose" required placeholder="مثلاً هر ۱۲ ساعت، ۱ قرص" /></label>
      <label>مدت مصرف<input name="duration" required placeholder="مثلاً ۷ روز" /></label>
      <label>وضعیت تحویل<select name="dispensed" required><option>تحویل نشده</option><option>تحویل به مالک</option><option>تحویل از داروخانه</option></select></label>
      <label>توضیح کوتاه<input name="note" placeholder="هشدار یا توصیه مصرف" /></label>
    </div>
    <button type="button" class="button ghost add-draft-button" id="addMedicationDraft">＋ افزودن دارو به فهرست</button>
    <div class="draft-list" id="medicationDraftList"></div>`;
  $("#addMedicationDraft").addEventListener("click", () => {
    const form = $("#actionForm");
    const medicine = $('input[name="medicine"]', form).value.trim();
    if (!medicine) return toast("نام دارو را وارد کنید.");
    actionDraftItems.medication.push({
      pet: $('select[name="pet"]', form).value,
      medicine,
      dose: $('input[name="dose"]', form).value,
      duration: $('input[name="duration"]', form).value,
      dispensed: $('select[name="dispensed"]', form).value,
      note: $('input[name="note"]', form).value
    });
    renderDraftLists();
    ["medicine", "dose", "duration", "note"].forEach(name => { const input = $(`[name="${name}"]`, form); if (input) input.value = ""; });
    toast("دارو به فهرست نسخه اضافه شد.");
  });
  renderDraftLists();
}

function renderLabAnswerFields() {
  const fields = $("#actionFields");
  if (!fields) return;
  const form = $("#actionForm");
  const petName = form?.dataset.labPet || "";
  const pet = state.pets.find(item => item.name === petName);
  const species = getPetSpeciesForLab(petName);
  const speciesLabel = species === "cat" ? "گربه" : "سگ";
  const tests = flattenLaboratoryCatalog().filter(test => test[species]);
  fields.innerHTML = `<div class="request-form-grid">
    <label>حیوان
      <input name="answerPet" value="${pet ? `${pet.name} · ${pet.owner || ""}` : petName}" readonly />
    </label>
    <label>گونه
      <input name="answerSpecies" value="${speciesLabel}" readonly />
    </label>
    <label>عنوان شاخص
      <select name="answerTest" required>${tests.map(test => `<option value="${test.testKey}">${test.groupLabel} · ${test.label}</option>`).join("")}</select>
    </label>
    <label>نتیجه
      <input name="result" required placeholder="مثلاً ۸.۴ یا مثبت" />
    </label>
    <label>واحد
      <input name="unit" readonly />
    </label>
    <label>پرچم نتیجه
      <select name="flag"><option>طبیعی</option><option>پایین</option><option>بالا</option><option>بحرانی</option><option>مثبت</option><option>منفی</option></select>
    </label>
    <label>محدوده مرجع گونه
      <input name="reference" readonly />
    </label>
    <label>تفسیر
      <input name="interpretation" placeholder="توضیح آزمایشگاه" />
    </label>
  </div>
  <div class="lab-answer-species-note">محدوده‌ی نمایش‌داده‌شده برای ${speciesLabel} است؛ در صورت تفاوت، مرجع همان آزمایشگاه و دستگاه اولویت دارد.</div>
  <button type="button" class="button ghost add-draft-button" id="addLabAnswerDraft">＋ افزودن شاخص به جواب</button>
  <div class="draft-list" id="labAnswerDraftList"></div>`;
  const testSelect = $('select[name="answerTest"]', fields);
  const resultInput = $('input[name="result"]', fields);
  const unitInput = $('input[name="unit"]', fields);
  const referenceInput = $('input[name="reference"]', fields);
  const flagSelect = $('select[name="flag"]', fields);
  const refreshAnswerMeta = () => {
    const test = getLabTest(testSelect?.value);
    const range = test?.[species];
    if (!test || !range) return;
    unitInput.value = test.unit || "";
    referenceInput.value = `${range[0]} تا ${range[1]} ${test.unit || ""}`.trim();
    const raw = String(resultInput.value || "").trim().replace(",", ".");
    const numeric = raw !== "" && Number.isFinite(Number(raw));
    if (numeric) {
      const number = Number(raw);
      flagSelect.value = number < range[0] ? "پایین" : number > range[1] ? "بالا" : "طبیعی";
    }
  };
  testSelect.addEventListener("change", refreshAnswerMeta);
  resultInput.addEventListener("input", refreshAnswerMeta);
  refreshAnswerMeta();
  $("#addLabAnswerDraft").addEventListener("click", () => {
    const form = $("#actionForm");
    const test = getLabTest($('select[name="answerTest"]', form).value);
    const result = $('input[name="result"]', form).value.trim();
    if (!test || !result) return toast("عنوان شاخص و نتیجه را وارد کنید.");
    actionDraftItems.labAnswer.push({
      name: test.label,
      testKey: test.testKey,
      species,
      result,
      unit: $('input[name="unit"]', form).value,
      flag: $('select[name="flag"]', form).value,
      reference: $('input[name="reference"]', form).value,
      interpretation: $('input[name="interpretation"]', form).value
    });
    renderDraftLists();
    resultInput.value = "";
    $('input[name="interpretation"]', form).value = "";
    refreshAnswerMeta();
    toast("شاخص به جواب آزمایش اضافه شد.");
  });
  renderDraftLists();
}

function renderDraftLists() {
  const labList = $("#labDraftList");
  if (labList) labList.innerHTML = actionDraftItems.labRequest.map((item, index) => `<div class="draft-row"><span>⌁</span><div><strong>${item.panel}</strong><small>${item.pet} · ${item.sample} · اولویت ${item.priority}</small></div><button type="button" class="row-more draft-remove" data-draft-type="labRequest" data-draft-index="${index}" aria-label="حذف آزمایش">×</button></div>`).join("") || `<div class="empty-copy">هنوز آزمایشی به فهرست اضافه نشده است.</div>`;
  const medicationList = $("#medicationDraftList");
  if (medicationList) medicationList.innerHTML = actionDraftItems.medication.map((item, index) => `<div class="draft-row"><span>✚</span><div><strong>${item.medicine}</strong><small>${item.pet} · ${item.dose} · ${item.duration} · ${item.dispensed}</small></div><button type="button" class="row-more draft-remove" data-draft-type="medication" data-draft-index="${index}" aria-label="حذف دارو">×</button></div>`).join("") || `<div class="empty-copy">هنوز دارویی به فهرست اضافه نشده است.</div>`;
  const answerList = $("#labAnswerDraftList");
  if (answerList) answerList.innerHTML = actionDraftItems.labAnswer.map((item, index) => `<div class="draft-row"><span>✓</span><div><strong>${item.name}: ${item.result} ${item.unit || ""}</strong><small>${item.flag} · محدوده ${item.reference || "ثبت نشده"} · ${item.interpretation || "بدون تفسیر"}</small></div><button type="button" class="row-more draft-remove" data-draft-type="labAnswer" data-draft-index="${index}" aria-label="حذف شاخص">×</button></div>`).join("") || `<div class="empty-copy">هنوز شاخصی به جواب اضافه نشده است.</div>`;
}

const actionDefinitions = {
  appointment: { icon: "◷", eyebrow: "تقویم کلینیک", title: "رزرو نوبت جدید", description: "نوبت را برای حیوان، خدمت و پزشک انتخاب کنید.", submit: "ثبت نوبت", fields: [["pet", "حیوان", "select", ["میلو · سارا کریمی", "راکی · امیر رحیمی", "پونه · نسترن محمدی", "لونا · کامران توکلی"]], ["service", "خدمت", "select", ["معاینه عمومی", "آزمایش خون", "سونوگرافی", "ویزیت تغذیه"]], ["date", "تاریخ", "date", []], ["time", "ساعت", "time", []]] },
  record: { icon: "▤", eyebrow: "پرونده الکترونیک", title: "ثبت ویزیت جدید", description: "یادداشت معاینه و برنامه پیگیری را به پرونده حیوان اضافه کنید.", submit: "ثبت ویزیت", fields: [["pet", "حیوان", "select", ["میلو · سارا کریمی", "راکی · امیر رحیمی", "پونه · نسترن محمدی"]], ["diagnosis", "تشخیص اولیه", "text", []], ["note", "شرح معاینه", "textarea", []], ["followup", "تاریخ پیگیری", "date", []]] },
  lab: { icon: "⌁", eyebrow: "آزمایشگاه", title: "درخواست آزمایش", description: "نمونه و پنل آزمایش را برای پرونده حیوان ثبت کنید.", submit: "ثبت درخواست", fields: [["pet", "حیوان", "select", ["میلو · سارا کریمی", "راکی · امیر رحیمی", "پونه · نسترن محمدی"]], ["panel", "پنل آزمایش", "checkbox", ["CBC", "بیوشیمی کامل", "ادرار", "هورمون", "کشت و آنتی‌بیوگرام"]], ["sample", "نوع نمونه", "select", ["خون کامل", "سرم", "ادرار", "مدفوع", "سوآب"]], ["priority", "اولویت", "select", ["عادی", "فوری", "بحرانی"]]] },
  imaging: { icon: "◉", eyebrow: "تصویربرداری", title: "ثبت مطالعه جدید", description: "نوع مطالعه و ناحیه بدن را مشخص کنید.", submit: "ثبت مطالعه", fields: [["pet", "حیوان", "select", ["میلو · سارا کریمی", "راکی · امیر رحیمی", "لونا · کامران توکلی"]], ["type", "نوع تصویربرداری", "select", ["رادیولوژی", "سونوگرافی", "CT", "MRI"]], ["area", "ناحیه بدن", "text", []], ["file", "فایل تصویر یا گزارش", "file", []]] },
  upload: { icon: "⇧", eyebrow: "فایل پزشکی", title: "آپلود فایل", description: "فایل را انتخاب کنید تا به مطالعه تصویربرداری متصل شود.", submit: "آپلود فایل", fields: [["file", "انتخاب فایل", "file", []]] },
  nutrition: { icon: "✣", eyebrow: "تغذیه درمانی", title: "شروع جیره‌سازی", description: "حیوان و هدف تغذیه‌ای را برای ساخت جیره انتخاب کنید.", submit: "ساخت پیش‌نویس جیره", fields: [["pet", "حیوان", "select", ["میلو · سارا کریمی", "راکی · امیر رحیمی", "پونه · نسترن محمدی"]], ["goal", "هدف جیره", "select", ["نگهداری", "کاهش وزن", "افزایش وزن", "تغذیه درمانی"]], ["budget", "سطح بودجه", "select", ["Bronze", "Silver", "Gold"]], ["limits", "محدودیت سلامت", "textarea", []]] },
  report: { icon: "▥", eyebrow: "گزارش مدیریتی", title: "ساخت خروجی گزارش", description: "نوع گزارش و بازه زمانی را انتخاب کنید.", submit: "ساخت گزارش", fields: [["type", "نوع گزارش", "select", ["مالی", "بالینی", "عملیاتی", "تغذیه"]], ["from", "از تاریخ", "date", []], ["to", "تا تاریخ", "date", []], ["format", "فرمت خروجی", "select", ["PDF", "Excel", "CSV"]]] },
  "save-settings": { icon: "⚙", eyebrow: "تنظیمات کلینیک", title: "ذخیره تنظیمات", description: "تغییرات تنظیمات عمومی کلینیک ثبت می‌شود.", submit: "تأیید و ذخیره", fields: [["confirm", "توضیح تغییرات", "textarea", []]] },
  "lab-request": { icon: "⌁", eyebrow: "درخواست آزمایش", title: "درخواست آزمایش برای پت", description: "پزشک نوع پنل، نمونه و اولویت بررسی را مشخص می‌کند.", submit: "ثبت درخواست آزمایش", fields: [["pet", "حیوان", "select", ["میلو · سارا کریمی", "راکی · امیر رحیمی", "پونه · نسترن محمدی"]], ["panel", "پنل آزمایش", "select", ["CBC", "بیوشیمی کامل", "ادرار", "هورمون", "کشت و آنتی‌بیوگرام"]], ["sample", "نوع نمونه", "select", ["خون کامل", "سرم", "ادرار", "مدفوع", "سوآب"]], ["priority", "اولویت", "select", ["عادی", "فوری", "بحرانی"]], ["reason", "علت درخواست", "textarea", []]] },
  "imaging-request": { icon: "◉", eyebrow: "درخواست تصویربرداری", title: "درخواست تصویربرداری", description: "نوع مطالعه، ناحیه بدن و علت درخواست را ثبت کنید.", submit: "ثبت درخواست تصویربرداری", fields: [["pet", "حیوان", "select", ["میلو · سارا کریمی", "راکی · امیر رحیمی", "لونا · کامران توکلی"]], ["type", "نوع تصویربرداری", "select", ["رادیولوژی", "سونوگرافی", "CT", "MRI"]], ["area", "ناحیه بدن", "text", []], ["priority", "اولویت", "select", ["عادی", "فوری", "بحرانی"]], ["reason", "علت درخواست", "textarea", []]] },
  medication: { icon: "✚", eyebrow: "نسخه و داروخانه", title: "ثبت دارو و تحویل", description: "دارو، مقدار مصرف و وضعیت تحویل را به پرونده اضافه کنید.", submit: "ثبت نسخه", fields: [["pet", "حیوان", "select", ["میلو · سارا کریمی", "راکی · امیر رحیمی", "پونه · نسترن محمدی"]], ["medicine", "نام دارو", "text", []], ["dose", "دوز و روش مصرف", "text", []], ["duration", "مدت مصرف", "text", []], ["dispensed", "وضعیت تحویل", "select", ["تحویل نشده", "تحویل به مالک", "تحویل از داروخانه"]], ["note", "توضیحات", "textarea", []]] },
  followup: { icon: "◷", eyebrow: "پیگیری درمان", title: "ثبت مراجعه بعدی", description: "اگر پیگیری لازم است، زمان و علت مراجعه بعدی را ثبت کنید.", submit: "ثبت زمان مراجعه", fields: [["pet", "حیوان", "select", ["میلو · سارا کریمی", "راکی · امیر رحیمی", "پونه · نسترن محمدی"]], ["date", "تاریخ مراجعه بعدی", "date", []], ["time", "ساعت", "time", []], ["reason", "علت مراجعه", "text", []], ["note", "یادداشت پیگیری", "textarea", []]] },
  "lab-answer": { icon: "✓", eyebrow: "پاسخ‌دهی آزمایشگاه", title: "ثبت جواب آزمایش", description: "نتیجه، واحد و تفسیر آزمایش را ثبت کنید؛ پس از ذخیره وضعیت خودکار انجام‌شده می‌شود.", submit: "ثبت جواب و تکمیل آزمایش", fields: [["answerTest", "عنوان آزمایش", "text", []], ["result", "نتیجه", "text", []], ["unit", "واحد", "text", []], ["interpretation", "تفسیر یا توضیح", "textarea", []]] }
};

const laboratoryCatalog = {
  hematology: {
    label: "هماتولوژی و CBC",
    tests: {
      wbc: { label: "WBC / گلبول سفید", unit: "×10³/µL", dog: [6, 13], cat: [4.5, 14] },
      rbc: { label: "RBC / گلبول قرمز", unit: "×10⁶/µL", dog: [5.6, 8], cat: [7, 10.5] },
      hgb: { label: "هموگلوبین (HGB)", unit: "g/dL", dog: [14, 19], cat: [10, 16] },
      hct: { label: "هماتوکریت (HCT)", unit: "%", dog: [40, 55], cat: [30, 50] },
      plt: { label: "پلاکت (PLT)", unit: "×10³/µL", dog: [150, 400], cat: [180, 500] },
      neutrophils: { label: "نوتروفیل", unit: "×10³/µL", dog: [3, 10.5], cat: [2, 9] },
      lymphocytes: { label: "لنفوسیت", unit: "×10³/µL", dog: [1, 4], cat: [1, 7] }
    }
  },
  chemistry: {
    label: "بیوشیمی خون",
    tests: {
      glucose: { label: "گلوکز (GLU)", unit: "mg/dL", dog: [70, 120], cat: [70, 150] },
      bun: { label: "اوره خون (BUN)", unit: "mg/dL", dog: [7, 27], cat: [14, 36] },
      creatinine: { label: "کراتینین (CREA)", unit: "mg/dL", dog: [0.5, 1.8], cat: [0.8, 2.4] },
      alt: { label: "آلانین ترانس‌آمیناز (ALT)", unit: "U/L", dog: [10, 100], cat: [20, 100] },
      alp: { label: "آلکالین فسفاتاز (ALP)", unit: "U/L", dog: [20, 200], cat: [10, 90] },
      ast: { label: "آسپارتات ترانس‌آمیناز (AST)", unit: "U/L", dog: [15, 66], cat: [10, 50] },
      totalProtein: { label: "پروتئین تام (TP)", unit: "g/dL", dog: [5.4, 7.5], cat: [6, 8] },
      albumin: { label: "آلبومین (ALB)", unit: "g/dL", dog: [2.3, 4], cat: [2.5, 3.9] }
    }
  },
  electrolytes: {
    label: "الکترولیت‌ها و املاح",
    tests: {
      sodium: { label: "سدیم (Na)", unit: "mmol/L", dog: [140, 155], cat: [145, 158] },
      potassium: { label: "پتاسیم (K)", unit: "mmol/L", dog: [3.8, 5.8], cat: [3.5, 5.8] },
      calcium: { label: "کلسیم (Ca)", unit: "mg/dL", dog: [9, 11.5], cat: [8.2, 10.8] },
      phosphorus: { label: "فسفر (P)", unit: "mg/dL", dog: [2.5, 6], cat: [3.1, 7.5] }
    }
  },
  urinalysis: {
    label: "آنالیز ادرار",
    tests: {
      urinePh: { label: "pH ادرار", unit: "pH", dog: [5.5, 7.5], cat: [5.5, 7] },
      urineSg: { label: "وزن مخصوص ادرار (USG)", unit: "SG", dog: [1.015, 1.045], cat: [1.035, 1.06] },
      urineProtein: { label: "پروتئین ادرار", unit: "mg/dL", dog: [0, 30], cat: [0, 30] }
    }
  },
  endocrine: {
    label: "هورمون‌ها",
    tests: {
      t4: { label: "تیروکسین تام (T4)", unit: "µg/dL", dog: [1, 4], cat: [0.8, 4] },
      cortisol: { label: "کورتیزول پایه", unit: "µg/dL", dog: [1, 5], cat: [1, 5] }
    }
  },
  infectious: {
    label: "عفونی و انگل‌شناسی",
    tests: {
      parvo: { label: "آنتی‌ژن پاروو", unit: "کیفی", dog: [0, 0] },
      giardia: { label: "آنتی‌ژن ژیاردیا", unit: "کیفی", dog: [0, 0], cat: [0, 0] },
      fiv: { label: "FIV Ab", unit: "کیفی", cat: [0, 0] },
      felv: { label: "FeLV Ag", unit: "کیفی", cat: [0, 0] }
    }
  }
};

// Veterinary Conflict Detection System from Pet Meal
const conflictDetectionSystem = {
  check: function(petData) {
    const results = {
      errors: [],
      warnings: [],
      info: []
    };
    
    // Gender and reproduction conflicts
    if (petData.gender === "male") {
      if (petData.pregnant !== "no") {
        results.errors.push("❌ حیوان نر نمی‌تواند حامله باشد");
      }
      if (petData.lactating === "yes") {
        results.errors.push("❌ حیوان نر نمی‌تواند شیردهی داشته باشد");
      }
    }
    
    if (petData.gender === "female" && petData.neutered === "yes") {
      if (petData.pregnant !== "no") {
        results.errors.push("❌ حیوان عقیم شده نمی‌تواند حامله باشد");
      }
    }
    
    // Age and age group conflicts
    const totalYears = petData.ageYears + (petData.ageMonths / 12);
    if (totalYears >= 7 && petData.ageGroup === "puppy/kitten") {
      results.errors.push(`❌ سن ${totalYears.toFixed(1)} سال با گروه "توله" مغایرت دارد`);
    }
    if (totalYears < 1 && petData.ageGroup === "senior") {
      results.errors.push(`❌ سن ${totalYears.toFixed(1)} سال با گروه "سالمند" مغایرت دارد`);
    }
    
    // BCS and age conflicts
    if (petData.bcs <= 3 && petData.ageGroup === "puppy/kitten") {
      results.warnings.push("⚠️ توله با BCS پایین نیاز به بررسی فوری دارد");
    }
    
    // Disease and medication conflicts
    const diseases = petData.diseases || [];
    const medications = petData.medications || [];
    
    const hasDiabetes = diseases.some(d => d.includes("دیابت"));
    const hasObesity = diseases.some(d => d.includes("چاقی"));
    const hasCKD = diseases.some(d => d.includes("کلیه"));
    const hasHeartDisease = diseases.some(d => d.includes("قلب"));
    const hasLiverDisease = diseases.some(d => d.includes("کبد"));
    
    if (hasDiabetes && hasObesity) {
      results.warnings.push("⚠️ چاقی عامل خطر اصلی دیابت است");
    }
    
    // Medication conflicts
    const hasSteroid = medications.some(m => 
      m.name && (m.name.includes("پردنیزولون") || m.name.includes("دگزامتازون") || 
                  m.name.includes("هیدروکورتیزون") || m.name.includes("بتامتازون"))
    );
    const hasNSAID = medications.some(m => 
      m.name && (m.name.includes("کارپروفن") || m.name.includes("ملوکسیکام") ||
                  m.name.includes("ایبوپروفن") || m.name.includes("دیکلوفناک"))
    );
    const hasInsulin = medications.some(m => m.name && m.name.includes("انسولین"));
    
    if (hasSteroid && hasDiabetes) {
      results.errors.push("❌ کورتون در حیوان دیابتی باعث افزایش قند خون می‌شود");
    }
    
    if (hasNSAID && hasCKD) {
      results.errors.push("❌ NSAIDs در بیماری کلیوی ممنوع است");
    }
    
    if (hasNSAID && hasLiverDisease) {
      results.warnings.push("⚠️ NSAIDs در بیماری کبدی با احتیاط مصرف شود");
    }
    
    if (hasNSAID && hasHeartDisease) {
      results.warnings.push("⚠️ NSAIDs در بیماری قلبی با احتیاط مصرف شود");
    }
    
    // Lab results conflicts
    const labResults = petData.labResults || {};
    const creaValue = labResults.crea;
    const bunValue = labResults.bun;
    const glucoseValue = labResults.glu;
    const altValue = labResults.alt;
    const astValue = labResults.ast;
    
    if (creaValue) {
      const numCrea = parseFloat(creaValue);
      const species = petData.species;
      const normalMax = species === "dog" ? 1.5 : 2.2;
      
      if (!isNaN(numCrea) && numCrea > normalMax && !hasCKD) {
        results.warnings.push(`⚠️ کراتینین بالا (${numCrea}) نشانه احتمالی بیماری کلیوی است`);
      }
    }
    
    if (glucoseValue) {
      const numGlucose = parseFloat(glucoseValue);
      if (!isNaN(numGlucose) && numGlucose > 150 && !hasDiabetes) {
        results.warnings.push(`⚠️ قند خون بالا (${numGlucose}) بررسی دیابت ضروری است`);
      }
    }
    
    if (altValue) {
      const numAlt = parseFloat(altValue);
      const species = petData.species;
      const normalMax = species === "dog" ? 100 : 100;
      
      if (!isNaN(numAlt) && numAlt > normalMax && !hasLiverDisease) {
        results.warnings.push(`⚠️ ALT بالا (${numAlt}) احتمال آسیب کبدی وجود دارد`);
      }
    }
    
    // Weight conflicts
    if (petData.weight && petData.weight < 0.5) {
      results.warnings.push("⚠️ وزن بسیار کم است - بررسی دقیق وزن توصیه می‌شود");
    }
    
    if (petData.weight && petData.weight > 100) {
      results.warnings.push("⚠️ وزن بسیار زیاد است - بررسی صحت وزن توصیه می‌شود");
    }
    
    // Toxic ingredients check
    const ingredients = petData.ingredients || [];
    const toxicItems = ingredients.filter(ing => 
      toxicFoods.some(toxic => ing.includes(toxic))
    );
    
    if (toxicItems.length > 0) {
      results.errors.push(`❌ مواد سمی شناسایی شد: ${toxicItems.join(", ")}`);
    }
    
    // Generate summary
    if (results.errors.length === 0 && results.warnings.length === 0) {
      results.info.push("✅ اطلاعات دامپزشکی صحیح است");
    }
    
    return results;
  },
  
  generateReport: function(results) {
    let report = "";
    
    if (results.errors.length > 0) {
      report += "❌ خطاهای بحرانی:\n";
      results.errors.forEach(err => report += `• ${err}\n`);
      report += "\n";
    }
    
    if (results.warnings.length > 0) {
      report += "⚠️ هشدارها:\n";
      results.warnings.forEach(warn => report += `• ${warn}\n`);
      report += "\n";
    }
    
    if (results.info.length > 0) {
      report += "ℹ️ اطلاعات:\n";
      results.info.forEach(info => report += `• ${info}\n`);
    }
    
    return report;
  }
};

// Nutrition System Integration
const nutritionSystem = {
  currentPet: null,
  initialized: false,
  selectedBCS: 5,
  selectedDiseases: [],
  selectedMedications: [],
  selectedIngredients: [],
  labResults: {},
  
  init: function() {
    this.loadPets();
    if (!this.initialized) {
      this.setupEventListeners();
      this.initialized = true;
    }
    this.loadMedications();
    this.loadLabTests();
    this.loadDiseases();
    this.loadIngredients();
  },
  
  loadPets: function() {
    const container = document.getElementById('nutritionPetSelector');
    if (!container) return;
    
    container.innerHTML = state.pets.map(pet => `
      <div class="pet-selector-item" data-pet="${pet.name}">
        <div class="pet-avatar">${pet.emoji}</div>
        <div class="pet-name">${pet.name}</div>
        <div class="pet-details">${pet.species} · ${pet.breed}</div>
      </div>
    `).join('');
    
    container.querySelectorAll('.pet-selector-item').forEach(item => {
      item.addEventListener('click', () => {
        container.querySelectorAll('.pet-selector-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        this.selectPet(item.dataset.pet);
      });
    });
  },
  
  selectPet: function(petName) {
    this.currentPet = state.pets.find(p => p.name === petName);
    if (!this.currentPet) return;
    
    document.getElementById('nutritionWorkspace').style.display = 'flex';
    if (session?.token) {
      loadRemoteData().finally(() => this.loadPetData());
    } else {
      this.loadPetData();
    }
  },
  
  loadPetData: function() {
    if (!this.currentPet) return;
    
    // Load clinical data
    const unifiedLabs = getUnifiedLabResultsForPet(this.currentPet.name, this.currentPet.id);
    const clinical = getPetClinicalRecord(this.currentPet.name);
    
    // Load diseases
    this.selectedDiseases = clinical.diseases || [];
    this.renderDiseases();
    
    // Load medications
    this.selectedMedications = clinical.medicines || [];
    this.renderMedications();
    
    // Load lab results
    this.labResults = {};
    unifiedLabs.forEach(lab => {
      const field = labFieldForResult(lab);
      if (field) this.labResults[field] = lab.result;
    });
    this.renderLabResults();

    const savedPlan = remoteModuleData.nutrition
      .filter(plan => plan.pet_id === this.currentPet.id || plan.pet_name === this.currentPet.name)
      .sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")))[0];
    if (savedPlan) {
      this.selectedBCS = Number(savedPlan.bcs) || 5;
      let plan = {};
      try { plan = typeof savedPlan.plan_json === "string" ? JSON.parse(savedPlan.plan_json) : (savedPlan.plan_json || {}); } catch { plan = {}; }
      const parseList = (value, fallback) => {
        try {
          const parsed = typeof value === "string" ? JSON.parse(value) : value;
          return Array.isArray(parsed) ? parsed : fallback;
        } catch { return fallback; }
      };
      this.selectedDiseases = parseList(savedPlan.diseases_json, plan.diseases || this.selectedDiseases);
      this.selectedIngredients = parseList(savedPlan.ingredients_json, plan.ingredients || []);
      document.querySelectorAll('input[name="bcs"]').forEach(radio => { radio.checked = Number(radio.value) === this.selectedBCS; });
    }
    // Re-render after loading a saved plan so species filtering also applies
    // to historical selections from older records.
    this.renderDiseases();
    this.renderLabResults();
    
    // Calculate initial BCS and calories
    this.calculateAll();
  },
  
  setupEventListeners: function() {
    // BCS selection
    document.querySelectorAll('input[name="bcs"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.selectedBCS = parseInt(e.target.value);
        this.calculateAll();
      });
    });
    
    // Generation mode
    document.querySelectorAll('input[name="genMode"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const apiKeySection = document.getElementById('apiKeySection');
        apiKeySection.style.display = e.target.value === 'manual' ? 'none' : 'block';
      });
    });
    
    // Check conflicts
    document.getElementById('checkConflictsBtn')?.addEventListener('click', () => {
      this.checkConflicts();
    });
    
    // Generate diet
    document.getElementById('generateDietBtn')?.addEventListener('click', () => {
      this.generateDiet();
    });
    
    // Clear result
    document.getElementById('clearResultBtn')?.addEventListener('click', () => {
      document.getElementById('dietResult').style.display = 'none';
      document.getElementById('dietResult').innerHTML = '';
    });
    
    // Test API
    document.getElementById('testApiBtn')?.addEventListener('click', () => {
      this.testAPI();
    });
    document.getElementById('nutritionNew')?.addEventListener('click', () => {
      const firstPet = state.pets[0];
      if (firstPet) {
        this.selectPet(firstPet.name);
        document.querySelector(`.pet-selector-item[data-pet="${CSS.escape(firstPet.name)}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
    document.getElementById('nutritionExport')?.addEventListener('click', () => this.exportPlan());
  },
  
  loadMedications: function() {
    const container = document.getElementById('medicationsContainer');
    if (!container) return;
    
    let html = '';
    for (const [category, data] of Object.entries(medicationCatalog)) {
      const categoryId = category.replace(/[^a-zA-Z0-9]/g, '_');
      html += `
        <div class="medication-category" id="med_cat_${categoryId}">
          <div class="medication-category-header" onclick="nutritionSystem.toggleMedicationCategory('${categoryId}')">
            <div class="medication-category-title">
              <span>💊</span>
              <span>${data.label}</span>
            </div>
            <span class="medication-category-toggle" id="toggle_med_${categoryId}">▶</span>
          </div>
          <div class="medication-category-content" id="content_med_${categoryId}">
            <div id="med_items_${categoryId}"></div>
          </div>
        </div>
      `;
      
      setTimeout(() => {
        const itemsContainer = document.getElementById(`med_items_${categoryId}`);
        if (itemsContainer) {
          data.items.forEach(med => {
            const isSelected = this.selectedMedications.some(m => m.includes(med[1]));
            itemsContainer.innerHTML += `
              <div class="medication-item ${isSelected ? 'selected' : ''}" data-med="${med[1]}">
                <div class="medication-name">${med[1]} <small>(${med[0]})</small></div>
                <div class="medication-dose"><input type="text" placeholder="دوز" class="med-dose" data-med="${med[1]}" value="${isSelected ? 'طبق نسخه' : ''}"></div>
                <div class="medication-freq">
                  <select class="med-freq" data-med="${med[1]}">
                    <option value="">دفع مصرف</option>
                    <option value="daily">روزانه یک بار</option>
                    <option value="bid">روزانه دو بار</option>
                    <option value="tid">روزانه سه بار</option>
                  </select>
                </div>
                <div class="medication-remove" onclick="nutritionSystem.removeMedication('${med[1]}')">×</div>
              </div>
            `;
          });
        }
      }, 100);
    }
    
    container.innerHTML = html;
  },
  
  toggleMedicationCategory: function(categoryId) {
    const content = document.getElementById(`content_med_${categoryId}`);
    const toggle = document.getElementById(`toggle_med_${categoryId}`);
    content.classList.toggle('show');
    toggle.classList.toggle('open');
  },
  
  removeMedication: function(medName) {
    this.selectedMedications = this.selectedMedications.filter(m => !m.includes(medName));
    this.renderMedications();
  },
  
  renderMedications: function() {
    this.loadMedications();
  },
  
  loadLabTests: function() {
    const container = document.getElementById('labResultsContainer');
    if (!container) return;
    const species = speciesKey(this.currentPet?.species);
    const speciesLabel = species === "cat" ? "گربه" : "سگ";
    const unifiedLabs = this.currentPet ? getUnifiedLabResultsForPet(this.currentPet.name, this.currentPet.id) : [];
    const resultCards = unifiedLabs.map(lab => `
      <article class="nutrition-lab-result-card ${lab.status}">
        <div class="nutrition-lab-result-card-head">
          <strong>${escapeHtml(lab.name)}</strong>
          <span class="status ${lab.status === "danger" ? "danger" : lab.status === "warning" ? "warning" : "success"}">${lab.status === "danger" ? "بحرانی" : lab.status === "warning" ? "نیازمند بررسی" : "طبیعی"}</span>
        </div>
        <div class="nutrition-lab-result-value">${escapeHtml(lab.result)} <small>${escapeHtml(lab.unit)}</small></div>
        <div class="nutrition-lab-result-meta">${escapeHtml(lab.reference || "بازه مرجع ثبت نشده")} ${lab.date ? `· ${escapeHtml(lab.date)}` : ""}</div>
        ${lab.interpretation ? `<p>${escapeHtml(lab.interpretation)}</p>` : ""}
      </article>
    `).join("");
    let html = `
      <section class="nutrition-lab-summary" aria-label="جواب‌های ثبت‌شده آزمایشگاه">
        <div class="nutrition-lab-summary-head">
          <div><strong>جواب‌های ثبت‌شده آزمایشگاه</strong><small>منبع مشترک جواب آزمایشگاه برای پرونده، آزمایشگاه و جیره‌نویسی</small></div>
          <span class="status blue-status">${speciesLabel}</span>
        </div>
        <div class="nutrition-lab-result-grid">${resultCards || '<div class="nutrition-lab-empty">برای این حیوان هنوز جواب آزمایش ثبت نشده است.</div>'}</div>
      </section>
    `;
    for (const [category, data] of Object.entries(labTestsCatalog)) {
      const categoryId = category.replace(/[^a-zA-Z0-9]/g, '_');
      html += `
        <div class="lab-category" id="lab_cat_${categoryId}">
          <div class="lab-category-header" onclick="nutritionSystem.toggleLabCategory('${categoryId}')">
            <div class="lab-category-title">
              <span>🔬</span>
              <span>${category}</span>
            </div>
            <span class="lab-category-toggle" id="toggle_lab_${categoryId}">▶</span>
          </div>
          <div class="lab-category-content" id="content_lab_${categoryId}">
            <div id="lab_items_${categoryId}"></div>
          </div>
        </div>
      `;
      
      setTimeout(() => {
        const itemsContainer = document.getElementById(`lab_items_${categoryId}`);
        if (itemsContainer) {
          data.tests.forEach(test => {
            const value = this.labResults[test.field] || '';
            const normal = test[`normal_${species}`] || "ثبت نشده";
            itemsContainer.innerHTML += `
              <div class="lab-test-item">
                <div class="lab-test-name">${test.name} <small>(${test.unit})</small></div>
                <div class="lab-test-value">
                  <input type="text" placeholder="مقدار" 
                    value="${value}" 
                    onchange="nutritionSystem.updateLabResult('${test.field}', this.value)"
                    data-field="${test.field}">
                </div>
                <div class="lab-test-unit">${test.unit}</div>
                <div class="lab-test-normal">
                  <span class="normal-species">حد نرمال ${speciesLabel}: ${normal}</span>
                </div>
              </div>
            `;
          });
        }
      }, 100);
    }
    
    container.innerHTML = html;
  },
  
  toggleLabCategory: function(categoryId) {
    const content = document.getElementById(`content_lab_${categoryId}`);
    const toggle = document.getElementById(`toggle_lab_${categoryId}`);
    content.classList.toggle('show');
    toggle.classList.toggle('open');
  },
  
  updateLabResult: function(field, value) {
    if (value && value.trim() !== '') {
      this.labResults[field] = value.trim();
    } else {
      delete this.labResults[field];
    }
  },
  
  renderLabResults: function() {
    this.loadLabTests();
  },
  
  loadDiseases: function() {
    const container = document.getElementById('diseasesGrid');
    if (!container) return;
    const species = speciesKey(this.currentPet?.species);
    const visibleDiseases = diseasesCatalog.filter(disease => (disease.species || ["dog", "cat"]).includes(species));
    this.selectedDiseases = this.selectedDiseases.filter(selected =>
      visibleDiseases.some(disease => disease.fa === selected)
    );
    
    container.innerHTML = visibleDiseases.map(disease => `
      <div class="disease-item ${this.selectedDiseases.includes(disease.fa) ? 'selected' : ''}" data-disease="${disease.fa}">
        <div class="disease-name">${disease.fa}</div>
        <div class="disease-en">${disease.en}</div>
      </div>
    `).join('');
    
    container.querySelectorAll('.disease-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('selected');
        const disease = item.dataset.disease;
        if (item.classList.contains('selected')) {
          if (!this.selectedDiseases.includes(disease)) {
            this.selectedDiseases.push(disease);
          }
        } else {
          this.selectedDiseases = this.selectedDiseases.filter(d => d !== disease);
        }
      });
    });
  },
  
  renderDiseases: function() {
    this.loadDiseases();
  },
  
  loadIngredients: function() {
    const container = document.getElementById('ingredientsContainer');
    if (!container) return;
    
    let html = '';
    for (const [category, items] of Object.entries(ingredientsCatalog)) {
      html += `
        <div class="ingredient-category">
          <div class="ingredient-category-header" onclick="nutritionSystem.toggleIngredientCategory(this)">
            <div class="ingredient-category-title">
              <span>🥗</span>
              <span>${category}</span>
            </div>
            <span class="ingredient-category-toggle">▶</span>
          </div>
          <div class="ingredient-category-content">
            ${items.map(item => `
              <div class="ingredient-item ${this.selectedIngredients.includes(item.fa) ? 'selected' : ''}" data-ingredient="${item.fa}">
                <div class="ingredient-name">${item.fa} <small>(${item.en})</small></div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    container.innerHTML = html;
    
    container.querySelectorAll('.ingredient-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('selected');
        const ingredient = item.dataset.ingredient;
        if (item.classList.contains('selected')) {
          if (!this.selectedIngredients.includes(ingredient)) {
            this.selectedIngredients.push(ingredient);
          }
        } else {
          this.selectedIngredients = this.selectedIngredients.filter(i => i !== ingredient);
        }
        this.updateIngredientCounter();
        this.checkToxicIngredients();
      });
    });
  },
  
  toggleIngredientCategory: function(header) {
    const content = header.nextElementSibling;
    const toggle = header.querySelector('.ingredient-category-toggle');
    content.classList.toggle('show');
    toggle.classList.toggle('open');
  },
  
  updateIngredientCounter: function() {
    const counter = document.getElementById('selectedIngredientsCount');
    if (counter) {
      counter.textContent = this.selectedIngredients.length;
    }
  },
  
  checkToxicIngredients: function() {
    const toxicWarning = document.getElementById('toxicWarning');
    const toxicList = document.getElementById('toxicList');
    
    const toxicItems = this.selectedIngredients.filter(ing => 
      toxicFoods.some(toxic => ing.includes(toxic))
    );
    
    if (toxicItems.length > 0) {
      toxicWarning.style.display = 'block';
      toxicList.innerHTML = toxicItems.map(item => `<span class="toxic-item">${item}</span>`).join('');
    } else {
      toxicWarning.style.display = 'none';
    }
  },
  
  calculateAll: function() {
    if (!this.currentPet) return;
    
    // Calculate BCS
    const bcsResult = bcsSystem.calculate(this.selectedBCS);
    document.getElementById('bcsScoreDisplay').textContent = this.selectedBCS;
    document.getElementById('bcsStatus').textContent = bcsResult.status;
    
    // Calculate water need
    const weight = normalizeWeight(this.currentPet.weight);
    const waterNeed = bcsSystem.calculateWaterNeed(weight);
    document.getElementById('waterNeedValue').textContent = waterNeed;
    
    // Calculate calories
    const calorieResult = bcsSystem.calculateCalories(
      weight,
      this.selectedBCS,
      this.currentPet.species,
      'adult', // Default age group
      'no', // Default neutered status
      'no', // Default pregnant status
      'no' // Default lactating status
    );
    
    document.getElementById('rerValue').textContent = calorieResult.rer;
    document.getElementById('merValue').textContent = calorieResult.mer;
  },
  
  checkConflicts: function() {
    if (!this.currentPet) return;
    
    const petData = {
      gender: this.currentPet.species === 'سگ' ? 'male' : 'female', // Default assumption
      ageYears: 5, // Default assumption
      ageMonths: 0,
      ageGroup: 'adult',
      weight: normalizeWeight(this.currentPet.weight),
      bcs: this.selectedBCS,
      neutered: 'no',
      pregnant: 'no',
      lactating: 'no',
      diseases: this.selectedDiseases,
      medications: this.selectedMedications,
      labResults: this.labResults,
      ingredients: this.selectedIngredients
    };
    
    const results = conflictDetectionSystem.check(petData);
    const conflictContainer = document.getElementById('conflictResults');
    
    let html = '';
    if (results.errors.length > 0) {
      html += results.errors.map(err => `
        <div class="conflict-card error-card">
          <strong>❌ خطا:</strong> ${err}
        </div>
      `).join('');
    }
    
    if (results.warnings.length > 0) {
      html += results.warnings.map(warn => `
        <div class="conflict-card warning-card">
          <strong>⚠️ هشدار:</strong> ${warn}
        </div>
      `).join('');
    }
    
    if (results.info.length > 0) {
      html += results.info.map(info => `
        <div class="conflict-card success-card">
          <strong>✅ اطلاعات:</strong> ${info}
        </div>
      `).join('');
    }
    
    conflictContainer.innerHTML = html;
    
    // Enable/disable generate button
    const generateBtn = document.getElementById('generateDietBtn');
    generateBtn.disabled = results.errors.length > 0;
  },
  
  generateDiet: async function() {
    if (!this.currentPet) return;
    
    const mode = document.querySelector('input[name="genMode"]:checked').value;
    const apiKey = document.getElementById('apiKeyInput')?.value || "";
    const resultContainer = document.getElementById('dietResult');
    
    resultContainer.style.display = 'block';
    resultContainer.innerHTML = '<div style="text-align:center;padding:30px;"><div class="spinner"></div><p>در حال تولید جیره...</p></div>';
    
    // Build prompt
    const prompt = this.buildPrompt();
    
    if (mode === 'manual') {
      resultContainer.innerHTML = `
        <div class="prompt-box">${prompt}</div>
        <div class="generate-buttons">
          <button class="button primary" onclick="navigator.clipboard.writeText(document.querySelector('.prompt-box').innerText);alert('کپی شد!')">📋 کپی پرامپت</button>
        </div>
      `;
      await this.persistPlan(prompt, "پیش‌نویس");
    } else {
      // API integration
      try {
        let apiUrl, model, systemPrompt;
        
        if (mode === 'deepseek') {
          apiUrl = 'https://api.deepseek.com/v1/chat/completions';
          model = 'deepseek-chat';
          systemPrompt = 'تو یک متخصص تغذیه دامپزشکی فوق‌تخصص هستی. جیره غذایی مناسب برای سگ و گربه را بر اساس اطلاعات داده شده ارائه بده.';
        } else if (mode === 'gapgpt') {
          apiUrl = 'https://api.gapgpt.app/v1/chat/completions';
          model = 'gpt-4o';
          systemPrompt = 'تو یک متخصص تغذیه دامپزشکی فوق‌تخصص هستی. جیره غذایی مناسب برای سگ و گربه را بر اساس اطلاعات داده شده به زبان فارسی روان ارائه بده.';
        }
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 3000
          })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || `خطای سرویس (${response.status})`);
        const aiResponse = data.choices?.[0]?.message?.content || 'پاسخی دریافت نشد';
        
        resultContainer.innerHTML = `<pre>${aiResponse}</pre>`;
        await this.persistPlan(aiResponse, "پیش‌نویس");
      } catch (error) {
        resultContainer.innerHTML = `
          <div class="conflict-card error-card">
            <strong>❌ خطا در ارتباط با API:</strong>
            <p>${error.message}</p>
            <p>لطفاً کلید API و اتصال اینترنت را بررسی کنید.</p>
          </div>
        `;
      }
    }
  },
  
  buildPrompt: function() {
    const bcsResult = bcsSystem.calculate(this.selectedBCS);
    const calorieResult = bcsSystem.calculateCalories(
      normalizeWeight(this.currentPet.weight),
      this.selectedBCS,
      this.currentPet.species,
      'adult',
      'no',
      'no',
      'no'
    );
    
    return `
【 جیره‌نویسی هوشمند پت‌کلینیک 】

📋 اطلاعات پت
نام: ${this.currentPet.name}
گونه: ${this.currentPet.species} | نژاد: ${this.currentPet.breed}
وزن: ${normalizeWeight(this.currentPet.weight)} kg | BCS: ${this.selectedBCS}/9 (${bcsResult.status})

💊 داروهای مصرفی:
${this.selectedMedications.length > 0 ? this.selectedMedications.join(' · ') : 'بدون دارو'}

🏥 بیماری‌ها و مشکلات:
${this.selectedDiseases.length > 0 ? this.selectedDiseases.join(' · ') : 'بدون بیماری ثبت‌شده'}

🔬 نتایج آزمایشات:
${Object.keys(this.labResults).length > 0 ? Object.entries(this.labResults).map(([k, v]) => `${k}: ${v}`).join('\n') : 'بدون نتیجه آزمایش'}

🥗 مواد در دسترس:
${this.selectedIngredients.length > 0 ? this.selectedIngredients.join(' · ') : 'هیچ ماده‌ای انتخاب نشده'}

📊 محاسبات انرژی:
RER: ${calorieResult.rer} kcal
MER: ${calorieResult.mer} kcal
نیاز آبی: ${bcsSystem.calculateWaterNeed(normalizeWeight(this.currentPet.weight))}

【 دستورالعمل برای هوش مصنوعی 】
تو یک متخصص تغذیه دامپزشکی فوق‌تخصص هستی. بر اساس اطلاعات داده شده:

1. ابتدا یک **تحلیل وضعیت** کامل بنویس که شامل:
   - بررسی هر بیماری و محدودیت‌های تغذیه‌ای مربوطه
   - تحلیل وضعیت وزنی و نیاز کالری
   - بررسی نتایج آزمایشات (اگر وجود دارد)
   - بررسی تداخلات دارویی با رژیم غذایی

2. سپس یک **جیره پیشنهادی روزانه** در قالب جدول زیر ارائه بده:
   | ماده غذایی | مقدار (گرم) در روز | نقش تغذیه‌ای | ملاحظات فنی |

3. بعد از جدول، **دستورالعمل‌های اجرایی** بنویس که شامل:
   - توزیع وعده‌ها (با ذکر ساعت‌های پیشنهادی)
   - نحوه فرآوری مواد غذایی
   - مدیریت بیماری‌های خاص
   - علائم هشدار برای پایش وضعیت پت

4. پاسخ باید **کاملاً حرفه‌ای، دقیق و به زبان فارسی روان** باشد.

【 شروع پاسخ 】
    `;
  },
  
  testAPI: async function() {
    const mode = document.querySelector('input[name="genMode"]:checked').value;
    const apiKey = document.getElementById('apiKeyInput')?.value || "";
    
    if (!apiKey) {
      alert('لطفاً کلید API را وارد کنید');
      return;
    }
    
    if (mode === "manual") return alert("در حالت دستی نیازی به تست API نیست.");
    try {
      let apiUrl;
      if (mode === 'deepseek') {
        apiUrl = 'https://api.deepseek.com/v1/models';
      } else if (mode === 'gapgpt') {
        apiUrl = 'https://api.gapgpt.app/v1/models';
      }
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      
      if (response.ok) {
        alert('✅ اتصال API برقرار است');
      } else {
        alert('❌ خطا در اتصال API. لطفاً کلید را بررسی کنید.');
      }
    } catch (error) {
      alert('❌ خطا در اتصال به اینترنت یا API');
    }
  },

  persistPlan: async function(generatedText, status = "پیش‌نویس") {
    if (!session?.token || !this.currentPet?.id) return;
    const weight = normalizeWeight(this.currentPet.weight);
    const calories = bcsSystem.calculateCalories(weight, this.selectedBCS, this.currentPet.species === "گربه" ? "cat" : "dog", "adult", "no", "no", "no");
    try {
      await apiRequest("/nutrition", {
        method: "POST",
        body: JSON.stringify({
          pet_id: this.currentPet.id,
          goal: this.selectedBCS < 5 ? "افزایش وزن" : this.selectedBCS > 5 ? "کاهش وزن" : "نگهداری",
          calories: calories.mer,
          rer: calories.rer,
          mer: calories.mer,
          water_ml: weight * 50,
          species: this.currentPet.species || "",
          weight,
          bcs: this.selectedBCS,
          diseases_json: this.selectedDiseases,
          medications_json: this.selectedMedications,
          ingredients_json: this.selectedIngredients,
          notes: status,
          plan_json: {
            generatedText,
            diseases: this.selectedDiseases,
            medications: this.selectedMedications,
            ingredients: this.selectedIngredients,
            bcs: this.selectedBCS
          },
          status
        })
      });
      await loadRemoteData();
      toast("جیره در پرونده پت ذخیره شد.");
    } catch (error) {
      toast(`ذخیره جیره انجام نشد: ${error.message}`);
    }
  },

  exportPlan: function() {
    if (!this.currentPet) return toast("ابتدا یک پت را انتخاب کنید.");
    const plan = getPetClinicalRecord(this.currentPet.name).nutrition;
    const text = plan?.plan?.generatedText || plan?.formula || "جیره‌ای ثبت نشده است.";
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nutrition-${this.currentPet.name}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }
};

function flattenLaboratoryCatalog() {
  return Object.entries(laboratoryCatalog).flatMap(([groupKey, group]) =>
    Object.entries(group.tests).map(([testKey, test]) => ({ groupKey, groupLabel: group.label, testKey, ...test }))
  );
}

function getLabTest(testKey) {
  return flattenLaboratoryCatalog().find(test => test.testKey === testKey);
}

function speciesKey(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "cat" || normalized.includes("گربه") ? "cat" : "dog";
}

function getPetSpeciesForLab(value) {
  const name = petNameFromValue(value);
  const pet = state.pets.find(item => item.name === name);
  if (speciesKey(pet?.species || value) === "cat") return "cat";
  if (pet?.species === "گربه") return "cat";
  return "dog";
}

function renderLaboratoryFields() {
  const fields = $("#actionFields");
  if (!fields) return;
  fields.innerHTML = `
    <label>حیوان
      <select name="pet" id="labPetSelect" required>
        ${state.pets.filter(pet => !isCustomerSession() || pet.owner === currentCustomer()?.name).map(pet => `<option value="${pet.name} · ${pet.owner}">${pet.name} · ${pet.owner}</option>`).join("")}
      </select>
    </label>
    <label>گونه
      <select name="species" id="labSpeciesSelect" required>
        <option value="dog">سگ</option><option value="cat">گربه</option>
      </select>
    </label>
    <label>گروه آزمایش
      <select name="group" id="labGroupSelect" required>
        ${Object.entries(laboratoryCatalog).map(([key, group]) => `<option value="${key}">${group.label}</option>`).join("")}
      </select>
    </label>
    <label>عنوان آزمایش
      <select name="testKey" id="labTestSelect" required></select>
    </label>
    <label>نتیجه عددی یا کیفی
      <input name="result" id="labResultInput" required placeholder="مثلاً ۸.۴ یا مثبت/منفی" />
    </label>
    <label>واحد
      <input name="unit" id="labUnitInput" readonly />
    </label>
    <div class="lab-reference-box" id="labReferenceBox"></div>
    <label class="action-wide">یادداشت آزمایش
      <textarea name="note" placeholder="روش، نمونه، تفسیر یا توضیحات آزمایشگاه"></textarea>
    </label>`;
  const petSelect = $("#labPetSelect");
  const petSpecies = getPetSpeciesForLab(petSelect?.value);
  $("#labSpeciesSelect").value = petSpecies;
  const refreshTests = () => {
    const group = laboratoryCatalog[$("#labGroupSelect").value];
    const species = $("#labSpeciesSelect").value;
    const tests = Object.entries(group.tests).filter(([, test]) => test[species]);
    $("#labTestSelect").innerHTML = tests.map(([key, test]) => `<option value="${key}">${test.label}</option>`).join("");
    updateLabMeta();
  };
  const refreshSpecies = () => {
    $("#labSpeciesSelect").value = getPetSpeciesForLab($("#labPetSelect").value);
    refreshTests();
  };
  $("#labGroupSelect").addEventListener("change", refreshTests);
  $("#labSpeciesSelect").addEventListener("change", refreshTests);
  $("#labPetSelect").addEventListener("change", refreshSpecies);
  $("#labResultInput").addEventListener("input", updateLabMeta);
  refreshTests();
}

function updateLabMeta() {
  const test = getLabTest($("#labTestSelect")?.value);
  const species = $("#labSpeciesSelect")?.value || "dog";
  const range = test?.[species];
  if (!test || !range) return;
  $("#labUnitInput").value = test.unit;
  $("#labReferenceBox").innerHTML = `<strong>محدوده نرمال ${species === "cat" ? "گربه" : "سگ"}</strong><span>${range[0]} تا ${range[1]} ${test.unit}</span><small>این بازه راهنمای عمومی است؛ بازه آزمایشگاه انجام‌دهنده برتری دارد.</small>`;
  const result = Number(String($("#labResultInput")?.value || "").replace(",", "."));
  const numeric = Number.isFinite(result) && String($("#labResultInput")?.value || "").trim() !== "";
  $("#labReferenceBox").classList.toggle("out-of-range", numeric && (result < range[0] || result > range[1]));
}

function renderImagingUploadFields() {
  const fields = $("#actionFields");
  if (!fields) return;
  fields.innerHTML = `
    <label>پت مربوط به تصویر
      <select name="pet" required>
        ${state.pets.filter(pet => !isCustomerSession() || pet.owner === currentCustomer()?.name).map(pet => `<option value="${pet.name} · ${pet.owner}">${pet.name} · ${pet.owner}</option>`).join("")}
      </select>
    </label>
    <label>نوع تصویربرداری
      <select name="type" required>
        <option>رادیولوژی</option><option>سونوگرافی</option><option>CT</option><option>MRI</option><option>گزارش تصویربرداری</option>
      </select>
    </label>
    <label>ناحیه بدن
      <input name="area" required placeholder="مثلاً شکم، قفسه سینه، اندام خلفی" />
    </label>
    <label class="action-wide file-picker-label">فایل تصویر یا گزارش
      <input name="file" id="imagingFileInput" type="file" accept="image/*,.pdf,.dcm,.dicom" required />
      <small>فرمت‌های مجاز: JPG، PNG، WEBP، PDF و DICOM</small>
      <span id="selectedImagingFile">هنوز فایلی انتخاب نشده است.</span>
    </label>
    <label class="action-wide">توضیحات یا گزارش اولیه
      <textarea name="report" placeholder="شرح یافته‌ها، گزارش رادیولوژیست یا توضیح تکمیلی"></textarea>
    </label>`;
  $("#imagingFileInput").addEventListener("change", event => {
    const file = event.target.files[0];
    $("#selectedImagingFile").textContent = file ? `${file.name} · ${Math.ceil(file.size / 1024)} KB` : "هنوز فایلی انتخاب نشده است.";
  });
}

function readFileAsDataUrl(file) {
  return new Promise(resolve => {
    if (!file || file.size > 1200000) return resolve("");
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

function openActionModal(action, contextPetName = "") {
  const definition = actionDefinitions[action];
  if (!definition) return toast("این عملیات هنوز پیکربندی نشده است.");
  if (action === "lab-request") actionDraftItems.labRequest = [];
  if (action === "medication") actionDraftItems.medication = [];
  if (action === "lab-answer") actionDraftItems.labAnswer = [];
  $("#actionIcon").textContent = definition.icon;
  $("#actionEyebrow").textContent = definition.eyebrow;
  $("#actionTitle").textContent = definition.title;
  $("#actionDescription").textContent = definition.description;
  $("#actionSubmit").textContent = definition.submit;
  if (action === "lab-answer") $("#actionForm").dataset.labPet = contextPetName || $("#examWorkspace")?.dataset.selectedPet || "";
  $("#actionFields").innerHTML = definition.fields.map(([name, label, type, options]) => {
    if (type === "select") return `<label>${label}<select name="${name}" required>${options.map(option => `<option>${option}</option>`).join("")}</select></label>`;
    if (type === "textarea") return `<label class="action-wide">${label}<textarea name="${name}" required></textarea></label>`;
    return `<label>${label}<input name="${name}" type="${type}" required /></label>`;
  }).join("");
  if (action === "lab") renderLaboratoryFields();
  if (action === "imaging" || action === "upload") renderImagingUploadFields();
  if (action === "record") renderRecordFields();
  if (action === "lab-request") renderLabRequestFields();
  if (action === "medication") renderMedicationCatalogFields();
  if (action === "lab-answer") renderLabAnswerFields();
  const selectedPetName = contextPetName || $("#examWorkspace")?.dataset.selectedPet || "";
  if (selectedPetName) {
    const petSelect = $('select[name="pet"]', $("#actionFields"));
    if (petSelect) {
      const option = [...petSelect.options].find(item => petNameFromValue(item.value || item.textContent) === selectedPetName);
      if (option) petSelect.value = option.value;
    }
  }
  $("#actionForm").dataset.action = action;
  const petField = $('select[name="pet"]', $("#actionFields"));
  if (petField && isCustomerSession()) {
    const owner = currentCustomer()?.name;
    [...petField.options].forEach(option => {
      option.hidden = !option.textContent.startsWith((state.pets.find(pet => pet.name === petNameFromValue(option.textContent) && pet.owner === owner)?.name || ""));
    });
  }
  openModal("#actionModal");
}

function fillBreedOptions(species = "سگ") {
  const select = $("#breedSelect");
  if (!select) return;
  select.innerHTML = breedsBySpecies[species].map((breed, index) => `<option value="${breed}" ${index === 0 ? "selected" : ""}>${breed}</option>`).join("");
}

function fillBirthDateOptions() {
  const day = $("#birthDay");
  const month = $("#birthMonth");
  const year = $("#birthYear");
  if (!day || !month || !year) return;
  day.innerHTML = Array.from({ length: 31 }, (_, index) => `<option value="${index + 1}">${String(index + 1).padStart(2, "۰")}</option>`).join("");
  month.innerHTML = jalaliMonths.map((name, index) => `<option value="${index + 1}">${name}</option>`).join("");
  year.innerHTML = Array.from({ length: 36 }, (_, index) => {
    const value = 1405 - index;
    return `<option value="${value}">${toPersianDigits(value)}</option>`;
  }).join("");
  day.value = "1";
  month.value = "1";
  year.value = "1402";
  updateAgePreview();
}

function fillNotePresets() {
  const select = $("#notePreset");
  if (!select) return;
  select.innerHTML += initialNotePresets.map((note, index) => `<option value="${index}">${index + 1}. ${note}</option>`).join("");
}

function toPersianDigits(value) {
  return String(value).replace(/\d/g, digit => "۰۱۲۳۴۵۶۷۸۹"[digit]);
}

function updateAgePreview() {
  const year = Number($("#birthYear")?.value);
  const month = Number($("#birthMonth")?.value);
  const day = Number($("#birthDay")?.value);
  const preview = $("#agePreview strong");
  if (!preview || !year || !month || !day) return;
  const today = { year: 1405, month: 5, day: 28 };
  let years = today.year - year;
  let months = today.month - month;
  let days = today.day - day;
  if (days < 0) { days += month <= 6 ? 31 : 30; months -= 1; }
  if (months < 0) { months += 12; years -= 1; }
  if (years < 0) { preview.textContent = "تاریخ نامعتبر"; return; }
  preview.textContent = `${toPersianDigits(years)} سال، ${toPersianDigits(months)} ماه، ${toPersianDigits(days)} روز`;
}

function updateBirthDayLimit() {
  const day = $("#birthDay");
  const month = Number($("#birthMonth")?.value);
  if (!day || !month) return;
  const maxDay = month <= 6 ? 31 : month <= 11 ? 30 : 29;
  [...day.options].forEach(option => { option.hidden = Number(option.value) > maxDay; });
  if (Number(day.value) > maxDay) day.value = String(maxDay);
  updateAgePreview();
}

function openModal(id) {
  const modal = $(id);
  if (!modal) return toast("فرم موردنظر پیدا نشد؛ صفحه را دوباره بارگذاری کنید.");
  modal.classList.add("open");
}
function closeModals() { $$(".modal-backdrop").forEach(modal => modal.classList.remove("open")); }
function openCustomerModal(customer = null) {
  editingCustomerId = customer?.id || null;
  const form = $("#customerForm");
  if (!form) return;
  $("h2", form).textContent = customer ? "ویرایش پروفایل مشتری" : "ثبت مشتری جدید";
  const name = $('input[name="name"]', form);
  const phone = $('input[name="phone"]', form);
  const email = $('input[name="email"]', form);
  if (name) name.value = customer?.name || "";
  if (phone) phone.value = customer?.phone || "";
  if (email) email.value = customer?.email === "ایمیل ثبت نشده" ? "" : (customer?.email || "");
  openModal("#customerModal");
}

function openPetModal(owner = "", pet = null) {
  editingPetName = pet?.name || null;
  const select = $("#ownerSelect");
  select.innerHTML = state.customers.map(c => `<option ${c.name === owner ? "selected" : ""}>${c.name}</option>`).join("");
  if ($("#speciesSelect")) $("#speciesSelect").value = pet?.species || "سگ";
  fillBreedOptions($("#speciesSelect")?.value || "سگ");
  if ($("#breedSelect") && pet?.breed) $("#breedSelect").value = pet.breed;
  fillBirthDateOptions();
  updateBirthDayLimit();
  const form = $("#petForm");
  if (form) $("h2", form).textContent = pet ? "ویرایش پرونده پت" : "معرفی پت";
  $('input[name="name"]', form).value = pet?.name || "";
  $('input[name="weight"]', form).value = pet ? String(pet.weight || "").replace(/[^\d.]/g, "") : "";
  $("#initialNote").value = pet?.note || "";
  $("#notePreset").value = "";
  openModal("#petModal");
}

function toast(message) {
  const element = $("#toast");
  $("p", element).textContent = message;
  element.classList.add("show");
  setTimeout(() => element.classList.remove("show"), 3200);
}

$("#addPetButton")?.addEventListener("click", () => openPetModal());
$("#addPetButtonAlt")?.addEventListener("click", () => openPetModal());
$("#quickCustomer")?.addEventListener("click", () => openCustomerModal());
$("#quickAppointment")?.addEventListener("click", () => { navigate("appointments"); openActionModal("appointment"); });
$("#quickLab")?.addEventListener("click", () => { navigate("laboratory"); openActionModal("lab"); });
$("#openProfile")?.addEventListener("click", () => openModal("#profileModal"));
$("#topbarLogoutButton")?.addEventListener("click", () => $("#logoutButton")?.click());
$("#uiModeToggle")?.addEventListener("click", toggleUiMode);
$("#fontScaleToggle")?.addEventListener("click", () => {
  const next = localStorage.getItem("petclinic-font-scale") === "large" ? "normal" : "large";
  localStorage.setItem("petclinic-font-scale", next);
  applyUserPreferences();
  toast(next === "large" ? "نوشته‌ها و دکمه‌ها درشت‌تر شدند." : "اندازه معمول نوشته‌ها فعال شد.");
});
$("#contrastToggle")?.addEventListener("click", () => {
  const next = localStorage.getItem("petclinic-high-contrast") === "on" ? "off" : "on";
  localStorage.setItem("petclinic-high-contrast", next);
  applyUserPreferences();
  toast(next === "on" ? "کنتراست بیشتر فعال شد." : "کنتراست معمول فعال شد.");
});
$$("[data-simple-action]").forEach(button => button.addEventListener("click", () => {
  const section = button.dataset.simpleAction;
  if (section === "customers") {
    navigate("customers");
    $("#customerSearch")?.focus();
  } else if (section === "records") {
    openActionModal("record");
  } else if (section === "laboratory") {
    openActionModal("lab");
  } else if (section === "nutrition") {
    openActionModal("nutrition");
  }
}));
$("#addCustomerButton")?.addEventListener("click", () => openCustomerModal());
$("#exportButton")?.addEventListener("click", () => toast("گزارش روزانه با موفقیت آماده شد."));

$$("[data-close-modal]").forEach(button => button.addEventListener("click", closeModals));
$$(".modal-backdrop").forEach(backdrop => backdrop.addEventListener("click", event => { if (event.target === backdrop) closeModals(); }));

$("#petForm")?.addEventListener("submit", async event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const species = data.get("species");
  const typeClass = species === "گربه" ? "cat" : species === "خرگوش" ? "rabbit" : "dog";
  const emoji = species === "گربه" ? "🐱" : species === "خرگوش" ? "🐰" : species === "پرنده" ? "🦜" : "🐶";
  const owner = data.get("owner");
  const birthDate = `${data.get("birthYear")}/${data.get("birthMonth")}/${data.get("birthDay")}`;
  const age = $("#agePreview strong")?.textContent || "محاسبه نشده";
  const pet = { name: data.get("name"), species, breed: data.get("breed") || "ثبت نشده", age, birthDate, weight: `${data.get("weight") || 0} کیلو`, note: data.get("note") || "", owner, status: "پرونده جدید", statusClass: "blue-status", emoji, typeClass };
  if (session?.token && !editingPetName) {
    const customer = state.customers.find(item => item.name === owner);
    if (!customer?.id) return toast("صاحب حیوان پیدا نشد.");
    try {
      await apiRequest("/pets", {
        method: "POST",
        body: JSON.stringify({
          owner_id: customer.id,
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          age: pet.age,
          weight: Number(data.get("weight")) || null,
          status: pet.status,
          note: pet.note
        })
      });
      await loadRemoteData();
      closeModals(); event.currentTarget.reset();
      renderPets($("#petSearch")?.value || "");
      renderCustomers($("#customerSearch")?.value || "");
      return toast(`پرونده ${pet.name} با موفقیت در دیتابیس ثبت شد.`);
    } catch (error) {
      return toast(error.message);
    }
  }
  if (editingPetName) {
    const existingPet = state.pets.find(item => item.name === editingPetName);
    const customer = state.customers.find(c => c.name === owner);
    if (!existingPet) return toast("پرونده پت پیدا نشد.");
    const oldOwner = existingPet.owner;
    Object.assign(existingPet, pet);
    const oldCustomer = state.customers.find(c => c.name === oldOwner);
    oldCustomer?.pets.splice(oldCustomer.pets.findIndex(item => item.name === editingPetName), 1);
    customer?.pets.push({ name: pet.name, species, breed: pet.breed, age: pet.age, birthDate, weight: pet.weight, note: pet.note });
    saveState(); closeModals(); event.currentTarget.reset(); editingPetName = null;
    renderPets($("#petSearch")?.value || "");
    renderCustomers($("#customerSearch")?.value || "");
    if (customer) selectCustomer(customer.id);
    return toast(`پرونده ${pet.name} ویرایش شد.`);
  }
  state.pets.unshift(pet);
  const customer = state.customers.find(c => c.name === owner);
  if (customer) customer.pets.push({ name: pet.name, species, breed: pet.breed, age: pet.age, birthDate, weight: pet.weight, note: pet.note });
  saveState(); closeModals(); event.currentTarget.reset(); toast(`پرونده ${pet.name} با موفقیت ثبت شد.`);
  if (state.activeSection === "pets") renderPets();
  if (state.activeSection === "customers" && customer) selectCustomer(customer.id);
});

$("#profileForm")?.addEventListener("submit", event => {
  event.preventDefault();
  localStorage.setItem("petclinic-ui-mode", $("#profileUiMode")?.value || getUiMode());
  localStorage.setItem("petclinic-font-scale", $("#profileLargeUi")?.checked ? "large" : "normal");
  localStorage.setItem("petclinic-high-contrast", $("#profileHighContrast")?.checked ? "on" : "off");
  applyUserPreferences();
  closeModals();
  toast("اطلاعات پروفایل و تنظیمات محیط ذخیره شد.");
});
$("#actionForm")?.addEventListener("submit", async event => {
  event.preventDefault();
  const action = event.currentTarget.dataset.action;
  const data = new FormData(event.currentTarget);
  const payload = Object.fromEntries(data.entries());
  const selectedPet = petNameFromValue(payload.pet);
  const createdAt = new Date().toISOString();
  const submittedMedicationItems = action === "medication"
    ? actionDraftItems.medication.filter(item => item && item.medicine && item.pet)
    : [];
  if (action === "medication" && !submittedMedicationItems.length) return toast("ابتدا حداقل یک دارو را به فهرست اضافه کنید.");
  if (action === "medication" && selectedPet && !submittedMedicationItems.some(item => petNameFromValue(item.pet) === selectedPet)) {
    return toast("داروی فهرست‌شده برای حیوان انتخاب‌شده نیست؛ حیوان فرم را با حیوان فهرست بررسی کنید.");
  }
  if (action === "lab-request" && !actionDraftItems.labRequest.length) return toast("حداقل یک آزمایش به فهرست اضافه کنید.");
  if (action === "medication" && !actionDraftItems.medication.length) return toast("حداقل یک دارو به فهرست اضافه کنید.");
  if (action === "lab-answer" && !actionDraftItems.labAnswer.length) return toast("حداقل یک شاخص به جواب آزمایش اضافه کنید.");
  if (session?.token && action === "lab-answer") {
    const requestId = event.currentTarget.dataset.labRequestId;
    if (!requestId || !/^\d+$/.test(requestId)) return toast("شناسه درخواست آزمایش معتبر نیست.");
    try {
      await apiRequest(`/lab-requests/${requestId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "completed",
          result_json: actionDraftItems.labAnswer,
          completed_at: new Date().toISOString()
        })
      });
      closeModals();
      event.currentTarget.reset();
      actionDraftItems.labAnswer = [];
      await loadRemoteData();
      renderLaboratoryResponseWorkspace(event.currentTarget.dataset.labPet || "");
      renderExamWorkspace();
      return toast("جواب آزمایش در پایگاه‌داده ثبت و درخواست تکمیل شد.");
    } catch (error) {
      return toast(error.message);
    }
  }
  if (session?.token && ["record", "lab", "lab-request", "appointment", "imaging", "imaging-request", "upload", "nutrition", "medication"].includes(action)) {
    const remotePet = state.pets.find(item => item.name === selectedPet);
    const remoteCustomer = state.customers.find(item => item.id === remotePet?.owner_id || item.name === remotePet?.owner);
    if (!remotePet?.id) return toast("حیوان انتخاب‌شده در دیتابیس پیدا نشد.");
    try {
      if (action === "record") {
        await apiRequest("/records", {
          method: "POST",
          body: JSON.stringify({
            pet_id: remotePet.id,
            visit_date: new Date().toISOString().slice(0, 10),
            diagnosis: payload.diagnosis || "",
            notes: payload.note || "",
            details_json: {
              complaint: payload.complaint || "",
              finding: payload.finding || "",
              diagnosis: payload.diagnosis || "",
              plan: payload.plan || "",
              note: payload.note || "",
              followup: payload.followup || ""
            },
            treatment: payload.followup ? `پیگیری: ${payload.followup}` : ""
          })
        });
      } else if (action === "lab-request") {
        const requests = actionDraftItems.labRequest.filter(item => petNameFromValue(item.pet) === selectedPet);
        if (!requests.length) return toast("حداقل یک آزمایش برای ثبت انتخاب کنید.");
        for (const item of requests) {
          await apiRequest("/lab-requests", {
            method: "POST",
            body: JSON.stringify({
              pet_id: remotePet.id,
              panel: item.panel || item.testKey || "آزمایش جدید",
              sample: item.sample || "",
              priority: item.priority || "normal",
              reason: item.reason || "",
              doctor: session.name || "",
              status: "requested"
            })
          });
        }
      } else if (action === "lab") {
        await apiRequest("/labs", {
          method: "POST",
          body: JSON.stringify({
            pet_id: remotePet.id,
            panel: payload.panel || payload.testKey || "آزمایش جدید",
            result_json: payload,
            status: "درخواست‌شده"
          })
        });
      } else if (action === "appointment") {
        await apiRequest("/appointments", {
          method: "POST",
          body: JSON.stringify({
            pet_id: remotePet.id,
            customer_id: remoteCustomer?.id || remotePet.owner_id || null,
            starts_at: `${payload.date || new Date().toISOString().slice(0, 10)}T${payload.time || "09:00"}`,
            service: payload.service || "معاینه عمومی",
            doctor: session.name || "",
            status: "در انتظار"
          })
        });
      } else if (action === "imaging" || action === "upload" || action === "imaging-request") {
        const file = data.get("file");
        const fileData = action === "imaging-request" ? "" : await readFileAsDataUrl(file);
        await apiRequest("/imaging", {
          method: "POST",
          body: JSON.stringify({
            pet_id: remotePet.id,
            study_type: payload.type || "تصویربرداری",
            body_area: payload.area || "ثبت نشده",
            report: payload.report || (action === "imaging-request" ? payload.reason || "" : ""),
            file_name: file?.name || null,
            file_type: file?.type || null,
            file_size: file?.size || 0,
            file_data: fileData,
            priority: payload.priority || "عادی",
            reason: payload.reason || "",
            status: action === "imaging-request" ? "درخواست‌شده" : "ثبت‌شده"
          })
        });
      } else if (action === "nutrition") {
        const weight = normalizeWeight(remotePet.weight);
        const rer = Math.round(70 * Math.pow(weight, 0.75));
        const bcs = 5;
        const mer = Math.round(rer * (payload.goal === "کاهش وزن" ? 1.0 : payload.goal === "افزایش وزن" ? 1.4 : 1.2));
        await apiRequest("/nutrition", {
          method: "POST",
          body: JSON.stringify({
            pet_id: remotePet.id,
            goal: payload.goal || "نگهداری",
            calories: mer,
            rer,
            mer,
            water_ml: Math.round(weight * 50),
            species: remotePet.species || "",
            weight,
            bcs,
            diseases_json: [],
            medications_json: getPetClinicalRecord(selectedPet).medicines || [],
            ingredients_json: [],
            notes: payload.limits || "",
            plan_json: {
              budget: payload.budget || "",
              limits: payload.limits || "",
              formula: payload.limits || "پس از بررسی دامپزشک تکمیل می‌شود."
            },
            status: "پیش‌نویس"
          })
        });
      } else if (action === "medication") {
        const items = submittedMedicationItems.filter(item => petNameFromValue(item.pet) === selectedPet);
        if (!items.length) return toast("حداقل یک دارو برای حیوان انتخاب‌شده ثبت کنید.");
        for (const item of items) {
          await apiRequest("/prescriptions", {
            method: "POST",
            body: JSON.stringify({
              pet_id: remotePet.id,
              medicine: item.medicine,
              medicine_key: item.medicineKey || "custom",
              category: item.category || "دارو",
              medicine_form: item.medicineForm || "",
              dose: item.dose || "",
              duration: item.duration || "",
              instructions: [item.dose, item.duration].filter(Boolean).join(" · "),
              quantity: item.quantity || "1",
              priority: item.priority || "عادی",
              dispensed: item.dispensed || "تحویل نشده",
              status: item.dispensed === "تحویل به مالک" || item.dispensed === "تحویل از داروخانه" ? "تحویل‌شده" : "در انتظار بررسی",
              note: item.note || ""
            })
          });
        }
      }
      closeModals();
      event.currentTarget.reset();
      await loadRemoteData();
      renderImagingWorkspace();
      if (state.activeSection === "pharmacy") renderProfessionalPharmacyWorkspace();
      if (state.activeSection === "nutrition") nutritionSystem.init();
      toast("اطلاعات با موفقیت در دیتابیس ثبت شد.");
      return;
    } catch (error) {
      return toast(error.message);
    }
  }
  if (action === "record" && selectedPet) {
    const existing = getPetClinicalRecord(selectedPet);
    updateClinicalRecord(selectedPet, {
      diagnosis: payload.diagnosis || existing.diagnosis,
      notes: [existing.notes, payload.note].filter(Boolean).join(" · "),
      visits: [...existing.visits, { date: new Intl.DateTimeFormat("fa-IR").format(new Date()), diagnosis: payload.diagnosis || "ثبت معاینه", complaint: payload.complaint || "", finding: payload.finding || "", plan: payload.plan || "", note: payload.note || "" }]
    });
  }
  if (action === "lab-request" && selectedPet) {
    const existing = getPetClinicalRecord(selectedPet);
    const newRequests = actionDraftItems.labRequest.filter(item => petNameFromValue(item.pet) === selectedPet).map(item => ({ ...item, id: `LAB-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 90 + 10)}`, status: "درخواست‌شده", doctor: session?.role === "vet" ? "دامپزشک ناظر" : "دکتر پارسا", createdAt: new Intl.DateTimeFormat("fa-IR").format(new Date()) }));
    updateClinicalRecord(selectedPet, { labRequests: [...existing.labRequests, ...newRequests] });
  }
  if (action === "lab" && selectedPet) {
    const existing = getPetClinicalRecord(selectedPet);
    const labTest = getLabTest(payload.testKey);
    const species = payload.species || "dog";
    const numericResult = Number(String(payload.result || "").replace(",", "."));
    const range = labTest?.[species];
    const inRange = range && Number.isFinite(numericResult) ? numericResult >= range[0] && numericResult <= range[1] : null;
    updateClinicalRecord(selectedPet, {
      labs: [...existing.labs, {
        date: new Intl.DateTimeFormat("fa-IR").format(new Date()),
        name: labTest?.label || payload.testKey || "آزمایش جدید",
        result: payload.result || "در انتظار نتیجه",
        status: inRange === true ? "success" : inRange === false ? "danger" : "warning",
        unit: payload.unit || labTest?.unit || "",
        reference: range ? `${range[0]} تا ${range[1]}` : "کیفی",
        note: payload.note || ""
      }]
    });
  }
  if (action === "lab-answer") {
    const answerPet = event.currentTarget.dataset.labPet;
    const answerIndex = Number(event.currentTarget.dataset.labIndex);
    const record = getPetClinicalRecord(answerPet);
    const request = record.labRequests[answerIndex];
    if (!request) return toast("درخواست آزمایش پیدا نشد.");
    const answers = actionDraftItems.labAnswer.map(item => ({
      date: new Intl.DateTimeFormat("fa-IR").format(new Date()),
      name: item.name,
      result: item.result,
      status: item.flag === "بحرانی" ? "danger" : item.flag === "طبیعی" || item.flag === "منفی" ? "success" : "warning",
      unit: item.unit || "",
      reference: item.reference || "بررسی توسط دامپزشک",
      note: item.interpretation || ""
    }));
    updateClinicalRecord(answerPet, {
      labRequests: record.labRequests.map((item, itemIndex) => itemIndex === answerIndex ? { ...item, result: answers.map(item => `${item.name}: ${item.result}`).join(" · "), unit: answers.map(item => item.unit).filter(Boolean).join(" · "), interpretation: answers.map(item => item.note).filter(Boolean).join(" · "), status: "انجام‌شده", completedAt: new Intl.DateTimeFormat("fa-IR").format(new Date()) } : item),
      labs: [...record.labs, ...answers]
    });
  }
  if (action === "imaging" && selectedPet) {
    const existing = getPetClinicalRecord(selectedPet);
    updateClinicalRecord(selectedPet, {
      imaging: [...existing.imaging, {
        type: payload.type || "تصویربرداری",
        result: payload.area ? `ناحیه: ${payload.area}` : "در انتظار گزارش",
        date: new Intl.DateTimeFormat("fa-IR").format(new Date())
      }]
    });
  }
  if (action === "imaging-request" && selectedPet) {
    const existing = getPetClinicalRecord(selectedPet);
    updateClinicalRecord(selectedPet, {
      imagingRequests: [...existing.imagingRequests, {
        type: payload.type || "تصویربرداری",
        area: payload.area || "",
        priority: payload.priority || "عادی",
        reason: payload.reason || "",
        status: "درخواست‌شده",
        createdAt: new Intl.DateTimeFormat("fa-IR").format(new Date())
      }]
    });
  }
  if (action === "upload" && selectedPet) {
    const existing = getPetClinicalRecord(selectedPet);
    const file = data.get("file");
    const fileName = file?.name || "فایل ثبت نشده";
    const fileData = await readFileAsDataUrl(file);
    updateClinicalRecord(selectedPet, {
      imaging: [...existing.imaging, {
        type: payload.type || "فایل تصویربرداری",
        result: payload.report || "فایل با موفقیت در پرونده ذخیره شد",
        date: new Intl.DateTimeFormat("fa-IR").format(new Date()),
        area: payload.area || "",
        fileName,
        fileType: file?.type || "",
        fileSize: file?.size || 0,
        fileData
      }]
    });
  }
  if (action === "nutrition" && selectedPet) {
    updateClinicalRecord(selectedPet, {
      nutrition: {
        title: `جیره ${payload.goal || "تخصصی"}`,
        formula: payload.limits || "فرمول جیره پس از بررسی وضعیت سلامت تنظیم می‌شود.",
        calories: "محاسبه پس از ثبت وزن و شرایط بدنی",
        review: "در انتظار تأیید دامپزشک"
      }
    });
  }
  if (action === "medication" && selectedPet) {
    const existing = getPetClinicalRecord(selectedPet);
    const selectedMedicationItems = submittedMedicationItems.filter(item => petNameFromValue(item.pet) === selectedPet);
    const medicines = selectedMedicationItems.map(item => [item.medicine, item.dose, item.duration, item.dispensed].filter(Boolean).join(" · "));
    updateClinicalRecord(selectedPet, {
      medicines: [...existing.medicines.filter(item => item !== "داروی جاری ثبت نشده"), ...medicines],
      notes: [existing.notes, ...selectedMedicationItems.map(item => item.note).filter(Boolean)].join(" · ")
    });
    const pet = allKnownPets().find(item => item.name === selectedPet);
    const prescriptionId = `RX-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 90 + 10)}`;
    const prescriptionItems = selectedMedicationItems.map((item, index) => ({
      id: `${prescriptionId}-${index + 1}`,
      prescriptionId,
      petName: selectedPet,
      owner: pet?.owner || petNameFromValue(item.pet),
      medicine: item.medicine,
      medicineKey: item.medicineKey || "custom",
      category: item.category || "دارو",
      medicineForm: item.medicineForm || "",
      dose: item.dose || "",
      duration: item.duration || "",
      instructions: [item.dose, item.duration].filter(Boolean).join(" · ") || "طبق نسخه دامپزشک",
      dispensed: item.dispensed || "تحویل نشده",
      note: item.note || "",
      priority: "عادی",
      createdAt: new Intl.DateTimeFormat("fa-IR").format(new Date()),
      status: "در انتظار بررسی"
    }));
    pharmacyStore.prescriptions = [...pharmacyStore.prescriptions, ...prescriptionItems];
    localStorage.setItem("petclinic-pharmacy", JSON.stringify(pharmacyStore));
  }
  if (action === "followup" && selectedPet) {
    const existing = getPetClinicalRecord(selectedPet);
    updateClinicalRecord(selectedPet, {
      followups: [...existing.followups, { date: payload.date || "", time: payload.time || "", reason: payload.reason || "مراجعه بعدی", note: payload.note || "" }]
    });
  }
  if (action === "appointment") {
    clinicAppointments.unshift({ ...payload, createdAt });
    localStorage.setItem("petclinic-appointments", JSON.stringify(clinicAppointments.slice(0, 100)));
  }
  const labels = {
    appointment: "نوبت جدید ثبت شد.",
    record: "ویزیت به پرونده پزشکی اضافه شد.",
    lab: "درخواست آزمایش ثبت شد.",
    "lab-answer": "جواب آزمایش ثبت شد و وضعیت آن به انجام‌شده تغییر کرد.",
    imaging: "مطالعه تصویربرداری ثبت شد.",
    upload: "فایل پزشکی با موفقیت ثبت شد.",
    nutrition: "پیش‌نویس جیره برای بررسی دامپزشک ساخته شد.",
    "lab-request": "درخواست آزمایش برای آزمایشگاه ارسال شد.",
    "imaging-request": "درخواست تصویربرداری ثبت شد.",
    medication: "نسخه ثبت شد و وضعیت تحویل دارو ذخیره گردید.",
    followup: "زمان مراجعه بعدی ثبت شد.",
    report: "گزارش آماده دریافت است.",
    "save-settings": "تنظیمات کلینیک ذخیره شد."
  };
  const audit = getStored("petclinic-audit", []);
  const auditPayload = action === "medication"
    ? { pet: selectedPet, items: submittedMedicationItems.map(item => ({ ...item })) }
    : payload;
  audit.unshift({ action, createdAt, payload: auditPayload });
  localStorage.setItem("petclinic-audit", JSON.stringify(audit.slice(0, 100)));
  closeModals();
  event.currentTarget.reset();
  if (action === "lab-request") actionDraftItems.labRequest = [];
  if (action === "medication") actionDraftItems.medication = [];
  if (action === "lab-answer") actionDraftItems.labAnswer = [];
  renderCustomerDashboard();
  renderCustomerPreview();
  renderExamWorkspace();
  if (state.activeSection === "pharmacy") renderProfessionalPharmacyWorkspace();
  if (state.activeSection === "pets") renderPets($("#petSearch")?.value || "");
  toast(labels[action] || "اطلاعات با موفقیت ثبت شد.");
});
async function submitCustomerForm(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = String(data.get("name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  if (!name || !phone) return toast("نام و شماره موبایل مشتری را وارد کنید.");
  if (state.customers.some(item => item.phone === phone && item.id !== editingCustomerId)) return toast("این شماره موبایل قبلاً ثبت شده است.");
  if (session?.token && !editingCustomerId) {
    try {
      await apiRequest("/customers", {
        method: "POST",
        body: JSON.stringify({ name, phone, email: data.get("email") || null })
      });
      await loadRemoteData();
      closeModals();
      event.currentTarget.reset();
      renderCustomers();
      return toast(`پروفایل ${name} در دیتابیس ساخته شد.`);
    } catch (error) {
      return toast(error.message);
    }
  }
  if (editingCustomerId) {
    const customer = state.customers.find(item => item.id === editingCustomerId);
    if (!customer) return toast("پروفایل مشتری پیدا نشد.");
    const oldName = customer.name;
    customer.name = name;
    customer.phone = phone;
    customer.email = data.get("email") || "ایمیل ثبت نشده";
    state.pets.forEach(pet => { if (pet.owner === oldName) pet.owner = name; });
    state.selectedCustomer = customer;
    saveState();
    closeModals();
    event.currentTarget.reset();
    editingCustomerId = null;
    renderCustomers($("#customerSearch")?.value || "");
    renderCustomerPreview();
    return toast(`پروفایل ${customer.name} ویرایش شد.`);
  }
  const customer = { id: Date.now(), name, phone, email: data.get("email") || "ایمیل ثبت نشده", pets: [], lastVisit: "هنوز مراجعه‌ای ثبت نشده", color: "teal" };
  state.customers.unshift(customer);
  saveState();
  closeModals();
  event.currentTarget.reset();
  state.selectedCustomer = customer;
  renderCustomers();
  renderCustomerPreview();
  toast(`پروفایل ${customer.name} ساخته شد.`);
}
$("#customerForm")?.addEventListener("submit", submitCustomerForm);
$("#customerSearch")?.addEventListener("input", event => renderCustomers(event.target.value));
$("#petSearch")?.addEventListener("input", event => renderPets(event.target.value));
$("#speciesSelect")?.addEventListener("change", event => fillBreedOptions(event.target.value));
$("#birthDay")?.addEventListener("change", updateAgePreview);
$("#birthMonth")?.addEventListener("change", () => { updateAgePreview(); updateBirthDayLimit(); });
$("#birthYear")?.addEventListener("change", updateAgePreview);
$("#notePreset")?.addEventListener("change", event => {
  if (event.target.value !== "") $("#initialNote").value = initialNotePresets[Number(event.target.value)];
});
$("#globalSearch")?.addEventListener("keydown", event => { if (event.key === "Enter" && event.target.value.trim()) { navigate("pets"); $("#petSearch").value = event.target.value; renderPets(event.target.value); } });
$("#themeToggle")?.addEventListener("click", () => { document.body.classList.toggle("dark"); localStorage.setItem("petclinic-theme", document.body.classList.contains("dark") ? "dark" : "light"); });
if (localStorage.getItem("petclinic-theme") === "dark") document.body.classList.add("dark");
$("#logoutButton")?.addEventListener("click", () => {
  session = null;
  localStorage.removeItem("petclinic-session");
  window.location.reload();
});
function closeDrawer() {
  $(".sidebar")?.classList.remove("open");
  $("#drawerOverlay")?.classList.remove("open");
}

$("#mobileMenuButton")?.addEventListener("click", () => {
  $(".sidebar")?.classList.toggle("open");
  $("#drawerOverlay")?.classList.toggle("open", $(".sidebar")?.classList.contains("open"));
});
$("#drawerClose")?.addEventListener("click", closeDrawer);
$("#drawerOverlay")?.addEventListener("click", closeDrawer);
$("#loginHomeButton")?.addEventListener("click", () => {
  session = null;
  localStorage.removeItem("petclinic-session");
  closeDrawer();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    $("#globalSearch")?.focus();
  }
  if (event.key === "Escape") closeModals();
});

document.addEventListener("click", event => {
  const actionButton = event.target.closest("#addCustomerButton, #addPetButton, #addPetButtonAlt");
  if (actionButton) {
    event.preventDefault();
    if (actionButton.id === "addCustomerButton") openModal("#customerModal");
    else openPetModal();
    return;
  }
  const petTrigger = event.target.closest(".pet-summary-trigger, .pet-card, .profile-pet");
  if (petTrigger && !event.target.closest("button")) {
    openPetSummary(petTrigger.dataset.petName || $("h3, strong", petTrigger)?.textContent?.trim());
    return;
  }
  const target = event.target.closest("button");
  if (!target || (target.type === "submit" && target.closest("form")) || target.dataset.closeModal !== undefined) return;
  if (target.matches(".draft-remove")) {
    const type = target.dataset.draftType;
    const index = Number(target.dataset.draftIndex);
    if (Array.isArray(actionDraftItems[type]) && Number.isInteger(index) && index >= 0 && index < actionDraftItems[type].length) {
      actionDraftItems[type].splice(index, 1);
      renderDraftLists();
      toast(type === "medication" ? "دارو از فهرست نسخه حذف شد." : "مورد انتخاب‌شده حذف شد.");
    }
    return;
  }
  if (target.dataset.action) {
    openActionModal(target.dataset.action);
    return;
  }
  if (target.matches(".notification")) return toast("۳ اعلان جدید برای بررسی دارید.");
  if (target.closest(".clinic-switcher")) return toast("کلینیک فعال: کلینیک دکتر پارسا · شعبه ونک");
  if (target.dataset.petEdit) {
    const pet = state.pets.find(item => item.name === target.dataset.petEdit) || currentCustomer()?.pets.find(item => item.name === target.dataset.petEdit);
    if (pet) openPetModal(pet.owner || currentCustomer()?.name || "", pet);
    return;
  }
  if (target.matches(".row-more")) return toast("منوی عملیات پرونده باز شد.");
  if (target.matches(".draft-remove")) {
    const type = target.dataset.draftType;
    const index = Number(target.dataset.draftIndex);
    if (Array.isArray(actionDraftItems[type]) && Number.isInteger(index) && index >= 0 && index < actionDraftItems[type].length) {
      actionDraftItems[type].splice(index, 1);
      renderDraftLists();
      toast(type === "medication" ? "دارو از فهرست نسخه حذف شد." : "مورد انتخاب‌شده حذف شد.");
    }
    return;
  }
  if (target.dataset.ping) return;
  if (target.dataset.customerEdit) {
    const customer = state.customers.find(item => item.id === Number(target.dataset.customerEdit));
    if (customer) openCustomerModal(customer);
    return;
  }
  if (target.dataset.examAction) {
    openActionModal(target.dataset.examAction, $("#examWorkspace")?.dataset.selectedPet || "");
    return;
  }
  if (target.matches(".draft-remove")) {
    const type = target.dataset.draftType;
    const index = Number(target.dataset.draftIndex);
    if (Array.isArray(actionDraftItems[type])) {
      actionDraftItems[type].splice(index, 1);
      renderDraftLists();
    }
    return;
  }
  if (target.dataset.appointmentPet) {
    openExamForPet(target.dataset.appointmentPet);
    return;
  }
  if (target.matches(".profile-actions .icon-button")) return toast(target.title === "ویرایش" ? "فرم ویرایش پروفایل آماده شد." : "گزینه‌های بیشتر پروفایل باز شد.");
  if (target.matches(".health-panel .icon-button")) return toast("فیلتر وضعیت سلامت باز شد.");
  if (target.matches(".filter-chip")) {
    const parent = target.parentElement;
    $$(".filter-chip", parent).forEach(item => item.classList.remove("active"));
    target.classList.add("active");
    return toast(`فیلتر «${target.textContent.trim()}» فعال شد.`);
  }
  if (target.matches(".filter-tabs button")) {
    $$(".filter-tabs button").forEach(item => item.classList.remove("active"));
    target.classList.add("active");
    const text = target.textContent;
    const species = text.includes("سگ") ? "سگ" : text.includes("گربه") ? "گربه" : "";
    const search = $("#petSearch")?.value || "";
    renderPets(`${species} ${search}`);
    return;
  }
  if (target.matches(".settings-menu button")) {
    $$(".settings-menu button").forEach(item => item.classList.remove("active"));
    target.classList.add("active");
    return toast(`بخش «${target.textContent.trim()}» انتخاب شد.`);
  }
  if (target.matches(".full-button")) return toast("پرونده کامل در حال بارگذاری است.");
  if (target.matches(".data-row .text-button")) return toast("جزئیات این مورد باز شد.");
});

function runBootTask(label, task) {
  try {
    task();
  } catch (error) {
    console.error(`[PetClinic] ${label}`, error);
    window.petClinicBootErrors = [...(window.petClinicBootErrors || []), { label, message: error?.message || String(error) }];
  }
}

runBootTask("مشتریان", () => renderCustomers());
runBootTask("پرونده حیوانات", () => renderPets());
runBootTask("یادداشت‌های آماده", () => fillNotePresets());
runBootTask("بخش‌های عملیاتی", () => renderOperationalSections());
runBootTask("تصویربرداری", () => renderImagingWorkspace());
runBootTask("کاتالوگ آزمایشگاه", () => renderLaboratoryCatalog());
runBootTask("ورود و دسترسی", () => initializeLogin());
