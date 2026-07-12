export const modifyData = [
  {
    label: "Analista de Entidad",
    slug: "analista-de-entidad",
    table: "analistas_entidades",
    lingered: "entidades",
    entries: [
      {
        type: "hidden",
        value: "id",
        label: "",
      },
      {
        type: "select",
        value: "entidad_id",
        label: "Entidad Perteneciente",
      },
      {
        type: "text",
        value: "nombre",
        label: "Nombre del Analista",
      },
      {
        type: "text",
        value: "apellido1",
        label: "Primer apellido del Analista",
      },
      {
        type: "text",
        value: "apellido2",
        label: "Segundo apellido del Analista",
      },
      {
        type: "text",
        value: "correo_electronico",
        label: "Correo del Analista",
      },
      {
        type: "text",
        value: "telefono",
        label: "Teléfono del Analista",
      },
    ],
  },
  {
    label: "Centro de negocio",
    slug: "centro-de-negocio",
    table: "centros_negocios",
    lingered: "entidades",
    entries: [
      {
        type: "hidden",
        value: "id",
        label: "",
      },
      {
        type: "select",
        value: "entidad_id",
        label: "Entidad Perteneciente",
      },
      {
        type: "text",
        value: "nombre",
        label: "Nombre del Centro",
      },
      {
        type: "text",
        value: "direccion",
        label: "Dirección del Centro",
      },
      {
        type: "text",
        value: "telefono",
        label: "Teléfono del Centro",
      },
      {
        type: "text",
        value: "correo_electronico",
        label: "Correo del Centro",
      },
    ],
  },
  {
    label: "Constructor",
    slug: "constructor",
    table: "constructores",
    lingered: "",
    entries: [
      {
        type: "hidden",
        value: "id",
        label: "",
      },
      {
        type: "text",
        value: "Nombre",
        label: "Nombre del constructor",
      },
      {
        type: "text",
        value: "apellido1",
        label: "Primer apellido",
      },
      {
        type: "text",
        value: "apellido2",
        label: "Segundo apellido",
      },
      {
        type: "text",
        value: "telefono",
        label: "Teléfono del Constructor",
      },
      {
        type: "text",
        value: "correo_electronico",
        label: "Correo del Constructor",
      },
    ],
  },
  {
    label: "Entidad",
    slug: "entidad",
    table: "entidades",
    lingered: "",
    entries: [
      {
        type: "hidden",
        value: "id",
        label: "",
      },
      {
        type: "text",
        value: "nombre",
        label: "Nombre de la entidad",
      },
      {
        type: "text",
        value: "direccion",
        label: "Dirección de la Entidad",
      },
      {
        type: "text",
        value: "telefono",
        label: "Contacto de la Entidad",
      },
      {
        type: "text",
        value: "correo_electronico",
        label: "Correo de la Entidad",
      },
    ],
  },
  {
    label: "Fiscal",
    slug: "fiscal",
    table: "fiscales",
    lingered: "",
    entries: [
      {
        type: "hidden",
        value: "id",
        label: "",
      },
      {
        type: "text",
        value: "nombre",
        label: "Nombre del Fiscal",
      },
      {
        type: "text",
        value: "apellido1",
        label: "Primer Apellido",
      },
      {
        type: "text",
        value: "apellido2",
        label: "Segundo Apellido",
      },
      {
        type: "text",
        value: "telefono",
        label: "Contacto del Fiscal",
      },
      {
        type: "text",
        value: "correo_electronico",
        label: "Correo del Fiscal",
      },
    ],
  },
  {
    label: "Grupo",
    slug: "grupo",
    table: "grupos_proyectos",
    lingered: "",
    entries: [
      {
        type: "hidden",
        value: "id",
        label: "",
      },
      {
        type: "text",
        value: "nombre",
        label: "Nombre del grupo",
      },
      {
        type: "text",
        value: "descripcion",
        label: "Descripción del Grupo",
      },
    ],
  },
  {
    label: "Promotor Ipsum",
    slug: "promotor-ipsum",
    table: "promotores_ipsum",
    lingered: "",
    entries: [
      {
        type: "hidden",
        value: "id",
        label: "",
      },
      {
        type: "text",
        value: "nombre",
        label: "Nombre del Promotor",
      },
      {
        type: "text",
        value: "apellido1",
        label: "Primer Apellido",
      },
      {
        type: "text",
        value: "apellido2",
        label: "Segundo Apellido",
      },
    ],
  },
  {
    label: "Bono",
    slug: "bono",
    table: "tipos_bono",
    lingered: "",
    entries: [
      {
        type: "hidden",
        value: "id",
        label: "",
      },
      {
        type: "text",
        value: "nombre",
        label: "Nombre del Bono",
      },
    ],
  },
  {
    label: "Subtipo de bono",
    slug: "subtipo-de-bono",
    table: "variantes_bono",
    lingered: "tipos_bono",
    entries: [
      {
        type: "hidden",
        value: "id",
        label: "",
      },
      {
        type: "text",
        value: "nombre",
        label: "Nombre del subtipo",
      },
      {
        type: "select",
        value: "tipo_bono_id",
        label: "Tipo de bono al que pertenece",
      },
    ],
  },
];