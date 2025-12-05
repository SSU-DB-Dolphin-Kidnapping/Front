export interface Student {
    id?: number;
    studentId: string;
    departmentId: string;
    nickname: string;
    password: string;
    name: string;
    avgLatency: number;
}

export const mockStudents: Student[] = [
    {
        studentId: "20230001",
        departmentId: "DEPT01",
        nickname: "빛의속도",
        password: "password123",
        name: "김학생",
        avgLatency: 250, // ms
    },
];

export interface College {
    collegeId: string;
    name: string;
}

export const mockColleges: College[] = [
    { collegeId: "COL01", name: "IT대학" },
    { collegeId: "COL02", name: "공과대학" },
];

export interface Department {
    departmentId: string;
    collegeId: string;
    name: string;
}

export const mockDepartments: Department[] = [
    { departmentId: "DEPT01", collegeId: "COL01", name: "소프트웨어학부" },
    { departmentId: "DEPT02", collegeId: "COL01", name: "AI융합학부" },
    { departmentId: "DEPT03", collegeId: "COL02", name: "기계공학과" },
];

export interface ApiCollege {
    collegeId: number;
    name: string;
}

export const apiColleges: ApiCollege[] = [
    { collegeId: 1, name: "IT대학" },
    { collegeId: 2, name: "공과대학" },
    { collegeId: 3, name: "경영대학" },
    { collegeId: 4, name: "인문대학" },
];

export interface ApiDepartment {
    departmentId: number;
    collegeId: number;
    name: string;
}

export const apiDepartments: ApiDepartment[] = [
    { departmentId: 1, collegeId: 1, name: "소프트웨어학부" },
    { departmentId: 2, collegeId: 1, name: "AI융합학부" },
    { departmentId: 3, collegeId: 1, name: "컴퓨터학부" },
    { departmentId: 4, collegeId: 1, name: "글로벌미디어학부" },
    { departmentId: 5, collegeId: 1, name: "정보통신전자공학부" },
    { departmentId: 6, collegeId: 2, name: "기계공학부" },
    { departmentId: 7, collegeId: 2, name: "전기공학부" },
    { departmentId: 8, collegeId: 2, name: "산업정보시스템공학과" },
    { departmentId: 9, collegeId: 3, name: "경영학부" },
    { departmentId: 10, collegeId: 3, name: "국제무역학과" },
    { departmentId: 11, collegeId: 4, name: "국어국문학과" },
    { departmentId: 12, collegeId: 4, name: "영어영문학과" },
];

export interface Professor {
    professorId: string;
    departmentId: string;
    name: string;
}

export const mockProfessors: Professor[] = [
    { professorId: "PROF01", departmentId: "DEPT01", name: "김교수" },
    { professorId: "PROF02", departmentId: "DEPT01", name: "이교수" },
    { professorId: "PROF03", departmentId: "DEPT02", name: "박교수" },
];

export interface Subject {
    subjectId: string;
    name: string;
    isMajor: boolean;
    credits: number;
}

export const mockSubjects: Subject[] = [
    { subjectId: "SUB01", name: "자료구조", isMajor: true, credits: 3 },
    { subjectId: "SUB02", name: "알고리즘", isMajor: true, credits: 3 },
    { subjectId: "SUB03", name: "운영체제", isMajor: true, credits: 3 },
    { subjectId: "SUB04", name: "데이터베이스", isMajor: true, credits: 3 },
    { subjectId: "SUB05", name: "컴퓨터네트워크", isMajor: true, credits: 3 },
    { subjectId: "SUB06", name: "미적분학I", isMajor: false, credits: 3 },
];

export interface ClassInfo {
    classId: string;
    subjectId: string;
    professorId: string;
    day: string;
    startTime: string;
    endTime: string;
    room: string;
    year: number;
    semester: number;
    number: number;
    section: string;
    maxStudents: number;
    currentStudents: number;
}

export const mockClasses: ClassInfo[] = [
    {
        classId: "CLS01",
        subjectId: "SUB01",
        professorId: "PROF01",
        day: "월",
        startTime: "10:30",
        endTime: "12:00",
        room: "정보관-101",
        year: 2024,
        semester: 1,
        number: 1,
        section: "A",
        maxStudents: 40,
        currentStudents: 35,
    },
    {
        classId: "CLS02",
        subjectId: "SUB02",
        professorId: "PROF02",
        day: "화",
        startTime: "13:30",
        endTime: "15:00",
        room: "정보관-102",
        year: 2024,
        semester: 1,
        number: 1,
        section: "A",
        maxStudents: 40,
        currentStudents: 38,
    },
    {
        classId: "CLS03",
        subjectId: "SUB03",
        professorId: "PROF01",
        day: "수",
        startTime: "09:00",
        endTime: "10:30",
        room: "정보관-103",
        year: 2024,
        semester: 1,
        number: 1,
        section: "A",
        maxStudents: 40,
        currentStudents: 10,
    },
    {
        classId: "CLS04",
        subjectId: "SUB04",
        professorId: "PROF03",
        day: "목",
        startTime: "15:00",
        endTime: "16:30",
        room: "정보관-104",
        year: 2024,
        semester: 1,
        number: 1,
        section: "A",
        maxStudents: 30,
        currentStudents: 29,
    },
];

export interface Cart {
    cartId: string;
    studentId: string;
    name: string;
    number: number;
    createdAt: string;
}

export const mockCarts: Cart[] = [
    {
        cartId: "CART01",
        studentId: "20230001",
        name: "기본 장바구니",
        number: 1,
        createdAt: "2024-03-01T10:00:00Z",
    },
];

export interface CartItem {
    itemId: string;
    cartId: string;
    subjectId: string;
    priority: number;
    substituteSubjectId: string | null;
}

export const mockCartItems: CartItem[] = [
    {
        itemId: "ITEM01",
        cartId: "CART01",
        subjectId: "SUB01",
        priority: 1,
        substituteSubjectId: null,
    },
    {
        itemId: "ITEM02",
        cartId: "CART01",
        subjectId: "SUB02",
        priority: 2,
        substituteSubjectId: "SUB06",
    },
];

export interface SimulationResult {
    itemId: string;
    testId: string;
    success: boolean;
    failReason: string | null;
}

export const mockSimulationResults: SimulationResult[] = [
    {
        itemId: "ITEM01",
        testId: "TEST01",
        success: true,
        failReason: null,
    },
    {
        itemId: "ITEM02",
        testId: "TEST01",
        success: false,
        failReason: "정원 초과",
    },
];

export interface CompletionDivision {
    divisionId: string;
    name: string;
}

export const mockCompletionDivisions: CompletionDivision[] = [
    { divisionId: "CD001", name: "전공필수" },
    { divisionId: "CD002", name: "전공선택" },
    { divisionId: "CD003", name: "교양필수" },
    { divisionId: "CD004", name: "교양선택" }
];

export const mockUsers = [
    {
        id: "user1",
        studentId: "20230001",
        departmentId: "DEPT01",
        nickname: "빛의속도",
        password: "password123",
        name: "김학생",
        avgLatency: 250
    }
];

export interface SubjectDetails extends Subject, Omit<Partial<ClassInfo>, 'subjectId'> {
    professorName: string;
}

// Helper to get full subject details
export const getSubjectDetails = (subjectId: string): SubjectDetails | null => {
    const subject = mockSubjects.find(s => s.subjectId === subjectId);
    if (!subject) return null;

    const classInfo = mockClasses.find(c => c.subjectId === subjectId);
    const professor = mockProfessors.find(p => p.professorId === classInfo?.professorId);

    return {
        ...subject,
        ...(classInfo || {}),
        professorName: professor ? professor.name : "미정"
    };
};
export interface TestSummary {
    testId: number;
    testDate: string;
    totalCourses: number;
    successCount: number;
    failCount: number;
}

export const mockTestSummaries: TestSummary[] = [
    {
        testId: 1,
        testDate: "2024-03-15T10:00:00",
        totalCourses: 6,
        successCount: 5,
        failCount: 1
    },
    {
        testId: 2,
        testDate: "2024-03-16T14:30:00",
        totalCourses: 6,
        successCount: 6,
        failCount: 0
    }
];

export interface CourseResult {
    courseName: string;
    className: string;
    professorName: string;
    credit: number;
    isSuccess: boolean;
    failedReason?: string;
    priority: number;
}

export interface TestDetail {
    testId: number;
    testDate: string;
    studentName: string;
    bucketName: string;
    totalCourses: number;
    successCount: number;
    failCount: number;
    plannedCredit: number;
    earnedCredit: number;
    courses: CourseResult[];
}

export const mockTestDetail: TestDetail = {
    testId: 1,
    testDate: "2024-03-15T10:00:00",
    studentName: "김학생",
    bucketName: "기본 장바구니",
    totalCourses: 6,
    successCount: 5,
    failCount: 1,
    plannedCredit: 18,
    earnedCredit: 15,
    courses: [
        {
            courseName: "자료구조",
            className: "A반",
            professorName: "김교수",
            credit: 3,
            isSuccess: true,
            priority: 1
        },
        {
            courseName: "알고리즘",
            className: "A반",
            professorName: "이교수",
            credit: 3,
            isSuccess: true,
            priority: 2
        },
        {
            courseName: "운영체제",
            className: "A반",
            professorName: "박교수",
            credit: 3,
            isSuccess: true,
            priority: 3
        },
        {
            courseName: "데이터베이스",
            className: "A반",
            professorName: "최교수",
            credit: 3,
            isSuccess: false,
            failedReason: "정원 초과",
            priority: 4
        },
        {
            courseName: "컴퓨터네트워크",
            className: "A반",
            professorName: "정교수",
            credit: 3,
            isSuccess: true,
            priority: 5
        },
        {
            courseName: "미적분학I",
            className: "B반",
            professorName: "수학자",
            credit: 3,
            isSuccess: true,
            priority: 6
        }
    ]
};

export interface BucketSummaryDTO {
    bucketId: number;
    name: string;
    isBest: boolean;
    createdAt: string;
}

export const mockBucketSummaries: BucketSummaryDTO[] = [
    {
        bucketId: 1,
        name: "기본 장바구니",
        isBest: true,
        createdAt: "2024-03-01T10:00:00Z"
    },
    {
        bucketId: 2,
        name: "플랜 B",
        isBest: false,
        createdAt: "2024-03-02T15:30:00Z"
    }
];

export interface BucketResponseDTO {
    bucketElementId: number;
    teachId: number;
    priority: number;
    majorType: string;
    courseName: string;
    professorName: string;
    timePlace: string;
    alternateTeachId?: number;
    alternateSubjectName?: string;
}

export const mockBucketItems: BucketResponseDTO[] = [
    {
        bucketElementId: 101,
        teachId: 2001,
        priority: 1,
        majorType: "전공",
        courseName: "자료구조",
        professorName: "김교수",
        timePlace: "월 10:30-12:00 (정보관-101)",
        alternateTeachId: 2005,
        alternateSubjectName: "알고리즘"
    },
    {
        bucketElementId: 102,
        teachId: 2002,
        priority: 2,
        majorType: "교양",
        courseName: "현대사회와윤리",
        professorName: "이철학",
        timePlace: "화 13:30-15:00 (진리관-204)"
    }
];
