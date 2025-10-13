/**
 * Base entity class that provides common fields and functionality for all entities
 *
 * Features:
 * - Snowflake ID generation for distributed systems
 * - UUID for external references
 * - Timestamps for creation, updates, and soft deletes
 * - Optimistic locking with version column
 * - Proper indexing for performance
 * - JSON serialization support
 */
export interface BaseEntityCustom {
  /**
   * Unique snowflake ID for distributed systems
   * Uses bigint type for large number support
   */
  id?: string;

  /**
   * UUID for external references and API responses
   * Indexed for fast lookups
   */
  uuid?: string;

  /**
   * Creation timestamp with microsecond precision
   * Indexed for sorting and filtering
   */
  createdAt?: Date;

  /**
   * Last update timestamp with microsecond precision
   * Indexed for sorting and filtering
   */
  updatedAt?: Date;

  /**
   * Soft delete timestamp for data retention
   * Indexed for soft delete queries
   */
  deletedAt?: Date | null;

  /**
   * Optimistic locking version for concurrency control
   * Automatically incremented on each update
   */
  version?: number;
}
