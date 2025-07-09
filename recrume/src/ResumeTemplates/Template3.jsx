import React, { useRef, useEffect } from "react";

function Template3({ resumeData }) {
  const resumeRef = useRef();
  const { personal, objective, skills, experience, education, activities, projects } = resumeData;

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #resume-print, #resume-print * {
          visibility: visible;
        }
        #resume-print {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-3xl mx-auto mb-4 text-right">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 print:hidden"
        >
          Print to PDF
        </button>
      </div>

      <div
        id="resume-print"
        ref={resumeRef}
        className="bg-white text-black font-sans mx-auto px-10 py-12 shadow-md"
        style={{ width: "210mm", minHeight: "297mm", margin: "auto" }}
      >
        {/* Name & Contact */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold uppercase">{personal.fullName}</h1>
          <p className="mt-1 font-semibold">{personal.address} | {personal.phone} | {personal.email}</p>
          {(personal.linkedin || personal.portfolio) && (
            <p className="text-sm text-gray-700">
              {personal.linkedin && <span>LinkedIn: {personal.linkedin} </span>}
              {personal.portfolio && <span> | Portfolio: {personal.portfolio}</span>}
            </p>
          )}
        </div>

        {/* Objective */}
        {objective && (
          <section className="mb-6">
            <h2 className="font-bold uppercase text-sm border-b-2 border-black mb-2">Objective</h2>
            <p className="text-sm">{objective}</p>
          </section>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <section className="mb-6">
            <h2 className="font-bold uppercase text-sm border-b-2 border-black mb-2">Experience</h2>
            {experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between text-sm font-semibold">
                  <p>{exp.company} | {exp.jobTitle}</p>
                  <p>{exp.startDate} – {exp.endDate}</p>
                </div>
                <ul className="list-disc list-inside ml-4 text-sm text-gray-800 whitespace-pre-line">
                  {exp.description?.split("\n").filter(Boolean).map((line, i) => (
                    <li key={i}>{line.trim()}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <section className="mb-6">
            <h2 className="font-bold uppercase text-sm border-b-2 border-black mb-2">Projects</h2>
            {projects.map((project, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between text-sm font-semibold">
                  <p>{project.title}</p>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline text-sm"
                    >
                      {project.link}
                    </a>
                  )}
                </div>
                <p className="text-sm ml-1">{project.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <section className="mb-6">
            <h2 className="font-bold uppercase text-sm border-b-2 border-black mb-2">Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-2 text-sm">
                <div className="flex justify-between font-semibold">
                  <p>{edu.institution} | {edu.degree}</p>
                  <p>{edu.endDate}</p>
                </div>
                {edu.grade && <p className="text-sm text-gray-800">Grade: {edu.grade}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {(skills.technical.length > 0 || skills.soft.length > 0) && (
          <section className="mb-6">
            <h2 className="font-bold uppercase text-sm border-b-2 border-black mb-2">Skills & Abilities</h2>
            {skills.technical.length > 0 && (
              <div className="mb-2">
                <h3 className="font-semibold text-sm mb-1">Technical Skills:</h3>
                <ul className="list-disc list-inside text-sm ml-4">
                  {skills.technical.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
            {skills.soft.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-1">Soft Skills:</h3>
                <ul className="list-disc list-inside text-sm ml-4">
                  {skills.soft.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Activities */}
        {activities && (
          <section className="mb-6">
            <h2 className="font-bold uppercase text-sm border-b-2 border-black mb-2">Activities</h2>
            <p className="text-sm">{activities}</p>
          </section>
        )}
      </div>
    </div>
  );
}

export default Template3;
