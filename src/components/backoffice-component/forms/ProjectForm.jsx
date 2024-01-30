import React, { useState } from "react";
import axios from "axios";
import explode from "assets/js/codesamples.js";
import "assets/css/codesample.css";

export default function ProjectForm() {
    const [codeSamples, setCodeSamples] = useState([]);
    const [carouselSamples, setCarouselSamples] = useState([]);
    const [codeSampleWindow, setCodeSampleWindow] = useState(false);
    const [carouselleWindow, setCarouselleWindow] = useState(false);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const data = {
            title: e.target.title.value,
            description: e.target.description.value,
            githubLink: e.target.githubLink.value,
            codeSamples: codeSamples,
            carouselImages: [],
        };
        const imageinput = e.target.image;
        const image = imageinput.files[0];
        const reader = new FileReader();
        const filereaders = [];

        reader.addEventListener("load", () => {
            data.image = reader.result;
        });
        reader.readAsDataURL(image);

        for (let i = 0; i < carouselSamples.length; i++) {
            const element = carouselSamples[i];
            filereaders.push(new FileReader());
            filereaders[i].addEventListener("load", () => {
                data.carouselImages.push({
                    img: filereaders[i].result,
                    title: carouselSamples[i].title,
                });
                if (i === carouselSamples.length - 1) {
                    axios
                        .post("http://localhost:5000/api/projects", data)
                        .then((res) => {
                            console.log(res);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            });
            filereaders[i].readAsDataURL(element.img[0]);
        }

        window.addEventListener("load", () => {
            console.log(data.carousels);
        });
    };

    const handleAddCodeSample = () => {
        setCodeSampleWindow(true);
    };

    const handleAddCarousel = () => {
        setCarouselleWindow(true);
    };

    const handleCodeSamplePreview = (index) => {
        setCodeSampleWindow(true);
    };

    const handleCarouselPreview = (index) => {
        setCarouselleWindow(true);
    };

    const handleCodeSampleClose = (e, index) => {
        e.preventDefault();
        let temp = [...codeSamples];
        temp.splice(index, 1);
        setCodeSamples(temp);
        explode();
    };

    const handleCarouselClose = (e, index) => {
        e.preventDefault();
        let temp = [...carouselSamples];
        temp.splice(index, 1);
        setCarouselSamples(temp);
        explode();
    };

    const handleCodeSampleSubmit = () => {
        let temp = [...codeSamples];
        temp.push({
            title: document.querySelector(".codeSampleTitle").value,
            code: document.querySelector(".codeSample-code").value,
        });
        setCodeSamples(temp);
        setCodeSampleWindow(false);
    };

    const handleCarouselSubmit = () => {
        let temp = [...carouselSamples];
        temp.push({
            title: document.querySelector(".carouselSampleTitle").value,
            img: document.querySelector(".image_carussel").files,
        });
        setCarouselSamples(temp);
        setCarouselleWindow(false);
        console.log(temp);
    };

    return (
        <form onSubmit={handleFormSubmit} className="project-form filldb-form">
            <h1 className="project-form__title">Project</h1>
            <br />

            <div className="input-container">
                <div className="input-flow">
                    <input
                        type="text"
                        name="title"
                        className="form__input"
                        placeholder=" "
                    />
                    <label className="form__label" htmlFor="title">
                        Title
                    </label>
                </div>
                <div className="input-flow">
                    <input
                        type="text"
                        name="githubLink"
                        className="form__input"
                        placeholder=" "
                    />
                    <label className="form__label" htmlFor="gitlink">
                        Github Link
                    </label>
                </div>
            </div>
            <br />

            <textarea
                className="description"
                type="text"
                name="description"
                placeholder="description"
            />
            <br />

            <input type="file" name="image" placeholder="image" />
            <br />

            <div className="input-container">
                <h2 className="code-samples-title">Code Samples</h2>
                <input
                    type="button"
                    className="add-code-sample"
                    value="Add Code"
                    onClick={handleAddCodeSample}
                />
            </div>
            <div
                className="code-samples h-list"
                style={
                    codeSamples.length === 0 ? { display: "none" } : { display: "flex" }
                }
            >
                {codeSamples.map((codeSample, index) => (
                    <li key={index} className="tab tabSelected">
                        <button
                            className="btn title"
                            title="View Code"
                            onClick={() => handleCodeSamplePreview(index)}
                        >
                            {codeSample.title}
                        </button>
                        <button
                            className="btn closeTab"
                            onClick={(e) => handleCodeSampleClose(e, index)}
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </div>
            <br />
            <br />

            <div className="input-container">
                <h2 className="code-samples-title">Carousels</h2>
                <input
                    type="button"
                    className="add-code-sample"
                    value="Add Carousel"
                    onClick={handleAddCarousel}
                />
            </div>
            <div
                className="code-samples h-list"
                style={
                    carouselSamples.length === 0
                        ? { display: "none" }
                        : { display: "flex" }
                }
            >
                {carouselSamples.map((carouselSample, index) => (
                    <li key={index} className="tab tabSelected">
                        <button
                            className="btn title"
                            title="View Code"
                            onClick={() => handleCarouselPreview(index)}
                        >
                            {carouselSample.title}
                        </button>
                        <button
                            className="btn closeTab"
                            onClick={(e) => handleCarouselClose(e, index)}
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </div>
            <br />
            <br />

            <input type="submit" value="Submit" />

            {codeSampleWindow && (
                <div className="code-sample-container">
                    <div className="code-sample">
                        <p onClick={() => setCodeSampleWindow(false)}>X</p>
                        <input
                            type="text"
                            className="codeSampleTitle"
                            name="codeSampleTitle"
                            placeholder="Code Sample Title"
                        />
                        <textarea
                            type="text"
                            className="codeSample-code"
                            name="codeSample"
                            placeholder="Code Sample"
                        />
                        <button onClick={handleCodeSampleSubmit}>Submit</button>
                    </div>
                </div>
            )}

            {carouselleWindow && (
                <div className="code-sample-container">
                    <div className="code-sample">
                        <p onClick={() => setCarouselleWindow(false)}>X</p>
                        <input
                            type="text"
                            className="carouselSampleTitle"
                            name="carouselSampleTitle"
                            placeholder="carousel Sample Title"
                        />

                        <input
                            type="file"
                            className="image_carussel"
                            accept="image/jpeg,image/jpg,image/png"
                            name="image"
                        />

                        <button onClick={handleCarouselSubmit}>Submit</button>
                    </div>
                </div>
            )}
        </form>
    );
}
