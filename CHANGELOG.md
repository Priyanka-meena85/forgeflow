# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2026-11-20

### Added
- Blog content hub with 6 pillar articles on industrial AEO strategy
- Partner & agency reseller program page with 3-tier commission model
- ForgeFlow vs Clearscope comparison landing page
- Case studies page with 3 detailed industrial ROI benchmarks
- Demo booking page with qualification form and industry selector
- GDPR cookie consent banner with 3-category preference management
- Privacy Policy and Terms of Service legal pages
- Stripe checkout integration with subscription billing API routes
- Dynamic sitemap.xml generation for all public routes + 7 industry verticals
- Dynamic OpenGraph image generation for social sharing
- PWA manifest for installability
- Route-level loading skeleton placeholders for all major pages
- Standalone login and registration pages at /auth/login and /auth/register
- Engineering changelog page at /changelog
- .env.example with all environment variable documentation
- .well-known/security.txt vulnerability disclosure file
- GitHub Actions CI pipeline (typecheck, lint, build)
- Contact Sales API route for enterprise lead capture

### Changed
- PublicNavbar "Book A Demo" CTA now routes to /demo page instead of dead modal
- Pricing page CTAs now trigger Stripe checkout flow instead of /?mode=register
- next.config.ts now includes security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- Root layout now includes CookieConsentBanner and AnalyticsScript components

### Fixed
- Pricing page CTA dead ends — all buttons now route to functional checkout or demo flows

## [1.4.0] - 2026-11-15

### Added
- Industry Sector Interactive Workbench with 6-tab deep-dive for all 7 verticals
- Integrations page with webhook dispatch simulator and category filter pills
- Features page redesign with 4-column architecture showcase and 23-module audit matrix

### Changed
- Industries page redesign with live search filter and AI failure modes section
- PublicNavbar accessibility improvements (aria-labels, semantic nav, keyboard nav)
- PublicFooter dynamic copyright year and newsletter email validation

### Fixed
- Pricing page nested `<tr>` invalid HTML resolved with Fragment wrapper

## [1.3.0] - 2026-10-28

### Added
- Live AI Answer Engine Simulator with multi-engine support
- DIN / JIS Standards Crosswalk module for global alloy equivalence tables
- 3D CAD exploded view schema inspector with STEP/IGES boundary parsing

### Changed
- AEO Citation Monitor now tracks share of voice across 3 LLM engines

## [1.2.0] - 2026-09-15

### Added
- Transparent pricing page with annual/monthly toggle and interactive ROI calculator
- SCIM 2.0 enterprise user provisioning and deprovisioning dashboard
- Publishing Kanban board with chief reliability engineer sign-off gate

### Changed
- Multi-tenant PostgreSQL Row-Level Security hardening

## [1.1.0] - 2026-08-20

### Added
- Multi-brand domain manager with subdomain routing and rel=canonical
- RFQ lead scoring dashboard with reverse-IP buyer intent discovery
- Geographic Share of Voice tracker beta for regional market analysis

## [1.0.0] - 2026-07-01

### Added
- Initial public launch with 7 pre-built industrial vertical taxonomies
- AEO content engine with deterministic JSON-LD TechArticle syndication
- Multi-tenant workspace architecture with SAML 2.0 SSO and Okta
- 23-module deep audit system for production-grade content verification
