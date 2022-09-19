import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1663600212168 implements MigrationInterface {
  name = 'CreateUser1663600212168';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "email" character varying NOT NULL, 
          "username" character varying NOT NULL, 
          "password" character varying NOT NULL, 
          "refresh_token" character varying, 
          "mimetype" character varying, 
          "path" character varying, 
          "filename" character varying, 
          CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
        )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
