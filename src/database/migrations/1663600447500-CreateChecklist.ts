import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChecklist1663600447500 implements MigrationInterface {
  name = 'CreateChecklist1663600447500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "checklists" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "title" character varying(512) NOT NULL, 
          "color" character varying(8) NOT NULL, 
          "owner_id" uuid, CONSTRAINT "PK_336ade2047f3d713e1afa20d2c6" PRIMARY KEY ("id")
        )`,
    );
    await queryRunner.query(
      `ALTER TABLE "checklists" ADD CONSTRAINT "FK_4d26a64ca76c8a3de0ef63b2bb5" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "checklists" DROP CONSTRAINT "FK_4d26a64ca76c8a3de0ef63b2bb5"`,
    );
    await queryRunner.query(`DROP TABLE "checklists"`);
  }
}
