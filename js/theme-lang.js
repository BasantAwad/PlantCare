// Theme and Language Management System
// This file handles dark/light theme switching and multi-language support

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createThemeToggle();
    }

    applyTheme(theme) {
        const body = document.body;
        
        if (theme === 'dark') {
            body.classList.add('dark');
        } else {
            body.classList.remove('dark');
        }
        
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Update theme toggle icon
        this.updateThemeToggleIcon();
    }

    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    createThemeToggle() {
        // Remove existing toggle if it exists
        const existingToggle = document.getElementById('theme-toggle');
        if (existingToggle) {
            existingToggle.remove();
        }

        const toggle = document.createElement('button');
        toggle.id = 'theme-toggle';
        toggle.className = 'p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200';
        toggle.innerHTML = this.currentTheme === 'light' ? 
            '<i data-feather="moon" class="h-5 w-5"></i>' : 
            '<i data-feather="sun" class="h-5 w-5"></i>';
        
        toggle.onclick = () => this.toggle();
        
        // Find navigation and add toggle
        const nav = document.querySelector('nav .md\\:flex, nav .flex');
        if (nav) {
            nav.appendChild(toggle);
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }
    }

    updateThemeToggleIcon() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.innerHTML = this.currentTheme === 'light' ? 
                '<i data-feather="moon" class="h-5 w-5"></i>' : 
                '<i data-feather="sun" class="h-5 w-5"></i>';
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }
    }
}

class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = {
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.garden': 'My Garden',
                'nav.plantid': 'Plant ID',
                'nav.community': 'Community',
                'nav.stores': 'Stores',
                'nav.signin': 'Sign In',
                'nav.signup': 'Sign Up',
                
                // Common
                'common.loading': 'Loading...',
                'common.error': 'Error',
                'common.success': 'Success',
                'common.save': 'Save',
                'common.cancel': 'Cancel',
                'common.delete': 'Delete',
                'common.edit': 'Edit',
                'common.add': 'Add',
                
                // Plant ID
                'plantid.title': 'Plant Identification',
                'plantid.description': 'Upload a photo of your plant and our AI will identify it instantly, providing detailed care instructions.',
                'plantid.upload': 'Upload Your Plant Photo',
                'plantid.upload.description': 'Take a clear photo of your plant\'s leaves, flowers, or overall shape for the most accurate identification.',
                'plantid.tips': 'Tips for better identification:',
                'plantid.tip1': 'Place the plant against a neutral background',
                'plantid.tip2': 'Ensure good lighting',
                'plantid.tip3': 'Focus on distinctive features',
                
                // Chatbot
                'chatbot.title': 'Plant Care Assistant',
                'chatbot.placeholder': 'Ask about plant care...',
                'chatbot.welcome': 'Hi! I\'m your plant care assistant. I can help you with plant identification, care tips, disease diagnosis, and general gardening advice. What would you like to know?',
                
                // Store Locator
                'stores.title': 'Find Plant Stores',
                'stores.description': 'Discover local nurseries and garden centers near you',
                'stores.search': 'Search stores...',
                'stores.loading': 'Finding nearby stores...',
                'stores.noresults': 'No plant stores found in your area. Try expanding your search radius.',
                
                // Authentication
                'auth.signin.title': 'Sign in to your account',
                'auth.signup.title': 'Create your account',
                'auth.email': 'Email Address',
                'auth.password': 'Password',
                'auth.fullname': 'Full Name',
                'auth.confirm.password': 'Confirm Password',
                'auth.remember': 'Remember me',
                'auth.forgot': 'Forgot your password?',
                'auth.terms': 'I agree to the Terms of Service and Privacy Policy',
                'auth.signin': 'Sign In',
                'auth.signup': 'Sign Up',
                'auth.create.account': 'Create Account',
                'auth.already.have': 'Already have an account?',
                'auth.no.account': 'Don\'t have an account?',
                'auth.or.continue': 'Or continue with'
            },
            
            ar: {
                // Navigation
                'nav.home': 'الرئيسية',
                'nav.garden': 'حديقتي',
                'nav.plantid': 'تحديد النبات',
                'nav.community': 'المجتمع',
                'nav.stores': 'المتاجر',
                'nav.signin': 'تسجيل الدخول',
                'nav.signup': 'إنشاء حساب',
                
                // Common
                'common.loading': 'جاري التحميل...',
                'common.error': 'خطأ',
                'common.success': 'نجح',
                'common.save': 'حفظ',
                'common.cancel': 'إلغاء',
                'common.delete': 'حذف',
                'common.edit': 'تعديل',
                'common.add': 'إضافة',
                
                // Plant ID
                'plantid.title': 'تحديد النبات',
                'plantid.description': 'قم برفع صورة لنباتك وسيقوم الذكاء الاصطناعي بتحديده فوراً، مع تقديم تعليمات رعاية مفصلة.',
                'plantid.upload': 'رفع صورة نباتك',
                'plantid.upload.description': 'التقط صورة واضحة لأوراق نباتك أو أزهاره أو شكله العام للحصول على تحديد أكثر دقة.',
                'plantid.tips': 'نصائح للحصول على تحديد أفضل:',
                'plantid.tip1': 'ضع النبات على خلفية محايدة',
                'plantid.tip2': 'تأكد من الإضاءة الجيدة',
                'plantid.tip3': 'ركز على الميزات المميزة',
                
                // Chatbot
                'chatbot.title': 'مساعد رعاية النباتات',
                'chatbot.placeholder': 'اسأل عن رعاية النباتات...',
                'chatbot.welcome': 'مرحباً! أنا مساعد رعاية النباتات. يمكنني مساعدتك في تحديد النباتات ونصائح الرعاية وتشخيص الأمراض والنصائح العامة للبستنة. ماذا تريد أن تعرف؟',
                
                // Store Locator
                'stores.title': 'البحث عن متاجر النباتات',
                'stores.description': 'اكتشف المشاتل المحلية ومراكز الحدائق بالقرب منك',
                'stores.search': 'البحث في المتاجر...',
                'stores.loading': 'البحث عن المتاجر القريبة...',
                'stores.noresults': 'لم يتم العثور على متاجر نباتات في منطقتك. جرب توسيع نطاق البحث.',
                
                // Authentication
                'auth.signin.title': 'تسجيل الدخول إلى حسابك',
                'auth.signup.title': 'إنشاء حسابك',
                'auth.email': 'عنوان البريد الإلكتروني',
                'auth.password': 'كلمة المرور',
                'auth.fullname': 'الاسم الكامل',
                'auth.confirm.password': 'تأكيد كلمة المرور',
                'auth.remember': 'تذكرني',
                'auth.forgot': 'نسيت كلمة المرور؟',
                'auth.terms': 'أوافق على شروط الخدمة وسياسة الخصوصية',
                'auth.signin': 'تسجيل الدخول',
                'auth.signup': 'إنشاء حساب',
                'auth.create.account': 'إنشاء حساب',
                'auth.already.have': 'لديك حساب بالفعل؟',
                'auth.no.account': 'ليس لديك حساب؟',
                'auth.or.continue': 'أو متابعة مع'
            },
            
            ja: {
                // Navigation
                'nav.home': 'ホーム',
                'nav.garden': 'マイガーデン',
                'nav.plantid': '植物識別',
                'nav.community': 'コミュニティ',
                'nav.stores': 'ショップ',
                'nav.signin': 'サインイン',
                'nav.signup': 'サインアップ',
                
                // Common
                'common.loading': '読み込み中...',
                'common.error': 'エラー',
                'common.success': '成功',
                'common.save': '保存',
                'common.cancel': 'キャンセル',
                'common.delete': '削除',
                'common.edit': '編集',
                'common.add': '追加',
                
                // Plant ID
                'plantid.title': '植物識別',
                'plantid.description': '植物の写真をアップロードすると、AIが瞬時に識別し、詳細なケア手順を提供します。',
                'plantid.upload': '植物の写真をアップロード',
                'plantid.upload.description': '最も正確な識別のために、植物の葉、花、または全体の形の明確な写真を撮ってください。',
                'plantid.tips': 'より良い識別のためのヒント：',
                'plantid.tip1': '植物を中性の背景に置く',
                'plantid.tip2': '良い照明を確保する',
                'plantid.tip3': '特徴的な部分に焦点を当てる',
                
                // Chatbot
                'chatbot.title': '植物ケアアシスタント',
                'chatbot.placeholder': '植物ケアについて質問...',
                'chatbot.welcome': 'こんにちは！私は植物ケアアシスタントです。植物の識別、ケアのヒント、病気の診断、一般的なガーデニングのアドバイスをお手伝いできます。何を知りたいですか？',
                
                // Store Locator
                'stores.title': '植物ショップを探す',
                'stores.description': 'お近くのナーサリーやガーデンセンターを発見',
                'stores.search': 'ショップを検索...',
                'stores.loading': '近くのショップを検索中...',
                'stores.noresults': 'お住まいの地域で植物ショップが見つかりませんでした。検索範囲を広げてみてください。',
                
                // Authentication
                'auth.signin.title': 'アカウントにサインイン',
                'auth.signup.title': 'アカウントを作成',
                'auth.email': 'メールアドレス',
                'auth.password': 'パスワード',
                'auth.fullname': 'フルネーム',
                'auth.confirm.password': 'パスワード確認',
                'auth.remember': 'ログイン状態を保持',
                'auth.forgot': 'パスワードを忘れましたか？',
                'auth.terms': '利用規約とプライバシーポリシーに同意します',
                'auth.signin': 'サインイン',
                'auth.signup': 'サインアップ',
                'auth.create.account': 'アカウント作成',
                'auth.already.have': 'すでにアカウントをお持ちですか？',
                'auth.no.account': 'アカウントをお持ちでない方は？',
                'auth.or.continue': 'または以下で続行'
            }
        };
        
        this.init();
    }

    init() {
        this.applyLanguage(this.currentLanguage);
        this.createLanguageSelector();
    }

    applyLanguage(language) {
        this.currentLanguage = language;
        localStorage.setItem('language', language);
        
        // Update HTML lang attribute
        document.documentElement.lang = language;
        
        // Update text direction for RTL languages
        if (language === 'ar') {
            document.documentElement.dir = 'rtl';
            document.body.classList.add('rtl');
        } else {
            document.documentElement.dir = 'ltr';
            document.body.classList.remove('rtl');
        }
        
        // Translate all elements with data-translate attribute
        this.translateElements();
        
        // Update language selector
        this.updateLanguageSelector();
    }

    translate(key) {
        return this.translations[this.currentLanguage]?.[key] || key;
    }

    translateElements() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.translate(key);
            
            if (element.tagName === 'INPUT' && (element.type === 'submit' || element.type === 'button')) {
                element.value = translation;
            } else if (element.hasAttribute('placeholder')) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
    }

    createLanguageSelector() {
        // Remove existing selector if it exists
        const existingSelector = document.getElementById('language-selector');
        if (existingSelector) {
            existingSelector.remove();
        }

        const selector = document.createElement('div');
        selector.id = 'language-selector';
        selector.className = 'relative inline-block text-left';

        const languages = {
            'en': { name: 'English', flag: '🇺🇸' },
            'ar': { name: 'العربية', flag: '🇸🇦' },
            'ja': { name: '日本語', flag: '🇯🇵' }
        };

        selector.innerHTML = `
            <div>
                <button type="button" class="inline-flex justify-center w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" id="language-button">
                    ${languages[this.currentLanguage].flag} ${languages[this.currentLanguage].name}
                    <i data-feather="chevron-down" class="ml-2 h-4 w-4"></i>
                </button>
            </div>
            <div class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none hidden" id="language-menu">
                <div class="py-1" role="menu">
                    ${Object.entries(languages).map(([code, lang]) => `
                        <button class="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left ${code === this.currentLanguage ? 'bg-green-50 dark:bg-green-900' : ''}" 
                                onclick="window.languageManager.selectLanguage('${code}')">
                            <span class="mr-3">${lang.flag}</span>
                            ${lang.name}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Find navigation and add selector
        const nav = document.querySelector('nav .md\\:flex, nav .flex');
        if (nav) {
            nav.appendChild(selector);
            
            // Add click handler for dropdown
            const button = document.getElementById('language-button');
            const menu = document.getElementById('language-menu');
            
            button.addEventListener('click', () => {
                menu.classList.toggle('hidden');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!selector.contains(e.target)) {
                    menu.classList.add('hidden');
                }
            });
            
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }
    }

    updateLanguageSelector() {
        const button = document.getElementById('language-button');
        const menu = document.getElementById('language-menu');
        
        if (button && menu) {
            const languages = {
                'en': { name: 'English', flag: '🇺🇸' },
                'ar': { name: 'العربية', flag: '🇸🇦' },
                'ja': { name: '日本語', flag: '🇯🇵' }
            };
            
            button.innerHTML = `
                ${languages[this.currentLanguage].flag} ${languages[this.currentLanguage].name}
                <i data-feather="chevron-down" class="ml-2 h-4 w-4"></i>
            `;
            
            // Update active state
            const menuItems = menu.querySelectorAll('button');
            menuItems.forEach(item => {
                const code = item.getAttribute('onclick').match(/'([^']+)'/)[1];
                if (code === this.currentLanguage) {
                    item.classList.add('bg-green-50', 'dark:bg-green-900');
                } else {
                    item.classList.remove('bg-green-50', 'dark:bg-green-900');
                }
            });
            
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }
    }

    selectLanguage(language) {
        this.applyLanguage(language);
        const menu = document.getElementById('language-menu');
        if (menu) {
            menu.classList.add('hidden');
        }
    }

    // Add translation method for dynamic content
    addTranslation(key, translations) {
        Object.keys(translations).forEach(lang => {
            if (!this.translations[lang]) {
                this.translations[lang] = {};
            }
            this.translations[lang][key] = translations[lang];
        });
    }
}

// Initialize theme and language managers
document.addEventListener('DOMContentLoaded', function() {
    window.themeManager = new ThemeManager();
    window.languageManager = new LanguageManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, LanguageManager };
}
