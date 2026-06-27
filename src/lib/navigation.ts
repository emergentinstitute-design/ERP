import {
  LayoutDashboard,
  Users,
  UserCog,
  GraduationCap,
  ClipboardCheck,
  Clock,
  Briefcase,
  ReceiptIndianRupee,
  Building2,
  BarChart3,
  Shield,
  CreditCard,
  MessageSquare,
  FileText,
  BookOpen,
  TrendingUp,
  BadgeDollarSign,
  UserCheck,
  PlusCircle,
  PenLine,
  LineChart,
} from 'lucide-react';

export const navigationByRole = {
  /*
  =====================================
  MASTER
  =====================================
  */

  master: [
    {
      group: 'Main',
      items: [
        {
          icon: LayoutDashboard,
          label: 'Dashboard',
          href: '/',
        },
        {
          icon: MessageSquare,
          label: 'Enquiries',
          href: '/enquiries',
        },
        {
          icon: Users,
          label: 'Users & Roles',
          href: '/users',
        },
        {
          icon: UserCog,
          label: 'Master Control',
          href: '/master',
        },
      ],
    },

    {
      group: 'Academic',
      items: [
        {
          icon: GraduationCap,
          label: 'Students',
          href: '/students',
        },
      ],
    },

    {
      group: 'Exams',
      items: [
        {
          icon: PlusCircle,
          label: 'Create Exam',
          href: '/exam/create_exam',
        },
        {
          icon: PenLine,
          label: 'Add Scores',
          href: '/exam/add-score',
        },
        {
          icon: BarChart3,
          label: 'Batch Reports',
          href: '/exam/report/batch',
        },
        {
          icon: LineChart,
          label: 'Student Analytics',
          href: '/exam/analytics/student',
        },
      ],
    },

    {
      group: 'Reports',
      items: [
        {
          icon: BarChart3,
          label: 'Fees Reports',
          href: '/report/fees',
        },
      ],
    },
  ],

  /*
  =====================================
  ADMIN
  =====================================
  */

  admin: [
    {
      group: 'Main',
      items: [
        {
          icon: LayoutDashboard,
          label: 'Dashboard',
          href: '/',
        },
        {
          icon: MessageSquare,
          label: 'Enquiries',
          href: '/enquiry',
        },
        {
          icon: UserCheck,
          label: 'Admissions',
          href: '/admissions',
        },
        {
          icon: Users,
          label: 'Users & Roles',
          href: '/users',
        },
      ],
    },

    {
      group: 'Academic',
      items: [
        {
          icon: GraduationCap,
          label: 'Students',
          href: '/students',
        },
        {
          icon: TrendingUp,
          label: 'Performance',
          href: '/performance',
        },
        {
          icon: Clock,
          label: 'Schedules',
          href: '/schedules',
        },
      ],
    },

    {
      group: 'Exams',
      items: [
        {
          icon: PlusCircle,
          label: 'Create Exam',
          href: '/exam/create_exam',
        },
        {
          icon: PenLine,
          label: 'Add Scores',
          href: '/exam/add-score',
        },
        {
          icon: BarChart3,
          label: 'Batch Reports',
          href: '/exam/report/batch',
        },
        {
          icon: LineChart,
          label: 'Student Analytics',
          href: '/exam/analytics/student',
        },
      ],
    },

    {
      group: 'Finance',
      items: [
        {
          icon: ReceiptIndianRupee,
          label: 'Fees',
          href: '/fees',
        },
        {
          icon: BadgeDollarSign,
          label: 'Installments',
          href: '/installments',
        },
      ],
    },

    {
      group: 'Administration',
      items: [
        {
          icon: Briefcase,
          label: 'Staff',
          href: '/staff',
        },
      ],
    },

    {
      group: 'Reports',
      items: [
        {
          icon: BarChart3,
          label: 'Student Reports',
          href: '/reports/students',
        },
        {
          icon: FileText,
          label: 'Attendance Reports',
          href: '/reports/attendance',
        },
        {
          icon: FileText,
          label: 'Exam Reports',
          href: '/reports/exams',
        },
        {
          icon: BarChart3,
          label: 'Fees Reports',
          href: '/reports/fees',
        },
      ],
    },
  ],

  /*
  =====================================
  TEACHER
  =====================================
  */

  teacher: [
    {
      group: 'Main',
      items: [
        {
          icon: LayoutDashboard,
          label: 'Dashboard',
          href: '/',
        },
      ],
    },

    {
      group: 'Academic',
      items: [
        {
          icon: GraduationCap,
          label: 'Students',
          href: '/students',
        },
        {
          icon: ClipboardCheck,
          label: 'Attendance',
          href: '/attendance',
        },
        {
          icon: TrendingUp,
          label: 'Performance',
          href: '/performance',
        },
        {
          icon: Clock,
          label: 'Schedules',
          href: '/schedules',
        },
      ],
    },

    {
      group: 'Exams',
      items: [
        {
          icon: PlusCircle,
          label: 'Create Exam',
          href: '/exam/create_exam',
        },
        {
          icon: PenLine,
          label: 'Add Scores',
          href: '/exam/add-score',
        },
        {
          icon: BarChart3,
          label: 'Batch Reports',
          href: '/exam/report/batch',
        },
        {
          icon: LineChart,
          label: 'Student Analytics',
          href: '/exam/analytics/student',
        },
      ],
    },

    {
      group: 'Reports',
      items: [
        {
          icon: FileText,
          label: 'Student Reports',
          href: '/reports/students',
        },
      ],
    },
  ],
};