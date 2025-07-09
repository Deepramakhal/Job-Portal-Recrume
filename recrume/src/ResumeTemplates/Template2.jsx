import React from "react";

function Template2({ resumeData }) {
  const { personal, objective, skills, experience, education, projects, activities } = resumeData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white font-sans text-gray-800 print:p-0 print:mt-0">
      {/* Print Button */}
      <div className="mb-4 flex justify-end print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Print Resume
        </button>
      </div>

      {/* Header */}
      <div className="text-left mb-8">
        <h1 className="text-5xl font-bold uppercase leading-none">
          <span className="block">{personal?.fullName?.split(" ")[0]}</span>
          <span className="block text-blue-900">{personal?.fullName?.split(" ")[1]}</span>
        </h1>
        <div className="mt-4 text-sm text-gray-600">
          {personal?.address && <p>{personal.address}</p>}
          {(personal?.phone || personal?.email) && (
            <p>
              {personal.phone && <span>{personal.phone}</span>}
              {personal.email && <span> | {personal.email}</span>}
            </p>
          )}
          {(personal?.linkedin || personal?.website) && (
            <p>
              {personal.linkedin && (
                <a href={personal.linkedin} className="text-blue-600 underline mr-2">LinkedIn</a>
              )}
              {personal.website && (
                <a href={personal.website} className="text-blue-600 underline">Website</a>
              )}
            </p>
          )}
        </div>
      </div>

      {/* About Me */}
      {objective && (
        <section className="mb-6">
          <h2 className="text-xl font-bold uppercase border-b-2 border-blue-200 inline-block mb-1">
            About Me
          </h2>
          <p className="text-sm mt-2 text-gray-700">{objective}</p>
        </section>
      )}

      {/* Experience and Education */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Experience */}
        {experience?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold uppercase border-b-2 border-blue-200 inline-block mb-1">
              Experience
            </h2>
            {experience.map((exp, index) => (
              <div key={index} className="mt-4">
                <p className="font-semibold text-sm uppercase">
                  {exp.jobTitle} / <span className="text-blue-900">{exp.company}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {exp.startDate} – {exp.endDate}
                </p>
                <p className="text-sm mt-1 text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold uppercase border-b-2 border-blue-200 inline-block mb-1">
              Education
            </h2>
            {education.map((edu, index) => (
              <div key={index} className="mt-4">
                <p className="font-semibold text-sm uppercase">
                  {edu.degree} / <span className="text-blue-900">{edu.institution}</span>
                </p>
                <p className="text-xs text-gray-500">{edu.endDate}</p>
                <p className="text-sm text-gray-700">{edu.grade}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills */}
      {(skills?.technical?.length || skills?.soft?.length) > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold uppercase border-b-2 border-blue-200 inline-block mb-1">
            Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-sm">
            {[...(skills.technical || []), ...(skills.soft || [])].map((skill, idx) => (
              <li key={idx} className="list-disc list-inside text-gray-700">
                {skill}
              </li>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold uppercase border-b-2 border-blue-200 inline-block mb-1">
            Projects
          </h2>
          {projects.map((proj, idx) => (
            <div key={idx} className="mt-4">
              <p className="font-semibold text-sm uppercase">{proj.name}</p>
              <p className="text-sm text-gray-700">{proj.description}</p>
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
          <h2 className="text-xl font-bold uppercase border-b-2 border-blue-200 inline-block mb-1">
            Activities
          </h2>
          <p className="text-sm mt-2 text-gray-700">{activities}</p>
        </section>
      )}
    </div>
  );
}

export default Template2;
