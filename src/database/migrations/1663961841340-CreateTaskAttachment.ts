import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskAttachment1663961841340 implements MigrationInterface {
  name = 'CreateTaskAttachment1663961841340';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task_attachments" (
          "id" character varying NOT NULL, 
          "created_at" character varying NOT NULL, 
          "type" character varying NOT NULL, 
          "mimetype" character varying NOT NULL, 
          "path" character varying NOT NULL, 
          "name" character varying NOT NULL, 
          "task_id" uuid, 
          CONSTRAINT "PK_34eb9e5133310a488eaba0be28a" PRIMARY KEY ("id")
        )`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_attachments" ADD CONSTRAINT "FK_8c07320adec50a39744a4a301d3" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_attachments" DROP CONSTRAINT "FK_8c07320adec50a39744a4a301d3"`,
    );
    await queryRunner.query(`DROP TABLE "task_attachments"`);
  }
}
