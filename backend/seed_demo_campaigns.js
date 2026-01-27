const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Campaign = require("./models/Campaign");
const User = require("./models/User");

dotenv.config();

const demoCampaigns = [
  // MEDICAL Category
  {
    category: "Medical",
    country: "Bangladesh",
    zipCode: "1205",
    title: "Help Baby Ayesha Get Heart Surgery",
    description: "Little Ayesha was born with a congenital heart defect. Her family, simple farmers from rural Bangladesh, cannot afford the life-saving surgery she desperately needs. The surgery costs $25,000 and must be done within the next 3 months. Every dollar brings her closer to a healthy life. Please help this precious child get a second chance at life.",
    targetAmount: 25000,
    currentAmount: 12500,
    beneficiaryType: "someone-else",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
    isVerified: true,
    status: "active",
    milestones: [
      { title: "Hospital Deposit", amount: 5000, status: "approved" },
      { title: "Surgery Cost", amount: 15000, status: "locked" },
      { title: "Recovery Care", amount: 5000, status: "locked" },
    ],
  },
  {
    category: "Medical",
    country: "Bangladesh",
    zipCode: "1216",
    title: "Cancer Treatment for Rahim Uncle",
    description: "Rahim, a 58-year-old school teacher, has been diagnosed with stage 3 lung cancer. After 30 years of teaching thousands of students, he now needs our help. The chemotherapy treatment will cost $18,000 over 6 months. His former students have started this campaign to save their beloved teacher.",
    targetAmount: 18000,
    currentAmount: 7200,
    beneficiaryType: "someone-else",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800",
    isVerified: true,
    status: "active",
    milestones: [
      { title: "Initial Diagnosis", amount: 3000, status: "approved" },
      { title: "Chemotherapy Cycle 1-3", amount: 8000, status: "locked" },
      { title: "Chemotherapy Cycle 4-6", amount: 7000, status: "locked" },
    ],
  },

  // EMERGENCY Category
  {
    category: "Emergency",
    country: "Bangladesh",
    zipCode: "1340",
    title: "Flood Relief for Cox's Bazar Village",
    description: "Devastating floods have destroyed over 200 homes in our village near Cox's Bazar. Families have lost everything - their homes, livestock, and belongings. We urgently need funds for emergency shelter, food, clean water, and medical supplies for 500+ affected residents. Please help us rebuild our community.",
    targetAmount: 30000,
    currentAmount: 21000,
    beneficiaryType: "charity",
    image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800",
    isVerified: true,
    status: "active",
    milestones: [
      { title: "Emergency Supplies", amount: 10000, status: "approved" },
      { title: "Temporary Shelters", amount: 12000, status: "approved" },
      { title: "Food & Medicine", amount: 8000, status: "locked" },
    ],
  },
  {
    category: "Emergency",
    country: "Bangladesh",
    zipCode: "1100",
    title: "Fire Victims Need Immediate Help",
    description: "A devastating fire swept through a garment worker housing complex in Dhaka, leaving 50 families homeless overnight. These hardworking families have lost all their possessions. We are raising funds for temporary housing, clothing, food, and help them get back on their feet.",
    targetAmount: 15000,
    currentAmount: 8500,
    beneficiaryType: "charity",
    image: "https://images.unsplash.com/photo-1486862997929-caadb495de4d?w=800",
    isVerified: true,
    status: "active",
    milestones: [
      { title: "Immediate Relief", amount: 5000, status: "approved" },
      { title: "Temporary Housing", amount: 6000, status: "locked" },
      { title: "Rehabilitation Support", amount: 4000, status: "locked" },
    ],
  },

  // EDUCATION Category
  {
    category: "Education",
    country: "Bangladesh",
    zipCode: "1230",
    title: "Build a School in Rural Sylhet",
    description: "Children in Gowainghat, Sylhet walk 8 kilometers daily to reach the nearest school. We want to build a primary school right in their village so 300+ children can access quality education. The school will have 6 classrooms, a library, and computer lab. Education changes lives - help us change theirs.",
    targetAmount: 50000,
    currentAmount: 28000,
    beneficiaryType: "charity",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
    isVerified: true,
    status: "active",
    milestones: [
      { title: "Land & Foundation", amount: 15000, status: "approved" },
      { title: "Building Construction", amount: 25000, status: "locked" },
      { title: "Equipment & Supplies", amount: 10000, status: "locked" },
    ],
  },
  {
    category: "Education",
    country: "Bangladesh",
    zipCode: "1207",
    title: "Scholarship Fund for Orphan Students",
    description: "The Dhaka Orphanage has 45 bright students who dream of higher education but cannot afford it. We are creating a scholarship fund to send these children to college. Each scholarship of $2,000 covers tuition, books, and living expenses for one year. Help us break the cycle of poverty through education.",
    targetAmount: 20000,
    currentAmount: 11000,
    beneficiaryType: "charity",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    isVerified: true,
    status: "active",
    milestones: [
      { title: "First 5 Scholarships", amount: 10000, status: "approved" },
      { title: "Next 5 Scholarships", amount: 10000, status: "locked" },
    ],
  },

  // NONPROFIT Category
  {
    category: "Nonprofit",
    country: "Bangladesh",
    zipCode: "1000",
    title: "Clean Water Initiative - 10 Villages",
    description: "WaterAid Bangladesh is installing deep tube wells and water purification systems in 10 remote villages where families currently drink contaminated water. Waterborne diseases are the leading cause of child mortality in these areas. Your donation will provide clean, safe drinking water to over 5,000 people.",
    targetAmount: 40000,
    currentAmount: 32000,
    beneficiaryType: "charity",
    image: "https://images.unsplash.com/photo-1541544741670-3f9f3984e95f?w=800",
    isVerified: true,
    status: "active",
    milestones: [
      { title: "First 5 Villages", amount: 20000, status: "approved" },
      { title: "Next 3 Villages", amount: 12000, status: "approved" },
      { title: "Final 2 Villages", amount: 8000, status: "locked" },
    ],
  },
  {
    category: "Nonprofit",
    country: "Bangladesh",
    zipCode: "1215",
    title: "Women's Vocational Training Center",
    description: "Empowering Women Bangladesh is establishing a vocational training center to teach sewing, handicrafts, and computer skills to 200 underprivileged women annually. This center will help women become financially independent and support their families. Each trained woman can earn $150-300 monthly.",
    targetAmount: 35000,
    currentAmount: 14000,
    beneficiaryType: "charity",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800",
    isVerified: true,
    status: "active",
    milestones: [
      { title: "Rent & Setup", amount: 10000, status: "approved" },
      { title: "Training Equipment", amount: 15000, status: "locked" },
      { title: "First Year Operations", amount: 10000, status: "locked" },
    ],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Find or create a demo user
    let demoUser = await User.findOne({ email: "demo@trustfund.com" });
    
    if (!demoUser) {
      demoUser = await User.create({
        name: "TrustFund Demo",
        email: "demo@trustfund.com",
        password: "$2b$10$demopasswordhashnotreal123456789",
        isVerified: true,
      });
      console.log("👤 Created demo user");
    }

    // Check if demo campaigns already exist
    const existingCount = await Campaign.countDocuments({ 
      title: { $in: demoCampaigns.map(c => c.title) } 
    });

    if (existingCount > 0) {
      console.log(`⚠️ Found ${existingCount} existing demo campaigns. Deleting them first...`);
      await Campaign.deleteMany({ 
        title: { $in: demoCampaigns.map(c => c.title) } 
      });
    }

    // Create all demo campaigns
    const campaignsToCreate = demoCampaigns.map(campaign => ({
      ...campaign,
      owner: demoUser._id,
    }));

    await Campaign.insertMany(campaignsToCreate);

    console.log("\n🎉 Demo campaigns created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 Category Summary:");
    console.log("   ✓ Medical: 2 campaigns");
    console.log("   ✓ Emergency: 2 campaigns");
    console.log("   ✓ Education: 2 campaigns");
    console.log("   ✓ Nonprofit: 2 campaigns");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n👉 Go to Dashboard and use the Donate dropdown to filter by category!");
    
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

seed();
