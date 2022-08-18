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
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
