"use client"
import { useEffect,useState } from "react";
import styles from "../styles/microphoneContent.module.scss"
import Image from "next/image"


const microphoneAvatars = [
    {angleOffset:0,radius:130,ratio:1,fromCenter:250},
    {angleOffset:Math.PI/2,radius:160,ratio:1,fromCenter:250},
    {angleOffset:Math.PI,radius:140,ratio:1,fromCenter:250},
    {angleOffset:3*Math.PI/2,radius:120,ratio:1,fromCenter:250},

    {angleOffset:Math.PI/6,radius:80,ratio:0.7,fromCenter:200},
    {angleOffset:5*Math.PI/6,radius:90,ratio:0.3,fromCenter:200},
    {angleOffset:4*Math.PI/3,radius:90,ratio:0.7,fromCenter:200},
    {angleOffset:11*Math.PI/6,radius:180,ratio:0.4,fromCenter:200},
]

export default function MicrophoneContent(){

    const [angle,setAngle] = useState(0)
    const [shouldIncrementAngle,setShouldIncrementAngle] = useState(true)

    useEffect(() => {
        const speed = 0.001; // Speed of the animation

        const animate = () => {
            setAngle(oldAngle=>{
                return oldAngle+speed;
            })
            requestAnimationFrame(animate);
        };

        animate();
    }, []);
    


    return(
        <div className={styles.container}>
            <div className={styles.microphoneContainer}>
                <div className={styles.microphoneContent}>
                    <Image  
                        className={styles.microphoneImage} 
                        height={1000} 
                        width={1000} 
                        alt="microphone"
                        src={"/image/microphone.gif"}
                        unoptimized
                    />

                    <div className={styles.avatarContainers}>
                        <div className={styles.avatarContent}>
                            {microphoneAvatars.map((data,i)=>{
                                let distFromCenter = data.fromCenter;
                                let rightVal = Math.cos((angle*data.ratio) + (data.angleOffset))
                                let topVal = Math.sin((angle*data.ratio) +(data.angleOffset))
                                                            
                                const roundedRight = Math.round(rightVal * 100) / 100; // Round to 2 decimal places
                                const roundedTop = Math.round(topVal * 100) / 100; // Round to 2 decimal places
                                return(
                                    <div 
                                        className={styles.avatarImageContainer} 
                                        key={`head_${i}`} 
                                        style={{left:0 + (rightVal*distFromCenter),top:0-(topVal*distFromCenter),}}
                                    >
                                        <Image alt={`avatar_${i+1}`} className={styles.avatarImage} style={{height:data.radius,width:data.radius}} height={700} width={700} src={`/image/avatar${i+1}.jpg`}/>
                                    </div>
                                )
                            })}
                        </div>
                        
                    </div>
                </div>
            </div>
            

            <div className={styles.introContainer}>
                <div className={styles.introText}>Transform Listening Into Learning</div>
                <div className={styles.introText}>Insights that <span className={styles.highlight}>EMPOWER</span> Change.</div>
            </div>

            
        </div>
    )
}