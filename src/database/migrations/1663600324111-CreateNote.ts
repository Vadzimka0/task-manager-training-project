import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNote1663600324111 implements MigrationInterface {
  name = 'CreateNote1663600324111';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notes" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "description" character varying(512) NOT NULL, 
          "color" character varying(8) NOT NULL, 
          "is_completed" boolean NOT NULL DEFAULT false, 
          "owner_id" uuid, CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id")
        )`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_f9e103f8ae67cb1787063597925" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_f9e103f8ae67cb1787063597925"`);
    await queryRunner.query(`DROP TABLE "notes"`);
  }
}
