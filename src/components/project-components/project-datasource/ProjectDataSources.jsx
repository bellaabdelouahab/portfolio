export default function ProjectDataSources({dataSources}){
    if (!dataSources || dataSources.length === 0) return null;

      const dataSourcesImg = {
        excel: "https://img.icons8.com/color/250/000000/microsoft-excel-2019--v1.png",
        csv: "https://img.icons8.com/color/250/000000/csv.png",
        json: "https://img.icons8.com/color/250/000000/json--v1.png",
        "sql-server": "https://img.icons8.com/color/250/000000/microsoft-sql-server.png",
        mysql: "https://img.icons8.com/color/250/000000/mysql-logo.png",
        mongodb: "https://img.icons8.com/color/250/000000/mongodb.png",
        python: "https://img.icons8.com/color/250/000000/python.png",
        xml: "https://img.icons8.com/color/250/000000/xml.png",
      };

    return (
      <div className="project__data-sources">
        <h2 className="project__data-sources__title">Data Sources</h2>
        <hr />
        <div className="project__data-sources__list">
          {dataSources.map((dataSource, index) => (
            <div key={"index"} className="project__data-sources__item">
              <div className="project__data-sources__item__image">
                <img src={dataSourcesImg[dataSource.type]} alt="excel" />
              </div>
              <div className="project__data-sources__item__info">
                <p className="project__data-sources__item__info__name">
                  {dataSource.name}
                </p>
                <p className="project__data-sources__item__info__size">{dataSource.size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}