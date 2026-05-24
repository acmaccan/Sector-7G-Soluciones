const BASE_URL = "http://127.0.0.1:3000";

async function runTests() {
  console.log("=== INICIANDO CONTROL DE CALIDAD (QA) Y PRUEBAS ===\n");

  let cookie = "";

  async function apiRequest(path, options = {}) {
    const url = `${BASE_URL}${path}`;
    const headers = {
      ...(options.headers || {}),
    };
    if (cookie) {
      headers["Cookie"] = cookie;
    }
    const res = await fetch(url, {
      ...options,
      headers,
    });
    return res;
  }

  // --- SAD PATHS: AUTENTICACIÓN ---
  console.log("--- 1. Pruebas de Autenticacion (Sad Paths) ---");

  // A. Acceso sin sesión
  try {
    const res = await apiRequest("/api/empresas", { method: "GET", redirect: "manual" });
    const isBlocked = res.status === 302 || res.status === 0 || res.type === "opaqueredirect";
    if (isBlocked) {
      console.log(`OK: Bloqueado acceso sin sesion. Codigo/Tipo: ${res.status || res.type} (Redirige a /login)`);
    } else {
      console.log(`FALLO: Se pudo acceder a /api/empresas sin iniciar sesion. Status: ${res.status}`);
    }
  } catch (e) {
    console.error("Error en acceso sin sesion:", e.message);
  }

  // B. Login incorrecto
  try {
    const params = new URLSearchParams();
    params.append("usuario", "admin");
    params.append("password", "clave_incorrecta");

    const res = await apiRequest("/login", {
      method: "POST",
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      redirect: "manual",
    });

    const text = await res.text();
    if (text.includes("incorrectos") || res.status === 200) {
      console.log("OK: Login rechazado con credenciales incorrectas.");
    } else {
      console.log("FALLO: El login no devolvió error ante credenciales incorrectas.");
    }
  } catch (e) {
    console.error("Error en login incorrecto:", e.message);
  }

  // --- HAPPY PATH: LOGIN ---
  console.log("\n--- 2. Login Exitoso (Happy Path) ---");
  try {
    const params = new URLSearchParams();
    params.append("usuario", "admin");
    params.append("password", "admin123");

    const res = await apiRequest("/login", {
      method: "POST",
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      redirect: "manual",
    });

    // Extract cookie
    const rawCookies = res.headers.get("set-cookie");
    if (rawCookies) {
      cookie = rawCookies.split(";")[0];
      console.log("OK: Login exitoso, cookie de sesion obtenida.");
    } else {
      console.log("FALLO: No se recibio cookie de sesion.");
    }
  } catch (e) {
    console.error("Error en login exitoso:", e.message);
  }

  if (!cookie) {
    console.log("Deteniendo pruebas porque no se pudo autenticar.");
    return;
  }

  // --- HAPPY PATH: FLUJO COMPLETO DE DATOS ---
  console.log("\n--- 3. Flujo Completo de Negocio (Happy Path) ---");

  let empresaId = "";
  let empleadoId = "";
  let novedadId = "";

  // A. Crear Empresa
  try {
    const payload = {
      nombre: `Empresa Test QA ${Date.now()}`,
      cuit: `30-${Math.floor(10000000 + Math.random() * 90000000)}-${Math.floor(Math.random() * 9)}`,
      rubro: "Tecnologia",
      contacto: "qa@test.com",
    };
    const res = await apiRequest("/api/empresas", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    if (res.status === 201 || res.status === 200) {
      const data = await res.json();
      empresaId = data.id || data._id;
      console.log(`OK: Empresa creada exitosamente. ID: ${empresaId}`);
    } else {
      console.log(`FALLO: No se pudo crear la empresa. Status: ${res.status}`);
      console.log(await res.text());
    }
  } catch (e) {
    console.error("Error al crear empresa:", e.message);
  }

  if (!empresaId) return;

  // B. Crear Empleado
  try {
    const payload = {
      nombre: "Guillermo",
      apellido: "Aybar",
      dni: String(Math.floor(10000000 + Math.random() * 90000000)),
      puesto: "QA Tester",
      email: "guillermo.qa@test.com",
      empresaId: empresaId,
    };
    const res = await apiRequest("/api/empleados", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    if (res.status === 201 || res.status === 200) {
      const data = await res.json();
      empleadoId = data.id || data._id;
      console.log(`OK: Empleado creado exitosamente. ID: ${empleadoId}`);
    } else {
      console.log(`FALLO: No se pudo crear el empleado. Status: ${res.status}`);
      console.log(await res.text());
    }
  } catch (e) {
    console.error("Error al crear empleado:", e.message);
  }

  if (!empleadoId) return;

  // C. Crear Novedad
  try {
    const payload = {
      tipo: "Licencia",
      descripcion: "Licencia especial anual",
      fecha: "2026-05-24",
      empresaId: empresaId,
      empleadoId: empleadoId,
    };
    const res = await apiRequest("/api/novedades", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    if (res.status === 201 || res.status === 200) {
      const data = await res.json();
      novedadId = data.id || data._id;
      console.log(`OK: Novedad creada exitosamente. ID: ${novedadId}`);
    } else {
      console.log(`FALLÓ: No se pudo crear la novedad. Status: ${res.status}`);
      console.log(await res.text());
    }
  } catch (e) {
    console.error("Error al crear novedad:", e.message);
  }

  if (!novedadId) return;

  // D. Crear Seguimiento
  try {
    const payload = {
      novedadId: novedadId,
      fecha: "2026-05-24",
      responsable: "Guillermo Aybar QA",
      comentario: "Seguimiento inicial automatizado desde script de QA",
    };
    const res = await apiRequest("/api/seguimientos", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    if (res.status === 201 || res.status === 200) {
      console.log("OK: Seguimiento registrado exitosamente.");
    } else {
      console.log(`FALLO: No se pudo crear el seguimiento. Status: ${res.status}`);
      console.log(await res.text());
    }
  } catch (e) {
    console.error("Error al crear seguimiento:", e.message);
  }

  // --- SAD PATHS: INTEGRIDAD Y CONTROL DE ERRORES ---
  console.log("\n--- 4. Control de Errores e Integridad (Sad Paths) ---");

  // A. CastError (ID Invalido en GET)
  try {
    const res = await apiRequest("/api/empresas/id-invalido-formato", { method: "GET" });
    const data = await res.json();
    if (res.status === 400 && (data.message === "ID inválido" || data.message === "ID invalido")) {
      console.log("OK: CastError interceptado correctamente (400 - ID invalido).");
    } else {
      console.log(`FALLO: CastError no interceptado adecuadamente. Status: ${res.status}, Msg: ${data.message}`);
    }
  } catch (e) {
    console.error("Error en prueba de CastError:", e.message);
  }

  // B. Relacion cruzada invalida (Crear novedad cruzando empleado y empresa no relacionados)
  try {
    const payload = {
      tipo: "Vacaciones",
      descripcion: "Novedad erronea",
      fecha: "2026-05-24",
      empresaId: "65f000000000000000000000",
      empleadoId: empleadoId,
    };
    const res = await apiRequest("/api/novedades", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (res.status === 400) {
      console.log(`OK: Relacion cruzada rechazada correctamente. Status: 400, Msg: "${data.message}"`);
    } else {
      console.log(`FALLO: Se permitio crear novedad con relacion cruzada invalida. Status: ${res.status}`);
    }
  } catch (e) {
    console.error("Error en prueba de relacion cruzada:", e.message);
  }

  // C. DNI Duplicado
  try {
    const payload = {
      nombre: "Duplicado",
      apellido: "DNI",
      dni: "30111222", // DNI de Ana Pérez
      puesto: "Dev",
      email: "duplicado@talentoevolutivo.com",
      empresaId: empresaId,
    };
    const res = await apiRequest("/api/empleados", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (res.status === 409 || res.status === 400) {
      console.log(`OK: DNI duplicado rechazado correctamente. Status: ${res.status}, Msg: "${data.message}"`);
    } else {
      console.log(`FALLO: Se permitió registrar DNI duplicado. Status: ${res.status}`);
    }
  } catch (e) {
    console.error("Error en prueba de DNI duplicado:", e.message);
  }

  // --- REPORTES INDICADORES ---
  console.log("\n--- 5. Indicadores y Reportes ---");
  try {
    const res = await apiRequest("/api/resumen", { method: "GET" });
    if (res.status === 200) {
      const data = await res.json();
      console.log("OK: Reporte general obtenido exitosamente.");
      console.log("   Indicadores:", JSON.stringify(data.indicadores));
      console.log("   Simulacion Impacto General:", data.simulacion?.impactoGeneral);
    } else {
      console.log(`FALLO: No se pudo obtener el reporte de resumen. Status: ${res.status}`);
    }
  } catch (e) {
    console.error("Error al obtener reportes:", e.message);
  }

  console.log("\n=== CONTROL DE CALIDAD (QA) Y PRUEBAS FINALIZADO ===");
}

runTests();
