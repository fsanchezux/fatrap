import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.sidebarOption.deleteMany()
  await prisma.sidebarSection.deleteMany()
  await prisma.fileItem.deleteMany()

  // Create Favorites section
  const favorites = await prisma.sidebarSection.create({
    data: {
      name: 'Favorites',
      order: 1,
      options: {
        create: [
          { name: 'AirDrop', icon: 'airdrop', path: '/airdrop', order: 1 },
          { name: 'Recents', icon: 'clock', path: '/recents', order: 2 },
          { name: 'Applications', icon: 'apps', path: '/applications', order: 3 },
          { name: 'Desktop', icon: 'desktop', path: '/desktop', order: 4 },
          { name: 'Documents', icon: 'folder', path: '/documents', order: 5 },
          { name: 'Downloads', icon: 'download', path: '/downloads', order: 6 },
        ],
      },
    },
  })

  // Create iCloud section
  const icloud = await prisma.sidebarSection.create({
    data: {
      name: 'iCloud',
      order: 2,
      options: {
        create: [
          { name: 'iCloud Drive', icon: 'cloud', path: '/icloud-drive', order: 1 },
          { name: 'Shared', icon: 'users', path: '/shared', order: 2 },
        ],
      },
    },
  })

  // Create Tags section
  const tags = await prisma.sidebarSection.create({
    data: {
      name: 'Tags',
      order: 3,
      options: {
        create: [
          { name: 'Red', icon: 'tag', path: '/tags/red', color: '#ff6b6b', order: 1 },
          { name: 'Orange', icon: 'tag', path: '/tags/orange', color: '#ffa94d', order: 2 },
          { name: 'Yellow', icon: 'tag', path: '/tags/yellow', color: '#ffd43b', order: 3 },
          { name: 'Green', icon: 'tag', path: '/tags/green', color: '#69db7c', order: 4 },
          { name: 'Blue', icon: 'tag', path: '/tags/blue', color: '#4dabf7', order: 5 },
          { name: 'Purple', icon: 'tag', path: '/tags/purple', color: '#da77f2', order: 6 },
          { name: 'Gray', icon: 'tag', path: '/tags/gray', color: '#868e96', order: 7 },
          { name: 'All Tags...', icon: 'tags', path: '/tags', order: 8 },
        ],
      },
    },
  })

  // Create sample file items
  const sampleFiles = [
    { name: 'tylenol.jpeg', type: 'image', path: '/files/tylenol.jpeg' },
    { name: 'balm_dr_m.webp', type: 'image', path: '/files/balm_dr_m.webp' },
    { name: 'bobby_pin.jpeg', type: 'image', path: '/files/bobby_pin.jpeg' },
    { name: 'trident_white.webp', type: 'image', path: '/files/trident_white.webp' },
    { name: 'keys3.webp', type: 'image', path: '/files/keys3.webp' },
    { name: 'kindle.jpeg', type: 'image', path: '/files/kindle.jpeg' },
    { name: 'lipstick_knife.jpeg', type: 'image', path: '/files/lipstick_knife.jpeg' },
    { name: 'sunglasses_case.jpeg', type: 'image', path: '/files/sunglasses_case.jpeg' },
    { name: 'waterbottle.jpeg', type: 'image', path: '/files/waterbottle.jpeg' },
    { name: 'tampons.png', type: 'image', path: '/files/tampons.png' },
    { name: 'sharpie.png', type: 'image', path: '/files/sharpie.png' },
    { name: 'touchland.png', type: 'image', path: '/files/touchland.png' },
  ]

  for (const file of sampleFiles) {
    await prisma.fileItem.create({ data: file })
  }

  console.log('Seed data created successfully!')
  console.log({ favorites, icloud, tags })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
