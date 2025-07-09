import React, { useEffect } from "react";

const Template1 = ({ resumeData }) => {
  useEffect(() => {
  const style = document.createElement("style");
  style.innerHTML = `
    @media print {
      body * {
        visibility: hidden;
      }
      #resume-section, #resume-section * {
        visibility: visible;
      }
      #resume-section {
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

  const {
    personal,
    objective,
    skills,
    experience,
    education,
    achievements,
    projects,
    activities,
  } = resumeData;

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      {/* Print Button */}
      <div className="mb-4 self-end">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 print:hidden"
        >
          Print Resume
        </button>
      </div>

      {/* A4 Resume Page */}
      <div id="resume-section"
        className="bg-white text-gray-900 px-10 py-8 w-[210mm] min-h-[297mm] shadow-md print:shadow-none print:w-[100%] print:min-h-screen"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {/* Header */}
        <header className="text-center border-b border-teal-600 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-teal-700">
            {personal.fullName}
          </h1>
          <div className="text-sm mt-1 space-y-1">
            <p>{personal.address}</p>
            <p>{personal.phone} | {personal.email}</p>
            <p>{personal.linkedin}</p>
          </div>
        </header>

        {/* Objective */}
        {objective && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-teal-600 uppercase border-b border-teal-500 mb-2">
              Objective
            </h2>
            <p className="text-sm">{objective}</p>
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-teal-600 uppercase border-b border-teal-500 mb-2">
              Education
            </h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-2">
                <p className="font-semibold text-sm">
                  {edu.degree} | {edu.institution}
                </p>
                {edu.endDate && (
                  <p className="text-sm">Degree obtained {edu.endDate}</p>
                )}
                {edu.grade && <p className="text-sm">{edu.grade}</p>}
              </div>
            ))}
            {achievements?.length > 0 && (
              <ul className="list-disc list-inside text-sm mt-2">
                {achievements.map((ach, i) => (
                  <li key={i}>{ach}</li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-teal-600 uppercase border-b border-teal-500 mb-2">
              Experience
            </h2>
            {experience.map((job, index) => (
              <div key={index} className="mb-4">
                <p className="font-semibold text-sm">
                  {job.jobTitle} | {job.company} | {job.location}
                </p>
                <p className="text-sm mb-1">
                  {job.startDate} – {job.endDate}
                </p>
                <ul className="list-disc list-inside text-sm whitespace-pre-line">
                  {job.description
                    .split("\n")
                    .filter((d) => d.trim())
                    .map((point, i) => (
                      <li key={i}>{point.trim()}</li>
                    ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-teal-600 uppercase border-b border-teal-500 mb-2">
              Skills
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Technical</p>
                <ul className="list-disc list-inside">
                  {skills.technical.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium">Soft Skills</p>
                <ul className="list-disc list-inside">
                  {skills.soft.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-teal-600 uppercase border-b border-teal-500 mb-2">
              Projects
            </h2>
            {projects.map((proj, index) => (
              <div key={index} className="mb-2">
                <p className="font-semibold text-sm">{proj.name}</p>
                <p className="text-sm">{proj.description}</p>
                {proj.technologies && (
                  <p className="text-xs text-gray-600">Tech: {proj.technologies}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Activities */}
        {activities && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-teal-600 uppercase border-b border-teal-500 mb-2">
              Activities
            </h2>
            <p className="text-sm">{activities}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default Template1;
