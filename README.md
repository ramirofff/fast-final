# FastFood Tailwind App

## Instalación local

1. Instalar dependencias:
```bash
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. Configurar tailwind.config.js (ya configurado aquí).

3. Ejecutar en terminal:
```bash
npm run dev
```

4. Abrir http://localhost:3000

## Deploy

Subir a GitHub y desplegar en Vercel.

## Variables de entorno

Copiar `.env.example` a `.env.local` y poner tu clave Stripe si la tienes.