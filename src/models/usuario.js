import mongoose from 'mongoose';

/**
 * Modelo Mongoose — Usuario
 * Representa a los usuarios del sistema (administradores, operadores y clientes).
 */

const usuarioSchema = new mongoose.Schema(
  {
    usuario: {
      type: String,
      required: [true, 'El nombre de usuario es obligatorio'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
    },
    rol: {
      type: String,
      enum: {
        values: ['admin', 'operador', 'cliente'],
        message: 'El rol debe ser "admin", "operador" o "cliente"',
      },
      default: 'operador',
      required: true,
    },
    empleadoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empleado',
      default: null,
    },
  },
  { timestamps: true }
);

export const Usuario = mongoose.model('Usuario', usuarioSchema);
