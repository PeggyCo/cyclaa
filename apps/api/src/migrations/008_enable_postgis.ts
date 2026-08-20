/**
 * Migration: Enable PostGIS extension and create geospatial indexes
 * Enables location-based queries for mechanic proximity matching
 */

import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  // Enable PostGIS extension
  await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis');

  // Create geometry column in MechanicProfiles for location tracking
  // This stores mechanic's service location as a point
  await queryInterface.sequelize.query(`
    ALTER TABLE "MechanicProfiles"
    ADD COLUMN IF NOT EXISTS location geometry(Point, 4326);
  `);
  await queryInterface.sequelize.query(`
    COMMENT ON COLUMN "MechanicProfiles".location
    IS 'PostGIS point: (latitude, longitude) in EPSG:4326 (WGS84)';
  `);

  // Create spatial index on MechanicProfiles location
  await queryInterface.sequelize.query(`
    CREATE INDEX IF NOT EXISTS idx_mechanic_profiles_location
    ON "MechanicProfiles"
    USING GIST(location);
  `);

  // Create geometry column in Bookings for service location
  await queryInterface.sequelize.query(`
    ALTER TABLE "Bookings"
    ADD COLUMN IF NOT EXISTS service_location_geom geometry(Point, 4326);
  `);
  await queryInterface.sequelize.query(`
    COMMENT ON COLUMN "Bookings".service_location_geom
    IS 'PostGIS point of service location for proximity queries';
  `);

  // Create spatial index on Bookings service location
  await queryInterface.sequelize.query(`
    CREATE INDEX IF NOT EXISTS idx_bookings_service_location
    ON "Bookings"
    USING GIST(service_location_geom);
  `);

  // Create geometry column in Rides for meeting point
  await queryInterface.sequelize.query(`
    ALTER TABLE "Rides"
    ADD COLUMN IF NOT EXISTS meeting_point_geom geometry(Point, 4326);
  `);
  await queryInterface.sequelize.query(`
    COMMENT ON COLUMN "Rides".meeting_point_geom
    IS 'PostGIS point of ride meeting location';
  `);

  // Create spatial index on Rides meeting point
  await queryInterface.sequelize.query(`
    CREATE INDEX IF NOT EXISTS idx_rides_meeting_point
    ON "Rides"
    USING GIST(meeting_point_geom);
  `);
}

export async function down(queryInterface: QueryInterface) {
  // Drop spatial indexes
  await queryInterface.sequelize.query(`
    DROP INDEX IF EXISTS idx_mechanic_profiles_location;
  `);

  await queryInterface.sequelize.query(`
    DROP INDEX IF EXISTS idx_bookings_service_location;
  `);

  await queryInterface.sequelize.query(`
    DROP INDEX IF EXISTS idx_rides_meeting_point;
  `);

  // Remove geometry columns (optional - can keep columns for data preservation)
  // Uncomment if you want to remove the columns on rollback
  // await queryInterface.sequelize.query(`
  //   ALTER TABLE "MechanicProfiles" DROP COLUMN IF EXISTS location;
  // `);
  // await queryInterface.sequelize.query(`
  //   ALTER TABLE "Bookings" DROP COLUMN IF EXISTS service_location_geom;
  // `);
  // await queryInterface.sequelize.query(`
  //   ALTER TABLE "Rides" DROP COLUMN IF EXISTS meeting_point_geom;
  // `);

  // Note: PostGIS extension is left installed (can't reliably uninstall if other databases use it)
}
