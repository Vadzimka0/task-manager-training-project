import { MigrationInterface, QueryRunner } from 'typeorm';

export class CrateComment1663601271345 implements MigrationInterface {
  name = 'CrateComment1663601271345';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "comments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
        "created_at" character varying NOT NULL, 
        "content" character varying(1024) NOT NULL, 
        "task_id" uuid, 
        "commentator_id" uuid, 
        CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_18c2493067c11f44efb35ca0e03" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_fb5d5067e0da123829fd7c91c64" FOREIGN KEY ("commentator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_fb5d5067e0da123829fd7c91c64"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_18c2493067c11f44efb35ca0e03"`,
    );
    await queryRunner.query(`DROP TABLE "comments"`);
  }
}
