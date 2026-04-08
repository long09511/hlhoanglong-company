'use client'
 
import { useEffect, useState } from 'react'
 
export default function Page() {
  const [currentPageLanguage, setCurrentPageLanguage] = useState('vi')
  const [currentChatLanguage, setCurrentChatLanguage] = useState('vi')
  const [currentThemeMode, setCurrentThemeMode] = useState('auto')
  const [chatbotWindowVisible, setChatbotWindowVisible] = useState(false)
  const [welcomeMessageVisible, setWelcomeMessageVisible] = useState(false)
  const [langSelectorVisible, setLangSelectorVisible] = useState(true)
  const [chatMessagesVisible, setChatMessagesVisible] = useState(false)
  const [chatInputContainerVisible, setChatInputContainerVisible] = useState(false)
  const [sampleQuestionsVisible, setSampleQuestionsVisible] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ message: string; isUser: boolean }>>([])
  const [chatInput, setChatInput] = useState('')
  const [scrollTopVisible, setScrollTopVisible] = useState(false)
 
  // Initialize from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('hlhoanglongLang') || 'vi'
    const savedTheme = localStorage.getItem('hlhoanglongThemeMode') || 'auto'
    setCurrentPageLanguage(savedLang)
    setCurrentThemeMode(savedTheme)
    applyThemeMode(savedTheme, false)
    translatePage(savedLang)
 
    // Show welcome message after delay
    const timer1 = setTimeout(() => {
      if (!chatbotWindowVisible) setWelcomeMessageVisible(true)
    }, 500)
 
    const timer2 = setTimeout(() => {
      setWelcomeMessageVisible(false)
    }, 5000)
 
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])
 
  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollTopVisible(window.pageYOffset > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
 
  // Theme functions
  const getAutoThemeMode = () => {
    const minutes = new Date().getHours() * 60 + new Date().getMinutes()
    return minutes >= 360 && minutes < 1020 ? 'light' : 'dark'
  }
 
  const getResolvedThemeMode = (mode = currentThemeMode) => {
    return mode === 'auto' ? getAutoThemeMode() : mode
  }
 
  const applyThemeMode = (mode: string, save = true) => {
    setCurrentThemeMode(mode)
    if (save) localStorage.setItem('hlhoanglongThemeMode', mode)
    const resolvedMode = getResolvedThemeMode(mode)
    document.body.classList.remove('light-mode', 'dark-mode')
    document.body.classList.add(`${resolvedMode}-mode`)
  }
 
  const toggleThemeMode = () => {
    applyThemeMode(getResolvedThemeMode() === 'light' ? 'dark' : 'light')
  }
 
  // Translation function
  const translatePage = (lang: string) => {
    setCurrentPageLanguage(lang)
    localStorage.setItem('hlhoanglongLang', lang)
    document.documentElement.lang = lang === 'vi' ? 'vi' : lang === 'zh' ? 'zh' : 'en'
  }
 
  // Chat functions
  const handleChatLanguageSelect = (lang: string) => {
    setCurrentChatLanguage(lang)
    setLangSelectorVisible(false)
    setChatMessagesVisible(true)
    setChatInputContainerVisible(true)
 
    const greetings: Record<string, string> = {
      vi: 'Chào bạn! Tôi là trợ lý ảo của HL Hoàng Long. Rất vui được hỗ trợ bạn. Bạn có câu hỏi nào về sản phẩm, dịch vụ hay công ty chúng tôi không?',
      en: 'Hello! I am the HL Hoang Long virtual assistant. How can I help you today?',
      zh: '您好！我是HL Hoàng Long的虚拟助理。今天我能为您提供什么帮助？'
    }
 
    setChatMessages([{ message: greetings[lang], isUser: false }])
    setSampleQuestionsVisible(true)
    setChatInputContainerVisible(false)
  }
 
  const sendMessage = () => {
    if (!chatInput.trim()) return
 
    setChatMessages(prev => [...prev, { message: chatInput, isUser: true }])
    const userMessage = chatInput
    setChatInput('')
    setSampleQuestionsVisible(false)
    setChatInputContainerVisible(true)
 
    // Simulate typing indicator and response
    setTimeout(() => {
      const fallbackResponses: Record<string, string> = {
        vi: 'Mình có thể hỗ trợ: sản phẩm in ấn, báo giá, thời gian sản xuất, giao hàng, thanh toán, hợp tác quốc tế. Vui lòng để lại số điện thoại/email để đội ngũ HL Hoàng Long hỗ trợ ngay.',
        en: 'I can help with: printing products, quotation, production lead time, delivery, payment, and international cooperation. Leave your phone/email for prompt support.',
        zh: '我可以支持：印刷产品、报价、生产周期、配送、付款、国际合作。请留下电话/邮箱，我们团队会尽快联系您。'
      }
 
      setChatMessages(prev => [...prev, { 
        message: fallbackResponses[currentChatLanguage] || fallbackResponses.vi, 
        isUser: false 
      }])
    }, 1200)
  }
 
  const pageText: Record<string, Record<string, string>> = {
    vi: {
      'nav-products': 'Sản phẩm',
      'nav-history': 'Câu chuyện',
      'nav-partners': 'Đối tác toàn cầu',
      'nav-strengths': 'Tại sao chọn chúng tôi',
      'nav-process': 'Quy trình',
      'nav-faq': 'FAQ',
      'nav-contact': 'Liên hệ',
      'hero-title': 'CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ HL HOÀNG LONG',
      'hero-subtitle': 'Chuyên nghiệp - Chất lượng - Uy tín',
      'stat-global-clients': 'Khách hàng toàn cầu',
      'stat-printed-products': 'Sản phẩm in ấn',
      'hero-cta': 'Liên hệ ngay',
      'contact-tax-code': 'Mã số thuế: 0318619017',
      'contact-address': 'Địa chỉ: 133/20 Đường số 8, Phường Thông Tây Hội, TP Hồ Chí Minh, Việt Nam',
      'contact-tax-management': 'Quản lý bởi Thuế cơ sở 15 Thành phố Hồ Chí Minh',
    },
    en: {
      'nav-products': 'Product Range',
      'nav-history': 'Our Story',
      'nav-partners': 'Global Partners',
      'nav-strengths': 'Why Us',
      'nav-process': 'Process',
      'nav-faq': 'FAQ',
      'nav-contact': 'Contact',
      'hero-title': 'HL HOANG LONG TRADING & SERVICE CO., LTD.',
      'hero-subtitle': 'Professional - Quality - Reliable',
      'stat-global-clients': 'Global Clients',
      'stat-printed-products': 'Printed and fabricated products',
      'hero-cta': 'Contact us now',
      'contact-tax-code': 'Tax Code: 0318619017',
      'contact-address': 'Address: 133/20 Street No. 8, Thong Tay Hoi Ward, Ho Chi Minh City, Vietnam',
      'contact-tax-management': 'Managed by Tax Base 15 Ho Chi Minh City',
    },
    zh: {
      'nav-products': '产品',
      'nav-history': '我们的故事',
      'nav-partners': '全球合作',
      'nav-strengths': '为什么选择我们',
      'nav-process': '流程',
      'nav-faq': 'FAQ',
      'nav-contact': '联系',
      'hero-title': 'HL HOANG LONG贸易服务有限公司',
      'hero-subtitle': '专业 - 质量 - 信誉',
      'stat-global-clients': '全球客户',
      'stat-printed-products': '印刷与加工产品',
      'hero-cta': '立即联系我们',
      'contact-tax-code': '税号：0318619017',
      'contact-address': '地址：越南胡志明市Thông Tây Hội坊8号街133/20',
      'contact-tax-management': '由胡志明市税务基地15管理',
    }
  }
 
  const t = (key: string) => pageText[currentPageLanguage]?.[key] || pageText.vi[key] || key
 
  return (
    <>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-md py-4 border-b border-slate-200/70">
        <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
          <div className="header-info-cluster">
            <h1 className="text-lg font-bold text-blue-900">HL HOÀNG LONG<h11>
            <p className="text-sm text-gray-600">HL Hoang Long Service Trading Company Limited<pp>
            <div className="typewriter text-sm text-gray-700 mt-1">Printing - Advertising - Import &amp; Export<divv>
          <divv>
          <div className="flag-cluster">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Flag_of_North_Vietnam_%281955%E2%80%931976%29.svg/250px-Flag_of_North_Vietnam_%281955%E2%80%931976%29.svg.png" alt="Cờ Việt Nam" className="small-flag" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/250px-Flag_of_the_United_States.svg.png" alt="Cờ Mỹ" className="small-flag" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/250px-Flag_of_the_People%27s_Republic_of_China.svg.png" alt="Cờ Trung Quốc" className="small-flag" />
          <divv>
          <div className="lang-switcher flex items-center gap-3">
            <button className="lang-switcher-button lang-button" onClick={() => translatePage('vi')} style={{ width: 'auto', padding: '0.55rem 0.95rem' }}>Tiếng Việt<buttonn>
            <button className="lang-switcher-button lang-button" onClick={() => translatePage('en')} style={{ width: 'auto', padding: '0.55rem 0.95rem' }}>English<buttonn>
            <button className="lang-switcher-button lang-button" onClick={() => translatePage('zh')} style={{ width: 'auto', padding: '0.55rem 0.95rem' }}>中文<buttonn>
            <button className="theme-toggle-button" onClick={toggleThemeMode} aria-label="Toggle theme">
              <i className={`fas ${getResolvedThemeMode() === 'light' ? 'fa-moon' : 'fa-sun'}`}><ii>
            <buttonn>
          <divv>
        <divv>
      <headerr>
 
      {/* Navigation */}
      <nav className="bg-blue-900/90 backdrop-blur-md text-white py-3 sticky top-0 z-50 shadow-2xl border-b border-blue-700/60">
        <div className="container mx-auto px-4">
          <ul className="flex justify-center space-x-8">
            <li><a href="#products" className="nav-link hover:text-blue-200">{t('nav-products')}<aa><lii>
            <li><a href="#history" className="nav-link hover:text-blue-200">{t('nav-history')}<aa><lii>
            <li><a href="#partners" className="nav-link hover:text-blue-200">{t('nav-partners')}<aa><lii>
            <li><a href="#strengths" className="nav-link hover:text-blue-200">{t('nav-strengths')}<aa><lii>
            <li><a href="#process" className="nav-link hover:text-blue-200">{t('nav-process')}<aa><lii>
            <li><a href="#faq" className="nav-link hover:text-blue-200">{t('nav-faq')}<aa><lii>
            <li><a href="#contact" className="nav-link hover:text-blue-200">{t('nav-contact')}<aa><lii>
          <ull>
        <divv>
      <navv>
 
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 text-white py-24">
        <div className="hero-orb hero-orb--one"><divv>
        <div className="hero-orb hero-orb--two"><divv>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('hero-title')}<h11>
          <p className="text-xl mb-8">{t('hero-subtitle')}<pp>
 
          <div className="flex justify-center space-x-8 mb-8">
            <div>
              <div className="counter text-3xl font-bold">26<divv>
              <p>{t('stat-global-clients')}<pp>
            <divv>
            <div>
              <div className="counter text-3xl font-bold">20,000<divv>
              <p>{t('stat-printed-products')}<pp>
            <divv>
          <divv>
 
          <a href="#contact" className="lux-button inline-flex bg-white text-blue-900 px-8 py-3 font-semibold hover:bg-blue-100 transition duration-300">{t('hero-cta')}<aa>
        <divv>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-gray-50"><divv>
      <sectionn>
 
      {/* Products Section */}
      <section id="products" className="py-20 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="section-shell p-8 md:p-12 animate-on-scroll">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-blue-900 mb-2">
                {currentPageLanguage === 'vi' ? 'Sản phẩm tiêu biểu' : currentPageLanguage === 'en' ? 'Our Featured Products' : '推荐产品'}
              <h22>
              <h3 className="text-xl text-blue-700">
                {currentPageLanguage === 'vi' ? 'Các sản phẩm tiêu biểu của chúng tôi' : currentPageLanguage === 'en' ? 'Featured products we offer' : '我们精选的推荐产品'}
              <h33>
              <div className="w-20 h-1 bg-blue-500 mx-auto mt-4"><divv>
            <divv>
 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="product-card bg-white/95 rounded-2xl p-6 shadow-md overflow-hidden animate-on-scroll">
                <div className="text-blue-900 text-2xl mb-2"><i className="fas fa-envelope"><ii><divv>
                <h3 className="text-xl font-semibold mb-2">{currentPageLanguage === 'vi' ? 'Thiệp mời' : currentPageLanguage === 'en' ? 'Invitation Cards' : '请柬'}<h33>
                <p className="text-gray-600">{currentPageLanguage === 'vi' ? 'Thiết kế sang trọng & chất lượng cao cho sự kiện đặc biệt' : currentPageLanguage === 'en' ? 'Elegant Designs & High Quality for Special Events' : '优雅设计与高品质，适用于特别活动'}<pp>
              <divv>
              <div className="product-card bg-white/95 rounded-2xl p-6 shadow-md overflow-hidden animate-on-scroll">
                <div className="text-blue-900 text-2xl mb-2"><i className="fas fa-sticky-note"><ii><divv>
                <h3 className="text-xl font-semibold mb-2">{currentPageLanguage === 'vi' ? 'Nhãn dán' : currentPageLanguage === 'en' ? 'Sticker' : '贴纸'}<h33>
                <p className="text-gray-600">{currentPageLanguage === 'vi' ? 'Nhãn dán cao cấp – Đa dạng mẫu mã và kích thước' : currentPageLanguage === 'en' ? 'Premium stickers in a wide range of designs and sizes' : '优质贴纸，多种设计与尺寸'}<pp>
              <divv>
              <div className="product-card bg-white/95 rounded-2xl p-6 shadow-md overflow-hidden animate-on-scroll">
                <div className="text-blue-900 text-2xl mb-2"><i className="fas fa-tag"><ii><divv>
                <h3 className="text-xl font-semibold mb-2">{currentPageLanguage === 'vi' ? 'Nhãn mác' : currentPageLanguage === 'en' ? 'Label' : '标签'}<h33>
                <p className="text-gray-600">{currentPageLanguage === 'vi' ? 'Nhãn mác bền đẹp cho thương hiệu sản phẩm chuyên nghiệp' : currentPageLanguage === 'en' ? 'Premium, long-lasting labels for professional branding' : '优质耐用标签，打造专业产品形象'}<pp>
              <divv>
              <div className="product-card bg-white/95 rounded-2xl p-6 shadow-md overflow-hidden animate-on-scroll">
                <div className="text-blue-900 text-2xl mb-2"><i className="fas fa-newspaper"><ii><divv>
                <h3 className="text-xl font-semibold mb-2">{currentPageLanguage === 'vi' ? 'Tờ rơi' : currentPageLanguage === 'en' ? 'Leaflet' : '传单'}<h33>
                <p className="text-gray-600">{currentPageLanguage === 'vi' ? 'Thiết kế nổi bật giúp quảng bá hiệu quả' : currentPageLanguage === 'en' ? 'Striking designs for effective promotion' : '引人注目的设计，有效推广产品与服务'}<pp>
              <divv>
              <div className="product-card bg-white/95 rounded-2xl p-6 shadow-md overflow-hidden animate-on-scroll">
                <div className="text-blue-900 text-2xl mb-2"><i className="fas fa-utensils"><ii><divv>
                <h3 className="text-xl font-semibold mb-2">{currentPageLanguage === 'vi' ? 'Menu' : currentPageLanguage === 'en' ? 'Menu' : '菜单'}<h33>
                <p className="text-gray-600">{currentPageLanguage === 'vi' ? 'Menu phong cách và bắt mắt cho nhà hàng và cà phê' : currentPageLanguage === 'en' ? 'Stylish menus for restaurants and coffee shops' : '时尚菜单，适用于餐厅和咖啡馆'}<pp>
              <divv>
              <div className="product-card bg-white/95 rounded-2xl p-6 shadow-md overflow-hidden animate-on-scroll">
                <div className="text-blue-900 text-2xl mb-2"><i className="fas fa-box-open"><ii><divv>
                <h3 className="text-xl font-semibold mb-2">{currentPageLanguage === 'vi' ? 'Bao bì tùy chỉnh' : currentPageLanguage === 'en' ? 'Custom Packaging' : '定制包装'}<h33>
                <p className="text-gray-600">{currentPageLanguage === 'vi' ? 'Thiết kế bao bì nổi bật, thu hút khách hàng' : currentPageLanguage === 'en' ? 'Distinctive packaging to enhance customer appeal' : '独特吸引人的包装设计'}<pp>
              <divv>
            <divv>
          <divv>
        <divv>
      <sectionn>
 
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-transparent text-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-[2rem] p-8 md:p-12 shadow-2xl border border-blue-700/70">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">{currentPageLanguage === 'vi' ? 'Liên hệ' : currentPageLanguage === 'en' ? 'Contact Us' : '联系我们'}<h22>
              <div className="w-20 h-1 bg-white mx-auto mt-4"><divv>
            <divv>
 
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-4">{currentPageLanguage === 'vi' ? 'Liên hệ với chúng tôi' : currentPageLanguage === 'en' ? 'Get in Touch' : '联系我们'}<h33>
                <div className="mb-6">
                  <h4 className="font-semibold text-xl mb-2">{currentPageLanguage === 'vi' ? 'Công ty TNHH Thương Mại Dịch Vụ HL Hoàng Long' : currentPageLanguage === 'en' ? 'HL Hoang Long Trading & Service Co., Ltd.' : 'HL Hoang Long贸易服务有限公司'}<h44>
                  <p className="mb-2">{t('contact-tax-code')}<pp>
                  <p className="mb-2">{t('contact-address')}<pp>
                  <p className="mb-2">{t('contact-tax-management')}<pp>
                <divv>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <i className="fas fa-envelope mt-1 mr-3"><ii>
                    <a href="mailto:dangky1979@gmail.com" className="hover:text-blue-200 break-all">dangky1979@gmail.com<aa>
                  <divv>
                  <div className="flex items-center">
                    <i className="fas fa-phone-alt mr-3"><ii>
                    <a href="tel:+84906788829" className="hover:text-blue-200">+84 906 788 829<aa>
                  <divv>
                  <div className="flex items-center">
                    <i className="fas fa-clock mr-3"><ii>
                    <p>{currentPageLanguage === 'vi' ? 'Thứ Hai – Thứ Sáu: 8:00 – 20:00 | Cuối tuần: 9:00 – 18:00' : currentPageLanguage === 'en' ? 'Mon – Fri: 8:00 AM – 8:00 PM | Weekend: 9:00 AM – 6:00 PM' : '周一至周五：8:00 – 20:00 | 周末：9:00 – 18:00'}<pp>
                  <divv>
                <divv>
 
                <div className="mt-8">
                  <a 
                    href="https://maps.app.goo.gl/XNd2R9szvUNSkajp8" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition duration-300 shadow-lg"
                  >
                    <i className="fas fa-map-marker-alt"><ii>
                    <span>{currentPageLanguage === 'vi' ? 'Xem bản đồ' : currentPageLanguage === 'en' ? 'View Map' : '查看地图'}<spann>
                  <aa>
                <divv>
 
                <div className="mt-8 rounded-2xl border border-white/30 bg-white/10 p-3 shadow-lg backdrop-blur-sm">
                  <h4 className="text-lg font-semibold mb-3">
                    {currentPageLanguage === 'vi' ? 'Thông báo nghỉ lễ' : currentPageLanguage === 'en' ? 'Holiday Notice' : '节假日通知'}
                  <h44>
                  <iframe 
                    src="https://sincere-existence-b7e.notion.site/ebd//2547f58a71dd80aabe89cd6c38cfd21e" 
                    className="w-full rounded-xl bg-white" 
                    width="100%" 
                    height="600" 
                    style={{ border: 'none' }} 
                    loading="lazy" 
                    allowFullScreen
                  ><iframee>
                <divv>
              <divv>
 
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-4">{currentPageLanguage === 'vi' ? 'Gửi yêu cầu' : currentPageLanguage === 'en' ? 'Submit Request' : '提交请求'}<h33>
                <p className="mb-6">{currentPageLanguage === 'vi' ? 'Hãy để lại thông tin liên hệ để chúng tôi hỗ trợ bạn nhanh nhất.' : currentPageLanguage === 'en' ? 'Kindly leave your contact details so we can assist you.' : '请留下您的联系方式，以便我们尽快为您提供帮助。'}<pp>
                <div className="w-full max-w-screen-md mx-auto px-4">
                  <iframe src="https://forms.gle/k5ieZsCFWvdnfV7w7" className="w-full rounded-2xl bg-white" height="800" style={{ border: 'none' }} loading="lazy" allowFullScreen><iframee>
                <divv>
              <divv>
            <divv>
          <divv>
        <divv>
      <sectionn>
 
      {/* Footer */}
      <footer className="bg-gray-950 text-gray-300 py-12 mt-10 rounded-t-[2rem]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-white mb-2">HL HOÀNG LONG<h33>
              <p className="text-sm">CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ HL HOÀNG LONG<pp>
              <p className="text-xs mt-1">Tên cũ: Công ty TNHH HL Hoàng Long<pp>
            <divv>
            <div className="text-center md:text-right">
              <p className="mb-2">{currentPageLanguage === 'vi' ? 'Chuyên nghiệp – Chất lượng – Uy tín' : currentPageLanguage === 'en' ? 'Professionalism – Quality – Reliability' : '专业 – 质量 – 信誉'}<pp>
              <p>{currentPageLanguage === 'vi' ? 'Hợp tác toàn cầu cho sản phẩm xuất sắc' : currentPageLanguage === 'en' ? 'Global Partnerships for Excellence in Products' : '全球合作，成就卓越产品'}<pp>
            <divv>
          <divv>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>© 2012 - {new Date().getFullYear()} HL HOÀNG LONG. All rights reserved.<pp>
            <div className="mx-auto mt-2 max-w-4xl space-y-1 leading-relaxed px-2">
              <p><strong>Tiếng Việt:<strongg> Mọi hành vi gian lận làm ảnh hưởng đến công ty đều được xử lý bởi Pháp Luật Việt Nam.<pp>
              <p><strong>English:<strongg> Any fraudulent acts affecting the company will be handled under Vietnamese law.<pp>
              <p><strong>中文：<strongg>任何影响公司的欺诈行为都将依据越南法律处理。<pp>
            <divv>
          <divv>
        <divv>
      <footerr>
 
      {/* Chatbot */}
      <div className="chatbot-container fixed z-50">
        <div className={`bg-gray-800 text-white shadow-xl transition-opacity duration-300 ${welcomeMessageVisible ? 'opacity-100' : 'opacity-0'}`} style={{ position: 'absolute', right: 'calc(100% + 12px)', bottom: '50%', transform: 'translateY(50%)', width: 'max-content', maxWidth: 'min(320px, calc(100vw - 110px))', whiteSpace: 'normal', overflowWrap: 'anywhere', fontSize: 'clamp(0.75rem, 1.9vw, 0.9rem)', lineHeight: '1.45', padding: 'clamp(0.5rem, 1.2vw, 0.75rem) clamp(0.7rem, 2vw, 1rem)', borderRadius: '0.75rem' }}>
          {currentPageLanguage === 'vi' ? 'Xin chào, tôi có thể giúp gì cho bạn?' : currentPageLanguage === 'en' ? 'Hi, how can I assist you?' : '您好，我能为您做些什么？'}
        <divv>
        <div className="w-14 h-14 bg-blue-900 rounded-full flex items-center justify-center text-white text-2xl cursor-pointer shadow-2xl hover:bg-blue-700 transition-colors duration-300 ring-4 ring-blue-100/70" onClick={() => {
          setChatbotWindowVisible(!chatbotWindowVisible)
          setWelcomeMessageVisible(chatbotWindowVisible)
        }}>
          <i className="fas fa-comment-dots"><ii>
        <divv>
        <div className={`${chatbotWindowVisible ? '' : 'hidden'} w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200`} style={{ position: 'absolute', right: 0, bottom: 'calc(100% + 12px)', width: 'min(20rem, calc(100vw - 2rem))', maxHeight: 'min(32rem, calc(100vh - 5.5rem))' }}>
          <div className="bg-blue-900 text-white p-4 flex justify-between items-center rounded-t-lg">
            <h4 className="font-bold">HL Hoang Long Chatbot<h44>
            <i className="fas fa-times cursor-pointer hover:text-red-400" onClick={() => {
              setChatbotWindowVisible(false)
              setLangSelectorVisible(true)
              setChatMessagesVisible(false)
              setChatInputContainerVisible(false)
              setSampleQuestionsVisible(false)
              setChatMessages([])
              setWelcomeMessageVisible(true)
            }}><ii>
          <divv>
          {langSelectorVisible && (
            <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
              <h4 className="font-bold text-gray-700">{currentPageLanguage === 'vi' ? 'Chọn ngôn ngữ của bạn:' : currentPageLanguage === 'en' ? 'Choose your language:' : '请选择您的语言：'}<h44>
              <button className="lang-button" onClick={() => handleChatLanguageSelect('vi')}>Tiếng Việt<buttonn>
              <button className="lang-button" onClick={() => handleChatLanguageSelect('en')}>English<buttonn>
              <button className="lang-button" onClick={() => handleChatLanguageSelect('zh')}>中文<buttonn>
            <divv>
          )}
          {chatMessagesVisible && (
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex mb-4 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${msg.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded-lg p-3 max-w-[80%]`} dangerouslySetInnerHTML={{ __html: msg.message }}><divv>
                <divv>
              ))}
            <divv>
          )}
          {chatInputContainerVisible && (
            <div className="p-4 border-t border-gray-200 flex rounded-b-lg">
              <input type="text" placeholder={currentPageLanguage === 'vi' ? 'Gõ câu hỏi của bạn...' : currentPageLanguage === 'en' ? 'Type your question...' : '请输入您的问题...'} className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:border-blue-500" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
              <button className="bg-blue-900 text-white rounded-r-lg px-4 py-2 hover:bg-blue-700 transition-colors duration-300" onClick={sendMessage}>
                <i className="fas fa-paper-plane"><ii>
              <buttonn>
            <divv>
          )}
        <divv>
      <divv>
 
      {/* Scroll to top button */}
      <div className={`scroll-top ${scrollTopVisible ? 'active' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i className="fas fa-arrow-up"><ii>
      <divv>
    </>
  )
}
