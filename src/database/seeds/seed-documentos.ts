// src/database/seeds/documentos.seed.ts
import { DataSource } from 'typeorm';
import { Documento } from '../../documentos/entities/documento.entity';

export async function seedDocumentos(dataSource: DataSource) {
  const repo = dataSource.getRepository(Documento);

  const documentos: Partial<Documento>[] = [
    {
      nombre: 'Factura',
      descripcion: 'Documento fiscal que respalda la venta o compra de un producto o servicio',
    },
    {
      nombre: 'Packing list / Albaran',
      descripcion: 'Listado detallado del contenido y cantidades del envio',
    },
    {
      nombre: 'Remision manual',
      descripcion: 'Documento generado manualmente para respaldar la entrega de mercancia',
    },
    {
      nombre: 'Fotografia',
      descripcion: 'Evidencia fotografica del embarque',
    },
    {
      nombre: 'Certificado de calidad',
      descripcion: 'Documento que certifica que el producto cumple con los estandares de calidad',
    },
    {
      nombre: 'Certificado de conformidad',
      descripcion: 'Unicamente sector medico',
    },
    {
      nombre: 'Certificado de analisis',
      descripcion: 'Unicamente sector medico',
    },
    {
      nombre: 'Checklist de revision de producto',
      descripcion: 'Unicamente sector medico',
    },
    {
      nombre: 'Checklist de transportista',
      descripcion: 'Unicamente sector medico',
    },
    {
      nombre: 'Compromiso de transportista',
      descripcion: 'Unicamente sector medico',
    },
    {
      nombre: 'Listado de verificacion de salida',
      descripcion: 'Unicamente sector medico',
    },
    {
      nombre: 'Certificado de fumigacion',
      descripcion: 'Unicamente sector medico',
    },
  ];

  for (const doc of documentos) {
    const exists = await repo.findOne({ where: { nombre: doc.nombre } });
    if (!exists) {
      await repo.save(repo.create(doc));
    }
  }
  console.log('documentos ok');
}