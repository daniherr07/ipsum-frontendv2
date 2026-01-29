export const genericSchemas = {
  analistas_entidades: {
    label: "Analistas",
    allowCreate: true,
    allowEdit: true,
    relations: {
      entidad_id: { table: "entidades", labelField: "nombre" },
    },
    fields: [
      { name: "entidad_id", label: "Entidad", type: "relation" },
      { name: "nombre", label: "Nombre", type: "text" },
      { name: "apellido1", label: "Primer Apellido", type: "text" },
      { name: "apellido2", label: "Segundo Apellido", type: "text" },
      { name: "correo_electronico", label: "Correo", type: "email" },
      { name: "telefono", label: "Teléfono", type: "text" },
      { name: "activated", label: "Activo", type: "boolean", default: 1 },
    ],
  },

  centros_negocios: {
    label: "Centros de Negocio",
    allowCreate: true,
    allowEdit: true,
    relations: {
      entidad_id: { table: "entidades", labelField: "nombre" },
    },
    fields: [
      { name: "entidad_id", label: "Entidad", type: "relation" },
      { name: "nombre", label: "Nombre", type: "text" },
      { name: "direccion", label: "Dirección", type: "text" },
      { name: "correo_electronico", label: "Correo", type: "email" },
      { name: "telefono", label: "Teléfono", type: "text" },
      { name: "activated", label: "Activo", type: "boolean", default: 1 },
    ],
  },

  constructores: {
    label: "Constructores",
    allowCreate: true,
    allowEdit: true,
    fields: [
      { name: "nombre", label: "Nombre", type: "text" },
      { name: "apellido1", label: "Primer Apellido", type: "text" },
      { name: "apellido2", label: "Segundo Apellido", type: "text" },
      { name: "correo_electronico", label: "Correo", type: "email" },
      { name: "telefono", label: "Teléfono", type: "text" },
      { name: "activated", label: "Activo", type: "boolean", default: 1 },
    ],
  },

  entidades: {
    label: "Entidades",
    allowCreate: true,
    allowEdit: true,
    fields: [
      { name: "nombre", label: "Nombre", type: "text" },
      { name: "direccion", label: "Dirección", type: "text" },
      { name: "telefono", label: "Teléfono", type: "text" },
      { name: "activated", label: "Activo", type: "boolean", default: 1 },
    ],
  },

  fiscales: {
    label: "Fiscales",
    allowCreate: true,
    allowEdit: true,
    fields: [
      { name: "nombre", label: "Nombre", type: "text" },
      { name: "apellido1", label: "Primer Apellido", type: "text" },
      { name: "apellido2", label: "Segundo Apellido", type: "text" },
      { name: "correo_electronico", label: "Correo", type: "email" },
      { name: "telefono", label: "Teléfono", type: "text" },
      { name: "activated", label: "Activo", type: "boolean", default: 1 },
    ],
  },

  promotores_ipsum: {
    label: "Promotores Ipsum",
    allowCreate: true,
    allowEdit: true,
    fields: [
      { name: "nombre", label: "Nombre", type: "text" },
      { name: "apellido1", label: "Primer Apellido", type: "text" },
      { name: "apellido2", label: "Segundo Apellido", type: "text" },
      { name: "correo_electronico", label: "Correo", type: "email" },
      { name: "telefono", label: "Teléfono", type: "text" },
      { name: "activated", label: "Activo", type: "boolean", default: 1 },
    ],
  },

  grupos_proyectos: {
    label: "Grupos de Proyectos",
    allowCreate: true,
    allowEdit: true,
    fields: [
      { name: "nombre", label: "Nombre", type: "text" },
      { name: "descripcion", label: "Descripción", type: "textarea" },
      { name: "activated", label: "Activo", type: "boolean", default: 1 },
    ],
  },

  tipos_bono: {
    label: "Tipos de Bono",
    allowCreate: true,
    allowEdit: true,
    fields: [
      { name: "nombre", label: "Nombre", type: "text" },
      { name: "activated", label: "Activo", type: "boolean", default: 1 },
    ],
  },

  variantes_bono: {
    label: "Variantes de Bono",
    allowCreate: true,
    allowEdit: true,
    fields: [
      { name: "nombre", label: "Nombre", type: "text" },
      { name: "activated", label: "Activo", type: "boolean", default: 1 },
    ],
  },
};
