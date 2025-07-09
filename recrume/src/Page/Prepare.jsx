/* eslint-disable */
import React, { useState } from 'react';

const youtubeCourses = [
  {
    title: "React JS course with project",
    iframe: `<iframe width="100%" height="315" src="https://www.youtube.com/embed/FxgM9k1rg0Q" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
  },
  {
    title: "Frontend Development Full Course",
    iframe: `<iframe width="100%" height="315" src="https://www.youtube.com/embed/zJSY8tbf_ys" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
  },
  {
    'title':"Tally Prime course",
    'iframe':'<iframe width="100%" height="315" src="https://www.youtube.com/embed/hkS0IeBkpQc?si=IpeBgXOH5wJ0-bZ2" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
  },
  {
    'title':"Project Management",
    'iframe':'<iframe width="100%" height="315" src="https://www.youtube.com/embed/uWPIsaYpY7U?si=PoqWzlRyShr8IvFr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
  }
];

const thirdPartyCourses = [
  { title: "Java Bootcamp", link: "https://www.udemy.com/topic/java/?utm_source=adwords&utm_medium=udemyads&utm_campaign=Brand-Topic_la.EN_cc.India&campaigntype=Search&portfolio=BrandTopic&language=EN&product=Course&test=&audience=Keyword&topic=&priority=&utm_content=deal4584&utm_term=_._ag_139989572150_._ad_595460368980_._kw_udemy%20java%20course_._de_c_._dm__._pl__._ti_kwd-314136593715_._li_9301836_._pd__._&matchtype=b&gad_source=1&gad_campaignid=17099057894&gbraid=0AAAAADROdO27qCEl0TgEaViMlbfZZS9GD&gclid=CjwKCAjwpMTCBhA-EiwA_-MsmUeucgbGZ5Y4vvc_WWgjKkKC8w0akMrb1IbCrd4fM4k16cH38ggWGBoCIXgQAvD_BwE" },
  { title: "Java DSA Course", link: "https://example.com/java-dsa" },
  { title: "System Design Basics", link: "https://example.com/system-design" },
];

function Prepare() {
  const [showYoutube, setShowYoutube] = useState(false);
  const [showCoursesPopup, setShowCoursesPopup] = useState(false);
  const [search, setSearch] = useState("");
  const [showInterviewFAQ, setShowInterviewFAQ] = useState(false);
  const openExternal = (url) => {
    window.open(url, "_blank");
  };

  const filteredVideos = youtubeCourses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Prepare for Your Interview</h1>

      {/* Dashboard Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <button
            onClick={() => setShowYoutube(!showYoutube)}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
        >
            YouTube Courses
        </button>
        <button
            onClick={() => setShowCoursesPopup(true)}
            className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700"
        >
            Courses
        </button>
        <button
            onClick={() =>
            openExternal("https://www.indiabix.com/logical-reasoning/questions-and-answers/")
            }
            className="bg-yellow-500 text-black py-3 px-4 rounded-lg hover:bg-yellow-600"
        >
            Logical Reasoning
        </button>
        <button
            onClick={() =>
            openExternal("https://www.indiabix.com/verbal-ability/questions-and-answers/")
            }
            className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700"
        >
            Verbal Ability
        </button>
        <button
            onClick={() =>
            openExternal("https://www.indiabix.com/aptitude/numbers/")
            }
            className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700"
        >
            Numerical
        </button>
        <button
            onClick={() => setShowInterviewFAQ(true)}
            className="bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900"
        >
            Interview FAQ
        </button>
        </div>
      {/* YouTube Video Section */}
      {showYoutube && (
        <div className="mt-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search videos..."
            className="w-full border px-4 py-2 rounded-lg mb-4"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredVideos.map((course, index) => (
              <div key={index}>
                <h2 className="text-lg font-semibold mb-2">{course.title}</h2>
                <div dangerouslySetInnerHTML={{ __html: course.iframe }} />
              </div>
            ))}
            {filteredVideos.length === 0 && (
              <p className="text-gray-500 col-span-2">No videos found.</p>
            )}
          </div>
        </div>
      )}

      {/* Courses Popup */}
      {showCoursesPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg">
            <h2 className="text-xl font-bold mb-4">Available Courses</h2>
            <ul className="space-y-3">
              {thirdPartyCourses.map((course, index) => (
                <li key={index}>
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {course.title}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-right">
              <button onClick={() => setShowCoursesPopup(false)} className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showInterviewFAQ && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Common Interview Questions</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-800">
        <li>
          <strong>1. Tell me about yourself.</strong><br />
          <em>Answer:</em> "I'm a Computer Science graduate with a passion for software development. I've worked on several personal and academic projects using Java and Spring Boot, and I’m always eager to learn new technologies. I enjoy solving problems and collaborating with teams to build efficient solutions."
        </li>
        <li>
          <strong>2. What are your strengths?</strong><br />
          <em>Answer:</em> "I am a quick learner, highly organized, and I enjoy breaking down complex problems into manageable parts. I also communicate effectively and adapt well to new challenges."
        </li>
        {/* Add more Q&A as needed */}
      </ul>
      <button
        onClick={() => setShowInterviewFAQ(false)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
}

export default Prepare;
