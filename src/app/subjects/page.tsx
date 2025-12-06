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
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

type LectureInfoDTO = components['schemas']['LectureInfoDTO'];
type BucketResponseDTO = components['schemas']['BucketResponseDTO'];
type BucketSummaryDTO = components['schemas']['BucketSummaryDTO'];

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

    // Bucket states for Alternative Subject feature
    const [buckets, setBuckets] = useState<BucketSummaryDTO[]>([]);
    const [selectedBucketId, setSelectedBucketId] = useState<string>("");
    const [myBucketElements, setMyBucketElements] = useState<BucketResponseDTO[]>([]);

    // Operation loading states
    const [addingToBucketId, setAddingToBucketId] = useState<number | null>(null);
    const [settingAlternativeId, setSettingAlternativeId] = useState<number | null>(null);

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

    const fetchBuckets = async () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: bucketsData } = await client.GET("/api/buckets", {}) as any;

            if (bucketsData?.result) {
                const buckets = bucketsData.result as BucketSummaryDTO[];
                setBuckets(buckets);

                // Set default bucket (best or first) if not already set
                if (!selectedBucketId && buckets.length > 0) {
                    const best = buckets.find(b => b.isBest) || buckets[0];
                    if (best && best.bucketId) {
                        setSelectedBucketId(String(best.bucketId));
                    }
                }
            }
        } catch (e) {
            console.error("Error fetching buckets:", e);
        }
    };

    const fetchBucketElements = async () => {
        if (!selectedBucketId) return;

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: elementsData } = await client.GET("/api/buckets/{bucketId}/elements", {
                params: {
                    path: { bucketId: parseInt(selectedBucketId) }
                }
            }) as any;

            if (elementsData?.result) {
                setMyBucketElements(elementsData.result as BucketResponseDTO[]);
            }
        } catch (e) {
            console.error("Error fetching bucket elements:", e);
        }
    };

    const handleAddToBucket = async (teachId: number) => {
        if (!selectedBucketId) {
            toast.error("장바구니를 먼저 선택해주세요.");
            return;
        }

        setAddingToBucketId(teachId);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await client.POST("/api/buckets/{bucketId}/elements", {
                params: {
                    path: { bucketId: parseInt(selectedBucketId) }
                },
                body: {
                    teachId: teachId
                }
            }) as any;

            if (data?.isSuccess) {
                toast.success("장바구니에 담았습니다.");
                fetchBucketElements(); // Refresh elements to show updated state
            } else {
                toast.error(`추가 실패: ${data?.message || error || "Unknown error"}`);
            }
        } catch (e) {
            console.error("Error adding to bucket:", e);
            toast.error("장바구니 추가 중 오류가 발생했습니다.");
        } finally {
            setAddingToBucketId(null);
        }
    };

    const handleSetAlternative = async (bucketElementId: number, alternateTeachId: number) => {
        if (!selectedBucketId) return;

        setSettingAlternativeId(bucketElementId);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await client.PATCH("/api/buckets/{bucketId}/elements/{elementId}/alternate", {
                params: {
                    path: {
                        bucketId: parseInt(selectedBucketId),
                        elementId: bucketElementId
                    }
                },
                body: {
                    alternateTeachId: alternateTeachId
                }
            }) as any;

            if (data?.isSuccess) {
                // Refresh bucket elements to update the UI
                fetchBucketElements();
                toast.success("대체 과목이 설정되었습니다.");
            } else {
                toast.error(`설정 실패: ${data?.message || error || "Unknown error"}`);
            }
        } catch (e) {
            console.error("Error setting alternative subject:", e);
            toast.error("대체 과목 설정 중 오류가 발생했습니다.");
        } finally {
            setSettingAlternativeId(null);
        }
    };

    // Initial fetch and when filters change
    useEffect(() => {
        setNextCursor(undefined);
        fetchLectures(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, searchType, selectedGrade]);

    // Fetch buckets on mount
    useEffect(() => {
        fetchBuckets();
    }, []);

    // Fetch elements when selected bucket changes
    useEffect(() => {
        if (selectedBucketId) {
            fetchBucketElements();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBucketId]);

    const handleLoadMore = () => {
        if (!loading && hasNext) {
            fetchLectures(false);
        }
    };

    const formatSchedule = (schedules?: components['schemas']['ScheduleDTO'][]) => {
        if (!schedules || schedules.length === 0) return "미지정";
        return schedules.map(s => <p>{`${s.day} ${s.startTime} (${s.classroom})`}</p>);
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
            <div className="flex items-center gap-4 mb-8">
                <h1 className="text-3xl font-bold">과목 조회</h1>
                {buckets.length > 0 && (
                    <div className="w-[200px]">
                        <Select value={selectedBucketId} onValueChange={setSelectedBucketId}>
                            <SelectTrigger>
                                <SelectValue placeholder="장바구니 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {buckets.map((b) => (
                                    <SelectItem key={b.bucketId} value={String(b.bucketId)}>
                                        {b.name} {b.isBest ? "(대표)" : ""}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
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
                                        <div className="text-xs text-muted-foreground">{lecture.className ? `분반: ${lecture.className}` : ""}</div>
                                    </TableCell>
                                    <TableCell>{lecture.professorName}</TableCell>
                                    <TableCell>{lecture.credit}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatSchedule(lecture.schedules)}
                                    </TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-2">
                                        {/* Add to Bucket Button */}
                                        {(() => {
                                            const isInBucket = myBucketElements.some(el => el.teachId === lecture.teachId);
                                            return (
                                                <Button
                                                    variant={isInBucket ? "secondary" : "outline"}
                                                    size="sm"
                                                    disabled={isInBucket || addingToBucketId === lecture.teachId}
                                                    onClick={() => {
                                                        if (lecture.teachId && !isInBucket) handleAddToBucket(lecture.teachId);
                                                    }}
                                                >
                                                    {addingToBucketId === lecture.teachId ? (
                                                        <Spinner className="mr-2 h-4 w-4" />
                                                    ) : null}
                                                    {isInBucket ? "담김" : "담기"}
                                                </Button>
                                            );
                                        })()}

                                        {/* Alternative Dropdown */}
                                        <div className="w-[180px]">
                                            <Select
                                                disabled={!!settingAlternativeId}
                                                onValueChange={(value) => {
                                                    // value is bucketElementId string
                                                    if (lecture.teachId) {
                                                        handleSetAlternative(parseInt(value), lecture.teachId);
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="대체 과목으로 설정" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {myBucketElements
                                                        .filter(el => !el.alternateTeachId) // Only show elements without alternative
                                                        .map(el => (
                                                            <SelectItem key={el.bucketElementId} value={String(el.bucketElementId)}>
                                                                {el.courseName}
                                                            </SelectItem>
                                                        ))
                                                    }
                                                    {myBucketElements.filter(el => !el.alternateTeachId).length === 0 && (
                                                        <div className="p-2 text-xs text-muted-foreground text-center">
                                                            설정 가능한 과목 없음
                                                        </div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {settingAlternativeId && lecture.teachId && /* We might need to know WHICH dropdown is loading, but simplifying for now or mapping correctly */ null}
                                        </div>
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
