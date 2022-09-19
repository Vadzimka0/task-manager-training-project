import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChecklistItem1663600544614 implements MigrationInterface {
  name = 'CreateChecklistItem1663600544614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "checklist_items" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "content" character varying(512) NOT NULL, 
          "is_completed" boolean NOT NULL, 
          "checklist_id" uuid, 
          CONSTRAINT "PK_bae00945a1d4789bd648e583e29" PRIMARY KEY ("id")
        )`,
    );
    await queryRunner.query(
      `ALTER TABLE "checklist_items" ADD CONSTRAINT "FK_d98db409c26c6ed1a6d20c1bb0c" FOREIGN KEY ("checklist_id") REFERENCES "checklists"("id") ON DELETE CASCADE ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "checklist_items" DROP CONSTRAINT "FK_d98db409c26c6ed1a6d20c1bb0c"`,
    );
    await queryRunner.query(`DROP TABLE "checklist_items"`);
  }
}
