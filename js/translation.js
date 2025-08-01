// js/translation.js

const translations = {
    'en': {
        // Page Title
        'page_title': 'H4E Halal Checker - Halal Food Additives Database',
        // Nav
        'nav_distributors': 'Distributors',
        'nav_login': 'Login',
        'nav_home': 'E-Number',
        // Hero
        'hero_title_dark': 'Halal Food Additives Database',
        'hero_subtitle_dark': 'Search, check, and understand the Halal status of the E-Numbers you consume.',
        'hero_title_light': 'Food Additives Database',
        'hero_subtitle_light': 'Search, check, and understand the Halal status of the E-Numbers you consume.',
        'search_placeholder': 'Search by E-number or name...',
        'advanced_search': 'Advanced Search',
        // Filters
        'filter_type': '-- Select Type --',
        'filter_subtype': '-- Select Sub-Type --',
        'filter_all': 'All',
        'filter_halal': 'Halal',
        'filter_mashbooh': 'Mashbooh',
        'filter_haram': 'Haram',
        // Results
        'results_found': (count) => `Found ${count} results`,
        'view_grid': 'Grid',
        'view_list': 'List',
        'view_compact': 'Compact',
        // Card Details
      
        'card_type': 'Type:',
        'card_subtype': 'Sub-Type:',
        'card_origin': 'Origin:',
        'card_distributors': (count) => `Distr: ${count}`,
        'card_readmore': 'Read More',
        // Explanation Section
        'explanation_title': 'Understanding Halal Status',
        'explanation_cert': 'Halal (Certified)',
        'explanation_cert_desc': 'The substance has been inspected and certified by a trusted Islamic organization.',
        'explanation_fatwa': 'Halal (Fatwa)',
        'explanation_fatwa_desc': 'The substance is deemed Halal by religious ruling but has not undergone formal certification.',
        'explanation_mashbooh': 'Mashbooh / Haram',
        'explanation_mashbooh_desc': 'The substance is ambiguous, doubtful, or forbidden. It is best to avoid it.',
        'explanation_unidentified': 'Unidentified',
        'explanation_unidentified_desc': 'The substance has not yet been reviewed or classified.',
        // Footer
        'footer_about_title': 'About H4E Halal Checker',
        'footer_about_desc': 'This project is a demo to showcase the creation of an accessible Halal food additives database for everyone.',
        'footer_contact_title': 'Contact The Halal Science Center Chulalongkorn University',
        'footer_contact_address': '11-12th Fl., Chulalongkorn University Research Building, Phayathai Rd., Pathum Wan, Bangkok 10330',
        'footer_copyright': 'Copyrights ©2022 The Halal Science Center. All Right Reserved.'
    },
    'th': {
        // Page Title
        'page_title': 'H4E Halal Checker - ฐานข้อมูลวัตถุเจือปนอาหารฮาลาล',
        // Nav
        'nav_distributors': 'ผู้จัดจำหน่าย',
        'nav_login': 'เข้าสู่ระบบ',
        'nav_home': 'E-Number',
        // Hero
        'hero_title_dark': 'ฐานข้อมูลฮาลาลสำหรับวัตถุเจือปนอาหาร',
        'hero_subtitle_dark': 'ค้นหา ตรวจสอบ และทำความเข้าใจสถานะฮาลาลของส่วนผสม (E-Numbers) ที่คุณบริโภค',
        'hero_title_light': 'ฐานข้อมูลวัตถุเจือปนอาหาร',
        'hero_subtitle_light': 'ค้นหา ตรวจสอบ และทำความเข้าใจสถานะฮาลาลของส่วนผสม (E-Numbers) ที่คุณบริโภค',
        'search_placeholder': 'ค้นหาด้วย E-number หรือชื่อวัตถุเจือปน...',
        'advanced_search': 'ค้นหาขั้นสูง',
        // Filters
        'filter_type': '-- เลือกประเภท --',
        'filter_subtype': '-- เลือกประเภทย่อย --',
        'filter_all': 'ทั้งหมด',
        'filter_halal': 'ฮาลาล',
        'filter_mashbooh': 'มัชบูฮ์',
        'filter_haram': 'ฮารอม',
        // Results
        'results_found': (count) => `พบผลลัพธ์ทั้งหมด ${count} รายการ`,
        'view_grid': 'ตาราง',
        'view_list': 'รายการ',
        'view_compact': 'ย่อ',
        // Card Details
         'card_type': 'ประเภท:',
        'card_subtype': 'ประเภทย่อย:',
        'card_origin': 'แหล่งที่มา:',
        'card_distributors': (count) => `ผู้จัดจำหน่าย: ${count}`,
        'card_readmore': 'อ่านเพิ่มเติม',
        // Explanation Section
        'explanation_title': 'ทำความเข้าใจสถานะฮาลาล',
        'explanation_cert': 'ฮาลาล (รับรอง)',
        'explanation_cert_desc': 'วัตถุที่ผ่านการตรวจสอบและรับรองจากองค์กรศาสนาอิสลามที่เชื่อถือได้',
        'explanation_fatwa': 'ฮาลาล (ฟัตวา)',
        'explanation_fatwa_desc': 'วัตถุที่ถูกวินิจฉัยตามหลักศาสนาว่าฮาลาล แต่ยังไม่ผ่านการรับรองอย่างเป็นทางการ',
        'explanation_mashbooh': 'มัชบูฮ์ / ฮารอม',
        'explanation_mashbooh_desc': 'วัตถุที่ยังมีความคลุมเครือ, น่าสงสัย หรือต้องห้ามตามหลักศาสนา ควรหลีกเลี่ยง',
        'explanation_unidentified': 'ไม่ระบุ',
        'explanation_unidentified_desc': 'วัตถุที่ยังไม่ได้รับการตรวจสอบหรือจำแนกสถานะ',
        // Footer
        'footer_about_title': 'เกี่ยวกับ H4E Halal Checker',
        'footer_about_desc': 'โครงการนี้เป็น Demo เพื่อสาธิตการสร้างฐานข้อมูลวัตถุเจือปนอาหารฮาลาลที่เข้าถึงง่ายสำหรับทุกคน',
        'footer_contact_title': 'ติดต่อ ศูนย์วิทยาศาสตร์ฮาลาล จุฬาลงกรณ์มหาวิทยาลัย',
        'footer_contact_address': 'ชั้น 11-12 อาคารวิจัยจุฬาฯ ถนนพญาไท ปทุมวัน กรุงเทพฯ 10330',
        'footer_copyright': '© 2025 H4E Halal Checker Demo. สงวนลิขสิทธิ์.'
    }
};