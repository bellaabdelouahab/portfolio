import '../assets/css/reports.css'
export default function Reports() {
    return (
        
	<section >
        <div className="container1">
                <h2 className="heading-section">Reports</h2>
                <table className="table-dark table-hover">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Descreption & Colaborators</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td><button className='btn-donload'>Download</button></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </section>
    )
}