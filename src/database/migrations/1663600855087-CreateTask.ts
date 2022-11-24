import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTask1663600855087 implements MigrationInterface {
  name = 'CreateTask1663600855087';
  // "due_date" TIMESTAMP NOT NULL,
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tasks" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "title" character varying(256) NOT NULL, 
          "description" character varying NOT NULL, 
          "due_date" character varying NOT NULL, 
          "is_completed" boolean NOT NULL, 
          "project_id" uuid, 
          "performer_id" uuid, 
          CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id")
        )`,
    );
    await queryRunner.query(
      `CREATE TABLE "tasks_members_users" (
          "tasks_id" uuid NOT NULL, 
          "users_id" uuid NOT NULL, 
          CONSTRAINT "PK_91c0084f84875ea867dad040f6e" PRIMARY KEY ("tasks_id", "users_id")
        )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eefc71524715bfe012228cc70e" ON "tasks_members_users" ("tasks_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8be52d47fc80fa997dafbc23e3" ON "tasks_members_users" ("users_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_4d39dd03742b19b55ed0544b5c3" FOREIGN KEY ("performer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks_members_users" ADD CONSTRAINT "FK_eefc71524715bfe012228cc70eb" FOREIGN KEY ("tasks_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks_members_users" ADD CONSTRAINT "FK_8be52d47fc80fa997dafbc23e3c" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tasks_members_users" DROP CONSTRAINT "FK_8be52d47fc80fa997dafbc23e3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks_members_users" DROP CONSTRAINT "FK_eefc71524715bfe012228cc70eb"`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_4d39dd03742b19b55ed0544b5c3"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8be52d47fc80fa997dafbc23e3"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_eefc71524715bfe012228cc70e"`);
    await queryRunner.query(`DROP TABLE "tasks_members_users"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
  }
}
