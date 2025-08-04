import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '🚀 めぐりあいチームの瞬作プロダクト開発',
      items: ['team_strengths'],
    },
    {
      type: 'category',
      label: '事業仮説検証計画',
      items: ['business_plan'],
    },
    {
      type: 'category',
      label: 'サービス設計',
      items: ['service_design'],
    },
    {
      type: 'category',
      label: 'インタビュー設計',
      items: [
        'designs/interview-materials-overview',
        'designs/interview-design-document',
        'designs/interview-guide',
        'designs/screening-questionnaire',
        'designs/interview-consent-form',
        'designs/interview-analysis-framework',
        'designs/interview-validation-report',
      ],
    },
    {
      type: 'category',
      label: '参考資料',
      items: [
        'references/market_report',
        'references/advertising_banners',
        'references/banner_strategy',
      ],
    },
  ],
};

export default sidebars;
