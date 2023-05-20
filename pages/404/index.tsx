import { useEffect } from 'react';
import Button from '@material-ui/core/Button';

const ButtonComponent = () => {
    useEffect(() => {
        const handleClick = () => {
            const audio = new Audio('/rickroll.mp3');
            const audio2 = new Audio('/rickroll.mp3');
            const audio3 = new Audio('/rickroll.mp3');
            const audio4 = new Audio('/rickroll.mp3');

            audio.play();

            setTimeout(()=>{
                audio2.play();
            },50)

            setTimeout(()=>{
                audio3.play();
            },100)
            setTimeout(()=>{
                audio4.play();
            },150)







        };

        const button = document.getElementById('your-button-id');
        if (button) {
            button.addEventListener('click', handleClick);
        }

        return () => {
            if (button) {
                button.removeEventListener('click', handleClick);
            }
        };
    }, []);

    return (
        <Button id="your-button-id" variant="contained" color="primary">
            Нажми меня
        </Button>
    );
};

const ErrorPage = () => {
    useEffect(() => {
        // Router.push("/login");
    }, []);

    return <ButtonComponent />;
};

export default ErrorPage;
