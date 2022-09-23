import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedComment1663600212106 implements MigrationInterface {
  name = 'SeedComment1663600212106';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO comments (
        id,
        content,
        task_id,
        owner_id
      ) 
      VALUES (
        '3b07d1d1-e855-48fe-9e7d-d76266d066ee',
        'It will be a good match in a beautiful stadium... with funny cat ;)', 
        'bc50fa05-b625-4d2a-b7e6-41d1a7b331d0',
        'f60c913b-0859-4797-8dea-c07409ffcf0d'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO comments (
        id,
        content,
        task_id,
        owner_id
      ) 
      VALUES (
        '614561a4-88ce-4a70-aacc-f315ed2e8640',
        'Great match. You set a record!!', 
        '3244f2a9-1840-4a93-b45c-9e14a5981596', 
        'f60c913b-0859-4797-8dea-c07409ffcf0d'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO comments (
        id,
        content,
        task_id,
        owner_id
      ) 
      VALUES (
        'c02d58fe-7a70-464e-8611-daed4b508eba',
        'Thanks for the promotion, Leo!', 
        '3244f2a9-1840-4a93-b45c-9e14a5981596', 
        'fb4cad39-9add-4633-8050-b933ad1d7458'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO comments (
        id,
        content,
        task_id,
        owner_id
      ) 
      VALUES (
        'a323b5fe-f460-43e9-86ea-869d919fc77a',
        'I am coming to this big event! With my dog :)', 
        'bc50fa05-b625-4d2a-b7e6-41d1a7b331d0', 
        'fb4cad39-9add-4633-8050-b933ad1d7458'
      )`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
