import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChecklistWithItems1660855222462 implements MigrationInterface {
  name = 'CreateChecklistWithItems1660855222462';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "checklist_items" ("itemId" SERIAL NOT NULL, "content" character varying(512) NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "checklistId" integer, CONSTRAINT "PK_8740c63fb47a78c390acc79506f" PRIMARY KEY ("itemId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "checklists" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(512) NOT NULL, "color" character varying NOT NULL, "authorId" integer, CONSTRAINT "PK_336ade2047f3d713e1afa20d2c6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "checklist_items" ADD CONSTRAINT "FK_318b40686e72c5ede465984cf9e" FOREIGN KEY ("checklistId") REFERENCES "checklists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "checklists" ADD CONSTRAINT "FK_2edfa1fbb270f995efc2e5c3147" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "checklists" DROP CONSTRAINT "FK_2edfa1fbb270f995efc2e5c3147"`,
    );
    await queryRunner.query(
      `ALTER TABLE "checklist_items" DROP CONSTRAINT "FK_318b40686e72c5ede465984cf9e"`,
    );
    await queryRunner.query(`DROP TABLE "checklists"`);
    await queryRunner.query(`DROP TABLE "checklist_items"`);
  }
}
