/**
 * Audit Logging Utilities
 *
 * This file provides helper functions to easily integrate audit logging
 * into existing CRUD operations in the CMS admin panel.
 */

import { createAuditLog, CreateAuditLogInput } from './supabase'

/**
 * Entity types that can be tracked in audit logs
 */
export type AuditEntityType =
  | 'page'
  | 'faq'
  | 'structured_data'
  | 'content_section'
  | 'media'
  | 'redirect'
  | 'internal_link'
  | 'specification'
  | 'page_type'

/**
 * Helper function to compute changes between old and new objects
 * @param oldObj - The original object
 * @param newObj - The new object with changes
 * @returns Object containing the changed fields with old and new values
 */
export function computeChanges<T extends Record<string, any>>(
  oldObj: T | null,
  newObj: Partial<T>
): Record<string, { old: any; new: any }> {
  const changes: Record<string, { old: any; new: any }> = {}

  if (!oldObj) {
    // For create operations, just show new values
    Object.keys(newObj).forEach(key => {
      if (newObj[key] !== undefined && newObj[key] !== null) {
        changes[key] = { old: null, new: newObj[key] }
      }
    })
    return changes
  }

  // For update operations, compare old and new values
  Object.keys(newObj).forEach(key => {
    const oldValue = oldObj[key]
    const newValue = newObj[key]

    // Skip if values are the same
    if (JSON.stringify(oldValue) === JSON.stringify(newValue)) {
      return
    }

    // Skip internal fields
    if (['updated_at', 'created_at'].includes(key)) {
      return
    }

    changes[key] = { old: oldValue, new: newValue }
  })

  return changes
}

/**
 * Create an audit log for a create operation
 */
export async function logCreate(params: {
  entityType: AuditEntityType
  entityId: string
  entityTitle: string
  newData?: Record<string, any>
  userId?: string
  userEmail?: string
}) {
  return createAuditLog({
    action: 'create',
    entity_type: params.entityType,
    entity_id: params.entityId,
    entity_title: params.entityTitle,
    changes: params.newData ? { created: params.newData } : null,
    user_id: params.userId,
    user_email: params.userEmail
  })
}

/**
 * Create an audit log for an update operation
 */
export async function logUpdate(params: {
  entityType: AuditEntityType
  entityId: string
  entityTitle: string
  oldData?: Record<string, any>
  newData?: Record<string, any>
  userId?: string
  userEmail?: string
}) {
  const changes = params.oldData && params.newData
    ? computeChanges(params.oldData, params.newData)
    : null

  return createAuditLog({
    action: 'update',
    entity_type: params.entityType,
    entity_id: params.entityId,
    entity_title: params.entityTitle,
    changes,
    user_id: params.userId,
    user_email: params.userEmail
  })
}

/**
 * Create an audit log for a delete operation
 */
export async function logDelete(params: {
  entityType: AuditEntityType
  entityId: string
  entityTitle: string
  deletedData?: Record<string, any>
  userId?: string
  userEmail?: string
}) {
  return createAuditLog({
    action: 'delete',
    entity_type: params.entityType,
    entity_id: params.entityId,
    entity_title: params.entityTitle,
    changes: params.deletedData ? { deleted: params.deletedData } : null,
    user_id: params.userId,
    user_email: params.userEmail
  })
}

/**
 * React hook-compatible function to get user info for audit logging
 * Can be used with the AuthWrapper context
 */
export function getUserInfoForAudit(userProfile: { id?: string; email?: string } | null): {
  userId?: string
  userEmail?: string
} {
  return {
    userId: userProfile?.id,
    userEmail: userProfile?.email
  }
}

/**
 * Example usage in a component:
 *
 * ```tsx
 * import { logCreate, logUpdate, logDelete, getUserInfoForAudit } from '@/lib/audit-utils'
 * import { useAuth } from '@/components/admin/AuthWrapper'
 *
 * function MyComponent() {
 *   const { userProfile } = useAuth()
 *   const userInfo = getUserInfoForAudit(userProfile)
 *
 *   const handleCreate = async () => {
 *     const result = await createPage(pageData)
 *     if (result.success && result.data) {
 *       await logCreate({
 *         entityType: 'page',
 *         entityId: result.data.id,
 *         entityTitle: result.data.title,
 *         newData: pageData,
 *         ...userInfo
 *       })
 *     }
 *   }
 *
 *   const handleUpdate = async () => {
 *     const oldPage = await getPageById(id)
 *     const result = await updatePage(id, updates)
 *     if (result.success) {
 *       await logUpdate({
 *         entityType: 'page',
 *         entityId: id,
 *         entityTitle: result.data?.title || oldPage?.title || 'Untitled',
 *         oldData: oldPage,
 *         newData: updates,
 *         ...userInfo
 *       })
 *     }
 *   }
 *
 *   const handleDelete = async () => {
 *     const page = await getPageById(id)
 *     const result = await deletePage(id)
 *     if (result.success) {
 *       await logDelete({
 *         entityType: 'page',
 *         entityId: id,
 *         entityTitle: page?.title || 'Untitled',
 *         deletedData: page,
 *         ...userInfo
 *       })
 *     }
 *   }
 * }
 * ```
 */
