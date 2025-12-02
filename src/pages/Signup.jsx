import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockUsers } from '../utils/mockData';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const Signup = () => {
    const [formData, setFormData] = useState({
        id: '',
        password: '',
        name: '',
        studentId: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.id || !formData.password || !formData.name || !formData.studentId) {
            setError('모든 필드를 입력해주세요.');
            return;
        }

        // Check if ID already exists
        if (mockUsers.find(u => u.id === formData.id)) {
            setError('이미 존재하는 아이디입니다.');
            return;
        }

        // Add new user to mock data
        mockUsers.push(formData);

        alert('회원가입이 완료되었습니다. 로그인해주세요.');
        navigate('/login');
    };

    return (
        <div className="container flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-[400px]">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">회원가입</CardTitle>
                    <CardDescription className="text-center">
                        새로운 계정을 생성하세요.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="id">아이디</Label>
                            <Input
                                id="id"
                                name="id"
                                type="text"
                                value={formData.id}
                                onChange={handleChange}
                                placeholder="아이디"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">비밀번호</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="비밀번호"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">이름</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="이름"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="studentId">학번</Label>
                            <Input
                                id="studentId"
                                name="studentId"
                                type="text"
                                value={formData.studentId}
                                onChange={handleChange}
                                placeholder="학번 (예: 20230001)"
                            />
                        </div>
                        {error && <div className="text-sm text-destructive">{error}</div>}
                        <Button type="submit" className="w-full">
                            가입하기
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <div className="text-sm text-muted-foreground">
                        이미 계정이 있으신가요? <Link to="/login" className="text-primary font-bold hover:underline">로그인</Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Signup;
