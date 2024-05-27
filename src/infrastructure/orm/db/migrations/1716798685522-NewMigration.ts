import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigration1716798685522 implements MigrationInterface {
  name = 'NewMigration1716798685522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "is2faAuthenticated" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "is2faAuthenticated"`,
    );
  }
}
