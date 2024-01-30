export default function ({dataSources}){
    if (!dataSources || dataSources.length === 0) return null;
    return (
        <div className="project__data-sources">
            <h2 className="project__data-sources__title">Data Sources</h2>
            <hr />
            <div className="project__data-sources__list">
                {dataSources.map((dataSource, index) => (
                    <div key={"index"} className="project__data-sources__item">
                        <div className="project__data-sources__item__image">
                            <img src={dataSources[index]} alt="excel" />
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