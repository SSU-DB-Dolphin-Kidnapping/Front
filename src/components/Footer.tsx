const Footer = () => {
    return (
        <footer className="border-t bg-background py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    데이터베이스응용 Team 돌고래유괴단
                </p>
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © 2024 University Course Registration Simulation
                </p>
            </div>
        </footer>
    );
};

export default Footer;
