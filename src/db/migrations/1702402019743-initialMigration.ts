import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1702402019743 implements MigrationInterface {
    name = 'InitialMigration1702402019743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "hash" character varying NOT NULL, "name" character varying NOT NULL, "refresh_tokens" text array NOT NULL DEFAULT '{}', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE TABLE "car" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "carManufacturer" character varying NOT NULL, "carModel" character varying NOT NULL, "year" integer NOT NULL, "publishDate" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying, "VIN" character varying NOT NULL, "authorId" uuid, CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, "carId" uuid, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "car" ADD CONSTRAINT "FK_bd6e1b4d231297cb37fcf3c6107" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_2e135c7a1c61e24d5198f0e87f9" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_2e135c7a1c61e24d5198f0e87f9"`);
        await queryRunner.query(`ALTER TABLE "car" DROP CONSTRAINT "FK_bd6e1b4d231297cb37fcf3c6107"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`DROP TABLE "car"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
