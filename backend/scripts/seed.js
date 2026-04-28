import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import User from '../src/models/User.js';
import Property from '../src/models/Property.js';
import Appointment from '../src/models/Appointment.js';
import Inquiry from '../src/models/Inquiry.js';
import { makeSlug } from '../src/utils/slug.js';

const images = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3ea?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1600&auto=format&fit=crop'
];

const agentImages = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=600&auto=format&fit=crop'
];

const baseAmenities = [
  'CCTV Security',
  'Modern Kitchen',
  'Car Parking',
  'Near Markaz',
  'Family Friendly'
];

const premiumAmenities = [
  'Smart Home Ready',
  'Servant Quarter',
  'Wide Road Access',
  'Solar Backup',
  'Security Checkpost'
];

const commercialAmenities = [
  'Elevator Access',
  'Backup Power',
  'Reception Lobby',
  'Basement Parking',
  'Prime Business Location'
];

const plotAmenities = [
  'Clear Documents',
  'Possession Available',
  'Wide Road',
  'Utilities Nearby',
  'Investment Friendly'
];

const sectorConfigs = [
  {
    sector: 'F-7',
    locationText: 'F-7, Islamabad',
    addressPrefix: 'Street 43, F-7',
    priceBase: 135000000,
    types: ['Villa', 'House', 'Apartment', 'House', 'Villa', 'Plot', 'House', 'Apartment', 'Villa', 'House'],
    premium: true
  },
  {
    sector: 'F-8',
    locationText: 'F-8, Islamabad',
    addressPrefix: 'Near F-8 Markaz',
    priceBase: 92000000,
    types: ['Apartment', 'House', 'Villa', 'House', 'Apartment', 'Plot', 'House', 'Apartment', 'Villa', 'House'],
    premium: true
  },
  {
    sector: 'DHA Phase 2',
    locationText: 'DHA Phase 2, Islamabad',
    addressPrefix: 'Sector J, DHA Phase 2',
    priceBase: 68000000,
    types: ['House', 'Villa', 'House', 'Plot', 'House', 'Apartment', 'Villa', 'House', 'Plot', 'House'],
    premium: true
  },
  {
    sector: 'Bahria Enclave',
    locationText: 'Bahria Enclave, Islamabad',
    addressPrefix: 'Sector C-1, Bahria Enclave',
    priceBase: 42000000,
    types: ['House', 'Villa', 'House', 'Apartment', 'Plot', 'House', 'Villa', 'House', 'Apartment', 'House'],
    premium: false
  },
  {
    sector: 'Gulberg Greens',
    locationText: 'Gulberg Greens, Islamabad',
    addressPrefix: 'Executive Block, Gulberg Greens',
    priceBase: 115000000,
    types: ['Villa', 'Farmhouse', 'House', 'Plot', 'Villa', 'House', 'Plot', 'Villa', 'House', 'Farmhouse'],
    premium: true
  },
  {
    sector: 'D-12',
    locationText: 'D-12, Islamabad',
    addressPrefix: 'D-12/4',
    priceBase: 58000000,
    types: ['House', 'Apartment', 'House', 'Plot', 'Villa', 'House', 'Apartment', 'House', 'Plot', 'House'],
    premium: false
  },
  {
    sector: 'E-11',
    locationText: 'E-11, Islamabad',
    addressPrefix: 'E-11/3',
    priceBase: 50000000,
    types: ['Apartment', 'House', 'Plot', 'Apartment', 'House', 'Villa', 'Apartment', 'House', 'Plot', 'House'],
    premium: false
  },
  {
    sector: 'Blue Area',
    locationText: 'Blue Area, Islamabad',
    addressPrefix: 'Jinnah Avenue, Blue Area',
    priceBase: 76000000,
    types: ['Commercial', 'Commercial', 'Apartment', 'Commercial', 'Commercial', 'Apartment', 'Commercial', 'Commercial', 'Apartment', 'Commercial'],
    premium: true
  }
];

const titleWords = [
  'Luxury',
  'Modern',
  'Executive',
  'Premium',
  'Elegant',
  'Designer',
  'Corner',
  'Park-Facing',
  'Margalla View',
  'Investment-Ready'
];

const typeLabel = (type) => {
  if (type === 'Farmhouse') return 'Villa';
  return type;
};

const getSpecs = (type, index) => {
  if (type === 'Apartment') {
    return {
      bedrooms: 2 + (index % 3),
      bathrooms: 2 + (index % 3),
      area: 1450 + index * 180,
      areaUnit: 'Sq Ft',
      garages: 1
    };
  }

  if (type === 'Plot') {
    return {
      bedrooms: 0,
      bathrooms: 0,
      area: index % 2 === 0 ? 1 : 10,
      areaUnit: index % 2 === 0 ? 'Kanal' : 'Marla',
      garages: 0
    };
  }

  if (type === 'Commercial') {
    return {
      bedrooms: 0,
      bathrooms: 1 + (index % 3),
      area: 950 + index * 220,
      areaUnit: 'Sq Ft',
      garages: 2
    };
  }

  if (type === 'Farmhouse') {
    return {
      bedrooms: 5 + (index % 3),
      bathrooms: 6 + (index % 3),
      area: 2 + (index % 3),
      areaUnit: 'Kanal',
      garages: 4
    };
  }

  if (type === 'Villa') {
    return {
      bedrooms: 5 + (index % 3),
      bathrooms: 5 + (index % 4),
      area: index % 2 === 0 ? 1 : 20,
      areaUnit: index % 2 === 0 ? 'Kanal' : 'Marla',
      garages: 3
    };
  }

  return {
    bedrooms: 3 + (index % 4),
    bathrooms: 3 + (index % 4),
    area: index % 2 === 0 ? 10 : 1,
    areaUnit: index % 2 === 0 ? 'Marla' : 'Kanal',
    garages: 2
  };
};

const priceLabel = (price, purpose) => {
  if (purpose === 'rent') {
    return `PKR ${Math.round(price).toLocaleString('en-PK')} / month`;
  }

  if (price >= 10000000) {
    const crore = price / 10000000;
    return `PKR ${Number.isInteger(crore) ? crore : crore.toFixed(2)} Crore`;
  }

  return `PKR ${(price / 100000).toFixed(1)} Lakh`;
};

const makeProperty = (config, index) => {
  const rawType = config.types[index];
  const type = typeLabel(rawType);
  const specs = getSpecs(rawType, index);

  const purpose =
    index === 8 || (index === 6 && ['Apartment', 'House', 'Commercial'].includes(type))
      ? 'rent'
      : 'sale';

  const priceStep = config.sector === 'Blue Area' ? 8500000 : 6500000;
  const salePrice = config.priceBase + index * priceStep;

  const rentPrice =
    type === 'Commercial'
      ? 325000 + index * 45000
      : type === 'Apartment'
        ? 140000 + index * 25000
        : 220000 + index * 35000;

  const price = purpose === 'rent' ? rentPrice : salePrice;

  const title = `${titleWords[index]} ${rawType} in ${config.sector}`;
  const location = config.locationText;
  const address = `${config.addressPrefix}, Plot ${index + 11}, Islamabad`;

  const imageStart = (index + config.sector.length) % images.length;
  const propertyImages = [
    images[imageStart],
    images[(imageStart + 1) % images.length],
    images[(imageStart + 2) % images.length]
  ];

  const amenities =
    type === 'Commercial'
      ? commercialAmenities
      : type === 'Plot'
        ? plotAmenities
        : [...baseAmenities, ...premiumAmenities.slice(0, 2 + (index % 3))];

  return {
    title,
    slug: makeSlug(title),
    overview: `${title} is a professionally selected ${location} listing with verified details, strong accessibility, and excellent lifestyle or investment potential. This property is suitable for buyers and investors who want a premium Islamabad location with practical facilities and reliable documentation guidance.`,
    price,
    priceLabel: priceLabel(price, purpose),
    purpose,
    type,
    status: 'Available',
    city: 'Islamabad',
    sector: config.sector,
    location,
    address,
    ...specs,
    yearBuilt: type === 'Plot' ? undefined : 2016 + (index % 8),
    images: propertyImages,
    amenities,
    highlights: [
      'Verified listing',
      'Prime Islamabad location',
      'High resale value',
      `${config.sector} specialist advisor`
    ],
    featured: index < 4 || (config.premium && index < 6),
    premium: config.premium || index < 3,
    views: 25 + index * 17 + config.sector.length,
    agent: {
      name:
        index % 3 === 0
          ? 'Hamza Malik'
          : index % 3 === 1
            ? 'Ayesha Khan'
            : 'Margalla Estates Advisor',
      phone:
        index % 3 === 0
          ? '+92 300 1234567'
          : index % 3 === 1
            ? '+92 321 7654321'
            : '+92 311 9876543',
      email:
        index % 3 === 0
          ? 'hamza@margallaestates.pk'
          : index % 3 === 1
            ? 'ayesha@margallaestates.pk'
            : 'sales@margallaestates.pk',
      image: agentImages[index % agentImages.length]
    }
  };
};

const properties = sectorConfigs.flatMap((config) =>
  Array.from({ length: 10 }, (_, index) => makeProperty(config, index))
);

async function run() {
  await connectDB();

  const isFresh = process.argv.includes('--fresh');

  if (isFresh) {
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      Appointment.deleteMany({}),
      Inquiry.deleteMany({})
    ]);
  }

  const email = process.env.ADMIN_EMAIL || 'admin@margallaestates.pk';

  let admin = await User.findOne({ email });

  if (!admin) {
    admin = await User.create({
      name: 'Margalla Admin',
      email,
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      phone: '+92 300 1234567',
      role: 'admin'
    });
  }

  for (const property of properties) {
    await Property.updateOne(
      { slug: property.slug },
      {
        $set: {
          ...property,
          createdBy: admin._id
        }
      },
      {
        upsert: true,
        runValidators: true
      }
    );
  }

  if ((await User.countDocuments({ role: 'user' })) === 0) {
    await User.create({
      name: 'Demo Buyer',
      email: 'buyer@example.com',
      password: 'Buyer@12345',
      phone: '+92 311 9876543'
    });
  }

  console.log('Seed completed successfully');
  console.log(`Inserted/updated properties: ${properties.length}`);
  console.log('Each premium location now has 10 properties.');
  console.log(`Admin: ${email}`);
  console.log(`Password: ${process.env.ADMIN_PASSWORD || 'Admin@12345'}`);

  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});