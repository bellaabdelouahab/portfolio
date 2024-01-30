export default function ({dataSources}){
    return (
        <div className="project__data-sources">
            <h2 className="project__data-sources__title">Data Sources</h2>
            <hr />
            <div className="project__data-sources__list">
                {project.dataSources.map((dataSource, index) => (
                    <div key={"index"} className="project__data-sources__item">
                        <div className="project__data-sources__item__image">
                            <img src={dataSources[0]} alt="excel" />
                        </div>
                        <div className="project__data-sources__item__info">
                        <p className="project__data-sources__item__info__name">
                            {"dataSource.name"}
                        </p>
                        <p className="project__data-sources__item__info__size">142Mb</p>
                        </div>
                    </div>
                ))}
            </div>
      </div>
    )
}