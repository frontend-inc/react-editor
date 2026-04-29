import styles from "./styles.module.css";

export const LoadingDots = () => (
  <div className={styles["AiPanel-dots"]} aria-label="Loading">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className={styles["AiPanel-dots-dot"]}
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);
