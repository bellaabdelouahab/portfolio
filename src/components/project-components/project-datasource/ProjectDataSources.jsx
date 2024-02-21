export default function ProjectDataSources({dataSources}){
    if (!dataSources || dataSources.length === 0) return null;

      const dataSourcesImg = [
        "https://img.icons8.com/color/250/000000/microsoft-excel-2019--v1.png",
        "https://img.icons8.com/color/250/000000/csv.png",
        "https://img.icons8.com/color/250/000000/json--v1.png",
        "https://img.icons8.com/color/250/000000/microsoft-sql-server.png",
        "https://img.icons8.com/color/250/000000/mysql-logo.png",
        "https://img.icons8.com/color/250/000000/mongodb.png",
        "https://img.icons8.com/color/250/000000/python.png",
        "https://img.icons8.com/color/250/000000/xml.png",
      ];

    return (
        <div className="project__data-sources">
            <h2 className="project__data-sources__title">Data Sources</h2>
            <hr />
            <div className="project__data-sources__list">
                {dataSources.map((dataSource, index) => (
                    <div key={"index"} className="project__data-sources__item">
                        <div className="project__data-sources__item__image">
                            <img src={dataSourcesImg[index]} alt="excel" />
                        </div>
                        <div className="project__data-sources__item__info">
                        <p className="project__data-sources__item__info__name">
                            {dataSource.name}
                        </p>
                        <p className="project__data-sources__item__info__size">142Mb</p>
                        </div>
                    </div>
                ))}
            </div>
      </div>
    )
}