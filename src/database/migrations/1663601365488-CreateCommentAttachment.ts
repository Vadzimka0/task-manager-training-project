import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCommentAttachment1663601365488 implements MigrationInterface {
  name = 'CreateCommentAttachment1663601365488';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "comment_attachments" (
          "id" character varying NOT NULL, 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "type" character varying NOT NULL, 
          "mimetype" character varying NOT NULL, 
          "path" character varying NOT NULL, 
          "name" character varying NOT NULL, 
          "comment_id" uuid, 
          CONSTRAINT "PK_c70c6a3fd16b1591da5756f01f7" PRIMARY KEY ("id")
        )`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_attachments" ADD CONSTRAINT "FK_e6df9a7f63a30fba38b1f613e11" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment_attachments" DROP CONSTRAINT "FK_e6df9a7f63a30fba38b1f613e11"`,
    );
    await queryRunner.query(`DROP TABLE "comment_attachments"`);
  }
}
