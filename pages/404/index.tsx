import Router from "next/router";
import {useEffect} from "react";

const ButtonComponent = () => {
    useEffect(() => {
        const handleClick = () => {
            const audio = new Audio('/rickroll.mp3');
            audio.play();
        };

        const button = document.getElementById('your-button-id');
        button.addEventListener('click', handleClick);

        return () => {
            button.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <button id="your-button-id">Нажми меня</button>
    );
};

const ErrorPage = () => {
    useEffect(() => {
        // Router.push("/login");
    }, []);
    return <>
        <ButtonComponent/>
    </>;
};

export default ErrorPage;
