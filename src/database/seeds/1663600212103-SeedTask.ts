import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTask1663600212103 implements MigrationInterface {
  name = 'SeedTask1663600212103';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tasks (
        id,
        title,
        description,
        due_date,
        is_completed,
        project_id,
        performer_id
      ) 
      VALUES (
        'e906cdfd-ea8e-4057-acf8-d76894be3724',
        'play golf with Messi',
        'meet in Barcelona',
        '2022-12-10T11:00',
        'false',
        '95690325-1d67-410d-a17e-77f35f0f9d5b',
        'f60c913b-0859-4797-8dea-c07409ffcf0d'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks (
        id,
        title,
        description,
        due_date,
        is_completed,
        project_id,
        performer_id
      ) 
      VALUES (
        'a0480514-78ac-45d6-b9b9-7bafd8865aab',
        'play football with CR7',
        'meet in Madrid',
        '2022-12-10T11:00',
        'true',
        'd0f995b7-3b2d-4af1-8b56-7edf733dac5c',
        'cc6864ed-9ca0-40b7-a4aa-e17563ace1ce'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks (
        id,
        title,
        description,
        due_date,
        is_completed,
        project_id,
        performer_id
      ) 
      VALUES (
        'dd9c6bf2-0a02-46b0-bb9f-252aeb232427',
        'visit WC2022',
        'visit football matches',
        '2022-12-10T11:00',
        'false',
        'e72ab234-73d9-437e-b4c7-a031b23bb8e7',
        null
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks (
        id,
        title,
        description,
        due_date,
        is_completed,
        project_id,
        performer_id
      ) 
      VALUES (
        '3244f2a9-1840-4a93-b45c-9e14a5981596',
        'exhibition match with Rafa',
        'match in Mexico',
        '2022-12-10T11:00',
        'true',
        'b905021b-59e1-4c4a-a7e2-ee80fa4ef38e',
        '86fd5b28-eb9b-4c31-b19c-209a7ab050a4'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks (
        id,
        title,
        description,
        due_date,
        is_completed,
        project_id,
        performer_id
      ) 
      VALUES (
        'be764516-1bd7-470c-bdca-a372623f2326',
        'Win European Golden Shoe 5th',
        'Top of LaLiga',
        '2022-12-10T11:00',
        'true',
        '6bfd40d7-1461-46b3-b8b0-81f7d12099d4',
        'cc6864ed-9ca0-40b7-a4aa-e17563ace1ce'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks (
        id,
        title,
        description,
        due_date,
        is_completed,
        project_id,
        performer_id
      ) 
      VALUES (
        'd405aa5e-e4db-418a-bd48-221a22fcd052',
        'Win European Golden Shoe 6th',
        'Top of EPL',
        '2022-12-10T11:00',
        'false',
        '6bfd40d7-1461-46b3-b8b0-81f7d12099d4',
        null
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks (
        id,
        title,
        description,
        due_date,
        is_completed,
        project_id,
        performer_id
      ) 
      VALUES (
        '1f1132bb-0cb7-46dd-94b5-5f95dd691e68',
        'travel to Serbia',
        'visit Belgrad and Nis',
        '2022-12-10T11:00',
        'false',
        '4b0e077f-f259-4da2-89cb-26af2f24953d',
        'cfd356c8-4a50-4721-a424-ee685a7b2ebe'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks (
        id,
        title,
        description,
        due_date,
        is_completed,
        project_id,
        performer_id
      ) 
      VALUES (
        '7bf73ccb-aad9-4d3f-8a2a-b991554bc0af',
        'tour of Paris',
        'buy 10 tickets',
        '2022-12-10T11:00',
        'true',
        '96d3fb2f-969e-4cf3-be38-458cd729296d',
        'f60c913b-0859-4797-8dea-c07409ffcf0d'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks (
        id,
        title,
        description,
        due_date,
        is_completed,
        project_id,
        performer_id
      ) 
      VALUES (
        'ed524aa1-7a78-4932-b194-148c16355a17',
        'tour of Camp Nou Barcelona',
        'buy 8 tickets',
        '2022-12-10T11:00',
        'false',
        '96d3fb2f-969e-4cf3-be38-458cd729296d',
        null
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks (
        id,
        title,
        description,
        due_date,
        is_completed,
        project_id,
        performer_id
      ) 
      VALUES (
        'bc50fa05-b625-4d2a-b7e6-41d1a7b331d0',
        'charity match with cr7',
        'invite tennis players',
        '2022-12-10T11:00',
        'false',
        'cbd52333-1b13-4204-8606-c9997824f855',
        'cc6864ed-9ca0-40b7-a4aa-e17563ace1ce'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks (
        id,
        title,
        description,
        due_date,
        is_completed,
        project_id,
        performer_id
      ) 
      VALUES (
        'b21e595e-dc6c-42cf-b636-cd7c5063019c',
        'buy basketball club',
        'club in Serbia',
        '2022-12-10T11:00',
        'true',
        'a41bd815-3e96-4e20-86bf-df047b978145',
        'cfd356c8-4a50-4721-a424-ee685a7b2ebe'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO tasks (
        id,
        title,
        description,
        due_date,
        is_completed,
        project_id,
        performer_id
      ) 
      VALUES (
        '30fd2f42-2eea-4047-bff7-6a6fad917d45',
        'buy hotel',
        'hotel in Switzerland',
        '2022-12-10T11:00',
        'true',
        'a41bd815-3e96-4e20-86bf-df047b978145',
        'fb4cad39-9add-4633-8050-b933ad1d7458'
      )`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
