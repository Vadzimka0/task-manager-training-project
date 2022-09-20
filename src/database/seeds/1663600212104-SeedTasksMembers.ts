import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTasksMembers1663600212104 implements MigrationInterface {
  name = 'SeedTasksMembers1663600212104';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tasks_members_users (
        tasks_id,
        users_id
      ) 
      VALUES (
        'a0480514-78ac-45d6-b9b9-7bafd8865aab',
        'f60c913b-0859-4797-8dea-c07409ffcf0d'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks_members_users (
        tasks_id,
        users_id
      ) 
      VALUES (
        'dd9c6bf2-0a02-46b0-bb9f-252aeb232427',
        'f60c913b-0859-4797-8dea-c07409ffcf0d'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks_members_users (
        tasks_id,
        users_id
      ) 
      VALUES (
        'dd9c6bf2-0a02-46b0-bb9f-252aeb232427',
        'cc6864ed-9ca0-40b7-a4aa-e17563ace1ce'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks_members_users (
        tasks_id,
        users_id
      ) 
      VALUES (
        '3244f2a9-1840-4a93-b45c-9e14a5981596',
        'f60c913b-0859-4797-8dea-c07409ffcf0d'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks_members_users (
        tasks_id,
        users_id
      ) 
      VALUES (
        '3244f2a9-1840-4a93-b45c-9e14a5981596',
        'cc6864ed-9ca0-40b7-a4aa-e17563ace1ce'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks_members_users (
        tasks_id,
        users_id
      ) 
      VALUES (
        '3244f2a9-1840-4a93-b45c-9e14a5981596',
        'cfd356c8-4a50-4721-a424-ee685a7b2ebe'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks_members_users (
        tasks_id,
        users_id
      ) 
      VALUES (
        'bc50fa05-b625-4d2a-b7e6-41d1a7b331d0',
        'fb4cad39-9add-4633-8050-b933ad1d7458'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks_members_users (
        tasks_id,
        users_id
      ) 
      VALUES (
        'bc50fa05-b625-4d2a-b7e6-41d1a7b331d0',
        '86fd5b28-eb9b-4c31-b19c-209a7ab050a4'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks_members_users (
        tasks_id,
        users_id
      ) 
      VALUES (
        '30fd2f42-2eea-4047-bff7-6a6fad917d45',
        'fb4cad39-9add-4633-8050-b933ad1d7458'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks_members_users (
        tasks_id,
        users_id
      ) 
      VALUES (
        '30fd2f42-2eea-4047-bff7-6a6fad917d45',
        'cc6864ed-9ca0-40b7-a4aa-e17563ace1ce'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks_members_users (
        tasks_id,
        users_id
      ) 
      VALUES (
        '30fd2f42-2eea-4047-bff7-6a6fad917d45',
        'f60c913b-0859-4797-8dea-c07409ffcf0d'
      )`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
