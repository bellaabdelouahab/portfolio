import './ArticlesPage.css'
import SEO from "../../shared/ui/SEO";

export default function Articles() {
    return (
      <>
      <SEO
        title="Articles"
        description="Technical articles and research write-ups by Abdelouahab Bella on machine learning, reinforcement learning, and software engineering."
        keywords="Abdelouahab Bella articles, machine learning research, deep reinforcement learning, technical writing"
      />
      <div className="articles">
        <div className="article">
          <h2 className="article-nbr">#1</h2>
          <h1 className="title">
            Self Driving Car Using Double Deep Q-learning Network
          </h1>
          <p className="abstract">
            {" "}
            <span>Abstract </span>
            this is an abstract that is a summary of the article which will be
            displayed on the home page,this is an abstract that is a this is an
            abstract that is a summary of the article which will be displayed on
            the home page,this is an abstract that is a this is an abstract that
            is a summary of the article which will be displayed on the home
            page,this is an abstract that is athis is an abstract that is a
            summary of the article which will be displayed on the home page,this
            is an abstract that is a this is an abstract that is a summary of
            the article which will be displayed on the home page,this is an
            abstract that is a
          </p>
          <div className="article-footer">
            <button className="download"></button>
            <button className="newtab"></button>
          </div>
        </div>
      </div>
      </>
    );
}