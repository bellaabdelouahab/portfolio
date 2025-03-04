import '../assets/css/reports.css';
import { useLoaderData } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Reports() {
    const reports = useLoaderData();
    return (
        <section>
            <div className="container1">
                <h2 className="heading-section">Reports</h2>
                <table className="table-dark table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports && reports.map((report, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{report.name}</td>
                                <td>{report.date}</td>
                                <td>{report.description}</td>
                                <td>
                                    <a className='btn-download' href={report.reportFile} download>
                                        Download
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export async function getReports() {
  const colRef = collection(db, "reports");
  const snapshot = await getDocs(colRef);
  const data = snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
  return data;
}