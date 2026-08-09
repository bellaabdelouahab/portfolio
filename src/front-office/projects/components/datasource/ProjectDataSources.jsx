export default function ProjectDataSources({ dataSources }) {
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
    <div className="relative z-[1] w-full bg-[#1a1c1f] py-[3vh]">
      {/* tracking needs ! — global.css sets an unlayered h1..h5 letter-spacing:1px
          that outranks the utilities layer. */}
      <h2 className="ml-[6vw] text-base font-bold tracking-[-0.01em]! text-ink-strong md:text-lg">
        Data Sources
      </h2>
      <hr className="mx-auto mt-4 mb-5 w-[88%] max-w-[1400px] border-0 border-t border-[#2db811]/20" />
      <div className="mx-auto mb-10 flex w-full max-w-[1500px] flex-wrap justify-center gap-4 px-[6vw] md:justify-start">
        {dataSources.map((dataSource, index) => (
          <div
            key={index}
            className="flex h-[170px] w-full max-w-[320px] flex-col items-center justify-between rounded-lg border border-[#2db811]/20 bg-[#212429] p-3 transition-[transform,border-color,box-shadow] duration-200 ease-standard hover:-translate-y-1.5 hover:border-[#2db811] hover:shadow-[0_12px_30px_rgba(45,184,17,0.15)] md:w-[170px]"
          >
            <div className="flex w-3/4 flex-1 items-center justify-center p-1">
              <img
                src={dataSourcesImg[dataSource.type]}
                alt={dataSource.type || "data source"}
                className="w-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
              />
            </div>
            <div className="mt-2.5 flex w-full flex-row items-center justify-between border-t border-[#2db811]/20 pt-2">
              {/* min-w-0 so `truncate` can actually shrink this flex item; the
                  old rule set the ellipsis properties but the item never
                  shrank below its content. */}
              <p className="min-w-0 truncate text-xs leading-normal font-medium text-ink-strong">
                {dataSource.name}
              </p>
              <p className="w-max text-xs leading-normal font-normal text-ink-muted">
                {dataSource.size}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
