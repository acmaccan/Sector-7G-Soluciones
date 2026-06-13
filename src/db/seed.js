import { connectDB } from "../config/app.config.js";
import { Empresa } from "../models/empresa.js";
import { Empleado } from "../models/empleado.js";
import bcrypt from "bcrypt";
import { Usuario } from "../models/usuario.js";
import { Liquidacion } from "../models/liquidacion.js";
import { Socio } from "../models/socio.js";
import { Auditoria } from "../models/auditoria.js";
import { Novedad } from "../models/novedad.js";
import { Seguimiento } from "../models/seguimiento.js";

await connectDB();

await Promise.all([
  Empleado.deleteMany({}), 
  Empresa.deleteMany({}),
  Liquidacion.deleteMany({}),
  Socio.deleteMany({}),
  Usuario.deleteMany({}),
  Auditoria.deleteMany({}),
  Novedad.deleteMany({}),
  Seguimiento.deleteMany({})
]);

const adminPassword = await bcrypt.hash("admin123", 10);
const liquidadorPassword = await bcrypt.hash("liquidador123", 10);
const clientePassword = await bcrypt.hash("cliente123", 10);

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

const empleados = await Empleado.insertMany([
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

await Usuario.insertMany([
  {
    usuario: "admin",
    password: adminPassword,
    rol: "admin",
  },
  {
    usuario: "cliente_instituto_horizonte",
    password: clientePassword,
    rol: "cliente",
    empresaId: empresas[1]._id,
  },
    {
    usuario: "cliente_clinica_san_gabriel",
    password: clientePassword,
    rol: "cliente",
    empresaId: empresas[2]._id,
  },
  {
    usuario: "liquidador",
    password: liquidadorPassword,
    rol: "liquidador",
  },
]);

await Socio.insertMany([
  { nombre: "Julieta", apellido: "Silva", dni: "29111222", participacion: 50 },
  { nombre: "Marcos", apellido: "Paz", dni: "31333444", participacion: 30 },
  { nombre: "Florencia", apellido: "Gómez", dni: "35999000", participacion: 20 }
]);

await Liquidacion.insertMany([
  { 
    empleadoId: empleados[0]._id, 
    empresaId: empresas[0]._id, 
    periodo: "2026-04", 
    totalBruto: 450000, 
    totalNeto: 373500 
  },
  { 
    empleadoId: empleados[1]._id, 
    empresaId: empresas[0]._id, 
    periodo: "2026-04", 
    totalBruto: 380000, 
    totalNeto: 315400 
  },
  { 
    empleadoId: empleados[2]._id, 
    empresaId: empresas[1]._id, 
    periodo: "2026-04", 
    totalBruto: 520000, 
    totalNeto: 431600 
  }
]);

const novedades = await Novedad.insertMany([
  {
    tipo: "Licencia Medica",
    descripcion: "Licencia médica por gripe fuerte por 48 horas.",
    estado: "pendiente",
    fecha: "2026-05-10",
    empresaId: empresas[0]._id,
    empleadoId: empleados[0]._id,
    activo: true
  },
  {
    tipo: "Accidente Trabajo",
    descripcion: "Esguince de tobillo en horario laboral.",
    estado: "procesada",
    fecha: "2026-05-12",
    empresaId: empresas[0]._id,
    empleadoId: empleados[1]._id,
    activo: true
  },
  {
    tipo: "Sancion",
    descripcion: "Llegada tarde reiterada sin justificación.",
    estado: "rechazada",
    fecha: "2026-05-14",
    empresaId: empresas[1]._id,
    empleadoId: empleados[2]._id,
    activo: true
  },
  {
    tipo: "Licencia Medica",
    descripcion: "Operación programada de apéndice, 10 días.",
    estado: "pendiente",
    fecha: "2026-05-15",
    empresaId: empresas[2]._id,
    empleadoId: empleados[3]._id,
    activo: true
  },
  {
    tipo: "Licencia Medica",
    descripcion: "Control médico anual rutinario.",
    estado: "procesada",
    fecha: "2026-05-16",
    empresaId: empresas[2]._id,
    empleadoId: empleados[4]._id,
    activo: true
  },
  {
    tipo: "Sancion",
    descripcion: "Incumplimiento de normas de seguridad interna.",
    estado: "pendiente",
    fecha: "2026-05-18",
    empresaId: empresas[3]._id,
    empleadoId: empleados[5]._id,
    activo: true
  }
]);

await Seguimiento.insertMany([
  {
    novedadId: novedades[0]._id,
    fecha: "2026-05-11",
    responsable: "Juan Pérez (Recursos Humanos)",
    comentario: "Se solicita al empleado presentar el certificado médico correspondiente.",
    activo: true
  },
  {
    novedadId: novedades[0]._id,
    fecha: "2026-05-12",
    responsable: "Ana Gómez (Mesa Operativa)",
    comentario: "Certificado recibido y validado de manera conforme.",
    activo: true
  },
  {
    novedadId: novedades[1]._id,
    fecha: "2026-05-13",
    responsable: "Carlos López (ART)",
    comentario: "Denuncia a la aseguradora realizada con éxito.",
    activo: true
  },
  {
    novedadId: novedades[2]._id,
    fecha: "2026-05-15",
    responsable: "Dirección General",
    comentario: "Descargo del empleado no justificado. Se procede con el descuento.",
    activo: true
  }
]);

console.log("Seed completed.");
process.exit(0);
