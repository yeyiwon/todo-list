import Image from "next/image";

const Header = () => {

    const LogoClick = () => {
        window.location.href = '/';
    };

    return (
        <header className="header">
            <div className="header_inner">
                    <div onClick={LogoClick} className="logoLink">
                        <Image
                            className="hidden md:block"
                            src="/images/logoLarge.png"
                            alt="로고"
                            width={151}
                            height={40}
                        />
                        <Image
                            className="block md:hidden"
                            src="/images/logoSmall.png"
                            alt="로고"
                            width={71}
                            height={40}
                        />
                    </div>
            </div>
        </header>
    );
};

export default Header;
