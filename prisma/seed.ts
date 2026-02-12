import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "sarah@techflow.com" },
      update: {},
      create: {
        name: "Sarah Jenkins",
        email: "sarah@techflow.com",
        emailVerified: new Date(),
        linkedinUrl: "https://linkedin.com/in/sarahjenkins",
        websiteUrl: "https://sarahjenkins.design",
      },
    }),
    prisma.user.upsert({
      where: { email: "david@stripe.com" },
      update: {},
      create: {
        name: "David Chen",
        email: "david@stripe.com",
        emailVerified: new Date(),
        linkedinUrl: "https://linkedin.com/in/davidchen",
      },
    }),
    prisma.user.upsert({
      where: { email: "sarah.miller@airbnb.com" },
      update: {},
      create: {
        name: "Sarah Miller",
        email: "sarah.miller@airbnb.com",
        emailVerified: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: "marcus@novastartups.com" },
      update: {},
      create: {
        name: "Marcus Johnson",
        email: "marcus@novastartups.com",
        emailVerified: new Date(),
        linkedinUrl: "https://linkedin.com/in/marcusjohnson",
      },
    }),
    prisma.user.upsert({
      where: { email: "elena@google.com" },
      update: {},
      create: {
        name: "Elena Rodriguez",
        email: "elena@google.com",
        emailVerified: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: "james@microsoft.com" },
      update: {},
      create: {
        name: "James Park",
        email: "james@microsoft.com",
        emailVerified: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: "priya@shopify.com" },
      update: {},
      create: {
        name: "Priya Sharma",
        email: "priya@shopify.com",
        emailVerified: new Date(),
        linkedinUrl: "https://linkedin.com/in/priyasharma",
      },
    }),
    prisma.user.upsert({
      where: { email: "alex@sequoia.com" },
      update: {},
      create: {
        name: "Alex Thompson",
        email: "alex@sequoia.com",
        emailVerified: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: "mia@figma.com" },
      update: {},
      create: {
        name: "Mia Zhang",
        email: "mia@figma.com",
        emailVerified: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: "omar@tesla.com" },
      update: {},
      create: {
        name: "Omar Hassan",
        email: "omar@tesla.com",
        emailVerified: new Date(),
      },
    }),
  ]);

  const [sarah, david, sarahM, marcus, elena, james, priya, alex, mia, omar] =
    users;

  // Create event
  const event = await prisma.event.upsert({
    where: { slug: "techconnect-2025" },
    update: {},
    create: {
      name: "TechConnect 2025",
      slug: "techconnect-2025",
      description:
        "The premier networking event for tech professionals. Connect with developers, designers, investors, and founders.",
      startDate: new Date("2025-10-14"),
      endDate: new Date("2025-10-16"),
      location: "San Francisco, CA",
      isLive: true,
      createdById: sarah.id,
    },
  });

  // Add participants
  for (const user of users) {
    await prisma.eventParticipant.upsert({
      where: { eventId_userId: { eventId: event.id, userId: user.id } },
      update: {},
      create: { eventId: event.id, userId: user.id },
    });
  }

  // Create profiles (arrays serialized as JSON strings for SQLite)
  const J = JSON.stringify;
  const profileData = [
    {
      userId: sarah.id,
      aboutMe:
        "Passionate about building accessible user interfaces and creating seamless design systems. Currently leading the design system team at TechFlow.",
      currentRole: "Senior Product Designer",
      company: "TechFlow Inc.",
      skills: J(["User Research", "Figma", "Design Systems", "Prototyping", "Accessibility"]),
      interests: J(["Public Speaking", "FinTech", "Coffee", "Travel"]),
      lookingFor: J(["Collaborators", "Mentors"]),
    },
    {
      userId: david.id,
      aboutMe:
        "Full-stack engineer focused on building scalable payment systems. Love open source and teaching others about web performance.",
      currentRole: "Senior Frontend Engineer",
      company: "Stripe",
      skills: J(["React", "TypeScript", "Node.js", "GraphQL", "Web3"]),
      interests: J(["Design Systems", "Open Source", "Web3", "FinTech"]),
      lookingFor: J(["Co-founders", "Collaborators"]),
    },
    {
      userId: sarahM.id,
      aboutMe:
        "Product designer passionate about creating delightful user experiences in travel and hospitality. Previously freelance UI/UX.",
      currentRole: "Product Designer",
      company: "Airbnb",
      skills: J(["UX/UI", "Figma", "Prototyping", "User Research"]),
      interests: J(["Travel", "Hospitality Tech", "Design"]),
      lookingFor: J(["Mentors", "Learning Partners"]),
    },
    {
      userId: marcus.id,
      aboutMe:
        "Serial entrepreneur building the future of AI-powered startups. Looking for passionate tech leads and engineers.",
      currentRole: "CTO",
      company: "NovaStartups",
      skills: J(["Startups", "AI", "Leadership", "Python", "Strategy"]),
      interests: J(["Startups", "AI", "Venture Capital"]),
      lookingFor: J(["Tech Leads", "Hiring Talent", "Investors"]),
    },
    {
      userId: elena.id,
      aboutMe: "Machine learning engineer working on next-gen search algorithms. Passionate about making AI accessible to everyone.",
      currentRole: "ML Engineer",
      company: "Google",
      skills: J(["Python", "TensorFlow", "ML/AI", "Data Science"]),
      interests: J(["AI", "Open Source", "Education"]),
      lookingFor: J(["Collaborators", "Learning Partners"]),
    },
    {
      userId: james.id,
      aboutMe: "Cloud architect specializing in distributed systems. Active in the DevOps community and Kubernetes contributor.",
      currentRole: "Senior Cloud Architect",
      company: "Microsoft",
      skills: J(["AWS", "Docker", "Kubernetes", "Go", "Terraform"]),
      interests: J(["DevOps", "Cloud Native", "Open Source"]),
      lookingFor: J(["Collaborators", "Job Opportunities"]),
    },
    {
      userId: priya.id,
      aboutMe: "Full-stack developer building commerce tools for millions of merchants. Love building developer tools and APIs.",
      currentRole: "Staff Engineer",
      company: "Shopify",
      skills: J(["Ruby", "React", "GraphQL", "TypeScript", "APIs"]),
      interests: J(["E-commerce", "Developer Experience", "Startups"]),
      lookingFor: J(["Co-founders", "Mentors"]),
    },
    {
      userId: alex.id,
      aboutMe: "Early-stage investor focused on developer tools and infrastructure startups. Always looking for the next big thing.",
      currentRole: "Partner",
      company: "Sequoia Capital",
      skills: J(["Venture Capital", "Strategy", "FinTech"]),
      interests: J(["Startups", "FinTech", "AI", "Developer Tools"]),
      lookingFor: J(["Co-founders", "Hiring Talent"]),
    },
    {
      userId: mia.id,
      aboutMe: "Design engineer bridging the gap between design and code. Building tools that make designers and developers work better together.",
      currentRole: "Design Engineer",
      company: "Figma",
      skills: J(["React", "CSS", "Design Systems", "TypeScript", "Figma"]),
      interests: J(["Design", "Developer Experience", "Open Source"]),
      lookingFor: J(["Collaborators", "Learning Partners"]),
    },
    {
      userId: omar.id,
      aboutMe: "Embedded systems engineer working on next-gen autonomous vehicle software. Passionate about hardware-software integration.",
      currentRole: "Senior Software Engineer",
      company: "Tesla",
      skills: J(["C++", "Python", "Embedded Systems", "AI", "Robotics"]),
      interests: J(["Autonomous Vehicles", "Robotics", "AI", "Hardware"]),
      lookingFor: J(["Collaborators", "Mentors"]),
    },
  ];

  for (const pd of profileData) {
    await prisma.profile.upsert({
      where: { userId_eventId: { userId: pd.userId, eventId: event.id } },
      update: pd,
      create: { ...pd, eventId: event.id, onboardingComplete: true, isVisible: true },
    });
  }

  // Create experiences
  const experienceData = [
    { userId: sarah.id, title: "Senior Product Designer", company: "TechFlow", period: "2021 - Present", isCurrent: true },
    { userId: sarah.id, title: "UI/UX Designer", company: "Creative Solutions", period: "2018 - 2021", isCurrent: false },
    { userId: david.id, title: "Senior Frontend Engineer", company: "Stripe", period: "2020 - Present", isCurrent: true },
    { userId: david.id, title: "Frontend Developer", company: "Meta", period: "2017 - 2020", isCurrent: false },
    { userId: marcus.id, title: "CTO", company: "NovaStartups", period: "2022 - Present", isCurrent: true },
    { userId: marcus.id, title: "VP Engineering", company: "TechCorp", period: "2018 - 2022", isCurrent: false },
  ];

  // Clear existing experiences and recreate
  for (const user of users) {
    await prisma.experience.deleteMany({ where: { userId: user.id } });
  }

  for (const exp of experienceData) {
    await prisma.experience.create({ data: exp });
  }

  // Create some sample messages
  await prisma.message.deleteMany({ where: { eventId: event.id } });

  await prisma.message.createMany({
    data: [
      {
        eventId: event.id,
        senderId: david.id,
        receiverId: sarah.id,
        content: "Hey! I saw you checked into the TechConnect event. Are you planning to attend the cloud infrastructure keynote at 2 PM?",
        createdAt: new Date("2025-10-14T13:45:00"),
      },
      {
        eventId: event.id,
        senderId: sarah.id,
        receiverId: david.id,
        content: "Yes, absolutely! I'm actually heading to the main hall right now to grab a seat.",
        read: true,
        createdAt: new Date("2025-10-14T13:46:00"),
      },
      {
        eventId: event.id,
        senderId: david.id,
        receiverId: sarah.id,
        content: "Awesome. I'm near the front left. Let's meet up after? I'd love to pick your brain about that design system you mentioned on your profile.",
        createdAt: new Date("2025-10-14T13:48:00"),
      },
    ],
  });

  // Create some connections
  await prisma.connection.deleteMany({ where: { eventId: event.id } });
  await prisma.connection.createMany({
    data: [
      { eventId: event.id, requesterId: david.id, receiverId: sarah.id, status: "ACCEPTED" },
      { eventId: event.id, requesterId: marcus.id, receiverId: sarah.id, status: "PENDING" },
    ],
  });

  console.log("✅ Seed complete!");
  console.log(`   Event: ${event.name} (slug: ${event.slug})`);
  console.log(`   Users: ${users.length}`);
  console.log(`   Profiles: ${profileData.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
