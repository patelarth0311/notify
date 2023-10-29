import { useEffect } from "react";
import {useRef} from "react"
import { useState } from "react";

const useCover = () => {
    const ref = useRef<HTMLImageElement>(null)
    const [height, setHeight] = useState(0)

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.naturalHeight)
        }
        
    },[])


    return {ref, height}
}

export default useCover;