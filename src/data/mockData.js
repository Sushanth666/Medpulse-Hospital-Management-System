export const getDoctorAvatar = (name = 'User', customBg = null) => {
  const cleanName = (name || 'User').replace(/^Dr\.?\s*/i, '').trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  
  let initials = 'U';
  if (parts.length > 1) {
    initials = `${parts[0][0]}${parts[1][0]}`;
  } else if (parts.length === 1 && parts[0].length > 0) {
    initials = parts[0][0];
  }
  initials = initials.toUpperCase();

  const colorPalettes = [
    { bg1: '#ea580c', bg2: '#f97316', text: '#ffffff' }, // Orange
    { bg1: '#d97706', bg2: '#f59e0b', text: '#ffffff' }, // Amber
    { bg1: '#c2410c', bg2: '#ea580c', text: '#ffffff' }, // Deep Orange
    { bg1: '#e11d48', bg2: '#f43f5e', text: '#ffffff' }, // Rose
    { bg1: '#b45309', bg2: '#d97706', text: '#ffffff' }, // Warm Amber
    { bg1: '#9a3412', bg2: '#c2410c', text: '#ffffff' }  // Dark Orange
  ];
  
  const charCode = (cleanName.charCodeAt(0) || 65);
  const colorIndex = charCode % colorPalettes.length;
  const colors = customBg ? { bg1: `#${customBg}`, bg2: `#${customBg}`, text: '#ffffff' } : colorPalettes[colorIndex];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%">
    <defs>
      <linearGradient id="grad_${charCode}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${colors.bg1}"/>
        <stop offset="100%" stop-color="${colors.bg2}"/>
      </linearGradient>
    </defs>
    <rect width="128" height="128" rx="36" fill="url(#grad_${charCode})"/>
    <circle cx="64" cy="64" r="54" fill="#ffffff" opacity="0.12"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="${colors.text}" font-family="system-ui, -apple-system, sans-serif" font-size="${initials.length > 1 ? '48' : '56'}" font-weight="800" letter-spacing="1">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const getRandomAvatar = (gender = 'female', seed = 44) => {
  const g = (gender || '').toString().toLowerCase().trim();
  const isMale = g === 'male' || g === 'men' || g === 'm' || g === 'man';
  const genderPath = isMale ? 'men' : 'women';
  return `https://randomuser.me/api/portraits/${genderPath}/${seed}.jpg`;
};

export const detectGender = (name = '', email = '', explicitGender = null) => {
  if (explicitGender) {
    const g = String(explicitGender).toLowerCase().trim();
    if (g === 'male' || g === 'men' || g === 'm' || g === 'man') return 'male';
    if (g === 'female' || g === 'women' || g === 'w' || g === 'woman' || g === 'f') return 'female';
  }

  const lowerEmail = (email || '').toLowerCase().trim();
  const lowerName = (name || '').toLowerCase().trim();

  // 1. Match against INITIAL_DOCTORS if email or name matches
  const foundDoc = INITIAL_DOCTORS.find(d => 
    (d.email && d.email.toLowerCase() === lowerEmail) ||
    (d.name && d.name.toLowerCase() === lowerName)
  );

  if (foundDoc && foundDoc.avatar) {
    if (foundDoc.avatar.includes('/men/')) return 'male';
    if (foundDoc.avatar.includes('/women/')) return 'female';
  }

  // 2. Honorific / Title / Prefix / Suffix checks
  if (/\b(mr|mr\.|sir|lord|gentleman|boy|man|father|son|brother|he|his|him|male|guy|king|prince)\b/i.test(lowerName)) return 'male';
  if (/\b(mrs|mrs\.|ms|ms\.|miss|madam|lady|girl|woman|mother|daughter|sister|she|her|female|queen|princess)\b/i.test(lowerName)) return 'female';

  if (/\b(mr|male|boy|man|sir)\b/i.test(lowerEmail)) return 'male';
  if (/\b(mrs|ms|miss|female|girl|woman)\b/i.test(lowerEmail)) return 'female';

  // 3. Extensive First Names Dictionary
  const maleFirstNames = new Set([
    // Western / Global
    'marcus', 'james', 'jonathan', 'christopher', 'david', 'alexander', 'robert', 'daniel', 'benjamin', 'william',
    'john', 'michael', 'richard', 'joseph', 'thomas', 'charles', 'matthew', 'anthony', 'mark', 'donald', 'steven',
    'paul', 'andrew', 'joshua', 'kenneth', 'kevin', 'brian', 'george', 'edward', 'ronald', 'timothy', 'jason', 'jeffrey',
    'ryan', 'jacob', 'gary', 'nicholas', 'eric', 'stephen', 'larry', 'patrick', 'frank', 'raymond', 'jack', 'dennis',
    'jerry', 'tyler', 'aaron', 'jose', 'adam', 'nathan', 'henry', 'douglas', 'zachary', 'peter', 'kyle', 'walter',
    'ethan', 'jeremy', 'harold', 'keith', 'christian', 'roger', 'noah', 'gerald', 'carl', 'terry', 'sean', 'austin',
    'arthur', 'lawrence', 'jesse', 'dylan', 'bryan', 'joe', 'jordan', 'billy', 'bruce', 'albert', 'willie', 'gabriel',
    'logan', 'alan', 'juan', 'wayne', 'roy', 'ralph', 'randy', 'eugene', 'vincent', 'russell', 'louis', 'philip',
    'bobby', 'johnny', 'bradley', 'samuel', 'brandon', 'mason', 'lucas', 'oliver', 'sam', 'alex', 'steve', 'tom',
    'mike', 'dan', 'dave', 'chris', 'nick', 'matt', 'ben', 'will', 'rob', 'bob', 'jim', 'ken', 'greg', 'jeff',
    // Indian & South Asian
    'sushant', 'rahul', 'rohit', 'amit', 'priyesh', 'deepak', 'vikram', 'rajesh', 'raj', 'kumar', 'arjun', 'kiran',
    'dev', 'akash', 'nikhil', 'mohit', 'manish', 'karan', 'harsh', 'varun', 'gaurav', 'vikas', 'saurabh', 'sanjay',
    'vijay', 'ajay', 'anil', 'sunil', 'ramesh', 'suresh', 'mahesh', 'dinesh', 'prakash', 'ashok', 'alok', 'amrit',
    'anand', 'anuj', 'ankit', 'abhishek', 'aditya', 'aman', 'ayush', 'bhavya', 'chetan', 'darshan', 'harish', 'yash',
    'vivek', 'vishal', 'tarun', 'sumit', 'shivam', 'shubham', 'siddharth', 'sachin', 'ritesh', 'rishabh', 'pranav'
  ]);

  const femaleFirstNames = new Set([
    // Western / Global
    'sarah', 'emily', 'elena', 'anita', 'sophia', 'rachel', 'maya', 'olivia', 'grace', 'chloe', 'mary', 'patricia',
    'jennifer', 'linda', 'elizabeth', 'barbara', 'susan', 'jessica', 'karen', 'lisa', 'nancy', 'betty', 'margaret',
    'sandra', 'ashley', 'kimberly', 'emma', 'donna', 'michelle', 'carol', 'amanda', 'dorothy', 'melissa', 'deborah',
    'stephanie', 'rebecca', 'sharon', 'laura', 'cynthia', 'kathleen', 'amy', 'angela', 'shirley', 'anna', 'brenda',
    'pamela', 'nicole', 'samantha', 'katherine', 'christine', 'helen', 'debra', 'carolyn', 'janet', 'maria', 'heather',
    'diane', 'virginia', 'julie', 'joyce', 'victoria', 'kelly', 'christina', 'lauren', 'joan', 'evelyn', 'judith',
    'megan', 'cheryl', 'andrea', 'hannah', 'martha', 'jacqueline', 'frances', 'gloria', 'ann', 'teresa', 'kathryn',
    'sara', 'janice', 'jean', 'alice', 'madison', 'doris', 'abigail', 'julia', 'judy', 'denise', 'amber', 'marilyn',
    'beverly', 'danielle', 'theresa', 'diana', 'britney', 'mia', 'charlotte', 'amelia', 'harper', 'kate', 'jane',
    // Indian & South Asian
    'sushma', 'priya', 'pooja', 'neha', 'anjali', 'kavita', 'megha', 'shweta', 'ritu', 'simran', 'divya', 'isha',
    'sneha', 'taniya', 'tanvi', 'komal', 'radhika', 'sunita', 'rupa', 'anita', 'sunita', 'geeta', 'seema', 'rekha',
    'meena', 'rekha', 'pinky', 'monika', 'sonam', 'sonia', 'reena', 'archana', 'bhavna', 'swati', 'preeti', 'payal',
    'nisha', 'sakshi', 'khushi', 'tanya', 'kavya', 'diya', 'ria', 'riiya', 'aarti', 'shruti', 'shreya', 'drishti'
  ]);

  const cleanName = lowerName.replace(/^dr\.?\s*/i, '').replace(/^doctor\s*/i, '').trim();
  const nameParts = cleanName.split(/\s+/);
  const firstName = nameParts[0] || '';
  const emailPart = lowerEmail.split('@')[0] || '';

  if (maleFirstNames.has(firstName)) return 'male';
  if (femaleFirstNames.has(firstName)) return 'female';

  for (const mName of maleFirstNames) {
    if (emailPart.includes(mName)) return 'male';
  }
  for (const fName of femaleFirstNames) {
    if (emailPart.includes(fName)) return 'female';
  }

  // Name ending heuristic
  if (/(a|ia|i|ie|een|ette|ina|ya|i)$/i.test(firstName)) return 'female';
  if (/(o|us|or|on|an|ed|ic|v|k|r|d|t|l|n|m)$/i.test(firstName)) return 'male';

  return 'male';
};

export const INITIAL_DOCTORS = [
  {
    id: "DOC-101",
    name: "Dr. Sarah Jenkins",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    specialization: "Cardiology",
    experience: "14 Years",
    rating: 4.90,
    totalPatients: 1420,
    status: "On Duty",
    phone: "+1 (555) 111-2233",
    email: "sarah.jenkins@medpulse.org",
    workingHours: "08:00 AM - 04:00 PM",
    consultationFee: "$150"
  },
  {
    id: "DOC-102",
    name: "Dr. Marcus Thorne",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    specialization: "Neurology",
    experience: "11 Years",
    rating: 4.80,
    totalPatients: 980,
    status: "On Duty",
    phone: "+1 (555) 222-3344",
    email: "marcus.thorne@medpulse.org",
    workingHours: "09:00 AM - 05:00 PM",
    consultationFee: "$180"
  },
  {
    id: "DOC-103",
    name: "Dr. Emily Watson",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    specialization: "Pediatrics",
    experience: "9 Years",
    rating: 4.95,
    totalPatients: 1250,
    status: "On Call",
    phone: "+1 (555) 333-4455",
    email: "emily.watson@medpulse.org",
    workingHours: "10:00 AM - 06:00 PM",
    consultationFee: "$120"
  },
  {
    id: "DOC-104",
    name: "Dr. James Sterling",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    specialization: "Orthopedics",
    experience: "16 Years",
    rating: 4.85,
    totalPatients: 1680,
    status: "On Duty",
    phone: "+1 (555) 444-5566",
    email: "james.sterling@medpulse.org",
    workingHours: "08:30 AM - 04:30 PM",
    consultationFee: "$200"
  },
  {
    id: "DOC-105",
    name: "Dr. Elena Rostova",
    avatar: "https://randomuser.me/api/portraits/women/90.jpg",
    specialization: "General Medicine",
    experience: "8 Years",
    rating: 4.75,
    totalPatients: 840,
    status: "Off Duty",
    phone: "+1 (555) 555-6677",
    email: "elena.rostova@medpulse.org",
    workingHours: "12:00 PM - 08:00 PM",
    consultationFee: "$100"
  },
  {
    id: "DOC-106",
    name: "Dr. Jonathan Hayes",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    specialization: "Pulmonology",
    experience: "13 Years",
    rating: 4.92,
    totalPatients: 1150,
    status: "On Duty",
    phone: "+1 (555) 666-7788",
    email: "jonathan.hayes@medpulse.org",
    workingHours: "07:30 AM - 03:30 PM",
    consultationFee: "$165"
  },
  {
    id: "DOC-107",
    name: "Dr. Anita Patel",
    avatar: "https://randomuser.me/api/portraits/women/52.jpg",
    specialization: "Oncology",
    experience: "15 Years",
    rating: 4.98,
    totalPatients: 1390,
    status: "On Call",
    phone: "+1 (555) 777-8899",
    email: "anita.patel@medpulse.org",
    workingHours: "09:00 AM - 05:00 PM",
    consultationFee: "$220"
  },
  {
    id: "DOC-108",
    name: "Dr. Christopher Vance",
    avatar: "https://randomuser.me/api/portraits/men/82.jpg",
    specialization: "Gastroenterology",
    experience: "10 Years",
    rating: 4.88,
    totalPatients: 920,
    status: "On Duty",
    phone: "+1 (555) 888-9900",
    email: "christopher.vance@medpulse.org",
    workingHours: "08:00 AM - 04:00 PM",
    consultationFee: "$175"
  },
  {
    id: "DOC-109",
    name: "Dr. Sophia Ramirez",
    avatar: "https://randomuser.me/api/portraits/women/26.jpg",
    specialization: "Dermatology",
    experience: "7 Years",
    rating: 4.82,
    totalPatients: 760,
    status: "On Duty",
    phone: "+1 (555) 999-0011",
    email: "sophia.ramirez@medpulse.org",
    workingHours: "09:30 AM - 05:30 PM",
    consultationFee: "$130"
  },
  {
    id: "DOC-110",
    name: "Dr. David Kim",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    specialization: "Nephrology",
    experience: "12 Years",
    rating: 4.89,
    totalPatients: 1040,
    status: "On Duty",
    phone: "+1 (555) 123-9876",
    email: "david.kim@medpulse.org",
    workingHours: "08:00 AM - 04:00 PM",
    consultationFee: "$190"
  },
  {
    id: "DOC-111",
    name: "Dr. Rachel Adams",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    specialization: "Endocrinology",
    experience: "10 Years",
    rating: 4.91,
    totalPatients: 890,
    status: "On Call",
    phone: "+1 (555) 234-0987",
    email: "rachel.adams@medpulse.org",
    workingHours: "10:00 AM - 06:00 PM",
    consultationFee: "$160"
  },
  {
    id: "DOC-112",
    name: "Dr. Benjamin Carter",
    avatar: "https://randomuser.me/api/portraits/men/62.jpg",
    specialization: "Urology",
    experience: "14 Years",
    rating: 4.86,
    totalPatients: 1210,
    status: "On Duty",
    phone: "+1 (555) 345-1098",
    email: "benjamin.carter@medpulse.org",
    workingHours: "07:00 AM - 03:00 PM",
    consultationFee: "$170"
  },
  {
    id: "DOC-113",
    name: "Dr. Maria Santos",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    specialization: "Rheumatology",
    experience: "9 Years",
    rating: 4.93,
    totalPatients: 810,
    status: "On Duty",
    phone: "+1 (555) 456-2109",
    email: "maria.santos@medpulse.org",
    workingHours: "09:00 AM - 05:00 PM",
    consultationFee: "$145"
  },
  {
    id: "DOC-114",
    name: "Dr. Alexander Wright",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    specialization: "Ophthalmology",
    experience: "11 Years",
    rating: 4.87,
    totalPatients: 1100,
    status: "Off Duty",
    phone: "+1 (555) 567-3210",
    email: "alexander.wright@medpulse.org",
    workingHours: "08:30 AM - 04:30 PM",
    consultationFee: "$155"
  },
  {
    id: "DOC-115",
    name: "Dr. Grace O'Connor",
    avatar: "https://randomuser.me/api/portraits/women/79.jpg",
    specialization: "Otolaryngology (ENT)",
    experience: "8 Years",
    rating: 4.79,
    totalPatients: 730,
    status: "On Duty",
    phone: "+1 (555) 678-4321",
    email: "grace.oconnor@medpulse.org",
    workingHours: "09:00 AM - 05:00 PM",
    consultationFee: "$135"
  },
  {
    id: "DOC-116",
    name: "Dr. Harrison Ford",
    avatar: "https://randomuser.me/api/portraits/men/85.jpg",
    specialization: "Anesthesiology",
    experience: "17 Years",
    rating: 4.96,
    totalPatients: 1750,
    status: "On Call",
    phone: "+1 (555) 789-5432",
    email: "harrison.ford@medpulse.org",
    workingHours: "24/7 On-Call Rotation",
    consultationFee: "$210"
  },
  {
    id: "DOC-117",
    name: "Dr. Chloe Bennett",
    avatar: "https://randomuser.me/api/portraits/women/48.jpg",
    specialization: "Hematology",
    experience: "12 Years",
    rating: 4.94,
    totalPatients: 960,
    status: "On Duty",
    phone: "+1 (555) 890-6543",
    email: "chloe.bennett@medpulse.org",
    workingHours: "08:00 AM - 04:00 PM",
    consultationFee: "$185"
  },
  {
    id: "DOC-118",
    name: "Dr. Daniel Rivera",
    avatar: "https://randomuser.me/api/portraits/men/91.jpg",
    specialization: "Psychiatry",
    experience: "10 Years",
    rating: 4.84,
    totalPatients: 880,
    status: "On Duty",
    phone: "+1 (555) 901-7654",
    email: "daniel.rivera@medpulse.org",
    workingHours: "10:00 AM - 06:00 PM",
    consultationFee: "$150"
  },
  {
    id: "DOC-119",
    name: "Dr. Victoria Zhang",
    avatar: "https://randomuser.me/api/portraits/women/58.jpg",
    specialization: "Radiology",
    experience: "13 Years",
    rating: 4.90,
    totalPatients: 1320,
    status: "On Call",
    phone: "+1 (555) 012-8765",
    email: "victoria.zhang@medpulse.org",
    workingHours: "08:00 AM - 04:00 PM",
    consultationFee: "$175"
  },
  {
    id: "DOC-120",
    name: "Dr. Samuel Jackson",
    avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    specialization: "Emergency Medicine",
    experience: "15 Years",
    rating: 4.97,
    totalPatients: 1890,
    status: "On Duty",
    phone: "+1 (555) 123-0987",
    email: "samuel.jackson@medpulse.org",
    workingHours: "12:00 PM - 08:00 PM",
    consultationFee: "$195"
  }
];

// Generator for 200 realistic patient records
const generate200Patients = () => {
  const maleNames = ["Robert", "David", "William", "Arthur", "Lucas", "Ethan", "James", "Michael", "Alexander", "Daniel", "Matthew", "Joseph", "Henry", "Jackson", "Sebastian", "Jack", "Owen", "Gabriel", "Julian", "Carter", "Wyatt", "Jayden", "Dylan", "Grayson", "Levi"];
  const femaleNames = ["Eleanor", "Sophia", "Amara", "Clara", "Maya", "Naomi", "Olivia", "Emma", "Ava", "Charlotte", "Sophia", "Amelia", "Isabella", "Mia", "Evelyn", "Harper", "Camila", "Gianna", "Abigail", "Luna", "Ella", "Elizabeth", "Sofia", "Emily", "Avery"];
  const lastNames = ["Vance", "Chen", "Martinez", "Miller", "Johnson", "Wright", "Higgins", "Pendelton", "Lin", "Silva", "Campbell", "Hawke", "Smith", "Jones", "Taylor", "Brown", "Williams", "Davies", "Evans", "Thomas", "Roberts", "Wilson", "Lewis", "Walker", "Hall"];

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const departments = ["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "General Medicine", "Oncology", "Pulmonology", "Gastroenterology", "Dermatology", "Nephrology"];
  const triageLevels = ["Critical", "Serious", "Stable", "Under Observation"];
  const roomTypes = ["ICU", "GEN", "PED", "VIP", "EMG", "REC"];
  const conditions = [
    ["Hypertension", "CAD"],
    ["Type 2 Diabetes", "Migraine"],
    ["Asthma"],
    ["Osteoarthritis"],
    ["Seasonal Allergies"],
    ["High Cholesterol"],
    ["Stage II Breast Cancer"],
    ["COPD", "Chronic Bronchitis"],
    ["Crohn's Disease", "Anemia"],
    ["Psoriasis"],
    ["Cervical Spondylosis"],
    ["Angina Pectoris"]
  ];
  const meds = [
    ["Atorvastatin 20mg", "Lisinopril 10mg"],
    ["Metformin 500mg", "Sumatriptan 50mg"],
    ["Albuterol Inhaler"],
    ["Acetaminophen 500mg", "Celecoxib 100mg"],
    ["Cetirizine 10mg"],
    ["Rosuvastatin 10mg"],
    ["Levothyroxine 50mcg"],
    ["Tiotropium Bromide", "Prednisone 20mg"],
    ["Mesalamine 800mg"],
    ["Hydrocortisone Cream 1%"],
    ["Gabapentin 300mg"],
    ["Nitroglycerin 0.4mg"]
  ];

  const doctorNames = INITIAL_DOCTORS.map(d => d.name);
  const patients = [];

  for (let i = 1; i <= 200; i++) {
    const isMale = i % 2 === 0;
    const fn = isMale ? maleNames[(i - 1) % maleNames.length] : femaleNames[(i - 1) % femaleNames.length];
    const ln = lastNames[(i - 1) % lastNames.length];
    const name = `${fn} ${ln}`;
    const age = 18 + (i % 65);
    const bg = bloodGroups[(i - 1) % bloodGroups.length];
    const dept = departments[(i - 1) % departments.length];
    const doc = doctorNames[(i - 1) % doctorNames.length];
    const triage = triageLevels[(i - 1) % triageLevels.length];
    const rType = roomTypes[(i - 1) % roomTypes.length];
    const roomNo = rType === 'ICU' ? `ICU-0${(i % 10) + 1}` : rType === 'VIP' ? `VIP-30${(i % 5) + 1}` : `${rType}-${100 + (i % 30)}`;
    const isDischarged = i % 8 === 0;
    const status = isDischarged ? 'Discharged' : 'Admitted';
    const hr = `${65 + (i % 45)} bpm`;
    const bp = `${110 + (i % 35)}/${70 + (i % 25)}`;
    const temp = `${(98.1 + (i % 25) * 0.1).toFixed(1)} °F`;
    const spo2 = `${93 + (i % 7)}%`;
    const day = (1 + (i % 28));
    const dateStr = `2026-08-${day < 10 ? '0' + day : day}`;

    patients.push({
      id: `PAT-${1000 + i}`,
      name,
      age,
      gender: isMale ? 'Male' : 'Female',
      bloodGroup: bg,
      department: dept,
      roomNo: isDischarged ? 'Outpatient' : roomNo,
      admissionDate: dateStr,
      doctor: doc,
      triageStatus: triage,
      vitals: { hr, bp, temp, spo2 },
      contact: `+1 (555) ${100 + (i % 899)}-${1000 + (i % 8999)}`,
      status,
      medicalHistory: conditions[(i - 1) % conditions.length],
      activeMeds: meds[(i - 1) % meds.length]
    });
  }
  return patients;
};

export const INITIAL_PATIENTS = generate200Patients();

// Generator for 50 detailed appointment records
const generate50Appointments = () => {
  const appointmentTypes = [
    'Emergency Checkup', 'Follow-up Consultation', 'Routine Health Check', 'Post-Surgery Assessment',
    'Pulmonary Test', 'Chemotherapy Review', 'Endoscopy Consultation', 'Renal Function Evaluation',
    'Cardiology ECG Panel', 'Neurology MRI Review', 'Pediatric Vaccine Check', 'Orthopedic Joint Mobility Test',
    'Dermatology Skin Biopsy', 'Endocrine Thyroid Evaluation', 'Psychiatric Assessment', 'Ultrasound Imaging'
  ];

  const apts = [];
  for (let i = 1; i <= 50; i++) {
    const doc = INITIAL_DOCTORS[(i - 1) % INITIAL_DOCTORS.length];
    const pat = INITIAL_PATIENTS[(i - 1) % INITIAL_PATIENTS.length];
    const aptType = appointmentTypes[(i - 1) % appointmentTypes.length];
    const status = i <= 5 ? 'In-Progress' : i <= 30 ? 'Upcoming' : i <= 44 ? 'Completed' : 'Cancelled';
    const hour = (8 + (i % 9));
    const timeStr = `${hour < 10 ? '0' + hour : hour}:${(i % 2 === 0 ? '00' : '30')} ${hour >= 12 ? 'PM' : 'AM'}`;
    const day = (5 + (i % 8));
    const dateStr = `2026-08-${day < 10 ? '0' + day : day}`;

    apts.push({
      id: `APT-${800 + i}`,
      patientName: pat.name,
      patientId: pat.id,
      doctorName: doc.name,
      doctorId: doc.id,
      department: doc.specialization,
      date: dateStr,
      time: timeStr,
      status: status,
      type: aptType,
      notes: `${aptType} scheduled with ${doc.name} (${doc.specialization}). Patient history logged.`
    });
  }
  return apts;
};

export const INITIAL_APPOINTMENTS = generate50Appointments();

// 30 Total Beds (including exactly 10 ICU Beds)
export const INITIAL_BEDS = [
  // --- 10 ICU BEDS ---
  { id: "BED-ICU-01", bedNumber: "ICU-01", ward: "Intensive Care Unit", type: "Ventilator ICU Bed", status: "Occupied", patientName: "Eleanor Vance", patientId: "PAT-1001", assignedDate: "2026-08-01", pricePerDay: 500 },
  { id: "BED-ICU-02", bedNumber: "ICU-02", ward: "Intensive Care Unit", type: "Ventilator ICU Bed", status: "Occupied", patientName: "Arthur Pendelton", patientId: "PAT-1008", assignedDate: "2026-08-02", pricePerDay: 500 },
  { id: "BED-ICU-03", bedNumber: "ICU-03", ward: "Intensive Care Unit", type: "Cardiac ICU Bed", status: "Occupied", patientName: "Marcus Brody", patientId: "PAT-1015", assignedDate: "2026-07-30", pricePerDay: 480 },
  { id: "BED-ICU-04", bedNumber: "ICU-04", ward: "Intensive Care Unit", type: "Standard ICU Bed", status: "Available", patientName: null, patientId: null, assignedDate: null, pricePerDay: 450 },
  { id: "BED-ICU-05", bedNumber: "ICU-05", ward: "Intensive Care Unit", type: "Standard ICU Bed", status: "Occupied", patientName: "William Wright", patientId: "PAT-1006", assignedDate: "2026-08-05", pricePerDay: 450 },
  { id: "BED-ICU-06", bedNumber: "ICU-06", ward: "Intensive Care Unit", type: "Neuro ICU Bed", status: "Available", patientName: null, patientId: null, assignedDate: null, pricePerDay: 480 },
  { id: "BED-ICU-07", bedNumber: "ICU-07", ward: "Intensive Care Unit", type: "Pediatric ICU Bed", status: "Occupied", patientName: "Sophia Martinez", patientId: "PAT-1003", assignedDate: "2026-08-04", pricePerDay: 460 },
  { id: "BED-ICU-08", bedNumber: "ICU-08", ward: "Intensive Care Unit", type: "Trauma ICU Bed", status: "Maintenance", patientName: null, patientId: null, assignedDate: null, pricePerDay: 500 },
  { id: "BED-ICU-09", bedNumber: "ICU-09", ward: "Intensive Care Unit", type: "Isolation ICU Bed", status: "Occupied", patientName: "Ethan Hawke", patientId: "PAT-1012", assignedDate: "2026-08-05", pricePerDay: 520 },
  { id: "BED-ICU-10", bedNumber: "ICU-10", ward: "Intensive Care Unit", type: "Burn Care ICU Bed", status: "Available", patientName: null, patientId: null, assignedDate: null, pricePerDay: 550 },

  // --- 5 EMERGENCY WARD BEDS ---
  { id: "BED-EMG-01", bedNumber: "EMG-01", ward: "Emergency Ward", type: "Triage Emergency Bed", status: "Occupied", patientName: "Lucas Silva", patientId: "PAT-1010", assignedDate: "2026-08-05", pricePerDay: 280 },
  { id: "BED-EMG-02", bedNumber: "EMG-02", ward: "Emergency Ward", type: "Triage Emergency Bed", status: "Available", patientName: null, patientId: null, assignedDate: null, pricePerDay: 280 },
  { id: "BED-EMG-03", bedNumber: "EMG-03", ward: "Emergency Ward", type: "Resuscitation Bed", status: "Available", patientName: null, patientId: null, assignedDate: null, pricePerDay: 320 },
  { id: "BED-EMG-04", bedNumber: "EMG-04", ward: "Emergency Ward", type: "Triage Emergency Bed", status: "Occupied", patientName: "Amara Johnson", patientId: "PAT-1005", assignedDate: "2026-08-05", pricePerDay: 280 },
  { id: "BED-EMG-05", bedNumber: "EMG-05", ward: "Emergency Ward", type: "Triage Emergency Bed", status: "Available", patientName: null, patientId: null, assignedDate: null, pricePerDay: 280 },

  // --- 10 GENERAL WARD BEDS ---
  { id: "BED-GEN-201", bedNumber: "GEN-201", ward: "General Ward", type: "Semi-Private Bed", status: "Available", patientName: null, patientId: null, assignedDate: null, pricePerDay: 180 },
  { id: "BED-GEN-202", bedNumber: "GEN-202", ward: "General Ward", type: "Semi-Private Bed", status: "Occupied", patientName: "Robert Chen", patientId: "PAT-1002", assignedDate: "2026-08-03", pricePerDay: 180 },
  { id: "BED-GEN-203", bedNumber: "GEN-203", ward: "General Ward", type: "Semi-Private Bed", status: "Available", patientName: null, patientId: null, assignedDate: null, pricePerDay: 180 },
  { id: "BED-GEN-204", bedNumber: "GEN-204", ward: "General Ward", type: "Semi-Private Bed", status: "Occupied", patientName: "Maya Lin", patientId: "PAT-1009", assignedDate: "2026-08-04", pricePerDay: 180 },
  { id: "BED-GEN-205", bedNumber: "GEN-205", ward: "General Ward", type: "Standard Ward Bed", status: "Available", patientName: null, patientId: null, assignedDate: null, pricePerDay: 150 },
  { id: "BED-GEN-206", bedNumber: "GEN-206", ward: "General Ward", type: "Standard Ward Bed", status: "Available", patientName: null, patientId: null, assignedDate: null, pricePerDay: 150 },
  { id: "BED-GEN-207", bedNumber: "GEN-207", ward: "General Ward", type: "Semi-Private Bed", status: "Occupied", patientName: "Clara Higgins", patientId: "PAT-1007", assignedDate: "2026-07-31", pricePerDay: 180 },
  { id: "BED-GEN-208", bedNumber: "GEN-208", ward: "General Ward", type: "Semi-Private Bed", status: "Available", patientName: null, patientId: null, assignedDate: null, pricePerDay: 180 },
  { id: "BED-GEN-209", bedNumber: "GEN-209", ward: "General Ward", type: "Standard Ward Bed", status: "Maintenance", patientName: null, patientId: null, assignedDate: null, pricePerDay: 150 },
  { id: "BED-GEN-210", bedNumber: "GEN-210", ward: "General Ward", type: "Standard Ward Bed", status: "Available", patientName: null, patientId: null, assignedDate: null, pricePerDay: 150 },

  // --- 5 VIP DELUXE SUITE BEDS ---
  { id: "BED-VIP-301", bedNumber: "VIP-301", ward: "VIP Deluxe Suite", type: "Deluxe Electric Suite Bed", status: "Occupied", patientName: "David Miller", patientId: "PAT-1004", assignedDate: "2026-07-28", pricePerDay: 650 },
  { id: "BED-VIP-302", bedNumber: "VIP-302", ward: "VIP Deluxe Suite", type: "Deluxe Electric Suite Bed", status: "Occupied", patientName: "Naomi Campbell", patientId: "PAT-1011", assignedDate: "2026-08-03", pricePerDay: 650 },
  { id: "BED-VIP-303", bedNumber: "VIP-303", ward: "VIP Deluxe Suite", type: "Deluxe Electric Suite Bed", status: "Available", patientName: null, patientId: null, assignedDate: null, pricePerDay: 650 },
  { id: "BED-VIP-304", bedNumber: "VIP-304", ward: "VIP Deluxe Suite", type: "Executive Suite Bed", status: "Available", patientName: null, patientId: null, assignedDate: null, pricePerDay: 700 },
  { id: "BED-VIP-305", bedNumber: "VIP-305", ward: "VIP Deluxe Suite", type: "Executive Suite Bed", status: "Available", patientName: null, patientId: null, assignedDate: null, pricePerDay: 700 }
];

// Generator for 500 detailed medicine records across 18 pharmaceutical categories
const generate500Medicines = () => {
  const medPrefixes = [
    "Amoxicillin", "Ceftriaxone", "Azithromycin", "Ciprofloxacin", "Doxycycline",
    "Lisinopril", "Atorvastatin", "Amlodipine", "Metoprolol", "Losartan",
    "Clopidogrel", "Paracetamol", "Ibuprofen", "Tramadol", "Morphine Sulfate",
    "Ketorolac", "Albuterol", "Fluticasone", "Montelukast", "Ipratropium",
    "Metformin", "Insulin Glargine", "Sitagliptin", "Glipizide", "Gabapentin",
    "Sertraline", "Alprazolam", "Escitalopram", "Quetiapine", "Levothyroxine",
    "Methimazole", "Prednisone", "Dexamethasone", "Omeprazole", "Pantoprazole",
    "Ondansetron", "Tamoxifen", "Cisplatin", "Hydrocortisone", "Clindamycin",
    "Furosemide", "Tamsulosin", "Warfarin", "Enoxaparin", "Apixaban",
    "Influenza Vaccine", "Tetanus Toxoid", "Vitamin D3", "Calcium Carbonate", "Iron Fumarate"
  ];

  const categories = [
    "Antibiotics", "Cardiac", "Analgesics", "Respiratory", "Diabetic",
    "Neurology", "Psychiatry", "Endocrine", "Steroids", "Gastroenterology",
    "Oncology", "Dermatology", "Nephrology", "Urology", "Anticoagulants",
    "Vaccines", "Vitamins", "Ophthalmology"
  ];

  const manufacturers = [
    "Pfizer Bio", "Novartis", "Sanofi", "GlaxoSmithKline", "AstraZeneca",
    "Merck Health", "Roche Pharma", "Teva Pharma", "Abbott Bio", "Bayer Healthcare",
    "Johnson & Johnson", "McNeil Consumer", "Grünenthal", "Fresenius Kabi", "Galderma",
    "Astellas", "Bristol Myers", "Sanofi Pasteur", "Nature Made", "Sun Pharma"
  ];

  const dosageForms = [
    "Tablets", "Capsules", "Injectable Vials", "Syrup 100ml", "Inhaler",
    "Topical Cream", "Eye Drops 5ml", "Nasal Spray", "Oral Suspension", "Transdermal Patch"
  ];

  const meds = [];
  for (let i = 1; i <= 500; i++) {
    const prefix = medPrefixes[(i - 1) % medPrefixes.length];
    const cat = categories[(i - 1) % categories.length];
    const mfr = manufacturers[(i - 1) % manufacturers.length];
    const form = dosageForms[(i - 1) % dosageForms.length];
    const strength = `${5 * ((i % 40) + 1)}mg`;
    const name = `${prefix} ${strength} (${form})`;
    const isLow = (i % 11 === 0);
    const stock = isLow ? (3 + (i % 15)) : (40 + (i * 7) % 450);
    const minThreshold = 25;
    const price = Number((4.50 + (i * 1.65) % 195).toFixed(2));
    const year = 2026 + (i % 3);
    const month = (1 + (i % 12));
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const expiryDate = `${year}-${monthStr}-15`;
    const sku = `SKU-${cat.substring(0, 3).toUpperCase()}-${1000 + i}`;

    meds.push({
      id: `MED-${500 + i}`,
      name,
      category: cat,
      stock,
      unit: form.includes('Tablets') ? 'Tablets' : form.includes('Capsules') ? 'Capsules' : form.includes('Vials') ? 'Vials' : 'Units',
      minThreshold,
      price,
      expiryDate,
      manufacturer: mfr,
      sku
    });
  }
  return meds;
};

export const INITIAL_PHARMACY = generate500Medicines();

// Generator for 1000 detailed billing invoice records
const generate1000Invoices = () => {
  const patientList = INITIAL_PATIENTS;
  const billingItems = [
    { description: "ICU Ventilator Suite Charge (3 Days)", qty: 3, rate: 500 },
    { description: "Cardiology Specialist Consultation", qty: 2, rate: 150 },
    { description: "ECG & Cardiac Lab Panel", qty: 1, rate: 450 },
    { description: "Medications & IV Infusions", qty: 1, rate: 280 },
    { description: "Brain MRI Scan & Neurology Diagnostic", qty: 1, rate: 850 },
    { description: "Orthopedic Surgery & Rehabilitation", qty: 1, rate: 4200 },
    { description: "Pediatric Observation & Vitals Check", qty: 2, rate: 120 },
    { description: "Pulmonary Spirometry Test", qty: 1, rate: 320 },
    { description: "Oncology Targeted Chemotherapy Session", qty: 1, rate: 2400 },
    { description: "General Outpatient Checkup & Consultation", qty: 1, rate: 100 }
  ];

  const invoices = [];
  for (let i = 1; i <= 1000; i++) {
    const pat = patientList[(i - 1) % patientList.length];
    const status = (i % 3 === 0) ? 'Paid' : (i % 5 === 0) ? 'Overdue' : 'Pending';
    const item1 = billingItems[(i - 1) % billingItems.length];
    const item2 = billingItems[(i * 3) % billingItems.length];
    const items = [
      { description: item1.description, qty: item1.qty, rate: item1.rate, amount: item1.qty * item1.rate },
      { description: item2.description, qty: item2.qty, rate: item2.rate, amount: item2.qty * item2.rate }
    ];
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = Number((subtotal * 0.05).toFixed(2));
    const discount = (i % 4 === 0) ? 50 : 0;
    const total = Math.max(0, subtotal + tax - discount);
    const day = (1 + (i % 28));
    const dateStr = `2026-08-${day < 10 ? '0' + day : day}`;
    const dueDay = Math.min(28, day + 14);
    const dueDateStr = `2026-08-${dueDay < 10 ? '0' + dueDay : dueDay}`;

    invoices.push({
      id: `INV-${9000 + i}`,
      invoiceNo: `INV-2026-${1000 + i}`,
      patientName: pat.name,
      patientId: pat.id,
      issueDate: dateStr,
      dueDate: dueDateStr,
      items,
      subtotal,
      tax,
      discount,
      total,
      status
    });
  }
  return invoices;
};

export const INITIAL_INVOICES = generate1000Invoices();

export const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-01",
    title: "Critical Patient Alert",
    description: "Eleanor Vance (ICU-04) Heart Rate spiked to 105 bpm.",
    timestamp: "10 mins ago",
    type: "critical",
    category: "Emergency",
    read: false
  },
  {
    id: "NOTIF-02",
    title: "Low Inventory Warning",
    description: "Lisinopril 10mg stock is below minimum threshold (12 units left).",
    timestamp: "45 mins ago",
    type: "warning",
    category: "Pharmacy",
    read: false
  },
  {
    id: "NOTIF-03",
    title: "Appointment Reminder",
    description: "Dr. Marcus Thorne has a scheduled consultation with Robert Chen at 11:15 AM.",
    timestamp: "1 hour ago",
    type: "info",
    category: "Appointments",
    read: true
  },
  {
    id: "NOTIF-04",
    title: "Invoice Payment Received",
    description: "Invoice #INV-2026-1002 ($13,045.00) paid in full by David Miller.",
    timestamp: "3 hours ago",
    type: "success",
    category: "Billing",
    read: true
  },
  {
    id: "NOTIF-05",
    title: "ICU Admission Notice",
    description: "Arthur Pendelton admitted to ICU-02 under Dr. Jonathan Hayes.",
    timestamp: "4 hours ago",
    type: "critical",
    category: "Emergency",
    read: false
  },
  {
    id: "NOTIF-06",
    title: "Low Inventory Warning",
    description: "Albuterol Inhaler stock level is critical (8 inhalers left).",
    timestamp: "5 hours ago",
    type: "warning",
    category: "Pharmacy",
    read: false
  },
  {
    id: "NOTIF-07",
    title: "Surgery Completed",
    description: "Dr. James Sterling completed Knee Joint mobility surgery on David Miller.",
    timestamp: "6 hours ago",
    type: "success",
    category: "Surgeries",
    read: true
  },
  {
    id: "NOTIF-08",
    title: "VIP Suite Reserved",
    description: "Room VIP-305 assigned to incoming private patient Victoria Sterling.",
    timestamp: "8 hours ago",
    type: "info",
    category: "Bed Management",
    read: false
  },
  {
    id: "NOTIF-09",
    title: "Lab Results Ready",
    description: "Comprehensive Blood & Cardiac Panel completed for patient PAT-1015.",
    timestamp: "10 hours ago",
    type: "success",
    category: "Laboratory",
    read: false
  },
  {
    id: "NOTIF-10",
    title: "Overdue Billing Notice",
    description: "Invoice #INV-2026-1003 ($1,081.50) marked as OVERDUE for Robert Chen.",
    timestamp: "12 hours ago",
    type: "warning",
    category: "Billing",
    read: false
  }
];

export const CHART_DATA_PATIENT_TRENDS = [
  { month: "Jan", Emergency: 120, Inpatient: 210, Outpatient: 340 },
  { month: "Feb", Emergency: 140, Inpatient: 230, Outpatient: 390 },
  { month: "Mar", Emergency: 110, Inpatient: 240, Outpatient: 410 },
  { month: "Apr", Emergency: 165, Inpatient: 290, Outpatient: 480 },
  { month: "May", Emergency: 190, Inpatient: 310, Outpatient: 520 },
  { month: "Jun", Emergency: 175, Inpatient: 330, Outpatient: 590 },
  { month: "Jul", Emergency: 210, Inpatient: 360, Outpatient: 640 }
];

export const CHART_DATA_REVENUE = [
  { month: "Feb", Revenue: 145000, Expenses: 92000, NetProfit: 53000 },
  { month: "Mar", Revenue: 162000, Expenses: 98000, NetProfit: 64000 },
  { month: "Apr", Revenue: 178000, Expenses: 104000, NetProfit: 74000 },
  { month: "May", Revenue: 195000, Expenses: 112000, NetProfit: 83000 },
  { month: "Jun", Revenue: 210000, Expenses: 118000, NetProfit: 92000 },
  { month: "Jul", Revenue: 240000, Expenses: 125000, NetProfit: 115000 }
];

export const CHART_DATA_BED_OCCUPANCY = [
  { name: "Occupied", value: 13, color: "#e11d48" },
  { name: "Available", value: 15, color: "#10b981" },
  { name: "Maintenance", value: 2, color: "#f59e0b" },
  { name: "Reserved", value: 0, color: "#8b5cf6" }
];

export const CHART_DATA_DEPARTMENTS = [
  { name: "Cardiology", admissions: 142, revenue: 68000 },
  { name: "Orthopedics", admissions: 118, revenue: 84000 },
  { name: "Neurology", admissions: 95, revenue: 52000 },
  { name: "Pediatrics", admissions: 160, revenue: 41000 },
  { name: "General Medicine", admissions: 220, revenue: 38000 },
  { name: "Oncology", admissions: 84, revenue: 95000 },
  { name: "Pulmonology", admissions: 105, revenue: 61000 }
];
