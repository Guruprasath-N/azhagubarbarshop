import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbEngine } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(express.json());

// CORS headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Helper: Convert "HH:MM" to minutes
function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// ----------------------------------------------------
// 1. Health & Meta Endpoints
// ----------------------------------------------------
app.get('/', (req, res) => {
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AZHAGU — Backend REST API</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .status-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); padding: 6px 14px; border-radius: 9999px; font-size: 14px; font-weight: 600; margin-bottom: 20px; }
    .dot { width: 8px; height: 8px; background-color: #22c55e; border-radius: 50%; box-shadow: 0 0 10px #22c55e; }
    h1 { margin: 0 0 10px 0; font-size: 24px; color: #ffffff; }
    p { color: #94a3b8; line-height: 1.5; font-size: 15px; margin: 0 0 24px 0; }
    .btn { display: inline-block; width: 100%; background: linear-gradient(135deg, #d97706, #b45309); color: #ffffff; font-weight: 700; text-decoration: none; padding: 14px 24px; border-radius: 10px; font-size: 16px; box-sizing: border-box; transition: all 0.15s ease; }
    .btn:hover { background: linear-gradient(135deg, #f59e0b, #d97706); transform: translateY(-2px); }
    .note { margin-top: 20px; font-size: 13px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="status-badge"><span class="dot"></span> Backend REST API Active</div>
    <h1>AZHAGU Salon Platform</h1>
    <p>The backend REST API server is running on <strong>Port 5050</strong>. The main Web Application runs on <strong>Port 3000</strong>.</p>
    <a href="http://localhost:3000" class="btn">🚀 Open Web Application (Port 3000)</a>
    <div class="note">Redirecting to Web Application in 2 seconds...</div>
  </div>
  <script>
    setTimeout(function() {
      window.location.href = "http://localhost:3000";
    }, 2000);
  </script>
</body>
</html>
    `);
  }

  res.json({
    status: 'ONLINE',
    service: 'Azhagu Salon Backend REST API',
    message: 'Backend server is running operational.',
    frontendUrl: 'http://localhost:3000',
    apiHealthUrl: 'http://localhost:5050/api/health',
    timestamp: new Date().toISOString()
  });
});


app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Azhagu Salon Backend REST API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});


// ----------------------------------------------------
// 2. Authentication & User Management APIs
// ----------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !identifier.trim()) {
    return res.status(400).json({ success: false, error: 'Please enter Name, Phone Number, or Email.' });
  }

  if (!password || !password.trim()) {
    return res.status(400).json({ success: false, error: 'Password is required to log in.' });
  }

  const users = dbEngine.getUsers();
  const cleanId = identifier.trim().toLowerCase();
  const cleanDigits = identifier.replace(/\D/g, '');

  const found = users.find((u) => {
    const emailMatch = u.email.toLowerCase() === cleanId;
    const nameMatch = u.full_name.toLowerCase() === cleanId || (cleanId.length >= 3 && u.full_name.toLowerCase().includes(cleanId));
    const userDigits = u.phone.replace(/\D/g, '');
    const phoneMatch = cleanDigits.length >= 4 && (userDigits.includes(cleanDigits) || cleanDigits.includes(userDigits));
    return emailMatch || phoneMatch || nameMatch;
  });

  if (!found) {
    return res.status(404).json({ success: false, error: 'No account found matching credentials.' });
  }

  if (found.status === 'SUSPENDED') {
    return res.status(403).json({ success: false, error: 'Account suspended. Contact support.' });
  }

  if (found.password && found.password !== password) {
    return res.status(401).json({ success: false, error: 'Incorrect password.' });
  }

  return res.json({
    success: true,
    token: `jwt_token_${found.id}_${Date.now()}`,
    user: found
  });
});

app.post('/api/auth/register', (req, res) => {
  const { full_name, email, phone, role, password } = req.body;

  if (!full_name || !email || !phone) {
    return res.status(400).json({ success: false, error: 'Name, email, and phone are required.' });
  }

  const users = dbEngine.getUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    auth_user_id: `auth-${Date.now()}`,
    full_name,
    email,
    phone,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: role || 'CUSTOMER',
    password: password || 'password123',
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  dbEngine.setUsers([newUser, ...users]);
  return res.status(201).json({ success: true, user: newUser });
});

// ----------------------------------------------------
// 3. Salons, Services, & Staff APIs
// ----------------------------------------------------
app.get('/api/salons', (req, res) => {
  res.json({ success: true, salons: dbEngine.getSalons() });
});

app.get('/api/categories', (req, res) => {
  res.json({ success: true, categories: dbEngine.getCategories() });
});

app.get('/api/services', (req, res) => {
  res.json({ success: true, services: dbEngine.getServices() });
});

app.get('/api/staff', (req, res) => {
  res.json({ success: true, staff: dbEngine.getStaff() });
});

// ----------------------------------------------------
// 4. Appointments & Double Booking Overlap Protection
// ----------------------------------------------------
app.get('/api/appointments', (req, res) => {
  res.json({ success: true, appointments: dbEngine.getAppointments() });
});

app.post('/api/appointments', (req, res) => {
  const payload = req.body;

  const salons = dbEngine.getSalons();
  const services = dbEngine.getServices();
  const staff = dbEngine.getStaff();
  const appointments = dbEngine.getAppointments();

  const salon = salons.find((s) => s.id === payload.salon_id);
  if (!salon) return res.status(404).json({ success: false, error: 'Salon not found.' });

  const service = services.find((s) => s.id === payload.service_id);
  if (!service) return res.status(404).json({ success: false, error: 'Service not found.' });

  const staffMember = staff.find((st) => st.id === payload.staff_id);
  if (!staffMember) return res.status(404).json({ success: false, error: 'Stylist not found.' });

  const startMins = timeToMinutes(payload.start_time);
  const endMins = timeToMinutes(payload.end_time);

  // Server-Side Double Booking Overlap Protection
  const hasCollision = appointments.some((appt) => {
    if (
      appt.staff_id !== staffMember.id ||
      appt.appointment_date !== payload.appointment_date ||
      appt.status === 'CANCELLED'
    ) {
      return false;
    }

    const existingStart = timeToMinutes(appt.start_time);
    const existingEnd = timeToMinutes(appt.end_time);

    // Overlap condition
    return !(endMins <= existingStart || startMins >= existingEnd);
  });

  if (hasCollision) {
    return res.status(409).json({
      success: false,
      error: 'That time slot is no longer available. Please select another time slot.'
    });
  }

  const newAppointment = {
    id: `appt-${Date.now()}`,
    customer_id: payload.customer_id,
    salon_id: salon.id,
    staff_id: staffMember.id,
    service_id: service.id,
    appointment_date: payload.appointment_date,
    start_time: payload.start_time,
    end_time: payload.end_time,
    status: 'CONFIRMED',
    notes: payload.notes || '',
    total_price: service.price,
    customer_name: payload.customer_name,
    customer_phone: payload.customer_phone,
    customer_email: payload.customer_email,
    service_name: service.name,
    staff_name: staffMember.display_name,
    salon_name: salon.name,
    payment_method: payload.payment_method || 'PAY_AT_SALON',
    payment_status: payload.payment_status || 'PAY_AT_SALON',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  dbEngine.setAppointments([newAppointment, ...appointments]);
  return res.status(201).json({ success: true, appointment: newAppointment });
});

// ----------------------------------------------------
// 5. 2-Hour Cancellation Enforcement API
// ----------------------------------------------------
app.post('/api/appointments/cancel', (req, res) => {
  const { appointment_id, actor_id } = req.body;

  const appointments = dbEngine.getAppointments();
  const target = appointments.find((a) => a.id === appointment_id);

  if (!target) return res.status(404).json({ success: false, error: 'Appointment not found.' });
  if (target.status === 'CANCELLED') return res.status(400).json({ success: false, error: 'Already cancelled.' });

  const actorUser = dbEngine.getUsers().find((u) => u.id === actor_id);
  const verifiedRole = actorUser?.role || 'CUSTOMER';

  if (verifiedRole === 'CUSTOMER' || target.customer_id === actor_id) {
    const [year, month, day] = target.appointment_date.split('-').map(Number);
    const [hours, mins] = target.start_time.split(':').map(Number);
    const appointmentDateTime = new Date(year, month - 1, day, hours, mins).getTime();
    const now = Date.now();
    const differenceInHours = (appointmentDateTime - now) / (1000 * 60 * 60);

    if (differenceInHours < 2) {
      return res.status(403).json({
        success: false,
        error: 'Appointments within the 2-hour window cannot be cancelled online.'
      });
    }
  }

  target.status = 'CANCELLED';
  target.updated_at = new Date().toISOString();
  dbEngine.setAppointments([...appointments]);

  return res.json({ success: true });
});

// Serve compiled static assets from dist (Web Service deployment)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Azhagu Backend REST API Server running at http://localhost:${PORT}`);
});
