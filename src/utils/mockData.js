export const mockStudents = [
    {
        studentId: "20230001",
        departmentId: "DEPT01",
        nickname: "빛의속도",
        password: "password123",
        name: "김학생",
        avgLatency: 250, // ms
    },
];

export const mockColleges = [
    { collegeId: "COL01", name: "IT대학" },
    { collegeId: "COL02", name: "공과대학" },
];

export const mockDepartments = [
    { departmentId: "DEPT01", collegeId: "COL01", name: "소프트웨어학부" },
    { departmentId: "DEPT02", collegeId: "COL01", name: "AI융합학부" },
    { departmentId: "DEPT03", collegeId: "COL02", name: "기계공학과" },
];

export const mockProfessors = [
    { professorId: "PROF01", departmentId: "DEPT01", name: "김교수" },
    { professorId: "PROF02", departmentId: "DEPT01", name: "이교수" },
    { professorId: "PROF03", departmentId: "DEPT02", name: "박교수" },
];

export const mockSubjects = [
    { subjectId: "SUB01", name: "자료구조", isMajor: true, credits: 3 },
    { subjectId: "SUB02", name: "알고리즘", isMajor: true, credits: 3 },
    { subjectId: "SUB03", name: "운영체제", isMajor: true, credits: 3 },
    { subjectId: "SUB04", name: "데이터베이스", isMajor: true, credits: 3 },
    { subjectId: "SUB05", name: "컴퓨터네트워크", isMajor: true, credits: 3 },
    { subjectId: "SUB06", name: "미적분학I", isMajor: false, credits: 3 },
];

export const mockClasses = [
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

export const mockCarts = [
    {
        cartId: "CART01",
        studentId: "20230001",
        name: "기본 장바구니",
        number: 1,
        createdAt: "2024-03-01T10:00:00Z",
    },
];

export const mockCartItems = [
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

export const mockSimulationResults = [
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

export const mockCompletionDivisions = [
    { divisionId: "CD001", name: "전공필수" },
    { divisionId: "CD002", name: "전공선택" },
    { divisionId: "CD003", name: "교양필수" },
    { divisionId: "CD004", name: "교양선택" }
];

export const mockUsers = [
    {
        id: "user1",
        studentId: "20230001",
        password: "password123",
        name: "김학생"
    }
];

// Helper to get full subject details
export const getSubjectDetails = (subjectId) => {
    const subject = mockSubjects.find(s => s.subjectId === subjectId);
    if (!subject) return null;

    const classInfo = mockClasses.find(c => c.subjectId === subjectId);
    const professor = mockProfessors.find(p => p.professorId === classInfo?.professorId);

    return {
        ...subject,
        ...classInfo,
        professorName: professor ? professor.name : "미정"
    };
};
