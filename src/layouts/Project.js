import '../assets/css/project.css'
import CodeSamples from '../components/CodeSamples';
import Carousel from '../components/Carousel';

export default function Project() {
    const code = `using System.IO.Compression;

    #pragma warning disable 414, 3021
    
    namespace MyApplication
    {
        [Obsolete("...")]
        class Program : IInterface
        {
            public static List<int> JustDoIt(int count)
            {
                Span<int> numbers = stackalloc int[length];
                Console.WriteLine($"Hello {Name}!");
                return new List<int>(new int[] { 1, 2, 3 })
            }
        }
    }namespace MyApplication
    {
        [Obsolete("...")]
        class Program : IInterface
        {
            public static List<int> JustDoIt(int count)
            {
                Span<int> numbers = stackalloc int[length];
                Console.WriteLine($"Hello {Name}!");
                return new List<int>(new int[] { 1, 2, 3 })
            }
        }
    }`;
    return (
        <>
            <section className="project-first-section">
                <div className="project-first-section__project__image"/>
                <div className="project-first-section__project__info">
                    <h1 className="project-first-section__project__info__title">Ninja Github</h1>
                    <p className="project-first-section__project__info__description">Ninja Github is a web application that allows you to search for any github user and get all the information about them and their repositories. It is built with React, React Router, React Hooks, React Context, and Github API.</p>
                </div>
            </section>
            {/* code samples */}
            <CodeSamples code={code}/>
            {/* carousel */}
            <Carousel/>
        </>
    )
}