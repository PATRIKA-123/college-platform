import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Purana duplicate data clear karein
  await prisma.cutoff.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();

  const collegesData = [
    {
      name: 'Indian Institute of Technology, Delhi',
      slug: 'iit-delhi',
      location: 'New Delhi',
      state: 'Delhi',
      fees: 220000,
      rating: 4.8,
      description: 'Premier engineering institution known for top-tier research and excellent placement records.',
      establishedYear: 1961,
      placement: {
        create: {
          averagePackage: 25.5,
          highestPackage: 120.0,
          placementRate: 98.2,
        },
      },
      cutoffs: {
        create: [{ exam: 'JEE Advanced', rank: 120 }],
      },
      courses: {
        create: [
          { name: 'B.Tech Computer Science', duration: '4 Years', fees: 220000 },
          { name: 'B.Tech Electrical Engineering', duration: '4 Years', fees: 210000 },
        ],
      },
    },
    {
      name: 'Birla Institute of Technology and Science, Pilani',
      slug: 'bits-pilani',
      location: 'Pilani',
      state: 'Rajasthan',
      fees: 475000,
      rating: 4.6,
      description: 'Leading private autonomous institute offering top programs in science and engineering.',
      establishedYear: 1964,
      placement: {
        create: {
          averagePackage: 18.2,
          highestPackage: 60.0,
          placementRate: 94.5,
        },
      },
      cutoffs: {
        create: [{ exam: 'BITSAT', rank: 320 }],
      },
      courses: {
        create: [
          { name: 'B.E. Computer Science', duration: '4 Years', fees: 475000 },
          { name: 'B.E. Electronics & Instrumentation', duration: '4 Years', fees: 450000 },
        ],
      },
    },
    {
      name: 'National Institute of Technology, Trichy',
      slug: 'nit-trichy',
      location: 'Tiruchirappalli',
      state: 'Tamil Nadu',
      fees: 145000,
      rating: 4.5,
      description: 'Top-ranked NIT offering premier technical education and robust infrastructure.',
      establishedYear: 1964,
      placement: {
        create: {
          averagePackage: 15.0,
          highestPackage: 52.0,
          placementRate: 92.0,
        },
      },
      cutoffs: {
        create: [{ exam: 'JEE Main', rank: 1500 }],
      },
      courses: {
        create: [
          { name: 'B.Tech Mechanical Engineering', duration: '4 Years', fees: 145000 },
          { name: 'B.Tech Civil Engineering', duration: '4 Years', fees: 140000 },
        ],
      },
    },
    {
      name: 'Indian Institute of Science, Bangalore',
      slug: 'iisc-bangalore',
      location: 'Bangalore',
      state: 'Karnataka',
      fees: 95000,
      rating: 4.9,
      description: 'Research-focused institute known for advanced science, engineering, and interdisciplinary programs.',
      establishedYear: 1909,
      placement: {
        create: { averagePackage: 28.0, highestPackage: 70.0, placementRate: 96.0 },
      },
      cutoffs: {
        create: [{ exam: 'IISc Admission', rank: 80 }],
      },
      courses: {
        create: [
          { name: 'B.Tech Mathematics and Computing', duration: '4 Years', fees: 95000 },
          { name: 'M.Tech Artificial Intelligence', duration: '2 Years', fees: 85000 },
        ],
      },
      reviews: {
        create: [{ rating: 4.9, text: 'Excellent research environment and faculty support.' }],
      },
    },
    {
      name: 'Indian Institute of Technology, Bombay',
      slug: 'iit-bombay',
      location: 'Mumbai',
      state: 'Maharashtra',
      fees: 230000,
      rating: 4.8,
      description: 'Leading technology institute with strong academics, entrepreneurship, and industry connections.',
      establishedYear: 1958,
      placement: {
        create: { averagePackage: 26.0, highestPackage: 145.0, placementRate: 97.5 },
      },
      cutoffs: {
        create: [{ exam: 'JEE Advanced', rank: 90 }],
      },
      courses: {
        create: [
          { name: 'B.Tech Computer Science and Engineering', duration: '4 Years', fees: 230000 },
          { name: 'B.Tech Aerospace Engineering', duration: '4 Years', fees: 220000 },
        ],
      },
      reviews: {
        create: [{ rating: 4.8, text: 'A challenging campus with outstanding opportunities beyond the classroom.' }],
      },
    },
    {
      name: 'Indian Institute of Technology, Madras',
      slug: 'iit-madras',
      location: 'Chennai',
      state: 'Tamil Nadu',
      fees: 215000,
      rating: 4.7,
      description: 'A premier institute offering rigorous engineering education and a vibrant innovation ecosystem.',
      establishedYear: 1959,
      placement: {
        create: { averagePackage: 24.0, highestPackage: 130.0, placementRate: 96.8 },
      },
      cutoffs: {
        create: [{ exam: 'JEE Advanced', rank: 180 }],
      },
      courses: {
        create: [
          { name: 'B.Tech Data Science and AI', duration: '4 Years', fees: 215000 },
          { name: 'B.Tech Engineering Physics', duration: '4 Years', fees: 205000 },
        ],
      },
      reviews: {
        create: [{ rating: 4.7, text: 'Strong academics, helpful peers, and a beautiful campus.' }],
      },
    },
    {
      name: 'University of Delhi',
      slug: 'university-of-delhi',
      location: 'New Delhi',
      state: 'Delhi',
      fees: 45000,
      rating: 4.4,
      description: 'A diverse public university with respected programs in humanities, commerce, science, and social sciences.',
      establishedYear: 1922,
      placement: {
        create: { averagePackage: 9.5, highestPackage: 45.0, placementRate: 82.0 },
      },
      cutoffs: {
        create: [{ exam: 'CUET', rank: 1200 }],
      },
      courses: {
        create: [
          { name: 'B.A. Economics', duration: '3 Years', fees: 45000 },
          { name: 'B.Com. Honours', duration: '3 Years', fees: 42000 },
        ],
      },
      reviews: {
        create: [{ rating: 4.4, text: 'A lively student community with many societies and academic paths.' }],
      },
    },
    {
      name: 'Vellore Institute of Technology',
      slug: 'vit-vellore',
      location: 'Vellore',
      state: 'Tamil Nadu',
      fees: 198000,
      rating: 4.3,
      description: 'Technology-focused university with a broad range of engineering programs and global collaborations.',
      establishedYear: 1984,
      placement: {
        create: { averagePackage: 8.5, highestPackage: 75.0, placementRate: 91.0 },
      },
      cutoffs: {
        create: [{ exam: 'VITEEE', rank: 2500 }],
      },
      courses: {
        create: [
          { name: 'B.Tech Information Technology', duration: '4 Years', fees: 198000 },
          { name: 'B.Tech Biotechnology', duration: '4 Years', fees: 185000 },
        ],
      },
      reviews: {
        create: [{ rating: 4.3, text: 'Good industry exposure with plenty of technical clubs and events.' }],
      },
    },
  ];

  for (const college of collegesData) {
    await prisma.college.create({
      data: college,
    });
  }

  console.log('Database re-seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });