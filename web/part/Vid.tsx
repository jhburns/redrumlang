import * as styles from '~/web/part/Vid.module.css';

const chroma = new URL('../public/chroma.webm', import.meta.url);

export default function Vid() {
    return <video controls className={styles.vid} autoPlay>
        <source src={chroma.toString()} type="video/webm" />
    </video>
}