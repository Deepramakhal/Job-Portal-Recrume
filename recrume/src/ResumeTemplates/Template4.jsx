import React, { useRef } from 'react';

export default function Template4({resumeData}) {
  const printRef = useRef();
  const handlePrint = () => {
    const printContents = printRef.current;
    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow.document.write(`
      <html>
        <head>
          <title>Print Resume</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @media print {
              body {
                margin: 0;
              }
              .print\\:hidden {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          ${printContents.innerHTML}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  const { personal, objective, experience, education, skills, certifications, achievements, languages, projects } = resumeData;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Print Button */}
      <div className="text-right mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Print Resume
        </button>
      </div>

      {/* Resume */}
      <div
        ref={printRef}
        className="w-[210mm] min-h-[297mm] p-10 bg-white text-black mx-auto font-sans text-[0.95rem] leading-relaxed"
      >
        {/* Header */}
        <div className="border-b pb-4">
          <h1 className="text-4xl font-extrabold">{personal.fullName}</h1>
          <p className="uppercase tracking-widest">{personal.title}</p>
          <p className="mt-1 font-semibold">
            {personal.address} | {personal.phone} | {personal.email}
          </p>
          <p>
            {personal.linkedin && <span>{personal.linkedin} | </span>}
            {personal.github && <span>{personal.github} | </span>}
            {personal.portfolio}
          </p>
        </div>

        {/* Objective */}
        {objective && (
          <div className="mt-6">
            <h2 className="font-bold text-lg border-b mb-1">Objective</h2>
            <p>{objective}</p>
          </div>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <div className="mt-6">
            <h2 className="font-bold text-lg border-b mb-1">Experience</h2>
            {experience.map((exp, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between font-semibold">
                  <span>{exp.company} | {exp.jobTitle}</span>
                  <span>{exp.startDate} – {exp.endDate}</span>
                </div>
                <p className="italic text-sm">{exp.location}</p>
                <ul className="list-disc list-inside ml-4 mt-1">
                  {exp.description?.split('\n').map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <div className="mt-6">
            <h2 className="font-bold text-lg border-b mb-1">Education</h2>
            {education.map((edu, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex justify-between font-semibold">
                  <span>{edu.institution}, {edu.degree}</span>
                  <span>{edu.endDate}</span>
                </div>
                <p className="text-sm italic">{edu.location}</p>
                {edu.grade && <p>Grade: {edu.grade}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {(skills.technical?.length > 0 || skills.soft?.length > 0) && (
          <div className="mt-6">
            <h2 className="font-bold text-lg border-b mb-1">Skills & Abilities</h2>
            <ul className="list-disc list-inside ml-4">
              {[...skills.technical, ...skills.soft].map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <div className="mt-6">
            <h2 className="font-bold text-lg border-b mb-1">Projects</h2>
            {projects.map((proj, idx) => (
              <div key={idx} className="mb-2">
                <div className="font-semibold">{proj.title}</div>
                <p>{proj.description}</p>
                <p className="text-sm">Tech Stack: {proj.techStack.join(', ')}</p>
                {proj.link && <a href={proj.link} className="text-blue-600 underline">{proj.link}</a>}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <div className="mt-6">
            <h2 className="font-bold text-lg border-b mb-1">Certifications</h2>
            <ul className="list-disc list-inside ml-4">
              {certifications.map((cert, idx) => (
                <li key={idx}>{cert.name} – {cert.issuer} ({cert.date})</li>
              ))}
            </ul>
          </div>
        )}

        {/* Achievements */}
        {achievements?.length > 0 && (
          <div className="mt-6">
            <h2 className="font-bold text-lg border-b mb-1">Achievements</h2>
            <ul className="list-disc list-inside ml-4">
              {achievements.map((ach, idx) => <li key={idx}>{ach}</li>)}
            </ul>
          </div>
        )}

        {/* Languages */}
        {languages?.length > 0 && (
          <div className="mt-6">
            <h2 className="font-bold text-lg border-b mb-1">Languages</h2>
            <p>{languages.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
