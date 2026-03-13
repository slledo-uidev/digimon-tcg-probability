# Plan de Subida a Producción - Digimon TCG Probability

**Fecha de creación:** 13 de Marzo de 2026  
**Versión actual:** 0.0.0  
**Framework:** Angular 16.2.0  
**Estado del proyecto:** ✅ Sin errores de compilación

---

## 📊 Análisis del Estado Actual

### ✅ Fortalezas del Proyecto

1. **Arquitectura Sólida**
   - Refactorización reciente con Atomic Design
   - Componentes modulares y reutilizables
   - Servicios bien definidos (Calculator, Theme)
   - Sistema de tokens y variables de diseño centralizado

2. **Testing**
   - 7 archivos de specs (servicios + componentes)
   - Framework Karma/Jasmine configurado
   - README indica 25 tests pasando

3. **UX/UI Pulido**
   - Modo oscuro implementado
   - Responsive móvil completo
   - Sistema de colores semántico
   - Animaciones y transiciones

4. **Sin Errores**
   - Compilación limpia
   - TypeScript configurado correctamente
   - Código sin warnings críticos

### ⚠️ Áreas a Revisar Antes de Producción

1. **Metadatos y SEO** (index.html básico)
2. **Optimizaciones de Build** (configuración production limitada)
3. **Assets y Recursos** (favicon, imágenes, fonts)
4. **Environment Variables** (no hay configuración de entornos)
5. **Analytics y Monitoreo** (sin implementar)
6. **Documentación de Deployment** (sin instrucciones)
7. **Versionado** (package.json en 0.0.0)

---

## 🎯 Plan de Acción Paso a Paso

### FASE 1: Preparación del Código (PRE-DEPLOYMENT)

#### ✅ Paso 1.1: Actualizar Versión y Metadatos

**Archivos a modificar:**
- `package.json`
- `src/index.html`

**Acciones:**
```json
// package.json
{
  "name": "digimon-tcg-probability",
  "version": "1.0.0",
  "description": "Calculadora de probabilidades hipergeométricas para Digimon TCG",
  "author": "Tu Nombre/Organización",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "URL_DEL_REPO"
  }
}
```

```html
<!-- src/index.html -->
<head>
  <meta charset="utf-8">
  <title>Digimon TCG - Calculadora de Probabilidades</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Calculadora oficial de probabilidades hipergeométricas para Digimon Trading Card Game. Calcula tus odds en búsquedas con 6 tipos predefinidos.">
  <meta name="keywords" content="digimon, tcg, calculadora, probabilidades, hipergeométrica, trading card game">
  <meta name="author" content="Tu Nombre">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Digimon TCG - Calculadora de Probabilidades">
  <meta property="og:description" content="Calcula probabilidades exactas para búsquedas en Digimon TCG">
  <meta property="og:image" content="/assets/og-image.png">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Digimon TCG - Calculadora de Probabilidades">
  <meta name="twitter:description" content="Calcula probabilidades exactas para búsquedas en Digimon TCG">
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
  
  <!-- Theme Color -->
  <meta name="theme-color" content="#78c3b4">
</head>
```

**Comando para ejecutar:**
```bash
# Ninguno, edición manual de archivos
```

---

#### ✅ Paso 1.2: Crear Configuración de Entornos

**Crear estructura de environments:**

```bash
# Crear carpeta environments
New-Item -Path "src/environments" -ItemType Directory -Force
```

**Archivos a crear:**

**`src/environments/environment.ts`** (Desarrollo)
```typescript
export const environment = {
  production: false,
  version: '1.0.0',
  appName: 'Digimon TCG Probability Calculator (DEV)',
  analytics: {
    enabled: false
  }
};
```

**`src/environments/environment.prod.ts`** (Producción)
```typescript
export const environment = {
  production: true,
  version: '1.0.0',
  appName: 'Digimon TCG Probability Calculator',
  analytics: {
    enabled: true,
    trackingId: 'G-XXXXXXXXXX' // Google Analytics 4
  }
};
```

**Modificar `angular.json`:**
```json
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ],
    "budgets": [...],
    "outputHashing": "all"
  }
}
```

---

#### ✅ Paso 1.3: Optimizar Configuración de Build

**Modificar `angular.json` - configuración production:**

```json
"production": {
  "fileReplacements": [...],
  "optimization": true,
  "outputHashing": "all",
  "sourceMap": false,
  "namedChunks": false,
  "extractLicenses": true,
  "vendorChunk": false,
  "buildOptimizer": true,
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kb",
      "maximumError": "1mb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "10kb",
      "maximumError": "15kb"
    }
  ]
}
```

**Optimizaciones adicionales:**
- `vendorChunk: false` - Reduce requests HTTP
- `buildOptimizer: true` - Tree-shaking avanzado
- `sourceMap: false` - Sin archivos .map en producción

---

#### ✅ Paso 1.4: Verificar y Completar Assets

**Assets necesarios:**

1. **Favicon completo** (`src/assets/`)
   - `favicon.ico` (16x16, 32x32, 48x48)
   - `apple-touch-icon.png` (180x180)
   - `favicon-32x32.png`
   - `favicon-16x16.png`

2. **Imágenes Open Graph**
   - `og-image.png` (1200x630) para redes sociales

3. **Manifest.json** para PWA (opcional pero recomendado)

**Crear `src/manifest.json`:**
```json
{
  "name": "Digimon TCG Probability Calculator",
  "short_name": "Digimon Calc",
  "theme_color": "#78c3b4",
  "background_color": "#ffffff",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "assets/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Añadir al `index.html`:**
```html
<link rel="manifest" href="manifest.json">
```

**Comando:**
```bash
# Generar favicons con herramienta online:
# https://realfavicongenerator.net/
# Descargar y colocar en src/assets/
```

---

#### ✅ Paso 1.5: Ejecutar Tests

**Verificar que todos los tests pasen:**

```bash
# Ejecutar tests
npm test

# Ejecutar con coverage
ng test --code-coverage --watch=false

# Revisar cobertura en coverage/index.html
```

**Criterios mínimos:**
- ✅ Todos los tests pasando
- ✅ Cobertura > 80% en servicios críticos (calculator.service)
- ✅ Sin warnings de deprecation críticos

---

#### ✅ Paso 1.6: Build de Producción Local

**Generar build optimizado:**

```bash
# Build de producción
npm run build

# Verificar output en dist/digimon-tcg-probability/
# Revisar tamaños de bundles
```

**Verificar bundles:**
- `main.*.js` < 500kb (ideal < 300kb)
- `polyfills.*.js` < 150kb
- Total < 1MB inicial

**Servir build localmente:**
```bash
# Instalar servidor local (si no está)
npm install -g http-server

# Servir desde dist
cd dist/digimon-tcg-probability
http-server -p 8080

# Abrir http://localhost:8080 y probar:
# - Funcionalidad completa
# - Responsive en móvil
# - Modo oscuro
# - Todas las búsquedas
```

---

### FASE 2: Optimizaciones Opcionales (NICE TO HAVE)

#### ⭐ Paso 2.1: Añadir Google Analytics (Opcional)

**Si quieres analytics:**

1. Crear cuenta en [Google Analytics 4](https://analytics.google.com/)
2. Obtener Tracking ID (G-XXXXXXXXXX)
3. Añadir a `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

#### ⭐ Paso 2.2: Añadir robots.txt y sitemap.xml

**Crear `src/robots.txt`:**
```
User-agent: *
Allow: /

Sitemap: https://tu-dominio.com/sitemap.xml
```

**Crear `src/sitemap.xml`:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tu-dominio.com/</loc>
    <lastmod>2026-03-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

**Añadir a `angular.json` assets:**
```json
"assets": [
  "src/favicon.ico",
  "src/assets",
  "src/robots.txt",
  "src/sitemap.xml",
  "src/manifest.json"
]
```

---

#### ⭐ Paso 2.3: Configurar Service Worker (PWA)

**Convertir a PWA para funcionar offline:**

```bash
# Añadir PWA capabilities
ng add @angular/pwa --project digimon-tcg-probability

# Esto añadirá automáticamente:
# - ngsw-config.json
# - Service worker
# - Manifest.json
# - Iconos PWA
```

**Beneficios:**
- Funciona offline
- Instalable en dispositivos
- Mejora performance con caché

---

### FASE 3: Deployment (SUBIDA A PRODUCCIÓN)

#### 🚀 Opción A: GitHub Pages (GRATIS)

**Ideal para:** Proyectos públicos, hosting gratuito, fácil setup.

**Pasos:**

1. **Instalar Angular CLI GitHub Pages:**
```bash
npm install -g angular-cli-ghpages
```

2. **Crear repositorio en GitHub** (si no existe)

3. **Build con base-href correcto:**
```bash
ng build --base-href /nombre-repo/
```

4. **Deploy:**
```bash
npx angular-cli-ghpages --dir=dist/digimon-tcg-probability
```

5. **Configurar GitHub Pages:**
   - Ir a Settings > Pages
   - Source: gh-pages branch
   - URL: `https://tu-usuario.github.io/nombre-repo/`

**Actualizar deployments futuros:**
```bash
npm run build
npx angular-cli-ghpages --dir=dist/digimon-tcg-probability
```

---

#### 🚀 Opción B: Netlify (GRATIS + Nivel Pro)

**Ideal para:** CI/CD automático, dominio custom, formularios, funciones serverless.

**Pasos:**

1. **Crear `netlify.toml` en raíz:**
```toml
[build]
  publish = "dist/digimon-tcg-probability"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Conectar con Netlify:**
   - Ir a [netlify.com](https://netlify.com)
   - "Add new site" > "Import from Git"
   - Seleccionar repo GitHub
   - Build command: `npm run build`
   - Publish directory: `dist/digimon-tcg-probability`

3. **Deploy automático:**
   - Cada push a main = deploy automático
   - Preview deployments en PRs

**Dominio custom:**
- Netlify te da: `nombre-random.netlify.app`
- Puedes configurar dominio propio en Settings > Domain management

---

#### 🚀 Opción C: Vercel (GRATIS + Nivel Pro)

**Ideal para:** Similar a Netlify, muy rápido, excelente DX.

**Pasos:**

1. **Crear `vercel.json` en raíz:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/digimon-tcg-probability",
  "framework": "angular",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

2. **Deploy con Vercel CLI:**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

3. **O conectar con GitHub:**
   - Ir a [vercel.com](https://vercel.com)
   - Import Git Repository
   - Seleccionar proyecto
   - Framework preset: Angular
   - Deploy automático cada push

---

#### 🚀 Opción D: Firebase Hosting (GRATIS + Nivel Pay-as-you-go)

**Ideal para:** Integración con Firebase services, CDN global, SSL automático.

**Pasos:**

1. **Instalar Firebase CLI:**
```bash
npm install -g firebase-tools
```

2. **Login y init:**
```bash
firebase login
firebase init hosting
```

3. **Configurar `firebase.json`:**
```json
{
  "hosting": {
    "public": "dist/digimon-tcg-probability",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

4. **Deploy:**
```bash
npm run build
firebase deploy --only hosting
```

**URL:** `https://tu-proyecto.web.app`

---

### FASE 4: Post-Deployment

#### ✅ Paso 4.1: Verificación en Producción

**Checklist post-deploy:**

- [ ] ✅ App carga correctamente
- [ ] ✅ Todas las funcionalidades funcionan
- [ ] ✅ Responsive en móvil (Chrome DevTools)
- [ ] ✅ Modo oscuro funciona
- [ ] ✅ Theme persiste (localStorage)
- [ ] ✅ Cálculos dan resultados correctos
- [ ] ✅ No hay errores en consola
- [ ] ✅ Imágenes/assets cargan
- [ ] ✅ SEO: meta tags presentes (ver source)
- [ ] ✅ Performance: Lighthouse score > 90

**Herramientas de testing:**

1. **Lighthouse (Chrome DevTools)**
   - Performance: > 90
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90

2. **Mobile-Friendly Test**
   - https://search.google.com/test/mobile-friendly

3. **PageSpeed Insights**
   - https://pagespeed.web.dev/

---

#### ✅ Paso 4.2: Configurar Monitoreo (Opcional)

**Opciones gratuitas:**

1. **Google Analytics** (ya configurado en Paso 2.1)
2. **Uptime Robot** (monitoreo de disponibilidad)
   - https://uptimerobot.com/
   - Ping cada 5 minutos
   - Alertas por email si cae

3. **Sentry** (error tracking)
   ```bash
   npm install @sentry/angular
   ```

---

#### ✅ Paso 4.3: Documentación Final

**Actualizar README.md:**

```markdown
## 🚀 Producción

La aplicación está desplegada en: [URL DE PRODUCCIÓN]

### Build Local
\`\`\`bash
npm run build
\`\`\`

### Deploy
\`\`\`bash
# [COMANDOS ESPECÍFICOS DE TU PLATAFORMA]
\`\`\`
```

**Crear archivo `DEPLOYMENT.md`:**
- Documentar proceso completo
- Comandos necesarios
- Credenciales (sin passwords, solo referencias)
- Troubleshooting común

---

## 📋 Checklist Final Completo

### Pre-Deploy
- [ ] Actualizar version a 1.0.0 en package.json
- [ ] Añadir meta tags en index.html
- [ ] Crear environments (environment.ts, environment.prod.ts)
- [ ] Optimizar configuración production en angular.json
- [ ] Verificar/crear assets (favicon, og-image)
- [ ] Ejecutar tests: `npm test`
- [ ] Build local exitoso: `npm run build`
- [ ] Probar build localmente (http-server)
- [ ] Sin errores en consola
- [ ] Responsive funciona
- [ ] Modo oscuro funciona

### Deploy
- [ ] Elegir plataforma (GitHub Pages / Netlify / Vercel / Firebase)
- [ ] Configurar archivos de la plataforma
- [ ] Ejecutar deploy
- [ ] Verificar URL de producción

### Post-Deploy
- [ ] Lighthouse score > 90 en todas las categorías
- [ ] Mobile-friendly test aprobado
- [ ] Todos los cálculos funcionan
- [ ] Analytics configurado (opcional)
- [ ] Monitoreo configurado (opcional)
- [ ] README actualizado con URL
- [ ] Documentación de deployment

---

## 🎯 Recomendación de Plataforma

**Para este proyecto, recomiendo: NETLIFY**

**Razones:**
1. **Gratis** para proyectos personales
2. **CI/CD automático** desde GitHub
3. **SSL gratuito** y automático
4. **CDN global** incluido
5. **Preview deployments** en PRs
6. **Fácil configuración** de dominio custom
7. **Excelente DX** (Developer Experience)

**Segunda opción:** Vercel (casi idéntico a Netlify)

**Para quick demo:** GitHub Pages (más simple, sin CI/CD)

---

## 🔄 Workflow de Desarrollo Recomendado Post-Deploy

```
git flow:
main (producción) -> deploy automático a Netlify
  ↑
develop (staging) -> preview en Netlify
  ↑
feature/* (desarrollo local)
```

**Proceso:**
1. Desarrollo en rama `feature/nueva-funcionalidad`
2. PR a `develop` -> genera preview en Netlify
3. Testing en preview
4. Merge a `main` -> deploy automático a producción

---

## 📞 Siguientes Pasos Inmediatos

### Paso 1: Decidir plataforma de hosting
- **Pregunta:** ¿Dónde quieres desplegar? (Netlify recomendado)

### Paso 2: Preparar código
- Ejecutar Fase 1 completa (Pasos 1.1 al 1.6)

### Paso 3: Deploy inicial
- Seguir guía de plataforma elegida (Fase 3)

### Paso 4: Verificación
- Ejecutar Fase 4 (Post-deployment)

---

**¿Listo para empezar? Di "Sí" y comenzamos con el Paso 1.1** 🚀
