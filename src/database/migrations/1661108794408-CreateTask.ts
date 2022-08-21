import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTask1661108794408 implements MigrationInterface {
    name = 'CreateTask1661108794408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(256) NOT NULL, "description" character varying NOT NULL, "dueDate" TIMESTAMP NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "tagId" integer, "performerId" integer, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tasks_members_users" ("tasksId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_32bc20030948429883a6ab3a4dc" PRIMARY KEY ("tasksId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2a6503d54400c210ddcc1b3319" ON "tasks_members_users" ("tasksId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3f51c3e80ad558d66ced268384" ON "tasks_members_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_1831c605b1aa2887ebe3d331927" FOREIGN KEY ("tagId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_f2e1fb63e9ad150368537b1d5a1" FOREIGN KEY ("performerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks_members_users" ADD CONSTRAINT "FK_2a6503d54400c210ddcc1b33193" FOREIGN KEY ("tasksId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tasks_members_users" ADD CONSTRAINT "FK_3f51c3e80ad558d66ced2683844" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks_members_users" DROP CONSTRAINT "FK_3f51c3e80ad558d66ced2683844"`);
        await queryRunner.query(`ALTER TABLE "tasks_members_users" DROP CONSTRAINT "FK_2a6503d54400c210ddcc1b33193"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_f2e1fb63e9ad150368537b1d5a1"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_1831c605b1aa2887ebe3d331927"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3f51c3e80ad558d66ced268384"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2a6503d54400c210ddcc1b3319"`);
        await queryRunner.query(`DROP TABLE "tasks_members_users"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
    }

}
