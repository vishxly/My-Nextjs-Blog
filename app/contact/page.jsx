import { FaEnvelope, FaGlobe, FaLinkedin, FaGithub } from "react-icons/fa";
import Head from "next/head";

export default function ContactPage() {
  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-white">
      <Head>
        <title>Contact Me | Vishal Yadav</title>
        <meta name="description" content="Get in touch with Your Name" />
        <link
          rel="icon"
          href="https://raw.githubusercontent.com/yadavvshall/Certification/main/my.jpeg"
        />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto dark:bg-gray-900 dark:text-white rounded-lg shadow-2xl overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-48 w-full object-cover md:w-48 rounded-full"
                src="https://raw.githubusercontent.com/yadavvshall/Certification/main/my.jpeg"
                alt="V"
              />
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                Let's Connect
              </div>
              <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Vishal Yadav
              </h1>
              <p className="mt-4 max-w-2xl text-xl text-gray-500">
                I'm always excited to work on new projects and meet new people.
                Feel free to reach out!
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-center">
                  <FaEnvelope className="h-6 w-6 text-gray-400" />
                  <a
                    href="mailto:yadavvshall@gmail.com"
                    className="ml-3 text-lg text-gray-700 hover:text-indigo-500"
                  >
                    yadavvshall@gmail.com
                  </a>
                </div>
                <div className="flex items-center">
                  <FaGlobe className="h-6 w-6 text-gray-400" />
                  <a
                    href="https://vyan.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 text-lg text-gray-700 hover:text-indigo-500"
                  >
                    vyan.vercel.app
                  </a>
                </div>
                <div className="flex items-center">
                  <FaLinkedin className="h-6 w-6 text-gray-400" />
                  <a
                    href="https://www.linkedin.com/in/vshall"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 text-lg text-gray-700 hover:text-indigo-500"
                  >
                    LinkedIn Profile
                  </a>
                </div>
                <div className="flex items-center">
                  <FaGithub className="h-6 w-6 text-gray-400" />
                  <a
                    href="https://github.com/yadavvshall"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 text-lg text-gray-700 hover:text-indigo-500"
                  >
                    GitHub Profile
                  </a>
                </div>
              </div>

              <div className="mt-10">
                <a
                  href="#"
                  className="inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Send a Message
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
