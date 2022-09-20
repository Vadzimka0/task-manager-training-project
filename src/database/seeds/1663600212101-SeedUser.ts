import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUser1663600212101 implements MigrationInterface {
  name = 'SeedUser1663600212101';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // password is 'Y29nbml0ZXE='
    await queryRunner.query(
      `INSERT INTO users (
        id,
        email, 
        username, 
        password,
        mimetype,
        path,
        filename
      ) 
      VALUES (
        'f60c913b-0859-4797-8dea-c07409ffcf0d',
        'lionelmessi@gmail.com', 
        'messi', 
        '$2b$10$yyVssZrCF0yaQDV5Qfup8OauLaUNfJzy0slT3Kok.0X933TGbjHDq',
        'image/jpeg',
        'uploads/users-avatar/f60c913b-0859-4797-8dea-c07409ffcf0d',
        'avatar-messi.jpg'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO users (
        id,
        email, 
        username, 
        password,
        mimetype,
        path,
        filename
      ) 
      VALUES (
        'cc6864ed-9ca0-40b7-a4aa-e17563ace1ce',
        'cristianoronaldo@gmail.com', 
        'cr7', 
        '$2b$10$49DjCzXAtekgfyVs8Lh24unmbsH481z6tCar7FC9fK1Ru1giW2yEu',
        'image/jpeg',
        'uploads/users-avatar/cc6864ed-9ca0-40b7-a4aa-e17563ace1ce',
        'avatar-ronaldo.jpg'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO users (
        id,
        email, 
        username, 
        password,
        mimetype,
        path,
        filename
      ) 
      VALUES (
        'fb4cad39-9add-4633-8050-b933ad1d7458',
        'rogerfederer@gmail.com', 
        'fedex', 
        '$2b$10$0kJ.UqL7BWhMTaon/H362enJK3.b71h4EVldhW/Kf/U7bNtgEW5Ui',
        'image/jpeg',
        'uploads/users-avatar/fb4cad39-9add-4633-8050-b933ad1d7458',
        'avatar-federer.jpg'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO users (
        id,
        email, 
        username, 
        password,
        mimetype,
        path,
        filename
      ) 
      VALUES (
        '86fd5b28-eb9b-4c31-b19c-209a7ab050a4',
        'rafaelnadal@gmail.com', 
        'rafa', 
        '$2b$10$3IOzgWmVPlUdgPlJo3x9uu.6EgY8Y5PoPVi7MrCKy5Chs8zHVHeN6',
        'image/jpeg',
        'uploads/users-avatar/86fd5b28-eb9b-4c31-b19c-209a7ab050a4',
        'avatar-nadal.jpg'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO users (
        id,
        email, 
        username, 
        password,
        mimetype,
        path,
        filename
      ) 
      VALUES (
        'cfd356c8-4a50-4721-a424-ee685a7b2ebe',
        'nikolajokic@gmail.com', 
        'joker', 
        '$2b$10$49DjCzXAtekgfyVs8Lh24unmbsH481z6tCar7FC9fK1Ru1giW2yEu',
        'image/png',
        'uploads/users-avatar/cfd356c8-4a50-4721-a424-ee685a7b2ebe',
        'avatar-jokic.png'
      )`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
