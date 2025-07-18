import styles from './style.module.scss';
type HeaderTitleProps = {
  title: string;
};

const HeaderTitle = ({ title }: HeaderTitleProps) => {
  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subTitle}>
          <strong>Trang chủ</strong> <span>{`> ${title}`}</span>
        </div>
      </div>
    </div>
  );
};
export default HeaderTitle;
