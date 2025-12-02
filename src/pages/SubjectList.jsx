import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockSubjects, getSubjectDetails } from '../utils/mockData';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const SubjectList = () => {
    const [searchTerm, setSearchTerm] = useState("");

    // Enrich subjects with professor info for searching
    const enrichedSubjects = mockSubjects.map(s => getSubjectDetails(s.subjectId));

    const filteredSubjects = enrichedSubjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.subjectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.professorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container py-10 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">과목 조회</h1>
                <p className="text-muted-foreground">수강신청 가능한 과목 목록입니다.</p>
            </div>

            <div className="mb-6">
                <Input
                    type="text"
                    placeholder="과목명, 과목코드, 또는 교수명으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>이수구분</TableHead>
                            <TableHead>과목코드</TableHead>
                            <TableHead>과목명</TableHead>
                            <TableHead>교수</TableHead>
                            <TableHead>학점</TableHead>
                            <TableHead>시간/장소</TableHead>
                            <TableHead className="text-right">작업</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSubjects.map(subject => (
                            <TableRow key={subject.subjectId}>
                                <TableCell>
                                    <Badge variant="secondary">
                                        {subject.isMajor ? "전공" : "교양"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{subject.subjectId}</TableCell>
                                <TableCell className="font-medium">{subject.name}</TableCell>
                                <TableCell>{subject.professorName}</TableCell>
                                <TableCell>{subject.credits}학점</TableCell>
                                <TableCell>{subject.day} {subject.startTime} ({subject.room})</TableCell>
                                <TableCell className="text-right">
                                    <Link to={`/subjects/${subject.subjectId}`}>
                                        <Button variant="outline" size="sm">
                                            상세보기
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredSubjects.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    검색 결과가 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default SubjectList;
