-- ============================================================
-- SETUP COMPLETO: Esquema + Usuarios + Datos de demostración
-- ============================================================
-- Pegá TODO este script en el SQL Editor de Supabase y ejecutalo.
-- Crea las tablas, los usuarios de prueba, y datos demo.

-- ============================================================
-- PARTE 1: ESQUEMA (MIGRACIÓN)
-- ============================================================

-- ENUMS (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('patient', 'admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
    CREATE TYPE appointment_status AS ENUM ('pendiente', 'confirmada', 'cancelada', 'completada');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_type') THEN
    CREATE TYPE appointment_type AS ENUM ('primera_consulta', 'seguimiento', 'express');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'blog_status') THEN
    CREATE TYPE blog_status AS ENUM ('borrador', 'publicado');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_status') THEN
    CREATE TYPE plan_status AS ENUM ('activo', 'inactivo', 'completado');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_level') THEN
    CREATE TYPE activity_level AS ENUM ('sedentario', 'ligero', 'moderado', 'activo', 'muy_activo');
  END IF;
END $$;

-- FUNCTION: updated_at trigger
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id                 UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role               user_role NOT NULL DEFAULT 'patient',
  name               TEXT NOT NULL,
  phone              TEXT,
  avatar_url         TEXT,
  birth_date         DATE,
  gender             TEXT,
  address            TEXT,
  height_cm          NUMERIC(5,1),
  weight_initial_kg  NUMERIC(5,1),
  weight_target_kg   NUMERIC(5,1),
  gluten_free        BOOLEAN NOT NULL DEFAULT false,
  dairy_free         BOOLEAN NOT NULL DEFAULT false,
  vegetarian         BOOLEAN NOT NULL DEFAULT false,
  vegan              BOOLEAN NOT NULL DEFAULT false,
  allergies          TEXT,
  conditions         TEXT[],
  activity_level     activity_level DEFAULT 'sedentario',
  activity_notes     TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_self_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_admin_select" ON profiles FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "profiles_self_update" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_admin_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- BLOG POSTS
CREATE TABLE IF NOT EXISTS blog_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  category    TEXT NOT NULL,
  excerpt     TEXT,
  content     TEXT NOT NULL,
  image_url   TEXT,
  read_time   TEXT,
  status      blog_status NOT NULL DEFAULT 'borrador',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);

CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blog_posts_public_select" ON blog_posts FOR SELECT USING (status = 'publicado');
CREATE POLICY "blog_posts_admin_all" ON blog_posts FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- APPOINTMENTS
CREATE TABLE IF NOT EXISTS appointments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  type             appointment_type NOT NULL DEFAULT 'seguimiento',
  price            NUMERIC(6,2),
  notes            TEXT,
  status           appointment_status NOT NULL DEFAULT 'pendiente',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

CREATE TRIGGER trg_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "appointments_patient_select" ON appointments FOR SELECT USING (patient_id = auth.uid());
CREATE POLICY "appointments_admin_all" ON appointments FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "appointments_patient_insert" ON appointments FOR INSERT WITH CHECK (patient_id = auth.uid());
CREATE POLICY "appointments_patient_cancel" ON appointments FOR UPDATE USING (patient_id = auth.uid() AND status = 'pendiente') WITH CHECK (patient_id = auth.uid() AND status = 'cancelada');

-- NUTRITION PLANS
CREATE TABLE IF NOT EXISTS nutrition_plans (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name                 TEXT NOT NULL,
  description          TEXT,
  start_date           DATE,
  end_date             DATE,
  status               plan_status NOT NULL DEFAULT 'inactivo',
  daily_calorie_target INT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_nutrition_plans_patient ON nutrition_plans(patient_id);

CREATE TRIGGER trg_nutrition_plans_updated_at
  BEFORE UPDATE ON nutrition_plans
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

ALTER TABLE nutrition_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nutrition_plans_patient_select" ON nutrition_plans FOR SELECT USING (patient_id = auth.uid());
CREATE POLICY "nutrition_plans_admin_all" ON nutrition_plans FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- NUTRITION WEEKS
CREATE TABLE IF NOT EXISTS nutrition_weeks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id     UUID NOT NULL REFERENCES nutrition_plans(id) ON DELETE CASCADE,
  week_number INT NOT NULL CHECK (week_number >= 1),
  UNIQUE(plan_id, week_number)
);

ALTER TABLE nutrition_weeks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nutrition_weeks_read" ON nutrition_weeks FOR SELECT USING (EXISTS (SELECT 1 FROM nutrition_plans WHERE id = plan_id AND patient_id = auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "nutrition_weeks_admin_all" ON nutrition_weeks FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- NUTRITION DAYS
CREATE TABLE IF NOT EXISTS nutrition_days (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id  UUID NOT NULL REFERENCES nutrition_weeks(id) ON DELETE CASCADE,
  day_name TEXT NOT NULL CHECK (day_name IN ('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo')),
  UNIQUE(week_id, day_name)
);

ALTER TABLE nutrition_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nutrition_days_read" ON nutrition_days FOR SELECT USING (EXISTS (SELECT 1 FROM nutrition_weeks w JOIN nutrition_plans p ON p.id = w.plan_id WHERE w.id = week_id AND p.patient_id = auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "nutrition_days_admin_all" ON nutrition_days FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- NUTRITION MEALS
CREATE TABLE IF NOT EXISTS nutrition_meals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id      UUID NOT NULL REFERENCES nutrition_days(id) ON DELETE CASCADE,
  meal_time   TEXT NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  calories    INT,
  protein_g   NUMERIC(5,1),
  carbs_g     NUMERIC(5,1),
  fats_g      NUMERIC(5,1),
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE nutrition_meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nutrition_meals_read" ON nutrition_meals FOR SELECT USING (EXISTS (SELECT 1 FROM nutrition_days d JOIN nutrition_weeks w ON w.id = d.week_id JOIN nutrition_plans p ON p.id = w.plan_id WHERE d.id = day_id AND p.patient_id = auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "nutrition_meals_admin_all" ON nutrition_meals FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- MEAL COMPLETIONS
CREATE TABLE IF NOT EXISTS meal_completions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id      UUID NOT NULL REFERENCES nutrition_meals(id) ON DELETE CASCADE,
  patient_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  completed_on DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(meal_id, patient_id, completed_on)
);

ALTER TABLE meal_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meal_completions_self" ON meal_completions FOR ALL USING (patient_id = auth.uid()) WITH CHECK (patient_id = auth.uid());

-- WEIGHT LOGS
CREATE TABLE IF NOT EXISTS weight_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  weight_kg  NUMERIC(5,1) NOT NULL,
  logged_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes      TEXT
);

CREATE INDEX idx_weight_logs_patient ON weight_logs(patient_id);
CREATE INDEX idx_weight_logs_date ON weight_logs(logged_at);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "weight_logs_patient_select" ON weight_logs FOR SELECT USING (patient_id = auth.uid());
CREATE POLICY "weight_logs_patient_insert" ON weight_logs FOR INSERT WITH CHECK (patient_id = auth.uid());
CREATE POLICY "weight_logs_admin_all" ON weight_logs FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  duration_min  INT NOT NULL,
  intensity     TEXT,
  notes         TEXT,
  logged_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_logs_patient ON activity_logs(patient_id);
CREATE INDEX idx_activity_logs_date ON activity_logs(logged_at);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activity_logs_patient_all" ON activity_logs FOR ALL USING (patient_id = auth.uid()) WITH CHECK (patient_id = auth.uid());
CREATE POLICY "activity_logs_admin_all" ON activity_logs FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name       TEXT NOT NULL,
  text       TEXT NOT NULL,
  image_url  TEXT,
  rating     INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  visible    BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "testimonials_public_select" ON testimonials FOR SELECT USING (visible = true);
CREATE POLICY "testimonials_admin_all" ON testimonials FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- TRIGGER: auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, name)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'patient'),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_after_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- PARTE 2: USUARIOS DE PRUEBA
-- ============================================================
-- Se insertan directo en auth.users con contraseña hasheada.
-- El trigger handle_new_user() crea los profiles automáticamente.

INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'admin@nutrivida.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"admin","name":"Dra. María González"}',
    now(),
    now()
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'paciente@demo.com',
    crypt('demo123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"patient","name":"Laura Martínez"}',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PARTE 3: DATOS DE DEMOSTRACIÓN
-- ============================================================

-- BLOG POSTS
INSERT INTO blog_posts (id, author_id, title, slug, category, excerpt, content, image_url, read_time, status) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '5 Superalimentos para Aumentar tu Energía', 'superalimentos-energia', 'Nutrición', 'Descubre los alimentos que te ayudarán a mantenerte activo y lleno de energía durante todo el día...', '<h2>¿Qué son los superalimentos?</h2><p>Los superalimentos son alimentos naturales que concentran una cantidad excepcional de nutrientes.</p>', '/images/blog-article-1.jpg', '5 min', 'publicado'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'La Importancia de la Hidratación Diaria', 'hidratacion-diaria', 'Hábitos Saludables', 'El agua es esencial para casi todas las funciones de nuestro cuerpo.', '<h2>¿Por qué es importante la hidratación?</h2><p>El agua constituye aproximadamente el 60% de nuestro cuerpo.</p>', '/images/blog-article-2.jpg', '4 min', 'publicado'),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Meal Prep: Organiza tus Comidas Semanales', 'meal-prep-semanal', 'Meal Prep', 'La planificación de comidas es clave para mantener una alimentación saludable.', '<h2>¿Qué es el Meal Prep?</h2><p>El meal prep consiste en dedicar tiempo a preparar las comidas de la semana.</p>', '/images/blog-article-3.jpg', '6 min', 'publicado')
ON CONFLICT (id) DO NOTHING;

-- TESTIMONIALS
INSERT INTO testimonials (id, patient_id, name, text, image_url, rating, visible) VALUES
  ('t0000000-0000-0000-0000-000000000001', NULL, 'Laura Martínez', 'María cambió completamente mi relación con la comida. Perdí 12 kilos en 6 meses de forma saludable.', '/images/testimonial-1.jpg', 5, true),
  ('t0000000-0000-0000-0000-000000000002', NULL, 'Carlos Rodríguez', 'Llevaba años luchando con mi peso y nada funcionaba. El plan de María fue el primero que realmente se adaptó a mi vida.', '/images/testimonial-2.jpg', 5, true),
  ('t0000000-0000-0000-0000-000000000003', NULL, 'Ana Fernández', 'Como persona con intolerancias alimentarias, encontrar una nutricionista que entienda fue un alivio.', '/images/testimonial-3.jpg', 5, true)
ON CONFLICT (id) DO NOTHING;

-- WEIGHT LOGS (for patient)
INSERT INTO weight_logs (patient_id, weight_kg, logged_at) VALUES
  ('a0000000-0000-0000-0000-000000000002', 75.0, '2025-01-06'),
  ('a0000000-0000-0000-0000-000000000002', 74.2, '2025-01-13'),
  ('a0000000-0000-0000-0000-000000000002', 73.8, '2025-01-20'),
  ('a0000000-0000-0000-0000-000000000002', 73.1, '2025-01-27'),
  ('a0000000-0000-0000-0000-000000000002', 72.5, '2025-02-03'),
  ('a0000000-0000-0000-0000-000000000002', 71.9, '2025-02-10'),
  ('a0000000-0000-0000-0000-000000000002', 71.4, '2025-02-17'),
  ('a0000000-0000-0000-0000-000000000002', 70.8, '2025-02-24')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ¡LISTO! Ahora podés iniciar sesión con:
--   Admin:    admin@nutrivida.com / admin123
--   Paciente: paciente@demo.com / demo123
-- ============================================================
