export type Role =
  | 'master'
  | 'admin'
  | 'teacher';

export const permissions = {
  /*
  =====================================
  MASTER
  =====================================
  */

  master: {
    /*
    DASHBOARD
    */
    canViewDashboard: true,

    /*
    USERS & SECURITY
    */
    canManageUsers: true,
    canManageRoles: true,
    canManagePrimaryAdmin: true,
    canDeleteUsers: true,
    canViewSecurityLogs: true,
    canAccessMasterPanel: true,

    /*
    ENQUIRIES & ADMISSIONS
    */
    canViewEnquiries: true,
    canCreateEnquiries: true,
    canEditEnquiries: true,
    canDeleteEnquiries: true,
    canConvertAdmissions: true,

    /*
    STUDENTS
    */
    canViewStudents: true,
    canCreateStudents: true,
    canEditStudents: true,
    canDeleteStudents: true,

    /*
    BATCHES
    */
    canViewBatches: true,
    canCreateBatches: true,
    canEditBatches: true,
    canDeleteBatches: true,

    /*
    ATTENDANCE
    */
    canViewAttendance: true,
    canMarkAttendance: true,
    canEditAttendance: true,

    /*
    FEES
    */
    canManageFees: true,
    canCollectFees: true,
    canManageInstallments: true,
    canViewFeeReports: true,

    /*
    EXAMS & PERFORMANCE
    */
    canManageExams: true,
    canManagePerformance: true,
    canViewAnalytics: true,

    /*
    STAFF
    */
    canManageStaff: true,

    /*
    REPORTS
    */
    canViewReports: true,

    /*
    SETTINGS
    */
    canManageSystemSettings: true,
    canManageSubscriptions: true,
  },

  /*
  =====================================
  ADMIN
  =====================================
  */

  admin: {
    /*
    DASHBOARD
    */
    canViewDashboard: true,

    /*
    USERS & SECURITY
    */
    canManageUsers: true,
    canManageRoles: true,
    canManagePrimaryAdmin: false,
    canDeleteUsers: true,
    canViewSecurityLogs: false,
    canAccessMasterPanel: false,

    /*
    ENQUIRIES & ADMISSIONS
    */
    canViewEnquiries: true,
    canCreateEnquiries: true,
    canEditEnquiries: true,
    canDeleteEnquiries: true,
    canConvertAdmissions: true,

    /*
    STUDENTS
    */
    canViewStudents: true,
    canCreateStudents: true,
    canEditStudents: true,
    canDeleteStudents: false,

    /*
    BATCHES
    */
    canViewBatches: true,
    canCreateBatches: true,
    canEditBatches: true,
    canDeleteBatches: false,

    /*
    ATTENDANCE
    */
    canViewAttendance: true,
    canMarkAttendance: true,
    canEditAttendance: true,

    /*
    FEES
    */
    canManageFees: true,
    canCollectFees: true,
    canManageInstallments: true,
    canViewFeeReports: true,

    /*
    EXAMS & PERFORMANCE
    */
    canManageExams: true,
    canManagePerformance: true,
    canViewAnalytics: true,

    /*
    STAFF
    */
    canManageStaff: true,

    /*
    REPORTS
    */
    canViewReports: true,

    /*
    SETTINGS
    */
    canManageSystemSettings: false,
    canManageSubscriptions: false,
  },

  /*
  =====================================
  TEACHER
  =====================================
  */

  teacher: {
    /*
    DASHBOARD
    */
    canViewDashboard: true,

    /*
    USERS & SECURITY
    */
    canManageUsers: false,
    canManageRoles: false,
    canManagePrimaryAdmin: false,
    canDeleteUsers: false,
    canViewSecurityLogs: false,
    canAccessMasterPanel: false,

    /*
    ENQUIRIES & ADMISSIONS
    */
    canViewEnquiries: false,
    canCreateEnquiries: false,
    canEditEnquiries: false,
    canDeleteEnquiries: false,
    canConvertAdmissions: false,

    /*
    STUDENTS
    */
    canViewStudents: true,
    canCreateStudents: false,
    canEditStudents: false,
    canDeleteStudents: false,

    /*
    BATCHES
    */
    canViewBatches: true,
    canCreateBatches: false,
    canEditBatches: false,
    canDeleteBatches: false,

    /*
    ATTENDANCE
    */
    canViewAttendance: true,
    canMarkAttendance: true,
    canEditAttendance: false,

    /*
    FEES
    */
    canManageFees: false,
    canCollectFees: false,
    canManageInstallments: false,
    canViewFeeReports: false,

    /*
    EXAMS & PERFORMANCE
    */
    canManageExams: true,
    canManagePerformance: true,
    canViewAnalytics: false,

    /*
    STAFF
    */
    canManageStaff: false,

    /*
    REPORTS
    */
    canViewReports: false,

    /*
    SETTINGS
    */
    canManageSystemSettings: false,
    canManageSubscriptions: false,
  },
} as const;