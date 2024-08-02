import {useEffect, useState} from "react";


export const useCanvasScroll = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    const [zoom, setZoom] = useState<number>(1);

    useEffect(() => {
        const handleScroll = (event: WheelEvent) => {
            if (canvasRef.current) {
                // get scroll direction
                if (event.deltaY > 0 && zoom > 0)
                    setZoom(zoom - .1);
                else
                    setZoom(zoom + .1);
                // canvasRef.current.style.transform = `translateY(${window.scrollY}px)`;
            }
        }
        window.addEventListener('wheel', handleScroll);
        return () => window.removeEventListener('wheel', handleScroll);
    }, [canvasRef.current, zoom]);

    useEffect(() => {
        if (zoom < 0)
            setZoom(0);
        else if (zoom > 1)
            setZoom(1);
    }, [zoom]);

    return zoom;
}