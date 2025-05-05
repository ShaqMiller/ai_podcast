import styles from "../styles/AudioVisualizer.module.scss"
const AudioVisualizer = ({ isOn, color }) => {
  
  if(!isOn){
    return(
      <div className={styles.container} style={{backgroundColor:color}}>
        
      </div>
    )
  }

  return(
    <div className={`${styles.container} ${styles.on}`}  style={{backgroundColor:color}}>

    </div>
  )
};  

export default AudioVisualizer;
