'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('highlights', [
      {
        title_vi: 'DỊCH VỤ CHUYÊN NGHIỆP',
        title_en: 'PROFESSIONAL SERVICES',
        title_zh: '专业服务',
        content_vi: 'Chúng tôi cung cấp các giải pháp tổ chức sự kiện trọn gói, từ lên ý tưởng đến thực hiện, đảm bảo sự thành công rực rỡ cho mọi sự kiện.',
        content_en: 'We provide comprehensive event organization solutions, from ideation to execution, ensuring brilliant success for every event.',
        content_zh: '我们提供全方位的活动组织 giải pháp, 从构思到执行, 确保每次活动的辉煌成功。',
        orderIndex: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title_vi: 'ÂM THANH ÁNH SÁNG',
        title_en: 'SOUND AND LIGHTING',
        title_zh: '音响与灯光',
        content_vi: 'Hệ thống âm thanh, ánh sáng hiện đại từ các thương hiệu hàng đầu thế giới, mang lại trải nghiệm đỉnh cao cho khán giả.',
        content_en: 'Modern sound and lighting systems from world-leading brands, bringing the ultimate experience to the audience.',
        content_zh: '来自世界领先品牌的现代音响和灯光系统, 为观众带来极致体验。',
        orderIndex: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title_vi: 'THIẾT BỊ SỰ KIỆN',
        title_en: 'EVENT EQUIPMENT',
        title_zh: '活动 belly',
        content_vi: 'Cho thuê đa dạng thiết bị sự kiện: màn hình LED, sân khấu, nhà bạt, bàn ghế với chất lượng cao và giá cả cạnh tranh.',
        content_en: 'Rental of various event equipment: LED screens, stages, tents, tables and chairs with high quality and competitive prices.',
        content_zh: '租赁各类活动设备：LED屏幕、舞台、帐篷、桌椅, 质量高, 价格具有竞争力。',
        orderIndex: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title_vi: 'ĐỘI NGŨ KỸ THUẬT',
        title_en: 'TECHNICAL TEAM',
        title_zh: '技术团队',
        content_vi: 'Đội ngũ kỹ thuật viên giàu kinh nghiệm, nhiệt tình, luôn sẵn sàng hỗ trợ khách hàng 24/7 để sự kiện diễn ra suôn sẻ.',
        content_en: 'Experienced, enthusiastic technical team, always ready to support customers 24/7 to ensure events run smoothly.',
        content_zh: '经验丰富、热情的技术团队, 随时准备 24/7 为客户提供支持, 确保活动顺利进行。',
        orderIndex: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title_vi: 'Ý TƯỞNG SÁNG TẠO',
        title_en: 'CREATIVE IDEAS',
        title_zh: '创意构思',
        content_vi: 'Không ngừng đổi mới và sáng tạo trong từng chi tiết, tạo nên những dấu ấn riêng biệt và khó quên cho mỗi sự kiện.',
        content_en: 'Constantly innovating and creating in every detail, creating distinct and unforgettable marks for each event.',
        content_zh: '在每个细节上不断创新和创造, 为每个活动打造独特且难忘的印记。',
        orderIndex: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title_vi: 'UY TÍN HÀNG ĐẦU',
        title_en: 'LEADING REPUTATION',
        title_zh: '领先信誉',
        content_vi: 'Với nhiều năm kinh nghiệm trong ngành, Nova Events tự hào là đối tác tin cậy của hàng trăm doanh nghiệp lớn nhỏ.',
        content_en: 'With years of experience in the industry, Nova Events is proud to be a trusted partner of hundreds of businesses.',
        content_zh: '凭借多年的行业经验, Nova Events 为成为数百家企业信赖的合作伙伴而感到自豪。',
        orderIndex: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('highlights', null, {});
  }
};
