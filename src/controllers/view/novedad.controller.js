import { listarNovedades, obtenerNovedad } from "../../services/novedad.service.js";
import { listarEmpresas } from "../../services/empresa.service.js";
import { listarEmpleados } from "../../services/empleado.service.js";

class NovedadViewController {
  async getAll(req, res) {
    const filters = { ...req.query };
    const usuario = req.session?.usuario;
    console.log(usuario)
    if (usuario?.rol === 'cliente') {
      filters.empresaId = String(usuario.empresaId);
    }
    const novedades = await listarNovedades(filters);
    res.render('novedades/index', {
      titulo: 'Gestión de Novedades',
      novedades,
      estadoActual: req.query.estado
    });
  }

  async getForm(req, res) {
    const { id } = req.params;
    const empresas = await listarEmpresas({});
    const empleados = await listarEmpleados({});
    let novedad = null;
    if (id) novedad = await obtenerNovedad(id);
    res.render('novedades/form', {
      titulo: id ? 'Editar Novedad' : 'Nueva Novedad',
      novedad, empresas, empleados
    });
  }

  async getById(req, res) {
    const novedad = await obtenerNovedad(req.params.id);
    const usuario = req.session?.usuario;
    if (usuario?.rol === 'cliente') {
      const novedadEmpresaId = String(novedad.empresa?.id ?? '');
      if (novedadEmpresaId !== String(usuario.empresaId)) {
        return res.redirect('/novedades');
      }
    }
    res.render('novedades/detalle', { titulo: `Detalle de Novedad #${novedad.id}`, novedad });
  }
}

export default new NovedadViewController();
