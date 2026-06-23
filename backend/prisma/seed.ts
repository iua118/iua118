import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.activity.deleteMany();
  await prisma.automationSequenceStep.deleteMany();
  await prisma.automationSequence.deleteMany();
  await prisma.email.deleteMany();
  await prisma.call.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.dealContact.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.account.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  console.log('✓ Database cleared');

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: await bcrypt.hash('Admin@123456', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@example.com',
      password: await bcrypt.hash('Manager@123456', 10),
      firstName: 'Trần',
      lastName: 'Quản Lý',
      role: 'MANAGER',
      status: 'ACTIVE',
      department: 'Sales',
    },
  });

  const sales1 = await prisma.user.create({
    data: {
      email: 'sales1@example.com',
      password: await bcrypt.hash('Sales@123456', 10),
      firstName: 'Nguyễn',
      lastName: 'Bán Hàng 1',
      role: 'USER',
      status: 'ACTIVE',
      department: 'Sales',
    },
  });

  const sales2 = await prisma.user.create({
    data: {
      email: 'sales2@example.com',
      password: await bcrypt.hash('Sales@123456', 10),
      firstName: 'Phạm',
      lastName: 'Bán Hàng 2',
      role: 'USER',
      status: 'ACTIVE',
      department: 'Sales',
    },
  });

  console.log('✓ Created 4 users');

  // Create demo leads
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        firstName: 'Tôn',
        lastName: 'Nữ Tây',
        email: 'ton.nuytay@techcorp.com',
        phone: '0912345678',
        company: 'Tech Solutions Inc',
        jobTitle: 'CTO',
        source: 'WEBSITE',
        status: 'NEW',
        score: 85,
        notes: 'Lead từ website, rất hứa hẹn, budget lớn',
        tags: ['VIP', 'Hot', 'B2B'],
        assignedToId: sales1.id,
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Lê',
        lastName: 'Marketing Manager',
        email: 'le.marketing@startup.vn',
        phone: '0923456789',
        company: 'Startup Việt Nam',
        jobTitle: 'Marketing Manager',
        source: 'FACEBOOK_ADS',
        status: 'CONTACTED',
        score: 65,
        notes: 'Đã liên hệ, đợi phản hồi',
        tags: ['Startup', 'Follow-up'],
        assignedToId: sales1.id,
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Hoàng',
        lastName: 'CEO',
        email: 'hoang.ceo@company.com',
        phone: '0934567890',
        company: 'Công Ty Lớn A',
        jobTitle: 'CEO',
        source: 'GOOGLE_ADS',
        status: 'QUALIFIED',
        score: 90,
        notes: 'Khách hàng tiềm năng rất cao, đã xác nhận nhu cầu',
        tags: ['Enterprise', 'Qualified'],
        assignedToId: sales2.id,
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Bùi',
        lastName: 'Project Manager',
        email: 'bui.pm@midsize.com',
        phone: '0945678901',
        company: 'Công Ty Vừa B',
        jobTitle: 'Project Manager',
        source: 'LINKEDIN',
        status: 'NURTURING',
        score: 55,
        notes: 'Trong giai đoạn nuôi dưỡng, gửi tài liệu',
        tags: ['Nurturing'],
        assignedToId: sales2.id,
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Vũ',
        lastName: 'Decision Maker',
        email: 'vu.decision@enterprise.com',
        phone: '0956789012',
        company: 'Doanh Nghiệp Lớn C',
        jobTitle: 'SVP',
        source: 'REFERRAL',
        status: 'CONVERTED',
        score: 100,
        notes: 'Đã chuyển đổi thành khách hàng',
        tags: ['Converted', 'VIP'],
        assignedToId: sales1.id,
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Dương',
        lastName: 'Department Head',
        email: 'duong.head@smallco.com',
        phone: '0967890123',
        company: 'Công Ty Nhỏ D',
        jobTitle: 'Department Head',
        source: 'MANUAL',
        status: 'LOST',
        score: 20,
        notes: 'Không quan tâm đến giải pháp của chúng ta',
        tags: ['Lost'],
        assignedToId: manager.id,
      },
    }),
  ]);

  console.log('✓ Created 6 demo leads');

  // Create accounts
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        name: 'Tech Solutions Inc',
        industry: 'Technology',
        website: 'https://techsolutions.com',
        phone: '(028) 1234 5678',
        address: '123 Tech Street',
        city: 'Ho Chi Minh',
        state: 'HCM',
        country: 'Vietnam',
        type: 'PROSPECT',
        status: 'ACTIVE',
      },
    }),
    prisma.account.create({
      data: {
        name: 'Startup Việt Nam',
        industry: 'Software',
        website: 'https://startupt.vn',
        phone: '(028) 2345 6789',
        address: '456 Startup Ave',
        city: 'Ha Noi',
        state: 'HN',
        country: 'Vietnam',
        type: 'PROSPECT',
        status: 'ACTIVE',
      },
    }),
  ]);

  console.log('✓ Created 2 demo accounts');

  // Create contacts
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        firstName: 'Tôn',
        lastName: 'Nữ Tây',
        email: 'ton.nuytay@techcorp.com',
        phone: '0912345678',
        jobTitle: 'CTO',
        role: 'DECISION_MAKER',
        status: 'ACTIVE',
        accountId: accounts[0].id,
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'Vũ',
        lastName: 'Decision Maker',
        email: 'vu.decision@enterprise.com',
        phone: '0956789012',
        jobTitle: 'SVP',
        role: 'ECONOMIC_BUYER',
        status: 'ACTIVE',
        accountId: accounts[1].id,
      },
    }),
  ]);

  console.log('✓ Created 2 demo contacts');

  // Create deals
  const deals = await Promise.all([
    prisma.deal.create({
      data: {
        name: 'Enterprise License for Tech Solutions',
        description: 'Large enterprise license deal',
        amount: 500000,
        currency: 'USD',
        stage: 'PROPOSAL',
        probability: 80,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'OPEN',
        assignedToId: sales1.id,
        accountId: accounts[0].id,
        leadId: leads[0].id,
      },
    }),
    prisma.deal.create({
      data: {
        name: 'Startup Package',
        description: 'Startup special offer',
        amount: 50000,
        currency: 'USD',
        stage: 'NEGOTIATION',
        probability: 60,
        expectedCloseDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'OPEN',
        assignedToId: sales2.id,
        accountId: accounts[1].id,
        leadId: leads[2].id,
      },
    }),
  ]);

  console.log('✓ Created 2 demo deals');

  // Create tasks
  await Promise.all([
    prisma.task.create({
      data: {
        title: 'Follow up with Tech Solutions',
        description: 'Call to discuss proposal',
        status: 'OPEN',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        assignedToId: sales1.id,
        createdById: sales1.id,
        dealId: deals[0].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Prepare demo for Startup',
        description: 'Prepare customized demo',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        assignedToId: sales2.id,
        createdById: sales2.id,
        dealId: deals[1].id,
      },
    }),
  ]);

  console.log('✓ Created 2 demo tasks');

  // Create activities
  await Promise.all([
    prisma.activity.create({
      data: {
        type: 'LEAD_CREATED',
        description: 'New lead created from website',
        userId: sales1.id,
        leadId: leads[0].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'LEAD_UPDATED',
        description: 'Lead status changed to CONTACTED',
        userId: sales1.id,
        leadId: leads[1].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'DEAL_CREATED',
        description: 'New deal created',
        userId: sales1.id,
        dealId: deals[0].id,
      },
    }),
  ]);

  console.log('✓ Created activities');

  console.log('✅ Database seeded successfully!');
  console.log('\n📝 Test Accounts:');
  console.log('   Admin: admin@example.com / Admin@123456');
  console.log('   Manager: manager@example.com / Manager@123456');
  console.log('   Sales1: sales1@example.com / Sales@123456');
  console.log('   Sales2: sales2@example.com / Sales@123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
