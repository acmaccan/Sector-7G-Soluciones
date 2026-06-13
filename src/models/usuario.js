import mongoose from 'mongoose';

/**
 * Modelo Mongoose — Usuario
 * Representa a los usuarios del sistema (administradores, liquidadores y clientes).
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
        values: ['admin', 'liquidador', 'cliente'],
        message: 'El rol debe ser "admin", "liquidador" o "cliente"',
      },
      default: 'liquidador',
      required: true,
    },
    empresaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empresa',
      required: function() {
        return this.rol === 'cliente';
      }
    },
  },
  { timestamps: true }
);

export const Usuario = mongoose.model('Usuario', usuarioSchema);
