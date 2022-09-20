import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedProject1663600212102 implements MigrationInterface {
  name = 'SeedProject1663600212102';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO projects (
        id,
        title,
        color,
        owner_id
      ) 
      VALUES (
        '96d3fb2f-969e-4cf3-be38-458cd729296d',
        'Personal', 
        '#FFFFD4', 
        'f60c913b-0859-4797-8dea-c07409ffcf0d'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO projects (
        id,
        title,
        color,
        owner_id
      ) 
      VALUES (
        'cbd52333-1b13-4204-8606-c9997824f855',
        'Charity', 
        '#EEEEEE', 
        'f60c913b-0859-4797-8dea-c07409ffcf0d'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO projects (
        id,
        title,
        color,
        owner_id
      ) 
      VALUES (
        'a41bd815-3e96-4e20-86bf-df047b978145',
        'Business', 
        '#BBBBBB', 
        'f60c913b-0859-4797-8dea-c07409ffcf0d'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO projects (
        id,
        title,
        color,
        owner_id
      ) 
      VALUES (
        '6bfd40d7-1461-46b3-b8b0-81f7d12099d4',
        'Personal', 
        '#FFFFD4', 
        'cc6864ed-9ca0-40b7-a4aa-e17563ace1ce'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO projects (
        id,
        title,
        color,
        owner_id
      ) 
      VALUES (
        '4b0e077f-f259-4da2-89cb-26af2f24953d',
        'Traveling', 
        '#CCCCCC', 
        'cc6864ed-9ca0-40b7-a4aa-e17563ace1ce'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO projects (
        id,
        title,
        color,
        owner_id
      ) 
      VALUES (
        '156dc1e5-882d-424b-b131-ed0ebdc8218f',
        'Personal', 
        '#FFFFD4', 
        'fb4cad39-9add-4633-8050-b933ad1d7458'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO projects (
        id,
        title,
        color,
        owner_id
      ) 
      VALUES (
        'b905021b-59e1-4c4a-a7e2-ee80fa4ef38e',
        'Tennis', 
        '#DDDDDD', 
        'fb4cad39-9add-4633-8050-b933ad1d7458'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO projects (
        id,
        title,
        color,
        owner_id
      ) 
      VALUES (
        '9f792d25-7b00-4d7d-afbd-60676eb4f6c1',
        'Personal', 
        '#FFFFD4', 
        '86fd5b28-eb9b-4c31-b19c-209a7ab050a4'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO projects (
        id,
        title,
        color,
        owner_id
      ) 
      VALUES (
        'd0f995b7-3b2d-4af1-8b56-7edf733dac5c',
        'Hobby', 
        '#AAAAAA', 
        '86fd5b28-eb9b-4c31-b19c-209a7ab050a4'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO projects (
        id,
        title,
        color,
        owner_id
      ) 
      VALUES (
        '95690325-1d67-410d-a17e-77f35f0f9d5b',
        'Sport', 
        '#AAADDD', 
        '86fd5b28-eb9b-4c31-b19c-209a7ab050a4'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO projects (
        id,
        title,
        color,
        owner_id
      ) 
      VALUES (
        'e72ab234-73d9-437e-b4c7-a031b23bb8e7',
        'Personal', 
        '#FFFFD4', 
        'cfd356c8-4a50-4721-a424-ee685a7b2ebe'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO projects (
        id,
        title,
        color,
        owner_id
      ) 
      VALUES (
        'a8093e51-4b24-4aed-b075-470624aec558',
        'Qatar2022', 
        '#CACACA', 
        'cfd356c8-4a50-4721-a424-ee685a7b2ebe'
      )`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
