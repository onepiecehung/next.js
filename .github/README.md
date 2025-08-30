# 🚀 GitHub Actions Workflows

This repository includes comprehensive CI/CD pipelines for Next.js development.

## 📋 Available Workflows

### 1. **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
**Triggers:** Push to `main`/`develop`, Pull Requests
**Purpose:** Main development pipeline

**Jobs:**
- ✅ **Lint & Type Check** - ESLint, TypeScript validation
- 🏗️ **Build & Test** - Build app, run tests
- 🔒 **Security Audit** - npm audit, vulnerability scanning
- 🚀 **Deploy Staging** - Auto-deploy to staging (develop branch)
- 🚀 **Deploy Production** - Auto-deploy to production (main branch)

### 2. **Pull Request Checks** (`.github/workflows/pull-request.yml`)
**Triggers:** Pull Requests to `main`/`develop`
**Purpose:** Code quality assurance

**Jobs:**
- 🧹 **Code Quality** - Linting, formatting, console.log detection
- 📦 **Bundle Analysis** - Bundle size monitoring
- ⚡ **Performance Tests** - Lighthouse CI integration
- 💬 **PR Comments** - Automated feedback on PRs

### 3. **Security Checks** (`.github/workflows/security.yml`)
**Triggers:** Daily schedule, Push, Pull Requests
**Purpose:** Security monitoring

**Jobs:**
- 🔍 **Dependency Scan** - npm audit, Snyk integration
- 🛡️ **Code Security** - Semgrep analysis
- 📦 **Dependency Updates** - Outdated package detection
- 🐳 **Container Security** - Docker vulnerability scanning

### 4. **Performance Monitoring** (`.github/workflows/performance.yml`)
**Triggers:** Weekly schedule, Push to main, Manual dispatch
**Purpose:** Performance tracking

**Jobs:**
- 📊 **Lighthouse CI** - Performance scoring
- 📦 **Bundle Analysis** - Size monitoring with limits
- 📈 **Core Web Vitals** - FCP, LCP, FID, CLS tracking
- 🔍 **Regression Detection** - Performance change monitoring

## 🛠️ Setup Requirements

### **Required Secrets:**
```bash
# For Snyk security scanning
SNYK_TOKEN=your_snyk_token

# For Lighthouse CI
LHCI_GITHUB_APP_TOKEN=your_lhci_token

# For deployments (add your deployment tokens)
DEPLOY_STAGING_TOKEN=your_staging_token
DEPLOY_PRODUCTION_TOKEN=your_production_token
```

### **Required yarn Scripts:**
```json
{
  "scripts": {
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json}\"",
    "test": "jest",
    "build": "next build",
    "start": "next start"
  }
}
```

## 🔧 Customization

### **Bundle Size Limits:**
Edit `.github/workflows/performance.yml`:
```bash
JS_LIMIT=500000  # 500KB JavaScript limit
CSS_LIMIT=100000  # 100KB CSS limit
```

### **Performance Thresholds:**
Edit `.github/workflows/performance.yml`:
```bash
# Add your performance thresholds
FCP_LIMIT=1800    # 1.8s First Contentful Paint
LCP_LIMIT=2500    # 2.5s Largest Contentful Paint
```

### **Deployment Commands:**
Edit `.github/workflows/ci-cd.yml`:
```bash
# Replace placeholder commands with your actual deployment
npm run deploy:staging
npm run deploy:production
```

## 📊 Workflow Status

- 🟢 **Green** - All checks passed
- 🟡 **Yellow** - Some checks pending
- 🔴 **Red** - Checks failed, requires attention

## 🚨 Troubleshooting

### **Common Issues:**

1. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Security Failures:**
   - Run `npm audit fix` locally
   - Update vulnerable dependencies
   - Check for hardcoded secrets

3. **Performance Failures:**
   - Optimize bundle size
   - Improve Core Web Vitals
   - Check for performance regressions

### **Local Testing:**
```bash
# Test workflows locally
yarn lint
yarn type-check
yarn build
yarn test
```

## 📈 Benefits

- ✅ **Automated Quality Checks** - No manual oversight needed
- 🔒 **Security First** - Continuous vulnerability scanning
- ⚡ **Performance Monitoring** - Track Core Web Vitals
- 🚀 **Fast Deployments** - Automated CI/CD pipeline
- 📊 **Transparent Feedback** - Clear status reporting
- 🔄 **Consistent Process** - Standardized development workflow

## 🤝 Contributing

When contributing to this repository:

1. **Create Feature Branch** from `develop`
2. **Make Changes** following coding standards
3. **Push Changes** - workflows run automatically
4. **Create Pull Request** - quality checks run
5. **Address Feedback** - fix any failing checks
6. **Merge** - after approval and all checks pass

---

*These workflows ensure high code quality, security, and performance for your Next.js application.*
