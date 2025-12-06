"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { client } from '@/lib/api';
import { components } from '@/types/api';

type LectureInfoDTO = components['schemas']['LectureInfoDTO'];

const SubjectList = () => {
    // Search states
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [searchType, setSearchType] = useState<"name" | "professor">("name");
    const [selectedGrade, setSelectedGrade] = useState<string>("all");

    // Data states
    const [lectures, setLectures] = useState<LectureInfoDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [nextCursor, setNextCursor] = useState<number | undefined>(undefined);
    const [hasNext, setHasNext] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchLectures = useCallback(async (reset: boolean = false) => {
        setLoading(true);
        try {
            // Determine cursor to use
            const cursorToUse = reset ? undefined : nextCursor;

            // Prepare query params
            const queryParams: {
                cursorId?: number;
                size?: number;
                name?: string;
                professor?: string;
                grade?: number;
            } = {
                cursorId: cursorToUse,
                size: 20
            };

            if (debouncedSearch) {
                if (searchType === "name") {
                    queryParams.name = debouncedSearch;
                } else if (searchType === "professor") {
                    queryParams.professor = debouncedSearch;
                }
            }

            if (selectedGrade !== "all") {
                queryParams.grade = parseInt(selectedGrade);
            }

            // The generated API types use 'LECTURE_200_1' as the success key instead of 200,
            // which causes client.GET to infer 'data' as never or undefined for 200 OK.
            // We need to use 'as any' to bypass the strict type check for now.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error, response } = await client.GET("/api/lectures", {
                params: {
                    query: queryParams
                }
            }) as any;

            console.log("API Response:", { data, error, status: response?.status });

            if (data?.result) {
                // Verify the shape of data.result matches what we expect
                const result = data.result as components['schemas']['LectureListDTO'];
                const newLectures = result.lectures || [];
                setLectures(prev => reset ? newLectures : [...prev, ...newLectures]);
                setNextCursor(result.nextCursor);
                setHasNext(!!result.hasNext);
            } else {
                console.error("Failed to fetch lectures:", error);
            }
        } catch (e) {
            console.error("Error fetching lectures:", e);
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    }, [debouncedSearch, searchType, selectedGrade, nextCursor]);

    // Initial fetch and when filters change
    useEffect(() => {
        setNextCursor(undefined);
        fetchLectures(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, searchType, selectedGrade]);

    const handleLoadMore = () => {
        if (!loading && hasNext) {
            fetchLectures(false);
        }
    };

    const formatSchedule = (schedules?: components['schemas']['ScheduleDTO'][]) => {
        if (!schedules || schedules.length === 0) return "미지정";
        return schedules.map(s => `${s.day} ${s.startTime} (${s.classroom})`).join(", ");
    };

    const getMajorTypeBadge = (type?: string) => {
        if (!type) return <Badge variant="secondary">기타</Badge>;
        // Simple heuristic, adjust based on actual enum values from backend
        if (type.includes("전공")) {
            return <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">{type}</Badge>;
        }
        return <Badge variant="secondary">{type}</Badge>;
    };

    return (
        <div className="container py-10 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">과목 조회</h1>
                <p className="text-muted-foreground">수강신청 가능한 과목 목록입니다.</p>
            </div>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex gap-2 flex-1">
                    <Select
                        value={searchType}
                        onValueChange={(val: "name" | "professor") => setSearchType(val)}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="검색 기준" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">과목명</SelectItem>
                            <SelectItem value="professor">교수명</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        type="text"
                        placeholder={`${searchType === 'name' ? '과목명' : '교수명'}으로 검색...`}
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        className="max-w-md flex-1"
                    />
                </div>

                <div className="w-full md:w-[150px]">
                    <Select
                        value={selectedGrade}
                        onValueChange={setSelectedGrade}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="학년 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">전체 학년</SelectItem>
                            <SelectItem value="1">1학년</SelectItem>
                            <SelectItem value="2">2학년</SelectItem>
                            <SelectItem value="3">3학년</SelectItem>
                            <SelectItem value="4">4학년</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="border rounded-md mb-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">이수구분</TableHead>
                            <TableHead>학년</TableHead>
                            <TableHead>과목명</TableHead>
                            <TableHead>교수</TableHead>
                            <TableHead>학점</TableHead>
                            <TableHead>시간/장소</TableHead>
                            <TableHead className="text-right">작업</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lectures.length === 0 && !loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    {isInitialLoad ? "로딩 중..." : "검색 결과가 없습니다."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            lectures.map((lecture) => (
                                <TableRow key={lecture.teachId}>
                                    <TableCell>
                                        {getMajorTypeBadge(lecture.type)}
                                    </TableCell>
                                    <TableCell>{lecture.targetGrade}</TableCell>
                                    <TableCell className="font-medium">
                                        {lecture.courseName}
                                        <div className="text-xs text-muted-foreground">{lecture.className}</div>
                                    </TableCell>
                                    <TableCell>{lecture.professorName}</TableCell>
                                    <TableCell>{lecture.credit}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatSchedule(lecture.schedules)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/subjects/${lecture.teachId}`}>
                                            <Button variant="outline" size="sm">
                                                상세보기
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {loading && (
                <div className="text-center py-4 text-muted-foreground">
                    불러오는 중...
                </div>
            )}

            {!loading && hasNext && (
                <div className="flex justify-center py-4">
                    <Button variant="outline" onClick={handleLoadMore}>
                        더 보기
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SubjectList;
