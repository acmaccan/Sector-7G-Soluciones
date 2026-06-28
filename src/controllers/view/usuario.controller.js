import { getAllUsuarios, getUsuarioById, createUsuario, updateUsuario } from '../../services/usuario.service.js';
import { listarEmpresas } from '../../services/empresa.service.js';

class  usuarioViewController {
    
    async getAll(req, res) {

        const usuarios = await getAllUsuarios() ?? [];
        const empresas = await listarEmpresas() ?? [];

        const usuariosCompletos = usuarios.map(usr => {
            const empresa = empresas.find(em => String(em.id) === String(usr.empresaId));
            return {
                ...usr,
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

        if (id) {
            usuarioData = await getUsuarioById(id);
        }

        res.render('usuarios/form', {
            titulo: id ? 'Editar Usuario' : 'Registrar Nuevo Usuario',
            empresas,
            usuarioData
        });
    }

    async getById(req, res) {
        const { id } = req.params;
        const { usuario, password, rol, empresaId } = req.body;

        if (id) {
            await updateUsuario(id, { usuario, password, rol, empresaId });
        } else {
            await createUsuario({ usuario, password, rol, empresaId });
        }

        res.redirect('/usuarios?success=true');
    }
}

export default new usuarioViewController();