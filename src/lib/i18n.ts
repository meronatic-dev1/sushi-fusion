export type Language = 'en' | 'ar';

type Translations = Record<Language, Record<string, string>>;

const translations: Translations = {
  en: {
    // Header
    'header.mode.delivery': 'Delivery',
    'header.mode.pickup': 'Pickup',
    'header.mode.dineIn': 'Dine-In',
    'header.selectLocation': 'Select Location →',
    'header.searchPlaceholder': 'Search menu...',
    'header.login': 'LOGIN',

    // Categories (chips)
    'category.special': 'Special Offers',
    'category.lovers': 'Lovers Box',
    'category.sakura': 'Sakura Combos',
    'category.cooked': 'Cooked Box',
    'category.vip': 'VIP Moriwase',
    'category.maki': 'Hoso Maki',
    'category.temaki': 'Temaki Handroll Sushi',
    'category.sashimi': 'Sashimi',
    'category.nigiri': 'Nigiri',
    'category.starters': 'Starters',
    'category.noodles': 'Noodles',
    'category.beverages': 'Beverages',
    'category.poke': 'Poke Bowl',
    'category.salad': 'Salad',
    'category.curry': 'Curry & Fried Rice',

    // Section titles
    'categoryTitle.special': 'Special Offers',
    'categoryTitle.lovers': 'Signature & Lovers Box',
    'categoryTitle.sakura': 'Sakura Combos',
    'categoryTitle.cooked': 'Cooked Box',
    'categoryTitle.vip': 'Fusion VIP Moriwase',
    'categoryTitle.maki': 'Hoso Maki',
    'categoryTitle.temaki': 'Temaki Handroll Sushi',
    'categoryTitle.sashimi': 'Sashimi & Sashimi Sets',
    'categoryTitle.nigiri': 'Nigiri Selection',
    'categoryTitle.starters': 'Starters & Soup',
    'categoryTitle.noodles': 'Noodles',
    'categoryTitle.beverages': 'Beverages',
    'categoryTitle.poke': 'Poke Bowl',
    'categoryTitle.salad': 'Salad',
    'categoryTitle.curry': 'Japanese Curry & Fried Rice',

    // Cart
    'cart.title': 'Your Order',
    'cart.emptyTitle': 'Your Cart is Empty',
    'cart.emptyBody': 'Please add some items from the menu.',
    'cart.subtotal': 'Subtotal',
    'cart.delivery': 'Delivery',
    'cart.deliveryFree': 'FREE',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout →',

    // Search
    'search.noResultsPrefix': 'No items found for',

    // Location modal
    'location.title': 'Select Location',
    'location.selectedPrefix': 'You have selected',
    'location.bodySuffix': 'Please provide your location details.',
    'location.useMyLocation': 'USE MY LOCATION',
    'location.city': 'City',
    'location.store': 'Store',
    'location.selectYourCity': 'Select your city',
    'location.selectStore': 'Select a store',
    'location.proceed': 'PROCEED',
  },
  ar: {
    // Header
    'header.mode.delivery': 'توصيل',
    'header.mode.pickup': 'استلام',
    'header.mode.dineIn': 'تناول في المطعم',
    'header.selectLocation': 'اختر الموقع →',
    'header.searchPlaceholder': 'ابحث في القائمة...',
    'header.login': 'تسجيل الدخول',

    // Categories (chips)
    'category.special': 'العروض الخاصة',
    'category.lovers': 'صناديق العشّاق',
    'category.sakura': 'تشكيلة ساكورا',
    'category.cooked': 'صندوق الأطباق المطهية',
    'category.vip': 'في آي بي موريواسي',
    'category.maki': 'هوسو ماكي',
    'category.temaki': 'تيمّاكي سوشي',
    'category.sashimi': 'ساشيمي',
    'category.nigiri': 'نيجيري',
    'category.starters': 'المقبلات',
    'category.noodles': 'النودلز',
    'category.beverages': 'المشروبات',
    'category.poke': 'بول بوكي',
    'category.salad': 'السلطات',
    'category.curry': 'الكاري والأرز المقلي',

    // Section titles
    'categoryTitle.special': 'العروض الخاصة',
    'categoryTitle.lovers': 'صناديق التوقيع والعشّاق',
    'categoryTitle.sakura': 'تشكيلة ساكورا',
    'categoryTitle.cooked': 'صندوق السوشي المطهو',
    'categoryTitle.vip': 'في آي بي موريواسي',
    'categoryTitle.maki': 'هوسو ماكي',
    'categoryTitle.temaki': 'تيمّاكي هاند رول',
    'categoryTitle.sashimi': 'ساشيمي وتشكيلة الساشيمي',
    'categoryTitle.nigiri': 'تشكيلة النيجيري',
    'categoryTitle.starters': 'المقبلات والحساء',
    'categoryTitle.noodles': 'النودلز',
    'categoryTitle.beverages': 'المشروبات',
    'categoryTitle.poke': 'بول بوكي',
    'categoryTitle.salad': 'السلطات',
    'categoryTitle.curry': 'الكاري الياباني والأرز المقلي',

    // Cart
    'cart.title': 'طلبك',
    'cart.emptyTitle': 'سلة التسوق فارغة',
    'cart.emptyBody': 'الرجاء إضافة بعض العناصر من القائمة.',
    'cart.subtotal': 'الإجمالي الفرعي',
    'cart.delivery': 'التوصيل',
    'cart.deliveryFree': 'مجاني',
    'cart.total': 'الإجمالي',
    'cart.checkout': 'إتمام الطلب →',

    // Search
    'search.noResultsPrefix': 'لا توجد عناصر لـ',

    // Location modal
    'location.title': 'اختيار الموقع',
    'location.selectedPrefix': 'لقد اخترت',
    'location.bodySuffix': 'يرجى إدخال تفاصيل موقعك.',
    'location.useMyLocation': 'استخدام موقعي الحالي',
    'location.city': 'المدينة',
    'location.store': 'الفرع',
    'location.selectYourCity': 'اختر المدينة',
    'location.selectStore': 'اختر الفرع',
    'location.proceed': 'متابعة',
  },
};

export function t(language: Language, key: string): string {
  const langTable = translations[language];
  if (langTable && key in langTable) return langTable[key];
  const fallback = translations.en[key];
  return fallback ?? key;
}

