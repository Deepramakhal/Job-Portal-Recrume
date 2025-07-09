import React, { useRef } from 'react';

export default function Template5({resumeData}) {
  const printRef = useRef();
  const handlePrint = () => {
    const content = printRef.current;
    const win = window.open('', '', 'width=800,height=600');
    win.document.write(`
      <html>
        <head>
          <title>Print Resume</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @media print {
              body { margin: 0; }
              .print\\:hidden { display: none; }
            }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const {
    personal,
    objective,
    experience,
    education,
    skills,
    certifications,
    achievements,
    languages,
    projects,
  } = resumeData;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Print Button */}
      <div className="text-right mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Print Resume
        </button>
      </div>

      {/* Resume Content */}
      <div
        ref={printRef}
        className="w-[210mm] min-h-[297mm] p-10 bg-white mx-auto text-[0.95rem] leading-relaxed font-sans"
      >
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-4xl font-extrabold text-red-700 uppercase">{personal.fullName}</h1>
          <p className="mt-1">{personal.address} | {personal.phone} | <span className="text-red-700 underline">{personal.email}</span></p>
        </div>

        {/* Section Renderer */}
        {objective && (
          <Section title="Objective">
            <p>{objective}</p>
          </Section>
        )}

        {experience?.length > 0 && (
          <Section title="Experience">
            {experience.map((exp, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between font-semibold">
                  <span>{exp.jobTitle}</span>
                  <span>{exp.startDate} – {exp.endDate}</span>
                </div>
                <p className="italic text-sm">{exp.company} | {exp.location}</p>
                <p>{exp.description}</p>
              </div>
            ))}
          </Section>
        )}

        {education?.length > 0 && (
          <Section title="Education">
            {education.map((edu, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex justify-between font-semibold">
                  <span>{edu.degree}</span>
                  <span>{edu.endDate}</span>
                </div>
                <p className="italic text-sm">{edu.institution} | {edu.location}</p>
                {edu.grade && <p>Grade: {edu.grade}</p>}
              </div>
            ))}
          </Section>
        )}

        {skills.soft?.length > 0 && (
          <Section title="Communication">
            <p>{skills.soft.join(', ')}</p>
          </Section>
        )}

        {achievements?.length > 0 && (
          <Section title="Leadership">
            <ul className="list-disc list-inside ml-4">
              {achievements.map((ach, idx) => (
                <li key={idx}>{ach}</li>
              ))}
            </ul>
          </Section>
        )}

        {certifications?.length > 0 && (
          <Section title="Certifications">
            <ul className="list-disc list-inside ml-4">
              {certifications.map((cert, idx) => (
                <li key={idx}>{cert.name} – {cert.issuer} ({cert.date})</li>
              ))}
            </ul>
          </Section>
        )}

        {languages?.length > 0 && (
          <Section title="Languages">
            <p>{languages.join(', ')}</p>
          </Section>
        )}

        {projects?.length > 0 && (
          <Section title="Projects">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="font-semibold">{proj.title}</div>
                <p>{proj.description}</p>
                <p className="text-sm">Tech Stack: {proj.techStack.join(', ')}</p>
                {proj.link && (
                  <a href={proj.link} className="text-red-700 underline">{proj.link}</a>
                )}
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

// Section Component
function Section({ title, children }) {
  return (
    <div className="mt-6">
      <h2 className="text-md font-bold uppercase tracking-widest text-red-700 border-b border-red-700 mb-1">
        {title}
      </h2>
      {children}
    </div>
  );
}
