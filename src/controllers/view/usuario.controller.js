import { getAllUsuarios, getUsuarioById, createUsuario, updateUsuario } from '../../services/usuario.service.js';
import { listarEmpleados, obtenerEmpleado } from '../../services/empleado.service.js';
import { listarEmpresas } from '../../services/empresa.service.js';

class  usuarioViewController {
    
    async getAll(req, res) {

        const usuarios = await getAllUsuarios() ?? [];
        const empleados = await listarEmpleados() ?? [];
        const empresas = await listarEmpresas() ?? [];

        const usuariosCompletos = usuarios.map(usr => {
            const empleado = empleados.find(emp => emp.id === usr.empleadoId);
            const empresa = empleado && empleado.empresa ? empresas.find(em => em.id === empleado.empresa.id) : null;
            
            return {
                ...usr,
                nombreCompleto: empleado ? `${empleado.nombre} ${empleado.apellido}` : 'Sin empleado asociado',
                empresaNombre: empresa ? empresa.nombre : 'N/A'
            };
        });

        res.render('usuarios/index', {
            titulo: 'Administración de Usuarios',
            usuarios: usuariosCompletos
        });
    }

    async getForm(req, res) {
        const { id } = req.params; 
        const empresas = await listarEmpresas() ?? []; 
        
        let usuarioData = null;
        let empleadoData = null;

        if (id) {
            usuarioData = await getUsuarioById(id);
            if (usuarioData && usuarioData.empleadoId) {
                empleadoData = await obtenerEmpleado(usuarioData.empleadoId);
            }
        }

        res.render('usuarios/form', {
            titulo: id ? 'Editar Usuario' : 'Registrar Nuevo Usuario',
            empresas,
            usuarioData, 
            empleadoData
        });
    }

    async getById(req, res) {
        const { id } = req.params;
        const { usuario, password, rol, empleadoId } = req.body;

        if (id) {
            await updateUsuario(id, { usuario, rol, empleadoId });
        } else {
            await createUsuario({ usuario, password, rol, empleadoId });
        }

        res.redirect('/usuarios?success=true');
    }
}

export default new usuarioViewController();