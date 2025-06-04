# msal-auth-proxy-env-angular18

A clean Angular 18 boilerplate that ships with:

- **Azure AD MSAL v3** authentication (redirect flow, interceptors, guards, broadcast service).
- **Multiple environment files** (`dev`, `devproxy`, `homolog`, `production`) ready for CI pipelines.
- **Local proxy configuration** (`proxy.conf.json`) to call secured back-end routes without CORS hassle.
- **PrimeNG, PrimeFlex & PrimeIcons** pre-wired, including Dialog & Button examples.
- **Strict mode + Stand-alone components** (no `AppModule`), following modern Angular best practices.
- **Vite dev-server** under the hood for lightning-fast HMR builds.

---

## ✨ Features

| Category            | Details                                                                      |
| ------------------- | ---------------------------------------------------------------------------- |
| **Auth**            | MSAL 3, redirect login/logout, token-silent refresh, active-account handling |
| **Session Timeout** | Auto-logout after 40 min of inactivity, warning dialogs at T-5 min           |
| **Environments**    | File replacements for `devproxy`, `homolog` and `production`                 |
| **Proxy**           | `/api/**` → configurable target (example points to Accenture Onco APIs)      |
| **UI/UX**           | PrimeNG Dialogs + Buttons, global i18n strings (pt-BR default)               |
| **Tooling**         | ESLint strict mode, Angular CLI cache, npm scripts shortcuts                 |

---

## 🚀 Getting Started

```bash
git clone https://github.com/<org>/msal-auth-proxy-env-angular18.git
cd msal-auth-proxy-env-angular18
npm install
```
