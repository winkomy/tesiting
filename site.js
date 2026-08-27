(function () {
  "use strict";

  const LOGO = "index_html_files/winko-logo-header-approved.png";
  const HEADER_LOGO = LOGO;
  const WHATSAPP = "https://wa.me/60105161368";
  const PHONE = "+603-8727 7540";
  const EMAIL = "sales@winko.my";
  const ADDRESS = "No. 19, Kawasan Perindustrian Mega 2, Jln Mega 2/1, 43500 Semenyih, Selangor, Malaysia";
  const APPROVAL_LOGOS = {
    sirim: { src: "index_html_files/sirim-approval-logo.png", width: 584, height: 716 },
    span: { src: "index_html_files/span-approval-logo.png", width: 600, height: 600 }
  };
  const LANGUAGE_KEY = "winko-language";
  const SITE_ORIGIN = "https://www.winko.my";
  const SITE_LOGO = `${SITE_ORIGIN}/${LOGO}`;
  const PAGE_SHARE_IMAGES = { home: "index_html_files/opengraph.webp", about: "index_html_files/about-winko-photo-1.png", products: "index_html_files/269.png", services: "index_html_files/511.webp", projects: "index_html_files/1046.webp", news: "index_html_files/singapore-factory-visit-2026.png", newsArticle: "index_html_files/singapore-factory-visit-2026.png", contact: "index_html_files/opengraph.webp" };
  const I18N = window.WINKO_I18N || { languages: ["en"], text: { en: {} }, meta: {}, threeD: {} };
  const sourceTextNodes = new WeakMap();
  const sourceAttributes = new WeakMap();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.WINKO_3D_TEXT = I18N.threeD.en;

  const products = {
    hdg: {
      name: "HDG Panel Tank", eyebrow: "Hot-dipped galvanised pressed steel", image: "index_html_files/269.png", href: "HDG Panel Tank.html",
      description: "Durable, corrosion-resistant panel tank for large-scale building and industrial water storage.",
      detail: "The HDG Panel Tank is built from pressed mild steel panels with a hot-dipped galvanised finish. It is suitable for projects that need strength, modular installation, and practical long-term corrosion protection.",
      facts: [["Compliance", "SS22:1979 or SANS 10329:2020"], ["Material", "Mild steel to BS 4360:1972 Grade 43A or ISO equivalent"], ["Finish", "Hot-dipped galvanised coating to EN ISO 1461"]],
      bullets: ["Hot-dipped galvanised steel panel construction", "Strong modular design for large-capacity storage", "Suitable for elevated or ground-level tank installation", "Good corrosion protection compared with ordinary painted steel"],
      applications: ["Large-scale building water storage", "Industrial water storage", "Elevated or ground-level tank installation"]
    },
    hdpe: {
      name: "HDG Panel Tank + HDPE Lining", eyebrow: "Galvanised panels with protective liner", image: "index_html_files/270.png", href: "HDG Panel Tank + HDPE Lining.html",
      description: "A reinforced panel tank system combining galvanised steel strength with additional internal HDPE protection.",
      detail: "This system uses a galvanised steel panel structure with an internal HDPE lining. It is suitable when the project requires steel strength but also needs an internal protective barrier to reduce direct water contact with the steel surface.",
      facts: [["Structure", "Hot-dipped galvanised pressed mild steel panels"], ["Internal lining", "HDPE protective barrier"], ["Design note", "Final specification follows project drawings and compatibility requirements"]],
      bullets: ["HDG panel tank external structure", "Internal HDPE lining for extra protection", "Useful for leakage-control and corrosion-sensitive projects", "Suitable as an upgrade from standard bolted steel tanks"],
      applications: ["Leakage-control projects", "Corrosion-sensitive projects", "Upgrades from standard bolted steel tanks"]
    },
    stainless: {
      name: "Stainless Steel Panel Tank", eyebrow: "Clean, durable, corrosion-resistant storage", image: "index_html_files/668.webp", href: "Stainless Steel Panel Tank.html",
      description: "Premium corrosion-resistant panel tank for clean, long-life water storage applications.",
      detail: "The Stainless Steel Panel Tank is designed for clients who need better material quality, cleaner appearance, and stronger long-term corrosion resistance than standard mild steel tanks. It is suitable for high-demand commercial, industrial, and clean-water projects.",
      facts: [["Compliance", "SANS 10328:2020"], ["Material", "SUS304 or SUS316 stainless steel"], ["Panel design", "Hydraulically pressed modular panels"]],
      bullets: ["SUS304 or SUS316 stainless steel construction", "Excellent corrosion resistance", "Hydraulically pressed modular panel design", "Premium finish and clean appearance"],
      applications: ["High-demand commercial water storage", "Industrial water storage", "Clean-water projects"]
    },
    painted: {
      name: "Painted Steel Panel Tank", eyebrow: "Practical painted steel storage", image: "index_html_files/272.png", href: "Painted Steel Panel Tank.html",
      description: "Affordable and sturdy steel tank with protective paint coating for practical water storage applications.",
      detail: "The Painted Steel Panel Tank is a cost-effective pressed steel water storage system. It is suitable for projects that require strength and affordability, especially fire protection systems such as sprinkler tanks and hose reel tanks.",
      facts: [["Compliance", "SS22:1979 or SANS 10329:2020"], ["Material", "Mild steel to BS 4360:1972 Grade 43A or ISO equivalent"], ["Finish", "Non-toxic primer and black bituminous paint"]],
      bullets: ["Pressed mild steel panel construction", "Protective paint coating", "Cost-effective alternative to HDG or stainless steel", "Suitable for fire protection and general water storage"],
      applications: ["Fire protection systems", "Sprinkler tanks", "Hose reel tanks", "General water storage"]
    },
    frp: {
      name: "FRP Panel Tank", eyebrow: "Lightweight composite panel storage", image: "index_html_files/273.png", href: "FRP Panel Tank.html",
      description: "Lightweight, corrosion-resistant modular panel tank for specialized and project-based water storage.",
      detail: "The FRP Panel Tank is manufactured using Glass Fiber Reinforced Plastic panels. It is suitable for projects that require non-metallic material, corrosion resistance, modular installation, and documented technical compliance.",
      facts: [["Standards", "MS 1390:2010 and SS 245:2014"], ["Material", "Glass Fiber Reinforced Plastic (GFRP)"], ["Approval", "SPAN/BPAO/200-10/7/A/W-6"]],
      bullets: ["Glass Fiber Reinforced Plastic panel construction", "Lightweight compared with steel tanks", "Strong corrosion resistance", "Modular design for custom tank sizing"],
      applications: ["Non-metallic material requirements", "Corrosion-sensitive environments", "Modular project-based installations"]
    },
    pe: {
      name: "Polyethylene (PE) Tank", eyebrow: "Lightweight polyethylene storage", image: "index_html_files/880.webp", href: "Polyethylene.html",
      description: "Lightweight, cost-effective, and easy-to-install tank for residential, commercial, and light industrial water storage.",
      detail: "The Polyethylene Tank is a practical option for customers who need affordable water storage with fast installation. The POLYSTOR range uses rotational moulding technology for water and selected chemical storage requirements.",
      facts: [["Product family", "POLYSTOR polyethylene tank"], ["Material", "Food-grade polyethylene"], ["Capacity range", "Approximately 230 to 45,000 litres"]],
      bullets: ["Food-grade polyethylene material", "One-piece seamless construction", "Lightweight and easy to handle", "No painting or corrosion-protection coating required"],
      applications: ["Residential water storage", "Commercial water storage", "Light industrial water storage", "Selected chemical storage requirements"]
    },
    frpOne: {
      name: "FRP One-Piece Tank", eyebrow: "One-piece composite storage", image: "index_html_files/875.webp", href: "FRP One-Piece Tank.html",
      description: "Seamless FRP storage tank designed to reduce leakage points and provide durable water or selected chemical storage.",
      detail: "The FRP One-Piece Tank is suitable where customers want a rust-free, seamless tank body with fewer joints than sectional tanks. G-Cistern positions its closed-top tank as a dual-process fabricated one-piece FRP water tank.",
      facts: [["Product series", "G-Cistern FRP one-piece tank"], ["Fabrication", "Dual-process fabrication"], ["Protection", "External UV coating"]],
      bullets: ["Seamless one-piece FRP construction", "Rust-free and non-toxic material positioning", "Reduced leakage risk compared with sectional tanks", "Closed-top, open-top, and selected chemical storage designs"],
      applications: ["Water storage", "Selected chemical storage", "Closed-top or open-top tank requirements"]
    },
    hdpeTank: {
      name: "HDPE Tank", eyebrow: "High-density polyethylene storage", image: "index_html_files/hdpe-tank-reference.png", href: "HDPE Tank.html",
      description: "Strong, corrosion-resistant non-metallic tank for industrial, chemical, and heavy-duty storage conditions.",
      detail: "The HDPE Tank is a heavier-duty non-metallic option where chemical resistance, corrosion resistance, and industrial durability are important. Final suitability must be confirmed based on the stored liquid, concentration, temperature, and project design.",
      facts: [["Material", "High-density polyethylene (HDPE)"], ["Tank type", "Heavy-duty non-metallic tank"], ["Design requirement", "Chemical compatibility review before quotation or supply"]],
      bullets: ["High-density polyethylene material", "Good resistance to corrosion and rust", "Suitable for selected chemical and process storage applications", "Can be customized with project-specific nozzles and fittings"],
      applications: ["Industrial storage", "Selected chemical and process storage", "Heavy-duty storage conditions"]
    }
  };
  const copy = (en, ms, zh) => ({ en, ms, zh });
  const originalProductDetails = {
    hdg: {
      eyebrow: copy("Hot-Dipped Galvanised Pressed Steel Panel Water Tank", "Tangki Air Panel Keluli Tekan Galvani Celup Panas", "热浸镀锌压制钢板水箱"),
      description: copy("Durable, corrosion-resistant panel tank for large-scale building and industrial water storage.", "Tangki panel tahan lama dan tahan kakisan untuk penyimpanan air bangunan berskala besar dan industri.", "耐用抗腐蚀的板式水箱，适用于大型建筑及工业储水。"),
      overview: copy("The HDG Panel Tank is built from pressed mild steel panels with a hot-dipped galvanised finish. It is suitable for projects that need strength, modular installation, and practical long-term corrosion protection.", "Tangki Panel HDG dibina daripada panel keluli lembut tekan dengan kemasan galvani celup panas. Ia sesuai untuk projek yang memerlukan kekuatan, pemasangan modular dan perlindungan kakisan jangka panjang.", "HDG 镀锌钢板水箱采用压制低碳钢板与热浸镀锌表面处理，适合需要强度、模块化安装及长期防腐的项目。"),
      features: [copy("Hot-dipped galvanised steel panel construction", "Pembinaan panel keluli galvani celup panas", "热浸镀锌钢板结构"), copy("Strong modular design for large-capacity storage", "Reka bentuk modular kukuh untuk penyimpanan kapasiti besar", "适用于大容量储存的坚固模块化设计"), copy("Suitable for elevated or ground-level tank installation", "Sesuai untuk pemasangan tangki bertingkat atau aras tanah", "适用于架高或地面水箱安装"), copy("Good corrosion protection compared with ordinary painted steel", "Perlindungan kakisan yang baik berbanding keluli bercat biasa", "相比普通涂漆钢板具更佳防腐性能"), copy("Can be supplied with standard tank accessories and connection points", "Boleh dibekalkan dengan aksesori tangki dan titik sambungan standard", "可配备标准水箱配件及连接点")],
      applications: [copy("Commercial buildings and factories", "Bangunan komersial dan kilang", "商业建筑与工厂"), copy("Apartments, schools, and institutions", "Pangsapuri, sekolah dan institusi", "公寓、学校及机构"), copy("Industrial water storage", "Penyimpanan air industri", "工业储水"), copy("Fire protection water storage", "Penyimpanan air perlindungan kebakaran", "消防储水"), copy("General building water supply systems", "Sistem bekalan air bangunan am", "一般建筑供水系统")],
      specs: [[copy("Tank compliance", "Pematuhan tangki", "水箱标准"), copy("SS22:1979 or SANS 10329:2020", "SS22:1979 atau SANS 10329:2020", "SS22:1979 或 SANS 10329:2020")], [copy("Material", "Bahan", "材质"), copy("Mild steel conforming to BS 4360:1972 Grade 43A or ISO equivalent", "Keluli lembut mematuhi BS 4360:1972 Gred 43A atau setara ISO", "符合 BS 4360:1972 Grade 43A 或 ISO 等效标准的低碳钢")], [copy("Coating finish", "Kemasan salutan", "涂层表面"), copy("Hot-dipped galvanised coating conforming to EN ISO 1461", "Salutan galvani celup panas mematuhi EN ISO 1461", "符合 EN ISO 1461 的热浸镀锌涂层")], [copy("Panel / flange design", "Reka bentuk panel / bebibir", "板材 / 法兰设计"), copy("Hydraulically pressed plates with combined double flanges at 45 degree or 90 degree to the plate face", "Plat tekan hidraulik dengan bebibir berkembar gabungan pada 45 darjah atau 90 darjah kepada muka plat", "液压压制板材，带组合式双法兰，法兰与板面呈 45 度或 90 度")], [copy("Bolt holes", "Lubang bolt", "螺栓孔"), copy("2.0 mm bolt-hole clearance; minimum M14 bolt diameter", "Kelegaan lubang bolt 2.0 mm; diameter bolt minimum M14", "螺栓孔间隙 2.0 mm；最小螺栓直径 M14")], [copy("Internal reinforcement", "Pengukuhan dalaman", "内部加强"), copy("Diagonal stays bracing or horizontal tie rods bracing", "Pendakap stay pepenjuru atau pendakap rod pengikat mendatar", "对角撑杆或水平拉杆加强")], [copy("Jointing materials", "Bahan penyambungan", "接缝材料"), copy("Non-toxic, odourless PVC foam sealant and butyl sealant", "Pengedap buih PVC tidak toksik dan tidak berbau serta pengedap butil", "无毒无味 PVC 泡沫密封胶及丁基密封胶")], [copy("Tank cover", "Penutup tangki", "水箱顶盖"), copy("Hydraulic pressed cover supported by trusses; 600 x 600 mm square manhole; 50 mm or 100 mm ABS air vent per compartment", "Penutup tekan hidraulik disokong kekuda; lurang segi empat 600 x 600 mm; vent ABS 50 mm atau 100 mm bagi setiap ruang", "液压压制顶盖由桁架支撑；600 x 600 mm 方形人孔；每个隔间配备 50 mm 或 100 mm ABS 通气口")], [copy("Access ladder", "Tangga akses", "检修梯"), copy("Mild steel ladder provided for tank height 1.5 m and above", "Tangga keluli lembut disediakan untuk ketinggian tangki 1.5 m dan ke atas", "水箱高度达到 1.5 m 及以上时配备低碳钢梯")], [copy("Water level indicator", "Penunjuk paras air", "水位指示器"), copy("Mechanical pulley type or PVC float ball type", "Jenis takal mekanikal atau jenis bebola apungan PVC", "机械滑轮式或 PVC 浮球式")], [copy("Standard thickness", "Ketebalan standard", "标准厚度"), copy("Based on SS22:1979: roof 1.5 mm; base / wall panels commonly 5.0-6.0 mm depending on tank height", "Berdasarkan SS22:1979: bumbung 1.5 mm; panel dasar / dinding lazimnya 5.0-6.0 mm bergantung pada ketinggian tangki", "依据 SS22:1979：顶盖 1.5 mm；底板 / 墙板通常为 5.0-6.0 mm，视水箱高度而定")]],
      positioning: copy("Use this page to position the HDG Panel Tank as a strong, practical, project-ready steel tank for clients who need value and durability.", "Gunakan halaman ini untuk meletakkan Tangki Panel HDG sebagai tangki keluli yang kukuh, praktikal dan sedia untuk projek bagi pelanggan yang memerlukan nilai serta ketahanan.", "本页将 HDG 镀锌钢板水箱定位为坚固、实用且适合项目使用的钢制水箱，满足客户对性价比与耐用性的需求。")
    },
    hdpe: {
      eyebrow: copy("Bolted Steel Panel Tank with Internal HDPE Lining", "Tangki Panel Keluli Berbolt dengan Lapisan Dalaman HDPE", "带 HDPE 内衬的螺栓钢板水箱"),
      description: copy("A reinforced panel tank system combining galvanised steel strength with additional internal HDPE protection.", "Sistem tangki panel diperkuat yang menggabungkan kekuatan keluli galvani dengan perlindungan dalaman HDPE.", "加强型板式水箱系统，结合镀锌钢强度与 HDPE 内部防护。"),
      overview: copy("This system uses a galvanised steel panel structure with an internal HDPE lining. It is suitable when the project requires steel strength but also needs an internal protective barrier to reduce direct water contact with the steel surface.", "Sistem ini menggunakan struktur panel keluli galvani dengan lapisan dalaman HDPE. Ia sesuai apabila projek memerlukan kekuatan keluli serta penghalang dalaman untuk mengurangkan sentuhan air terus dengan permukaan keluli.", "该系统采用镀锌钢板结构与 HDPE 内衬，适合既需要钢结构强度，又需内部防护层以减少水体直接接触钢面的项目。"),
      features: [copy("HDG panel tank external structure", "Struktur luar tangki panel HDG", "HDG 板式水箱外部结构"), copy("Internal HDPE lining for extra protection", "Lapisan dalaman HDPE untuk perlindungan tambahan", "HDPE 内衬提供额外防护"), copy("Useful for leakage-control and corrosion-sensitive projects", "Sesuai untuk projek kawalan kebocoran dan sensitif kakisan", "适用于防漏及腐蚀敏感项目"), copy("Suitable as an upgrade from standard bolted steel tanks", "Sesuai sebagai naik taraf daripada tangki keluli berbolt standard", "适合作为标准螺栓钢板水箱的升级方案"), copy("Can be customized to project drawings and connection requirements", "Boleh disesuaikan mengikut lukisan projek dan keperluan sambungan", "可按项目图纸及连接要求定制")],
      applications: [copy("Bolted steel tank applications", "Aplikasi tangki keluli berbolt", "螺栓钢板水箱应用"), copy("Sprinkler tank systems", "Sistem tangki sprinkler", "喷淋水箱系统"), copy("Hose reel tank systems", "Sistem tangki gelung hos", "消防软管卷盘水箱系统"), copy("Industrial water storage", "Penyimpanan air industri", "工业储水"), copy("Tank refurbishment or lining upgrade works", "Kerja baik pulih atau naik taraf lapisan tangki", "水箱翻新或内衬升级工程")],
      specs: [[copy("Tank structure", "Struktur tangki", "水箱结构"), copy("Hot-dipped galvanised pressed mild steel panel tank", "Tangki panel keluli lembut tekan galvani celup panas", "热浸镀锌压制低碳钢板水箱")], [copy("Internal lining", "Lapisan dalaman", "内部内衬"), copy("HDPE lining as protective internal barrier", "Lapisan HDPE sebagai penghalang dalaman pelindung", "HDPE 内衬作为内部防护层")], [copy("External coating", "Salutan luaran", "外部涂层"), copy("HDG coating typically conforming to EN ISO 1461 when supplied under HDG pressed steel specification", "Salutan HDG lazimnya mematuhi EN ISO 1461 apabila dibekalkan di bawah spesifikasi keluli tekan HDG", "按 HDG 压制钢板规格供货时，HDG 涂层通常符合 EN ISO 1461")], [copy("Panel / flange design", "Reka bentuk panel / bebibir", "板材 / 法兰设计"), copy("Hydraulically pressed plates with double flange arrangement, subject to project design", "Plat tekan hidraulik dengan susunan bebibir berkembar, tertakluk kepada reka bentuk projek", "液压压制板材，带双法兰布置，具体以项目设计为准")], [copy("Bolting", "Pemboltan", "螺栓连接"), copy("Bolted panel tank system; bolt grade / diameter to follow tank design and supplier specification", "Sistem tangki panel berbolt; gred / diameter bolt mengikut reka bentuk tangki dan spesifikasi pembekal", "螺栓板式水箱系统；螺栓等级 / 直径按水箱设计及供应商规格执行")], [copy("Jointing / sealing", "Penyambungan / pengedapan", "接缝 / 密封"), copy("Sealant, lining detail, overlaps, and termination points to be confirmed based on final tank drawings", "Pengedap, butiran lapisan, pertindihan dan titik penamatan perlu disahkan berdasarkan lukisan tangki akhir", "密封胶、内衬细节、搭接及收口位置须根据最终水箱图纸确认")], [copy("Accessories", "Aksesori", "配件"), copy("May include access ladder, manhole, air vent, drain / scour, overflow, inlet / outlet connections, water level indicator, and internal / external reinforcement", "Boleh merangkumi tangga akses, lurang, vent udara, saliran / scour, limpahan, sambungan masuk / keluar, penunjuk paras air serta pengukuhan dalaman / luaran", "可包括检修梯、人孔、通气口、排水 / 冲洗口、溢流口、进 / 出水连接、水位指示器及内部 / 外部加强件")], [copy("Design note", "Nota reka bentuk", "设计说明"), copy("Final specification should be confirmed against project drawings, lining method statement, and water / chemical compatibility requirements", "Spesifikasi akhir hendaklah disahkan berdasarkan lukisan projek, kaedah pemasangan lapisan dan keperluan keserasian air / bahan kimia", "最终规格须结合项目图纸、内衬施工方案及水体 / 化学品兼容性要求确认")]],
      positioning: copy("Use this page as an upsell from standard HDG tanks where the buyer is concerned about internal corrosion, leakage protection, or longer service performance.", "Gunakan halaman ini sebagai naik taraf daripada tangki HDG standard apabila pembeli mengambil berat tentang kakisan dalaman, perlindungan kebocoran atau prestasi perkhidmatan yang lebih panjang.", "当客户关注内部腐蚀、防漏保护或更长使用性能时，本页可作为标准 HDG 水箱的升级方案说明。")
    },
    stainless: {
      eyebrow: copy("SUS304 / SUS316 Stainless Steel Panel Water Tank", "Tangki Air Panel Keluli Tahan Karat SUS304 / SUS316", "SUS304 / SUS316 不锈钢板水箱"),
      description: copy("Premium corrosion-resistant panel tank for clean, long-life water storage applications.", "Tangki panel premium tahan kakisan untuk aplikasi penyimpanan air bersih jangka panjang.", "优质抗腐蚀板式水箱，适合洁净、长寿命储水。"),
      overview: copy("The Stainless Steel Panel Tank is designed for clients who need better material quality, cleaner appearance, and stronger long-term corrosion resistance than standard mild steel tanks. It is suitable for high-demand commercial, industrial, and clean-water projects.", "Tangki Panel Keluli Tahan Karat direka untuk pelanggan yang memerlukan mutu bahan lebih baik, penampilan lebih bersih dan ketahanan kakisan jangka panjang. Sesuai untuk projek komersial, industri dan air bersih berkeperluan tinggi.", "不锈钢板水箱适合重视材料品质、洁净外观及长期抗腐蚀性能的客户，适用于高需求商业、工业及清洁用水项目。"),
      features: [copy("SUS304 or SUS316 stainless steel construction", "Pembinaan keluli tahan karat SUS304 atau SUS316", "SUS304 或 SUS316 不锈钢结构"), copy("Excellent corrosion resistance", "Ketahanan kakisan yang sangat baik", "优异抗腐蚀性能"), copy("Hydraulically pressed modular panel design", "Reka bentuk panel modular tekan hidraulik", "液压压制模块化板材设计"), copy("Premium finish and clean appearance", "Kemasan premium dan penampilan bersih", "优质表面与洁净外观"), copy("Suitable for demanding water storage applications", "Sesuai untuk aplikasi penyimpanan air berkeperluan tinggi", "适用于高需求储水应用")],
      applications: [copy("Hospitals and healthcare facilities", "Hospital dan kemudahan penjagaan kesihatan", "医院及医疗设施"), copy("Food-related facilities", "Kemudahan berkaitan makanan", "食品相关设施"), copy("Commercial buildings and factories", "Bangunan komersial dan kilang", "商业建筑与工厂"), copy("Premium residential developments", "Pembangunan kediaman premium", "高端住宅项目"), copy("Clean water storage systems", "Sistem penyimpanan air bersih", "清洁水储存系统")],
      specs: [[copy("Tank compliance", "Pematuhan tangki", "水箱标准"), copy("SANS 10328:2020", "SANS 10328:2020", "SANS 10328:2020")], [copy("Material", "Bahan", "材质"), copy("SUS304 or SUS316 stainless steel", "Keluli tahan karat SUS304 atau SUS316", "SUS304 或 SUS316 不锈钢")], [copy("Panel / flange design", "Reka bentuk panel / bebibir", "板材 / 法兰设计"), copy("Hydraulically pressed plates with combined double flanges at 45 degree or 90 degree to the plate face", "Plat tekan hidraulik dengan bebibir berkembar gabungan pada 45 darjah atau 90 darjah kepada muka plat", "液压压制板材，带组合式双法兰，法兰与板面呈 45 度或 90 度")], [copy("Bolt holes", "Lubang bolt", "螺栓孔"), copy("1.5 mm bolt-hole clearance; minimum M12 bolt diameter", "Kelegaan lubang bolt 1.5 mm; diameter bolt minimum M12", "螺栓孔间隙 1.5 mm；最小螺栓直径 M12")], [copy("Internal reinforcement", "Pengukuhan dalaman", "内部加强"), copy("Diagonal stays bracing or horizontal tie rods bracing", "Pendakap stay pepenjuru atau pendakap rod pengikat mendatar", "对角撑杆或水平拉杆加强")], [copy("Bolts, nuts & washers", "Bolt, nat & washer", "螺栓、螺母及垫圈"), copy("BS EN ISO 4190 or equivalent when necessary; material SUS304 or SUS316", "BS EN ISO 4190 atau setara apabila perlu; bahan SUS304 atau SUS316", "必要时采用 BS EN ISO 4190 或等效标准；材质为 SUS304 或 SUS316")], [copy("Jointing materials", "Bahan penyambungan", "接缝材料"), copy("Non-toxic, odourless PVC foam sealant and butyl sealant", "Pengedap buih PVC tidak toksik dan tidak berbau serta pengedap butil", "无毒无味 PVC 泡沫密封胶及丁基密封胶")], [copy("Tank cover", "Penutup tangki", "水箱顶盖"), copy("Hydraulic pressed cover supported by trusses; 600 x 600 mm square manhole; 50 mm or 100 mm ABS air vent per compartment", "Penutup tekan hidraulik disokong kekuda; lurang segi empat 600 x 600 mm; vent ABS 50 mm atau 100 mm bagi setiap ruang", "液压压制顶盖由桁架支撑；600 x 600 mm 方形人孔；每个隔间配备 50 mm 或 100 mm ABS 通气口")], [copy("Access ladder", "Tangga akses", "检修梯"), copy("SUS304 or SUS316 ladder provided for tank height 1.5 m and above", "Tangga SUS304 atau SUS316 disediakan untuk ketinggian tangki 1.5 m dan ke atas", "水箱高度达到 1.5 m 及以上时配备 SUS304 或 SUS316 梯")], [copy("Water level indicator", "Penunjuk paras air", "水位指示器"), copy("Mechanical pulley type or PVC float ball type", "Jenis takal mekanikal atau jenis bebola apungan PVC", "机械滑轮式或 PVC 浮球式")]],
      positioning: copy("Use this page to position stainless steel as the premium choice where hygiene perception, corrosion resistance, and service life are more important than lowest initial cost.", "Gunakan halaman ini untuk meletakkan keluli tahan karat sebagai pilihan premium apabila persepsi kebersihan, ketahanan kakisan dan hayat perkhidmatan lebih penting daripada kos awal terendah.", "当卫生观感、抗腐蚀性及使用寿命比最低初始成本更重要时，本页将不锈钢定位为优质选择。")
    },
    painted: {
      eyebrow: copy("Painted Pressed Steel Panel Water Tank", "Tangki Air Panel Keluli Tekan Bercat", "涂漆压制钢板水箱"),
      description: copy("Affordable and sturdy steel tank with protective paint coating for practical water storage applications.", "Tangki keluli kukuh dan mampu milik dengan salutan cat pelindung untuk penyimpanan air praktikal.", "经济坚固的钢制水箱，配有防护涂层，适合实用储水。"),
      overview: copy("The Painted Steel Panel Tank is a cost-effective pressed steel water storage system. It is suitable for projects that require strength and affordability, especially fire protection systems such as sprinkler tanks and hose reel tanks.", "Tangki Panel Keluli Bercat ialah sistem penyimpanan air keluli tekan yang menjimatkan kos. Ia sesuai untuk projek yang memerlukan kekuatan dan kemampuan, khususnya sistem perlindungan kebakaran seperti tangki sprinkler dan gelung hos.", "涂漆钢板水箱是具成本效益的压制钢板储水系统，适合兼顾强度与预算的项目，尤其适用于喷淋和消防软管卷盘等消防系统。"),
      features: [copy("Pressed mild steel panel construction", "Pembinaan panel keluli lembut tekan", "压制低碳钢板结构"), copy("Protective paint coating", "Salutan cat pelindung", "防护涂层"), copy("Cost-effective alternative to HDG or stainless steel", "Alternatif menjimatkan kos kepada HDG atau keluli tahan karat", "HDG 或不锈钢的经济替代方案"), copy("Modular panel design for site assembly", "Reka bentuk panel modular untuk pemasangan di tapak", "适合现场组装的模块化板材设计"), copy("Suitable for fire protection and general water storage", "Sesuai untuk perlindungan kebakaran dan penyimpanan air am", "适用于消防及一般储水")],
      applications: [copy("Sprinkler tanks", "Tangki sprinkler", "喷淋水箱"), copy("Hose reel tanks", "Tangki gelung hos", "消防软管卷盘水箱"), copy("Fire protection water storage", "Penyimpanan air perlindungan kebakaran", "消防储水"), copy("Industrial and commercial water storage", "Penyimpanan air industri dan komersial", "工业及商业储水"), copy("Budget-focused projects", "Projek berfokuskan bajet", "注重预算的项目")],
      specs: [[copy("Tank compliance", "Pematuhan tangki", "水箱标准"), copy("SS22:1979 or SANS 10329:2020", "SS22:1979 atau SANS 10329:2020", "SS22:1979 或 SANS 10329:2020")], [copy("Material", "Bahan", "材质"), copy("Mild steel conforming to BS 4360:1972 Grade 43A or ISO equivalent", "Keluli lembut mematuhi BS 4360:1972 Gred 43A atau setara ISO", "符合 BS 4360:1972 Grade 43A 或 ISO 等效标准的低碳钢")], [copy("Coating finish", "Kemasan salutan", "涂层表面"), copy("One coat non-toxic primer and one coat black bituminous paint", "Satu lapisan primer tidak toksik dan satu lapisan cat bitumen hitam", "一层无毒底漆及一层黑色沥青漆")], [copy("Panel / flange design", "Reka bentuk panel / bebibir", "板材 / 法兰设计"), copy("Hydraulically pressed plates with combined double flanges at 45 degree or 90 degree to the plate face", "Plat tekan hidraulik dengan bebibir berkembar gabungan pada 45 darjah atau 90 darjah kepada muka plat", "液压压制板材，带组合式双法兰，法兰与板面呈 45 度或 90 度")], [copy("Bolt holes", "Lubang bolt", "螺栓孔"), copy("2.0 mm bolt-hole clearance; minimum M14 bolt diameter", "Kelegaan lubang bolt 2.0 mm; diameter bolt minimum M14", "螺栓孔间隙 2.0 mm；最小螺栓直径 M14")], [copy("Internal reinforcement", "Pengukuhan dalaman", "内部加强"), copy("Diagonal stays bracing or horizontal tie rods bracing", "Pendakap stay pepenjuru atau pendakap rod pengikat mendatar", "对角撑杆或水平拉杆加强")], [copy("Jointing materials", "Bahan penyambungan", "接缝材料"), copy("Non-toxic, odourless PVC foam sealant and butyl sealant", "Pengedap buih PVC tidak toksik dan tidak berbau serta pengedap butil", "无毒无味 PVC 泡沫密封胶及丁基密封胶")], [copy("Tank cover", "Penutup tangki", "水箱顶盖"), copy("Hydraulic pressed cover supported by trusses; 600 x 600 mm square manhole; 50 mm or 100 mm ABS air vent per compartment", "Penutup tekan hidraulik disokong kekuda; lurang segi empat 600 x 600 mm; vent ABS 50 mm atau 100 mm bagi setiap ruang", "液压压制顶盖由桁架支撑；600 x 600 mm 方形人孔；每个隔间配备 50 mm 或 100 mm ABS 通气口")], [copy("Access ladder", "Tangga akses", "检修梯"), copy("Mild steel ladder provided for tank height 1.5 m and above", "Tangga keluli lembut disediakan untuk ketinggian tangki 1.5 m dan ke atas", "水箱高度达到 1.5 m 及以上时配备低碳钢梯")], [copy("Water level indicator", "Penunjuk paras air", "水位指示器"), copy("Mechanical pulley type or PVC float ball type", "Jenis takal mekanikal atau jenis bebola apungan PVC", "机械滑轮式或 PVC 浮球式")]],
      positioning: copy("Use this page for customers who want a strong tank at a lower price point, especially for non-potable or fire protection storage where painted steel is acceptable.", "Gunakan halaman ini untuk pelanggan yang mahukan tangki kukuh pada harga lebih rendah, khususnya penyimpanan bukan minuman atau perlindungan kebakaran apabila keluli bercat boleh digunakan.", "本页适合希望以较低价格获得坚固水箱的客户，尤其适用于可接受涂漆钢板的非饮用水或消防储水。")
    },
    frp: {
      eyebrow: copy("Glass Fiber Reinforced Plastic Panel Water Tank", "Tangki Air Panel Plastik Bertetulang Gentian Kaca", "玻璃纤维增强塑料板水箱"),
      description: copy("Lightweight, corrosion-resistant modular panel tank for specialized and project-based water storage.", "Tangki panel modular ringan dan tahan kakisan untuk penyimpanan air khusus serta berasaskan projek.", "轻质抗腐蚀模块化板式水箱，适用于专业及项目型储水。"),
      overview: copy("The FRP Panel Tank is manufactured using Glass Fiber Reinforced Plastic panels. It is suitable for projects that require non-metallic material, corrosion resistance, modular installation, and documented technical compliance.", "Tangki Panel FRP dihasilkan menggunakan panel Plastik Bertetulang Gentian Kaca. Ia sesuai untuk projek yang memerlukan bahan bukan logam, ketahanan kakisan, pemasangan modular dan pematuhan teknikal terdokumen.", "FRP 玻璃钢板水箱采用玻璃纤维增强塑料板制造，适用于要求非金属材料、抗腐蚀、模块化安装及技术合规文件的项目。"),
      features: [copy("Glass Fiber Reinforced Plastic panel construction", "Pembinaan panel Plastik Bertetulang Gentian Kaca", "玻璃纤维增强塑料板结构"), copy("Lightweight compared with steel tanks", "Lebih ringan berbanding tangki keluli", "比钢制水箱更轻"), copy("Strong corrosion resistance", "Ketahanan kakisan yang kuat", "良好抗腐蚀性能"), copy("Modular design for custom tank sizing", "Reka bentuk modular untuk saiz tangki tersuai", "模块化设计便于定制尺寸"), copy("Suitable for technical submissions and project / tender applications", "Sesuai untuk penyerahan teknikal dan permohonan projek / tender", "适合技术提交及项目 / 招标申请")],
      applications: [copy("Commercial and industrial water storage", "Penyimpanan air komersial dan industri", "商业及工业储水"), copy("Corrosion-prone environments", "Persekitaran terdedah kepada kakisan", "易腐蚀环境"), copy("Rooftop or elevated tank systems", "Sistem tangki atas bumbung atau bertingkat", "屋顶或架高水箱系统"), copy("Non-metallic tank requirements", "Keperluan tangki bukan logam", "非金属水箱需求"), copy("Specialized project tanks", "Tangki projek khusus", "专业项目水箱")],
      specs: [[copy("Manufacturer / brand", "Pengilang / jenama", "制造商 / 品牌"), copy("G-FRP Industries Sdn Bhd / G-FRP", "G-FRP Industries Sdn Bhd / G-FRP", "G-FRP Industries Sdn Bhd / G-FRP")], [copy("Standard compliance", "Pematuhan standard", "标准符合性"), copy("MS 1390:2010 and SS 245:2014", "MS 1390:2010 dan SS 245:2014", "MS 1390:2010 及 SS 245:2014")], [copy("Authority approval", "Kelulusan pihak berkuasa", "主管机构批准"), copy("SPAN approval stated in technical report: SPAN/BPAO/200-10/7/A/W-6", "Kelulusan SPAN dinyatakan dalam laporan teknikal: SPAN/BPAO/200-10/7/A/W-6", "技术报告列明 SPAN 批准：SPAN/BPAO/200-10/7/A/W-6")], [copy("Manufacturing method", "Kaedah pembuatan", "制造工艺"), copy("Sheet Moulding Compound (SMC) machine hot press", "Mesin hot press Sheet Moulding Compound (SMC)", "片状模塑料（SMC）机器热压")], [copy("Panel colour", "Warna panel", "板材颜色"), copy("Grey colour", "Warna kelabu", "灰色")], [copy("Material", "Bahan", "材质"), copy("Glass Fiber Reinforced Plastic (GFRP)", "Plastik Bertetulang Gentian Kaca (GFRP)", "玻璃纤维增强塑料（GFRP）")], [copy("Flanges", "Bebibir", "法兰"), copy("FRP flanges; standard options include ANSI 150, Table E, PN16, and JIS 10K", "Bebibir FRP; pilihan standard termasuk ANSI 150, Table E, PN16 dan JIS 10K", "FRP 法兰；标准选项包括 ANSI 150、Table E、PN16 及 JIS 10K")], [copy("Water level indicator", "Penunjuk paras air", "水位指示器"), copy("MS mechanical type, painted; as per tank height", "Jenis mekanikal MS, bercat; mengikut ketinggian tangki", "MS 机械式，涂漆；按水箱高度配置")], [copy("Manhole", "Lurang", "人孔"), copy("Standard FRP manhole, 600 mm x 600 mm", "Lurang FRP standard, 600 mm x 600 mm", "标准 FRP 人孔，600 mm x 600 mm")], [copy("Air vent", "Vent udara", "通气口"), copy("PVC air vent with mosquito net; accessory table states PVC diameter 50 mm", "Vent udara PVC dengan jaring nyamuk; jadual aksesori menyatakan diameter PVC 50 mm", "PVC 通气口带防虫网；配件表列明 PVC 直径 50 mm")], [copy("Ladders", "Tangga", "梯子"), copy("Internal stainless steel ladder and external HDG ladder; accessory table states 300 mm width", "Tangga keluli tahan karat dalaman dan tangga HDG luaran; jadual aksesori menyatakan lebar 300 mm", "内部不锈钢梯及外部 HDG 梯；配件表列明宽度 300 mm")], [copy("Bolts & bracing", "Bolt & pendakap", "螺栓与加强"), copy("External bolts HDG M10; internal bolts SS304 M10; internal bracing SS304 M10; tie rod SS304", "Bolt luaran HDG M10; bolt dalaman SS304 M10; pendakap dalaman SS304 M10; rod pengikat SS304", "外部螺栓 HDG M10；内部螺栓 SS304 M10；内部加强 SS304 M10；拉杆 SS304")], [copy("Support / base", "Sokongan / asas", "支撑 / 底座"), copy("HDG hollow external post / support; skid base HDG hollow section with cross-girded type", "Tiang / sokongan luaran berongga HDG; asas skid bahagian berongga HDG jenis berpalang silang", "HDG 空心外部立柱 / 支撑；HDG 空心型钢交叉梁式滑撬底座")], [copy("Sealant", "Pengedap", "密封胶"), copy("Rubber sealant; accessory table includes EPDM or EVA soft rubber, 55 mm width depending on standard", "Pengedap getah; jadual aksesori merangkumi getah lembut EPDM atau EVA, lebar 55 mm bergantung pada standard", "橡胶密封胶；配件表包括 EPDM 或 EVA 软橡胶，宽度 55 mm，视标准而定")]],
      positioning: copy("Use this page for project / tender enquiries where the buyer needs corrosion resistance, modular sizing, and technical documentation.", "Gunakan halaman ini untuk pertanyaan projek / tender apabila pembeli memerlukan ketahanan kakisan, saiz modular dan dokumentasi teknikal.", "当客户需要抗腐蚀、模块化尺寸及技术文件时，本页适合用于项目 / 招标咨询。")
    },
    pe: {
      eyebrow: copy("POLYSTOR Polyethylene Water Tank", "Tangki Air Polietilena POLYSTOR", "POLYSTOR 聚乙烯水箱"),
      description: copy("Lightweight, cost-effective, and easy-to-install tank for residential, commercial, and light industrial water storage.", "Tangki ringan, menjimatkan kos dan mudah dipasang untuk penyimpanan air kediaman, komersial dan industri ringan.", "轻质、经济且易安装，适用于住宅、商业及轻工业储水。"),
      overview: copy("The Polyethylene Tank is a practical option for customers who need affordable water storage with fast installation. The POLYSTOR range uses rotational moulding technology for water and selected chemical storage requirements.", "Tangki Polietilena ialah pilihan praktikal untuk penyimpanan air mampu milik dan pemasangan pantas. Rangkaian POLYSTOR menggunakan teknologi pengacuan putaran untuk air dan bahan kimia terpilih.", "聚乙烯水箱适合需要经济储水与快速安装的客户。POLYSTOR 系列采用滚塑工艺，适用于水及指定化学品储存。"),
      features: [copy("Food-grade polyethylene material", "Bahan polietilena gred makanan", "食品级聚乙烯材料"), copy("One-piece seamless construction", "Pembinaan satu keping tanpa sambungan", "一体无缝结构"), copy("Lightweight and easy to handle", "Ringan dan mudah dikendalikan", "轻质易搬运"), copy("No painting or corrosion-protection coating required", "Tidak memerlukan cat atau salutan perlindungan kakisan", "无需涂漆或防腐涂层"), copy("Good UV resistance", "Ketahanan UV yang baik", "良好抗紫外线性能"), copy("Broad size range for many applications", "Julat saiz luas untuk pelbagai aplikasi", "尺寸范围广，适用于多种应用")],
      applications: [copy("Residential water storage", "Penyimpanan air kediaman", "住宅储水"), copy("Shop and small commercial water storage", "Penyimpanan air kedai dan komersial kecil", "商店及小型商业储水"), copy("Light industrial use", "Kegunaan industri ringan", "轻工业用途"), copy("Backup water supply", "Bekalan air sokongan", "备用供水"), copy("Rainwater collection", "Pengumpulan air hujan", "雨水收集"), copy("Cost-sensitive water storage projects", "Projek penyimpanan air yang sensitif terhadap kos", "注重成本的储水项目")],
      specs: [[copy("Brand / product family", "Jenama / keluarga produk", "品牌 / 产品系列"), copy("POLYSTOR polyethylene tank", "Tangki polietilena POLYSTOR", "POLYSTOR 聚乙烯水箱")], [copy("Material", "Bahan", "材质"), copy("Food-grade polyethylene", "Polietilena gred makanan", "食品级聚乙烯")], [copy("Manufacturing method", "Kaedah pembuatan", "制造工艺"), copy("Rotational moulding technology", "Teknologi pengacuan putaran", "滚塑工艺")], [copy("Capacity range", "Julat kapasiti", "容量范围"), copy("Approx. 230 litres / 50 gallons to 45,000 litres / 10,000 gallons", "Kira-kira 230 liter / 50 gelen hingga 45,000 liter / 10,000 gelen", "约 230 升 / 50 加仑至 45,000 升 / 10,000 加仑")], [copy("Tank forms", "Bentuk tangki", "水箱形状"), copy("Cylindrical, rectangular, square, round tapered, and square tapered models shown in catalogue", "Model silinder, segi empat tepat, segi empat sama, tirus bulat dan tirus segi empat sama ditunjukkan dalam katalog", "目录展示圆柱形、矩形、方形、圆锥形及方锥形型号")], [copy("Construction", "Pembinaan", "结构"), copy("Strong, seamless, one-piece construction for zero-leak operation", "Pembinaan satu keping yang kukuh dan tanpa sambungan untuk operasi tanpa kebocoran", "坚固无缝的一体式结构，实现无泄漏运行")], [copy("Maintenance", "Penyelenggaraan", "维护"), copy("Maintenance-free; no painting or corrosion-protection coating required", "Bebas penyelenggaraan; tidak memerlukan cat atau salutan perlindungan kakisan", "免维护；无需涂漆或防腐涂层")], [copy("UV resistance", "Ketahanan UV", "抗紫外线性能"), copy("Catalogue states excellent UV resistance, with tanks installed more than 20 years throughout Malaysia still functioning well", "Katalog menyatakan ketahanan UV yang sangat baik; tangki yang dipasang lebih 20 tahun di seluruh Malaysia masih berfungsi dengan baik", "目录称其具有优异抗紫外线性能，马来西亚各地安装超过 20 年的水箱仍运作良好")], [copy("Accessories", "Aksesori", "配件"), copy("Optional or model-dependent accessories may include air vent, external ladder, lifting lug, level indicator, and short piece", "Aksesori pilihan atau bergantung pada model mungkin merangkumi vent udara, tangga luaran, lug angkat, penunjuk paras dan short piece", "可选或按型号提供的配件包括通气口、外部梯、吊耳、水位指示器及短管段")], [copy("Premium option", "Pilihan premium", "优质选项"), copy("Double-layer tank with white inner surface for easier water clarity inspection; recommended optional feature for tanks of 5,000 gallons and above", "Tangki dua lapis dengan permukaan dalaman putih untuk pemeriksaan kejernihan air yang lebih mudah; ciri pilihan yang disyorkan untuk tangki 5,000 gelen dan ke atas", "双层水箱带白色内表面，便于检查水质清澈度；建议 5,000 加仑及以上水箱选配")], [copy("Warranty claim in brochure", "Tuntutan waranti dalam brosur", "手册中的保修说明"), copy("10 years indoor warranty and 8 years outdoor warranty", "Waranti dalaman 10 tahun dan waranti luaran 8 tahun", "室内保修 10 年，室外保修 8 年")]],
      positioning: copy("Use this page for fast customer enquiries because the PE tank is easy to understand, affordable, and suitable for common water storage needs.", "Gunakan halaman ini untuk pertanyaan pelanggan dengan pantas kerana tangki PE mudah difahami, mampu milik dan sesuai untuk keperluan penyimpanan air biasa.", "PE 水箱易于理解、经济实惠且适合常见储水需求，本页适合快速客户咨询。")
    },
    frpOne: {
      eyebrow: copy("G-Cistern One-Piece FRP Closed Top / Open Top Tank", "Tangki FRP Satu Keping G-Cistern Bertutup / Terbuka", "G-Cistern FRP 一体式封闭顶 / 开放顶水箱"),
      description: copy("Seamless FRP storage tank designed to reduce leakage points and provide durable water or selected chemical storage.", "Tangki FRP tanpa sambungan yang mengurangkan titik kebocoran untuk penyimpanan air atau bahan kimia terpilih.", "无缝 FRP 水箱可减少泄漏点，适用于耐用储水及指定化学品储存。"),
      overview: copy("The FRP One-Piece Tank is suitable where customers want a rust-free, seamless tank body with fewer joints than sectional tanks. G-Cistern positions its FRP cylindrical closed-top tank as a dual-process fabricated one-piece FRP water tank.", "Tangki FRP Satu Keping sesuai untuk pelanggan yang mahukan badan tangki bebas karat tanpa sambungan dan kurang sendi berbanding tangki seksyen. Tangki bertutup silinder FRP G-Cistern menggunakan fabrikasi dwiproses.", "FRP 一体式水箱适合需要无锈、无缝且接缝少于分体水箱的客户。G-Cistern FRP 圆柱形封闭式水箱采用双工艺制造的一体式 FRP 结构。"),
      features: [copy("Seamless one-piece FRP construction", "Pembinaan FRP satu keping tanpa sambungan", "无缝一体式 FRP 结构"), copy("Rust-free and non-toxic material positioning", "Bahan bebas karat dan tidak toksik", "无锈、无毒材料"), copy("Reduced leakage risk compared with sectional tanks", "Risiko kebocoran lebih rendah berbanding tangki seksyen", "相比分体水箱降低泄漏风险"), copy("Suitable for closed-top, open-top, and selected chemical storage designs", "Sesuai untuk reka bentuk bertutup, terbuka dan penyimpanan bahan kimia terpilih", "适用于封闭式、开放式及指定化学品储存设计"), copy("Can be manufactured in different sizes based on space and capacity", "Boleh dibuat dalam saiz berbeza berdasarkan ruang dan kapasiti", "可按空间及容量制造不同尺寸")],
      applications: [copy("Residential and industrial water storage", "Penyimpanan air kediaman dan industri", "住宅及工业储水"), copy("Outdoor storage tanks", "Tangki penyimpanan luaran", "户外储水箱"), copy("Clean water storage", "Penyimpanan air bersih", "清洁水储存"), copy("Selected chemical storage subject to compatibility", "Penyimpanan bahan kimia terpilih tertakluk kepada keserasian", "在兼容性确认下储存指定化学品"), copy("Projects requiring seamless tank body", "Projek yang memerlukan badan tangki tanpa sambungan", "需要无缝水箱本体的项目")],
      specs: [[copy("Product series", "Siri produk", "产品系列"), copy("G-Cistern FRP cylindrical closed-top one-piece tank; open-top and chemical storage series also shown", "Tangki satu keping silinder FRP bertutup G-Cistern; siri bertutup terbuka dan penyimpanan kimia turut ditunjukkan", "G-Cistern FRP 圆柱形封闭式一体水箱；另有开放式及化学品储存系列")], [copy("Fabrication", "Fabrikasi", "制造"), copy("Dual-process fabrication", "Fabrikasi dwiproses", "双工艺制造")], [copy("Internal surface", "Permukaan dalaman", "内部表面"), copy("Gel sheet process using unsaturated polyester resin, chopped strand mat, and woven roving mat as internal reinforcement, with protective coating", "Proses gel sheet menggunakan resin poliester tidak tepu, chopped strand mat dan woven roving mat sebagai pengukuhan dalaman, dengan salutan pelindung", "凝胶片工艺采用不饱和聚酯树脂、短切毡及方格布作为内部加强，并带防护涂层")], [copy("External surface", "Permukaan luaran", "外部表面"), copy("Filament winding process using unsaturated polyester resin and continuous woven roving as external reinforcement", "Proses filament winding menggunakan resin poliester tidak tepu dan woven roving berterusan sebagai pengukuhan luaran", "纤维缠绕工艺采用不饱和聚酯树脂及连续方格布作为外部加强")], [copy("External bracing", "Pengukuhan luaran", "外部加强"), copy("FRP rib of approximately 75 mm width at every meter from top downwards", "Rusuk FRP kira-kira 75 mm lebar pada setiap meter dari atas ke bawah", "从上至下每隔一米设置约 75 mm 宽的 FRP 加强筋")], [copy("UV protection", "Perlindungan UV", "抗紫外线保护"), copy("External surface completed with UV coating to reduce penetration of UV light and protect fiberglass from weathering", "Permukaan luaran dilengkapkan dengan salutan UV untuk mengurangkan penembusan cahaya UV dan melindungi gentian kaca daripada luluhawa", "外表面采用抗紫外线涂层，减少紫外线穿透并保护玻璃纤维免受风化")], [copy("Accessories", "Aksesori", "配件"), copy("MS painted level indicator, aluminium internal ladder, HDG external ladder, manhole, air vent, pre-laminated FRP overflow / scour / outlet flanges", "Penunjuk paras MS bercat, tangga dalaman aluminium, tangga luaran HDG, lurang, vent udara serta bebibir limpahan / scour / outlet FRP pra-laminasi", "涂漆 MS 水位指示器、铝制内部梯、HDG 外部梯、人孔、通气口及预制层压 FRP 溢流 / 冲洗 / 出水法兰")], [copy("G-Cistern Plus feature", "Ciri G-Cistern Plus", "G-Cistern Plus 特性"), copy("Sloped base below outlet pipe towards scour pipe for easier cleaning and discharge of sediments, sand, and dirt", "Asas condong di bawah paip outlet ke arah paip scour untuk memudahkan pembersihan dan pelepasan mendapan, pasir serta kotoran", "出水管下方底部向冲洗管倾斜，便于清洁并排出沉积物、沙及污物")], [copy("Capacity examples", "Contoh kapasiti", "容量示例"), copy("Catalogue shows closed-top models from G-C220 to G-C2640 and open-top examples including 220, 330, 440, 880, 1320, and 1760 gallons", "Katalog menunjukkan model bertutup dari G-C220 hingga G-C2640 dan contoh terbuka termasuk 220, 330, 440, 880, 1320 dan 1760 gelen", "目录展示 G-C220 至 G-C2640 封闭式型号，以及 220、330、440、880、1320 和 1760 加仑开放式示例")], [copy("Warranty claim in catalogue", "Tuntutan waranti dalam katalog", "目录中的保修说明"), copy("10 years for manufacturing defects and 1 year against leakage for cold water storage, subject to terms", "10 tahun bagi kecacatan pembuatan dan 1 tahun terhadap kebocoran untuk penyimpanan air sejuk, tertakluk kepada terma", "制造缺陷保修 10 年，冷水储存防漏保修 1 年，须遵守相关条款")]],
      positioning: copy("Use this page for clients who want a seamless FRP solution with fewer jointing concerns and a stronger durability story than ordinary sectional tanks.", "Gunakan halaman ini untuk pelanggan yang mahukan penyelesaian FRP tanpa sambungan dengan kurang kebimbangan tentang penyambungan dan ketahanan lebih baik berbanding tangki seksyen biasa.", "本页适合需要无缝 FRP 方案、减少接缝顾虑并希望比普通分体水箱更耐用的客户。")
    },
    hdpeTank: {
      eyebrow: copy("High-Density Polyethylene Industrial Tank", "Tangki Industri Polietilena Berketumpatan Tinggi", "高密度聚乙烯工业水箱"),
      description: copy("Strong, corrosion-resistant non-metallic tank for industrial, chemical, and heavy-duty storage conditions.", "Tangki bukan logam yang kuat dan tahan kakisan untuk keadaan penyimpanan industri, kimia dan tugas berat.", "坚固抗腐蚀的非金属水箱，适用于工业、化学品及重型储存条件。"),
      overview: copy("The HDPE Tank is best positioned as a heavier-duty non-metallic tank option where chemical resistance, corrosion resistance, and industrial durability are important. Final suitability must be confirmed based on the stored liquid, concentration, temperature, and project design.", "Tangki HDPE ialah pilihan bukan logam tugas berat apabila ketahanan kimia, kakisan dan industri adalah penting. Kesesuaian akhir mesti disahkan berdasarkan cecair, kepekatan, suhu dan reka bentuk projek.", "HDPE 水箱是重型非金属方案，适用于重视耐化学性、抗腐蚀及工业耐用性的场合。最终适用性须根据储存液体、浓度、温度及项目设计确认。"),
      features: [copy("High-density polyethylene material", "Bahan polietilena berketumpatan tinggi", "高密度聚乙烯材料"), copy("Good resistance to corrosion and rust", "Ketahanan baik terhadap kakisan dan karat", "良好抗腐蚀防锈性能"), copy("Suitable for selected chemical and process storage applications", "Sesuai untuk aplikasi penyimpanan kimia dan proses terpilih", "适用于指定化学品及工艺储存"), copy("Practical for industrial environments", "Praktikal untuk persekitaran industri", "适合工业环境"), copy("Can be customized with project-specific nozzles and fittings", "Boleh disesuaikan dengan muncung dan kelengkapan khusus projek", "可配置项目专用接口与配件")],
      applications: [copy("Industrial chemical storage", "Penyimpanan bahan kimia industri", "工业化学品储存"), copy("Process water storage", "Penyimpanan air proses", "工艺水储存"), copy("Wastewater or treatment plant applications", "Aplikasi air buangan atau loji rawatan", "废水或处理厂应用"), copy("Sprinkler tank and hose reel tank applications where specified", "Aplikasi tangki sprinkler dan tangki gelung hos apabila ditetapkan", "在指定情况下用于喷淋及消防软管卷盘水箱"), copy("Factories and production facilities", "Kilang dan kemudahan pengeluaran", "工厂及生产设施")],
      specs: [[copy("Material", "Bahan", "材质"), copy("High-density polyethylene (HDPE)", "Polietilena berketumpatan tinggi (HDPE)", "高密度聚乙烯（HDPE）")], [copy("Tank type", "Jenis tangki", "水箱类型"), copy("Heavy-duty non-metallic tank; configuration subject to project requirement", "Tangki bukan logam tugas berat; konfigurasi tertakluk kepada keperluan projek", "重型非金属水箱；配置以项目要求为准")], [copy("Corrosion resistance", "Ketahanan kakisan", "抗腐蚀性能"), copy("Rust-free material suitable for corrosion-sensitive environments", "Bahan bebas karat sesuai untuk persekitaran sensitif kakisan", "无锈材料，适用于腐蚀敏感环境")], [copy("Chemical suitability", "Kesesuaian kimia", "化学品适用性"), copy("Must be confirmed by chemical compatibility review before quotation or supply", "Mesti disahkan melalui semakan keserasian kimia sebelum sebut harga atau bekalan", "报价或供货前须进行化学兼容性评估")], [copy("Connection options", "Pilihan sambungan", "连接选项"), copy("Inlet, outlet, overflow, drain / scour, vent, inspection opening, and flange / nozzle positions to follow project drawing", "Kedudukan inlet, outlet, limpahan, drain / scour, vent, bukaan pemeriksaan dan bebibir / muncung mengikut lukisan projek", "进水口、出水口、溢流口、排水 / 冲洗口、通气口、检查口及法兰 / 接口位置按项目图纸执行")], [copy("Accessories", "Aksesori", "配件"), copy("May include manhole, air vent, ladder, level indicator, flange connections, and support / base frame depending on tank design", "Boleh merangkumi lurang, vent udara, tangga, penunjuk paras, sambungan bebibir serta rangka sokongan / asas bergantung pada reka bentuk tangki", "可包括人孔、通气口、梯子、水位指示器、法兰连接及支撑 / 底座框架，视水箱设计而定")], [copy("Design inputs required", "Input reka bentuk diperlukan", "所需设计输入"), copy("Capacity, stored liquid, concentration, temperature, installation location, pipe load, access requirements, and operation conditions", "Kapasiti, cecair tersimpan, kepekatan, suhu, lokasi pemasangan, beban paip, keperluan akses dan keadaan operasi", "容量、储存液体、浓度、温度、安装位置、管道荷载、检修要求及运行条件")], [copy("Important note", "Nota penting", "重要说明"), copy("Do not mix this page with standard PE water tank copy; HDPE should be presented as industrial / heavy-duty and chemical-resistant", "Jangan campurkan halaman ini dengan kandungan tangki PE standard; HDPE hendaklah dipersembahkan sebagai tangki industri / tugas berat dan tahan bahan kimia", "不要将本页与标准 PE 水箱内容混用；HDPE 应定位为工业 / 重型及耐化学品水箱")]],
      positioning: copy("Use this page for industrial enquiries and customers who need a non-metallic tank with stronger chemical-resistance positioning.", "Gunakan halaman ini untuk pertanyaan industri dan pelanggan yang memerlukan tangki bukan logam dengan penekanan ketahanan kimia yang lebih tinggi.", "本页适合工业咨询及需要更强耐化学性定位的非金属水箱客户。")
    }
  };
  Object.entries(originalProductDetails).forEach(([key, detail]) => { products[key].detailContent = detail; });
  window.WINKO_PRODUCTS = products;

  // Keep project photo order explicit. The source repository has no machine-readable
  // project metadata, so specifications are intentionally not inferred from imagery.
  const projectGroups = [
    { id: "vaggali-private-resort", title: "VAGGALI PRIVATE RESORT, MALDIVES", images: ["958.webp", "959.webp", "960.webp"] },
    { id: "tnb-warehouse", title: "TNB WAREHOUSE, JASIN MELAKA", images: ["961.webp"] },
    { id: "factory-nilai", title: "FACTORY AT NILAI, NEGERI SEMBILAN", images: ["962.webp"] },
    { id: "kpdn-nilai", title: "KOMPLEKS PENYIMPANAN BAHAGIAN PENGUATKUASA KPDN NILAI, ABM MALAYSIAN INDUSTRIAL PARK, NILAI, N. SEMBILAN", images: ["963.webp"] },
    { id: "bukit-tagar", title: "KILANG SAWIT BUKIT TAGAR (PROSPER), BATANG BERJUNTAI", images: ["1046.webp", "1047.webp", "1048.webp", "1049.webp", "1050.webp"] },
    { id: "kerteh", title: "KILANG SAWIT KERTEH, TERENGGANU", images: ["1051.webp", "1052.webp", "1053.webp", "1054.webp", "1055.webp"] }
  ];
  window.WINKO_PROJECTS = projectGroups;

  // Existing resource links remain intact. The dated factory-visit story is the
  // only verified news item currently available for editorial treatment.
  const newsItems = [
    { id: "singapore-client-factory-visit-2026", category: "company", label: "COMPANY UPDATE", date: "2026-08-04", displayDate: "04 AUG 2026", title: "Singapore Client Factory Visit", excerpt: "Welcoming our Singapore client to WINKO for a factory tour, technical discussion and closer look at our water tank manufacturing capabilities.", image: "index_html_files/singapore-factory-visit-2026.png", alt: "WINKO factory visit with Singapore client reviewing water tank manufacturing facilities", href: "news/singapore-client-factory-visit-2026.html", cta: "READ STORY", featured: true },
    { id: "product-range", category: "products", label: "PRODUCT GUIDE", title: "Explore WINKO water storage products", excerpt: "Review all eight WINKO products and compare materials, construction, and applications.", image: "index_html_files/963.webp", alt: "WINKO pressed panel detail", href: "products.html", cta: "EXPLORE PRODUCTS", resourceTitle: "Products", resourceSummary: "Review all eight WINKO products and compare materials, construction and applications.", resourceCta: "EXPLORE PRODUCTS", resourceHref: "products.html" },
    { id: "tank-services", category: "services", label: "SERVICE GUIDE", title: "Water tank maintenance & services", excerpt: "Find support for maintenance, repair and refurbishment, cleaning, and consultation.", image: "index_html_files/511.webp", alt: "WINKO tank service work", href: "services.html", cta: "VIEW SERVICES", resourceTitle: "Services", resourceSummary: "Maintenance, repair and refurbishment, cleaning and consultation.", resourceCta: "VIEW SERVICES", resourceHref: "services.html" },
    { id: "project-gallery", category: "projects", label: "PROJECT", title: "WINKO project gallery", excerpt: "Explore successful installations and completed projects from the WINKO gallery.", image: "index_html_files/1046.webp", alt: "WINKO water storage project", href: "project.html", cta: "VIEW PROJECTS", resourceTitle: "Projects", resourceSummary: "Explore successful installations and completed WINKO projects.", resourceCta: "VIEW PROJECTS", resourceHref: "project.html" },
    { id: "hdg-guide", category: "technical", label: "TECHNICAL GUIDE", title: "HDG Panel Tank", excerpt: "Durable, corrosion-resistant panel tank for large-scale building and industrial water storage.", image: "index_html_files/269.png", alt: "WINKO HDG Panel Tank installation", href: "HDG Panel Tank.html", cta: "VIEW PRODUCT GUIDE", resourceTitle: "Technical resources", resourceSummary: "Technical product information from the existing WINKO range.", resourceCta: "VIEW PRODUCT GUIDE", resourceHref: "HDG Panel Tank.html" }
  ];
  window.WINKO_NEWS = newsItems;
  const IMAGE_SIZES = { "index_html_files/269.png": [372, 248], "index_html_files/270.png": [374, 249], "index_html_files/668.webp": [372, 248], "index_html_files/272.png": [372, 248], "index_html_files/273.png": [372, 248], "index_html_files/880.webp": [374, 249], "index_html_files/875.webp": [372, 248], "index_html_files/hdpe-tank-reference.png": [335, 219], "index_html_files/511.webp": [373, 249], "index_html_files/963.webp": [384, 288], "index_html_files/1046.webp": [384, 288], "index_html_files/singapore-factory-visit-2026.png": [1242, 1242] };
  const imageAttributes = (path) => { const dimensions = IMAGE_SIZES[path]; return dimensions ? `width="${dimensions[0]}" height="${dimensions[1]}"` : ""; };

  function headerTemplate() {
    return `<a class="skip-link" href="#main-content">Skip to content</a>
      <header class="site-header" data-site-header>
        <div class="container header-inner">
          <a class="logo-link" href="index.html" aria-label="WINKO home"><img class="site-logo" src="${HEADER_LOGO}" width="126" height="62" alt="WINKO"></a>
          <nav class="desktop-nav" aria-label="Primary navigation">
            <a data-nav="home" href="index.html">Home</a>
            <a data-nav="about" href="about.html">About Us</a>
            <details class="nav-dropdown"><summary>Products</summary><div class="nav-dropdown-panel">
              <a href="products.html">All products</a>${Object.values(products).map((product) => `<a href="${product.href}">${product.name}</a>`).join("")}
            </div></details>
            <a data-nav="services" href="services.html">Services</a>
            <a data-nav="projects" href="project.html">Projects</a>
            <a data-nav="news" href="news.html">News</a>
            <a data-nav="contact" href="contact.html">Contact</a>
          </nav>
          <div class="header-actions"><details class="language-dropdown site-language--desktop"><summary class="language-current" data-language-summary aria-label="Language">EN</summary><div class="site-language language-dropdown-panel" role="group" aria-label="LANGUAGE"><button type="button" data-site-language="en">EN</button><button type="button" data-site-language="ms">BM</button><button type="button" data-site-language="zh" aria-label="Chinese, Simplified (China)" title="Chinese, Simplified (China)">CN</button></div></details><a class="header-phone" href="tel:+60387277540">${PHONE}</a><a class="button button--primary button--small" href="contact.html">Get free quotation <span aria-hidden="true">↗</span></a><button class="nav-toggle" type="button" aria-label="Open navigation" aria-controls="mobile-navigation" aria-expanded="false"><span></span></button></div>
        </div>
        <div class="mobile-panel" id="mobile-navigation" aria-label="Mobile navigation" aria-hidden="true"><div class="container mobile-panel-inner">
          <a data-nav="home" href="index.html">Home</a><a data-nav="about" href="about.html">About Us</a><a data-nav="products" href="products.html">Products</a><a data-nav="services" href="services.html">Services</a><a data-nav="projects" href="project.html">Projects</a><a data-nav="news" href="news.html">News</a><a data-nav="contact" href="contact.html">Contact</a><div class="mobile-language"><details><summary class="mobile-language-summary"><span>LANGUAGE</span><span class="language-current" data-language-summary>EN</span></summary><div class="site-language" role="group" aria-label="LANGUAGE"><button type="button" data-site-language="en">English</button><button type="button" data-site-language="ms">Bahasa Melayu</button><button type="button" data-site-language="zh" aria-label="Chinese, Simplified (China)" title="Chinese, Simplified (China)">CN</button></div></details></div><a href="contact.html" class="button button--primary button--wide">GET FREE QUOTATION <span aria-hidden="true">↗</span></a>
        </div></div>
      </header>`;
  }

  function footerTemplate() {
    return `<footer class="site-footer"><div class="container footer-main">
      <div class="footer-brand"><a class="footer-wordmark" href="index.html" aria-label="WINKO home"><img class="site-logo" src="${LOGO}" width="126" height="62" alt="WINKO"></a><p>Reliable. Durable. Sustainable.</p></div>
      <div class="footer-col"><h3>Explore</h3><a href="about.html">About Us</a><a href="products.html">Products</a><a href="services.html">Services</a><a href="project.html">Projects</a><a href="news.html">News</a></div>
      <div class="footer-col"><h3>Contact</h3><a href="contact.html">GET FREE QUOTATION</a><a href="tel:+60387277540">${PHONE}</a><a href="mailto:${EMAIL}">${EMAIL}</a><a href="${WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a></div>
      <div class="footer-contact"><h3>Jutarama Industries (M) Sdn Bhd</h3><p>${ADDRESS}</p>${footerApprovalBlock()}</div>
    </div><div class="container footer-bottom"><span>© 2026 Jutarama Industries (M) Sdn Bhd 200601030104(749861-V). All rights reserved.</span><span>Reliable. Durable. Sustainable.</span></div></footer>`;
  }

  function footerApprovalBlock() {
    if (!APPROVAL_LOGOS?.sirim || !APPROVAL_LOGOS?.span) return "<!-- TODO: Insert verified official SIRIM and SPAN logo assets here when supplied by WINKO. -->";
    return `<div class="footer-approvals"><span class="footer-approvals-label">Certifications &amp; Approvals</span><div class="footer-approval-logos"><img src="${APPROVAL_LOGOS.sirim.src}" width="${APPROVAL_LOGOS.sirim.width}" height="${APPROVAL_LOGOS.sirim.height}" loading="lazy" decoding="async" alt="SIRIM certification logo"><img src="${APPROVAL_LOGOS.span.src}" width="${APPROVAL_LOGOS.span.width}" height="${APPROVAL_LOGOS.span.height}" loading="lazy" decoding="async" alt="SPAN approval logo"></div></div>`;
  }

  function renderShell() {
    const headerTarget = document.querySelector("[data-site-header]");
    if (headerTarget) headerTarget.outerHTML = headerTemplate();
    const footerTarget = document.querySelector("[data-site-footer]");
    if (footerTarget) footerTarget.outerHTML = footerTemplate();
  }

  function setupNavigation() {
    const header = document.querySelector(".site-header"), toggle = document.querySelector(".nav-toggle"), panel = document.querySelector(".mobile-panel");
    if (!header || !toggle || !panel) return;
    const page = document.body.dataset.page || "";
    document.querySelector(".nav-dropdown")?.classList.toggle("is-active", page === "products");
    document.querySelectorAll("[data-nav]").forEach((link) => link.classList.toggle("is-active", link.dataset.nav === page));
    const closeMenu = () => { toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", translate("Open navigation")); panel.classList.remove("is-open"); panel.setAttribute("aria-hidden", "true"); document.body.classList.remove("is-menu-open"); };
    const openMenu = () => { toggle.setAttribute("aria-expanded", "true"); toggle.setAttribute("aria-label", translate("Close navigation")); panel.classList.add("is-open"); panel.setAttribute("aria-hidden", "false"); document.body.classList.add("is-menu-open"); panel.querySelector("a")?.focus(); };
    toggle.addEventListener("click", () => toggle.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu());
    panel.addEventListener("click", (event) => { if (event.target.closest("a")) closeMenu(); });
    document.addEventListener("click", (event) => { if (panel.classList.contains("is-open") && !header.contains(event.target)) closeMenu(); });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && panel.classList.contains("is-open")) { closeMenu(); toggle.focus(); }
      if (event.key === "Tab" && panel.classList.contains("is-open")) { const focusable = panel.querySelectorAll("a, button"); if (!focusable.length) return; const first = focusable[0], last = focusable[focusable.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }
    });
    window.addEventListener("scroll", () => header.classList.toggle("is-scrolled", window.scrollY > 14), { passive: true });
  }

  function setupReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length || !("IntersectionObserver" in window) || reducedMotion) { items.forEach((item) => item.classList.add("is-visible")); return; }
    const observer = new IntersectionObserver((entries, current) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); current.unobserve(entry.target); } }), { rootMargin: "0px 0px -10% 0px" });
    items.forEach((item) => observer.observe(item));
  }

  function setupCounters() {
    document.querySelectorAll("[data-count]").forEach((counter) => {
      const target = Number(counter.dataset.countTarget); if (!Number.isFinite(target) || reducedMotion) return;
      const suffix = counter.dataset.countSuffix || ""; let started = false;
      const run = () => { if (started) return; started = true; const start = performance.now(); const tick = (now) => { const progress = Math.min(1, (now - start) / 900); counter.textContent = `${Math.round(target * (1 - Math.pow(1 - progress, 3))).toLocaleString()}${suffix}`; if (progress < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
      if (!("IntersectionObserver" in window)) run(); else new IntersectionObserver((entries, observer) => { if (entries[0].isIntersecting) { run(); observer.disconnect(); } }, { threshold: .5 }).observe(counter);
    });
  }

  function setupHeroTank3D() { if (!document.querySelector("[data-hero-tank-stage]")) return; const start = () => window.WINKO3D?.initHeroStages?.(); if (window.WINKO3D) start(); else window.addEventListener("winko:3d-ready", start, { once: true }); }
  function setupTankAssembly3D() { if (!document.querySelector("[data-assembly-tank-stage]")) return; const start = () => window.WINKO3D?.initAssemblyStages?.(); if (window.WINKO3D) start(); else window.addEventListener("winko:3d-ready", start, { once: true }); }
  function apply3DLocale(locale) {
    const selected = I18N.threeD[locale] ? locale : "en";
    const dictionary = I18N.threeD[selected] || I18N.threeD.en;
    window.WINKO_3D_TEXT = dictionary;
    document.querySelectorAll('[data-3d-control="explode"]').forEach((node) => { node.textContent = dictionary.controls.explode; });
    document.querySelectorAll('[data-3d-control="structure"]').forEach((node) => { node.textContent = dictionary.controls.structure; });
    document.querySelectorAll("[data-3d-disclaimer]").forEach((node) => { node.textContent = dictionary.disclaimer; });
    window.WINKO3D?.setLocale?.(selected);
  }

  function currentLanguage() { const queryLanguage = new URLSearchParams(window.location.search).get("lang"); if (I18N.languages.includes(queryLanguage)) return queryLanguage; const stored = localStorage.getItem(LANGUAGE_KEY); return I18N.languages.includes(stored) ? stored : "en"; }
  function translate(source, locale = currentLanguage()) { return I18N.text?.[locale]?.[source] || source; }
  function newsText(item, key, locale = currentLanguage()) { return translate(item[key] || "", locale); }
  function translateDocument(locale) {
    const root = document.body;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode(node) { const parent = node.parentElement; if (!parent || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(parent.tagName) || parent.closest("[data-no-i18n]") || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT; return NodeFilter.FILTER_ACCEPT; } });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => { if (!sourceTextNodes.has(node)) sourceTextNodes.set(node, node.nodeValue); const sourceValue = sourceTextNodes.get(node); const compact = sourceValue.trim(); if (!compact) return; const translated = translate(compact, locale); node.nodeValue = sourceValue.replace(compact, translated); const parent = node.parentElement; if (parent && parent.childNodes.length === 1 && I18N.text.en[compact]) parent.setAttribute("data-i18n", compact); });
    document.querySelectorAll("[aria-label], [aria-description], [alt], [placeholder], [title]").forEach((node) => { const saved = sourceAttributes.get(node) || {}; ["aria-label", "aria-description", "alt", "placeholder", "title"].forEach((attribute) => { if (!node.hasAttribute(attribute)) return; if (!(attribute in saved)) saved[attribute] = node.getAttribute(attribute); const value = saved[attribute]; node.setAttribute(attribute, translate(value, locale)); node.setAttribute(`data-i18n-${attribute.replace("aria-", "aria-")}`, value); }); sourceAttributes.set(node, saved); });
  }
  function pagePath() { const pathname = decodeURIComponent(window.location.pathname || "/"); if (!pathname || pathname === "/" || pathname.endsWith("/index.html")) return pathname.endsWith("/index.html") ? pathname.slice(0, -"index.html".length) || "/" : "/"; return encodeURI(pathname).replace(/\+/g, "%2B"); }
  function routeForLanguage(locale) { const path = pagePath(); return `${SITE_ORIGIN}${path}${locale === "en" ? "" : `?lang=${locale}`}`; }
  function setMeta(selector, attributes, content) { let node = document.head.querySelector(selector); if (!node) { node = document.createElement("meta"); Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value)); document.head.appendChild(node); } node.setAttribute("content", content); }
  function setJsonLd(id, value) { let node = document.head.querySelector(`script[type="application/ld+json"][data-winko-schema="${id}"]`); if (!value) { node?.remove(); return; } if (!node) { node = document.createElement("script"); node.type = "application/ld+json"; node.dataset.winkoSchema = id; document.head.appendChild(node); } node.textContent = JSON.stringify(value); }
  function updateStructuredData(locale, page, pageUrl, detailTarget) {
    const organization = { "@context": "https://schema.org", "@type": "Organization", "@id": `${SITE_ORIGIN}/#organization`, name: "Jutarama Industries (M) Sdn Bhd", alternateName: "WINKO", url: `${SITE_ORIGIN}/`, logo: SITE_LOGO, email: EMAIL, telephone: PHONE, address: { "@type": "PostalAddress", streetAddress: "No. 19, Kawasan Perindustrian Mega 2, Jln Mega 2/1", postalCode: "43500", addressLocality: "Semenyih", addressRegion: "Selangor", addressCountry: "MY" } };
    setJsonLd("organization", organization);
    setJsonLd("website", page === "home" ? { "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE_ORIGIN}/#website`, name: "WINKO", url: `${SITE_ORIGIN}/`, publisher: { "@id": `${SITE_ORIGIN}/#organization` } } : null);
    const detail = detailTarget && products[detailTarget.dataset.productDetail];
    const detailDescription = detail?.detailContent?.description?.[locale] || detail?.description || "";
    const pageLabel = { about: "About Us", products: "Products", services: "Services", projects: "Projects", news: "News", "news-article": "News", contact: "Contact" };
    const crumbs = [{ name: translate("Home", locale), item: routeForLanguage(locale) }];
    if (detail) crumbs.push({ name: translate("Products", locale), item: `${SITE_ORIGIN}/products.html${locale === "en" ? "" : `?lang=${locale}`}` }, { name: translate(detail.name, locale), item: pageUrl });
    else if (pageLabel[page]) crumbs.push({ name: translate(pageLabel[page], locale), item: pageUrl });
    setJsonLd("breadcrumb", page === "home" ? null : { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: crumb.item })) });
    setJsonLd("product", detail ? { "@context": "https://schema.org", "@type": "Product", name: translate(detail.name, locale), description: detailDescription, image: `${SITE_ORIGIN}/${detail.image}`, brand: { "@type": "Brand", name: "WINKO" }, manufacturer: { "@type": "Organization", name: "Jutarama Industries (M) Sdn Bhd" }, url: pageUrl } : null);
    const article = page === "news-article" ? newsItems.find((item) => item.id === "singapore-client-factory-visit-2026") : null;
    const articleLocale = article ? newsText(article, "title", locale) : "";
    setJsonLd("newsArticle", article ? { "@context": "https://schema.org", "@type": "NewsArticle", headline: articleLocale, description: newsText(article, "excerpt", locale), datePublished: article.date, dateModified: article.date, image: [`${SITE_ORIGIN}/${article.image}`], author: { "@type": "Organization", name: "WINKO", url: `${SITE_ORIGIN}/` }, publisher: { "@type": "Organization", name: "WINKO", url: `${SITE_ORIGIN}/`, logo: { "@type": "ImageObject", url: SITE_LOGO } }, mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl } } : null);
  }
  function updateMetadata(locale) {
    const detailTarget = document.querySelector("[data-product-detail]");
    const detailKey = detailTarget?.dataset.productDetail;
    const pageId = detailTarget ? "productDetail" : (document.body.dataset.page || "home");
    const page = pageId === "news-article" ? "newsArticle" : pageId;
    const values = detailKey && I18N.productMeta?.[detailKey]?.[locale] ? I18N.productMeta[detailKey][locale] : (I18N.meta?.[page]?.[locale] || I18N.meta?.[page]?.en);
    const detail = detailKey && products[detailKey];
    const pageTitle = values?.[0] || document.title;
    const pageDescription = values?.[1] || document.querySelector('meta[name="description"]')?.content || "";
    const pageUrl = routeForLanguage(locale);
    const imagePath = detail?.image || PAGE_SHARE_IMAGES[page] || PAGE_SHARE_IMAGES[pageId] || PAGE_SHARE_IMAGES.home;
    const imageUrl = `${SITE_ORIGIN}/${imagePath}`;
    document.title = pageTitle;
    setMeta('meta[name="description"]', { name: "description" }, pageDescription);
    setMeta('meta[property="og:title"]', { property: "og:title" }, pageTitle);
    setMeta('meta[property="og:description"]', { property: "og:description" }, pageDescription);
    setMeta('meta[property="og:type"]', { property: "og:type" }, detail ? "product" : page === "newsArticle" ? "article" : "website");
    setMeta('meta[property="og:url"]', { property: "og:url" }, pageUrl);
    setMeta('meta[property="og:image"]', { property: "og:image" }, imageUrl);
    setMeta('meta[property="og:site_name"]', { property: "og:site_name" }, "WINKO");
    setMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    setMeta('meta[name="twitter:title"]', { name: "twitter:title" }, pageTitle);
    setMeta('meta[name="twitter:description"]', { name: "twitter:description" }, pageDescription);
    setMeta('meta[name="twitter:image"]', { name: "twitter:image" }, imageUrl);
    let canonical = document.querySelector('link[rel="canonical"]'); if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); } canonical.href = pageUrl;
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((node) => node.remove()); [["en", "en"], ["ms", "ms"], ["zh-Hans", "zh"], ["x-default", "en"]].forEach(([hreflang, language]) => { const link = document.createElement("link"); link.rel = "alternate"; link.hreflang = hreflang; link.href = routeForLanguage(language); document.head.appendChild(link); });
    if (page === "newsArticle") setMeta('meta[property="article:published_time"]', { property: "article:published_time" }, "2026-08-04");
    updateStructuredData(locale, pageId, pageUrl, detailTarget);
  }
  function applySiteLanguage(locale, persist = true) {
    const selected = I18N.languages.includes(locale) ? locale : "en"; const queryLanguage = new URLSearchParams(window.location.search).get("lang"); if (persist || I18N.languages.includes(queryLanguage)) localStorage.setItem(LANGUAGE_KEY, selected);
    const languageUrl = new URL(window.location.href); languageUrl.searchParams.delete("lang"); if (selected !== "en") languageUrl.searchParams.set("lang", selected); const nextLocation = `${languageUrl.pathname}${languageUrl.search}${languageUrl.hash}`; if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== nextLocation) window.history.replaceState({}, "", nextLocation);
    document.documentElement.lang = selected === "zh" ? "zh-Hans" : selected;
    document.querySelectorAll("[data-site-language]").forEach((button) => { const active = button.dataset.siteLanguage === selected; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); }); const languageCode = selected === "zh" ? "CN" : selected === "ms" ? "BM" : "EN"; document.querySelectorAll("[data-language-summary]").forEach((summary) => { summary.textContent = languageCode; summary.setAttribute("aria-label", `${translate("LANGUAGE", selected)}: ${languageCode}`); }); document.querySelectorAll(".language-dropdown[open], .mobile-language details[open]").forEach((dropdown) => { dropdown.open = false; });
    translateDocument(selected); document.querySelectorAll("[data-product-detail]").forEach((target) => { const product = products[target.dataset.productDetail], image = target.querySelector("[data-detail-image]"); if (!product || !image) return; const name = translate(product.name, selected); image.alt = selected === "zh" ? `WINKO ${name}` : selected === "ms" ? `${name} oleh WINKO` : `${name} by WINKO`; }); updateMetadata(selected); apply3DLocale(selected); document.dispatchEvent(new CustomEvent("winko:languagechange", { detail: { language: selected } }));
  }
  function setupSiteLanguage() { document.querySelectorAll("[data-site-language]").forEach((button) => button.addEventListener("click", () => applySiteLanguage(button.dataset.siteLanguage))); const selected = currentLanguage(); window.addEventListener("winko:3d-ready", () => apply3DLocale(selected), { once: true }); applySiteLanguage(selected, false); window.WINKO_LANGUAGE = { get: currentLanguage, set: applySiteLanguage, validate: () => I18N.validate?.() }; I18N.validate?.(); }

  function setupProductSwitcher() {
    const buttons = document.querySelectorAll("[data-product-button]"), panels = document.querySelectorAll("[data-product-panel]"); if (!buttons.length || !panels.length) return;
    const activate = (key) => { buttons.forEach((button) => { const active = button.dataset.productButton === key; button.classList.toggle("is-active", active); button.setAttribute("aria-selected", String(active)); }); panels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.productPanel === key)); };
    buttons.forEach((button) => button.addEventListener("click", () => activate(button.dataset.productButton))); activate(buttons[0].dataset.productButton);
  }

  function setupAssemblyFallback() {
    const scope = document.querySelector("[data-tank-assembly]")?.closest(".assembly-stage-wrap") || document.querySelector("[data-tank-assembly]");
    if (!scope || (window.WINKO3D && scope.dataset.webglReady)) return;
    const stages = [["FOUNDATION", "Structure starts at the base."], ["BASE FRAME", "The supporting frame establishes the tank footprint."], ["BASE PANELS", "The 4 × 3 panel grid establishes the floor."], ["FIRST WALL LEVEL", "Pressed panels and external flanges form the first level."], ["FIRST-TIER ANGLE STAYS + CLEATS", "Organized angle stays land into visible cleat nodes."], ["UPPER WALL LEVEL", "The modular wall rises panel by panel."], ["UPPER ANGLE STAYS / INTERNAL SUPPORT", "Upper bracing and vertical supports connect to the roof line."], ["ROOF TRUSS / ROOF SUPPORT", "Roof beams and the opposite truss support the cover."], ["ROOF PANELS", "The complete roof footprint closes the storage volume."], ["LADDER / MANHOLE / VENT / LEVEL INDICATOR", "Access and inspection components arrive from outside the tank."], ["PIPEWORK", "Dark steel connections complete the presentation."], ["COMPLETE", "WINKO tank assembly view."]];
    const number = scope.querySelector("[data-stage-number]"), title = scope.querySelector("[data-stage-title]"), detail = scope.querySelector("[data-stage-detail]"), buttons = scope.querySelectorAll("[data-stage-button]");
    const activate = (index) => { if (scope.dataset.webglReady) return; const stage = stages[index] || stages[0], stageKey = buttons[index]?.dataset.stageKey, locale3D = I18N.threeD[currentLanguage()] || I18N.threeD.en; if (number) number.textContent = String(index + 1).padStart(2, "0"); if (title) title.textContent = locale3D.stages[stageKey] || stage[0]; if (detail) detail.textContent = locale3D.details[stageKey] || stage[1]; buttons.forEach((button, buttonIndex) => button.classList.toggle("is-active", buttonIndex === index)); };
    buttons.forEach((button, index) => button.addEventListener("click", () => activate(index)));
    activate(0);
  }

  function setupNewsFilters() {
    if (!document.querySelector("[data-filter]") || !document.querySelector("[data-category]")) return;
    let activeFilter = "all";
    const activate = (filter) => { activeFilter = filter; const buttons = document.querySelectorAll("[data-filter]"), cards = document.querySelectorAll("[data-category]"), status = document.querySelector("[data-filter-status]"); buttons.forEach((button) => { const active = button.dataset.filter === filter; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); }); let shown = 0; cards.forEach((card) => { const visible = filter === "all" || card.dataset.category === filter; card.classList.toggle("is-hidden", !visible); card.closest("[data-news-feature-section]")?.classList.toggle("is-hidden", !visible); if (visible) shown += 1; }); if (status) status.textContent = currentLanguage() === "zh" ? `${translate("shown")} ${shown} ${translate(shown === 1 ? "resource" : "resources")}` : `${shown} ${translate(shown === 1 ? "resource" : "resources")} ${translate("shown")}`; };
    document.addEventListener("click", (event) => { const button = event.target.closest?.("[data-filter]"); if (button) activate(button.dataset.filter); }); document.addEventListener("winko:languagechange", () => activate(activeFilter)); activate("all");
  }

  function setupNewsHub() {
    const target = document.querySelector("[data-news-hub]"); if (!target || !newsItems.length) return;
    const featured = newsItems.find((item) => item.featured) || newsItems[0];
    const latest = newsItems.filter((item) => item.id !== featured.id);
    const arrowIcon = (className = "news-arrow") => `<span class="${className}" aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="M3 13 13 3M5 3h8v8"></path></svg></span>`;
    const render = () => {
      const locale = currentLanguage();
      const t = (source) => translate(source, locale);
      const metaFor = (item) => item.displayDate ? newsText(item, "displayDate", locale) : newsText(item, "label", locale);
      const countText = (count) => locale === "zh" ? `${t("shown")} ${count} ${t(count === 1 ? "resource" : "resources")}` : `${count} ${t(count === 1 ? "resource" : "resources")} ${t("shown")}`;
      const cardTemplate = (item) => `<article class="news-card" data-category="${item.category}" data-reveal><a class="news-card-media" href="${item.href}"><img src="${item.image}" ${imageAttributes(item.image)} loading="lazy" decoding="async" alt="${newsText(item, "alt", locale)}"></a><div class="news-card-body"><span class="article-meta">${metaFor(item)}</span><h3><a href="${item.href}">${newsText(item, "title", locale)}</a></h3><p>${newsText(item, "excerpt", locale)}</p><a class="text-link news-text-link" href="${item.href}">${newsText(item, "cta", locale)}${arrowIcon()}</a></div></article>`;
      const resourceTemplate = (item, index) => `<a class="news-resource-row" href="${item.resourceHref}" data-reveal><span class="news-resource-number">${String(index + 1).padStart(2, "0")}</span><span class="news-resource-copy"><strong>${newsText(item, "resourceTitle", locale)}</strong><span>${newsText(item, "resourceSummary", locale)}</span></span><span class="news-resource-cta">${newsText(item, "resourceCta", locale)}${arrowIcon()}</span></a>`;
      target.innerHTML = `<section class="news-hero" aria-labelledby="news-hero-title"><div class="container news-hero-grid"><div class="news-hero-copy" data-reveal><p class="eyebrow">${t("NEWS & INSIGHTS")}</p><h1 id="news-hero-title">${t("Company developments, project updates and perspectives from WINKO.")}</h1><p>${t("Explore the latest WINKO company, product, service, project and technical updates.")}</p></div><div class="news-hero-accent" data-reveal aria-hidden="true"><span></span><i></i><b></b></div></div></section><section class="section news-feature-section" data-news-feature-section aria-labelledby="featured-story-title"><div class="container"><div class="news-feature-heading" data-reveal><p class="eyebrow eyebrow--dark">${t("FEATURED STORY")}</p><span>${t("WINKO / CUSTOMER ENGAGEMENT")}</span></div><article class="news-feature" data-category="${featured.category}" data-reveal><a class="news-feature-media" href="${featured.href}"><img src="${featured.image}" ${imageAttributes(featured.image)} loading="lazy" decoding="async" alt="${newsText(featured, "alt", locale)}"></a><div class="news-feature-copy"><span class="article-meta">${metaFor(featured)}</span><h2 id="featured-story-title">${newsText(featured, "title", locale)}</h2><p>${newsText(featured, "excerpt", locale)}</p><a class="text-link news-text-link" href="${featured.href}">${newsText(featured, "cta", locale)}${arrowIcon()}</a></div></article></div></section><section class="section news-insights-section" id="news-filters" aria-labelledby="latest-updates-title"><div class="container"><div class="section-heading news-insights-heading" data-reveal><div><p class="eyebrow eyebrow--dark">${t("LATEST UPDATES")}</p><h2 id="latest-updates-title">${t("Latest Updates")}</h2></div><p>${t("Explore the current WINKO product, service, project and technical resources.")}</p></div><div class="news-filter-row" data-reveal><div><span class="news-filter-label">${t("FILTER BY RESOURCE TYPE")}</span><div class="filter-bar" role="group" aria-label="${t("News categories")}"><button class="filter-button is-active" type="button" data-filter="all" aria-pressed="true">${t("ALL")}</button><button class="filter-button" type="button" data-filter="company" aria-pressed="false">${t("COMPANY")}</button><button class="filter-button" type="button" data-filter="products" aria-pressed="false">${t("PRODUCTS")}</button><button class="filter-button" type="button" data-filter="projects" aria-pressed="false">${t("PROJECTS")}</button><button class="filter-button" type="button" data-filter="services" aria-pressed="false">${t("SERVICES")}</button><button class="filter-button" type="button" data-filter="technical" aria-pressed="false">${t("TECHNICAL")}</button></div></div><p class="filter-status" data-filter-status aria-live="polite">${countText(newsItems.length)}</p></div><div class="news-latest-grid">${latest.map(cardTemplate).join("")}</div></div></section><section class="news-coming-soon" aria-labelledby="news-coming-soon-title"><div class="container news-coming-soon-grid"><div class="news-coming-soon-copy" data-reveal><p class="eyebrow">${t("COMING SOON")}</p><h2 id="news-coming-soon-title">${t("Something new is taking shape.")}</h2><p>${t("A new addition to the WINKO product range is on the way.")}<br>${t("More details will be revealed soon.")}</p><a class="text-link news-coming-soon-cta news-text-link" href="#news-filters">${t("STAY TUNED")}${arrowIcon()}</a></div><div class="news-coming-soon-visual" data-reveal role="img" aria-label="${t("Preview of an upcoming WINKO product")}"><span class="news-coming-soon-label">${t("NEW PRODUCT / WINKO")}</span><div class="news-coming-soon-glow" aria-hidden="true"></div><div class="news-coming-soon-panel" aria-hidden="true"></div></div></div></section><section class="section news-resource-section" aria-labelledby="explore-winko-title"><div class="container"><div class="section-heading section-heading--light news-resource-heading" data-reveal><div><p class="eyebrow">${t("Explore WINKO")}</p><h2 id="explore-winko-title">${t("One route into the wider WINKO system.")}</h2></div><p>${t("Use these direct routes to move from insight to product, service and project information.")}</p></div><div class="news-resource-list">${newsItems.filter((item) => item.resourceHref).map(resourceTemplate).join("")}</div></div></section><section class="cta-section cta-section--signature news-cta-section"><div class="container cta-inner"><div><p class="eyebrow">${t("Need more information?")}</p><h2>${t("Talk to the WINKO team.")}</h2></div><div><p>${t("Contact us for product selection, maintenance, repairs, consultation, and quotation requirements.")}</p><a class="button button--light" href="contact.html">${t("GET FREE QUOTATION")} <span aria-hidden="true">↗</span></a></div></div></section>`;
      setupReveal();
    };
    render();
    document.addEventListener("winko:languagechange", render);
  }

  function setupNewsArticle() {
    const target = document.querySelector("[data-news-article]");
    if (!target) return;
    const article = newsItems.find((item) => item.id === "singapore-client-factory-visit-2026");
    if (!article) return;
    const paragraphs = [
      "We were pleased to welcome our client from Singapore to our factory for an on-site visit and production tour.",
      "During the visit, our team introduced our manufacturing facilities, production processes, and water tank solutions, including a closer look at our sectional water tank systems and fabrication capabilities.",
      "The visit provided a valuable opportunity to exchange technical information, better understand project requirements, and strengthen our working relationship.",
      "We appreciate our client for taking the time to visit our facility and look forward to future collaboration."
    ];
    const arrowIcon = `<span class="news-arrow" aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="m13 3-10 10M5 3h8v8"></path></svg></span>`;
    const render = () => {
      const locale = currentLanguage();
      target.innerHTML = `<article class="news-article" aria-labelledby="news-article-title"><section class="news-article-hero"><div class="container news-article-intro" data-reveal><p class="eyebrow">${translate("NEWS", locale)}</p><span class="article-meta">${translate("04 AUGUST 2026", locale)}</span><h1 id="news-article-title">${translate("Singapore Client Visits WINKO Factory", locale)}</h1></div><div class="container"><figure class="news-article-media" data-reveal><img src="${article.image}" ${imageAttributes(article.image)} loading="eager" fetchpriority="high" decoding="async" alt="${newsText(article, "alt", locale)}"></figure></div></section><section class="section news-article-content"><div class="container"><div class="news-article-body" data-reveal>${paragraphs.map((paragraph) => `<p>${translate(paragraph, locale)}</p>`).join("")}<p class="news-article-signoff">${translate("WINKO - Engineered Water Storage Solutions", locale)}</p><a class="text-link news-text-link news-back-link" href="news.html">${translate("BACK TO NEWS", locale)}${arrowIcon}</a></div></div></section></article>`;
      setupReveal();
    };
    render();
    document.addEventListener("winko:languagechange", render);
  }

  function setupProjectGallery() {
    const target = document.querySelector("[data-project-gallery]");
    if (!target || !projectGroups.length) return;
    const imagePath = (file) => `index_html_files/${file}`;
    target.innerHTML = projectGroups.map((project, projectIndex) => `<section class="project-group" data-project-group="${project.id}" data-reveal>
      <div class="project-group-heading">
        <div><p class="eyebrow eyebrow--dark">${String(projectIndex + 1).padStart(2, "0")} / Project</p><h2>${project.title}</h2></div>
        <p>Original WINKO project photo sequence.</p>
      </div>
      <div class="project-group-grid">${project.images.map((file, imageIndex) => `<button class="project-photo" type="button" data-project-image data-project-id="${project.id}" data-project-index="${imageIndex}" aria-label="${translate("Open project image")} — ${project.title} ${imageIndex + 1}"><img src="${imagePath(file)}" ${imageAttributes(imagePath(file))} loading="lazy" decoding="async" alt="${project.title} — ${translate("project image")} ${imageIndex + 1}"></button>`).join("")}</div>
    </section>`).join("");
    setupReveal();

    const lightbox = document.createElement("div");
    lightbox.className = "project-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML = `<div class="project-lightbox-backdrop" data-lightbox-close></div><div class="project-lightbox-dialog"><button class="project-lightbox-close" type="button" data-lightbox-close aria-label="Close project image">×</button><button class="project-lightbox-nav project-lightbox-nav--prev" type="button" data-lightbox-prev aria-label="Previous project image">←</button><figure><img data-lightbox-image alt=""><figcaption data-lightbox-caption></figcaption></figure><button class="project-lightbox-nav project-lightbox-nav--next" type="button" data-lightbox-next aria-label="Next project image">→</button></div>`;
    document.body.appendChild(lightbox);
    const imageNode = lightbox.querySelector("[data-lightbox-image]");
    const captionNode = lightbox.querySelector("[data-lightbox-caption]");
    let activeProject = projectGroups[0], activeIndex = 0, lastTrigger = null;
    const setImage = () => {
      const file = activeProject.images[activeIndex];
      imageNode.src = imagePath(file);
      imageNode.alt = `${activeProject.title} — ${translate("project image")} ${activeIndex + 1}`;
      captionNode.textContent = `${activeProject.title} · ${translate("Image")} ${activeIndex + 1} ${translate("of")} ${activeProject.images.length}`;
    };
    const close = () => { lightbox.setAttribute("aria-hidden", "true"); document.body.classList.remove("is-lightbox-open"); lastTrigger?.focus(); };
    const open = (projectId, index, trigger) => { activeProject = projectGroups.find((project) => project.id === projectId) || projectGroups[0]; activeIndex = Math.max(0, Math.min(Number(index) || 0, activeProject.images.length - 1)); lastTrigger = trigger; setImage(); lightbox.setAttribute("aria-hidden", "false"); document.body.classList.add("is-lightbox-open"); lightbox.querySelector("[data-lightbox-close]")?.focus(); };
    target.querySelectorAll("[data-project-image]").forEach((button) => button.addEventListener("click", () => open(button.dataset.projectId, button.dataset.projectIndex, button)));
    lightbox.querySelectorAll("[data-lightbox-close]").forEach((node) => node.addEventListener("click", close));
    lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", () => { activeIndex = (activeIndex - 1 + activeProject.images.length) % activeProject.images.length; setImage(); });
    lightbox.querySelector("[data-lightbox-next]").addEventListener("click", () => { activeIndex = (activeIndex + 1) % activeProject.images.length; setImage(); });
    document.addEventListener("winko:languagechange", () => { target.querySelectorAll("[data-project-image]").forEach((button) => { const project = projectGroups.find((item) => item.id === button.dataset.projectId); const image = button.querySelector("img"); if (project && image) image.alt = `${project.title} — ${translate("project image")} ${Number(button.dataset.projectIndex) + 1}`; }); if (lightbox.getAttribute("aria-hidden") === "false") setImage(); });
    document.addEventListener("keydown", (event) => { if (lightbox.getAttribute("aria-hidden") === "true") return; if (event.key === "Escape") close(); if (event.key === "ArrowLeft") lightbox.querySelector("[data-lightbox-prev]").click(); if (event.key === "ArrowRight") lightbox.querySelector("[data-lightbox-next]").click(); });
  }

  function setupForms() {
    document.querySelectorAll("[data-quotation-form]").forEach((form) => {
      form.querySelectorAll("[required]").forEach((field) => {
        field.addEventListener("invalid", () => { const validationKey = field.dataset.validationMessage || (field.type === "email" ? "Please enter a valid email address." : "Please complete this field."); field.setCustomValidity(translate(validationKey)); });
        field.addEventListener("input", () => field.setCustomValidity(""));
        field.addEventListener("change", () => field.setCustomValidity(""));
      });
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (form.dataset.submitting === "true" || !form.reportValidity()) return;
        form.dataset.submitting = "true";
        const submit = form.querySelector('[type="submit"]'); if (submit) submit.disabled = true;
        const data = new FormData(form), locale = currentLanguage();
        const subjectLead = locale === "zh" ? "WINKO 报价申请" : locale === "ms" ? "Permohonan sebut harga WINKO" : "WINKO quotation request";
        const fields = [...form.querySelectorAll("[name]")].filter((field) => field.type !== "submit" && String(field.value || "").trim());
        const body = fields.map((field) => `${translate(field.dataset.formLabel || field.name, locale)}: ${String(field.value).trim()}`).join("\n");
        const subject = `${subjectLead}${data.get("company") ? ` — ${data.get("company")}` : ""}`;
        const status = form.querySelector("[data-form-status]"); if (status) status.textContent = translate("Your email application should open with the quotation details. You can also email sales@winko.my directly.", locale);
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      });
    });
  }

  function setupProductDetail() {
    const target = document.querySelector("[data-product-detail]"); if (!target) return; const product = products[target.dataset.productDetail]; if (!product?.detailContent) return;
    const content = product.detailContent;
    const read = (value) => value?.[currentLanguage()] || value?.en || "";
    const escape = (value) => String(value).replace(/[&<>\"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character]));
    const setText = (selector, value) => { const node = target.querySelector(selector); if (node) node.textContent = value; };
    const related = Object.entries(products).filter(([key]) => key !== target.dataset.productDetail).slice(0, 3);
    const restored = document.createElement("section");
    restored.className = "section detail-restored";
    const render = () => {
      const locale = currentLanguage();
      const localizedName = translate(product.name, locale);
      setText("[data-detail-eyebrow]", read(content.eyebrow));
      setText("[data-detail-name]", localizedName);
      setText("[data-detail-description]", read(content.description));
      setText("[data-detail-copy]", read(content.overview));
      const heading = target.querySelector(".detail-copy h2");
      if (heading) heading.textContent = translate("Official WINKO product information", locale);
      const image = target.querySelector("[data-detail-image]");
      if (image) { image.src = product.image; image.alt = locale === "zh" ? `WINKO ${localizedName}` : locale === "ms" ? `${localizedName} oleh WINKO` : `${localizedName} by WINKO`; }
      const list = target.querySelector("[data-detail-bullets]");
      if (list) list.innerHTML = content.features.map((item) => `<li>${escape(read(item))}</li>`).join("");
      const facts = target.querySelector("[data-detail-facts]");
      if (facts) facts.innerHTML = content.specs.slice(0, 3).map(([label, value]) => `<div class="detail-fact"><strong>${escape(read(label))}</strong><span>${escape(read(value))}</span></div>`).join("");
      restored.innerHTML = `<div class="container detail-source-grid">
        <div class="detail-source-main">
          <section class="detail-block detail-block--features"><p class="eyebrow eyebrow--dark">${escape(translate("Key Features", locale))}</p><h2>${escape(translate("Designed for the real project brief", locale))}</h2><ul class="detail-feature-list">${content.features.map((item) => `<li>${escape(read(item))}</li>`).join("")}</ul></section>
          <section class="detail-block detail-block--applications"><p class="eyebrow eyebrow--dark">${escape(translate("Best Applications", locale))}</p><h2>${escape(translate("Where this product fits", locale))}</h2><ul class="detail-application-list">${content.applications.map((item) => `<li>${escape(read(item))}</li>`).join("")}</ul></section>
          <section class="detail-block detail-block--specification"><p class="eyebrow eyebrow--dark">${escape(translate("Product Specification", locale))}</p><h2>${escape(translate("Technical details from WINKO", locale))}</h2><div class="detail-spec-table" role="table" aria-label="${escape(translate("Product Specification", locale))}"><div class="detail-spec-row detail-spec-row--head" role="row"><strong role="columnheader">${escape(translate("Specification", locale))}</strong><strong role="columnheader">${escape(translate("Details", locale))}</strong></div>${content.specs.map(([label, value]) => `<div class="detail-spec-row" role="row"><strong role="rowheader">${escape(read(label))}</strong><span role="cell">${escape(read(value))}</span></div>`).join("")}</div></section>
        </div>
        <aside class="detail-related"><p class="eyebrow eyebrow--dark">${escape(translate("Related products", locale))}</p><div class="detail-related-list">${related.map(([, item]) => `<a href="${item.href}"><span>${escape(translate(item.name, locale))}</span><b aria-hidden="true">↗</b></a>`).join("")}</div><a class="text-link" href="products.html">${escape(translate("Back to products", locale))} <span aria-hidden="true">↗</span></a></aside>
      </div></section>`;
    };
    render();
    target.insertAdjacentElement("afterend", restored);
    document.addEventListener("winko:languagechange", render);
  }

  function addUtilityLinks() {
    if (!document.querySelector(".whatsapp-float")) { const whatsapp = document.createElement("a"); whatsapp.className = "whatsapp-float"; whatsapp.href = WHATSAPP; whatsapp.target = "_blank"; whatsapp.rel = "noopener"; whatsapp.setAttribute("aria-label", "Chat with WINKO on WhatsApp"); whatsapp.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.5 0 .2 5.3.2 11.9c0 2.1.5 4.1 1.5 5.9L.1 24l6.4-1.7a11.8 11.8 0 0 0 5.6 1.4h.1c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.3-6.1-3.6-8.3ZM12.2 21.7h-.1a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 0 1-1.5-5.2C2.2 6.4 6.7 2 12.2 2c2.7 0 5.1 1 7 2.9s2.9 4.3 2.9 7c0 5.5-4.5 9.8-9.9 9.8Zm5.4-7.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.8-1.8-2.1-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.5-.1-.7-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.2 3.2c.2.2 2.2 3.4 5.4 4.8.8.3 1.4.5 1.8.6.8.3 1.5.2 2 .1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.4Z"/></svg><span class="sr-only">Chat with WINKO</span>`; document.body.appendChild(whatsapp); }
    if (!document.querySelector(".back-to-top")) { const button = document.createElement("button"); button.className = "back-to-top"; button.type = "button"; button.setAttribute("aria-label", "Back to top"); button.textContent = "↑"; button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })); document.body.appendChild(button); window.addEventListener("scroll", () => button.classList.toggle("is-visible", window.scrollY > 700), { passive: true }); }
  }

  function ensureCanonical() { updateMetadata(currentLanguage()); }

  renderShell(); setupNavigation(); setupReveal(); setupCounters(); setupHeroTank3D(); setupTankAssembly3D(); setupProductSwitcher(); setupAssemblyFallback(); setupNewsHub(); setupNewsArticle(); setupNewsFilters(); setupProjectGallery(); setupForms(); setupProductDetail(); addUtilityLinks(); setupSiteLanguage(); ensureCanonical();
})();
