import '../assets/css/reports.css'
import axios from 'axios';
import { useLoaderData } from 'react-router-dom'
export default function Reports() {
    const reports = useLoaderData();
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
                    {reports && reports.map((report,index)=>(
                    <tr key={index}>
                        <th scope="row">{index+1}</th>
                        <td>{report.title}</td>
                        <td>{report.description} hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh</td>
                        <td><a className='btn-donload' href={report.reportFile} download
                        >Download</a></td>
                    </tr>))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export async function getReports() {
    console.log("getReports");
    return await axios.get('http://localhost:5000/api/reports')
    .then(res=>{
        return res.data.data;
    }
    )
    .catch(err=>console.log(err))
}