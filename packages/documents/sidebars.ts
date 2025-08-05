import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

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
		"team_strengths",
		"service_design",
		"business_plan",
		{
			type: "category",
			label: "設計書",
			items: [
				"designs/api-design",
				"designs/db-design",
				"designs/feature-design",
			],
		},
		{
			type: "category",
			label: "仮説検証",
			items: [
				"hypothesis-validation/market_report",
				"hypothesis-validation/advertising_banners",
				"hypothesis-validation/banner_strategy",
				"hypothesis-validation/interview-materials-overview",
				"hypothesis-validation/interview-design-document",
				"hypothesis-validation/interview-guide",
				"hypothesis-validation/screening-questionnaire",
				"hypothesis-validation/interview-consent-form",
				"hypothesis-validation/interview-analysis-framework",
				"hypothesis-validation/interview-validation-report",
			],
		},
	],
};

export default sidebars;
