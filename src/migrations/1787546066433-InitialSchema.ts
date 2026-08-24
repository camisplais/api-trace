import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1787546066433 implements MigrationInterface {
    name = 'InitialSchema1787546066433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`sesiones_bff\` (\`id\` varchar(255) NOT NULL, \`accessToken\` text NOT NULL, \`refreshToken\` text NULL, \`userId\` varchar(100) NOT NULL, \`expiraEn\` datetime NOT NULL, \`creadaEn\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` tinyint UNSIGNED NOT NULL AUTO_INCREMENT, \`nombre\` varchar(20) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`documentos\` (\`id\` tinyint UNSIGNED NOT NULL AUTO_INCREMENT, \`nombre\` varchar(40) NOT NULL, \`descripcion\` varchar(100) NULL, \`soloMedico\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`prueba_entrega_embarque\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`ruta_imagen\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`embarque_id\` int UNSIGNED NULL, \`doc_cliente_id\` smallint UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`doc_cliente\` (\`id\` smallint UNSIGNED NOT NULL AUTO_INCREMENT, \`documento_id\` tinyint UNSIGNED NULL, \`cliente_id\` smallint UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`clientes\` (\`id\` smallint UNSIGNED NOT NULL AUTO_INCREMENT, \`nombre\` varchar(45) NOT NULL, \`tipo\` enum ('medico', 'automotriz', 'aeroespacial', 'electrico') NOT NULL, \`ubicacion\` varchar(45) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transportes\` (\`id\` smallint UNSIGNED NOT NULL AUTO_INCREMENT, \`placas\` varchar(10) NOT NULL, \`marca\` varchar(30) NOT NULL, \`carga_util\` decimal(10,2) NOT NULL, \`imagen\` varchar(255) NULL, \`estado\` enum ('viaje', 'planta') NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`seguimiento_viaje\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`entrada\` datetime NULL, \`salida\` datetime NULL, \`qr\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`viaje_id\` int UNSIGNED NULL, \`empleado_caseta_entrada_id\` mediumint UNSIGNED NULL, \`empleado_caseta_salida_id\` mediumint UNSIGNED NULL, \`empleado_qr_salida_id\` mediumint UNSIGNED NULL, UNIQUE INDEX \`REL_e8374cd04d8d493e19186d783c\` (\`viaje_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`viajes\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`empleado_chofer_id\` mediumint UNSIGNED NULL, \`empleado_embarque_id\` mediumint UNSIGNED NULL, \`transporte_id\` smallint UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notificaciones\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`notificacion\` varchar(30) NOT NULL, \`estado\` enum ('no_leida', 'leida') NOT NULL DEFAULT 'no_leida', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`solicitud_id\` int UNSIGNED NULL, UNIQUE INDEX \`REL_1cf73bcf1d54b0a663fcf185e8\` (\`solicitud_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`solicitudes\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`tipo\` enum ('solicitarqr', 'pe_desfasadas', 'pe_pendientes', 'estatus_salida') NOT NULL, \`estado\` enum ('pendiente', 'aceptado', 'rechazado') NOT NULL DEFAULT 'pendiente', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`viaje_embarque_id\` int UNSIGNED NULL, \`empleado_emisor_id\` mediumint UNSIGNED NULL, \`empleado_receptor_id\` mediumint UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`viaje_embarque\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`viaje_id\` int UNSIGNED NULL, \`embarque_id\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`embarques\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`plan_embarque\` varchar(20) NOT NULL, \`fecha\` date NOT NULL, \`hora\` time NOT NULL, \`tipo\` enum ('expeditado', 'regular') NOT NULL, \`tarima\` smallint UNSIGNED NOT NULL, \`cantidad_piezas\` int UNSIGNED NOT NULL, \`estado\` enum ('activo', 'inactivo') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`cliente_id\` smallint UNSIGNED NULL, \`empleado_id\` mediumint UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`empleados\` (\`id\` mediumint UNSIGNED NOT NULL AUTO_INCREMENT, \`no_empleado\` mediumint UNSIGNED NOT NULL, \`nombre\` varchar(36) NOT NULL, \`apellido_paterno\` varchar(21) NOT NULL, \`apellido_materno\` varchar(21) NULL, \`fecha_nacimiento\` date NOT NULL, \`fecha_ingreso\` date NOT NULL, \`imagen\` varchar(255) NULL, \`departamento\` enum ('supplychain', 'transportes', 'seguridad') NOT NULL, \`puesto\` varchar(34) NOT NULL, \`estado\` enum ('disponible', 'ocupado') NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`otp_token\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`codigo\` varchar(6) NOT NULL, \`fecha_expiracion\` datetime NOT NULL, \`fecha_uso\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`usuario_id\` mediumint UNSIGNED NULL, UNIQUE INDEX \`REL_65b87e8cb313c9c2bfbaf893bd\` (\`usuario_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`usuarios\` (\`id\` mediumint UNSIGNED NOT NULL AUTO_INCREMENT, \`username\` varchar(20) NOT NULL, \`password\` varchar(255) NOT NULL, \`celular\` varchar(10) NOT NULL, \`email\` varchar(30) NOT NULL, \`estado\` enum ('activo', 'inactivo') NOT NULL DEFAULT 'activo', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`rol_id\` tinyint UNSIGNED NULL, \`empleado_id\` mediumint UNSIGNED NULL, UNIQUE INDEX \`REL_a263b94b107a7aa7bb71f951c9\` (\`empleado_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`auditoria_log\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`evento\` enum ('login_exitoso', 'logout', 'otp_expirado', 'otp_incorrecto', 'password_incorrecto') NOT NULL, \`ip\` varchar(15) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`usuario_id\` mediumint UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`prueba_entrega_embarque\` ADD CONSTRAINT \`FK_997f2d155289d4c52baa914d440\` FOREIGN KEY (\`embarque_id\`) REFERENCES \`embarques\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`prueba_entrega_embarque\` ADD CONSTRAINT \`FK_5a6944f17f7c01e295d137e40a2\` FOREIGN KEY (\`doc_cliente_id\`) REFERENCES \`doc_cliente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doc_cliente\` ADD CONSTRAINT \`FK_b0e6d13fa6863a4ffdaf842a101\` FOREIGN KEY (\`documento_id\`) REFERENCES \`documentos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doc_cliente\` ADD CONSTRAINT \`FK_6e9bd8502d5fb7644c7aecbfba3\` FOREIGN KEY (\`cliente_id\`) REFERENCES \`clientes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`seguimiento_viaje\` ADD CONSTRAINT \`FK_e8374cd04d8d493e19186d783cc\` FOREIGN KEY (\`viaje_id\`) REFERENCES \`viajes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`seguimiento_viaje\` ADD CONSTRAINT \`FK_cd1c3915977832bc1ee45ce7d04\` FOREIGN KEY (\`empleado_caseta_entrada_id\`) REFERENCES \`empleados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`seguimiento_viaje\` ADD CONSTRAINT \`FK_8329482571906ba1bf465998716\` FOREIGN KEY (\`empleado_caseta_salida_id\`) REFERENCES \`empleados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`seguimiento_viaje\` ADD CONSTRAINT \`FK_2e2a59941b25bf4f2b0d8fd42cf\` FOREIGN KEY (\`empleado_qr_salida_id\`) REFERENCES \`empleados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`viajes\` ADD CONSTRAINT \`FK_4f8128b0fe0ef68c8130cc8ecd9\` FOREIGN KEY (\`empleado_chofer_id\`) REFERENCES \`empleados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`viajes\` ADD CONSTRAINT \`FK_0e37b42f935a5174f0c9135b65e\` FOREIGN KEY (\`empleado_embarque_id\`) REFERENCES \`empleados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`viajes\` ADD CONSTRAINT \`FK_afeca0724782904e6e25ee9f579\` FOREIGN KEY (\`transporte_id\`) REFERENCES \`transportes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notificaciones\` ADD CONSTRAINT \`FK_1cf73bcf1d54b0a663fcf185e89\` FOREIGN KEY (\`solicitud_id\`) REFERENCES \`solicitudes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`solicitudes\` ADD CONSTRAINT \`FK_eb3c019c4324b56bdd6454c7330\` FOREIGN KEY (\`viaje_embarque_id\`) REFERENCES \`viaje_embarque\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`solicitudes\` ADD CONSTRAINT \`FK_9ccb205b29b0d93098c22f4bbb4\` FOREIGN KEY (\`empleado_emisor_id\`) REFERENCES \`empleados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`solicitudes\` ADD CONSTRAINT \`FK_27b75e830ceca74ff9f615b569a\` FOREIGN KEY (\`empleado_receptor_id\`) REFERENCES \`empleados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`viaje_embarque\` ADD CONSTRAINT \`FK_6af170d4c23aa1313936ba2a266\` FOREIGN KEY (\`viaje_id\`) REFERENCES \`viajes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`viaje_embarque\` ADD CONSTRAINT \`FK_876c2add43162ec54fee13e1328\` FOREIGN KEY (\`embarque_id\`) REFERENCES \`embarques\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`embarques\` ADD CONSTRAINT \`FK_02f1597987bc862bccace9564db\` FOREIGN KEY (\`cliente_id\`) REFERENCES \`clientes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`embarques\` ADD CONSTRAINT \`FK_b279286b5923da74ea2b01f0b68\` FOREIGN KEY (\`empleado_id\`) REFERENCES \`empleados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`otp_token\` ADD CONSTRAINT \`FK_65b87e8cb313c9c2bfbaf893bd9\` FOREIGN KEY (\`usuario_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_9e519760a660751f4fa21453d3e\` FOREIGN KEY (\`rol_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_a263b94b107a7aa7bb71f951c92\` FOREIGN KEY (\`empleado_id\`) REFERENCES \`empleados\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`auditoria_log\` ADD CONSTRAINT \`FK_6485619e1b05359286c664991f4\` FOREIGN KEY (\`usuario_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`auditoria_log\` DROP FOREIGN KEY \`FK_6485619e1b05359286c664991f4\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_a263b94b107a7aa7bb71f951c92\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_9e519760a660751f4fa21453d3e\``);
        await queryRunner.query(`ALTER TABLE \`otp_token\` DROP FOREIGN KEY \`FK_65b87e8cb313c9c2bfbaf893bd9\``);
        await queryRunner.query(`ALTER TABLE \`embarques\` DROP FOREIGN KEY \`FK_b279286b5923da74ea2b01f0b68\``);
        await queryRunner.query(`ALTER TABLE \`embarques\` DROP FOREIGN KEY \`FK_02f1597987bc862bccace9564db\``);
        await queryRunner.query(`ALTER TABLE \`viaje_embarque\` DROP FOREIGN KEY \`FK_876c2add43162ec54fee13e1328\``);
        await queryRunner.query(`ALTER TABLE \`viaje_embarque\` DROP FOREIGN KEY \`FK_6af170d4c23aa1313936ba2a266\``);
        await queryRunner.query(`ALTER TABLE \`solicitudes\` DROP FOREIGN KEY \`FK_27b75e830ceca74ff9f615b569a\``);
        await queryRunner.query(`ALTER TABLE \`solicitudes\` DROP FOREIGN KEY \`FK_9ccb205b29b0d93098c22f4bbb4\``);
        await queryRunner.query(`ALTER TABLE \`solicitudes\` DROP FOREIGN KEY \`FK_eb3c019c4324b56bdd6454c7330\``);
        await queryRunner.query(`ALTER TABLE \`notificaciones\` DROP FOREIGN KEY \`FK_1cf73bcf1d54b0a663fcf185e89\``);
        await queryRunner.query(`ALTER TABLE \`viajes\` DROP FOREIGN KEY \`FK_afeca0724782904e6e25ee9f579\``);
        await queryRunner.query(`ALTER TABLE \`viajes\` DROP FOREIGN KEY \`FK_0e37b42f935a5174f0c9135b65e\``);
        await queryRunner.query(`ALTER TABLE \`viajes\` DROP FOREIGN KEY \`FK_4f8128b0fe0ef68c8130cc8ecd9\``);
        await queryRunner.query(`ALTER TABLE \`seguimiento_viaje\` DROP FOREIGN KEY \`FK_2e2a59941b25bf4f2b0d8fd42cf\``);
        await queryRunner.query(`ALTER TABLE \`seguimiento_viaje\` DROP FOREIGN KEY \`FK_8329482571906ba1bf465998716\``);
        await queryRunner.query(`ALTER TABLE \`seguimiento_viaje\` DROP FOREIGN KEY \`FK_cd1c3915977832bc1ee45ce7d04\``);
        await queryRunner.query(`ALTER TABLE \`seguimiento_viaje\` DROP FOREIGN KEY \`FK_e8374cd04d8d493e19186d783cc\``);
        await queryRunner.query(`ALTER TABLE \`doc_cliente\` DROP FOREIGN KEY \`FK_6e9bd8502d5fb7644c7aecbfba3\``);
        await queryRunner.query(`ALTER TABLE \`doc_cliente\` DROP FOREIGN KEY \`FK_b0e6d13fa6863a4ffdaf842a101\``);
        await queryRunner.query(`ALTER TABLE \`prueba_entrega_embarque\` DROP FOREIGN KEY \`FK_5a6944f17f7c01e295d137e40a2\``);
        await queryRunner.query(`ALTER TABLE \`prueba_entrega_embarque\` DROP FOREIGN KEY \`FK_997f2d155289d4c52baa914d440\``);
        await queryRunner.query(`DROP TABLE \`auditoria_log\``);
        await queryRunner.query(`DROP INDEX \`REL_a263b94b107a7aa7bb71f951c9\` ON \`usuarios\``);
        await queryRunner.query(`DROP TABLE \`usuarios\``);
        await queryRunner.query(`DROP INDEX \`REL_65b87e8cb313c9c2bfbaf893bd\` ON \`otp_token\``);
        await queryRunner.query(`DROP TABLE \`otp_token\``);
        await queryRunner.query(`DROP TABLE \`empleados\``);
        await queryRunner.query(`DROP TABLE \`embarques\``);
        await queryRunner.query(`DROP TABLE \`viaje_embarque\``);
        await queryRunner.query(`DROP TABLE \`solicitudes\``);
        await queryRunner.query(`DROP INDEX \`REL_1cf73bcf1d54b0a663fcf185e8\` ON \`notificaciones\``);
        await queryRunner.query(`DROP TABLE \`notificaciones\``);
        await queryRunner.query(`DROP TABLE \`viajes\``);
        await queryRunner.query(`DROP INDEX \`REL_e8374cd04d8d493e19186d783c\` ON \`seguimiento_viaje\``);
        await queryRunner.query(`DROP TABLE \`seguimiento_viaje\``);
        await queryRunner.query(`DROP TABLE \`transportes\``);
        await queryRunner.query(`DROP TABLE \`clientes\``);
        await queryRunner.query(`DROP TABLE \`doc_cliente\``);
        await queryRunner.query(`DROP TABLE \`prueba_entrega_embarque\``);
        await queryRunner.query(`DROP TABLE \`documentos\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`sesiones_bff\``);
    }

}
