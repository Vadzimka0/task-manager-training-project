import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedProject1660480564585 implements MigrationInterface {
  name = 'SeedProject1660480564585';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO projects (title, color, "authorId") VALUES ('Personal', 'blue', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO projects (title, color, "authorId") VALUES ('Personal', 'blue', 2)`,
    );
    await queryRunner.query(
      `INSERT INTO projects (title, color, "authorId") VALUES ('Personal', 'blue', 3)`,
    );
    await queryRunner.query(
      `INSERT INTO projects (title, color, "authorId") VALUES ('Personal', 'blue', 4)`,
    );
    await queryRunner.query(
      `INSERT INTO projects (title, color, "authorId") VALUES ('Personal', 'blue', 5)`,
    );
    await queryRunner.query(
      `INSERT INTO projects (title, color, "authorId") VALUES ('Personal', 'blue', 6)`,
    );
    await queryRunner.query(
      `INSERT INTO projects (title, color, "authorId") VALUES ('Personal', 'blue', 7)`,
    );
    await queryRunner.query(
      `INSERT INTO projects (title, color, "authorId") VALUES ('Personal', 'blue', 8)`,
    );
    await queryRunner.query(
      `INSERT INTO projects (title, color, "authorId") VALUES ('Personal', 'blue', 9)`,
    );
    await queryRunner.query(
      `INSERT INTO projects (title, color, "authorId") VALUES ('Home', 'green', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO projects (title, color, "authorId") VALUES ('Teamworks', 'red', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO projects (title, color, "authorId") VALUES ('Sport', 'yellow', 2)`,
    );
    await queryRunner.query(
      `INSERT INTO projects (title, color, "authorId") VALUES ('Family', 'green', 2)`,
    );
    await queryRunner.query(
      `INSERT INTO projects (title, color, "authorId") VALUES ('Shopping', 'black', 3)`,
    );
    await queryRunner.query(
      `INSERT INTO projects (title, color, "authorId") VALUES ('Shopping', 'green', 8)`,
    );
    await queryRunner.query(
      `INSERT INTO projects (title, color, "authorId") VALUES ('Shopping', 'green', 9)`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
