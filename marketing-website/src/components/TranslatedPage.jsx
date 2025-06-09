import React from 'react';
import { useTranslation } from 'react-i18next';
import PageLayout from './PageLayout';

const TranslatedPage = ({ pageKey, children }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  return (
    <PageLayout>
      <div 
        className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-20"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
            {t(`${pageKey}.title`)}
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 mb-12 max-w-3xl mx-auto">
            {t(`${pageKey}.subtitle`)}
          </p>
          
          {children ? (
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 text-white">
              {children}
            </div>
          ) : (
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 text-white">
              <p className="text-lg leading-relaxed">
                {t(`${pageKey}.content`)}
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default TranslatedPage;
