"use client";

import { useState, useEffect } from 'react';
import {
    mockBucketSummaries,
    mockBucketItems,
} from '@/utils/mockData';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { client } from '@/lib/api';
import { Plus, Star, Save } from 'lucide-react';
import { components } from '@/types/api';
import { Spinner } from "@/components/ui/spinner";

type BucketSummaryDTO = components["schemas"]["BucketSummaryDTO"];
type BucketResponseDTO = components["schemas"]["BucketResponseDTO"];

const Cart = () => {
    // State
    const [buckets, setBuckets] = useState<BucketSummaryDTO[]>([]);
    const [items, setItems] = useState<BucketResponseDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [newBucketName, setNewBucketName] = useState("");
    const [isCreatingWrapper, setIsCreatingWrapper] = useState(false); // UI toggle
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedBucketId, setSelectedBucketId] = useState<number | null>(null);

    // Operation loading states
    const [isCreating, setIsCreating] = useState(false);
    const [isSettingBest, setIsSettingBest] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Initial Fetch (Buckets)
    useEffect(() => {
        fetchBuckets();
    }, []);

    // Initial selection when buckets load
    useEffect(() => {
        if (!selectedBucketId && buckets.length > 0) {
            const best = buckets.find(b => b.isBest);
            const targetId = best?.bucketId ?? buckets[0]?.bucketId ?? null;
            if (targetId !== null) {
                setSelectedBucketId(targetId);
            }
        }
    }, [buckets, selectedBucketId]);

    // Fetch items when selection changes
    useEffect(() => {
        if (selectedBucketId) {
            fetchItems();
        } else {
            setItems([]);
        }
    }, [selectedBucketId]);

    const fetchBuckets = async () => {
        setLoading(true);
        try {
            const { data, error } = await client.GET("/api/buckets");
            if (data?.result) {
                setBuckets(data.result);
            } else {
                console.log("Using mock bucket summaries", error);
                setBuckets(mockBucketSummaries);
            }
        } catch (e) {
            console.error("Failed to fetch buckets", e);
            setBuckets(mockBucketSummaries);
        } finally {
            setLoading(false);
        }
    };

    const fetchItems = async () => {
        if (!selectedBucketId) return;

        try {
            const { data, error } = await client.GET("/api/buckets/{bucketId}/elements", {
                params: {
                    path: { bucketId: selectedBucketId }
                }
            });
            if (data?.result) {
                const fetchedItems = data.result;
                // Sort by priority
                setItems(fetchedItems.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0)));
            } else {
                console.log("Using mock bucket items", error);
                setItems(mockBucketItems.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0)));
            }
        } catch (e) {
            console.error("Failed to fetch items", e);
            setItems(mockBucketItems);
        }
    };

    const handleCreateBucket = async () => {
        if (!newBucketName.trim()) return;
        setIsCreating(true);
        try {
            const { error } = await client.POST("/api/buckets", {
                body: { name: newBucketName }
            });
            if (error) throw error;

            // Refresh buckets
            setNewBucketName("");
            setIsCreatingWrapper(false);
            fetchBuckets();
        } catch (e) {
            console.error("Failed to create bucket", e);
            alert("장바구니 생성 실패");
        } finally {
            setIsCreating(false);
        }
    };

    const handleSetBest = async () => {
        if (!selectedBucketId) return;
        setIsSettingBest(true);
        try {
            const { error } = await client.PATCH("/api/buckets/{bucketId}/select", {
                params: { path: { bucketId: selectedBucketId } }
            });
            if (error) throw error;

            fetchBuckets();
            // We stay on the current view, but 'isBest' status updates in the list
        } catch (e) {
            console.error("Failed to set best bucket", e);
            alert("대표 장바구니 설정 실패");
        } finally {
            setIsSettingBest(false);
        }
    };

    const handlePriorityChange = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === items.length - 1) return;

        const newItems = [...items];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap
        [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];

        // Reassign priority numbers based on new order
        newItems.forEach((item, idx) => {
            item.priority = idx + 1;
        });

        setItems(newItems);
        setHasChanges(true);
    };

    const handleSavePriorities = async () => {
        if (!selectedBucketId) return;

        setIsSaving(true);
        try {
            const priorityPayload = items.map(item => ({
                bucketElementId: item.bucketElementId,
                priority: item.priority
            }));

            const { error } = await client.PATCH("/api/buckets/{bucketId}/elements/priorities", {
                params: { path: { bucketId: selectedBucketId } },
                body: priorityPayload
            });

            if (error) throw error;

            setHasChanges(false);
            alert("우선순위가 저장되었습니다.");
        } catch (e) {
            console.error("Failed to save priorities", e);
            alert("우선순위 저장 실패");
        } finally {
            setIsSaving(false);
        }
    };

    const selectedBucket = buckets.find(b => b.bucketId === selectedBucketId);

    return (
        <div className="container py-10 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">장바구니 관리</h1>
                <p className="text-muted-foreground">여러 개의 수강신청 조합(장바구니)을 만들고 대표 장바구니를 설정하세요.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar: Bucket List */}
                <div className="lg:col-span-1 space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex justify-between items-center">
                                내 장바구니
                                <Button size="sm" variant="ghost" onClick={() => setIsCreatingWrapper(!isCreatingWrapper)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {isCreatingWrapper && (
                                <div className="flex gap-2 mb-4">
                                    <Input
                                        placeholder="이름"
                                        value={newBucketName}
                                        onChange={e => setNewBucketName(e.target.value)}
                                        className="h-8 text-sm"
                                        disabled={isCreating}
                                    />
                                    <Button size="sm" onClick={handleCreateBucket} disabled={isCreating}>
                                        {isCreating ? <Spinner className="h-3 w-3" /> : "확인"}
                                    </Button>
                                </div>
                            )}

                            {buckets.map(bucket => (
                                <div
                                    key={bucket.bucketId}
                                    className={`
                                        p-3 rounded-md border flex justify-between items-center cursor-pointer transition-colors
                                        ${bucket.bucketId === selectedBucketId ? 'bg-muted border-primary' : 'hover:bg-muted/50'}
                                    `}
                                    onClick={() => setSelectedBucketId(bucket.bucketId ?? null)}
                                >
                                    <div>
                                        <div className="font-medium flex items-center gap-2">
                                            {bucket.name}
                                            {bucket.isBest && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {bucket.createdAt ? new Date(bucket.createdAt).toLocaleDateString() : '-'}
                                        </div>
                                    </div>
                                    {bucket.isBest && (
                                        <Badge variant="secondary" className="text-[10px] h-5 px-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                            대표
                                        </Badge>
                                    )}
                                </div>
                            ))}
                            {loading && buckets.length === 0 && (
                                <div className="flex justify-center py-4">
                                    <Spinner className="h-4 w-4 text-muted-foreground" />
                                </div>
                            )}
                            {buckets.length === 0 && !loading && (
                                <div className="text-sm text-muted-foreground text-center py-4">
                                    장바구니가 없습니다.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Main: Items */}
                <div className="lg:col-span-3">
                    <Card className="h-full">
                        <CardHeader className="flex flex-row justify-between items-center">
                            <div>{
                                selectedBucket?.isBest ? (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="mt-2 text-yellow-700 bg-yellow-100 border-yellow-300 hover:bg-yellow-100 cursor-default"
                                    >
                                        <Star className="h-4 w-4 mr-2 fill-yellow-700" />
                                        대표 장바구니
                                    </Button>
                                ) : <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-2 text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                                    onClick={handleSetBest}
                                    disabled={isSettingBest}
                                >
                                    {isSettingBest ? <Spinner className="mr-2 h-4 w-4" /> : <Star className="h-4 w-4 mr-2" />}
                                    대표 장바구니로 설정
                                </Button>
                            }
                            </div>
                            {items.length > 0 && (
                                <Button onClick={handleSavePriorities} disabled={!hasChanges || isSaving}>
                                    {isSaving ? <Spinner className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                    {hasChanges ? "우선순위 저장" : "저장됨"}
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px] text-center">순위</TableHead>
                                            <TableHead>이수구분</TableHead>
                                            <TableHead>과목명</TableHead>
                                            <TableHead>교수 / 시간</TableHead>
                                            <TableHead>대체과목</TableHead>
                                            <TableHead className="w-[100px] text-center">조정</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                                    {selectedBucket
                                                        ? "장바구니가 비어있습니다. 과목을 담아보세요."
                                                        : "좌측에서 장바구니를 선택하세요."}
                                                    <br />
                                                    <Link href="/subjects">
                                                        <Button variant="link" className="mt-2 text-primary">
                                                            과목 목록 보러가기
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            items.map((item, index) => (
                                                <TableRow key={item.bucketElementId}>
                                                    <TableCell className="text-center font-bold text-lg">
                                                        {item.priority}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={item.majorType === "전공" ? "default" : "secondary"}>
                                                            {item.majorType}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {item.courseName}
                                                        <div className="text-xs text-muted-foreground">{item.timePlace}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.professorName}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.alternateSubjectName ? (
                                                            <div className="text-sm">
                                                                <Badge variant="outline" className="text-yellow-600 border-yellow-600 mb-1">
                                                                    Plab B
                                                                </Badge>
                                                                <br />
                                                                {item.alternateSubjectName}
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex flex-col gap-1 items-center">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-6 px-2"
                                                                onClick={() => handlePriorityChange(index, 'up')}
                                                                disabled={index === 0}
                                                            >
                                                                ▲
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-6 px-2"
                                                                onClick={() => handlePriorityChange(index, 'down')}
                                                                disabled={index === items.length - 1}
                                                            >
                                                                ▼
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    );
};

export default Cart;
