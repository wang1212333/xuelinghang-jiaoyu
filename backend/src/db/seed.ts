import { supabaseAdmin } from '../lib/supabase.js';

const seedData = {
  users: [
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'sarah.mom@example.com',
      phone: '138****8888',
      wechat: 'sarah_mom_88',
      role: 'user'
    }
  ],
  profiles: [
    {
      id: '00000000-0000-0000-0000-000000000001',
      user_id: '00000000-0000-0000-0000-000000000001',
      name: 'Sarah妈妈',
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5EWUQn8TUnKvZoTf6I8utLJoFGRKp9FW4It83wpugIFFur4-zB04Qqb0CHtsb4rW2z9iAme-lfZcbNqu3MgHsnASOMN_nn29ZYiO7JXZaFxcs02ByDM8VSJDpfial0kv8P59Zut_jk0CYku-4Gu3RERsZ5qHdC8496AOCyKTBwy6f5qrIZVMyzxnhmkdgg25LaF_h6zgxtrb8YF2Df-yW-XoVM8_pW20f4aoxCpUncHwAZr0LW9G8kyUXPfS5IeIBCJQWdi2ubdjM',
      gender: '女',
      grade: '高二',
      city: '上海市',
      district: '浦东新区',
      address: '世纪大道 100 号',
      role_label: '学领航员',
      wallet_balance: 12840
    }
  ],
  tutors: [
    {
      id: '00000000-0000-0000-0000-000000000010',
      user_id: null,
      name: '张同学',
      university: '清华大学',
      subjects: ['数学', '物理竞赛'],
      categories: ['竞赛培优', '高考提分'],
      rating: 4.9,
      total_hours: 240,
      price: 200,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACdhKdWxWCXc64hHaPdGw9foWrk6yXOlPv792spg04pcmGoQIh5LMOvxPY24rAFE2lUpI3XPl8zQFsX6LlYzumq1e9OQCPXtcTkQezbeiQaxj8f1B7CFHjs36X21Vsus_eEhS8DcotNMW8_hLE36RVwoPJzI3fJsKJHRwqAUruYta4PFprSUYSDsM51LbDV1ECNz0g2NRi09KEA6NsMcVbTIAPlMwQ4YWi-gZQhTyyrUk_KEl7Lf48QVm4H8MHJDwWiVoeSEwR23Cu',
      bio: '清华大学数学系大三学生，全国数学竞赛一等奖获得者。',
      teaching_philosophy: '因材施教，注重思维训练',
      achievements: [
        { year: '2023', title: '高三李同学 · 数学跃升', result: '从75分提升到142分' }
      ],
      parent_feedback: [
        {
          content: '张同学非常专业，孩子数学成绩提升明显。',
          parent_name: '王先生',
          type: '初三家长'
        }
      ],
      is_verified: true
    },
    {
      id: '00000000-0000-0000-0000-000000000011',
      user_id: null,
      name: '李同学',
      university: '北京大学',
      subjects: ['英语口语', '考级辅导'],
      categories: ['小学辅导', '中考冲刺'],
      rating: 5.0,
      total_hours: 185,
      price: 180,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKvYBgQSPV8CoNRQnQC6nAb5M2GMIdupDXHCPrypLe2jb4PW12ZpNwGeaDb5px09OtgJcn859l8O3AiNdS-Cn7clxU-KeRcnfLBo-6YeOkL3c9Ov2jtkTdb7U6u57-u6uT_HkqxOhD66L0mNWmNJ9-976bWjRSM7vUFu36Jc8dZCAoFvcI3rxPrHRPRXduTkgt2oEJ5hnFsWXaNnQP_ZiVUq5-AD1OjWGNb9mceoSqn06yUso0SoZ8e5bBjz58NloUjDXh5NP0QlmN',
      bio: '北京大学英语系在读，雅思8.5分获得者。',
      teaching_philosophy: '沉浸式教学，激发学习兴趣',
      achievements: [],
      parent_feedback: [],
      is_verified: true
    },
    {
      id: '00000000-0000-0000-0000-000000000012',
      user_id: null,
      name: '陆同学',
      university: '复旦大学',
      subjects: ['高中物理', '竞赛'],
      categories: ['竞赛培优', '高考提分'],
      rating: 4.9,
      total_hours: 1280,
      price: 220,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDerl80SHxfadjTOGSKEdoR3NF9s49HcpAiZUWbapdgxQ2St7QR7-82ivkWUaKf06T3QEBvgb0xd79N7UUcNyZ7cb20I-7KXeoV06df41FBUM8Kanf1o7ydve7VmNavv0z8Y6Rx4PxzOZjoLhRWUcY0aKnh3alc0vXrzej_GBctwoQMuQBGQ0TBSwuB7_JWaQYQ48das7KE6Ru8X42-6iJ1G0JbrhNg51adwGAhTlOLm5iawhmlS77zGV3n3vbUjljcpuqoLciI2I1L',
      bio: '复旦大学物理学系大三学生，高考物理148分，全国物理竞赛二等奖。',
      teaching_philosophy: '思维可视化，建立底层逻辑',
      achievements: [
        { year: '2023', title: '高三林同学 · 物理跃升', result: '从62分提升到91分' },
        { year: '2024', title: '初三王同学 · 数理衔接', result: '力学核心提前掌握，开学测试全班第1' }
      ],
      parent_feedback: [
        {
          content: '陆同学非常负责。孩子之前很排斥物理，觉得太抽象。陆同学用生活中的例子来解释动力学，孩子现在甚至会主动看一些物理科普书了。',
          parent_name: '王女士',
          type: '高二家长'
        },
        {
          content: '大学生老师确实更懂学生的痛点。陆老师教的方法很实战，没有那么多教条。期末考试物理从不及格直接考到了80多。',
          parent_name: '李先生',
          type: '初三家长'
        }
      ],
      is_verified: true
    },
    {
      id: '00000000-0000-0000-0000-000000000013',
      user_id: null,
      name: '王同学',
      university: '中央美术学院',
      subjects: ['素描', '色彩', '艺考指导'],
      categories: ['艺术特长'],
      rating: 4.8,
      total_hours: 320,
      price: 250,
      image_url: 'https://picsum.photos/seed/art/400/300?blur=2',
      bio: '中央美术学院在读，有丰富的艺考指导经验。',
      teaching_philosophy: '注重基础，循序渐进',
      achievements: [],
      parent_feedback: [],
      is_verified: true
    }
  ],
  courses: [
    {
      id: '00000000-0000-0000-0000-000000000020',
      title: '高考数学最后冲刺提分训练营',
      description: '针对新课标，15天建立完整逻辑架构，名校学子带你复盘经典题型。',
      details: '本课程由清华、北大数学系学长学姐联合打造。包含15节核心考点直播课、5套历年真题精讲、24小时专属答疑群。适合高三冲刺阶段，目标突破130分的学生。',
      price: '¥1999',
      tags: ['名师打造', '高三冲刺', '直播+答疑'],
      students_count: '800+',
      icon: 'BookOpen',
      is_featured: true
    },
    {
      id: '00000000-0000-0000-0000-000000000021',
      title: '小学全科同步辅导',
      description: '夯实基础，培养习惯',
      details: '针对1-6年级学生，提供语数英三科同步辅导。重点培养良好的学习习惯、时间管理能力和基础知识的扎实掌握。每周3次课，名校学霸一对一专属辅导。',
      price: '¥150/课时',
      tags: ['小学', '全科', '习惯培养'],
      icon: 'Book',
      is_featured: false
    },
    {
      id: '00000000-0000-0000-0000-000000000022',
      title: '中考英语听力特训',
      description: '场景模拟，高效突破',
      details: '精选全国各地近5年中考英语听力真题，按场景分类专项突破。包含外教发音纠正、听力技巧讲解、全真模拟测试。考前30天冲刺必备，目标满分。',
      price: '¥899/期',
      tags: ['中考', '英语', '听力冲刺'],
      icon: 'PenTool',
      is_featured: false
    },
    {
      id: '00000000-0000-0000-0000-000000000023',
      title: '少儿编程思维启蒙',
      description: '逻辑开发，寓教于乐',
      details: '专为7-12岁儿童设计的Scratch图形化编程课程。通过制作有趣的小游戏和动画，培养孩子的计算思维、逻辑推理能力和创新创造力。',
      price: '¥1299/期',
      tags: ['少儿编程', '逻辑思维', 'Scratch'],
      icon: 'Brush',
      is_featured: false
    }
  ],
  messages: [
    {
      id: '00000000-0000-0000-0000-000000000030',
      user_id: '00000000-0000-0000-0000-000000000001',
      title: '欢迎来到 Digital Atheneum',
      content: '感谢您注册我们的平台。在这里，您可以找到最顶尖的学府导师。',
      type: 'system',
      is_read: false
    }
  ]
};

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    for (const user of seedData.users) {
      const { error } = await supabaseAdmin.from('users').upsert(user, { onConflict: 'id' });
      if (error) console.error('Error inserting user:', error);
    }
    console.log('✓ Users seeded');

    for (const profile of seedData.profiles) {
      const { error } = await supabaseAdmin.from('profiles').upsert(profile, { onConflict: 'id' });
      if (error) console.error('Error inserting profile:', error);
    }
    console.log('✓ Profiles seeded');

    for (const tutor of seedData.tutors) {
      const { error } = await supabaseAdmin.from('tutors').upsert(tutor, { onConflict: 'id' });
      if (error) console.error('Error inserting tutor:', error);
    }
    console.log('✓ Tutors seeded');

    for (const course of seedData.courses) {
      const { error } = await supabaseAdmin.from('courses').upsert(course, { onConflict: 'id' });
      if (error) console.error('Error inserting course:', error);
    }
    console.log('✓ Courses seeded');

    for (const message of seedData.messages) {
      const { error } = await supabaseAdmin.from('messages').upsert(message, { onConflict: 'id' });
      if (error) console.error('Error inserting message:', error);
    }
    console.log('✓ Messages seeded');

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  }

  process.exit(0);
}

seed();