import { FaEnvelope, FaGlobe, FaLinkedin, FaGithub } from "react-icons/fa";
import Head from "next/head";

export default function ContactPage() {
  return (
    <div className="min-h-screen dark:bg-black dark:text-white">
      <Head>
        <title className="dark:text-white">Contact Me | Vishal Yadav</title>
        <meta name="description" content="Get in touch with Your Name" />
        <link
          rel="icon"
          href="https://raw.githubusercontent.com/yadavvshall/Certification/main/my.jpeg"
        />
      </Head>

      <main className="container px-4 py-16 mx-auto">
        <div className="max-w-3xl mx-auto overflow-hidden rounded-lg shadow-2xl dark:bg-black dark:text-white">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="object-cover w-full h-48 rounded-full md:w-48"
                src="https://raw.githubusercontent.com/yadavvshall/Certification/main/my.jpeg"
                alt="V"
              />
            </div>
            <div className="p-8">
              <div className="text-sm font-semibold tracking-wide text-indigo-500 uppercase">
                Let's Connect
              </div>
              <h1 className="mt-2 text-3xl font-extrabold leading-8 tracking-tight sm:text-4xl">
                Vishal Yadav
              </h1>
              <p className="max-w-2xl mt-4 text-xl ">
                I'm always excited to work on new projects and meet new people.
                Feel free to reach out!
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-center">
                  <FaEnvelope className="w-6 h-6 " />
                  <a
                    href="mailto:yadavvshall@gmail.com"
                    className="ml-3 text-lg hover:text-indigo-500"
                  >
                    yadavvshall@gmail.com
                  </a>
                </div>
                <div className="flex items-center">
                  <FaGlobe className="w-6 h-6 " />
                  <a
                    href="https://vyan.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 text-lg hover:text-indigo-500"
                  >
                    vyan.vercel.app
                  </a>
                </div>
                <div className="flex items-center">
                  <FaLinkedin className="w-6 h-6 " />
                  <a
                    href="https://www.linkedin.com/in/vshall"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 text-lg hover:text-indigo-500"
                  >
                    LinkedIn Profile
                  </a>
                </div>
                <div className="flex items-center">
                  <FaGithub className="w-6 h-6 " />
                  <a
                    href="https://github.com/yadavvshall"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 text-lg hover:text-indigo-500"
                  >
                    GitHub Profile
                  </a>
                </div>
              </div>

              <div className="mt-10">
                <a
                  href="#"
                  className="inline-block px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
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
