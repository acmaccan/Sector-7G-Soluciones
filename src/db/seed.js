import { connectDB } from "../config/app.config.js";
import { Empresa } from "../models/empresa.js";
import { Empleado } from "../models/empleado.js";

await connectDB();

await Promise.all([Empleado.deleteMany({}), Empresa.deleteMany({})]);

const empresas = await Empresa.insertMany([
  {
    nombre: "Talento Evolutivo S.A.",
    cuit: "30-12345678-9",
    rubro: "Servicios",
    contacto: "contacto@talentoevolutivo.com",
    activa: true,
    convenio: "general",
    fechaCierrePeriodo: 10,
  },
  {
    nombre: "Instituto Horizonte",
    cuit: "30-23456789-0",
    rubro: "Educación",
    contacto: "rrhh@institutohorizonte.edu",
    activa: true,
    convenio: "docente",
    fechaCierrePeriodo: 5,
  },
  {
    nombre: "Clínica San Gabriel",
    cuit: "30-34567890-1",
    rubro: "Salud",
    contacto: "admin@san-gabriel.com",
    activa: true,
    convenio: "sanidad",
    fechaCierrePeriodo: 15,
  },
  {
    nombre: "Comercial Sur SRL",
    cuit: "30-45678901-2",
    rubro: "Retail",
    contacto: "info@comercialsur.com",
    activa: true,
    convenio: "comercio",
    fechaCierrePeriodo: 20,
  },
  {
    nombre: "Servicios Integrales Delta",
    cuit: "30-56789012-3",
    rubro: "Mantenimiento",
    contacto: "contacto@delta.com",
    activa: true,
    convenio: "otro",
    fechaCierrePeriodo: 25,
  },
]);

await Empleado.insertMany([
  {
    nombre: "Ana",
    apellido: "Pérez",
    dni: "30111222",
    puesto: "Analista",
    email: "ana.perez@talentoevolutivo.com",
    empresaId: empresas[0]._id,
  },
  {
    nombre: "Bruno",
    apellido: "Gómez",
    dni: "28999888",
    puesto: "Administrativo",
    email: "bruno.gomez@talentoevolutivo.com",
    empresaId: empresas[0]._id,
  },
  {
    nombre: "Carla",
    apellido: "Rodríguez",
    dni: "32123456",
    puesto: "Docente",
    email: "carla.rodriguez@institutohorizonte.edu",
    empresaId: empresas[1]._id,
  },
  {
    nombre: "Diego",
    apellido: "Fernández",
    dni: "27555111",
    puesto: "Enfermero",
    email: "diego.fernandez@san-gabriel.com",
    empresaId: empresas[2]._id,
  },
  {
    nombre: "Elena",
    apellido: "Martínez",
    dni: "33999111",
    puesto: "Recepción",
    email: "elena.martinez@san-gabriel.com",
    empresaId: empresas[2]._id,
  },
  {
    nombre: "Facundo",
    apellido: "López",
    dni: "30222111",
    puesto: "Vendedor",
    email: "facundo.lopez@comercialsur.com",
    empresaId: empresas[3]._id,
  },
  {
    nombre: "Gabriela",
    apellido: "Suárez",
    dni: "29888777",
    puesto: "Técnica",
    email: "gabriela.suarez@delta.com",
    empresaId: empresas[4]._id,
  },
]);

console.log("Seed completed.");
process.exit(0);
