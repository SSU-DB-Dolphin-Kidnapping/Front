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

interface LoginProps {
    onLogin: (user: any) => void;
}

const Login = ({ onLogin }: LoginProps) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = mockUsers.find(u => u.id === id && u.password === password);

        if (user) {
            onLogin(user);
            navigate('/');
        } else {
            setError('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
    };

    return (
        <div className="container flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-[400px]">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">로그인</CardTitle>
                    <CardDescription className="text-center">
                        수강신청 시뮬레이션에 오신 것을 환영합니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="id">아이디</Label>
                            <Input
                                id="id"
                                type="text"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                placeholder="아이디를 입력하세요"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">비밀번호</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                            />
                        </div>
                        {error && <div className="text-sm text-destructive">{error}</div>}
                        <Button type="submit" className="w-full">
                            로그인
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <div className="text-sm text-muted-foreground">
                        계정이 없으신가요? <Link to="/signup" className="text-primary font-bold hover:underline">회원가입</Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
