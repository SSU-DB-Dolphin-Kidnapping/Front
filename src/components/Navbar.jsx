import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();

    return (
        <div className="border-b bg-background h-16 flex items-center px-4 sticky top-0 z-50">
            <div className="flex items-center gap-2 font-bold text-lg">
                <span>SSU 수강신청 시뮬레이션</span>
            </div>
            <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
                <NavLink to="/" className={({ isActive }) => isActive ? "text-sm font-medium transition-colors text-primary" : "text-sm font-medium transition-colors text-muted-foreground hover:text-primary"}>
                    홈
                </NavLink>
                <NavLink to="/subjects" className={({ isActive }) => isActive ? "text-sm font-medium transition-colors text-primary" : "text-sm font-medium transition-colors text-muted-foreground hover:text-primary"}>
                    과목 조회
                </NavLink>
                <NavLink to="/cart" className={({ isActive }) => isActive ? "text-sm font-medium transition-colors text-primary" : "text-sm font-medium transition-colors text-muted-foreground hover:text-primary"}>
                    장바구니
                </NavLink>
                <NavLink to="/simulation" className={({ isActive }) => isActive ? "text-sm font-medium transition-colors text-primary" : "text-sm font-medium transition-colors text-muted-foreground hover:text-primary"}>
                    시뮬레이션 결과
                </NavLink>
                <NavLink to="/latency" className={({ isActive }) => isActive ? "text-sm font-medium transition-colors text-primary" : "text-sm font-medium transition-colors text-muted-foreground hover:text-primary"}>
                    반응속도 측정
                </NavLink>
            </nav>
            <div className="ml-auto flex items-center space-x-4">
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{user.name}</span>
                        <Button variant="outline" size="sm" onClick={onLogout}>
                            로그아웃
                        </Button>
                    </div>
                ) : (
                    <Button size="sm" onClick={() => navigate('/login')}>
                        로그인
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
