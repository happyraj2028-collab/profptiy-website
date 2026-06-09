import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding (SQLite Mode)...');

  // 1. Clear existing data
  await prisma.setting.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.blog.deleteMany({});
  await prisma.inquiry.deleteMany({});
  await prisma.property.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.notification.deleteMany({});
  console.log('🧹 Cleaned existing database records.');

  // 2. Seed Admin User
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin Profptiy',
      email: 'admin@profptiy.com',
      password: adminPasswordHash,
      role: 'ADMIN',
    },
  });
  console.log(`👤 Seeded Default Admin User: ${adminUser.email} (Password: admin123)`);

  // 3. Seed CMS Website Settings
  const settings = [
    { key: 'siteName', value: 'Profptiy Luxury Real Estate' },
    { key: 'siteLogoText', value: 'PROFPITY' },
    { key: 'siteLogoSub', value: 'LUXURY REALTY' },
    { key: 'contactEmail', value: 'info@profptiy-luxury.com' },
    { key: 'contactPhone', value: '+91 98765 43210' },
    { key: 'whatsappNumber', value: '919876543210' },
    { key: 'officeAddress', value: 'Tower A, Signature Suites, DLF Phase 5, Gurugram, India' },
    { key: 'googleMapEmbedUrl', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3509.3094892429413!2d77.09848527632616!3d28.461141475758155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18deba555555%3A0xe54e8ffb8f8fa7bf!2sDLF%20Phase%205%20Gurugram!5e0!3m2!1sen!2sin!4v1717849200000!5m2!1sen!2sin' },
    { key: 'facebookUrl', value: 'https://facebook.com/profptiy.luxury' },
    { key: 'instagramUrl', value: 'https://instagram.com/profptiy.luxury' },
    { key: 'twitterUrl', value: 'https://twitter.com/profptiy_luxury' },
    { key: 'linkedinUrl', value: 'https://linkedin.com/company/profptiy-luxury' },
    { key: 'metaTitle', value: 'Profptiy | Luxury Mansions, Villas & Penthouses for Sale' },
    { key: 'metaDescription', value: 'Discover India\'s most exclusive luxury real estate listings. Explore ultra-premium villas, mansions, and penthouses in prime locations.' },
    { key: 'heroTagline', value: 'A Legacy of Absolute Discernment' },
    { key: 'heroTitle', value: 'Where Architecture Meets Artistic Grandeur' },
    { key: 'heroSubtitle', value: 'Brokerage services specialized in ultra-premium residential masterpieces, private estates, and beachfront sanctuaries for the most fastidious collectors.' },
    { key: 'heroBgImage', value: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600' },
    { key: 'ctaTitle', value: 'Acquire Your Next Architectural Legacy' },
    { key: 'ctaSubtitle', value: 'Schedule a private briefing with our senior brokers. We will review our off-market inventory matches matching your portfolio profiles.' },
    { key: 'ctaBtnText', value: 'Schedule Consultation' },
  ];

  for (const s of settings) {
    await prisma.setting.create({ data: s });
  }
  console.log('⚙️ Seeded CMS Settings.');

  // 4. Seed Testimonials
  const testimonials = [
    {
      name: 'Aditya Roy',
      role: 'Industrialist',
      company: 'Roy Group',
      content: 'Acquiring our beachfront villa in Goa through Profptiy was an absolute masterpiece of an experience. Their discretion, attention to architecture, and concierge-level service are unparalleled.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      approved: true,
    },
    {
      name: 'Meera Sen',
      role: 'Tech Founder',
      company: 'Apex Labs',
      content: 'The team at Profptiy curated the perfect luxury penthouse for me in Mumbai. The property listings are filtered and truly ultra-premium. Highly recommended for elite properties.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      approved: true,
    },
    {
      name: 'Vikram Malhotra',
      role: 'Investment Banker',
      company: 'Capital Crest',
      content: 'The process of purchasing our mansion in Lutyens Delhi was complex, but Profptiy handled everything seamlessly. Their documentation is flawless and their network is unmatched.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      approved: true,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log('💬 Seeded Approved Testimonials.');

  // 5. Seed Blog Articles
  const blogs = [
    {
      title: 'The Rise of Ultra-Luxury Mansions in India',
      slug: 'rise-of-ultra-luxury-mansions-india',
      excerpt: 'Explore how the demand for modern luxury estates, smart home integrations, and architectural privacy is reshaping the Indian high-end real estate market.',
      content: `The luxury residential landscape in India is witnessing an unprecedented revolution. High-Net-Worth Individuals (HNWIs) are no longer looking just for premium apartments; they are demanding customized architectural marvels that reflect their personal stature.\n\n### The Shift to Private Estates\n\nPrivacy has emerged as the ultimate luxury. Today's buyers prioritize gated estates with double-height ceilings, private infinity pools, professional wellness centers, and home automation systems that customize ambient lighting, temperature, and audio-visual layouts.\n\n### Core Investment Locations\n\n- **Goa Beachfronts**: Becoming the permanent second home of tech elites.\n- **Delhi Lutyens**: The historic symbol of absolute power and premium heritage estates.\n- **Mumbai High-Rises**: Duplex penthouses in Worli and Juhu with unobstructed Arabian Sea views.\n- **Alibaug Mansions**: Weekend retreats featuring large open lawns and organic design languages.`,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      tags: 'Luxury Market, Investment, Mansions', // Stored as comma-separated
      authorName: 'Ananya Sharma',
    },
    {
      title: 'Architectural Digest: Designing a Modern Mansion',
      slug: 'designing-a-modern-mansion',
      excerpt: 'A deep dive into structural glass, open flow design, organic elements, and biophilic architectural trends defining luxury homes in 2026.',
      content: `What defines a modern mansion in 2026? It is the harmony between structural innovation and organic sustainability.\n\n### Biophilic Design & Structural Glass\n\nIntegrating natural light through expansive floor-to-ceiling glass panes has become a staple. Biophilic design goes beyond house plants; it involves interior waterfalls, courtyard trees, and green walls that naturally purify the air.\n\n### Sustainable Opulence\n\n- Solar shingle roofs that blend seamlessly with slate tiles.\n- Smart greywater recycling systems that water extensive lawns automatically.\n- Recycled structural timber and local stone finishes that reduce carbon footprints while imparting deep rustic character.`,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      tags: 'Architecture, Design, Sustainability', // Stored as comma-separated
      authorName: 'Kabir Verma',
    },
  ];

  for (const b of blogs) {
    await prisma.blog.create({ data: b });
  }
  console.log('✍️ Seeded Blog Articles.');

  // 6. Seed Properties
  const properties = [
    {
      title: 'The Obsidian Pavilion Penthouse',
      description: 'Suspended 50 storeys above the Arabian Sea, The Obsidian Pavilion Penthouse represents the peak of high-rise luxury. Featuring a massive private terrace pool, custom glass wine cellar, state-of-the-art automated security, and 270-degree sky views. Outfitted with white Carrara marble floors, Gaggenau appliances, and custom Italian light installations.',
      price: 380000000, // ₹38 Crores INR
      type: 'Penthouse',
      status: 'For Sale',
      city: 'Mumbai',
      area: 'Worli',
      address: 'Sky Heights Towers, Senapati Bapat Marg, Worli',
      bedrooms: 4,
      bathrooms: 5,
      sqft: 8500,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800',
      ].join(','), // Serialized string
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      latitude: 19.0176,
      longitude: 72.8184,
      amenities: ['Sea View', 'Private Elevator', 'Infinity Pool', 'Home Theatre', 'Smart Automation', 'Concierge Service'].join(','), // Serialized string
      nearby: JSON.stringify([
        { name: 'Worli Sea Link', distance: '10 mins' },
        { name: 'Phoenix Palladium Mall', distance: '8 mins' },
        { name: 'Taj Lands End Hotel', distance: '20 mins' },
      ]), // Serialized JSON
      agentName: 'Sanjay Malhotra',
      agentEmail: 'sanjay@profptiy.com',
      agentPhone: '+91 99887 76655',
      agentImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    },
    {
      title: 'Vila Sol de Goa - Beachfront Sanctuary',
      description: 'A breath-taking beachfront sanctuary situated directly on Candolim beach. Vila Sol de Goa features traditional Portuguese-modern fusion architecture, a private manicured coconut grove, private beach access, a 25-meter lap pool, and extensive semi-outdoor entertainment pavilions. Fully staffed with butler quarters and commercial kitchen capabilities.',
      price: 185000000, // ₹18.5 Crores INR
      type: 'Villa',
      status: 'For Sale',
      city: 'Goa',
      area: 'Candolim',
      address: 'Beachfront Lane, Near Aguada Fort, Candolim',
      bedrooms: 5,
      bathrooms: 6,
      sqft: 7200,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      ].join(','),
      videoUrl: '',
      latitude: 15.5164,
      longitude: 73.7632,
      amenities: ['Beachfront', 'Private Pool', 'Servant Quarters', 'Gated Community', 'Lush Gardens', 'Barbecue Area'].join(','),
      nearby: JSON.stringify([
        { name: 'Fort Aguada', distance: '5 mins' },
        { name: 'Panaji Capital', distance: '25 mins' },
        { name: 'Dabolim Airport', distance: '50 mins' },
      ]),
      agentName: 'Nisha Fernandes',
      agentEmail: 'nisha@profptiy.com',
      agentPhone: '+91 99112 23344',
      agentImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    {
      title: 'The Lutyens Manor Estate',
      description: 'Located in the most prestigious ZIP code of India, this majestic Lutyens-style manor features sprawling lush lawns, classic colonnade design, high timber ceilings, and absolute secure perimeter. A heritage-modern architecture masterpiece with modern technical infrastructure, smart HVAC systems, bulletproof glass specs, and separate diplomatic host salons.',
      price: 1250000000, // ₹125 Crores INR
      type: 'Mansion',
      status: 'For Sale',
      city: 'Delhi',
      area: 'Lutyens',
      address: 'Prithviraj Road, Lutyens Zone, New Delhi',
      bedrooms: 7,
      bathrooms: 8,
      sqft: 18000,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      ].join(','),
      videoUrl: '',
      latitude: 28.5996,
      longitude: 77.2217,
      amenities: ['Heritage Lawns', 'High Security', 'Servant Quarters', 'Library Room', 'Power Backup', 'Gymnasium'].join(','),
      nearby: JSON.stringify([
        { name: 'Khan Market', distance: '5 mins' },
        { name: 'India Gate', distance: '8 mins' },
        { name: 'Presidential Estate', distance: '10 mins' },
      ]),
      agentName: 'Sanjay Malhotra',
      agentEmail: 'sanjay@profptiy.com',
      agentPhone: '+91 99887 76655',
      agentImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    },
    {
      title: 'Serene Hills Villa',
      description: 'Nestled in the tranquil hills of Nandi, this modern architectural marvel offers breath-taking views of the valleys. It features double-height glass panels, a private heated pool, organic kitchen gardens, dynamic smart lighting, and multi-tier deck spaces for premium outdoor living.',
      price: 89000000, // ₹8.9 Crores INR
      type: 'Villa',
      status: 'For Sale',
      city: 'Bangalore',
      area: 'Nandi Hills',
      address: 'Valley View Road, Nandi Hills foothills, Bangalore',
      bedrooms: 4,
      bathrooms: 5,
      sqft: 6400,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
        'https://images.unsplash.com/photo-1600607677969-dec7b925489f?w=800',
      ].join(','),
      videoUrl: '',
      latitude: 13.3702,
      longitude: 77.6835,
      amenities: ['Hill View', 'Heated Pool', 'Smart Home', 'Home Bar', 'Billiard Room'].join(','),
      nearby: JSON.stringify([
        { name: 'Nandi Hills Peak', distance: '15 mins' },
        { name: 'Kempegowda Airport', distance: '30 mins' },
      ]),
      agentName: 'Nisha Fernandes',
      agentEmail: 'nisha@profptiy.com',
      agentPhone: '+91 99112 23344',
      agentImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    {
      title: 'Ultra-Modern Glass Duplex',
      description: 'A striking structural glass duplex at the heart of Gurgaon. Featuring fully-automated living modules, motorized acoustic blinds, an indoor elevator, private wine cellar, and a sky terrace hosting a premium BBQ setup. Outfitted with top-tier Gaggenau fittings and custom walnut paneling.',
      price: 110000000, // ₹11 Crores INR
      type: 'Apartment',
      status: 'For Sale',
      city: 'Gurgaon',
      area: 'Golf Course Road',
      address: 'The Magnolias, Golf Course Road, DLF Phase 5, Gurgaon',
      bedrooms: 3,
      bathrooms: 4,
      sqft: 5200,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200',
        'https://images.unsplash.com/photo-1613977257592-4871e5fbe7c5?w=800',
      ].join(','),
      videoUrl: '',
      latitude: 28.4595,
      longitude: 77.0989,
      amenities: ['Golf Course View', 'Gym', 'Concierge Service', 'Private Elevator', 'Electric Charger Setup'].join(','),
      nearby: JSON.stringify([
        { name: 'One Horizon Center', distance: '3 mins' },
        { name: 'DLF Golf Club', distance: '2 mins' },
      ]),
      agentName: 'Sanjay Malhotra',
      agentEmail: 'sanjay@profptiy.com',
      agentPhone: '+91 99887 76655',
      agentImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    },
    {
      title: 'Royal Palms Mansion Estate',
      description: 'A colonial-style luxury estate boasting 12-foot high ceiling gates, pristine marble corridors, private organic orchids, a 6-car garage suite, a private gym, steam sauna rooms, and detailed teakwood library details. Fits elite profiles seeking privacy and security.',
      price: 145000000, // ₹14.5 Crores INR
      type: 'Mansion',
      status: 'For Rent',
      city: 'Bangalore',
      area: 'Sadashivanagar',
      address: 'Palace Orchard Extension, Sadashivanagar, Bangalore',
      bedrooms: 6,
      bathrooms: 7,
      sqft: 11500,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200',
        'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
      ].join(','),
      videoUrl: '',
      latitude: 13.0068,
      longitude: 77.5813,
      amenities: ['Orchid Gardens', '6-Car Garage', 'Private Gym', 'Steam Sauna', 'Teak Library'].join(','),
      nearby: JSON.stringify([
        { name: 'Bangalore Palace', distance: '5 mins' },
        { name: 'Sankey Tank', distance: '2 mins' },
      ]),
      agentName: 'Nisha Fernandes',
      agentEmail: 'nisha@profptiy.com',
      agentPhone: '+91 99112 23344',
      agentImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    }
  ];

  for (const p of properties) {
    await prisma.property.create({ data: p });
  }
  console.log('🏘️ Seeded Luxury Properties.');

  console.log('🌱 Seeding Completed Successfully! Your SQLite database is ready.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
