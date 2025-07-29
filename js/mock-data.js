// js/mock-data.js

const eNumbersData = [
    { id: "E100", name: "Curcumin", status: "halal-cert", type: "Food Color", subType: "Yellow and Orange Colors", usedBy: [1, 4, 7], description: "สารสกัดสีเหลืองจากขมิ้นชัน นิยมใช้ในผลิตภัณฑ์อาหารหลากหลายชนิด เช่น แกง, เครื่องดื่ม, และขนม" },
    // --- STATUS CHANGE ---
    { id: "E101", name: "Riboflavin", status: "haram", type: "Food Color", subType: "Yellow and Orange Colors", usedBy: [2, 3, 8], description: "หรือที่รู้จักในชื่อวิตามินบี 2 เป็นสารให้สีเหลืองที่พบได้ตามธรรมชาติในอาหารหลายชนิด" },
    // --- STATUS CHANGE ---
    { id: "E120", name: "Cochineal, Carminic acid", status: "haram", type: "Food Color", subType: "Red Colors", usedBy: [3, 7], description: "สีแดงที่สกัดจากแมลงโคชินีล สถานะฮาลาลขึ้นอยู่กับการตีความทางศาสนาของแต่ละองค์กร" },
    { id: "E141", name: "Chlorophylls", status: "halal-cert", type: "Food Color", subType: "Green Colors", usedBy: [1, 4, 8], description: "สารให้สีเขียวที่สกัดได้จากพืช เป็นสารที่เกิดขึ้นตามธรรมชาติในกระบวนการสังเคราะห์ด้วยแสง" },
    { id: "E150a", name: "Plain caramel", status: "halal-fatwa", type: "Food Color", subType: "Brown and Black Colors", usedBy: [2, 3, 9], description: "สีคาราเมลที่เกิดจากการให้ความร้อนกับน้ำตาล มักใช้ในเครื่องดื่มโคล่าและผลิตภัณฑ์เบเกอรี่" },
    { id: "E160a", name: "Carotenes", status: "halal-cert", type: "Food Color", subType: "Yellow and Orange Colors", usedBy: [1, 6, 8], description: "กลุ่มสารสีที่พบในแครอทและพืชสีส้มเหลืองอื่นๆ เป็นแหล่งของวิตามินเอ" },
    { id: "E171", name: "Titanium dioxide", status: "mashbooh", type: "Food Color", subType: "Surface Colorants", usedBy: [4, 10], description: "สารให้สีขาวทึบแสง ทำให้ผลิตภัณฑ์ดูขาวสว่างขึ้น บางประเทศเริ่มจำกัดการใช้งาน" },
    // --- STATUS CHANGE ---
    { id: "E200", name: "Sorbic acid", status: "unidentified", type: "Preservative", subType: "Sorbates", usedBy: [2, 4, 10], description: "สารกันบูดที่ช่วยยับยั้งการเจริญเติบโตของเชื้อราและยีสต์ในอาหาร" },
    { id: "E211", name: "Sodium benzoate", status: "halal-cert", type: "Preservative", subType: "Benzoates", usedBy: [2, 3, 9], description: "เกลือของกรดเบนโซอิก ใช้เป็นสารกันบูดในอาหารและเครื่องดื่มที่เป็นกรด" },
    { id: "E250", name: "Sodium nitrite", status: "mashbooh", type: "Preservative", subType: "Nitrites", usedBy: [6, 9], description: "ใช้ในการถนอมอาหารประเภทเนื้อสัตว์ เช่น ไส้กรอกและแฮม เพื่อรักษาสีและป้องกันเชื้อโรค" },
    // --- STATUS CHANGE ---
    { id: "E300", name: "Ascorbic acid (Vitamin C)", status: "unidentified", type: "Antioxidant", subType: "Ascorbates", usedBy: [1, 2, 4, 8], description: "วิตามินซี ใช้เป็นสารต้านอนุมูลอิสระเพื่อป้องกันการเสื่อมสภาพของอาหาร" },
    { id: "E322", name: "Lecithins", status: "mashbooh", type: "Emulsifier", subType: "Lecithins", usedBy: [1, 5, 8, 10], description: "สารที่ช่วยให้น้ำกับน้ำมันเข้ากัน แหล่งที่มาอาจเป็นพืช (เช่น ถั่วเหลือง) หรือสัตว์" },
    { id: "E330", name: "Citric acid", status: "halal-cert", type: "Acidity Regulator", subType: "Citric Acid and Citrates", usedBy: [1, 2, 3, 4, 7], description: "กรดซิตริกหรือกรดมะนาว ใช้ปรับความเป็นกรดและเพิ่มรสเปรี้ยวในอาหาร" },
    { id: "E407", name: "Carrageenan", status: "halal-fatwa", type: "Thickener, Stabiliser", subType: "Natural Gums", usedBy: [5, 6], description: "สารสกัดจากสาหร่ายทะเลสีแดง ใช้ทำให้อาหารข้นและคงตัว เช่น ในนมและไอศกรีม" },
     // --- STATUS CHANGE ---
    { id: "E415", name: "Xanthan gum", status: "haram", type: "Thickener, Stabiliser", subType: "Natural Gums", usedBy: [1, 5, 10], description: "ผลิตจากการหมักของแบคทีเรีย ใช้เป็นสารให้ความข้นหนืดในซอสและน้ำสลัด" },
    { id: "E422", name: "Glycerol", status: "mashbooh", type: "Humectant, Sweetener", subType: "Polyols", usedBy: [2, 4, 7], description: "ให้ความชุ่มชื้นและรสหวาน แหล่งที่มาอาจเป็นไขมันพืชหรือสัตว์ จึงต้องตรวจสอบ" },
    { id: "E440", name: "Pectins", status: "halal-fatwa", type: "Gelling Agent", subType: "Natural Gums", usedBy: [1, 6], description: "สกัดจากพืชตระกูลส้ม ใช้ทำแยมและเยลลี่ให้เกิดเป็นเจล" },
    { id: "E621", name: "Monosodium glutamate (MSG)", status: "halal-fatwa", type: "Flavour Enhancer", subType: "Glutamates", usedBy: [7, 9], description: "ผงชูรส ใช้เพื่อเพิ่มรสชาติ 'อูมามิ' ในอาหารแปรรูปต่างๆ" },
    { id: "E951", name: "Aspartame", status: "mashbooh", type: "Artificial Sweetener", subType: "Dipeptide-based", usedBy: [2, 3, 10], description: "สารให้ความหวานแทนน้ำตาล มีความหวานสูงแต่ให้พลังงานต่ำ" },
    // --- STATUS CHANGE ---
    { id: "E967", name: "Xylitol", status: "haram", type: "Artificial Sweetener", subType: "Polyols", usedBy: [2, 8], description: "สารให้ความหวานที่สกัดจากพืช มักใช้ในหมากฝรั่งและผลิตภัณฑ์ดูแลช่องปาก" },
    { id: "E999", name: "Quillaja extract", status: "unidentified", type: "Emulsifier", subType: "Saponins", usedBy: [11, 12], description: "สารสกัดจากเปลือกต้นสบู่ ใช้เป็นสารที่ทำให้เกิดฟองในเครื่องดื่ม" },
];


const distributorsData = [
    { id: 1, name: "บริษัท ไทยฟู้ดเทค จำกัด", logo: "https://via.placeholder.com/150/27ae60/ffffff?text=TFT", location: { country: 'Thailand', province: 'กรุงเทพฯ' }, phone: "02-111-1111", email: "contact@thaifoodtech.co.th", description: "ผู้นำด้านวัตถุเจือปนอาหารสำหรับอุตสาหกรรมขนมอบ" },
    { id: 2, name: "สยาม อะโกร อินกรีเดียนท์", logo: "https://via.placeholder.com/150/2980b9/ffffff?text=SAI", location: { country: 'Thailand', province: 'สมุทรปราการ' }, phone: "02-222-2222", email: "info@siamagro.com", description: "เชี่ยวชาญด้านสารให้ความหวานและสารกันบูด" },
    { id: 3, name: "บริษัท เบฟเวอเรจ โซลูชั่นส์", logo: "https://via.placeholder.com/150/c0392b/ffffff?text=BVS", location: { country: 'Thailand', province: 'ชลบุรี' }, phone: "038-333-333", email: "sales@bevsolutions.co.th", description: "จำหน่ายสีผสมอาหารและสารปรุงแต่งกลิ่นสำหรับเครื่องดื่ม" },
    { id: 4, name: "เคมีภัณฑ์อาหารไทย", logo: "https://via.placeholder.com/150/f39c12/ffffff?text=TFC", location: { country: 'Thailand', province: 'กรุงเทพฯ' }, phone: "02-444-4444", email: "support@thaifoodchem.com", description: "จำหน่ายสารเคมีเกรดอาหารทุกชนิด" },
    { id: 5, name: "บริษัท เอเชียสตาร์ช จำกัด", logo: "https://via.placeholder.com/150/8e44ad/ffffff?text=ASC", location: { country: 'Thailand', province: 'นครราชสีมา' }, phone: "044-555-555", email: "contact@asiastarch.co.th", description: "ผู้ผลิตและจำหน่ายแป้งดัดแปร (Modified Starch)" },
    { id: 6, name: "มาลีฟู้ดโปรเซสซิ่ง", logo: "https://via.placeholder.com/150/16a085/ffffff?text=MFP", location: { country: 'Thailand', province: 'เชียงใหม่' }, phone: "053-666-666", email: "info@maleefood.com", description: "จัดหาสารคงตัวและอิมัลซิไฟเออร์สำหรับอาหารกระป๋อง" },
    { id: 7, name: "โอเรียนทัล เฟลเวอร์", logo: "https://via.placeholder.com/150/d35400/ffffff?text=OF", location: { country: 'Thailand', province: 'กรุงเทพฯ' }, phone: "02-777-7777", email: "flavor@oriental.co.th", description: "ผู้สร้างสรรค์กลิ่นและรสชาติสำหรับอาหารและเครื่องดื่ม" },
    { id: 8, name: "แพลนท์เบสท์ อินกรีเดียนท์", logo: "https://via.placeholder.com/150/2c3e50/ffffff?text=PBI", location: { country: 'Thailand', province: 'นนทบุรี' }, phone: "02-888-8888", email: "sales@plantbased.co.th", description: "ส่วนผสมสำหรับผลิตภัณฑ์อาหารจากพืช" },
    { id: 9, name: "ซีซั่นนิ่ง แอนด์ สไปซ์", logo: "https://via.placeholder.com/150/7f8c8d/ffffff?text=S&S", location: { country: 'Thailand', province: 'สมุทรสาคร' }, phone: "034-999-999", email: "info@seasoningspice.com", description: "เครื่องปรุงและเครื่องเทศสำหรับอุตสาหกรรมอาหาร" },
    { id: 10, name: "บิ๊ก เคมิคอล กรุ๊ป", logo: "https://via.placeholder.com/150/34495e/ffffff?text=BCG", location: { country: 'Thailand', province: 'ระยอง' }, phone: "038-101-010", email: "contact@bigchem.co.th", description: "ผู้นำเข้าและจำหน่ายวัตถุเจือปนอาหารรายใหญ่" },
    { id: 11, name: "Global Ingredients Inc.", logo: "https://via.placeholder.com/150/9b59b6/ffffff?text=GII", location: { country: 'USA', province: null }, phone: "+1-555-1234", email: "contact@globaling.com", description: "International supplier of specialty food additives." },
    { id: 12, name: "EuroChem Solutions", logo: "https://via.placeholder.com/150/3498db/ffffff?text=ECS", location: { country: 'Germany', province: null }, phone: "+49-30-555-5678", email: "info@eurochem.de", description: "Leading European chemical distributor for the food industry." }
];