import styles from "./ServicesSection.module.scss";

export default function ServicesSection() {
  return (
    <div className={styles.servicesSection}>
      <div className="home-sections-title">
        <span>06. </span>
        Services
        <hr />
      </div>
      <div className={styles.cards}>
        <div className={styles.card}>
          <img src="icons/AI.png" alt="" width={75} />
          <h3 className={styles.cardTitle}>AI solutions</h3>
          <p className={styles.cardText}>
            Leverage our cutting-edge AI solutions to transform your business
            operations and gain valuable insights. With our expertise spanning
            chatbots, predictive analytics, and automation, we empower you to
            stay ahead in today's data-centric environment. Harness the power of
            AI with us to unlock new opportunities and drive innovation in your
            organization.
          </p>
          <button className={styles.cardButton}>Learn More</button>
        </div>
        <div className={styles.card}>
          <img src="icons/web-dev.png" alt="" width={75} />
          <h3 className={styles.cardTitle}>Web Development</h3>
          <p className={styles.cardText}>
            Embark on your online journey with me. My website development
            services blend creativity and functionality to deliver visually
            stunning websites. I have worked on more than 100+ websites
            Specializing in both front-end and back-end development,I guarantee
            seamless performance and an intuitive user interface. Let us lay the
            groundwork for your digital success.
          </p>
          <button className={styles.cardButton}>Hire Me</button>
        </div>
        <div className={styles.card}>
          <img src="icons/online-learning.png" alt="" width={75} />
          <h3 className={styles.cardTitle}>Online Learning</h3>
          <p className={styles.cardText}>
            {/* desribe my toturing skills and convice clinet to hire me  */}I
            offer personalized online tutoring services to help you master
            programming languages and frameworks. Whether you're a beginner or
            an experienced coder, I provide tailored lessons to suit your
            learning style. With my guidance, you can enhance your skills and
            achieve your learning goals. Let's embark on a learning journey
            together.
          </p>
          <button className={styles.cardButton}>Contact Me</button>
        </div>
      </div>
    </div>
  );
}
