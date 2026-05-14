# Nutrición Tatí

Portal de paciente para consultas nutricionales con la Lic. Tatiana Castel. Especializado en alimentación **libre de gluten** y **antiinflamatoria**.

**Sitio en vivo:** https://gonnruiz.github.io/tati-nutricion-singluten/

## Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS (paleta pastel rosa/menta)
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Deploy:** GitHub Pages (automático via GitHub Actions)

## Estructura

```
portal-nutricion-tati/
├── app/                    # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/     # Componentes UI y layout
│   │   ├── contexts/       # AuthContext
│   │   ├── data/           # Mock data (ejemplos)
│   │   └── pages/          # Páginas del portal
│   ├── .env                # Credenciales (NO se sube)
│   └── .env.example        # Template de credenciales
├── supabase/
│   ├── migrations/         # Migraciones SQL
│   └── setup-completo.sql  # Setup todo-en-uno (recomendado)
└── .github/workflows/      # CI/CD
```

## Setup local

```bash
# 1. Instalar dependencias
cd app
npm install

# 2. Configurar credenciales
cp .env.example .env
# Editar .env con tus valores reales

# 3. Iniciar dev server
npm run dev
# Abre http://localhost:3000
```

## Supabase (base de datos)

### Setup rápido (recomendado)

1. Andá a **SQL Editor** en tu proyecto Supabase
2. Copiá y ejecutá el contenido de `supabase/setup-completo.sql`
3. Eso crea tablas, usuarios de prueba y datos demo

### Usuarios de prueba

| Email | Contraseña | Rol |
|---|---|---|
| admin@nutrivida.com | admin123 | Admin (Lic. Tatiana Castel) |
| paciente@demo.com | demo123 | Paciente |

## Deploy a GitHub Pages

El deploy es automático. Cada push a `main` ejecuta el workflow `.github/workflows/deploy-gh-pages.yml`.

**Requisito:** Ir a Settings > Pages > Source: **GitHub Actions** en el repo.

## Demo credentials (mock local)

Mientras no conectes Supabase Auth, podés usar estos usuarios hardcodeados:

- **Paciente:** paciente@demo.com / demo123
- **Admin:** admin@nutrivida.com / admin123
